import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function NumberLine({ data }: Props) {
  const min = data.min as number
  const max = data.max as number
  const operations = data.operations as Array<{
    from: number
    to: number
    jump: number
    label: string
  }>

  const range = max - min

  const toX = (val: number) => 20 + ((val - min) / range) * 260

  return (
    <svg viewBox="0 0 300 120" className="w-full h-full">
      {/* Line */}
      <motion.line
        x1={15} y1={60} x2={285} y2={60}
        stroke="#94a3b8" strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      {/* Ticks and labels */}
      {Array.from({ length: range + 1 }, (_, i) => {
        const val = min + i
        const x = toX(val)
        return (
          <g key={i}>
            <line x1={x} y1={56} x2={x} y2={64} stroke="#94a3b8" strokeWidth={1.5} />
            <text x={x} y={80} textAnchor="middle" fill="#64748b" fontSize={9} fontWeight="medium">
              {val}
            </text>
          </g>
        )
      })}
      {/* Operations / jumps */}
      {operations?.map((op, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.3 }}>
          {/* Start point */}
          <motion.circle
            cx={toX(op.from)} cy={60} r={5}
            fill="#6d28d9"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          />
          {/* Jump arrow */}
          <motion.path
            d={`M ${toX(op.from)} 48 L ${toX(op.to)} 48`}
            stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="4 3"
            fill="none"
            markerEnd="url(#arrowhead)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          {/* End point */}
          <motion.circle
            cx={toX(op.to)} cy={60} r={6}
            fill="#ef4444"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.6 }}
          />
          {/* Label */}
          <text x={(toX(op.from) + toX(op.to)) / 2} y={42} textAnchor="middle" fill="#f59e0b" fontSize={9} fontWeight="bold">
            {op.jump}
          </text>
          <text x={toX(op.to)} y={100} textAnchor="middle" fill="#ef4444" fontSize={11} fontWeight="bold">
            {op.label}
          </text>
        </motion.g>
      ))}
      {/* Arrow marker */}
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
        </marker>
      </defs>
    </svg>
  )
}