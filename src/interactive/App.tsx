import { useEffect } from 'react'
import { LessonProvider, useLesson } from './context/LessonContext'
import { PageRenderer } from './components/pages/PageRenderer'
import { ProgressBar } from './components/ui/ProgressBar'
import { lessons } from './data'
import type { Lesson } from './types'

function LessonSidebar({
  lessons,
  currentLessonId,
  onSelect,
}: {
  lessons: Lesson[]
  currentLessonId: string
  onSelect: (index: number) => void
}) {
  const sections = [
    { label: '6.1 Persamaan Linear dalam Satu Pemboleh Ubah', ids: ['6.1.1', '6.1.2', '6.1.3', '6.1.4'] },
    { label: '6.2 Persamaan Linear dalam Dua Pemboleh Ubah', ids: ['6.2.1', '6.2.2', '6.2.3', '6.2.4'] },
    { label: '6.3 Persamaan Linear Serentak', ids: ['6.3.1', '6.3.2', '6.3.3'] },
  ]

  return (
    <nav className="hidden lg:block w-full lg:w-72 flex-shrink-0" style={{ background: 'var(--card)' }}>
      <div className="lg:sticky lg:top-0 p-4 space-y-1">
        <h2
          className="text-sm font-bold uppercase tracking-wider mb-3 px-3"
          style={{ color: 'var(--text-muted)' }}
        >
          Bab 6: Persamaan Linear
        </h2>
        {sections.map((section) => (
          <div key={section.label} className="mb-3">
            <p
              className="text-xs font-medium mb-2 px-3"
              style={{ color: 'var(--text-secondary)' }}
            >
              {section.label}
            </p>
            {lessons
              .filter((l) => section.ids.includes(l.id))
              .map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => onSelect(lessons.indexOf(lesson))}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background:
                      lesson.id === currentLessonId
                        ? 'var(--teal-tint)'
                        : 'transparent',
                    color:
                      lesson.id === currentLessonId
                        ? 'var(--teal)'
                        : 'var(--text-secondary)',
                    borderLeft:
                      lesson.id === currentLessonId
                        ? '3px solid var(--teal)'
                        : '3px solid transparent',
                  }}
                >
                  {lesson.id} — {lesson.title}
                </button>
              ))}
          </div>
        ))}
      </div>
    </nav>
  )
}

function LessonContent() {
  const { state, dispatch, currentLesson, currentPage, isFirstPage } = useLesson()

  if (!currentLesson) return null

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Mobile top bar — compact lesson ID badge + page indicator */}
      <div
        className="lg:hidden flex items-center gap-2 px-3 py-2 border-b"
        style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
      >
        <button
          onClick={() => dispatch({ type: 'SELECT_LESSON', index: -1 })}
          className="p-1.5 rounded-lg text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          ←
        </button>
        <span
          className="text-xs font-bold px-2.5 py-0.5 rounded-full"
          style={{ background: 'var(--teal-tint)', color: 'var(--teal)' }}
        >
          {currentLesson.id}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {state.currentPageIndex + 1}/{currentLesson.pages.length}
        </span>
      </div>

      <header className="p-4 lg:p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="hidden lg:block">
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {currentLesson.title}
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Halaman {state.currentPageIndex + 1} daripada {currentLesson.pages.length}
          </p>
        </div>
        <div className="lg:mt-3">
          <ProgressBar percent={((state.currentPageIndex + 1) / currentLesson.pages.length) * 100} />
        </div>
      </header>

      <div className="flex-1 p-4 lg:p-8 max-w-3xl mx-auto w-full" key={currentPage?.id}>
        {currentPage && <PageRenderer />}
      </div>

      <footer
        className="p-4 border-t flex items-center justify-between"
        style={{ borderColor: 'var(--border)' }}
      >
        <button
          onClick={() => dispatch({ type: 'PREV_PAGE' })}
          disabled={isFirstPage}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-30"
          style={{
            background: 'var(--card-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        >
          ← Sebelum
        </button>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {currentLesson.id}
        </span>
        <button
          onClick={() => dispatch({ type: 'SELECT_LESSON', index: -1 })}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          style={{
            background: 'var(--card-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          Senarai
        </button>
      </footer>
    </div>
  )
}

function LessonSelector() {
  const { dispatch } = useLesson()

  const sections = [
    { label: '6.1 Persamaan Linear dalam Satu Pemboleh Ubah', ids: ['6.1.1', '6.1.2', '6.1.3', '6.1.4'] },
    { label: '6.2 Persamaan Linear dalam Dua Pemboleh Ubah', ids: ['6.2.1', '6.2.2', '6.2.3', '6.2.4'] },
    { label: '6.3 Persamaan Linear Serentak', ids: ['6.3.1', '6.3.2', '6.3.3'] },
  ]

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center space-y-2">
          <h1
            className="text-3xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            MathMate
          </h1>
          <p
            className="text-lg font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Bab 6: Persamaan Linear
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.label} className="space-y-2">
            <p
              className="text-xs font-bold uppercase tracking-wider px-1"
              style={{ color: 'var(--text-muted)' }}
            >
              {section.label}
            </p>
            {lessons
              .filter((l) => section.ids.includes(l.id))
              .map((lesson) => {
                const globalIndex = lessons.indexOf(lesson)
                return (
                  <button
                    key={lesson.id}
                    onClick={() => dispatch({ type: 'SELECT_LESSON', index: globalIndex })}
                    className="w-full card-3d p-5 text-left transition-all duration-200 hover:scale-[1.02]"
                  >
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--teal)' }}
                    >
                      {lesson.id}
                    </span>
                    <h3
                      className="font-bold mt-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {lesson.title}
                    </h3>
                    <p
                      className="text-sm mt-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {lesson.pages.length} halaman interaktif
                    </p>
                  </button>
                )
              })}
          </div>
        ))}
      </div>
    </div>
  )
}

function AppInner() {
  const { state, dispatch } = useLesson()

  useEffect(() => {
    if (state.lessons.length === 0) {
      dispatch({ type: 'SET_LESSONS', lessons })
    }
  }, [dispatch, state.lessons.length])

  if (state.lessons.length === 0) return null

  if (state.currentLessonIndex === -1) {
    return <LessonSelector />
  }

  const lesson = state.lessons[state.currentLessonIndex]
  if (!lesson) return <LessonSelector />

  return (
    <div className="flex flex-col lg:flex-row min-h-screen" style={{ background: 'var(--bg)' }}>
      <LessonSidebar
        lessons={lessons}
        currentLessonId={lesson.id}
        onSelect={(i) => dispatch({ type: 'SELECT_LESSON', index: i })}
      />
      <main className="flex-1 border-l" style={{ borderColor: 'var(--border)' }}>
        <LessonContent />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <LessonProvider>
      <AppInner />
    </LessonProvider>
  )
}