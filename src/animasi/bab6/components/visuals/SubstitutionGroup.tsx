import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function SubstitutionGroup({ data }: Props) {
  const steps = data.steps as Array<{
    action: string
    from?: string
    to?: string
    text?: string
    equation?: string
    result?: string
  }>

  return (
    <svg viewBox="0 0 300 200" className="w-full h-full">
      {steps?.map((step, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.25 }}>
          {step.action === 'rearrange' && (
            <>
              <text x={20} y={22 + i * 30} fill="#64748b" fontSize={10} fontStyle="italic">Ungkapkan:</text>
              <motion.text x={20} y={38 + i * 30} fill="#6d28d9" fontSize={12} fontWeight="bold" fontFamily="monospace"
                animate={{ color: '#059669' }} transition={{ delay: 0.2 }}>
                {step.to}
              </motion.text>
            </>
          )}

          {step.action === 'substitute' && (
            <>
              <text x={20} y={22 + i * 30} fill="#64748b" fontSize={10} fontStyle="italic">{step.text}</text>
              {/* Arrow showing substitution */}
              <motion.path
                d="M 220 18 L 235 18 Q 245 18 245 28 L 245 35"
                stroke="#f59e0b" strokeWidth={2} fill="none" strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.25 + 0.2 }}
              />
              <text x={20} y={38 + i * 30} fill="#1e293b" fontSize={11} fontWeight="bold" fontFamily="monospace">
                {step.equation}
              </text>
            </>
          )}

          {step.action === 'solve' && (
            <text x={20} y={26 + i * 30} fill="#1e293b" fontSize={12} fontWeight="bold" fontFamily="monospace">
              {step.equation}
              {step.result && (
                <motion.tspan fill="#059669" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  {' → '}{step.result}
                </motion.tspan>
              )}
            </text>
          )}

          {step.action === 'result' && (
            <text x={20} y={26 + i * 30} fill="#6d28d9" fontSize={14} fontWeight="black" fontFamily="monospace">
              {step.equation}
            </text>
          )}

          {step.action === 'backSubstitute' && (
            <>
              <text x={20} y={22 + i * 30} fill="#64748b" fontSize={10} fontStyle="italic">Ganti semula:</text>
              <text x={20} y={38 + i * 30} fill="#1e293b" fontSize={12} fontWeight="bold" fontFamily="monospace">
                {step.equation}
                <motion.tspan fill="#6d28d9" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  {' = '}{step.result}
                </motion.tspan>
              </text>
            </>
          )}

          {step.action === 'verify' && (
            <text x={20} y={26 + i * 30} fill="#059669" fontSize={13} fontWeight="bold" fontFamily="monospace">
              {step.equation} {step.result}
            </text>
          )}
        </motion.g>
      ))}
    </svg>
  )
}