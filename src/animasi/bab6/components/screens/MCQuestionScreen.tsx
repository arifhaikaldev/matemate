import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualArea } from '../ui/VisualArea'
import { VisualRenderer } from './VisualRenderer'
import type { Moment } from '../../types'

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
    <div className="h-full flex flex-col px-5 py-4 space-y-3 overflow-y-auto">
      <div className="flex-shrink-0">
        <h2 className="text-sm font-bold text-duo-gray uppercase tracking-widest">
          {moment.title}
        </h2>
        <p className="text-xs text-duo-charcoal/60 dark:text-gray-400 mt-0.5">{moment.objective}</p>
      </div>

      {moment.visual && (
        <div className="flex-shrink-0">
          <VisualArea>
            <VisualRenderer visual={moment.visual} />
          </VisualArea>
        </div>
      )}

      <p className="text-sm font-bold text-duo-charcoal dark:text-gray-200 flex-shrink-0">
        {question}
      </p>

      <div className="space-y-2 flex-shrink-0">
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

      {/* Explanation panel */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex-shrink-0 p-4 rounded-xl ${
              isCorrect
                ? 'bg-duo-green-light/50 dark:bg-duo-green/10 border border-duo-green/40'
                : 'bg-duo-red/10 border border-duo-red/30'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className={`text-lg font-black flex-shrink-0 ${isCorrect ? 'text-duo-green' : 'text-duo-red'}`}>
                {isCorrect ? '✓' : '✗'}
              </span>
              <div>
                <p className={`text-sm font-bold ${isCorrect ? 'text-duo-green-dark dark:text-duo-green' : 'text-duo-red'}`}>
                  {isCorrect ? 'Betul!' : 'Maaf, tidak tepat.'}
                </p>
                {!isCorrect && (
                  <p className="text-xs text-duo-charcoal/70 dark:text-gray-300 mt-1">
                    Jawapan betul: <span className="font-bold">{correctLabel}</span>
                  </p>
                )}
                {hints.length > 0 && (
                  <p className="text-xs text-duo-charcoal/60 dark:text-gray-400 mt-1 italic">
                    {hints[hints.length - 1]}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-shrink-0">
        {!submitted ? (
          <motion.button
            onClick={handleSubmit}
            disabled={selected === null}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              selected !== null
                ? 'bg-duo-purple text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Semak
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