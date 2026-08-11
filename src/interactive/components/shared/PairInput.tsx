import { useState, type FormEvent } from 'react'
import { Feedback } from '../ui/Feedback'

interface Props {
  instruction: string
  pairTarget: number
  pairOperation: string
  onSuccess: () => void
}

export function PairInput({
  instruction,
  pairTarget,
  pairOperation,
  onSuccess,
}: Props) {
  const [val1, setVal1] = useState('')
  const [val2, setVal2] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [pairs, setPairs] = useState<{ a: number; b: number }[]>([])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setAttempted(true)
    const a = parseFloat(val1)
    const b = parseFloat(val2)
    if (isNaN(a) || isNaN(b)) return

    const diff = a - b
    if (Math.abs(diff - pairTarget) < 0.01) {
      setPairs((prev) => [...prev, { a, b }])
      setVal1('')
      setVal2('')
      setAttempted(false)
      if (pairs.length >= 2) {
        setSucceeded(true)
        setTimeout(onSuccess, 1200)
      }
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d p-6 max-w-sm mx-auto text-center">
        <p className="font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>
          Cari pasangan nombor dengan {pairOperation} {pairTarget}
        </p>

        {pairs.length > 0 && (
          <div className="mb-4 space-y-1">
            <p className="text-sm font-medium" style={{ color: 'var(--teal)' }}>
              Pasangan ditemui:
            </p>
            {pairs.map((p, i) => (
              <div
                key={i}
                className="inline-block px-3 py-1 rounded-lg text-sm font-bold mx-1"
                style={{ background: 'var(--teal-tint)', color: 'var(--teal)' }}
              >
                {p.a} - {p.b} = {p.a - p.b}
              </div>
            ))}
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              ({3 - pairs.length} lagi diperlukan)
            </p>
          </div>
        )}

        {!succeeded && (
          <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3 flex-wrap">
            <input
              type="number"
              value={val1}
              onChange={(e) => { setVal1(e.target.value); setAttempted(false) }}
              className="w-24 px-4 py-3 rounded-xl text-center font-bold text-lg outline-none transition-all duration-200"
              style={{
                background: 'var(--card)',
                border: '2px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              placeholder="Nombor 1"
              autoFocus
            />
            <span className="text-xl font-bold" style={{ color: 'var(--text-muted)' }}>−</span>
            <input
              type="number"
              value={val2}
              onChange={(e) => { setVal2(e.target.value); setAttempted(false) }}
              className="w-24 px-4 py-3 rounded-xl text-center font-bold text-lg outline-none transition-all duration-200"
              style={{
                background: 'var(--card)',
                border: '2px solid var(--border)',
                color: 'var(--text-primary)',
              }}
              placeholder="Nombor 2"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
              style={{ background: 'var(--teal)' }}
            >
              Semak
            </button>
          </form>
        )}

        {attempted && (
          <Feedback type="incorrect" message={`Beza mestilah ${pairTarget}. Cuba lagi.`} />
        )}
      </div>

      {succeeded && (
        <Feedback type="correct" message="Hebat! Banyak pasangan yang memenuhi hubungan ini." />
      )}
    </div>
  )
}