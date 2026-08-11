import { useState } from 'react'
import { MathDisplay } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'
import type { Choice } from '../../types'

interface Props {
  instruction: string
  orderedPairEquation: string
  orderedPairOptions: Choice[]
  orderedPairCorrectId: string
  onSuccess: () => void
}

export function OrderedPairQuiz({
  instruction,
  orderedPairEquation,
  orderedPairOptions,
  orderedPairCorrectId,
  onSuccess,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [showSubstitution, setShowSubstitution] = useState(false)

  const handleSelect = (id: string) => {
    if (succeeded) return
    setSelected(id)
    setAttempted(true)
    if (id === orderedPairCorrectId) {
      setSucceeded(true)
      setShowSubstitution(true)
      setTimeout(onSuccess, 1500)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d p-5 text-center">
        <MathDisplay>{orderedPairEquation}</MathDisplay>
      </div>

      <div className="space-y-3">
        <p className="font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
          Pasangan tertib (x,y) bermaksud nilai x datang dahulu dan nilai y datang kedua.
          <br />
          Antara berikut, yang manakah memenuhi persamaan?
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          {orderedPairOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={`px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                attempted && selected === opt.id && opt.id !== orderedPairCorrectId ? 'shake' : ''
              }`}
              style={{
                background:
                  selected === opt.id && succeeded
                    ? 'var(--teal-tint)'
                    : selected === opt.id
                      ? 'var(--coral-tint)'
                      : 'var(--card-secondary)',
                border: `2px solid ${
                  selected === opt.id
                    ? succeeded
                      ? 'var(--teal)'
                      : 'var(--coral)'
                    : 'var(--border)'
                }`,
                color: 'var(--text-primary)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {attempted && selected !== orderedPairCorrectId && (
        <Feedback type="incorrect" message="Cuba gantikan nilai x dan y ke dalam persamaan untuk menyemak." />
      )}

      {showSubstitution && (
        <div className="slide-up space-y-2">
          <div className="card-3d p-4 text-center" style={{ borderColor: 'var(--teal)' }}>
            <p className="font-medium" style={{ color: 'var(--teal)' }}>
              Semakan: Gantikan (1,4) ke dalam {orderedPairEquation}
            </p>
            <p className="font-bold text-lg mt-2" style={{ color: 'var(--text-primary)' }}>
              2(1) + 4 = 2 + 4 = 6 ✓
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manakala (4,1): 2(4) + 1 = 8 + 1 = 9 ✗
            </p>
          </div>
        </div>
      )}
    </div>
  )
}