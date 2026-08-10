import { useState } from 'react'
import { Feedback } from '../ui/Feedback'

interface Props {
  instruction: string
  visibleNumber: number
  correctAnswer: number
  maxNumber?: number
  onSuccess: () => void
}

export function NumberBlocks({
  instruction,
  visibleNumber,
  correctAnswer,
  maxNumber = 12,
  onSuccess,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSelect = (n: number) => {
    if (succeeded) return
    setSelected(n)
    setAttempted(true)
    if (n === correctAnswer) {
      setSucceeded(true)
      setTimeout(onSuccess, 1500)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d inline-block mx-auto p-6 max-w-full text-center">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {/* Visible blocks */}
          <div className="flex gap-1 flex-wrap justify-center">
            {Array.from({ length: visibleNumber }).map((_, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded bounce-enter"
                style={{ background: 'var(--teal-tint)', border: '2px solid var(--teal)' }}
              />
            ))}
          </div>

          <span className="text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>+</span>

          {/* Unknown block */}
          <div
            className={`w-9 h-9 rounded border-2 flex items-center justify-center font-bold text-lg transition-all duration-500 ${
              succeeded ? '' : 'border-dashed'
            }`}
            style={{
              background: succeeded ? 'var(--coral-tint)' : 'var(--card-secondary)',
              borderColor: succeeded ? 'var(--coral)' : 'var(--border)',
              color: succeeded ? 'var(--coral)' : 'var(--text-muted)',
            }}
          >
            {succeeded ? correctAnswer : '?'}
          </div>

          <span className="text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>=</span>

          {/* Total blocks */}
          <div className="flex gap-1 flex-wrap justify-center">
            {Array.from({ length: visibleNumber + correctAnswer }).map((_, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded bounce-enter"
                style={{
                  background: i < visibleNumber ? 'var(--teal-tint)' : 'var(--coral-tint)',
                  border: `2px solid ${i < visibleNumber ? 'var(--teal)' : 'var(--coral)'}`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {!succeeded && (
        <div className="space-y-3">
          <p className="font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
            Pilih nombor yang menjadikan persamaan ini benar:
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {Array.from({ length: maxNumber }).map((_, i) => {
              const n = i + 1
              const isWrong = selected === n && attempted && n !== correctAnswer
              return (
                <button
                  key={n}
                  onClick={() => handleSelect(n)}
                  className={`w-12 h-12 rounded-lg font-bold text-lg transition-all duration-200 ${
                    isWrong ? 'shake' : ''
                  }`}
                  style={{
                    background: selected === n ? 'var(--coral-tint)' : 'var(--card-secondary)',
                    border: `2px solid ${
                      selected === n ? 'var(--coral)' : 'var(--border)'
                    }`,
                    color: 'var(--text-primary)',
                  }}
                >
                  {n}
                </button>
              )
            })}
          </div>
          {attempted && selected !== null && selected !== correctAnswer && (
            <Feedback
              type="incorrect"
              message={`Cuba semak: ${visibleNumber} + ${selected} = ${visibleNumber + selected}, bukan ${visibleNumber + correctAnswer}.`}
            />
          )}
        </div>
      )}

      {succeeded && (
        <div className="text-center bounce-enter">
          <Feedback
            type="correct"
            message={`${visibleNumber} + ${correctAnswer} = ${visibleNumber + correctAnswer}!`}
          />
        </div>
      )}
    </div>
  )
}