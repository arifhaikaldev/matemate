// WorkedExampleScreen — step-by-step solution reveal

import { useState } from 'react'
import { VisualRenderer } from '../../registry/VisualRenderer'
import type { WorkedExampleScreen as TWorkedExample } from '../../types'

interface Props {
  screen: TWorkedExample
  onNext: () => void
}

export function WorkedExampleScreen({ screen, onNext }: Props) {
  const [revealed, setRevealed] = useState(0)
  const allRevealed = revealed >= screen.steps.length

  return (
    <div className="flex flex-col gap-5">
      {screen.visual && (
        <div className="w-full flex justify-center py-1">
          <VisualRenderer visual={screen.visual} />
        </div>
      )}

      <div className="bg-duo-gray-light/50 dark:bg-white/5 rounded-2xl px-4 py-3">
        <p className="text-xs text-duo-gray font-semibold uppercase tracking-wide mb-1">Soalan</p>
        <p className="text-lg font-black text-duo-charcoal dark:text-gray-100">{screen.problem}</p>
      </div>

      <div className="flex flex-col gap-2">
        {screen.steps.slice(0, revealed).map((step, i) => (
          <div
            key={i}
            className="flex gap-3 items-start bg-white dark:bg-white/5 rounded-xl px-4 py-3 border border-duo-gray-light dark:border-white/10 animate-fade-in"
          >
            <span className="w-6 h-6 rounded-full bg-duo-blue text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm font-semibold text-duo-charcoal dark:text-gray-200">{step}</p>
          </div>
        ))}
      </div>

      {allRevealed && (
        <div className="bg-duo-green-light dark:bg-duo-green/20 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">✓</span>
          <div>
            <p className="text-xs text-duo-green-dark font-semibold uppercase tracking-wide">Jawapan</p>
            <p className="text-xl font-black text-duo-green-dark">{screen.answer}</p>
          </div>
        </div>
      )}

      <button
        onClick={allRevealed ? onNext : () => setRevealed((r) => r + 1)}
        className="btn btn-primary w-full"
      >
        {allRevealed ? 'Seterusnya' : revealed === 0 ? 'Tunjukkan Langkah 1' : `Langkah ${revealed + 1}`}
      </button>
    </div>
  )
}
