// Shows a full-size web page shrunk down to fit its box (used for template thumbnails).
import { useEffect, useRef, useState } from 'react'

export default function ScaledFrame({ html, pageWidth = 1280, pageHeight = 800, title }) {
  const box = useRef(null)
  const [scale, setScale] = useState(0.3)

  useEffect(() => {
    const el = box.current
    const ro = new ResizeObserver(() => setScale(el.clientWidth / pageWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [pageWidth])

  return (
    <div ref={box} className="relative w-full overflow-hidden" style={{ aspectRatio: `${pageWidth} / ${pageHeight}` }}>
      <iframe
        title={title}
        srcDoc={html}
        sandbox=""
        tabIndex={-1}
        className="pointer-events-none absolute top-0 left-0 origin-top-left border-0 bg-white"
        style={{ width: pageWidth, height: pageHeight, transform: `scale(${scale})` }}
      />
    </div>
  )
}
