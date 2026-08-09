import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function EquationBlock({ data }: Props) {
  const steps = data.steps as Array<{
    type?: string
    operation?: string
    result?: string
    value?: number
    phase?: string
    context?: string
  }>

  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      {steps?.map((step, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.25 }}>
          {step.operation && (
            <text x={20} y={24 + i * 28} fill="#1e293b" fontSize={13} fontWeight="bold" fontFamily="monospace">
              {step.operation}
            </text>
          )}
          {step.result && (
            <text x={220} y={24 + i * 28} textAnchor="end" fill={step.result.includes('✓') ? '#059669' : '#6d28d9'} fontSize={13} fontWeight="bold" fontFamily="monospace">
              {step.result}
            </text>
          )}
          {step.type === 'context' && (
            <text x={20} y={24 + i * 28} fill="#64748b" fontSize={11} fontStyle="italic">
              {step.operation}
            </text>
          )}
          {step.type === 'verify' && (
            <>
              <text x={20} y={24 + i * 28} fill="#059669" fontSize={12} fontWeight="bold" fontFamily="monospace">
                {step.operation}
              </text>
              {step.result?.includes('✓') && (
                <motion.text x={280} y={24 + i * 28} textAnchor="end" fill="#059669" fontSize={16} fontWeight="black" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                  ✓
                </motion.text>
              )}
            </>
          )}
          {step.type === 'numberLine' && (
            <text x={20} y={24 + i * 28} fill="#f59e0b" fontSize={13} fontWeight="bold" fontFamily="monospace">
              {step.operation} = {step.result}
            </text>
          )}
        </motion.g>
      ))}
    </svg>
  )
}