import { useState } from 'react'
import { MathDisplay, MathInline } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'

interface OperationStep {
  equationBefore: string
  operation?: string
  equationAfter: string
  explanation: string
}

interface Props {
  instruction: string
  initialEquation: string
  steps: OperationStep[]
  onSuccess: () => void
}

export function GuidedSolve({
  instruction,
  initialEquation,
  steps,
  onSuccess,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleContinue = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setCompleted(true)
      setTimeout(onSuccess, 1000)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      {/* Equation display */}
      <div
        className="card-3d text-center p-6 transition-all duration-300"
        style={
          completed ? { borderColor: 'var(--teal)', background: 'var(--teal-tint)' } : undefined
        }
      >
        <MathDisplay>{initialEquation}</MathDisplay>

        {/* Step-by-step progress */}
        <div className="space-y-4 mt-4">
          {steps.slice(0, currentStep + 1).map((step, i) => (
            <div key={i} className="slide-up space-y-2">
              <div
                className="flex items-center justify-center gap-3 text-lg flex-wrap"
                style={{
                  color: 'var(--text-primary)',
                }}
              >
                <span
                  className="px-3 py-1 rounded-lg text-sm font-mono"
                  style={{ background: 'var(--card-secondary)', color: 'var(--text-secondary)' }}
                >
                  <MathInline>{step.operation ?? ''}</MathInline>
                </span>
                <span>→</span>
                <span
                  className="px-4 py-2 rounded-lg font-bold"
                  style={{
                    background: 'var(--teal-tint)',
                    color: 'var(--teal)',
                    border: '2px solid var(--teal)',
                  }}
                >
                  <MathInline>{step.equationAfter}</MathInline>
                </span>
              </div>
              <p
                className="text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                {step.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {!completed && (
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            {currentStep === 0
              ? 'Langkah seterusnya'
              : currentStep < steps.length - 1
                ? 'Langkah seterusnya'
                : 'Selesaikan'}
          </button>
        </div>
      )}

      {completed && (
        <Feedback type="correct" message="Selesai! Anda telah menyelesaikan persamaan langkah demi langkah." />
      )}
    </div>
  )
}

// Simpler practice version - sequential equations to solve
export function PracticeSolve({
  instruction,
  equations,
  onComplete,
}: {
  instruction: string
  equations: { equation: string; answer: number; steps: OperationStep[] }[]
  onComplete: () => void
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [solvedAll, setSolvedAll] = useState(false)

  const current = equations[currentIndex]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAttempted(true)
    if (parseFloat(inputValue) === current.answer) {
      setCorrect(true)
      setTimeout(() => {
        if (currentIndex < equations.length - 1) {
          setCurrentIndex((i) => i + 1)
          setInputValue('')
          setAttempted(false)
          setCorrect(false)
        } else {
          setSolvedAll(true)
          setTimeout(onComplete, 1000)
        }
      }, 1000)
    }
  }

  if (solvedAll) {
    return (
      <div className="fade-in text-center py-8">
        <Feedback type="correct" message="Semua soalan dijawab dengan betul! Hebat!" />
      </div>
    )
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction} ({currentIndex + 1}/{equations.length})
      </p>

      <div key={currentIndex} className="slide-up space-y-4">
        <div className="card-3d text-center p-6">
          <MathDisplay>{current.equation}</MathDisplay>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3">
          <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
            x =
          </span>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setAttempted(false)
            }}
            className="w-24 px-4 py-3 rounded-xl text-center font-bold text-lg outline-none transition-all duration-200"
            style={{
              background: 'var(--card)',
              border: `2px solid ${
                attempted && !correct
                  ? 'var(--coral)'
                  : correct
                    ? 'var(--teal)'
                    : 'var(--border)'
              }`,
              color: 'var(--text-primary)',
            }}
            autoFocus
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
          <Feedback type="incorrect" message="Cuba lagi. Gunakan operasi songsang pada kedua-dua belah." />
        )}
        {correct && <Feedback type="correct" message="Betul!" />}
      </div>
    </div>
  )
}

// Context solve - like 6.1.4-4 where student chooses operations
export function ContextSolve({
  instruction,
  equation,
  steps,
  onSuccess,
}: {
  instruction: string
  equation: string
  steps: { question: string; options: string[]; correct: string }[]
  onSuccess: () => void
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [currentEquation] = useState(equation)

  const step = steps[stepIndex]

  const handleSelect = (opt: string) => {
    if (completed) return
    setSelected(opt)
    setAttempted(true)
    if (opt === step.correct) {
      if (stepIndex < steps.length - 1) {
        setTimeout(() => {
          setStepIndex((i) => i + 1)
          setSelected(null)
          setAttempted(false)
        }, 800)
      } else {
        setCompleted(true)
        setTimeout(onSuccess, 1200)
      }
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d text-center p-6">
        <MathDisplay>{currentEquation}</MathDisplay>
      </div>

      {!completed && step && (
        <div className="space-y-4 slide-up">
          <p className="font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
            {step.question}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {step.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`px-5 py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
                  attempted && selected === opt && opt !== step.correct ? 'shake' : ''
                }`}
                style={{
                  background: selected === opt ? 'var(--coral-tint)' : 'var(--card-secondary)',
                  border: `2px solid ${
                    selected === opt ? 'var(--coral)' : 'var(--border)'
                  }`,
                  color: 'var(--text-primary)',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          {attempted && selected !== step.correct && (
            <Feedback type="incorrect" message="Cuba fikirkan operasi songsang yang sesuai." />
          )}
        </div>
      )}

      {completed && (
        <Feedback type="correct" message="Persamaan selesai! Mari tafsir jawapan." />
      )}
    </div>
  )
}