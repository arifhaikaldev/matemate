import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualArea } from '../ui/VisualArea'
import { VisualRenderer } from './VisualRenderer'
import type { Moment } from '../../types'

const CHOICE_LABELS = ['A', 'B', 'C', 'D']

interface Props {
  moment: Moment
  onAnswer: (correct: boolean) => void
}

export function MCQuestionScreen({ moment, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const choices = moment.interaction?.choices ?? []
  const hints = moment.interaction?.hints ?? []
  const question = moment.interaction?.question ?? ''
  const correctLabel = choices.find((c) => c.correct)?.label ?? ''

  const handleSubmit = () => {
    if (selected === null || submitted) return
    const correct = choices[selected]?.correct ?? false
    setIsCorrect(correct)
    setSubmitted(true)
    onAnswer(correct)
  }

  return (
    <div className="min-h-full w-full bg-white dark:bg-white/5 rounded-3xl p-5 shadow-sm border border-duo-gray-light dark:border-white/10 space-y-4">
      <div>
        <h2 className="text-sm font-bold text-duo-gray uppercase tracking-widest">
          {moment.title}
        </h2>
        <p className="text-xs text-duo-charcoal/60 dark:text-gray-400 mt-0.5">{moment.objective}</p>
      </div>

      {moment.visual && (
        <div>
          <VisualArea>
            <VisualRenderer visual={moment.visual} />
          </VisualArea>
        </div>
      )}

      <p className="text-base font-bold text-duo-charcoal dark:text-gray-100 leading-snug">
        {question}
      </p>

      <div className="flex flex-col gap-3">
        {choices.map((choice, i) => {
          let cls =
            'flex items-center gap-3 w-full px-4 py-3 rounded-2xl border-2 text-left font-semibold text-base transition-all '
          if (!submitted) {
            cls +=
              selected === i
                ? 'border-duo-blue bg-duo-blue-light dark:bg-duo-blue/20 text-duo-blue'
                : 'border-duo-gray-light dark:border-white/15 bg-white dark:bg-white/5 text-duo-charcoal dark:text-gray-100 hover:border-duo-blue/50'
          } else {
            if (choice.correct) {
              cls += 'border-duo-green bg-duo-green-light dark:bg-duo-green/20 text-duo-green-dark'
            } else if (i === selected && !choice.correct) {
              cls += 'border-duo-red bg-duo-red-light dark:bg-duo-red/20 text-duo-red'
            } else {
              cls +=
                'border-duo-gray-light dark:border-white/10 bg-white dark:bg-white/5 text-duo-gray opacity-50'
            }
          }

          return (
            <motion.button
              key={i}
              className={cls}
              onClick={() => !submitted && setSelected(i)}
              whileTap={!submitted ? { scale: 0.98 } : undefined}
              aria-pressed={selected === i}
              disabled={submitted}
            >
              <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-black flex-shrink-0">
                {CHOICE_LABELS[i]}
              </span>
              <span>{choice.label}</span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              isCorrect
                ? 'bg-duo-green-light dark:bg-duo-green/20 text-duo-green-dark'
                : 'bg-duo-red-light dark:bg-duo-red/20 text-duo-red'
            }`}
            role="alert"
          >
            <span className="font-black mr-1">{isCorrect ? 'Betul!' : 'Tidak tepat.'}</span>
            {!isCorrect && (
              <span>
                Jawapan betul: <span className="font-bold">{correctLabel}</span>
              </span>
            )}
            {!isCorrect && hints.length > 0 && (
              <p className="text-xs text-duo-charcoal/60 dark:text-gray-400 mt-1 italic">
                {hints[hints.length - 1]}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        {!submitted ? (
          <motion.button
            onClick={handleSubmit}
            disabled={selected === null}
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary w-full disabled:opacity-40"
          >
            Semak Jawapan
          </motion.button>
        ) : (
          <p className="text-center text-xs text-duo-gray font-medium">
            Skrol ke bawah untuk momen seterusnya
          </p>
        )}
      </div>
    </div>
  )
}