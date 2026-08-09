import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function ExpressionBlock({ data }: Props) {
  const expressions = data.expressions as Array<{ expr: string; isLinear: boolean; note: string }> | undefined
  const equation = data.equation as string | undefined

  return (
    <svg viewBox="0 0 300 120" className="w-full h-full">
      {equation && (
        <text x={150} y={20} textAnchor="middle" fill="#6d28d9" fontSize={13} fontWeight="bold" fontFamily="monospace">
          {equation}
        </text>
      )}

      {expressions?.map((exp, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}>
          <rect x={30} y={32 + i * 32} width={exp.isLinear ? 100 : 120} height={26} rx={6}
            fill={exp.isLinear ? '#dcfce7' : '#fef2f2'}
            stroke={exp.isLinear ? '#22c55e' : '#ef4444'} strokeWidth={1.5} />
          <text x={exp.isLinear ? 80 : 90} y={50 + i * 32} textAnchor="middle"
            fill={exp.isLinear ? '#15803d' : '#dc2626'} fontSize={13} fontWeight="bold" fontFamily="monospace">
            {exp.expr}
          </text>
          <text x={170} y={50 + i * 32} fill={exp.isLinear ? '#16a34a' : '#ef4444'} fontSize={9} fontStyle="italic">
            {exp.note}
          </text>
        </motion.g>
      ))}
    </svg>
  )
}