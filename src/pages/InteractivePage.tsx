import { AppHeader } from '../components/AppHeader'

export function InteractivePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="Bab 6 — Pelajaran Interaktif" showBack backTo="/">
        <span className="text-xs font-bold text-duo-gray">6.1 Persamaan Linear</span>
      </AppHeader>
      <main className="flex-1">
        <iframe
          src="/interactive/index.html"
          title="Bab 6 — Pelajaran Interaktif"
          className="w-full border-0"
          style={{ height: 'calc(100vh - 3.5rem)' }}
        />
      </main>
    </div>
  )
}