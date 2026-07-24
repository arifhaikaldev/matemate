// LessonRenderer — top-level lesson engine
// Accepts a Lesson JSON, manages screen state, progress, score, completion

import { useState, useCallback } from 'react'
import type { Lesson, LessonProgress, ScreenStatus } from '../types'
import { ScreenRenderer } from './ScreenRenderer'

interface Props {
  lesson: Lesson
  onComplete: (progress: LessonProgress) => void
  onBack?: () => void
}

export function LessonRenderer({ lesson, onComplete, onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [statuses, setStatuses] = useState<ScreenStatus[]>(() =>
    lesson.screens.map(() => 'pending')
  )
  const [correctCount, setCorrectCount] = useState(0)
  const [interactiveCount, setInteractiveCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const currentScreen = lesson.screens[currentIndex]
  const totalScreens = lesson.screens.length
  const progress = (currentIndex / totalScreens) * 100

  const handleNext = useCallback(
    (correct?: boolean) => {
      const newStatuses = [...statuses]
      if (correct === undefined) {
        newStatuses[currentIndex] = 'viewed'
      } else {
        newStatuses[currentIndex] = correct ? 'correct' : 'incorrect'
        setCorrectCount((c) => c + (correct ? 1 : 0))
        setInteractiveCount((c) => c + 1)
      }
      setStatuses(newStatuses)

      const nextIndex = currentIndex + 1
      if (nextIndex >= totalScreens) {
        // Calculate score
        const totalInteractive = newStatuses.filter((s) =>
          ['correct', 'incorrect'].includes(s)
        ).length
        const totalCorrect = newStatuses.filter((s) => s === 'correct').length
        const score =
          totalInteractive === 0 ? 100 : Math.round((totalCorrect / totalInteractive) * 100)

        const lessonProgress: LessonProgress = {
          lessonId: lesson.lessonId,
          currentScreenIndex: nextIndex,
          screenStatuses: newStatuses,
          completed: true,
          score,
        }
        setFinished(true)
        onComplete(lessonProgress)
      } else {
        setCurrentIndex(nextIndex)
      }
    },
    [currentIndex, statuses, totalScreens, lesson.lessonId, onComplete]
  )

  if (finished) {
    const totalInteractive = statuses.filter((s) => ['correct', 'incorrect'].includes(s)).length
    const score = totalInteractive === 0 ? 100 : Math.round((correctCount / interactiveCount) * 100)

    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center">
        <div className="text-5xl">{score >= 80 ? '🌟' : score >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-black text-duo-charcoal dark:text-gray-100">
          {lesson.title} — Selesai!
        </h2>
        <div
          className={`text-5xl font-black ${
            score >= 80 ? 'text-duo-green' : score >= 50 ? 'text-duo-orange' : 'text-duo-red'
          }`}
        >
          {score}%
        </div>
        <p className="text-duo-gray text-sm">
          {correctCount} daripada {interactiveCount} soalan interaktif betul
        </p>
        {onBack && (
          <button onClick={onBack} className="btn btn-primary w-full max-w-xs">
            Kembali
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-1 rounded-xl text-duo-gray hover:bg-duo-gray-light/50 dark:hover:bg-white/10 transition-colors"
            aria-label="Kembali"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        <div className="flex-1">
          <p className="text-xs text-duo-gray font-semibold uppercase tracking-wide">
            {lesson.topic}
          </p>
          <p className="text-sm font-bold text-duo-charcoal dark:text-gray-200 truncate">
            {lesson.title}
          </p>
        </div>
        <span className="text-xs text-duo-gray font-semibold">
          {currentIndex + 1}/{totalScreens}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-duo-gray-light dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-duo-green rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Screen dots */}
      <div className="flex gap-1 justify-center flex-wrap">
        {statuses.map((status, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex
                ? 'bg-duo-blue scale-125'
                : status === 'correct'
                  ? 'bg-duo-green'
                  : status === 'incorrect'
                    ? 'bg-duo-red'
                    : status === 'viewed'
                      ? 'bg-duo-gray'
                      : 'bg-duo-gray-light dark:bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Screen content */}
      <div className="bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm border border-duo-gray-light dark:border-white/10">
        <ScreenRenderer key={currentIndex} screen={currentScreen} onNext={handleNext} />
      </div>

      {/* Lesson meta */}
      <p className="text-center text-xs text-duo-gray">
        ~{lesson.estimatedMinutes} minit · {lesson.difficulty}
      </p>
    </div>
  )
}
