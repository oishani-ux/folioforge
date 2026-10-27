// The home page people see first.
import { useMemo } from 'react'
import { SAMPLE } from '../store/usePortfolio'
import { useAuth } from '../store/useAuth'
import { templates } from '../templates'
import { goTo } from '../lib/useHashRoute'
import ScaledFrame from './ScaledFrame'

const FEATURES = [
  ['⚡', 'Live preview', 'Every keystroke updates your site instantly, on desktop or mobile view.'],
  ['✨', 'Design with AI', 'Describe a vibe and get a one-of-a-kind design made for you.'],
  ['🐙', 'GitHub import', 'Pick your repos and they become project cards in one click.'],
  ['🔗', 'Your own link', 'Publish to /u/your-name with search and share tags built in.'],
  ['📦', 'Download anytime', 'Export a single HTML file or a ZIP with HTML, CSS and images.'],
  ['💾', 'Never lose work', 'Drafts save automatically, on this device or to your account.'],
]

const STEPS = [
  ['Fill a simple form', 'Name, about, skills, projects and links. Or import projects from GitHub.'],
  ['Pick a look', 'Choose Minimal, Bento or Terminal, or let AI design one for you.'],
  ['Publish & share', 'Get your own public link, or download the files.'],
]

export default function Landing({ onAuth }) {
  const { status, user } = useAuth()
  const thumbs = useMemo(
    () => ['minimal', 'bento', 'terminal'].map((k) => [templates[k].label, templates[k].render(SAMPLE, { color: '#ff5a1f', font: 'Inter' })]),
    [],
  )
  const loggedIn = status === 'authed'

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="text-xl font-extrabold tracking-tight">Folio<span className="text-orange-500">Forge</span></span>
        <div className="flex items-center gap-2">
          {loggedIn ? (
            <button onClick={() => goTo('editor')} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black">Open editor ({user.username})</button>
          ) : (
            <>
              <button onClick={() => onAuth('login')} className="rounded-lg px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white">Log in</button>
              <button onClick={() => onAuth('signup')} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200">Sign up</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <header className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pt-10 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
        <div className="pointer-events-none absolute top-0 right-0 -z-0 h-96 w-96 rounded-full bg-orange-600/25 blur-3xl" />
        <div className="relative">
          <p className="mb-4 text-xs font-bold tracking-[0.2em] text-orange-400 uppercase">Portfolio generator</p>
          <h1 className="text-5xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
            Your portfolio,<br />forged in <span className="text-orange-500">minutes.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-zinc-400">
            Fill a form and watch a clean, mobile-friendly website build itself. Publish it to your own link or download the files. No coding needed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => goTo('editor')} className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-400">
              {loggedIn ? 'Continue editing →' : 'Start building, it’s free →'}
            </button>
            {!loggedIn && (
              <button onClick={() => onAuth('signup')} className="rounded-xl border border-zinc-700 px-6 py-3 font-semibold hover:border-white">
                Create an account
              </button>
            )}
          </div>
          <p className="mt-4 text-sm text-zinc-500">You can start without an account. Sign up when you want to publish.</p>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl shadow-orange-900/20">
            <div className="flex gap-1.5 border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
              <i className="h-2.5 w-2.5 rounded-full bg-red-400" /><i className="h-2.5 w-2.5 rounded-full bg-yellow-400" /><i className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="ml-3 font-mono text-xs text-zinc-500">folioforge/u/riya</span>
            </div>
            <ScaledFrame html={thumbs[1][1]} title="Example portfolio" />
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="mb-10 text-3xl font-bold tracking-tight">Everything a portfolio needs</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([icon, title, text]) => (
            <div key={title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="mb-3 text-2xl">{icon}</div>
              <h3 className="mb-1 font-semibold">{title}</h3>
              <p className="text-sm text-zinc-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Pick a look, or let AI design one</h2>
        <p className="mb-10 text-zinc-400">Same content, three very different personalities. All of them work on phones.</p>
        <div className="grid gap-6 md:grid-cols-3">
          {thumbs.map(([label, html]) => (
            <figure key={label} className="overflow-hidden rounded-2xl border border-zinc-800">
              <ScaledFrame html={html} title={`${label} template`} />
              <figcaption className="border-t border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-semibold">{label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="mb-10 text-3xl font-bold tracking-tight">How it works</h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="rounded-2xl border border-zinc-800 p-6">
              <span className="text-4xl font-extrabold text-orange-500">{i + 1}</span>
              <h3 className="mt-3 mb-1 font-semibold">{title}</h3>
              <p className="text-sm text-zinc-400">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-5 pt-8 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-700 p-10 text-center text-black sm:p-14">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to show your work?</h2>
          <p className="mx-auto mt-3 max-w-md text-black/70">It takes about five minutes to get your first version live.</p>
          <button onClick={() => goTo('editor')} className="mt-8 rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-zinc-800">Start building →</button>
        </div>
      </section>

      <footer className="border-t border-zinc-900 py-8 text-center text-sm text-zinc-500">
        FolioForge · Built by Oishani Ghosh & Amritansu Singh
      </footer>
    </div>
  )
}
