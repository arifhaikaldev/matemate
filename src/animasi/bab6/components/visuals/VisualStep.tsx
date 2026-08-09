import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function VisualStep({ data }: Props) {
  const steps = data.steps as Array<{
    phase?: string
    equation?: string
    solution?: string[]
    teacherLed?: boolean
    prompt?: string
    decision?: Record<string, string>
  }>

  return (
    <svg viewBox="0 0 300 180" className="w-full h-full">
      {steps?.map((step, si) => {
        const xo = si * 105
        return (
          <motion.g key={si} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: si * 0.25 }}>
            {/* Phase label */}
            {step.phase && (
              <g>
                <rect x={xo + 5} y={6} width={95} height={20} rx={6}
                  fill={step.teacherLed ? '#7c3aed' : step.phase === 'You Do' ? '#059669' : '#f59e0b'} />
                <text x={xo + 52} y={20} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="black">
                  {step.phase}
                </text>
              </g>
            )}

            {/* Equation */}
            {step.equation && (
              <rect x={xo + 5} y={30} width={95} height={24} rx={4} fill="#f5f3ff" stroke="#c4b5fd" strokeWidth={1} />
            )}
            {step.equation && (
              <text x={xo + 52} y={46} textAnchor="middle" fill="#6d28d9" fontSize={11} fontWeight="bold" fontFamily="monospace">
                {step.equation}
              </text>
            )}

            {/* Solutions */}
            {step.solution?.map((s, si2) => (
              <text key={si2} x={xo + 52} y={64 + si2 * 18} textAnchor="middle" fill="#1e293b" fontSize={9} fontWeight="medium" fontFamily="monospace">
                {s}
              </text>
            ))}

            {/* Prompt for We Do */}
            {step.prompt && (
              <motion.text x={xo + 52} y={step.solution ? (step.solution.length * 18 + 68) : 68} textAnchor="middle"
                fill="#f59e0b" fontSize={9} fontStyle="italic" fontWeight="bold"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                {step.prompt}
              </motion.text>
            )}

            {/* Decision tree (for kaedah selection) */}
            {step.decision && (
              <g transform={`translate(${xo}, 10)`}>
                <text x={50} y={16} textAnchor="middle" fill="#1e293b" fontSize={9} fontWeight="bold">
                  {step.decision.question}
                </text>
                <rect x={5} y={24} width={90} height={20} rx={4} fill="#dcfce7" stroke="#22c55e" strokeWidth={1} />
                <text x={50} y={38} textAnchor="middle" fill="#15803d" fontSize={8} fontWeight="bold">Ya → {step.decision.ifYes}</text>
                <rect x={5} y={48} width={90} height={20} rx={4} fill="#fef2f2" stroke="#ef4444" strokeWidth={1} />
                <text x={50} y={62} textAnchor="middle" fill="#dc2626" fontSize={8} fontWeight="bold">Tidak → {step.decision.ifNo}</text>
                {step.decision.ifNoYes && (
                  <g>
                    <rect x={5} y={72} width={90} height={20} rx={4} fill="#f5f3ff" stroke="#c4b5fd" strokeWidth={1} />
                    <text x={50} y={86} textAnchor="middle" fill="#6d28d9" fontSize={8} fontWeight="bold">{step.decision.ifNoYes}</text>
                  </g>
                )}
              </g>
            )}
          </motion.g>
        )
      })}
    </svg>
  )
}