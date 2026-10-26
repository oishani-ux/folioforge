// Minimal: calm, light, single column, lots of space.
import { esc, safeUrl, safeColor, safeFont, fontLink, prepare, head } from './utils.js'

export const label = 'Minimal'

export function render(data, theme = {}) {
  const d = prepare(data)
  const accent = safeColor(theme.color)
  const font = safeFont(theme.font)
  return `<!doctype html><html lang="en"><head>${head(d, fontLink(font, 'Fraunces'))}
<style>
*{box-sizing:border-box}
body{margin:0;background:#faf8f4;color:#1c1a17;font-family:'${font}',system-ui,sans-serif;font-size:17px;line-height:1.7}
.wrap{max-width:720px;margin:0 auto;padding:clamp(40px,8vw,96px) 24px}
.photo{width:96px;height:96px;border-radius:50%;object-fit:cover;margin-bottom:24px}
h1{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:clamp(40px,7vw,64px);line-height:1.05;margin:0;letter-spacing:-.02em}
.tag{font-size:clamp(18px,2.4vw,22px);color:#6b655d;margin:14px 0 0}
section{margin-top:clamp(48px,8vw,80px)}
h2{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:${accent};margin:0 0 16px}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chips span{border:1px solid #ddd6cb;border-radius:999px;padding:5px 14px;font-size:15px}
.project{padding:22px 0;border-top:1px solid #e7e1d7}
.project:last-child{border-bottom:1px solid #e7e1d7}
.project h3{margin:0 0 4px;font-size:20px}
.project p{margin:0;color:#6b655d}
a{color:${accent};text-decoration:none;font-weight:600}a:hover{text-decoration:underline}
.links{display:flex;flex-wrap:wrap;gap:10px 24px}
</style></head><body><main class="wrap">
${d.photo ? `<img class="photo" src="${d.photo}" alt="${esc(d.name)}">` : ''}
<h1>${esc(d.name)}</h1>${d.tagline ? `<p class="tag">${esc(d.tagline)}</p>` : ''}
${d.about ? `<section><h2>About</h2><p>${esc(d.about)}</p></section>` : ''}
${d.skills.length ? `<section><h2>Skills</h2><div class="chips">${d.skills.map((s) => `<span>${esc(s)}</span>`).join('')}</div></section>` : ''}
${d.projects.length ? `<section><h2>Projects</h2>${d.projects.map((p) => `<div class="project"><h3>${esc(p.title)}</h3>${p.description ? `<p>${esc(p.description)}</p>` : ''}${safeUrl(p.link) ? `<a href="${safeUrl(p.link)}" target="_blank" rel="noopener">View project →</a>` : ''}</div>`).join('')}</section>` : ''}
${d.links.length ? `<section><h2>Contact</h2><div class="links">${d.links.map(([l, u]) => `<a href="${safeUrl(u)}" target="_blank" rel="noopener">${l}</a>`).join('')}</div></section>` : ''}
</main></body></html>`
}
