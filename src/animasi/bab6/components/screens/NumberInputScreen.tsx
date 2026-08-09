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

      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type="number"
          value={value}
          onChange={(e) => !submitted && setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={submitted}
          placeholder="Masukkan jawapan..."
          className={`flex-1 px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800 font-bold text-lg text-center outline-none transition-all ${
            submitted
              ? isCorrect
                ? 'border-duo-green dark:border-duo-green'
                : 'border-duo-red dark:border-duo-red'
              : 'border-gray-200 dark:border-gray-700 focus:border-duo-purple'
          }`}
        />
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
                    Jawapan betul: <span className="font-bold">{correctAnswer}</span>
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
            disabled={!value.trim()}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              value.trim()
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