import { useState, type FormEvent } from 'react'
import { MathInline } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'

interface BuildTile {
  id: string
  label: string
  latex?: string
}

interface WorkflowStep {
  instruction: string
  type: string
  options?: { id: string; label: string }[]
  correctIds?: string[]
  buildTarget?: string
  buildTiles?: BuildTile[]
  answer?: number
  answerLabel?: string
  verifyEquation?: string
  verifyMessage?: string
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [buildWorkspace, setBuildWorkspace] = useState<BuildTile[]>([])
  const [inputValue, setInputValue] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [verifySelected, setVerifySelected] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)

  const step = workflowSteps[stepIndex]

  const advance = () => {
    setSelectedIds(new Set())
    setBuildWorkspace([])
    setInputValue('')
    setAttempted(false)
    setCorrect(false)
    setVerifySelected(null)
    if (stepIndex < workflowSteps.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      setCompleted(true)
      setTimeout(onSuccess, 1000)
    }
  }

  const handleToggle = (id: string) => {
    if (attempted) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const checkIdentify = () => {
    setAttempted(true)
    const allCorrect = (step.correctIds || []).every((id) => selectedIds.has(id))
    const noExtra = selectedIds.size === (step.correctIds || []).length
    if (allCorrect && noExtra) {
      setCorrect(true)
      setTimeout(advance, 1000)
    }
  }

  const handleBuildClick = (tile: BuildTile) => {
    if (attempted) return
    setBuildWorkspace((prev) => [...prev, tile])
  }

  const handleBuildRemove = (i: number) => {
    if (attempted) return
    setBuildWorkspace((prev) => prev.filter((_, idx) => idx !== i))
  }

  const checkBuild = () => {
    setAttempted(true)
    const built = buildWorkspace.map((t) => t.latex || t.label).join('').replace(/\s+/g, '')
    const target = (step.buildTarget || '').replace(/\s+/g, '')
    if (built === target) {
      setCorrect(true)
      setTimeout(advance, 1000)
    }
  }

  const handleSolveSubmit = (e: FormEvent) => {
    e.preventDefault()
    setAttempted(true)
    if (parseFloat(inputValue) === step.answer) {
      setCorrect(true)
      setTimeout(advance, 1000)
    }
  }

  const handleVerifySelect = (id: string) => {
    setVerifySelected(id)
    setAttempted(true)
    if (id === 'yes') {
      setCorrect(true)
      setTimeout(advance, 1000)
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
          <>
            <div className="flex gap-3 justify-center flex-wrap">
              {(step.options || []).map((opt) => {
                const isSelected = selectedIds.has(opt.id)
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleToggle(opt.id)}
                    className="px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200"
                    style={{
                      background: isSelected ? 'var(--teal-tint)' : 'var(--card-secondary)',
                      border: `2px solid ${isSelected ? 'var(--teal)' : 'var(--border)'}`,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {opt.label}
                    {isSelected && <span className="ml-2">✓</span>}
                  </button>
                )
              })}
            </div>
            {selectedIds.size >= 2 && !correct && (
              <div className="text-center mt-4">
                <button
                  onClick={checkIdentify}
                  className="px-6 py-3 rounded-xl font-bold text-white"
                  style={{ background: 'var(--teal)' }}
                >
                  Semak
                </button>
              </div>
            )}
          </>
        )}

        {step.type === 'build' && (
          <>
            <div
              className="card-3d min-h-[60px] flex items-center justify-center gap-1 flex-wrap p-4"
              style={{
                borderColor: correct ? 'var(--teal)' : attempted && !correct ? 'var(--coral)' : 'var(--border)',
                background: correct ? 'var(--teal-tint)' : 'var(--card)',
              }}
            >
              {buildWorkspace.length === 0 && (
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Klik tile untuk membina persamaan
                </span>
              )}
              {buildWorkspace.map((tile, i) => (
                <button
                  key={`${tile.id}-${i}`}
                  onClick={() => handleBuildRemove(i)}
                  className="px-3 py-2 rounded-lg font-bold text-lg"
                  style={{
                    background: 'var(--teal-tint)',
                    border: '2px solid var(--teal)',
                    color: 'var(--teal)',
                  }}
                >
                  {tile.latex ? <MathInline>{tile.latex}</MathInline> : tile.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 justify-center flex-wrap mt-3">
              {(step.buildTiles || []).map((tile) => {
                const used = buildWorkspace.some((w) => w.id === tile.id)
                return (
                  <button
                    key={tile.id}
                    onClick={() => handleBuildClick(tile)}
                    disabled={used}
                    className="px-4 py-3 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105 disabled:opacity-30"
                    style={{
                      background: 'var(--card-secondary)',
                      border: '2px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {tile.latex ? <MathInline>{tile.latex}</MathInline> : tile.label}
                  </button>
                )
              })}
            </div>
            {buildWorkspace.length > 0 && !correct && (
              <div className="flex gap-3 justify-center mt-4">
                <button
                  onClick={checkBuild}
                  className="px-6 py-3 rounded-xl font-bold text-white"
                  style={{ background: 'var(--teal)' }}
                >
                  Semak
                </button>
                <button
                  onClick={() => { setBuildWorkspace([]); setAttempted(false) }}
                  className="px-6 py-3 rounded-xl font-bold"
                  style={{
                    background: 'var(--card-secondary)',
                    border: '2px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Padam
                </button>
              </div>
            )}
          </>
        )}

        {step.type === 'solve' && (
          <form onSubmit={handleSolveSubmit} className="flex items-center justify-center gap-3 mt-2">
            <span className="font-medium text-lg" style={{ color: 'var(--text-secondary)' }}>
              {step.answerLabel || 'x'} =
            </span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setAttempted(false) }}
              className="w-24 px-4 py-3 rounded-xl text-center font-bold text-lg outline-none"
              style={{
                background: 'var(--card)',
                border: `2px solid ${
                  attempted && !correct ? 'var(--coral)' : correct ? 'var(--teal)' : 'var(--border)'
                }`,
                color: 'var(--text-primary)',
              }}
              autoFocus
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl font-bold text-white"
              style={{ background: 'var(--teal)' }}
            >
              Semak
            </button>
          </form>
        )}

        {step.type === 'verify' && (
          <div className="text-center">
            {step.verifyEquation && (
              <div className="mb-4 font-bold text-lg" style={{ color: 'var(--teal)' }}>
                <MathInline>{step.verifyEquation}</MathInline>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              {[
                { id: 'yes', label: 'Ya, memenuhi' },
                { id: 'no', label: 'Tidak memenuhi' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleVerifySelect(opt.id)}
                  className="px-8 py-3 rounded-xl font-bold text-lg transition-all duration-200"
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
          </div>
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

      {attempted && !correct && (
        <Feedback type="incorrect" message={step.verifyMessage || 'Cuba lagi. Semak semula jawapan anda.'} />
      )}
    </div>
  )
}