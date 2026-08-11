import { useState } from 'react'
import { MathDisplay } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'

interface GraphCase {
  id: string
  label: string
  description: string
  equations: string[]
  correctMeaning: string
}

interface Props {
  instruction: string
  graphCases: GraphCase[]
  onSuccess: () => void
}

export function GraphCases({
  instruction,
  graphCases,
  onSuccess,
}: Props) {
  const [currentCase, setCurrentCase] = useState(0)
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [completed, setCompleted] = useState(false)

  const c = graphCases[currentCase]

  const handleSelect = (meaning: string) => {
    if (completed) return
    setSelectedMeaning(meaning)
    setAttempted(true)
    if (meaning === c.correctMeaning) {
      if (currentCase < graphCases.length - 1) {
        setTimeout(() => {
          setCurrentCase((i) => i + 1)
          setSelectedMeaning(null)
          setAttempted(false)
        }, 1000)
      } else {
        setCompleted(true)
        setTimeout(onSuccess, 1200)
      }
    }
  }

  const meanings = [
    { id: 'one-solution', label: 'Satu penyelesaian' },
    { id: 'no-solution', label: 'Tiada penyelesaian' },
    { id: 'infinite-solutions', label: 'Penyelesaian tak terhingga' },
  ]

  if (completed) {
    return (
      <div className="fade-in text-center py-8">
        <Feedback type="correct" message="Semua kes graf difahami dengan betul!" />
      </div>
    )
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div key={currentCase} className="slide-up space-y-4">
        <div className="card-3d p-6 text-center">
          <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--teal)' }}>
            {c.label}
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            {c.description}
          </p>
          <div className="space-y-1">
            {c.equations.map((eq, i) => (
              <div
                key={i}
                className="inline-block px-4 py-2 rounded-lg font-bold mx-1"
                style={{ background: 'var(--card-secondary)', color: 'var(--text-primary)' }}
              >
                <MathDisplay>{eq}</MathDisplay>
              </div>
            ))}
          </div>
        </div>

        <p className="font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
          Apakah maksud kes ini?
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          {meanings.map((m) => (
            <button
              key={m.id}
              onClick={() => handleSelect(m.id)}
              className={`px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200 ${
                attempted && selectedMeaning === m.id && m.id !== c.correctMeaning ? 'shake' : ''
              }`}
              style={{
                background:
                  selectedMeaning === m.id
                    ? m.id === c.correctMeaning
                      ? 'var(--teal-tint)'
                      : 'var(--coral-tint)'
                    : 'var(--card-secondary)',
                border: `2px solid ${
                  selectedMeaning === m.id
                    ? m.id === c.correctMeaning
                      ? 'var(--teal)'
                      : 'var(--coral)'
                    : 'var(--border)'
                }`,
                color: 'var(--text-primary)',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {attempted && selectedMeaning !== c.correctMeaning && (
          <Feedback type="incorrect" message="Cuba kira bilangan titik persilangan antara dua garis." />
        )}
      </div>
    </div>
  )
}