// Shared helpers for every template.

// Escape user text so nobody can inject HTML or <script> (XSS protection).
export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]))

// Only allow real web / email links (blocks "javascript:" links).
export const safeUrl = (u = '') => (/^(https?:|mailto:)/i.test(String(u).trim()) ? esc(String(u).trim()) : '')

// Only allow uploaded images (base64) or https images.
export const safeImg = (u = '') =>
  /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(u) || /^https:\/\//.test(u) ? esc(u) : ''

export const safeColor = (c, fallback = '#ff5a1f') => (/^#[0-9a-fA-F]{6}$/.test(c || '') ? c : fallback)

export const FONTS = ['Inter', 'Poppins', 'Space Grotesk', 'DM Sans', 'Manrope', 'Playfair Display', 'Fraunces', 'JetBrains Mono']
export const safeFont = (f) => (FONTS.includes(f) ? f : 'Inter')

export const fontLink = (...fonts) => {
  const fams = [...new Set(fonts)].map((f) => `family=${f.replace(/ /g, '+')}:wght@400;600;700;800`).join('&')
  return `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${fams}&display=swap" rel="stylesheet">`
}

// Cleaned-up lists the templates can loop over.
export function prepare(data = {}) {
  const so = data.socials || {}
  const email = so.email ? (so.email.startsWith('mailto:') ? so.email : `mailto:${so.email}`) : ''
  return {
    name: data.name || 'Your Name',
    tagline: data.tagline || '',
    about: data.about || '',
    photo: safeImg(data.photo || ''),
    skills: (data.skills || []).map((s) => s.trim()).filter(Boolean),
    projects: (data.projects || []).filter((p) => p && (p.title || p.description)),
    links: [['GitHub', so.github], ['LinkedIn', so.linkedin], ['Website', so.website], ['Email', email]].filter(([, u]) => safeUrl(u || '')),
  }
}

// Shared <head>: mobile viewport + SEO / social-share tags.
export function head(d, extra = '') {
  const title = esc(d.name) + (d.tagline ? ' · ' + esc(d.tagline) : '')
  const desc = esc((d.about || d.tagline || '').slice(0, 155))
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="description" content="${desc}">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:type" content="profile">
<meta name="twitter:card" content="summary">${extra}`
}
