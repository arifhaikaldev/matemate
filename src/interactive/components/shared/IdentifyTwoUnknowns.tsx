import { useState } from 'react'
import { Feedback } from '../ui/Feedback'
import type { Choice } from '../../types'

interface Props {
  instruction: string
  options: Choice[]
  correctIds: string[]
  onSuccess: () => void
}

export function IdentifyTwoUnknowns({
  instruction,
  options,
  correctIds,
  onSuccess,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleToggle = (id: string) => {
    if (succeeded) return
    setAttempted(false)
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleCheck = () => {
    setAttempted(true)
    const allCorrect = correctIds.every((id) => selectedIds.has(id))
    const noExtra = selectedIds.size === correctIds.length
    if (allCorrect && noExtra) {
      setSucceeded(true)
      setTimeout(onSuccess, 1200)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <p className="font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
        Pilih dua kuantiti yang belum diketahui:
      </p>

      <div className="flex gap-3 justify-center flex-wrap">
        {options.map((opt) => {
          const isSelected = selectedIds.has(opt.id)
          const isCorrect = succeeded && correctIds.includes(opt.id)
          const isWrong = attempted && isSelected && !correctIds.includes(opt.id)
          return (
            <button
              key={opt.id}
              onClick={() => handleToggle(opt.id)}
              className={`px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200 ${
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
                opacity: succeeded && !correctIds.includes(opt.id) ? 0.4 : 1,
              }}
            >
              {opt.label}
              {isSelected && <span className="ml-2">✓</span>}
            </button>
          )
        })}
      </div>

      {selectedIds.size >= 2 && !succeeded && (
        <div className="text-center">
          <button
            onClick={handleCheck}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            Semak
          </button>
        </div>
      )}

      {attempted && !succeeded && (
        <Feedback type="incorrect" message="Cuba fikir: apakah dua harga tiket yang tidak diketahui?" />
      )}

      {succeeded && (
        <Feedback type="correct" message="Tepat! Harga tiket dewasa (x) dan harga tiket kanak-kanak (y) tidak diketahui." />
      )}
    </div>
  )
}