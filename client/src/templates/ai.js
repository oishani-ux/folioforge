// AI-personalised template.
// The AI never writes HTML. It only returns a small "design spec" (colours, fonts,
// layout, styles). This file turns the user's data + that spec into a full page.
// Plain JavaScript (no React), so the backend can reuse it for /u/:username.

export const FONTS = [
  'Inter', 'Poppins', 'Manrope', 'Outfit', 'Sora', 'Space Grotesk', 'IBM Plex Sans',
  'DM Sans', 'Syne', 'Playfair Display', 'Fraunces', 'DM Serif Display', 'Lora', 'JetBrains Mono',
];
export const LAYOUTS = ['centered', 'split', 'sidebar', 'bento'];
export const HEROES = ['big-name', 'photo-left', 'minimal', 'gradient'];
export const CARDS = ['bordered', 'shadow', 'flat', 'glass'];
export const BACKGROUNDS = ['plain', 'dots', 'grid', 'glow'];
export const DENSITIES = ['compact', 'comfortable', 'airy'];
export const SECTIONS = ['about', 'skills', 'projects', 'contact'];

export const DEFAULT_SPEC = {
  name: 'Ember Dark',
  colors: { bg: '#0f0f12', surface: '#18181c', text: '#f4f1ea', muted: '#9a958e', accent: '#ff5a1f' },
  fonts: { heading: 'Space Grotesk', body: 'Inter' },
  layout: 'centered',
  hero: 'big-name',
  cards: 'bordered',
  background: 'glow',
  density: 'comfortable',
  radius: 14,
  sectionOrder: ['about', 'skills', 'projects', 'contact'],
};

const HEX = /^#[0-9a-fA-F]{6}$/;
const pick = (v, list, fallback) => (list.includes(v) ? v : fallback);

// Accepts anything (e.g. raw AI output) and returns a safe, complete spec.
// Every value is checked against an allow-list, so nothing can inject CSS/HTML.
export function sanitizeSpec(raw = {}) {
  const d = DEFAULT_SPEC;
  const c = raw.colors || {};
  const colors = {};
  for (const k of Object.keys(d.colors)) colors[k] = HEX.test(c[k]) ? c[k] : d.colors[k];
  const order = Array.isArray(raw.sectionOrder) ? raw.sectionOrder.filter((s) => SECTIONS.includes(s)) : [];
  const sectionOrder = [...new Set([...order, ...SECTIONS])];
  const radius = Number.isFinite(+raw.radius) ? Math.max(0, Math.min(28, Math.round(+raw.radius))) : d.radius;
  return {
    name: String(raw.name || d.name).replace(/[^\w &'-]/g, '').slice(0, 40) || d.name,
    colors,
    fonts: {
      heading: pick(raw.fonts?.heading, FONTS, d.fonts.heading),
      body: pick(raw.fonts?.body, FONTS, d.fonts.body),
    },
    layout: pick(raw.layout, LAYOUTS, d.layout),
    hero: pick(raw.hero, HEROES, d.hero),
    cards: pick(raw.cards, CARDS, d.cards),
    background: pick(raw.background, BACKGROUNDS, d.background),
    density: pick(raw.density, DENSITIES, d.density),
    radius,
    sectionOrder,
  };
}

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const safeUrl = (u = '') => (/^(https?:|mailto:)/i.test(u.trim()) ? esc(u.trim()) : '');
const safeImg = (u = '') => (/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(u) || /^https:\/\//.test(u) ? esc(u) : '');

function css(s) {
  const { bg, surface, text, muted, accent } = s.colors;
  const gap = { compact: 44, comfortable: 72, airy: 112 }[s.density];
  const wide = s.layout === 'centered' ? 760 : 1120;
  const line = `color-mix(in srgb, ${text} 14%, transparent)`;
  const card = {
    bordered: `background:transparent;border:1px solid ${line};`,
    shadow: `background:${surface};border:1px solid transparent;box-shadow:0 18px 40px -18px color-mix(in srgb, #000 55%, transparent);`,
    flat: `background:${surface};border:1px solid transparent;`,
    glass: `background:color-mix(in srgb, ${surface} 60%, transparent);border:1px solid ${line};backdrop-filter:blur(10px);`,
  }[s.cards];
  const bgImg = {
    plain: 'none',
    dots: `radial-gradient(${line} 1px, transparent 1px)`,
    grid: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
    glow: `radial-gradient(60% 50% at 80% 0%, color-mix(in srgb, ${accent} 28%, transparent), transparent 70%)`,
  }[s.background];
  const bgSize = s.background === 'dots' ? '22px 22px' : s.background === 'grid' ? '44px 44px' : 'auto';
  const h1 = { 'big-name': 'clamp(48px, 10vw, 112px)', 'photo-left': 'clamp(40px, 7vw, 72px)', minimal: 'clamp(32px, 5vw, 48px)', gradient: 'clamp(46px, 9vw, 100px)' }[s.hero];
  return `
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:${bg};background-image:${bgImg};background-size:${bgSize};background-attachment:fixed;color:${text};
  font-family:'${s.fonts.body}',system-ui,sans-serif;font-size:17px;line-height:1.65;-webkit-font-smoothing:antialiased}
h1,h2,h3{font-family:'${s.fonts.heading}',system-ui,sans-serif;line-height:1.08;margin:0}
a{color:${accent};text-decoration:none}a:hover{text-decoration:underline}
.wrap{max-width:${wide}px;margin:0 auto;padding:clamp(28px,6vw,72px) clamp(20px,5vw,48px)}
.hero{margin-bottom:${gap}px}
.hero h1{font-size:${h1};letter-spacing:-0.02em;font-weight:700}
.hero .tag{font-size:clamp(18px,2.4vw,24px);color:${muted};margin-top:14px;max-width:42ch}
.hero.gradient h1{background:linear-gradient(100deg, ${text} 10%, ${accent} 90%);-webkit-background-clip:text;background-clip:text;color:transparent}
.hero.photo-left{display:flex;gap:28px;align-items:center;flex-wrap:wrap}
.hero.centered-hero{text-align:center}.hero.centered-hero .tag{margin-inline:auto}
.photo{width:112px;height:112px;border-radius:${Math.max(s.radius * 3, 12)}px;object-fit:cover;border:2px solid ${accent};flex:none}
.hero:not(.photo-left) .photo{margin-bottom:22px}
.centered-hero .photo{margin-inline:auto;display:block}
section{margin-bottom:${gap}px}
h2{font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:${accent};margin-bottom:18px;font-family:'${s.fonts.body}',sans-serif;font-weight:700}
.about{font-size:clamp(18px,2vw,21px);max-width:62ch}
.chips{display:flex;flex-wrap:wrap;gap:10px}
.chip{padding:7px 14px;border-radius:${s.radius ? 999 : 0}px;font-size:15px;${card}}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}
.card{padding:22px;border-radius:${s.radius}px;${card};transition:transform .2s}
.card:hover{transform:translateY(-3px)}
.card h3{font-size:20px;margin-bottom:8px}
.card p{margin:0 0 12px;color:${muted};font-size:15px}
.links{display:flex;flex-wrap:wrap;gap:12px 22px;font-weight:600}
.split .hero{display:grid;grid-template-columns:1.2fr 1fr;gap:48px;align-items:end}
.split .hero .about{font-size:17px;color:${muted}}
.sidebar{display:grid;grid-template-columns:320px 1fr;gap:64px;align-items:start}
.sidebar aside{position:sticky;top:48px}
.sidebar aside .hero{margin-bottom:28px}
.bento main{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.bento main section{margin:0;padding:26px;border-radius:${s.radius}px;${card}}
.bento main .s-about,.bento main .s-projects{grid-column:span 2}
.bento main .s-projects{grid-column:1 / -1}
.bento main .s-projects .card{background:${bg}}
footer{color:${muted};font-size:13px;padding-top:24px;border-top:1px solid ${line}}
@media (max-width:820px){
  .split .hero,.sidebar{grid-template-columns:1fr;gap:0}
  .sidebar aside{position:static;margin-bottom:${gap}px}
  .bento main{grid-template-columns:1fr}
  .bento main section{grid-column:auto!important}
}`;
}

function sections(data, s) {
  const skills = (data.skills || []).filter(Boolean);
  const projects = (data.projects || []).filter((p) => p && (p.title || p.description));
  const so = data.socials || {};
  const links = [
    ['GitHub', so.github], ['LinkedIn', so.linkedin], ['Website', so.website],
    ['Email', so.email ? (so.email.startsWith('mailto:') ? so.email : `mailto:${so.email}`) : ''],
  ].filter(([, u]) => safeUrl(u || ''));
  const out = {
    about: data.about && s.layout !== 'split' ? `<section class="s-about"><h2>About</h2><p class="about">${esc(data.about)}</p></section>` : '',
    skills: skills.length ? `<section class="s-skills"><h2>Skills</h2><div class="chips">${skills.map((k) => `<span class="chip">${esc(k)}</span>`).join('')}</div></section>` : '',
    projects: projects.length ? `<section class="s-projects"><h2>Projects</h2><div class="grid">${projects.map((p) => `
      <article class="card"><h3>${esc(p.title)}</h3>${p.description ? `<p>${esc(p.description)}</p>` : ''}${safeUrl(p.link || '') ? `<a href="${safeUrl(p.link)}" target="_blank" rel="noopener">View project →</a>` : ''}</article>`).join('')}</div></section>` : '',
    contact: links.length ? `<section class="s-contact"><h2>Contact</h2><div class="links">${links.map(([l, u]) => `<a href="${safeUrl(u)}" target="_blank" rel="noopener">${l}</a>`).join('')}</div></section>` : '',
  };
  return s.sectionOrder.map((k) => out[k]).join('');
}

export function render(data = {}, theme = {}) {
  const s = sanitizeSpec(theme.ai || {});
  const photo = safeImg(data.photo || '');
  const heroCls = ['hero', s.hero, s.layout === 'centered' && s.hero !== 'photo-left' ? 'centered-hero' : ''].join(' ');
  const hero = `<header class="${heroCls}">
    ${photo ? `<img class="photo" src="${photo}" alt="${esc(data.name)}">` : ''}
    <div><h1>${esc(data.name || 'Your Name')}</h1>${data.tagline ? `<p class="tag">${esc(data.tagline)}</p>` : ''}</div>
    ${s.layout === 'split' && data.about ? `<p class="about">${esc(data.about)}</p>` : ''}
  </header>`;
  const body = s.layout === 'sidebar'
    ? `<div class="wrap sidebar"><aside>${hero}</aside><main>${sections(data, s)}</main></div>`
    : `<div class="wrap ${s.layout}">${hero}<main>${sections(data, s)}</main>
       <footer>Made with FolioForge</footer></div>`;
  const fams = [...new Set([s.fonts.heading, s.fonts.body])].map((f) => `family=${f.replace(/ /g, '+')}:wght@400;600;700`).join('&');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(data.name || 'Portfolio')}${data.tagline ? ' · ' + esc(data.tagline) : ''}</title>
<meta name="description" content="${esc((data.about || data.tagline || '').slice(0, 155))}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${fams}&display=swap" rel="stylesheet">
<style>${css(s)}</style></head><body>${body}</body></html>`;
}
