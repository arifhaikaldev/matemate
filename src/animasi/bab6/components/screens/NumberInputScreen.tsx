import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualArea } from '../ui/VisualArea'
import { VisualRenderer } from './VisualRenderer'
import type { Moment } from '../../types'

interface Props {
  moment: Moment
  onAnswer: (correct: boolean) => void
}

export function NumberInputScreen({ moment, onAnswer }: Props) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const hints = moment.interaction?.hints ?? []
  const question = moment.interaction?.question ?? ''
  const correctAnswer = moment.interaction?.correctAnswer

  const handleSubmit = () => {
    if (!value.trim() || submitted) return
    const num = parseFloat(value.trim())
    const correct = num === correctAnswer
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

      <input
        type="number"
        value={value}
        onChange={(e) => !submitted && setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !submitted && handleSubmit()}
        disabled={submitted}
        placeholder="Taip jawapan..."
        className={`w-full rounded-2xl border-2 px-4 py-3 text-lg font-bold text-center bg-white dark:bg-white/5 transition-colors outline-none ${
          submitted
            ? isCorrect
              ? 'border-duo-green text-duo-green-dark'
              : 'border-duo-red text-duo-red'
            : 'border-duo-gray-light dark:border-white/15 text-duo-charcoal dark:text-gray-100 focus:border-duo-blue'
        }`}
        aria-label="Masukkan jawapan"
      />

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
            <span className="font-black mr-1">
              {isCorrect ? 'Betul!' : `Jawapan: ${correctAnswer}.`}
            </span>
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
            disabled={!value.trim()}
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