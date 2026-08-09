import { motion } from 'framer-motion'

interface Props {
  equation: string
  substitution: string
  result: string
  animate?: boolean
}

export function SubstitutionGroup({
  equation,
  substitution,
  result,
  animate = true,
}: Props) {
  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      <motion.div
        initial={animate ? { opacity: 0, x: -20 } : undefined}
        animate={{ opacity: 1, x: 0 }}
        className="text-center py-2.5 px-4 rounded-xl bg-duo-purple/10 dark:bg-duo-purple/20 border border-duo-purple/30 dark:border-duo-purple/40"
      >
        <span className="text-xs font-bold text-duo-purple uppercase tracking-wider">Gantikan</span>
        <br />
        <span className="text-base font-mono font-bold text-duo-charcoal dark:text-gray-100">
          {substitution}
        </span>
      </motion.div>

      <motion.div
        initial={animate ? { opacity: 0 } : undefined}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center py-2 px-4 rounded-lg bg-white dark:bg-white/10 border border-duo-gray-light/40 dark:border-white/10"
      >
        <span className="text-sm font-mono text-duo-charcoal/60 dark:text-gray-400">dalam</span>
        <br />
        <span className="text-base font-mono font-bold text-duo-charcoal dark:text-gray-100">
          {equation}
        </span>
      </motion.div>

      <motion.div
        initial={animate ? { opacity: 0, scale: 0.95 } : undefined}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 150, damping: 12 }}
        className="text-center py-3 px-4 rounded-xl bg-duo-green-light/50 dark:bg-duo-green/10 border-2 border-duo-green"
      >
        <span className="text-xs font-bold text-duo-green-dark dark:text-duo-green uppercase tracking-wider">Hasil</span>
        <br />
        <span className="text-lg font-mono font-black text-duo-charcoal dark:text-gray-100">
          {result}
        </span>
      </motion.div>
    </div>
  )
}