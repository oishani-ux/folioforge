// Login state + everything that talks to the backend about the user's portfolio.
import { create } from 'zustand'
import { api } from '../lib/api'
import { usePortfolio } from './usePortfolio'

export const useAuth = create((set, get) => ({
  user: null, // { id, username, email }
  status: 'loading', // 'loading' | 'guest' | 'authed'
  saveState: 'idle', // 'idle' | 'pending' | 'saving' | 'saved' | 'error'
  saveError: '',
  published: false,
  views: 0,
  hydrating: false, // true while we copy server data into the store (so autosave ignores it)

  // On app load: am I logged in? If yes, load my saved portfolio.
  async init() {
    try {
      const { user } = await api('/auth/me')
      set({ user, status: 'authed' })
      await get().loadPortfolio()
    } catch {
      set({ user: null, status: 'guest' })
    }
  },

  async loadPortfolio() {
    const { portfolio } = await api('/portfolio')
    if (portfolio) {
      set({ hydrating: true })
      usePortfolio.getState().loadFromServer(portfolio)
      set({ hydrating: false, published: !!portfolio.published, views: portfolio.views || 0, saveState: 'saved' })
    } else {
      // First time this account logs in: upload the draft they already made as a guest.
      await get().save().catch(() => {})
    }
  },

  async login(email, password) {
    const { user } = await api('/auth/login', { method: 'POST', body: { email, password } })
    set({ user, status: 'authed' })
    await get().loadPortfolio()
  },

  async signup(username, email, password) {
    const { user } = await api('/auth/signup', { method: 'POST', body: { username, email, password } })
    set({ user, status: 'authed' })
    await get().loadPortfolio()
  },

  async logout() {
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    // Mark as logged out FIRST, so clearing the form below is never autosaved to the account.
    set({ user: null, status: 'guest', saveState: 'idle', saveError: '', published: false, views: 0 })
    usePortfolio.getState().clearAll() // don't leave their data on a shared computer
  },

  async save() {
    if (get().status !== 'authed') return // logged out: nothing to save on the server
    const { data, theme } = usePortfolio.getState()
    set({ saveState: 'saving', saveError: '' })
    try {
      const res = await api('/portfolio', { method: 'PUT', body: { data, theme } })
      set({ saveState: 'saved', published: !!res.published })
    } catch (err) {
      set({ saveState: 'error', saveError: err.message })
      if (err.status === 401) set({ user: null, status: 'guest' }) // session expired
      throw err
    }
  },

  // Save first, so the public page shows the latest version.
  async publish() {
    await get().save()
    const res = await api('/portfolio/publish', { method: 'POST' })
    set({ published: res.published })
    await get().refreshStats()
    return res.url
  },

  async unpublish() {
    const res = await api('/portfolio/unpublish', { method: 'POST' })
    set({ published: res.published })
  },

  async refreshStats() {
    try {
      const { portfolio } = await api('/portfolio')
      if (portfolio) set({ views: portfolio.views || 0, published: !!portfolio.published })
    } catch {
      /* not important */
    }
  },
}))
