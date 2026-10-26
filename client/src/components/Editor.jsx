// The form on the left: basics, photo, skills, social links.
import { usePortfolio } from '../store/usePortfolio'
import { compressImage } from '../lib/exporters'
import ProjectList from './ProjectList'

export const inputCls =
  'w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-orange-500 focus:outline-none'

export function Field({ label, children }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      {children}
    </label>
  )
}

export function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-widest text-orange-400">{title}</h2>
      {children}
    </section>
  )
}

export default function Editor() {
  const { data, setField, setSocial } = usePortfolio()

  async function onPhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return alert('Please choose an image file')
    setField('photo', await compressImage(file))
  }

  return (
    <div className="space-y-8">
      <Section title="Basics">
        <Field label="Full name">
          <input className={inputCls} value={data.name} onChange={(e) => setField('name', e.target.value)} placeholder="Riya Sharma" />
        </Field>
        <Field label="Tagline">
          <input className={inputCls} value={data.tagline} onChange={(e) => setField('tagline', e.target.value)} placeholder="Full-stack developer who…" />
        </Field>
        <Field label="About you">
          <textarea className={inputCls} rows={4} value={data.about} onChange={(e) => setField('about', e.target.value)} placeholder="A few lines about you" />
        </Field>
        <Field label="Profile photo">
          <div className="flex items-center gap-3">
            {data.photo && <img src={data.photo} alt="" className="h-12 w-12 rounded-full object-cover" />}
            <input type="file" accept="image/*" onChange={onPhoto} className="text-xs text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-zinc-200" />
            {data.photo && (
              <button onClick={() => setField('photo', '')} className="text-xs text-zinc-400 hover:text-red-400">Remove</button>
            )}
          </div>
        </Field>
      </Section>

      <Section title="Skills">
        <Field label="Separate with commas">
          <input
            className={inputCls}
            value={data.skills.join(', ')}
            onChange={(e) => setField('skills', e.target.value.split(',').map((s) => s.trimStart()))}
            placeholder="React, Node.js, Figma"
          />
        </Field>
      </Section>

      <ProjectList />

      <Section title="Links">
        {[['github', 'GitHub URL', 'https://github.com/you'], ['linkedin', 'LinkedIn URL', 'https://linkedin.com/in/you'], ['website', 'Website', 'https://…'], ['email', 'Email', 'you@email.com']].map(([key, label, ph]) => (
          <Field key={key} label={label}>
            <input className={inputCls} value={data.socials[key]} onChange={(e) => setSocial(key, e.target.value)} placeholder={ph} />
          </Field>
        ))}
      </Section>
    </div>
  )
}
