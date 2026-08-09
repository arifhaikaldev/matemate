import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function EliminationGroup({ data }: Props) {
  const steps = data.steps as Array<{
    action: string
    equations?: string[]
    terms?: string[]
    note?: string
    equation?: string
    result?: string
  }>

  return (
    <svg viewBox="0 0 300 180" className="w-full h-full">
      {steps?.map((step, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}>
          {step.action === 'align' && step.equations && (
            <g>
              {step.equations.map((_, ei) => (
                <rect key={ei} x={18} y={6 + ei * 28} width={170} height={24} rx={4} fill="#f5f3ff" stroke="#c4b5fd" strokeWidth={1.5} />
              ))}
              <text x={20} y={22} fill="#6d28d9" fontSize={13} fontWeight="bold" fontFamily="monospace">{step.equations[0]}</text>
              <text x={20} y={50} fill="#6d28d9" fontSize={13} fontWeight="bold" fontFamily="monospace">{step.equations[1]}</text>
            </g>
          )}

          {step.action === 'highlightTerms' && step.equations && (
            <g>
              <text x={20} y={22} fill="#6d28d9" fontSize={13} fontWeight="bold" fontFamily="monospace">{step.equations[0]}</text>
              <text x={20} y={50} fill="#6d28d9" fontSize={13} fontWeight="bold" fontFamily="monospace">{step.equations[1]}</text>
              {/* Highlight circles */}
              {step.terms?.map((_, ti) => (
                <motion.circle key={ti} cx={65 + ti * 70} cy={15 + ti * 28} r={12} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 2"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} />
              ))}
              {step.note && (
                <motion.text x={200} y={30} fill="#f59e0b" fontSize={9} fontWeight="bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {step.note}
                </motion.text>
              )}
            </g>
          )}

          {step.action === 'subtract' && (
            <g>
              <text x={20} y={22} fill="#1e293b" fontSize={11} fontWeight="bold" fontFamily="monospace">{step.equation}</text>
              <motion.text x={20} y={46} fill="#059669" fontSize={16} fontWeight="black" fontFamily="monospace"
                initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                {step.result}
              </motion.text>
              <motion.path d="M 18 30 L 260 30" stroke="#059669" strokeWidth={1.5} strokeDasharray="4 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
            </g>
          )}

          {step.action === 'backSubstitute' && (
            <g>
              <text x={20} y={22} fill="#64748b" fontSize={10} fontStyle="italic">Ganti semula:</text>
              <text x={20} y={42} fill="#1e293b" fontSize={13} fontWeight="bold" fontFamily="monospace">
                {step.equation}
                <motion.tspan fill="#6d28d9" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {' → '}{step.result}
                </motion.tspan>
              </text>
            </g>
          )}

          {step.action === 'verify' && (
            <text x={20} y={26} fill="#059669" fontSize={13} fontWeight="bold" fontFamily="monospace">
              {step.equation} {step.result}
            </text>
          )}
        </motion.g>
      ))}
    </svg>
  )
}