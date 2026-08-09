import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function SemanticBlock({ data }: Props) {
  const steps = data.steps as Array<{ text: string; symbol: string }>

  return (
    <svg viewBox="0 0 300 160" className="w-full h-full">
      {steps?.map((step, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.25, duration: 0.35 }}
        >
          {/* Step description */}
          <text x={20} y={24 + i * 34} fill="#475569" fontSize={10} fontStyle="italic">
            {step.text}
          </text>

          {/* Symbol block */}
          <rect
            x={20} y={32 + i * 34} width={step.symbol ? Math.max(step.symbol.length * 12, 40) : 40}
            height={24} rx={6}
            fill={step.symbol.includes('=') ? '#dcfce7' : '#ede9fe'}
            stroke={step.symbol.includes('=') ? '#22c55e' : '#a78bfa'}
            strokeWidth={1.5}
          />
          <text
            x={20 + (step.symbol ? Math.max(step.symbol.length * 6, 20) : 20)}
            y={48 + i * 34}
            textAnchor="middle"
            fill={step.symbol.includes('=') ? '#15803d' : '#6d28d9'}
            fontSize={11}
            fontWeight="bold"
            fontFamily="monospace"
          >
            {step.symbol}
          </text>

          {/* Arrow between steps */}
          {i < steps.length - 1 && (
            <motion.path
              d={`M 40 ${56 + i * 34} L 40 ${66 + i * 34}`}
              stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="3 2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.25 + 0.2, duration: 0.3 }}
            />
          )}
        </motion.g>
      ))}
    </svg>
  )
}