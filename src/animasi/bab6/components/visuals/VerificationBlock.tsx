import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function VerificationBlock({ data }: Props) {
  const substitution = data.substitution as string
  const result = data.result as string
  const isCorrect = data.isCorrect as boolean ?? true

  return (
    <svg viewBox="0 0 300 80" className="w-full h-full">
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Substitution */}
        <rect x={20} y={10} width={130} height={30} rx={6} fill="#f5f3ff" stroke="#c4b5fd" strokeWidth={1.5} />
        <text x={85} y={30} textAnchor="middle" fill="#6d28d9" fontSize={12} fontWeight="bold" fontFamily="monospace">
          {substitution}
        </text>

        {/* Arrow */}
        <motion.path
          d="M 155 25 L 175 25 Q 185 25 185 35 L 185 40"
          stroke="#f59e0b" strokeWidth={2} fill="none" strokeDasharray="3 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        />

        {/* Result */}
        <rect x={190} y={10} width={70} height={30} rx={6} fill={isCorrect ? '#dcfce7' : '#fef2f2'} stroke={isCorrect ? '#22c55e' : '#ef4444'} strokeWidth={1.5} />
        <text x={225} y={30} textAnchor="middle" fill={isCorrect ? '#15803d' : '#dc2626'} fontSize={12} fontWeight="bold" fontFamily="monospace">
          {result}
        </text>

        {/* Check/Cross */}
        <motion.text
          x={275} y={30} textAnchor="middle"
          fill={isCorrect ? '#22c55e' : '#ef4444'} fontSize={20} fontWeight="black"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.5 }}
        >
          {isCorrect ? '✓' : '✗'}
        </motion.text>
      </motion.g>
    </svg>
  )
}