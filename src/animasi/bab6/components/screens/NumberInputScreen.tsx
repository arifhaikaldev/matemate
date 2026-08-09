import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualArea } from '../ui/VisualArea'
import { HintPanel } from '../ui/HintPanel'
import { VisualRenderer } from './VisualRenderer'
import type { Moment } from '../../types'

interface Props {
  moment: Moment
  onAnswer: (correct: boolean) => void
}

export function NumberInputScreen({ moment, onAnswer }: Props) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [hintLevel, setHintLevel] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const hints = moment.interaction?.hints ?? []
  const correctAnswer = moment.interaction?.correctAnswer

  const handleSubmit = () => {
    if (!value.trim() || submitted) return
    setSubmitted(true)
    const num = parseFloat(value.trim())
    const correct = num === correctAnswer
    if (!correct) {
      setShowHint(true)
    }
    setTimeout(() => {
      onAnswer(correct)
    }, correct ? 800 : 1500)
  }

  const handleHint = () => {
    if (hintLevel < 3 && hintLevel < hints.length) {
      setHintLevel((l) => l + 1)
      setShowHint(true)
    }
  }

  return (
    <motion.div
      key={moment.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <div>
        <h2 className="text-lg font-black text-duo-charcoal dark:text-gray-100">
          {moment.title}
        </h2>
        <p className="text-xs text-duo-gray font-medium mt-0.5">{moment.objective}</p>
      </div>

      {moment.visual && (
        <VisualArea>
          <VisualRenderer visual={moment.visual} />
        </VisualArea>
      )}

      <p className="text-sm font-bold text-duo-charcoal dark:text-gray-200">
        {moment.interaction?.question}
      </p>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => !submitted && setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={submitted}
          placeholder="Masukkan jawapan..."
          className={`flex-1 px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800 font-bold text-lg text-center outline-none transition-all ${
            submitted
              ? 'border-duo-green dark:border-duo-green'
              : 'border-gray-200 dark:border-gray-700 focus:border-duo-purple'
          }`}
        />
      </div>

      <AnimatePresence>
        {showHint && (
          <HintPanel hints={hints} level={hintLevel} />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 pt-1">
        {!submitted && (
          <>
            <motion.button
              onClick={handleSubmit}
              disabled={!value.trim()}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                value.trim()
                  ? 'bg-duo-purple text-white shadow-md hover:bg-duo-purple/90'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Semak
            </motion.button>
            {hintLevel < Math.min(3, hints.length) && (
              <motion.button
                onClick={handleHint}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-3 rounded-xl bg-duo-orange-light/50 dark:bg-duo-orange/10 border border-duo-orange/30 text-duo-orange font-bold text-sm hover:bg-duo-orange-light/80 transition-all"
              >
                Hint
              </motion.button>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}