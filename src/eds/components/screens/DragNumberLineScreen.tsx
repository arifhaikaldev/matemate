// DragNumberLineScreen — place a number on a number line by tapping/clicking

import { useState } from 'react'
import { NumberLine } from '../visuals/NumberLine'
import type { DragNumberLineScreen as TDragNumberLine } from '../../types'

interface Props {
  screen: TDragNumberLine
  onNext: (correct: boolean) => void
}

export function DragNumberLineScreen({ screen, onNext }: Props) {
  const [placed, setPlaced] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const tick = screen.tickInterval ?? 1
  const isCorrect = submitted && placed === screen.target

  const handleDrag = (value: number) => {
    if (!submitted) setPlaced(value)
  }

  const handleSubmit = () => {
    if (placed === null) return
    setSubmitted(true)
  }

  const handleNext = () => {
    onNext(isCorrect)
    setPlaced(null)
    setSubmitted(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-base font-bold text-duo-charcoal dark:text-gray-100 leading-snug">
        {screen.question}
      </p>
      <p className="text-xs text-duo-gray">Ketik pada garis nombor untuk meletakkan nilai.</p>

      <div className="w-full flex flex-col items-center gap-3 py-3">
        <NumberLine
          min={screen.range.min}
          max={screen.range.max}
          tickInterval={tick}
          showZero
          interactive={!submitted}
          dragTarget={placed}
          onDrag={handleDrag}
          highlights={submitted ? [screen.target] : []}
        />
        {placed !== null && (
          <p className="text-sm font-bold text-duo-blue">
            Anda pilih: <span className="text-lg">{placed}</span>
          </p>
        )}
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
          {isCorrect ? (
            <span className="font-black">Betul! {screen.target} berada di situ.</span>
          ) : (
            <>
              <span className="font-black">Belum tepat. </span>
              Kedudukan betul ialah <span className="font-black">{screen.target}</span>.
            </>
          )}
        </div>
      )}

      <button
        onClick={submitted ? handleNext : handleSubmit}
        disabled={placed === null && !submitted}
        className="btn btn-primary w-full disabled:opacity-40"
      >
        {submitted ? 'Seterusnya' : 'Semak Jawapan'}
      </button>
    </div>
  )
}
