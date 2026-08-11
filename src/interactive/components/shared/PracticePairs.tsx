import { useState, type FormEvent } from 'react'
import { MathDisplay } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'

interface PairTask {
  equation: string
  pairsNeeded: number
}

interface Props {
  instruction: string
  practicePairEquation: string
  onSuccess: () => void
  pairTasks?: PairTask[]
}

export function PracticePairs({
  instruction,
  practicePairEquation,
  onSuccess,
  pairTasks,
}: Props) {
  const taskList: PairTask[] = pairTasks?.length
    ? pairTasks
    : [{ equation: practicePairEquation, pairsNeeded: 2 }]
  const [taskIndex, setTaskIndex] = useState(0)
  const currentTask = taskList[taskIndex]
  const [xVal, setXVal] = useState('')
  const [yVal, setYVal] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [pairs, setPairs] = useState<{ x: number; y: number }[]>([])
  const [completed, setCompleted] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [verifySelected, setVerifySelected] = useState<string | null>(null)
  const [verifyAttempted, setVerifyAttempted] = useState(false)

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

  const computeFn = parseEquation(currentTask.equation)

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
        if (pairs.length >= currentTask.pairsNeeded - 1) {
          if (taskIndex < taskList.length - 1) {
            setTaskIndex((i) => i + 1)
            setPairs([])
          } else {
            if (taskList.length === 1 && taskIndex === 0) {
              setCompleted(true)
              setTimeout(onSuccess, 1000)
            } else {
              setShowVerify(true)
            }
          }
        }
      }, 800)
    }
  }

  const handleVerifySelect = (val: string) => {
    if (verifyAttempted) return
    setVerifySelected(val)
    setVerifyAttempted(true)
    if (val === 'yes') {
      setTimeout(onSuccess, 1200)
    }
  }

  if (completed) {
    return (
      <div className="fade-in text-center py-8">
        <Feedback type="correct" message="Semua pasangan penyelesaian ditemui!" />
      </div>
    )
  }

  if (showVerify) {
    return (
      <div className="fade-in space-y-6">
        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          Tentukan sama ada (3,0) memenuhi persamaan 2x + y = 6.
        </p>
        <div className="card-3d p-5 text-center">
          <MathDisplay>2x + y = 6</MathDisplay>
          <p className="mt-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
            Gantikan x=3, y=0: 2(3) + 0 = 6
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          {[
            { id: 'yes', label: 'Ya, 6 = 6 ✓' },
            { id: 'no', label: 'Tidak, tidak sama' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleVerifySelect(opt.id)}
              className="px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200"
              style={{
                background: verifySelected === opt.id ? (opt.id === 'yes' ? 'var(--teal-tint)' : 'var(--coral-tint)') : 'var(--card-secondary)',
                border: `2px solid ${
                  verifySelected === opt.id
                    ? opt.id === 'yes' ? 'var(--teal)' : 'var(--coral)'
                    : 'var(--border)'
                }`,
                color: 'var(--text-primary)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {verifyAttempted && verifySelected === 'no' && (
          <Feedback type="incorrect" message="Cuba kira semula: 2(3) + 0 = 6 + 0 = 6. Jadi ia memenuhi persamaan." />
        )}
      </div>
    )
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction} {taskList.length > 1 && `(Tugasan ${taskIndex + 1}/${taskList.length})`}
      </p>

      {taskList.length > 1 && (
        <div className="flex items-center gap-2 justify-center">
          {taskList.map((_, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: i < taskIndex ? 'var(--teal-tint)' : i === taskIndex ? 'var(--coral-tint)' : 'var(--card-secondary)',
                border: `2px solid ${i < taskIndex ? 'var(--teal)' : i === taskIndex ? 'var(--coral)' : 'var(--border)'}`,
                color: i < taskIndex ? 'var(--teal)' : i === taskIndex ? 'var(--coral)' : 'var(--text-muted)',
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      )}

      <div className="card-3d p-5 text-center">
        <MathDisplay>{currentTask.equation}</MathDisplay>
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