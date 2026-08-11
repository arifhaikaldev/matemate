import { useState } from 'react'
import { MathDisplay } from '../ui/MathDisplay'

interface VariableMeaning {
  symbol: string
  meaning: string
}

interface Props {
  instruction: string
  equation: string
  variableMeanings: VariableMeaning[]
  onSuccess: () => void
}

export function RevealTwoVariable({
  instruction,
  equation,
  variableMeanings,
  onSuccess,
}: Props) {
  const [viewed, setViewed] = useState<Set<number>>(new Set())
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleClick = (i: number) => {
    setViewed((prev) => new Set(prev).add(i))
    setActiveIndex(i)
  }

  const allViewed = viewed.size >= variableMeanings.length

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d p-6 text-center">
        <MathDisplay>{equation}</MathDisplay>
      </div>

      <div className="space-y-3">
        {variableMeanings.map((vm, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-300"
            style={{
              background: activeIndex === i ? 'var(--teal-tint)' : 'var(--card-secondary)',
              border: `2px solid ${activeIndex === i ? 'var(--teal)' : 'var(--border)'}`,
            }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl"
              style={{
                background: 'var(--teal-tint)',
                border: '2px solid var(--teal)',
                color: 'var(--teal)',
              }}
            >
              {vm.symbol}
            </div>
            <span className="text-left font-medium text-lg" style={{ color: 'var(--text-primary)' }}>
              {vm.meaning}
            </span>
            {viewed.has(i) && (
              <span className="ml-auto text-sm font-bold" style={{ color: 'var(--teal)' }}>
                ✓
              </span>
            )}
          </button>
        ))}
      </div>

      {allViewed && (
        <div className="text-center">
          <button
            onClick={onSuccess}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            Seterusnya
          </button>
        </div>
      )}
    </div>
  )
}