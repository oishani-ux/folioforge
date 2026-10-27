// Top bar: logo, template / colour / font, downloads, and the account area.
import { usePortfolio } from '../store/usePortfolio'
import { templates, renderPortfolio } from '../templates'
import { FONTS } from '../templates/utils'
import { downloadHtml, downloadZip } from '../lib/exporters'
import AccountMenu from './AccountMenu'

const selectCls = 'rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100'

export default function Toolbar({ onAuth }) {
  const { data, theme, setTheme, loadSample, reset } = usePortfolio()
  const isAi = theme.template === 'ai'
  const html = () => renderPortfolio(data, theme)

  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-zinc-800 px-5 py-3">
      <a href="#/" className="mr-2 text-lg font-extrabold tracking-tight" title="Back to home">
        Folio<span className="text-orange-500">Forge</span>
      </a>

      <select className={selectCls} value={theme.template} onChange={(e) => setTheme('template', e.target.value)} aria-label="Template">
        {Object.entries(templates).map(([key, t]) => (
          <option key={key} value={key} disabled={key === 'ai' && !theme.ai}>
            {t.label}{key === 'ai' && !theme.ai ? ' (generate first)' : ''}
          </option>
        ))}
      </select>

      {!isAi && (
        <>
          <input type="color" title="Accent colour" aria-label="Accent colour" value={theme.color} onChange={(e) => setTheme('color', e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-zinc-700 bg-transparent" />
          <select className={selectCls} value={theme.font} onChange={(e) => setTheme('font', e.target.value)} aria-label="Font">
            {FONTS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </>
      )}

      <button onClick={loadSample} className="rounded-lg px-2 py-1.5 text-sm text-zinc-400 hover:text-white">Sample</button>
      <button onClick={() => confirm('Clear all fields?') && reset()} className="rounded-lg px-2 py-1.5 text-sm text-zinc-400 hover:text-white">Reset</button>

      <div className="ml-auto flex flex-wrap items-center gap-3">
        <button onClick={() => downloadHtml(html(), data.name)} className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm font-semibold hover:border-white">
          HTML ↓
        </button>
        <button onClick={() => downloadZip(html(), data.name)} className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm font-semibold hover:border-white">
          ZIP ↓
        </button>
        <span className="h-6 w-px bg-zinc-800" />
        <AccountMenu onAuth={onAuth} />
      </div>
    </header>
  )
}
