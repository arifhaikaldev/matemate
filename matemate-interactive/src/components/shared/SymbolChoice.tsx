import { useState } from 'react'
import { MathInline } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'
import type { Choice } from '../../types'

interface Props {
  instruction: string
  symbols: Choice[]
  correctId: string
  onSuccess: () => void
  feedbackLabel?: string
}

export function SymbolChoice({
  instruction,
  symbols,
  correctId,
  onSuccess,
  feedbackLabel = 'Kita perlukan sesuatu yang mewakili nombor yang belum diketahui.',
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSelect = (id: string) => {
    if (succeeded) return
    setSelected(id)
    setAttempted(true)
    if (id === correctId) {
      setSucceeded(true)
      setTimeout(onSuccess, 1200)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div
        className="card-3d inline-block mx-auto p-6 text-center"
        style={
          succeeded
            ? { borderColor: 'var(--teal)', background: 'var(--teal-tint)' }
            : undefined
        }
      >
        <div className="flex items-center justify-center gap-3 text-2xl flex-wrap">
          <span>5</span>
          <span style={{ color: 'var(--text-muted)' }}>+</span>
          <span
            className="inline-flex items-center justify-center w-14 h-14 rounded-lg border-2 border-dashed font-bold text-xl transition-all duration-500"
            style={{
              background: succeeded ? 'var(--teal-tint)' : 'var(--coral-tint)',
              borderColor: succeeded ? 'var(--teal)' : 'var(--coral)',
              color: succeeded ? 'var(--teal)' : 'var(--coral)',
            }}
          >
            {succeeded ? 'x' : '?'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>=</span>
          <span>12</span>
        </div>
      </div>

      {!succeeded && (
        <div className="space-y-3">
          <p className="font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
            Pilih simbol untuk mewakili nombor yang belum diketahui:
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {symbols.map((s) => {
              const isSelected = selected === s.id
              const isWrong = isSelected && attempted && s.id !== correctId
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s.id)}
                  className={`px-6 py-4 rounded-xl font-bold text-xl transition-all duration-200 ${
                    isWrong ? 'shake' : ''
                  }`}
                  style={{
                    background: isSelected ? 'var(--coral-tint)' : 'var(--card-secondary)',
                    border: `2px solid ${
                      isSelected ? 'var(--coral)' : 'var(--border)'
                    }`,
                    color: isSelected ? 'var(--coral)' : 'var(--text-primary)',
                  }}
                >
                  {s.latex ? <MathInline>{s.latex}</MathInline> : s.label}
                </button>
              )
            })}
          </div>
          {attempted && selected && selected !== correctId && (
            <Feedback type="incorrect" message={feedbackLabel} />
          )}
        </div>
      )}

      {succeeded && (
        <div className="text-center bounce-enter">
          <p className="text-xl font-bold" style={{ color: 'var(--teal)' }}>
            x mewakili nombor yang belum diketahui!
          </p>
        </div>
      )}
    </div>
  )
}