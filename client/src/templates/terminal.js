// Terminal: dark, monospace, developer vibe.
import { esc, safeUrl, safeColor, prepare, head, fontLink } from './utils.js'

export const label = 'Terminal'

export function render(data, theme = {}) {
  const d = prepare(data)
  const accent = safeColor(theme.color, '#39ff88')
  const slug = esc((d.name || 'you').toLowerCase().replace(/[^a-z0-9]+/g, ''))
  const cmd = (c) => `<p class="cmd"><span class="p">${slug}@portfolio</span>:<span class="d">~</span>$ ${c}</p>`
  return `<!doctype html><html lang="en"><head>${head(d, fontLink('JetBrains Mono'))}
<style>
*{box-sizing:border-box}
body{margin:0;background:#0b0e14;color:#d6dde6;font-family:'JetBrains Mono',ui-monospace,Menlo,Consolas,monospace;font-size:15px;line-height:1.7}
.win{max-width:900px;margin:clamp(16px,5vw,56px) auto;border:1px solid #232a36;border-radius:12px;overflow:hidden;background:#0f131b}
.bar{display:flex;gap:7px;padding:12px 16px;background:#161b25;border-bottom:1px solid #232a36}
.bar i{width:11px;height:11px;border-radius:50%;display:block}
.body{padding:clamp(18px,4vw,36px)}
.cmd{margin:26px 0 8px;color:#8b95a7}.cmd:first-child{margin-top:0}
.p{color:${accent}}.d{color:#7aa2f7}
h1{font-size:clamp(26px,5vw,40px);margin:0;color:#fff}
h1::after{content:'';display:inline-block;width:.55em;height:1em;background:${accent};margin-left:6px;vertical-align:-0.12em;animation:b 1s steps(1) infinite}
@keyframes b{50%{opacity:0}}
.tag{color:#8b95a7;margin:6px 0 0}
.photo{width:84px;height:84px;border-radius:8px;object-fit:cover;filter:grayscale(.2);border:1px solid #232a36;margin-bottom:14px}
.skills{color:${accent}}
.proj{border-left:2px solid ${accent};padding:4px 0 4px 14px;margin:12px 0}
.proj b{color:#fff}.proj p{margin:2px 0;color:#8b95a7}
a{color:${accent};text-decoration:none}a:hover{text-decoration:underline}
</style></head><body><div class="win">
<div class="bar"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></div>
<main class="body">
${cmd('whoami')}${d.photo ? `<img class="photo" src="${d.photo}" alt="${esc(d.name)}">` : ''}<h1>${esc(d.name)}</h1>${d.tagline ? `<p class="tag"># ${esc(d.tagline)}</p>` : ''}
${d.about ? `${cmd('cat about.txt')}<p style="margin:0">${esc(d.about)}</p>` : ''}
${d.skills.length ? `${cmd('ls skills/')}<p class="skills" style="margin:0">${d.skills.map(esc).join('&nbsp;&nbsp;')}</p>` : ''}
${d.projects.length ? `${cmd('ls -l projects/')}${d.projects.map((p) => `<div class="proj"><b>${esc(p.title)}/</b>${p.description ? `<p>${esc(p.description)}</p>` : ''}${safeUrl(p.link) ? `<a href="${safeUrl(p.link)}" target="_blank" rel="noopener">→ open</a>` : ''}</div>`).join('')}` : ''}
${d.links.length ? `${cmd('contact --all')}<p style="margin:0">${d.links.map(([l, u]) => `<a href="${safeUrl(u)}" target="_blank" rel="noopener">[${l.toLowerCase()}]</a>`).join('&nbsp;&nbsp;')}</p>` : ''}
</main></div></body></html>`
}
