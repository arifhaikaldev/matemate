import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function Line({ data }: Props) {
  const x1 = data.x1 as number ?? 0
  const y1 = data.y1 as number ?? 0
  const x2 = data.x2 as number ?? 100
  const y2 = data.y2 as number ?? 100
  const color = data.color as string ?? '#6d28d9'
  const label = data.label as string

  return (
    <svg viewBox="0 0 120 40" className="w-full h-10">
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={color} strokeWidth={3} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
        {label && (
          <text x={60} y={y2 + 16} textAnchor="middle" fill={color} fontSize={10} fontWeight="bold" fontFamily="monospace">
            {label}
          </text>
        )}
      </motion.g>
    </svg>
  )
}