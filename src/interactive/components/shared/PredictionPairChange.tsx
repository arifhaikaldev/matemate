import { useState } from 'react'
import { MathDisplay } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'

interface Props {
  instruction: string
  pairEquation: string
  initialX: number
  initialY: number
  onSuccess: () => void
}

export function PredictionPairChange({
  instruction,
  pairEquation,
  initialX,
  initialY,
  onSuccess,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSelect = (val: string) => {
    if (succeeded) return
    setSelected(val)
    setAttempted(true)
    if (val === 'decreases') {
      setSucceeded(true)
      setTimeout(onSuccess, 1200)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d p-5 text-center">
        <MathDisplay>{pairEquation}</MathDisplay>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="text-center">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-1"
              style={{ background: 'var(--teal-tint)', border: '2px solid var(--teal)', color: 'var(--teal)' }}
            >
              {initialX}
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>x</span>
          </div>
          <span className="text-2xl" style={{ color: 'var(--text-muted)' }}>→</span>
          <div className="text-center">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl mx-auto mb-1"
              style={{ background: 'var(--teal-tint)', border: '2px solid var(--teal)', color: 'var(--teal)' }}
            >
              {initialX + 1}
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>x</span>
          </div>
        </div>
      </div>

      <p className="font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
        Jika x berubah daripada {initialX} kepada {initialX + 1}, apa berlaku kepada y?
      </p>
      <div className="flex gap-3 justify-center">
        {[
          { id: 'increases', label: 'Bertambah' },
          { id: 'decreases', label: 'Berkurang' },
          { id: 'same', label: 'Sama' },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className={`px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200 ${
              attempted && selected === opt.id && opt.id !== 'decreases' ? 'shake' : ''
            }`}
            style={{
              background:
                selected === opt.id
                  ? opt.id === 'decreases'
                    ? 'var(--teal-tint)'
                    : 'var(--coral-tint)'
                  : 'var(--card-secondary)',
              border: `2px solid ${
                selected === opt.id
                  ? opt.id === 'decreases'
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

      {attempted && selected !== 'decreases' && (
        <Feedback type="incorrect" message="Cuba fikir: jika jumlahnya tetap dan x bertambah, apa jadi pada y?" />
      )}

      {succeeded && (
        <div className="slide-up text-center">
          <div className="card-3d inline-block p-4">
            <p className="font-bold" style={{ color: 'var(--teal)' }}>
              y berubah daripada {initialY} kepada {initialY - 1}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              ({initialX + 1}, {initialY - 1})
            </p>
          </div>
        </div>
      )}
    </div>
  )
}