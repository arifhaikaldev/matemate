import { useState } from 'react'
import { MathDisplay } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'

interface Props {
  instruction: string
  tableEquation: string
  tableXValues?: number[]
  onSuccess: () => void
}

export function PairTable({
  instruction,
  tableEquation,
  tableXValues = [0, 1, 2],
  onSuccess,
}: Props) {
  const [yValues, setYValues] = useState<Record<number, string>>({})
  const [results, setResults] = useState<Record<number, number | null>>({})
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const parseEquation = (eq: string): ((x: number) => number) => {
    const clean = eq.replace(/\s/g, '')
    const match = clean.match(/^(\d*)x\s*([+-])\s*(\d+)?$/)
    if (match) {
      const coeff = match[1] ? parseInt(match[1]) : 1
      const op = match[2]
      const constTerm = match[3] ? parseInt(match[3]) : 0
      return (x: number) => (op === '+' ? coeff * x + constTerm : coeff * x - constTerm)
    }
    const match2 = clean.match(/^x\s*([+-])\s*(\d+)$/)
    if (match2) {
      const op = match2[1]
      const val = parseInt(match2[2])
      return (x: number) => (op === '+' ? x + val : x - val)
    }
    const match3 = clean.match(/^(\d*)x\s*=\s*y/)
    if (match3) {
      const coeff = match3[1] ? parseInt(match3[1]) : 1
      return (x: number) => coeff * x
    }
    const match4 = clean.match(/^(\d*)x\s*\+\s*y\s*=\s*(\d+)/)
    if (match4) {
      const coeff = match4[1] ? parseInt(match4[1]) : 1
      const total = parseInt(match4[2])
      return (x: number) => total - coeff * x
    }
    const match5 = clean.match(/^y\s*=\s*(\d*)x\s*([+-])\s*(\d+)/)
    if (match5) {
      const coeff = match5[1] ? parseInt(match5[1]) : 1
      const op = match5[2]
      const val = parseInt(match5[3])
      return (x: number) => (op === '+' ? coeff * x + val : coeff * x - val)
    }
    const match6 = clean.match(/^y\s*=\s*x\s*([+-])\s*(\d+)/)
    if (match6) {
      const op = match6[1]
      const val = parseInt(match6[2])
      return (x: number) => (op === '+' ? x + val : x - val)
    }
    return () => NaN
  }

  const computeFn = parseEquation(tableEquation)

  const handleYChange = (x: number, val: string) => {
    setYValues((prev) => ({ ...prev, [x]: val }))
    setAttempted(false)
  }

  const handleCheck = () => {
    setAttempted(true)
    const newResults: Record<number, number | null> = {}
    let allCorrect = true

    for (const x of tableXValues) {
      const expected = computeFn(x)
      const entered = parseFloat(yValues[x] || '')
      if (isNaN(expected) || isNaN(entered)) {
        newResults[x] = null
        allCorrect = false
      } else if (Math.abs(entered - expected) < 0.01) {
        newResults[x] = expected
      } else {
        newResults[x] = null
        allCorrect = false
      }
    }

    setResults(newResults)
    if (allCorrect) {
      setSucceeded(true)
      setTimeout(onSuccess, 1200)
    }
  }

  const allFilled = tableXValues.every((x) => yValues[x] && yValues[x] !== '')

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d p-6 text-center">
        <MathDisplay>{tableEquation}</MathDisplay>
      </div>

      <div className="card-3d p-4 max-w-sm mx-auto" style={{ overflowX: 'auto' }}>
        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="px-4 py-2 font-bold" style={{ color: 'var(--teal)' }}>x</th>
              {tableXValues.map((x) => (
                <th key={x} className="px-4 py-2 font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 font-bold" style={{ color: 'var(--coral)' }}>y</td>
              {tableXValues.map((x) => (
                <td key={x} className="px-2 py-2">
                  {succeeded ? (
                    <span className="font-bold text-lg" style={{ color: 'var(--teal)' }}>
                      {computeFn(x)}
                    </span>
                  ) : (
                    <input
                      type="number"
                      value={yValues[x] || ''}
                      onChange={(e) => handleYChange(x, e.target.value)}
                      className="w-20 px-3 py-2 rounded-lg text-center font-bold text-lg outline-none transition-all duration-200"
                      style={{
                        background: 'var(--card)',
                        border: `2px solid ${
                          attempted && results[x] === null
                            ? 'var(--coral)'
                            : attempted && results[x] !== null
                              ? 'var(--teal)'
                              : 'var(--border)'
                        }`,
                        color: 'var(--text-primary)',
                      }}
                    />
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {!succeeded && allFilled && (
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
        <Feedback type="incorrect" message="Ada nilai y yang tidak tepat. Cuba semak semula pengiraan." />
      )}

      {succeeded && (
        <div className="text-center bounce-enter">
          <div className="card-3d inline-block p-4">
            <p className="font-bold" style={{ color: 'var(--teal)' }}>
              Pasangan penyelesaian:
            </p>
            <div className="flex gap-2 justify-center mt-2 flex-wrap">
              {tableXValues.map((x) => (
                <span
                  key={x}
                  className="px-3 py-1 rounded-lg font-bold text-sm"
                  style={{ background: 'var(--teal-tint)', color: 'var(--teal)' }}
                >
                  ({x}, {computeFn(x)})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}