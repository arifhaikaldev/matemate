import { useState } from 'react'
import { MathDisplay } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'

interface VerifyCalc {
  latex: string
  label: string
}

interface Props {
  instruction: string
  verifyCalculations: VerifyCalc[]
  verifyQuestion: string
  onSuccess: () => void
}

export function VerifyCheck({
  instruction,
  verifyCalculations,
  verifyQuestion,
  onSuccess,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSelect = (val: string) => {
    if (succeeded) return
    setSelected(val)
    setAttempted(true)
    if (val === 'yes') {
      setSucceeded(true)
      setTimeout(onSuccess, 1200)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="space-y-3">
        {verifyCalculations.map((calc, i) => (
          <div
            key={i}
            className="card-3d p-4 flex items-center justify-between"
            style={{
              borderColor: succeeded ? 'var(--teal)' : 'var(--border)',
              background: succeeded ? 'var(--teal-tint)' : 'var(--card)',
            }}
          >
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
              {calc.label}
            </span>
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              <MathDisplay>{calc.latex}</MathDisplay>
            </span>
            {succeeded && (
              <span className="text-lg font-bold" style={{ color: 'var(--teal)' }}>✓</span>
            )}
          </div>
        ))}
      </div>

      <p className="font-medium text-center text-lg" style={{ color: 'var(--text-primary)' }}>
        {verifyQuestion}
      </p>
      <div className="flex gap-4 justify-center">
        {['yes', 'no'].map((val) => (
          <button
            key={val}
            onClick={() => handleSelect(val)}
            className="px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200"
            style={{
              background: selected === val ? (succeeded ? 'var(--teal-tint)' : 'var(--coral-tint)') : 'var(--card-secondary)',
              border: `2px solid ${
                selected === val
                  ? succeeded
                    ? 'var(--teal)'
                    : 'var(--coral)'
                  : 'var(--border)'
              }`,
              color: 'var(--text-primary)',
            }}
          >
            {val === 'yes' ? 'Ya, memenuhi' : 'Tidak memenuhi'}
          </button>
        ))}
      </div>

      {attempted && selected === 'no' && (
        <Feedback type="incorrect" message="Cuba semak semula pengiraan. Kedua-dua persamaan harus dipenuhi." />
      )}

      {succeeded && (
        <Feedback type="correct" message="Betul! Kedua-dua persamaan dipenuhi." />
      )}
    </div>
  )
}