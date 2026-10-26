// All portfolio data lives here. `persist` autosaves it to localStorage,
// so a reload or closed tab never loses the user's work.
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const newProject = () => ({ id: crypto.randomUUID(), title: '', description: '', link: '' })

const EMPTY = {
  name: '', tagline: '', about: '', photo: '',
  skills: [],
  projects: [newProject()],
  socials: { github: '', linkedin: '', email: '', website: '' },
}

const SAMPLE = {
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

export const usePortfolio = create(
  persist(
    (set) => ({
      data: EMPTY,
      theme: { template: 'minimal', color: '#ff5a1f', font: 'Inter', ai: null },

      setField: (key, value) => set((s) => ({ data: { ...s.data, [key]: value } })),
      setSocial: (key, value) => set((s) => ({ data: { ...s.data, socials: { ...s.data.socials, [key]: value } } })),

      addProject: () => set((s) => ({ data: { ...s.data, projects: [...s.data.projects, newProject()] } })),
      updateProject: (id, key, value) =>
        set((s) => ({ data: { ...s.data, projects: s.data.projects.map((p) => (p.id === id ? { ...p, [key]: value } : p)) } })),
      removeProject: (id) => set((s) => ({ data: { ...s.data, projects: s.data.projects.filter((p) => p.id !== id) } })),

      setTheme: (key, value) => set((s) => ({ theme: { ...s.theme, [key]: value } })),

      loadSample: () => set({ data: SAMPLE }),
      reset: () => set({ data: { ...EMPTY, projects: [newProject()] } }),
    }),
    { name: 'folioforge-draft' },
  ),
)
