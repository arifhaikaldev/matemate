import { useState } from 'react'
import { MathDisplay } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'

interface Props {
  instruction: string
  storyBuildEquation: string
  onSuccess: () => void
}

const storyFragments = [
  { id: 'dua-kali', text: 'Dua kali' },
  { id: 'satu-nombor', text: 'satu nombor' },
  { id: 'ditambah', text: 'ditambah' },
  { id: 'nombor-lain', text: 'satu nombor lain' },
  { id: 'menghasilkan', text: 'menghasilkan' },
  { id: 'lima-belas', text: '15' },
]

const correctStory = ['dua-kali', 'satu-nombor', 'ditambah', 'nombor-lain', 'menghasilkan', 'lima-belas']

export function StoryBuilder({
  instruction,
  storyBuildEquation,
  onSuccess,
}: Props) {
  const [placed, setPlaced] = useState<typeof storyFragments>([])
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const available = storyFragments.filter((f) => !placed.some((p) => p.id === f.id))

  const addToStory = (fragment: typeof storyFragments[0]) => {
    if (succeeded) return
    setPlaced((prev) => [...prev, fragment])
    setAttempted(false)
  }

  const removeFromStory = (id: string) => {
    if (succeeded) return
    setPlaced((prev) => prev.filter((p) => p.id !== id))
    setAttempted(false)
  }

  const checkStory = () => {
    setAttempted(true)
    const placedIds = placed.map((p) => p.id)
    const isCorrect =
      placedIds.length === correctStory.length &&
      placedIds.every((id, i) => id === correctStory[i])

    if (isCorrect) {
      setSucceeded(true)
      setTimeout(onSuccess, 1200)
    }
  }

  const reset = () => {
    setPlaced([])
    setAttempted(false)
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d p-5 text-center">
        <MathDisplay>{storyBuildEquation}</MathDisplay>
      </div>

      {/* Story area */}
      <div
        className="card-3d min-h-[80px] flex items-center justify-center gap-2 flex-wrap p-4"
        style={{
          borderColor: succeeded ? 'var(--teal)' : attempted && !succeeded ? 'var(--coral)' : 'var(--border)',
          background: succeeded ? 'var(--teal-tint)' : 'var(--card)',
        }}
      >
        {placed.length === 0 && (
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Susun frasa untuk membina cerita yang sepadan dengan persamaan
          </span>
        )}
        {placed.map((f) => (
          <button
            key={f.id}
            onClick={() => removeFromStory(f.id)}
            className="px-4 py-3 rounded-xl font-medium transition-all duration-200"
            style={{
              background: succeeded ? 'var(--teal-tint)' : 'var(--card-secondary)',
              border: `2px solid ${succeeded ? 'var(--teal)' : 'var(--border)'}`,
              color: 'var(--text-primary)',
              cursor: succeeded ? 'default' : 'pointer',
            }}
          >
            {f.text}
          </button>
        ))}
      </div>

      {/* Available fragments */}
      {!succeeded && (
        <div className="flex gap-2 justify-center flex-wrap">
          {available.map((f) => (
            <button
              key={f.id}
              onClick={() => addToStory(f)}
              className="px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: 'var(--card-secondary)',
                border: '2px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              {f.text}
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      {placed.length > 0 && !succeeded && (
        <div className="flex gap-3 justify-center">
          {placed.length === storyFragments.length && (
            <button
              onClick={checkStory}
              className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
              style={{ background: 'var(--teal)' }}
            >
              Semak
            </button>
          )}
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl font-bold transition-all duration-200"
            style={{
              background: 'var(--card-secondary)',
              border: '2px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            Mulakan Semula
          </button>
        </div>
      )}

      {attempted && !succeeded && (
        <Feedback type="incorrect" message="Cerita tidak tepat. Cuba padankan setiap komponen persamaan dengan frasa." />
      )}

      {succeeded && (
        <Feedback type="correct" message="Tepat! Cerita itu sepadan dengan persamaan." />
      )}
    </div>
  )
}