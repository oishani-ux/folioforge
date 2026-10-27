// Tiny router: "#/editor" shows the editor, anything else shows the landing page.
// Hash URLs work both on the Vite dev server and when Express serves the built app.
import { useEffect, useState } from 'react'

const read = () => (window.location.hash.startsWith('#/editor') ? 'editor' : 'landing')

export function useHashRoute() {
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onChange = () => {
      setRoute(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export const goTo = (route) => {
  window.location.hash = route === 'editor' ? '#/editor' : '#/'
}
