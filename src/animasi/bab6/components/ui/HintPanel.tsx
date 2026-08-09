import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  hints: string[]
  level: number
}

export function HintPanel({ hints, level }: Props) {
  return (
    <AnimatePresence mode="wait">
      {level > 0 && level <= hints.length && (
        <motion.div
          key={level}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mt-3 p-3.5 rounded-xl bg-duo-orange-light/30 dark:bg-duo-orange/10 border border-duo-orange/30 dark:border-duo-orange/20"
        >
          <div className="flex items-start gap-2">
            <span className="text-duo-orange font-bold text-sm flex-shrink-0 mt-0.5">
              Hint {level}:
            </span>
            <p className="text-sm text-duo-charcoal/80 dark:text-gray-300 font-medium">
              {hints[level - 1]}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}