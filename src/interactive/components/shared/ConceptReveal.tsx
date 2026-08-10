import { useState } from 'react'
import { MathInline } from '../ui/MathDisplay'
import type { EquationPart } from '../../types'

interface Props {
  instruction: string
  parts: EquationPart[]
  onComplete: () => void
}

export function ConceptReveal({ instruction, parts, onComplete }: Props) {
  const [viewed, setViewed] = useState<Set<number>>(new Set())
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleClick = (index: number) => {
    setViewed((prev) => new Set(prev).add(index))
    setActiveIndex(index)
  }

  const allViewed = viewed.size >= parts.length

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d p-6 text-center">
        <div className="flex items-center justify-center gap-1 flex-wrap text-2xl mb-3">
          {parts.map((part, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`px-3 py-2 rounded-lg font-bold transition-all duration-300 ${
                activeIndex === i ? 'scale-110' : ''
              }`}
              style={{
                background: viewed.has(i) ? 'var(--teal-tint)' : 'var(--card-secondary)',
                border: `2px solid ${activeIndex === i ? 'var(--teal)' : 'transparent'}`,
                color: 'var(--text-primary)',
              }}
            >
              <MathInline>{part.component}</MathInline>
            </button>
          ))}
        </div>

        {activeIndex !== null && (
          <div className="slide-up mt-4 p-4 rounded-xl" style={{ background: 'var(--teal-tint)' }}>
            <p className="text-base font-medium" style={{ color: 'var(--teal)' }}>
              {parts[activeIndex].meaning}
            </p>
          </div>
        )}
      </div>

      {/* Mini-map of all meanings */}
      {parts.map((part, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
            viewed.has(i) ? '' : 'opacity-30'
          }`}
          style={{
            background: viewed.has(i) ? 'var(--card-secondary)' : 'transparent',
          }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{
              background: 'var(--teal-tint)',
              border: '2px solid var(--teal)',
              color: 'var(--teal)',
            }}
          >
            <MathInline>{part.component}</MathInline>
          </div>
          <span style={{ color: 'var(--text-primary)' }}>{part.label}</span>
          <span className="ml-auto text-sm" style={{ color: 'var(--text-secondary)' }}>
            {part.meaning}
          </span>
        </div>
      ))}

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