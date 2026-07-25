import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchLesson, fetchChapterIndex, findNextLesson } from '../lib/lessons'
import { saveLessonProgress, getLessonProgress } from '../lib/db'
import type { LessonProgressRecord } from '../lib/db'
import { LessonRenderer } from '../eds/renderers/LessonRenderer'
import type { Lesson, LessonProgress } from '../eds/types'

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [prevProgress, setPrevProgress] = useState<LessonProgressRecord | undefined>()
  const [nextLessonId, setNextLessonId] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [finalScore, setFinalScore] = useState<number>(0)

  useEffect(() => {
    if (!lessonId) return
    const id = lessonId // capture for closure
    let cancelled = false

    async function load() {
      try {
        // lessonId format: "2.1.3" → chapter 2
        const chapterNum = parseInt(id.split('.')[0], 10)
        const index = await fetchChapterIndex(1, chapterNum)
        const allLessons = index.subtopik.flatMap((s) => s.lessons)
        const meta = allLessons.find((l) => l.lessonId === id)
        if (!meta) throw new Error(`Lesson ${id} tidak dijumpai dalam indeks.`)

        const [lessonData, prog, next] = await Promise.all([
          fetchLesson(meta.fail),
          getLessonProgress(id),
          Promise.resolve(findNextLesson(index, id)),
        ])

        if (cancelled) return
        setLesson(lessonData)
        setPrevProgress(prog)
        setNextLessonId(next?.lessonId)
        setCompleted(false)
        setError(null)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Ralat memuatkan pelajaran.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [lessonId])

  const handleComplete = useCallback(async (progress: LessonProgress) => {
    setFinalScore(progress.score)
    setCompleted(true)
    await saveLessonProgress(progress)
  }, [])

  const handleBack = useCallback(() => {
    const chapterNum = lessonId ? parseInt(lessonId.split('.')[0], 10) : 1
    navigate(`/form1/bab${chapterNum}`)
  }, [navigate, lessonId])

  const handleNext = useCallback(() => {
    if (nextLessonId) {
      navigate(`/lesson/${nextLessonId}`)
    } else {
      const chapterNum = lessonId ? parseInt(lessonId.split('.')[0], 10) : 1
      navigate(`/form1/bab${chapterNum}`)
    }
  }, [navigate, nextLessonId, lessonId])

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-5">
        <div className="w-12 h-12 rounded-full border-4 border-duo-green border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-duo-gray">Memuatkan pelajaran...</p>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error || !lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-5 text-center">
        <div className="text-4xl">😕</div>
        <p className="text-base font-bold text-duo-charcoal dark:text-gray-100">
          Pelajaran tidak dapat dimuatkan
        </p>
        <p className="text-sm text-duo-gray">{error}</p>
        <button onClick={handleBack} className="btn btn-primary mt-2">
          Kembali ke Senarai
        </button>
      </div>
    )
  }

  // ── Completion screen (after LessonRenderer fires onComplete) ─────────────
  if (completed) {
    const attempt = (prevProgress?.attempt ?? 0) + 1
    const improved = prevProgress && prevProgress.score > 0 && finalScore > prevProgress.score

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 text-center gap-6 max-w-sm mx-auto">
        <div className="text-6xl">{finalScore >= 80 ? '🌟' : finalScore >= 50 ? '👍' : '💪'}</div>

        <div>
          <h2 className="text-xl font-black text-duo-charcoal dark:text-gray-100">
            {lesson.title}
          </h2>
          <p className="text-sm text-duo-gray mt-1">{lesson.topic}</p>
        </div>

        <div
          className={`text-5xl font-black ${
            finalScore >= 80
              ? 'text-duo-green-dark dark:text-duo-green'
              : finalScore >= 50
                ? 'text-duo-orange'
                : 'text-duo-red'
          }`}
        >
          {finalScore}%
        </div>

        {improved && (
          <div className="bg-duo-green-light dark:bg-duo-green/20 rounded-2xl px-4 py-3 text-sm font-semibold text-duo-green-dark">
            Peningkatan dari percubaan sebelumnya! ({prevProgress!.score}% → {finalScore}%)
          </div>
        )}

        {attempt > 1 && !improved && (
          <p className="text-xs text-duo-gray">Percubaan ke-{attempt}</p>
        )}

        <div className="flex flex-col gap-3 w-full">
          {nextLessonId ? (
            <button onClick={handleNext} className="btn btn-primary w-full">
              Pelajaran Seterusnya
            </button>
          ) : (
            <button onClick={handleBack} className="btn btn-primary w-full">
              Selesai — Kembali ke Senarai
            </button>
          )}
          {finalScore < 80 && (
            <button
              onClick={() => {
                // Navigate to same lesson — useEffect will re-fetch
                navigate(0)
              }}
              className="btn w-full bg-duo-gray-light dark:bg-white/10 text-duo-charcoal dark:text-gray-100"
            >
              Cuba Semula
            </button>
          )}
          <button
            onClick={handleBack}
            className="text-sm font-semibold text-duo-gray hover:text-duo-charcoal dark:hover:text-gray-200 transition-colors"
          >
            Kembali ke Senarai
          </button>
        </div>
      </div>
    )
  }

  // ── Lesson player ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-duo-bg dark:bg-duo-charcoal py-6 px-4">
      <LessonRenderer lesson={lesson} onComplete={handleComplete} onBack={handleBack} />
    </div>
  )
}
