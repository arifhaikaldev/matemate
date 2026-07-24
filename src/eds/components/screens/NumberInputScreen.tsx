// NumberInputScreen — student types a numeric answer

import { useState, useRef } from 'react'
import { VisualRenderer } from '../../registry/VisualRenderer'
import type { NumberInputScreen as TNumberInput } from '../../types'

interface Props {
  screen: TNumberInput
  onNext: (correct: boolean) => void
}

function normalise(raw: string): string {
  return raw.trim().replace(/\s/g, '').replace('−', '-').replace('–', '-')
}

export function NumberInputScreen({ screen, onNext }: Props) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isCorrect = normalise(value) === normalise(screen.answer)

  const handleSubmit = () => {
    if (!value.trim()) return
    setSubmitted(true)
  }

  const handleNext = () => {
    onNext(isCorrect)
    setValue('')
    setSubmitted(false)
    setShowHint(false)
    setTimeout(() => inputRef.current?.focus(), 50)
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

      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => !submitted && setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !submitted && handleSubmit()}
          placeholder="Taip jawapan..."
          disabled={submitted}
          className={`w-full rounded-2xl border-2 px-4 py-3 text-lg font-bold text-center bg-white dark:bg-white/5 transition-colors outline-none ${
            submitted
              ? isCorrect
                ? 'border-duo-green text-duo-green-dark'
                : 'border-duo-red text-duo-red'
              : 'border-duo-gray-light dark:border-white/15 text-duo-charcoal dark:text-gray-100 focus:border-duo-blue'
          }`}
          aria-label="Masukkan jawapan"
        />

        {screen.hint && !submitted && (
          <button
            onClick={() => setShowHint((s) => !s)}
            className="text-duo-blue text-sm font-semibold self-start"
          >
            {showHint ? 'Sembunyikan petunjuk' : 'Tunjukkan petunjuk'}
          </button>
        )}
        {showHint && screen.hint && !submitted && (
          <p className="text-sm text-duo-gray bg-duo-blue-light dark:bg-duo-blue/10 rounded-xl px-3 py-2">
            {screen.hint}
          </p>
        )}
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
          <span className="font-black mr-1">
            {isCorrect ? 'Betul!' : `Jawapan: ${screen.answer}.`}
          </span>
          {screen.explanation}
        </div>
      )}

      <button
        onClick={submitted ? handleNext : handleSubmit}
        disabled={!value.trim() && !submitted}
        className="btn btn-primary w-full disabled:opacity-40"
      >
        {submitted ? 'Seterusnya' : 'Semak Jawapan'}
      </button>
    </div>
  )
}
