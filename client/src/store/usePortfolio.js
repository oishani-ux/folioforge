// All portfolio data lives here. `persist` autosaves it to localStorage,
// so a reload or closed tab never loses the user's work (even when logged out).
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const LIMITS = { name: 100, tagline: 200, about: 2000, skills: 30, skill: 50, projects: 20, title: 100, description: 500, link: 300, social: 200 }

const newProject = () => ({ id: crypto.randomUUID(), title: '', description: '', link: '' })
const isBlank = (p) => !p.title && !p.description && !p.link

const EMPTY = {
  name: '', tagline: '', about: '', photo: '',
  skills: [],
  projects: [],
  socials: { github: '', linkedin: '', email: '', website: '' },
}
const DEFAULT_THEME = { template: 'minimal', color: '#ff5a1f', font: 'Inter', ai: null }

export const SAMPLE = {
  name: 'Riya Sharma',
  tagline: 'Full-stack developer who builds calm, useful software',
  about: 'Third-year CS student who loves clean interfaces and fast APIs. I build small tools that save people time.',
  photo: '',
  skills: ['React', 'Node.js', 'MongoDB', 'Python', 'Figma'],
  projects: [
    { id: 'p1', title: 'CampusEats', description: 'Pre-order food from college canteens and skip the queue.', link: 'https://github.com/' },
    { id: 'p2', title: 'StudySync', description: 'Shared study planner with live timers.', link: 'https://github.com/' },
    { id: 'p3', title: 'PixelNotes', description: 'Markdown notes that sync offline.', link: '' },
  ],
  socials: { github: 'https://github.com/', linkedin: 'https://linkedin.com/', email: 'riya@example.com', website: '' },
}

const freshData = () => ({ ...EMPTY, socials: { ...EMPTY.socials }, projects: [newProject()] })

export const usePortfolio = create(
  persist(
    (set) => ({
      data: freshData(),
      theme: DEFAULT_THEME,

      setField: (key, value) => set((s) => ({ data: { ...s.data, [key]: value } })),
      setSocial: (key, value) => set((s) => ({ data: { ...s.data, socials: { ...s.data.socials, [key]: value } } })),

      addProject: () =>
        set((s) => (s.data.projects.length >= LIMITS.projects ? s : { data: { ...s.data, projects: [...s.data.projects, newProject()] } })),
      updateProject: (id, key, value) =>
        set((s) => ({ data: { ...s.data, projects: s.data.projects.map((p) => (p.id === id ? { ...p, [key]: value } : p)) } })),
      removeProject: (id) => set((s) => ({ data: { ...s.data, projects: s.data.projects.filter((p) => p.id !== id) } })),

      // Add projects picked from GitHub: skip duplicates, drop empty placeholder cards, respect the max.
      addProjects: (list) =>
        set((s) => {
          const kept = s.data.projects.filter((p) => !isBlank(p))
          const seen = new Set(kept.flatMap((p) => [p.id, p.link]).filter(Boolean))
          const incoming = list
            .filter((p) => !seen.has(p.id) && !seen.has(p.link))
            .map((p) => ({ id: p.id, title: p.title, description: p.description, link: p.link }))
          return { data: { ...s.data, projects: [...kept, ...incoming].slice(0, LIMITS.projects) } }
        }),

      setTheme: (key, value) => set((s) => ({ theme: { ...s.theme, [key]: value } })),

      // Replace everything with what the server has saved for this account.
      loadFromServer: ({ data = {}, theme = {} }) =>
        set(() => ({
          data: {
            ...EMPTY,
            ...data,
            skills: Array.isArray(data.skills) ? data.skills : [],
            socials: { ...EMPTY.socials, ...(data.socials || {}) },
            projects: (data.projects?.length ? data.projects : [newProject()]).map((p) => ({ ...p, id: p.id || crypto.randomUUID() })),
          },
          theme: { ...DEFAULT_THEME, ...theme },
        })),

      loadSample: () => set({ data: SAMPLE }),
      reset: () => set({ data: freshData() }),
      clearAll: () => set({ data: freshData(), theme: DEFAULT_THEME }),
    }),
    { name: 'folioforge-draft' },
  ),
)
