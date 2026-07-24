// DragOrderScreen — drag cards into the correct order

import type { DragEvent } from 'react'
import { useState } from 'react'
import type { DragOrderScreen as TDragOrder } from '../../types'

function shuffleOnce(arr: string[]): string[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface Props {
  screen: TDragOrder
  onNext: (correct: boolean) => void
}

export function DragOrderScreen({ screen, onNext }: Props) {
  const [items, setItems] = useState<string[]>(() => shuffleOnce(screen.items))
  const [dragging, setDragging] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const isCorrect =
    submitted && items.every((item, i) => item === screen.correctOrder[i])

  const handleDragStart = (i: number) => setDragging(i)

  const handleDragOver = (e: DragEvent, i: number) => {
    e.preventDefault()
    if (dragging === null || dragging === i) return
    const next = [...items]
    const [moved] = next.splice(dragging, 1)
    next.splice(i, 0, moved)
    setItems(next)
    setDragging(i)
  }

  const handleDragEnd = () => setDragging(null)

  // Touch support — swap on tap when one is already selected
  const [touchSelected, setTouchSelected] = useState<number | null>(null)

  const handleTap = (i: number) => {
    if (submitted) return
    if (touchSelected === null) {
      setTouchSelected(i)
    } else if (touchSelected === i) {
      setTouchSelected(null)
    } else {
      const next = [...items]
      ;[next[touchSelected], next[i]] = [next[i], next[touchSelected]]
      setItems(next)
      setTouchSelected(null)
    }
  }

  const handleSubmit = () => setSubmitted(true)

  const handleNext = () => {
    onNext(isCorrect)
    setItems(shuffleOnce(screen.items))
    setSubmitted(false)
    setTouchSelected(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-base font-bold text-duo-charcoal dark:text-gray-100 leading-snug">
        {screen.question}
      </p>
      <p className="text-xs text-duo-gray">Seret atau ketik dua kad untuk tukar kedudukan.</p>

      <div className="flex flex-wrap gap-2 min-h-12 p-3 rounded-2xl border-2 border-dashed border-duo-gray-light dark:border-white/15">
        {items.map((item, i) => {
          let cls =
            'px-4 py-2 rounded-xl border-2 font-bold text-base cursor-grab select-none transition-all '
          if (submitted) {
            cls +=
              item === screen.correctOrder[i]
                ? 'border-duo-green bg-duo-green-light dark:bg-duo-green/20 text-duo-green-dark'
                : 'border-duo-red bg-duo-red-light dark:bg-duo-red/20 text-duo-red'
          } else {
            cls +=
              touchSelected === i
                ? 'border-duo-blue bg-duo-blue-light dark:bg-duo-blue/20 text-duo-blue scale-105'
                : 'border-duo-gray-light dark:border-white/15 bg-white dark:bg-white/5 text-duo-charcoal dark:text-gray-100 hover:border-duo-blue/50'
          }

          return (
            <div
              key={`${item}-${i}`}
              className={cls}
              draggable={!submitted}
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              onClick={() => handleTap(i)}
              role="button"
              aria-label={`${item}, kedudukan ${i + 1}`}
              aria-selected={touchSelected === i}
            >
              {item}
            </div>
          )
        })}
      </div>

      {submitted && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
            isCorrect
              ? 'bg-duo-green-light dark:bg-duo-green/20 text-duo-green-dark'
              : 'bg-duo-red-light dark:bg-duo-red/20 text-duo-red'
          }`}
          role="alert"
        >
          {isCorrect ? (
            <span className="font-black">Betul! Susunan yang tepat.</span>
          ) : (
            <>
              <span className="font-black">Belum tepat. </span>
              Susunan betul: {screen.correctOrder.join(', ')}
            </>
          )}
        </div>
      )}

      <button
        onClick={submitted ? handleNext : handleSubmit}
        className="btn btn-primary w-full"
      >
        {submitted ? 'Seterusnya' : 'Semak Jawapan'}
      </button>
    </div>
  )
}
