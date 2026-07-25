import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchChapterIndex } from '../lib/lessons'
import { getAllLessonProgress } from '../lib/db'
import type { ChapterIndex, LessonIndexItem } from '../lib/lessons'
import type { LessonProgressRecord } from '../lib/db'
import { AppHeader } from '../components/AppHeader'

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: 'Mudah',
  medium: 'Sederhana',
  hard: 'Susah',
}

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: 'text-duo-green-dark bg-duo-green-light dark:bg-duo-green/20 dark:text-duo-green',
  medium: 'text-duo-orange bg-duo-orange-light dark:bg-duo-orange/20',
  hard: 'text-duo-red bg-duo-red-light dark:bg-duo-red/20',
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-duo-green-dark dark:text-duo-green'
  if (score >= 50) return 'text-duo-orange'
  return 'text-duo-red'
}

function LessonCard({
  lesson,
  prog,
  onClick,
}: {
  lesson: LessonIndexItem
  prog: LessonProgressRecord | undefined
  onClick: () => void
}) {
  const done = prog?.completed ?? false
  const score = prog?.score ?? null
  const attempt = prog?.attempt ?? 0

  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 bg-white dark:bg-white/5 transition-all duration-150 hover:border-duo-purple hover:shadow-md active:scale-[0.98] group cursor-pointer border-duo-gray-light dark:border-white/10"
    >
      {/* Status circle */}
      <div
        className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-black border-2 transition-colors ${
          done
            ? 'bg-duo-green border-duo-green text-white'
            : 'bg-white dark:bg-white/5 border-duo-gray-light dark:border-white/15 text-duo-gray'
        }`}
      >
        {done ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <span className="text-xs">{lesson.lessonId}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-duo-charcoal dark:text-gray-100 leading-snug group-hover:text-duo-purple dark:group-hover:text-duo-purple transition-colors truncate">
          {lesson.tajuk}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_COLOR[lesson.difficulty]}`}
          >
            {DIFFICULTY_LABEL[lesson.difficulty]}
          </span>
          <span className="text-xs text-duo-gray">~{lesson.estimatedMinutes} min</span>
          {attempt > 0 && <span className="text-xs text-duo-gray">{attempt}x cuba</span>}
        </div>
      </div>

      {/* Score */}
      {score !== null ? (
        <span className={`text-lg font-black flex-shrink-0 ${scoreColor(score)}`}>{score}%</span>
      ) : (
        <svg
          className="w-4 h-4 text-duo-gray flex-shrink-0 group-hover:text-duo-purple transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  )
}

export function Form1Bab3Page() {
  const navigate = useNavigate()
  const [index, setIndex] = useState<ChapterIndex | null>(null)
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgressRecord>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [idx, progs] = await Promise.all([fetchChapterIndex(1, 3), getAllLessonProgress()])
        setIndex(idx)
        const map: Record<string, LessonProgressRecord> = {}
        for (const p of progs) map[p.lessonId] = p
        setProgressMap(map)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ralat tidak diketahui')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Overall stats
  const allLessons = index?.subtopik.flatMap((s) => s.lessons) ?? []
  const completedCount = allLessons.filter((l) => progressMap[l.lessonId]?.completed).length
  const totalCount = allLessons.length
  const overallPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="Tingkatan 1 — Bab 3" showBack backTo="/" />

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6 space-y-6">
        {/* Chapter hero */}
        <div className="rounded-2xl bg-gradient-to-br from-duo-purple to-duo-purple-dark text-white p-6 shadow-lg">
          <p className="text-white/80 text-xs font-bold uppercase tracking-wide">
            Matematik Tingkatan 1 · Bab 3
          </p>
          <h2 className="text-2xl font-black mt-1">Kuasa Dua, Punca Kuasa Dua, Kuasa Tiga dan Punca Kuasa Tiga</h2>
          <p className="text-white/80 text-sm mt-1">
            Kuasa Dua Sempurna, Punca Kuasa Dua, Kuasa Tiga Sempurna, Punca Kuasa Tiga
          </p>
          {totalCount > 0 && (
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs text-white/80 font-bold">
                <span>Kemajuan</span>
                <span>
                  {completedCount}/{totalCount} pelajaran
                </span>
              </div>
              <div className="h-2.5 w-full bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <p className="text-white/70 text-xs">{overallPct}% selesai</p>
            </div>
          )}
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 rounded-2xl bg-duo-gray-light/40 dark:bg-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border-2 border-duo-red-light bg-duo-red-light dark:bg-duo-red/10 px-4 py-3">
            <p className="text-duo-red text-sm font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && index && (
          <div className="space-y-6">
            {index.subtopik.map((subtopik) => {
              const doneInSub = subtopik.lessons.filter(
                (l) => progressMap[l.lessonId]?.completed
              ).length

              return (
                <section key={subtopik.no}>
                  {/* Subtopic header */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-bold text-duo-gray uppercase tracking-widest">
                        {subtopik.no}
                      </p>
                      <h3 className="text-sm font-black text-duo-charcoal dark:text-gray-100">
                        {subtopik.tajuk}
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-duo-gray">
                      {doneInSub}/{subtopik.lessons.length}
                    </span>
                  </div>

                  {/* Lesson cards */}
                  <div className="space-y-2">
                    {subtopik.lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.lessonId}
                        lesson={lesson}
                        prog={progressMap[lesson.lessonId]}
                        onClick={() => navigate(`/lesson/${lesson.lessonId}`)}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
