// Live preview: renders the chosen template into an iframe on every change.
import { useDeferredValue, useState } from 'react'
import { usePortfolio } from '../store/usePortfolio'
import { renderPortfolio } from '../templates'

export default function Preview() {
  const { data, theme } = usePortfolio()
  const [device, setDevice] = useState('desktop')
  // useDeferredValue keeps typing smooth: React re-renders the preview right after the keystroke.
  const html = renderPortfolio(useDeferredValue(data), useDeferredValue(theme))

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Live preview</span>
        <div className="flex rounded-lg border border-zinc-700 p-0.5 text-xs">
          {['desktop', 'mobile'].map((d) => (
            <button key={d} onClick={() => setDevice(d)} className={`rounded-md px-3 py-1 capitalize ${device === d ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-1 justify-center overflow-hidden rounded-xl bg-zinc-800/60 p-3">
        <iframe
          title="Portfolio preview"
          srcDoc={html}
          sandbox="allow-popups"
          className="h-full rounded-lg bg-white shadow-2xl transition-all duration-300"
          style={{ width: device === 'mobile' ? 390 : '100%' }}
        />
      </div>
    </div>
  )
}
