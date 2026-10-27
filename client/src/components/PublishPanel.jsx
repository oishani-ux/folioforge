// Publish / unpublish the portfolio and share its public link.
import { useEffect, useState } from 'react'
import Modal from './Modal'
import { useAuth } from '../store/useAuth'

export default function PublishPanel({ onClose }) {
  const { user, published, views, publish, unpublish, refreshStats } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const link = `${window.location.origin}/u/${user.username}`

  useEffect(() => {
    refreshStats()
  }, [refreshStats])

  async function run(action) {
    setBusy(true)
    setError('')
    try {
      await action()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setError('Could not copy. Select the link and copy it manually.')
    }
  }

  return (
    <Modal title="Publish your portfolio" onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-sm">
          <span className={`h-2.5 w-2.5 rounded-full ${published ? 'bg-green-500' : 'bg-zinc-600'}`} />
          {published ? 'Live: anyone with the link can see it' : 'Not published yet'}
        </div>

        {published ? (
          <>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 p-2">
              <input readOnly value={link} onFocus={(e) => e.target.select()} className="min-w-0 flex-1 bg-transparent px-1 font-mono text-sm text-orange-300 outline-none" />
              <button onClick={copy} className="rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-semibold hover:bg-zinc-700">{copied ? 'Copied ✓' : 'Copy'}</button>
              <a href={link} target="_blank" rel="noopener" className="rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-semibold hover:bg-zinc-700">Open ↗</a>
            </div>
            <div className="rounded-lg bg-zinc-900 p-4">
              <div className="text-xs text-zinc-500">Total views</div>
              <div className="text-3xl font-bold">{views}</div>
            </div>
            <p className="text-xs text-zinc-500">Your edits are saved automatically and appear on the live page.</p>
            <button disabled={busy} onClick={() => run(unpublish)} className="w-full rounded-lg border border-zinc-700 py-2 text-sm text-zinc-300 hover:border-red-500 hover:text-red-400 disabled:opacity-60">
              {busy ? 'Working…' : 'Unpublish'}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-zinc-400">
              Your portfolio will be live at <span className="font-mono text-orange-300">/u/{user.username}</span>, with search and social-share tags added
              automatically.
            </p>
            <button disabled={busy} onClick={() => run(publish)} className="w-full rounded-lg bg-orange-500 py-2.5 font-semibold text-black hover:bg-orange-400 disabled:opacity-60">
              {busy ? 'Publishing…' : 'Publish now'}
            </button>
          </>
        )}
        {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
      </div>
    </Modal>
  )
}
