import { useState } from 'react'
import { Feedback } from '../ui/Feedback'

interface MeaningQuestion {
  question: string
  choices: { id: string; label: string }[]
  correctId: string
}

interface Props {
  instruction: string
  questions: MeaningQuestion[]
  onComplete: () => void
  equation?: string
}

export function MeaningCheck({
  instruction,
  questions,
  onComplete,
  equation,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [completed, setCompleted] = useState(false)

  const question = questions[currentIndex]

  const handleSelect = (id: string) => {
    if (correct || completed) return
    setSelected(id)
    setAttempted(true)
    if (id === question.correctId) {
      setCorrect(true)
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((i) => i + 1)
          setSelected(null)
          setAttempted(false)
          setCorrect(false)
        } else {
          setCompleted(true)
          setTimeout(onComplete, 1000)
        }
      }, 1000)
    }
  }

  if (completed) {
    return (
      <div className="fade-in text-center py-8">
        <Feedback type="correct" message="Semua soalan pemahaman dijawab dengan betul!" />
      </div>
    )
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      {equation && (
        <div
          className="card-3d text-center p-4 font-bold text-xl"
          style={{ color: 'var(--teal)' }}
        >
          {equation}
        </div>
      )}

      <div key={currentIndex} className="slide-up space-y-4">
        <div
          className="card-3d p-5"
          style={{ borderColor: 'var(--coral)', background: 'var(--coral-tint)' }}
        >
          <p className="font-medium text-lg" style={{ color: 'var(--text-primary)' }}>
            {question.question}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {question.choices.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-200 ${
                attempted && selected === c.id && c.id !== question.correctId
                  ? 'shake'
                  : ''
              }`}
              style={{
                background:
                  selected === c.id
                    ? correct
                      ? 'var(--teal-tint)'
                      : 'var(--coral-tint)'
                    : 'var(--card-secondary)',
                border: `2px solid ${
                  selected === c.id
                    ? correct
                      ? 'var(--teal)'
                      : 'var(--coral)'
                    : 'var(--border)'
                }`,
                color: 'var(--text-primary)',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {attempted && !correct && (
          <Feedback
            type="incorrect"
            message="Cuba fikirkan maksud konsep ini."
          />
        )}
      </div>
    </div>
  )
}