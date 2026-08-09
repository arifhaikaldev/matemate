import { motion } from 'framer-motion'

interface Props {
  lines: string[]
}

export function NotationBlock({ lines }: Props) {
  if (!lines || lines.length === 0) return null

  return (
    <div className="mt-3 space-y-1 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, duration: 0.3 }}
          className="text-sm font-mono font-bold text-duo-charcoal dark:text-gray-200 leading-relaxed"
        >
          {line}
        </motion.p>
      ))}
    </div>
  )
}