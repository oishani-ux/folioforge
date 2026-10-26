// Top bar: template, colour, font, and download buttons.
import { usePortfolio } from '../store/usePortfolio'
import { templates, renderPortfolio } from '../templates'
import { FONTS } from '../templates/utils'
import { downloadHtml, downloadZip } from '../lib/exporters'

const selectCls = 'rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100'

export default function Toolbar() {
  const { data, theme, setTheme, loadSample, reset } = usePortfolio()
  const isAi = theme.template === 'ai'
  const html = () => renderPortfolio(data, theme)

  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-zinc-800 px-5 py-3">
      <div className="mr-auto text-lg font-extrabold tracking-tight">
        Folio<span className="text-orange-500">Forge</span>
      </div>

      <select className={selectCls} value={theme.template} onChange={(e) => setTheme('template', e.target.value)}>
        {Object.entries(templates).map(([key, t]) => (
          <option key={key} value={key} disabled={key === 'ai' && !theme.ai}>
            {t.label}{key === 'ai' && !theme.ai ? ' (generate first)' : ''}
          </option>
        ))}
      </select>

      {!isAi && (
        <>
          <input type="color" title="Accent colour" value={theme.color} onChange={(e) => setTheme('color', e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-zinc-700 bg-transparent" />
          <select className={selectCls} value={theme.font} onChange={(e) => setTheme('font', e.target.value)}>
            {FONTS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </>
      )}

      <button onClick={loadSample} className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:text-white">Sample</button>
      <button onClick={() => confirm('Clear all fields?') && reset()} className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:text-white">Reset</button>
      <button onClick={() => downloadHtml(html(), data.name)} className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm font-semibold hover:border-white">
        Download HTML
      </button>
      <button onClick={() => downloadZip(html(), data.name)} className="rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-black hover:bg-orange-400">
        Download ZIP
      </button>
    </header>
  )
}
