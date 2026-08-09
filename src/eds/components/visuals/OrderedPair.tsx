import { motion } from 'framer-motion'

interface Props {
  x: number | string
  y: number | string
  label?: string
  animate?: boolean
}

export function OrderedPair({ x, y, label, animate = true }: Props) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-white/10 border-2 border-duo-blue dark:border-duo-blue shadow-sm"
    >
      {label && (
        <span className="text-xs font-bold text-duo-gray uppercase mr-1">{label}</span>
      )}
      <span className="text-lg font-mono font-black text-duo-charcoal dark:text-gray-100">
        ({x}, {y})
      </span>
    </motion.div>
  )
}