// Download the portfolio as one HTML file, or as a ZIP (index.html + style.css + assets/).
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const fileName = (name) => (name || 'portfolio').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'portfolio'

export function downloadHtml(html, name) {
  saveAs(new Blob([html], { type: 'text/html;charset=utf-8' }), `${fileName(name)}.html`)
}

export async function downloadZip(html, name) {
  const zip = new JSZip()

  // 1. Move the CSS out of <style> into style.css
  const css = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n')
  let page = html.replace(/<style>[\s\S]*?<\/style>/g, '').replace('</head>', '<link rel="stylesheet" href="style.css"></head>')

  // 2. Move the uploaded photo out into assets/photo.jpg
  const photo = page.match(/src="data:image\/(png|jpe?g|webp|gif);base64,([^"]+)"/)
  if (photo) {
    const ext = photo[1] === 'jpeg' ? 'jpg' : photo[1]
    zip.file(`assets/photo.${ext}`, photo[2], { base64: true })
    page = page.replace(photo[0], `src="assets/photo.${ext}"`)
  }

  zip.file('index.html', page)
  zip.file('style.css', css)
  const blob = await zip.generateAsync({ type: 'blob' })
  saveAs(blob, `${fileName(name)}.zip`)
}

// Shrink an uploaded photo to max 400px wide so autosave (localStorage, ~5 MB) never breaks.
export function compressImage(file, maxWidth = 400) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
