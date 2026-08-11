import { useState } from 'react'
import { MathDisplay } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'

interface SubstitutionStep {
  instruction: string
  equation: string
}

interface Props {
  instruction: string
  substitutionSystem: { eq1: string; eq2: string }
  substitutionSteps: SubstitutionStep[]
  onSuccess: () => void
}

export function SubstitutionBuilder({
  instruction,
  substitutionSystem,
  substitutionSteps,
  onSuccess,
}: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [viewed, setViewed] = useState<Set<number>>(new Set())
  const [completed, setCompleted] = useState(false)

  const handleView = (idx: number) => {
    setViewed((prev) => new Set(prev).add(idx))
  }

  const handleContinue = () => {
    if (stepIndex < substitutionSteps.length - 1) {
      setStepIndex((i) => i + 1)
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

      {/* System display */}
      <div className="card-3d p-5 text-center space-y-2">
        <div className="inline-block px-4 py-2 rounded-lg font-bold" style={{ background: 'var(--teal-tint)', color: 'var(--teal)' }}>
          <MathDisplay>{substitutionSystem.eq1}</MathDisplay>
        </div>
        <div className="inline-block px-4 py-2 rounded-lg font-bold" style={{ background: 'var(--coral-tint)', color: 'var(--coral)' }}>
          <MathDisplay>{substitutionSystem.eq2}</MathDisplay>
        </div>
      </div>

      {/* Step-by-step */}
      <div className="space-y-4">
        {substitutionSteps.slice(0, stepIndex + 1).map((step, i) => {
          const isActive = i === stepIndex && !viewed.has(i)
          return (
            <div
              key={i}
              className={`slide-up card-3d p-4 transition-all duration-300 ${
                viewed.has(i) ? 'opacity-80' : ''
              }`}
              style={{
                borderColor: viewed.has(i) ? 'var(--teal)' : 'var(--coral)',
                background: viewed.has(i) ? 'var(--teal-tint)' : 'var(--card)',
              }}
            >
              <p className="font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                {step.instruction}
              </p>
              {isActive ? (
                <div className="text-center">
                  <button
                    onClick={() => handleView(i)}
                    className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
                    style={{ background: 'var(--coral)' }}
                  >
                    Klik untuk lihat
                  </button>
                </div>
              ) : viewed.has(i) ? (
                <div className="text-center">
                  <div
                    className="inline-block px-4 py-2 rounded-lg font-bold text-lg"
                    style={{ background: 'var(--card)', color: 'var(--text-primary)' }}
                  >
                    <MathDisplay>{step.equation}</MathDisplay>
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      {!completed && (
        <div className="text-center">
          {stepIndex < substitutionSteps.length && (
            <button
              onClick={handleContinue}
              className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
              style={{ background: 'var(--teal)' }}
            >
              {stepIndex < substitutionSteps.length - 1 ? 'Langkah seterusnya' : 'Selesai'}
            </button>
          )}
        </div>
      )}

      {completed && (
        <Feedback type="correct" message="Penggantian berjaya! Setiap x digantikan dengan ungkapan yang sama nilai." />
      )}
    </div>
  )
}