// Right side of the top bar: save status, Publish, username + Log out (or "Log in" for guests).
import { useState } from 'react'
import { useAuth } from '../store/useAuth'
import PublishPanel from './PublishPanel'

function SaveStatus() {
  const { saveState, saveError, save } = useAuth()
  if (saveState === 'idle') return null
  const text = { pending: 'Unsaved changes', saving: 'Saving…', saved: 'Saved ✓', error: "Couldn't save" }[saveState]
  const color = saveState === 'error' ? 'text-red-400' : saveState === 'saved' ? 'text-green-400' : 'text-zinc-400'
  return (
    <span className={`text-xs ${color}`} title={saveError}>
      {text}
      {saveState === 'error' && (
        <button onClick={() => save().catch(() => {})} className="ml-1 underline">Retry</button>
      )}
    </span>
  )
}

export default function AccountMenu({ onAuth }) {
  const { user, status, published, logout } = useAuth()
  const [menu, setMenu] = useState(false)
  const [publishing, setPublishing] = useState(false)

  if (status === 'loading') return <span className="text-xs text-zinc-500">…</span>
  if (status !== 'authed')
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-zinc-500 xl:inline">Saved on this device</span>
        <button onClick={() => onAuth('login')} className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm font-semibold hover:border-white">Log in</button>
        <button onClick={() => onAuth('signup')} className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-black hover:bg-zinc-200">Sign up</button>
      </div>
    )

  return (
    <div className="flex items-center gap-3">
      <SaveStatus />
      <button onClick={() => setPublishing(true)} className="rounded-lg bg-green-500 px-3 py-1.5 text-sm font-semibold text-black hover:bg-green-400">
        {published ? 'Live ●' : 'Publish'}
      </button>
      <div className="relative">
        <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-zinc-800" aria-haspopup="menu">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-black">{user.username[0].toUpperCase()}</span>
          <span className="hidden text-sm sm:inline">{user.username}</span>
        </button>
        {menu && (
          <div role="menu" className="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-zinc-800 bg-zinc-950 p-1 shadow-xl">
            <div className="px-3 py-2 text-xs text-zinc-500">{user.email}</div>
            <button role="menuitem" onClick={() => { setMenu(false); logout() }} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-zinc-800">
              Log out
            </button>
          </div>
        )}
      </div>
      {publishing && <PublishPanel onClose={() => setPublishing(false)} />}
    </div>
  )
}
