import { useEffect, useState } from 'react'
import Toolbar from './components/Toolbar'
import Editor from './components/Editor'
import AiDesigner from './components/AiDesigner'
import Preview from './components/Preview'
import Landing from './components/Landing'
import AuthModal from './components/AuthModal'
import { useAuth } from './store/useAuth'
import { useHashRoute, goTo } from './lib/useHashRoute'
import { useCloudAutosave } from './lib/useCloudAutosave'

function EditorScreen({ onAuth }) {
  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
      <Toolbar onAuth={onAuth} />
      <div className="grid flex-1 overflow-hidden lg:grid-cols-[420px_1fr]">
        <aside className="space-y-8 overflow-y-auto border-r border-zinc-800 p-5">
          <AiDesigner />
          <Editor />
          {/* On small screens the preview goes below the form */}
          <div className="h-[80vh] lg:hidden">
            <Preview />
          </div>
        </aside>
        <main className="hidden overflow-hidden p-5 lg:block">
          <Preview />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const route = useHashRoute()
  const init = useAuth((s) => s.init)
  const [authMode, setAuthMode] = useState(null) // 'login' | 'signup' | null

  useEffect(() => {
    init() // am I logged in? load my saved portfolio
  }, [init])
  useCloudAutosave()

  return (
    <>
      {route === 'editor' ? <EditorScreen onAuth={setAuthMode} /> : <Landing onAuth={setAuthMode} />}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitch={setAuthMode}
          onSuccess={() => goTo('editor')}
        />
      )}
    </>
  )
}
