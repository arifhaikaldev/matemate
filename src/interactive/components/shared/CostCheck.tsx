import { useState } from 'react'
import { Feedback } from '../ui/Feedback'

interface CostPair {
  x: number
  y: number
  cost: number
}

interface Props {
  instruction: string
  costPairs: CostPair[]
  totalCost: number
  onSuccess: () => void
}

export function CostCheck({
  instruction,
  costPairs,
  totalCost,
  onSuccess,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSelect = (idx: number) => {
    if (succeeded) return
    setSelectedId(idx)
    setChecked(true)
    const pair = costPairs[idx]
    if (pair.cost === totalCost) {
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
        {costPairs.map((pair, idx) => {
          const isSelected = selectedId === idx
          const isCorrect = succeeded && isSelected
          const isWrong = checked && isSelected && !succeeded
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                isWrong ? 'shake' : ''
              }`}
              style={{
                background: isCorrect
                  ? 'var(--teal-tint)'
                  : isSelected
                    ? 'var(--coral-tint)'
                    : 'var(--card-secondary)',
                border: `2px solid ${
                  isCorrect
                    ? 'var(--teal)'
                    : isSelected
                      ? 'var(--coral)'
                      : 'var(--border)'
                }`,
                color: 'var(--text-primary)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {pair.x} ayam + {pair.y} itik
                </span>
                <span className="font-bold text-lg" style={{ color: isCorrect ? 'var(--teal)' : 'var(--text-secondary)' }}>
                  RM{pair.cost}
                </span>
              </div>
              {isSelected && !succeeded && (
                <p className="text-sm mt-2" style={{ color: 'var(--coral)' }}>
                  Jumlah kos: RM{pair.cost}. Tidak sama dengan RM{totalCost}.
                </p>
              )}
              {isCorrect && (
                <p className="text-sm mt-2 font-medium" style={{ color: 'var(--teal)' }}>
                  ✓ Jumlah kos RM{pair.cost} sama dengan RM{totalCost}!
                </p>
              )}
            </button>
          )
        })}
      </div>

      {checked && !succeeded && (
        <Feedback type="incorrect" message="Cuba pasangan yang lain. Jumlah kos mestilah RM12." />
      )}
    </div>
  )
}