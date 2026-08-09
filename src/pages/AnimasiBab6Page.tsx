import { AppHeader } from '../components/AppHeader'
import { LessonEngine } from '../animasi/bab6/LessonEngine'

export function AnimasiBab6Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="Bab 6 — Animasi">
        <a
          href="/"
          className="text-xs font-bold text-duo-gray hover:text-duo-charcoal dark:hover:text-gray-300 transition-colors"
        >
          Laman Utama
        </a>
      </AppHeader>

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6">
        <LessonEngine />
      </main>

      <footer className="text-center py-4 text-xs font-medium text-duo-gray">
        MateMate · Animasi Interaktif Bab 6
      </footer>
    </div>
  )
}