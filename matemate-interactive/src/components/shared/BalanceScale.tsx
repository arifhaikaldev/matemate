import { useState } from 'react'
import { MathInline, MathDisplay } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'

interface Props {
  instruction: string
  leftLatex: string
  rightLatex: string
  operationOptions: string[]
  correctOperation: string
  onSuccess: () => void
  incorrectFeedback?: string
  showScale?: boolean
}

export function BalanceScale({
  instruction,
  leftLatex,
  rightLatex,
  operationOptions,
  correctOperation,
  onSuccess,
  incorrectFeedback,
  showScale = true,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSelect = (op: string) => {
    if (succeeded) return
    setSelected(op)
    setAttempted(true)
    if (op === correctOperation) {
      setSucceeded(true)
      setTimeout(onSuccess, 1500)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      {/* Balance scale visual */}
      {showScale && (
        <div className="flex justify-center">
          <div
            className="card-3d p-6 inline-flex flex-col items-center"
            style={succeeded ? { borderColor: 'var(--teal)' } : undefined}
          >
            {/* Left and right pans */}
            <div className="flex items-end gap-8">
              <div
                className="px-6 py-4 rounded-xl font-bold text-xl"
                style={{ background: 'var(--teal-tint)', color: 'var(--teal)' }}
              >
                <MathDisplay>{leftLatex}</MathDisplay>
              </div>
              <div
                className="px-6 py-4 rounded-xl font-bold text-xl"
                style={{ background: 'var(--coral-tint)', color: 'var(--coral)' }}
              >
                <MathDisplay>{rightLatex}</MathDisplay>
              </div>
            </div>
            {/* Balance beam */}
            <div
              className={`w-64 h-2 rounded-full mt-2 transition-all duration-500`}
              style={{
                background: succeeded ? 'var(--teal)' : 'var(--border)',
              }}
            />
            <div
              className="w-4 h-6 mx-auto"
              style={{ background: 'var(--text-muted)' }}
            />
            <span className="text-2xl font-bold mt-1">=</span>
          </div>
        </div>
      )}

      {!succeeded && (
        <div className="space-y-3">
          <p className="font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
            Pilih operasi yang sesuai:
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {operationOptions.map((op) => {
              const isSelected = selected === op
              const isWrong = isSelected && attempted && op !== correctOperation
              return (
                <button
                  key={op}
                  onClick={() => handleSelect(op)}
                  className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
                    isWrong ? 'shake' : ''
                  }`}
                  style={{
                    background: isSelected ? 'var(--coral-tint)' : 'var(--card-secondary)',
                    border: `2px solid ${
                      isSelected ? 'var(--coral)' : 'var(--border)'
                    }`,
                    color: 'var(--text-primary)',
                  }}
                >
                  {op}
                </button>
              )
            })}
          </div>
          {attempted && selected && selected !== correctOperation && (
            <Feedback
              type="incorrect"
              message={incorrectFeedback || 'Fikirkan operasi yang membatalkan nilai tambahan.'}
            />
          )}
        </div>
      )}

      {succeeded && !showScale && (
        <div className="text-center bounce-enter">
          <Feedback type="correct" message="Tepat! Sekarang lakukan pada kedua-dua belah." />
        </div>
      )}

      {succeeded && showScale && (
        <div className="text-center bounce-enter space-y-2">
          <div className="flex items-center justify-center gap-4 text-lg">
            <span
              className="px-4 py-2 rounded-lg font-bold"
              style={{ background: 'var(--teal-tint)', color: 'var(--teal)' }}
            >
              <MathInline>{leftLatex}</MathInline>
            </span>
            <span className="text-xl font-bold" style={{ color: 'var(--coral)' }}>
              {correctOperation}
            </span>
            <span
              className="px-4 py-2 rounded-lg font-bold"
              style={{ background: 'var(--coral-tint)', color: 'var(--coral)' }}
            >
              <MathInline>{rightLatex}</MathInline>
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Operasi yang sama dilakukan pada kedua-dua belah untuk mengekalkan kesamaan.
          </p>
        </div>
      )}
    </div>
  )
}