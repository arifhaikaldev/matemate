import { motion } from 'framer-motion'

interface Step {
  text: string
  highlight?: boolean
  operation?: string
}

interface Props {
  equation: string
  steps?: Step[]
  showAnswer?: boolean
  answer?: string
  animate?: boolean
}

export function EquationBlock({
  equation,
  steps,
  showAnswer = false,
  answer,
  animate = true,
}: Props) {
  return (
    <div className="w-full max-w-sm mx-auto space-y-2 p-4 rounded-xl bg-duo-gray-light/30 dark:bg-white/5 border border-duo-gray-light/40 dark:border-white/10">
      {/* Initial equation */}
      <motion.div
        initial={animate ? { opacity: 0, x: -20 } : undefined}
        animate={{ opacity: 1, x: 0 }}
        className="text-center py-2 px-3 rounded-lg bg-white dark:bg-white/10"
      >
        <span className="text-lg font-mono font-bold text-duo-charcoal dark:text-gray-100">
          {equation}
        </span>
      </motion.div>

      {/* Steps */}
      {steps?.map((step, i) => (
        <motion.div
          key={i}
          initial={animate ? { opacity: 0, x: -20 } : undefined}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: (i + 1) * 0.3 }}
          className="flex items-center gap-2"
        >
          {step.operation && (
            <span className="text-xs font-bold text-duo-gray whitespace-nowrap flex-shrink-0 w-16 text-right">
              {step.operation}
            </span>
          )}
          <div
            className={`flex-1 text-center py-2 px-3 rounded-lg font-mono font-bold text-base ${
              step.highlight
                ? 'bg-duo-green-light dark:bg-duo-green/20 text-duo-green-dark dark:text-duo-green ring-2 ring-duo-green'
                : 'bg-white dark:bg-white/10 text-duo-charcoal dark:text-gray-100'
            }`}
          >
            {step.text}
          </div>
        </motion.div>
      ))}

      {/* Answer */}
      {showAnswer && answer && (
        <motion.div
          initial={animate ? { opacity: 0, scale: 0.9 } : undefined}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: (steps?.length ?? 0) * 0.3 + 0.3, type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center py-3 px-4 rounded-xl bg-duo-green/10 dark:bg-duo-green/20 border-2 border-duo-green"
        >
          <span className="text-xs font-bold text-duo-green-dark dark:text-duo-green uppercase tracking-wider">Jawapan</span>
          <br />
          <span className="text-xl font-mono font-black text-duo-charcoal dark:text-gray-100">
            {answer}
          </span>
        </motion.div>
      )}
    </div>
  )
}