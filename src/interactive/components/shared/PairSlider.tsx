import { useState } from 'react'
import { MathDisplay } from '../ui/MathDisplay'

interface Props {
  instruction: string
  equation: string
  sliderMin?: number
  sliderMax?: number
  sliderDefault?: number
  onSuccess: () => void
}

function parsePairEquation(eq: string): (x: number) => number | null {
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

export function PairSlider({
  instruction,
  equation,
  sliderMin = 0,
  sliderMax = 5,
  sliderDefault = 0,
  onSuccess,
}: Props) {
  const [xVal, setXVal] = useState(sliderDefault)
  const [observed, setObserved] = useState(false)
  const [history, setHistory] = useState<{ x: number; y: number }[]>([])

  const computeFn = parsePairEquation(equation)
  const yVal = computeFn(xVal)

  const handleChange = (v: number) => {
    setXVal(v)
    if (!observed) setObserved(true)
  }

  const addToTable = () => {
    if (yVal === null) return
    setHistory((prev) => {
      const exists = prev.some((p) => p.x === xVal && p.y === yVal)
      if (exists) return prev
      return [...prev, { x: xVal, y: yVal }]
    })
  }

  const handleDone = () => {
    addToTable()
    setTimeout(onSuccess, 800)
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d p-5 text-center">
        <MathDisplay>{equation}</MathDisplay>
      </div>

      <div className="card-3d p-6 max-w-sm mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1 text-center">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl mx-auto mb-2"
              style={{ background: 'var(--teal-tint)', border: '2px solid var(--teal)', color: 'var(--teal)' }}
            >
              {xVal}
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              x
            </span>
          </div>

          <span className="text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>
            →
          </span>

          <div className="flex-1 text-center">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl mx-auto mb-2"
              style={{ background: 'var(--coral-tint)', border: '2px solid var(--coral)', color: 'var(--coral)' }}
            >
              {yVal !== null ? yVal : '?'}
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              y
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            x: {xVal}
          </label>
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            value={xVal}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: 'var(--teal-tint)',
              accentColor: 'var(--teal)',
            }}
          />
          <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>{sliderMin}</span>
            <span>{sliderMax}</span>
          </div>
        </div>
      </div>

      {observed && (
        <div className="text-center">
          <button
            onClick={addToTable}
            className="px-5 py-2 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            Simpan pasangan ({xVal}, {yVal})
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="slide-up text-center">
          <div className="card-3d inline-block p-4">
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--teal)' }}>
              Pasangan penyelesaian:
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              {history.map((p, i) => (
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

      {history.length >= 3 && (
        <div className="text-center">
          <button
            onClick={handleDone}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'var(--coral)' }}
          >
            Seterusnya
          </button>
        </div>
      )}
    </div>
  )
}