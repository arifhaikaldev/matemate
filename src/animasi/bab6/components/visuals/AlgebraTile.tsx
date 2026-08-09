import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function AlgebraTile({ data }: Props) {
  const equation = data.equation as string
  const total = data.total as number
  const groups = data.groups as number
  const constant = data.constant as number ?? 0
  const steps = data.steps as Array<{ action: string; label: string }>

  const barWidth = constant > 0 ? 180 : 200
  const barHeight = 28
  const sectionWidth = Math.floor(barWidth / (groups + (constant > 0 ? 1 : 0)))

  return (
    <svg viewBox="0 0 300 160" className="w-full h-full">
      {/* Equation label */}
      <text x={150} y={18} textAnchor="middle" fill="#6d28d9" fontSize={13} fontWeight="bold" fontFamily="monospace">
        {equation}
      </text>

      {/* Main bar */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        {/* Bar background */}
        <rect x={50} y={36} width={barWidth} height={barHeight} rx={6} fill="#e0e7ff" stroke="#818cf8" strokeWidth={2} />
        
        {/* x sections */}
        {Array.from({ length: groups }, (_, i) => (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.15 }}>
            <line x1={50 + (i + 1) * sectionWidth} y1={36} x2={50 + (i + 1) * sectionWidth} y2={36 + barHeight} stroke="#818cf8" strokeWidth={1.5} strokeDasharray="3 2" />
            <text x={50 + i * sectionWidth + sectionWidth / 2} y={36 + barHeight / 2 + 4} textAnchor="middle" fill="#4338ca" fontSize={11} fontWeight="bold">
              x
            </text>
          </motion.g>
        ))}

        {/* Constant section */}
        {constant > 0 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <line x1={50 + groups * sectionWidth} y1={36} x2={50 + groups * sectionWidth} y2={36 + barHeight} stroke="#818cf8" strokeWidth={1.5} />
            <text x={50 + groups * sectionWidth + sectionWidth / 2} y={36 + barHeight / 2 + 4} textAnchor="middle" fill="#0891b2" fontSize={11} fontWeight="bold">
              {constant}
            </text>
          </motion.g>
        )}
      </motion.g>

      {/* Total bracket */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <path d={`M 50 75 L 50 85 L ${50 + barWidth} 85 L ${50 + barWidth} 75`} fill="none" stroke="#64748b" strokeWidth={1.5} />
        <text x={50 + barWidth / 2} y={98} textAnchor="middle" fill="#64748b" fontSize={11} fontWeight="bold">
          = {total}
        </text>
      </motion.g>

      {/* Step labels */}
      {steps?.map((step, i) => (
        <motion.text
          key={i}
          x={150} y={118 + i * 16}
          textAnchor="middle"
          fill={step.action === 'wrongRemove' || step.action === 'removeConstant' ? '#ea580c' : '#059669'}
          fontSize={10} fontWeight="bold"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.3 }}
        >
          {step.label}
        </motion.text>
      ))}
    </svg>
  )
}