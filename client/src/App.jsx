import Toolbar from './components/Toolbar'
import Editor from './components/Editor'
import AiDesigner from './components/AiDesigner'
import Preview from './components/Preview'

export default function App() {
  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
      <Toolbar />
      <div className="grid flex-1 overflow-hidden lg:grid-cols-[420px_1fr]">
        <aside className="space-y-8 overflow-y-auto border-r border-zinc-800 p-5">
          <AiDesigner />
          <Editor />
        </aside>
        <main className="hidden overflow-hidden p-5 lg:block">
          <Preview />
        </main>
      </div>
      {/* On small screens the preview goes below the form */}
      <div className="h-[80vh] p-5 lg:hidden">
        <Preview />
      </div>
    </div>
  )
}
