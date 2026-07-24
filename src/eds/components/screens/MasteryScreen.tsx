// MasteryScreen — final check, same as MultipleChoice but with celebration

import { useState } from 'react'
import { VisualRenderer } from '../../registry/VisualRenderer'
import type { MasteryScreen as TMastery } from '../../types'

interface Props {
  screen: TMastery
  onNext: (correct: boolean) => void
}

const CHOICE_LABELS = ['A', 'B', 'C', 'D']

export function MasteryScreen({ screen, onNext }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const isCorrect = selected === screen.correctIndex

  const handleNext = () => {
    if (!submitted) {
      if (selected === null) return
      setSubmitted(true)
      return
    }
    onNext(isCorrect)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Mastery badge */}
      <div className="flex items-center gap-2 text-duo-orange font-black text-sm">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Semak Penguasaan
      </div>

      {screen.visual && (
        <div className="w-full flex justify-center py-1">
          <VisualRenderer visual={screen.visual} />
        </div>
      )}

      <p className="text-base font-bold text-duo-charcoal dark:text-gray-100 leading-snug">
        {screen.question}
      </p>

      <div className="flex flex-col gap-3">
        {screen.choices.map((choice, i) => {
          let cls =
            'flex items-center gap-3 w-full px-4 py-3 rounded-2xl border-2 text-left font-semibold text-base transition-all '
          if (!submitted) {
            cls +=
              selected === i
                ? 'border-duo-orange bg-duo-orange-light dark:bg-duo-orange/20 text-duo-orange'
                : 'border-duo-gray-light dark:border-white/15 bg-white dark:bg-white/5 text-duo-charcoal dark:text-gray-100 hover:border-duo-orange/50'
          } else {
            if (i === screen.correctIndex) {
              cls += 'border-duo-green bg-duo-green-light dark:bg-duo-green/20 text-duo-green-dark'
            } else if (i === selected && selected !== screen.correctIndex) {
              cls += 'border-duo-red bg-duo-red-light dark:bg-duo-red/20 text-duo-red'
            } else {
              cls +=
                'border-duo-gray-light dark:border-white/10 bg-white dark:bg-white/5 text-duo-gray opacity-50'
            }
          }

          return (
            <button
              key={i}
              className={cls}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              aria-pressed={selected === i}
            >
              <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-black flex-shrink-0">
                {CHOICE_LABELS[i]}
              </span>
              <span>{choice}</span>
            </button>
          )
        })}
      </div>

      {submitted && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
            isCorrect
              ? 'bg-duo-green-light dark:bg-duo-green/20 text-duo-green-dark'
              : 'bg-duo-red-light dark:bg-duo-red/20 text-duo-red'
          }`}
          role="alert"
        >
          <span className="font-black mr-1">
            {isCorrect ? 'Hebat! Anda faham.' : 'Belum tepat.'}
          </span>
          {screen.explanation}
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={selected === null && !submitted}
        className={`btn w-full disabled:opacity-40 ${submitted ? 'btn-primary' : 'bg-duo-orange text-white hover:bg-duo-orange/90'}`}
      >
        {submitted ? 'Tamat Pelajaran' : 'Semak Jawapan'}
      </button>
    </div>
  )
}
