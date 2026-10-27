// "Import from GitHub": type a username, pick repos, add them as projects.
import { useState } from 'react'
import { usePortfolio, LIMITS } from '../store/usePortfolio'
import { api } from '../lib/api'
import { inputCls } from './Editor'

// If the user already typed their GitHub URL in Links, pre-fill the username from it.
const userFromUrl = (url = '') => url.match(/github\.com\/([A-Za-z0-9-]+)/i)?.[1] || ''

export default function GitHubImport() {
  const { data, addProjects } = usePortfolio()
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState(() => userFromUrl(data.socials?.github))
  const [repos, setRepos] = useState(null)
  const [picked, setPicked] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const existing = new Set(data.projects.flatMap((p) => [p.id, p.link]))
  const room = LIMITS.projects - data.projects.filter((p) => p.title || p.description || p.link).length

  async function fetchRepos(e) {
    e.preventDefault()
    if (!username.trim()) return setError('Enter a GitHub username')
    setLoading(true)
    setError('')
    setRepos(null)
    try {
      const { projects } = await api(`/github/${encodeURIComponent(username.trim())}`)
      setRepos(projects)
      setPicked(new Set(projects.filter((p) => !existing.has(p.id) && !existing.has(p.link)).slice(0, Math.max(room, 0)).map((p) => p.id)))
      if (!projects.length) setError('No public repositories found for this user.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggle = (id) => {
    const next = new Set(picked)
    next.has(id) ? next.delete(id) : next.add(id)
    setPicked(next)
  }

  function add() {
    addProjects(
      repos
        .filter((r) => picked.has(r.id))
        .map((r) => ({ ...r, description: r.description || (r.language ? `${r.language} project` : '') })),
    )
    setRepos(null)
    setOpen(false)
  }

  if (!open)
    return (
      <button onClick={() => setOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 py-2 text-sm text-zinc-200 hover:border-orange-500">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.7.5.5 5.7.5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5Z" /></svg>
        Import from GitHub
      </button>
    )

  return (
    <div className="space-y-3 rounded-xl border border-zinc-700 bg-zinc-900/60 p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Import from GitHub</span>
        <button onClick={() => { setOpen(false); setRepos(null); setError('') }} className="text-xs text-zinc-400 hover:text-white">Close</button>
      </div>
      <form onSubmit={fetchRepos} className="flex gap-2">
        <input className={inputCls} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="GitHub username" maxLength={39} />
        <button disabled={loading} className="shrink-0 rounded-lg bg-zinc-100 px-3 text-sm font-semibold text-black disabled:opacity-60">
          {loading ? 'Loading…' : 'Fetch'}
        </button>
      </form>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {repos?.length > 0 && (
        <>
          <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
            {repos.map((r) => {
              const already = existing.has(r.id) || existing.has(r.link)
              return (
                <li key={r.id}>
                  <label className={`flex cursor-pointer gap-3 rounded-lg border p-2.5 ${picked.has(r.id) ? 'border-orange-500/60 bg-orange-500/5' : 'border-zinc-800'} ${already ? 'opacity-50' : ''}`}>
                    <input type="checkbox" disabled={already} checked={picked.has(r.id)} onChange={() => toggle(r.id)} className="mt-1 accent-orange-500" />
                    <span className="min-w-0">
                      <span className="block truncate font-mono text-sm">{r.title}</span>
                      <span className="block text-xs text-zinc-400">
                        {r.language && <span className="mr-2 text-zinc-300">● {r.language}</span>}
                        {already ? 'Already added' : r.description || 'No description'}
                      </span>
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
          <button
            onClick={add}
            disabled={!picked.size || picked.size > room}
            className="w-full rounded-lg bg-orange-500 py-2 text-sm font-semibold text-black hover:bg-orange-400 disabled:opacity-50"
          >
            {picked.size > room ? `You can add ${Math.max(room, 0)} more` : `Add ${picked.size} project${picked.size === 1 ? '' : 's'}`}
          </button>
        </>
      )}
    </div>
  )
}
