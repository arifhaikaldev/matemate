import { useState } from 'react'
import { MathInline, MathDisplay } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'
import type { Choice } from '../../types'

interface Props {
  instruction: string
  timelineNow: string
  timelineFuture: string
  timelineLabel: string
  question?: string
  choices?: Choice[]
  correctChoiceId?: string
  onSuccess: () => void
  showAge?: boolean
  age?: number
  futureAge?: number
}

export function Timeline({
  instruction,
  timelineNow,
  timelineFuture,
  timelineLabel,
  question,
  choices,
  correctChoiceId,
  onSuccess,
  showAge,
  age,
  futureAge,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSelect = (id: string) => {
    if (succeeded) return
    setSelected(id)
    setAttempted(true)
    if (id === correctChoiceId) {
      setSucceeded(true)
      setTimeout(onSuccess, 1200)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      {/* Timeline */}
      <div className="card-3d p-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Now */}
          <div className="flex flex-col items-center text-center flex-1">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl mb-2"
              style={{
                background: 'var(--teal-tint)',
                border: '3px solid var(--teal)',
                color: 'var(--teal)',
              }}
            >
              {showAge && age !== undefined ? age : '?'}
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {timelineNow}
            </span>
          </div>

          {/* Arrow */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-[120px]">
              <div className="h-0.5 w-full" style={{ background: 'var(--border)' }} />
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 text-xs font-bold whitespace-nowrap"
                style={{ background: 'var(--card)', color: 'var(--text-muted)' }}
              >
                {timelineLabel}
              </span>
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0"
                style={{
                  borderLeft: '8px solid var(--border)',
                  borderTop: '6px solid transparent',
                  borderBottom: '6px solid transparent',
                }}
              />
            </div>
          </div>

          {/* Future */}
          <div className="flex flex-col items-center text-center flex-1">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl mb-2 transition-all duration-500`}
              style={{
                background: 'var(--coral-tint)',
                border: '3px solid var(--coral)',
                color: 'var(--coral)',
              }}
            >
              {showAge && futureAge !== undefined ? futureAge : '? '}
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {timelineFuture}
            </span>
          </div>
        </div>
      </div>

      {question && choices && !succeeded && (
        <div className="space-y-3">
          <p className="font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
            {question}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {choices.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className="px-6 py-3 rounded-xl font-medium text-lg transition-all duration-200"
                style={{
                  background:
                    selected === c.id ? 'var(--teal-tint)' : 'var(--card-secondary)',
                  border: `2px solid ${
                    selected === c.id ? 'var(--teal)' : 'var(--border)'
                  }`,
                  color: 'var(--text-primary)',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
          {attempted && selected !== correctChoiceId && (
            <Feedback type="incorrect" message="Cuba fikir: adakah umur sekarang lebih besar atau lebih kecil?" />
          )}
        </div>
      )}

      {succeeded && choices && (
        <Feedback type="correct" message="Betul! Jom teruskan." />
      )}
    </div>
  )
}

// Identify unknown component
export function IdentifyUnknown({
  instruction,
  options,
  correctId,
  onSuccess,
}: {
  instruction: string
  options: Choice[]
  correctId: string
  onSuccess: () => void
}) {
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
    <div className="fade-in space-y-4">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt.id)}
            className={`px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200 ${
              attempted && selected === opt.id && opt.id !== correctId ? 'shake' : ''
            }`}
            style={{
              background:
                selected === opt.id ? 'var(--teal-tint)' : 'var(--card-secondary)',
              border: `2px solid ${
                selected === opt.id ? 'var(--teal)' : 'var(--border)'
              }`,
              color: 'var(--text-primary)',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {attempted && selected !== correctId && (
        <Feedback type="incorrect" message="Cuba lihat kuantiti yang tidak diketahui pada garis masa." />
      )}
      {succeeded && <Feedback type="correct" message="Tepat! Itu yang tidak diketahui." />}
    </div>
  )
}

// Verify answer component (for 6.1.4-5)
export function AgeVerify({
  instruction,
  verifyLatex,
  resultLatex,
  question,
  onSuccess,
}: {
  instruction: string
  verifyLatex: string
  resultLatex: string
  question: string
  onSuccess: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSelect = (val: string) => {
    if (succeeded) return
    setSelected(val)
    setAttempted(true)
    if (val === 'yes') {
      setSucceeded(true)
      setTimeout(onSuccess, 1200)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d p-6 text-center space-y-4">
        <MathDisplay>{verifyLatex}</MathDisplay>
        <div
          className="inline-block px-4 py-2 rounded-xl font-bold text-lg"
          style={{ background: 'var(--teal-tint)', color: 'var(--teal)' }}
        >
          <MathInline>{resultLatex}</MathInline>
        </div>
      </div>

      <p className="font-medium text-center" style={{ color: 'var(--text-primary)' }}>
        {question}
      </p>
      <div className="flex gap-4 justify-center">
        {['yes', 'no'].map((val) => (
          <button
            key={val}
            onClick={() => handleSelect(val)}
            className="px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200"
            style={{
              background: selected === val ? 'var(--teal-tint)' : 'var(--card-secondary)',
              border: `2px solid ${
                selected === val ? 'var(--teal)' : 'var(--border)'
              }`,
              color: 'var(--text-primary)',
            }}
          >
            {val === 'yes' ? 'Ya' : 'Tidak'}
          </button>
        ))}
      </div>
      {attempted && selected === 'no' && (
        <Feedback type="incorrect" message="Cuba kira semula: tiga kali umur sekarang." />
      )}
      {succeeded && <Feedback type="correct" message="Jawapan betul! Kedua-dua belah sama." />}
    </div>
  )
}