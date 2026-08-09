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

export function MCQuestionScreen({ moment, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [hintLevel, setHintLevel] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const choices = moment.interaction?.choices ?? []
  const hints = moment.interaction?.hints ?? []

  const handleSubmit = () => {
    if (selected === null || submitted) return
    setSubmitted(true)
    const correct = choices[selected]?.correct ?? false
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

      <div className="space-y-2">
        {choices.map((choice, i) => {
          const isSelected = selected === i
          let borderColor = 'border-gray-200 dark:border-gray-700'
          let bgColor = 'bg-white dark:bg-gray-800'
          let textColor = 'text-duo-charcoal dark:text-gray-200'

          if (submitted) {
            if (choice.correct) {
              borderColor = 'border-duo-green'
              bgColor = 'bg-duo-green-light/30 dark:bg-duo-green/10'
              textColor = 'text-duo-green-dark dark:text-duo-green'
            } else if (isSelected && !choice.correct) {
              borderColor = 'border-duo-red'
              bgColor = 'bg-duo-red/10'
              textColor = 'text-duo-red'
            }
          } else if (isSelected) {
            borderColor = 'border-duo-purple'
            bgColor = 'bg-duo-purple/10'
            textColor = 'text-duo-purple'
          }

          return (
            <motion.button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              whileTap={!submitted ? { scale: 0.98 } : undefined}
              className={`w-full text-left rounded-xl border-2 px-4 py-3.5 transition-all ${borderColor} ${bgColor} ${textColor}`}
            >
              <span className="text-sm font-bold">{choice.label}</span>
            </motion.button>
          )
        })}
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
              disabled={selected === null}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                selected !== null
                  ? 'bg-duo-purple text-white shadow-md hover:bg-duo-purple/90'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Semak
            </motion.button>
            {hintLevel < Math.min(3, hints.length) && !submitted && (
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