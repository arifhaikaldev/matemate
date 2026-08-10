import { useState } from 'react'

export function Feedback({
  type,
  message,
  onDismiss,
}: {
  type: 'correct' | 'incorrect'
  message: string
  onDismiss?: () => void
}) {
  const [visible] = useState(true)

  const bg = type === 'correct' ? 'var(--teal-tint)' : 'var(--coral-tint)'
  const accent = type === 'correct' ? 'var(--teal)' : 'var(--coral)'
  const icon = type === 'correct' ? '✓' : '✗'

  return (
    <div
      className={`slide-up rounded-xl p-4 mt-4 flex items-start gap-3 ${visible ? 'bounce-enter' : ''}`}
      style={{ background: bg, border: `1px solid ${accent}` }}
    >
      <span
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold"
        style={{ background: accent }}
      >
        {icon}
      </span>
      <div className="flex-1">
        <p style={{ color: 'var(--text-primary)' }} className="font-medium">
          {message}
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--text-secondary)' }}
        >
          Tutup
        </button>
      )}
    </div>
  )
}