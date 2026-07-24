// MultipleChoiceScreen — 4-option interactive question

import { useState } from 'react'
import { VisualRenderer } from '../../registry/VisualRenderer'
import type { MultipleChoiceScreen as TMultipleChoice } from '../../types'

interface Props {
  screen: TMultipleChoice
  onNext: (correct: boolean) => void
}

const CHOICE_LABELS = ['A', 'B', 'C', 'D']

export function MultipleChoiceScreen({ screen, onNext }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const isCorrect = selected === screen.correctIndex

  const handleSelect = (i: number) => {
    if (submitted) return
    setSelected(i)
  }

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
  }

  const handleNext = () => {
    onNext(isCorrect)
    setSelected(null)
    setSubmitted(false)
  }

  return (
    <div className="flex flex-col gap-5">
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
                ? 'border-duo-blue bg-duo-blue-light dark:bg-duo-blue/20 text-duo-blue'
                : 'border-duo-gray-light dark:border-white/15 bg-white dark:bg-white/5 text-duo-charcoal dark:text-gray-100 hover:border-duo-blue/50'
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
              onClick={() => handleSelect(i)}
              aria-pressed={selected === i}
              disabled={submitted}
            >
              <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-black flex-shrink-0">
                {CHOICE_LABELS[i]}
              </span>
              <span>{choice}</span>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {submitted && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
            isCorrect
              ? 'bg-duo-green-light dark:bg-duo-green/20 text-duo-green-dark'
              : 'bg-duo-red-light dark:bg-duo-red/20 text-duo-red'
          }`}
          role="alert"
        >
          <span className="font-black mr-1">{isCorrect ? 'Betul!' : 'Tidak tepat.'}</span>
          {screen.explanation}
        </div>
      )}

      <button
        onClick={submitted ? handleNext : handleSubmit}
        disabled={selected === null && !submitted}
        className="btn btn-primary w-full disabled:opacity-40"
      >
        {submitted ? 'Seterusnya' : 'Semak Jawapan'}
      </button>
    </div>
  )
}
