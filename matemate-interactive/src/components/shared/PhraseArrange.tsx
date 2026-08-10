import { useState } from 'react'
import { Feedback } from '../ui/Feedback'
import type { PhraseFragment } from '../../types'

interface Props {
  instruction: string
  phrases: PhraseFragment[]
  correctOrder: string[]
  onSuccess: () => void
}

export function PhraseArrange({
  instruction,
  phrases,
  correctOrder,
  onSuccess,
}: Props) {
  const [placed, setPlaced] = useState<PhraseFragment[]>([])
  const [attempted, setAttempted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set())

  const available = phrases.filter((p) => !placed.some((pp) => pp.id === p.id))

  const addToSequence = (phrase: PhraseFragment) => {
    if (correct) return
    setPlaced((prev) => [...prev, phrase])
    setAttempted(false)
  }

  const removeFromSequence = (id: string) => {
    if (correct) return
    setPlaced((prev) => prev.filter((p) => p.id !== id))
    setAttempted(false)
  }

  const checkOrder = () => {
    setAttempted(true)
    const placedIds = placed.map((p) => p.id)
    const isCorrect =
      placedIds.length === correctOrder.length &&
      placedIds.every((id, i) => id === correctOrder[i])

    if (isCorrect) {
      setCorrect(true)
      setTimeout(onSuccess, 1200)
    } else {
      const wrong = new Set<string>()
      placedIds.forEach((id, i) => {
        if (id !== correctOrder[i]) wrong.add(id)
      })
      setWrongIds(wrong)
    }
  }

  const reset = () => {
    setPlaced([])
    setAttempted(false)
    setWrongIds(new Set())
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      {/* Sequence area */}
      <div
        className="card-3d min-h-[80px] flex items-center justify-center gap-2 flex-wrap p-4"
        style={{
          borderColor: correct
            ? 'var(--teal)'
            : attempted && !correct
              ? 'var(--coral)'
              : 'var(--border)',
          background: correct ? 'var(--teal-tint)' : 'var(--card)',
        }}
      >
        {placed.length === 0 && (
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Susun frasa di bawah mengikut urutan
          </span>
        )}
        {placed.map((phrase) => {
          const isWrong = wrongIds.has(phrase.id)
          return (
            <button
              key={phrase.id}
              onClick={() => removeFromSequence(phrase.id)}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isWrong ? 'shake' : ''
              }`}
              style={{
                background: isWrong
                  ? 'var(--coral-tint)'
                  : correct
                    ? 'var(--teal-tint)'
                    : 'var(--card-secondary)',
                border: `2px solid ${
                  isWrong
                    ? 'var(--coral)'
                    : correct
                      ? 'var(--teal)'
                      : 'var(--border)'
                }`,
                color: 'var(--text-primary)',
                cursor: correct ? 'default' : 'pointer',
              }}
            >
              {phrase.text}
            </button>
          )
        })}
      </div>

      {/* Available phrases */}
      {!correct && (
        <div className="flex gap-2 justify-center flex-wrap">
          {available.map((phrase) => (
            <button
              key={phrase.id}
              onClick={() => addToSequence(phrase)}
              className="px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              style={{
                background: 'var(--card-secondary)',
                border: '2px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              {phrase.text}
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      {placed.length > 0 && !correct && (
        <div className="flex gap-3 justify-center">
          {placed.length === phrases.length && (
            <button
              onClick={checkOrder}
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

      {attempted && !correct && (
        <Feedback
          type="incorrect"
          message="Urutan tidak tepat. Cuba susun mengikut urutan hubungan matematik."
        />
      )}

      {correct && (
        <div className="text-center bounce-enter">
          <Feedback type="correct" message="Urutan betul! Sekarang kita boleh wakilkan dalam simbol." />
        </div>
      )}
    </div>
  )
}