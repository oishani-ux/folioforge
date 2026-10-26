// Bento: playful card grid, like Apple-style bento boxes.
import { esc, safeUrl, safeColor, safeFont, fontLink, prepare, head } from './utils.js'

export const label = 'Bento'

export function render(data, theme = {}) {
  const d = prepare(data)
  const accent = safeColor(theme.color)
  const font = safeFont(theme.font)
  return `<!doctype html><html lang="en"><head>${head(d, fontLink(font))}
<style>
*{box-sizing:border-box}
body{margin:0;background:#eef0f3;color:#111318;font-family:'${font}',system-ui,sans-serif;font-size:16px;line-height:1.6}
.grid{max-width:1080px;margin:0 auto;padding:clamp(16px,4vw,40px);display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.tile{background:#fff;border-radius:24px;padding:26px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.hero{grid-column:span 3;background:#111318;color:#fff;display:flex;gap:22px;align-items:center;flex-wrap:wrap;min-height:220px}
.hero h1{font-size:clamp(34px,5vw,56px);line-height:1.05;margin:0;letter-spacing:-.02em}
.hero p{color:#b9bdc6;margin:10px 0 0;font-size:18px}
.photo{width:110px;height:110px;border-radius:22px;object-fit:cover;border:3px solid ${accent}}
.stat{background:${accent};color:#fff;display:flex;flex-direction:column;justify-content:flex-end}
.stat b{font-size:56px;line-height:1}.stat span{opacity:.9}
.about{grid-column:span 2}.skills{grid-column:span 2}
.label{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#7a808c;margin:0 0 12px;font-weight:700}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chips span{background:#f1f2f5;border-radius:10px;padding:6px 12px;font-size:14px;font-weight:600}
.project h3{margin:0 0 6px;font-size:19px}.project p{margin:0 0 12px;color:#5b616d;font-size:15px}
.project{display:flex;flex-direction:column}.project a{margin-top:auto}
.contact{grid-column:span 4;display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.contact a{background:#111318;color:#fff;padding:10px 18px;border-radius:12px}
a{color:${accent};text-decoration:none;font-weight:700}
@media (max-width:820px){.grid{grid-template-columns:1fr 1fr}.hero,.about,.skills,.contact{grid-column:1/-1}}
@media (max-width:520px){.grid{grid-template-columns:1fr}.tile{grid-column:1/-1!important}}
</style></head><body><main class="grid">
<header class="tile hero">${d.photo ? `<img class="photo" src="${d.photo}" alt="${esc(d.name)}">` : ''}<div><h1>${esc(d.name)}</h1>${d.tagline ? `<p>${esc(d.tagline)}</p>` : ''}</div></header>
<div class="tile stat"><b>${d.projects.length}</b><span>projects shipped</span></div>
${d.about ? `<section class="tile about"><p class="label">About</p><p style="margin:0">${esc(d.about)}</p></section>` : ''}
${d.skills.length ? `<section class="tile skills"><p class="label">Skills</p><div class="chips">${d.skills.map((s) => `<span>${esc(s)}</span>`).join('')}</div></section>` : ''}
${d.projects.map((p) => `<article class="tile project"><p class="label">Project</p><h3>${esc(p.title)}</h3>${p.description ? `<p>${esc(p.description)}</p>` : ''}${safeUrl(p.link) ? `<a href="${safeUrl(p.link)}" target="_blank" rel="noopener">View →</a>` : ''}</article>`).join('')}
${d.links.length ? `<footer class="tile contact"><p class="label" style="margin:0 12px 0 0">Say hi</p>${d.links.map(([l, u]) => `<a href="${safeUrl(u)}" target="_blank" rel="noopener">${l}</a>`).join('')}</footer>` : ''}
</main></body></html>`
}
