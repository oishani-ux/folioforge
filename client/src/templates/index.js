// The list of templates. Each one is { label, render(data, theme) → full HTML }.
import * as minimal from './minimal.js'
import * as bento from './bento.js'
import * as terminal from './terminal.js'
import * as ai from './ai.js'

export const templates = {
  minimal,
  bento,
  terminal,
  ai: { label: 'AI designed ✨', render: ai.render },
}

export function renderPortfolio(data, theme) {
  const t = templates[theme.template] || templates.minimal
  return t.render(data, theme)
}
