// Add / edit / remove project entries, or import them from GitHub.
import { usePortfolio, LIMITS } from '../store/usePortfolio'
import { Section, Field, inputCls } from './Editor'
import GitHubImport from './GitHubImport'

export default function ProjectList() {
  const { data, addProject, updateProject, removeProject } = usePortfolio()
  const full = data.projects.length >= LIMITS.projects

  return (
    <Section title="Projects">
      <GitHubImport />
      {data.projects.map((p, i) => (
        <div key={p.id} className="space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Project {i + 1}</span>
            <button onClick={() => removeProject(p.id)} className="text-xs text-zinc-400 hover:text-red-400">Remove</button>
          </div>
          <Field label="Title">
            <input className={inputCls} maxLength={LIMITS.title} value={p.title} onChange={(e) => updateProject(p.id, 'title', e.target.value)} placeholder="CampusEats" />
          </Field>
          <Field label="Description">
            <textarea className={inputCls} rows={2} maxLength={LIMITS.description} value={p.description} onChange={(e) => updateProject(p.id, 'description', e.target.value)} placeholder="What it does" />
          </Field>
          <Field label="Link">
            <input className={inputCls} maxLength={LIMITS.link} value={p.link} onChange={(e) => updateProject(p.id, 'link', e.target.value)} placeholder="https://github.com/you/project" />
          </Field>
        </div>
      ))}
      <button
        onClick={addProject}
        disabled={full}
        className="w-full rounded-lg border border-dashed border-zinc-700 py-2 text-sm text-zinc-300 hover:border-orange-500 hover:text-orange-400 disabled:opacity-40"
      >
        {full ? `Maximum ${LIMITS.projects} projects` : '+ Add project manually'}
      </button>
    </Section>
  )
}
