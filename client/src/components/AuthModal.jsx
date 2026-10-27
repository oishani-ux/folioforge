// Log in / Sign up popup. Shows the server's error message if something goes wrong.
import { useState } from 'react'
import Modal from './Modal'
import { useAuth } from '../store/useAuth'
import { inputCls } from './Editor'

const USERNAME = /^[a-z0-9_-]{3,20}$/

export default function AuthModal({ mode, onClose, onSwitch, onSuccess }) {
  const { login, signup } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isSignup = mode === 'signup'
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  // Quick checks before calling the server (the server checks again).
  function check() {
    if (isSignup && !USERNAME.test(form.username.trim().toLowerCase()))
      return 'Username must be 3-20 characters: letters, numbers, - or _'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return 'Enter a valid email address'
    if (isSignup && form.password.length < 8) return 'Password must be at least 8 characters'
    if (!form.password) return 'Enter your password'
    return ''
  }

  async function submit(e) {
    e.preventDefault()
    const problem = check()
    if (problem) return setError(problem)
    setLoading(true)
    setError('')
    try {
      if (isSignup) await signup(form.username.trim().toLowerCase(), form.email.trim(), form.password)
      else await login(form.email.trim(), form.password)
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={isSignup ? 'Create your account' : 'Welcome back'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        {isSignup && (
          <label className="block space-y-1">
            <span className="text-xs font-medium text-zinc-400">Username</span>
            <input className={inputCls} value={form.username} onChange={set('username')} placeholder="riya" autoComplete="username" maxLength={20} />
            <span className="block text-xs text-zinc-500">
              Your page will be at <span className="text-orange-400">/u/{form.username.trim().toLowerCase() || 'username'}</span>
            </span>
          </label>
        )}
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-400">Email</span>
          <input className={inputCls} type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" autoComplete="email" />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-zinc-400">Password</span>
          <div className="relative">
            <input
              className={inputCls + ' pr-16'}
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              placeholder={isSignup ? 'At least 8 characters' : '••••••••'}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              maxLength={72}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute top-1/2 right-2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white">
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

        <button disabled={loading} className="w-full rounded-lg bg-orange-500 py-2.5 font-semibold text-black hover:bg-orange-400 disabled:opacity-60">
          {loading ? (isSignup ? 'Creating account…' : 'Logging in…') : isSignup ? 'Sign up' : 'Log in'}
        </button>

        <p className="text-center text-sm text-zinc-400">
          {isSignup ? 'Already have an account? ' : 'New to FolioForge? '}
          <button type="button" onClick={() => { setError(''); onSwitch(isSignup ? 'login' : 'signup') }} className="font-semibold text-orange-400 hover:underline">
            {isSignup ? 'Log in' : 'Create an account'}
          </button>
        </p>
      </form>
    </Modal>
  )
}
