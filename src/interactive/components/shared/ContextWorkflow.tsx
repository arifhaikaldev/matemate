import { useState, type FormEvent } from 'react'
import { Feedback } from '../ui/Feedback'

interface WorkflowStep {
  instruction: string
  type: string
}

interface Props {
  instruction: string
  workflowSteps: WorkflowStep[]
  onSuccess: () => void
}

export function ContextWorkflow({
  instruction,
  workflowSteps,
  onSuccess,
}: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)

  const step = workflowSteps[stepIndex]

  const handleIdentify = (id: string) => {
    if (completed) return
    setSelectedId(id)
    if (id === 'unknown' || id === 'x-y') {
      setSelectedId(null)
      if (stepIndex < workflowSteps.length - 1) {
        setStepIndex((i) => i + 1)
      } else {
        setCompleted(true)
        setTimeout(onSuccess, 1200)
      }
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (stepIndex < workflowSteps.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      setCompleted(true)
      setTimeout(onSuccess, 1200)
    }
  }

  if (completed) {
    return (
      <div className="fade-in text-center py-8">
        <Feedback type="correct" message="Lengkap! Anda telah menyelesaikan semua langkah." />
      </div>
    )
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="flex items-center gap-2 justify-center mb-4">
        {workflowSteps.map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
            style={{
              background: i < stepIndex ? 'var(--teal-tint)' : i === stepIndex ? 'var(--coral-tint)' : 'var(--card-secondary)',
              border: `2px solid ${i < stepIndex ? 'var(--teal)' : i === stepIndex ? 'var(--coral)' : 'var(--border)'}`,
              color: i < stepIndex ? 'var(--teal)' : i === stepIndex ? 'var(--coral)' : 'var(--text-muted)',
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      <div key={stepIndex} className="slide-up card-3d p-6">
        <p className="font-medium text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
          {step.instruction}
        </p>

        {step.type === 'identify' && (
          <div className="flex gap-3 justify-center flex-wrap">
            {[
              { id: 'unknown', label: 'Kuantiti tidak diketahui' },
              { id: 'known', label: 'Kuantiti diketahui' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleIdentify(opt.id)}
                className="px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200"
                style={{
                  background: selectedId === opt.id ? 'var(--teal-tint)' : 'var(--card-secondary)',
                  border: `2px solid ${selectedId === opt.id ? 'var(--teal)' : 'var(--border)'}`,
                  color: 'var(--text-primary)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {step.type === 'solve' && (
          <form onSubmit={handleSubmit} className="text-center">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
              style={{ background: 'var(--teal)' }}
            >
              Selesaikan
            </button>
          </form>
        )}

        {step.type === 'verify' && (
          <form onSubmit={handleSubmit} className="text-center">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
              style={{ background: 'var(--teal)' }}
            >
              Semak dalam konteks
            </button>
          </form>
        )}

        {step.type === 'success' && (
          <div className="text-center">
            <button
              onClick={() => {
                setCompleted(true)
                setTimeout(onSuccess, 800)
              }}
              className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
              style={{ background: 'var(--teal)' }}
            >
              Selesai
            </button>
          </div>
        )}
      </div>
    </div>
  )
}