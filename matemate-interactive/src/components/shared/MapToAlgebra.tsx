import { useState } from 'react'
import { MathInline } from '../ui/MathDisplay'

interface Props {
  instruction: string
  mappingPairs: { language: string; algebra: string }[]
  onComplete: () => void
}

export function MapToAlgebra({
  instruction,
  mappingPairs,
  onComplete,
}: Props) {
  const [viewed, setViewed] = useState<Set<number>>(new Set())
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleClick = (index: number) => {
    setViewed((prev) => new Set(prev).add(index))
    setActiveIndex(index)
  }

  const allViewed = viewed.size >= mappingPairs.length

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="space-y-4">
        {mappingPairs.map((pair, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-300"
            style={{
              background: activeIndex === i ? 'var(--teal-tint)' : 'var(--card-secondary)',
              border: `2px solid ${activeIndex === i ? 'var(--teal)' : 'var(--border)'}`,
              cursor: 'pointer',
            }}
          >
            <span
              className="flex-1 text-left font-medium text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              {pair.language}
            </span>
            <span className="text-xl" style={{ color: 'var(--text-muted)' }}>
              →
            </span>
            <span
              className="flex-1 text-right font-bold text-lg"
              style={{ color: 'var(--teal)' }}
            >
              <MathInline>{pair.algebra}</MathInline>
            </span>
          </button>
        ))}
      </div>

      {/* Substitution animation area */}
      {mappingPairs.length > 0 && activeIndex !== null && (
        <div className="slide-up text-center" key={activeIndex}>
          <div
            className="card-3d inline-block p-5"
            style={{ borderColor: 'var(--teal)' }}
          >
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              {mappingPairs[activeIndex].language}
            </p>
            <div className="flex items-center justify-center gap-3">
              <span
                className="px-4 py-2 rounded-lg font-bold"
                style={{ background: 'var(--card-secondary)', color: 'var(--text-primary)' }}
              >
                {mappingPairs[activeIndex].language}
              </span>
              <span className="text-xl" style={{ color: 'var(--coral)' }}>
                →
              </span>
              <span
                className="px-4 py-2 rounded-lg font-bold"
                style={{
                  background: 'var(--teal-tint)',
                  color: 'var(--teal)',
                  border: '2px solid var(--teal)',
                }}
              >
                <MathInline>{mappingPairs[activeIndex].algebra}</MathInline>
              </span>
            </div>
          </div>
        </div>
      )}

      {allViewed && (
        <div className="text-center">
          <button
            onClick={onComplete}
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