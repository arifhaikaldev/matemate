import { useState } from 'react'
import { MathInline } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'
import type { SortItem, SortCategory } from '../../types'

interface Props {
  instruction: string
  items: SortItem[]
  categories: SortCategory[]
  correctMap: Record<string, string>
  onSuccess: () => void
  incorrectFeedback?: string
  meaningQuestion?: string
  meaningChoices?: { id: string; label: string }[]
  meaningAnswer?: string
}

export function SortCards({
  instruction,
  items,
  categories,
  correctMap,
  onSuccess,
  incorrectFeedback,
  meaningQuestion,
  meaningChoices,
  meaningAnswer,
}: Props) {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [wrongItems, setWrongItems] = useState<Set<string>>(new Set())
  const [meaningSelected, setMeaningSelected] = useState<string | null>(null)
  const [meaningChecked, setMeaningChecked] = useState(false)
  const [meaningCorrect, setMeaningCorrect] = useState(false)

  const allAssigned = items.every((item) => assignments[item.id])

  const handleAssign = (itemId: string, categoryId: string) => {
    if (isCorrect) return
    setAssignments((prev) => ({ ...prev, [itemId]: categoryId }))
    setShowFeedback(false)
    setWrongItems(new Set())
  }

  const handleCheck = () => {
    const wrong = new Set<string>()
    let allCorrect = true
    for (const item of items) {
      if (assignments[item.id] !== correctMap[item.id]) {
        wrong.add(item.id)
        allCorrect = false
      }
    }
    setWrongItems(wrong)
    setShowFeedback(true)

    if (allCorrect) {
      setIsCorrect(true)
      if (!meaningQuestion) {
        setTimeout(onSuccess, 1000)
      }
    }
  }

  const handleMeaningCheck = () => {
    setMeaningChecked(true)
    if (meaningSelected === meaningAnswer) {
      setMeaningCorrect(true)
      setTimeout(onSuccess, 1000)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      {/* Unassigned items */}
      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Persamaan:
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          {items.map((item) => {
            if (assignments[item.id]) return null
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!isCorrect) setAssignments((prev) => ({ ...prev, [item.id]: categories[0].id }))
                }}
                className={`px-4 py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
                  wrongItems.has(item.id) ? 'shake' : ''
                }`}
                style={{
                  background: wrongItems.has(item.id)
                    ? 'var(--coral-tint)'
                    : 'var(--card-secondary)',
                  border: `2px solid ${
                    wrongItems.has(item.id) ? 'var(--coral)' : 'var(--border)'
                  }`,
                  color: 'var(--text-primary)',
                  cursor: isCorrect ? 'default' : 'pointer',
                }}
              >
                <MathInline>{item.latex}</MathInline>
              </button>
            )
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-xl p-4 min-h-[120px] transition-all duration-200"
            style={{
              background: 'var(--card-secondary)',
              border: `2px dashed var(--border)`,
            }}
          >
            <p className="font-bold text-sm mb-3" style={{ color: 'var(--teal)' }}>
              {cat.label}
            </p>
            <div className="flex flex-col gap-2">
              {items
                .filter((item) => assignments[item.id] === cat.id)
                .map((item) => (
<div
                      key={item.id}
                      onClick={() => {
                        if (!isCorrect) {
                          const currentIdx = categories.findIndex(c => c.id === assignments[item.id])
                          const nextIdx = currentIdx + 1
                          if (nextIdx < categories.length) {
                            handleAssign(item.id, categories[nextIdx].id)
                          } else {
                            setAssignments((prev) => {
                              const next = { ...prev }
                              delete next[item.id]
                              return next
                            })
                          }
                        }
                      }}
                    className={`px-3 py-2 rounded-lg font-bold text-center transition-all duration-200 ${
                      wrongItems.has(item.id) ? 'shake' : ''
                    }`}
                    style={{
                      background: wrongItems.has(item.id)
                        ? 'var(--coral-tint)'
                        : 'var(--card)',
                      border: `2px solid ${
                        wrongItems.has(item.id)
                          ? 'var(--coral)'
                          : isCorrect
                            ? 'var(--teal)'
                            : 'var(--border)'
                      }`,
                      color: 'var(--text-primary)',
                      cursor: isCorrect ? 'default' : 'pointer',
                    }}
                  >
                    <MathInline>{item.latex}</MathInline>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {allAssigned && !isCorrect && (
        <div className="text-center">
          <button
            onClick={handleCheck}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'var(--coral)' }}
          >
            Semak
          </button>
        </div>
      )}

      {showFeedback && !isCorrect && (
        <Feedback type="incorrect" message={incorrectFeedback || 'Perhatikan bilangan pemboleh ubah dan kuasa.'} />
      )}

      {isCorrect && !meaningQuestion && (
        <Feedback type="correct" message="Satu pemboleh ubah + kuasa pemboleh ubah = 1." />
      )}

      {isCorrect && meaningQuestion && (
        <div className="space-y-4 slide-up">
          <Feedback type="correct" message="Semua betul! Sekarang jawab satu soalan lagi:" />
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {meaningQuestion}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {meaningChoices?.map((c) => (
              <button
                key={c.id}
                onClick={() => setMeaningSelected(c.id)}
                className="px-5 py-3 rounded-xl font-medium transition-all duration-200"
                style={{
                  background:
                    meaningSelected === c.id ? 'var(--teal-tint)' : 'var(--card-secondary)',
                  border: `2px solid ${
                    meaningSelected === c.id ? 'var(--teal)' : 'var(--border)'
                  }`,
                  color: 'var(--text-primary)',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
          {meaningSelected && !meaningCorrect && (
            <div className="text-center">
              <button
                onClick={handleMeaningCheck}
                className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
                style={{ background: 'var(--teal)' }}
              >
                Semak
              </button>
            </div>
          )}
          {meaningChecked && !meaningCorrect && (
            <Feedback type="incorrect" message="Cuba fikir: apa yang menjadikan persamaan linear?" />
          )}
          {meaningCorrect && (
            <Feedback type="correct" message="Tepat! Satu pemboleh ubah dan kuasanya 1." />
          )}
        </div>
      )}
    </div>
  )
}