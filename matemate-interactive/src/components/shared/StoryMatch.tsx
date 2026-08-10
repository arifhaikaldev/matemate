import { useState } from 'react'
import { MathDisplay } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'

interface Props {
  instruction: string
  algebraEquation: string
  stories: { id: string; text: string }[]
  correctStoryId: string
  onSuccess: () => void
}

export function StoryMatch({
  instruction,
  algebraEquation,
  stories,
  correctStoryId,
  onSuccess,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const handleSelect = (id: string) => {
    if (succeeded) return
    setSelected(id)
    setAttempted(true)
    if (id === correctStoryId) {
      setSucceeded(true)
      setTimeout(onSuccess, 1200)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div
        className="card-3d text-center p-5"
        style={
          succeeded ? { borderColor: 'var(--teal)', background: 'var(--teal-tint)' } : undefined
        }
      >
        <MathDisplay>{algebraEquation}</MathDisplay>
      </div>

      <div className="space-y-3">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => handleSelect(story.id)}
            className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
              attempted && selected === story.id && story.id !== correctStoryId
                ? 'shake'
                : ''
            }`}
            style={{
              background:
                selected === story.id
                  ? succeeded
                    ? 'var(--teal-tint)'
                    : 'var(--coral-tint)'
                  : 'var(--card-secondary)',
              border: `2px solid ${
                selected === story.id
                  ? succeeded
                    ? 'var(--teal)'
                    : 'var(--coral)'
                  : 'var(--border)'
              }`,
              color: 'var(--text-primary)',
            }}
          >
            <p className="font-medium">{story.text}</p>
          </button>
        ))}
      </div>

      {attempted && selected !== correctStoryId && (
        <Feedback
          type="incorrect"
          message="Cuba lihat setiap komponen persamaan dan padankan dengan operasi dalam cerita."
        />
      )}

      {succeeded && (
        <Feedback type="correct" message="Tepat! Cerita itu sepadan dengan persamaan." />
      )}
    </div>
  )
}