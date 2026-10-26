// "Design with AI" panel: user describes a style, the AI returns a design spec,
// and we switch the preview to the AI template using that spec.
import { useState } from 'react'
import { usePortfolio } from '../store/usePortfolio'

const IDEAS = [
  'Clean and minimal, lots of white space',
  'Dark and techy with a neon accent',
  'Warm editorial look with serif fonts',
  'Playful and colourful, for a designer',
]

export default function AiDesigner() {
  const { data, theme, setTheme } = usePortfolio()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          profile: { tagline: data.tagline, skills: data.skills, projectCount: data.projects?.length || 0 },
        }),
      })
      const out = await res.json()
      if (!res.ok) throw new Error(out.error || 'Something went wrong')
      setTheme('ai', out.spec)
      setTheme('template', 'ai')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const spec = theme.ai
  return (
    <div className="rounded-2xl border border-orange-500/40 bg-orange-500/5 p-4 space-y-3">
      <div className="font-semibold">✨ Design with AI</div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        maxLength={400}
        rows={3}
        placeholder="Describe your style, e.g. 'bold and modern, I'm a game developer'"
        className="w-full rounded-lg bg-black/30 border border-white/10 p-2 text-sm"
      />
      <div className="flex flex-wrap gap-2">
        {IDEAS.map((idea) => (
          <button key={idea} onClick={() => setPrompt(idea)} className="text-xs rounded-full border border-white/15 px-3 py-1 hover:border-orange-400">
            {idea}
          </button>
        ))}
      </div>
      <button onClick={generate} disabled={loading} className="w-full rounded-lg bg-orange-500 py-2 font-semibold text-black disabled:opacity-60">
        {loading ? 'Designing…' : spec ? 'Generate another design' : 'Generate my design'}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {spec && (
        <div className="flex items-center gap-2 text-xs text-white/70">
          {Object.values(spec.colors).map((c) => (
            <span key={c} className="h-5 w-5 rounded-full border border-white/20" style={{ background: c }} />
          ))}
          <span className="ml-1">{spec.name} · {spec.fonts.heading} / {spec.fonts.body} · {spec.layout}</span>
        </div>
      )}
    </div>
  )
}
