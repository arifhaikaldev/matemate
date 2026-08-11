import { useState, type FormEvent } from 'react'
import { MathDisplay } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'

export function PracticePairs({
  instruction,
  practicePairEquation,
  onSuccess,
}: {
  instruction: string
  practicePairEquation: string
  onSuccess: () => void
}) {
  const [xVal, setXVal] = useState('')
  const [yVal, setYVal] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [pairs, setPairs] = useState<{ x: number; y: number }[]>([])
  const [completed, setCompleted] = useState(false)

  const parseEquation = (eq: string): ((x: number) => number | null) => {
    const clean = eq.replace(/\s/g, '')
    const m = clean.match(/^(\d*)x\s*\+\s*y\s*=\s*(\d+)/)
    if (m) {
      const coeff = m[1] === '' ? 1 : parseInt(m[1])
      const total = parseInt(m[2])
      return (x: number) => total - coeff * x
    }
    const m2 = clean.match(/^x\s*\+\s*y\s*=\s*(\d+)/)
    if (m2) {
      const total = parseInt(m2[1])
      return (x: number) => total - x
    }
    return () => null
  }

  const computeFn = parseEquation(practicePairEquation)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setAttempted(true)
    const x = parseFloat(xVal)
    const y = parseFloat(yVal)
    if (isNaN(x) || isNaN(y)) return

    const expectedY = computeFn(x)
    if (expectedY !== null && Math.abs(y - expectedY) < 0.01) {
      setPairs((prev) => [...prev, { x, y }])
      setXVal('')
      setYVal('')
      setAttempted(false)
      setCorrect(true)
      setTimeout(() => {
        setCorrect(false)
        if (pairs.length >= 1) {
          setCompleted(true)
          setTimeout(onSuccess, 1000)
        }
      }, 800)
    }
  }

  if (completed) {
    return (
      <div className="fade-in text-center py-8">
        <Feedback type="correct" message="Semua pasangan penyelesaian ditemui!" />
      </div>
    )
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d p-5 text-center">
        <MathDisplay>{practicePairEquation}</MathDisplay>
      </div>

      {pairs.length > 0 && (
        <div className="text-center">
          <div className="card-3d inline-block p-3">
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--teal)' }}>
              Pasangan ditemui:
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              {pairs.map((p, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg font-bold text-sm"
                  style={{ background: 'var(--teal-tint)', color: 'var(--teal)' }}
                >
                  ({p.x}, {p.y})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3 flex-wrap">
        <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>x =</span>
        <input
          type="number"
          value={xVal}
          onChange={(e) => { setXVal(e.target.value); setAttempted(false) }}
          className="w-20 px-3 py-3 rounded-xl text-center font-bold text-lg outline-none"
          style={{
            background: 'var(--card)',
            border: '2px solid var(--border)',
            color: 'var(--text-primary)',
          }}
          autoFocus
        />
        <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>y =</span>
        <input
          type="number"
          value={yVal}
          onChange={(e) => { setYVal(e.target.value); setAttempted(false) }}
          className="w-20 px-3 py-3 rounded-xl text-center font-bold text-lg outline-none"
          style={{
            background: 'var(--card)',
            border: '2px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
          style={{ background: 'var(--teal)' }}
        >
          Semak
        </button>
      </form>

      {attempted && !correct && (
        <Feedback type="incorrect" message="Pasangan ini tidak memenuhi persamaan. Cuba nilai lain." />
      )}
    </div>
  )
}