// When logged in, save to the server ~1 second after the user stops typing.
// (When logged out, the store still saves to localStorage on its own.)
import { useEffect } from 'react'
import { usePortfolio } from '../store/usePortfolio'
import { useAuth } from '../store/useAuth'

export function useCloudAutosave(delay = 1000) {
  useEffect(() => {
    let timer
    const unsubscribe = usePortfolio.subscribe((state, prev) => {
      if (state.data === prev.data && state.theme === prev.theme) return
      const auth = useAuth.getState()
      if (auth.status !== 'authed' || auth.hydrating) return
      useAuth.setState({ saveState: 'pending' })
      clearTimeout(timer)
      timer = setTimeout(() => useAuth.getState().save().catch(() => {}), delay)
    })
    return () => {
      unsubscribe()
      clearTimeout(timer)
    }
  }, [delay])
}
