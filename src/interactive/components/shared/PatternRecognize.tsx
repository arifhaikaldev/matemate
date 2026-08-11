import { useState } from 'react'
import { Feedback } from '../ui/Feedback'
import type { Choice } from '../../types'

interface Props {
  instruction: string
  patternPoints: { x: number; y: number }[]
  patternOptions: Choice[]
  onSuccess: () => void
}

export function PatternRecognize({
  instruction,
  patternPoints,
  patternOptions,
  onSuccess,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSelect = (id: string) => {
    if (succeeded) return
    setSelected(id)
    setAttempted(true)
    if (id === 'straight') {
      setSucceeded(true)
      setTimeout(onSuccess, 1200)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d p-6 text-center">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {patternPoints.map((pt, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                background: 'var(--coral-tint)',
                border: '2px solid var(--coral)',
                color: 'var(--coral)',
              }}
            >
              ({pt.x},{pt.y})
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <svg width={200} height={200} style={{ background: 'var(--card-secondary)', borderRadius: '0.5rem' }}>
            <line x1={20} y1={180} x2={180} y2={180} stroke="var(--text-muted)" strokeWidth={1} />
            <line x1={20} y1={20} x2={20} y2={180} stroke="var(--text-muted)" strokeWidth={1} />
            {patternPoints.map((pt, i) => (
              <circle
                key={i}
                cx={20 + pt.x * 60}
                cy={180 - pt.y * 40}
                r={5}
                fill="var(--coral)"
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </svg>
        </div>
      </div>

      <p className="font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
        Apakah corak yang anda lihat?
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        {patternOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className={`px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200 ${
              attempted && selected === opt.id && opt.id !== 'straight' ? 'shake' : ''
            }`}
            style={{
              background:
                selected === opt.id
                  ? opt.id === 'straight'
                    ? 'var(--teal-tint)'
                    : 'var(--coral-tint)'
                  : 'var(--card-secondary)',
              border: `2px solid ${
                selected === opt.id
                  ? opt.id === 'straight'
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

      {attempted && selected !== 'straight' && (
        <Feedback type="incorrect" message="Cuba bayangkan garis yang melalui semua titik tersebut." />
      )}

      {succeeded && (
        <Feedback type="correct" message="Ya! Titik-titik membentuk satu garis lurus." />
      )}
    </div>
  )
}