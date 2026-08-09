import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function TrialTable({ data }: Props) {
  const rows = data.rows as Array<{ trial: number; result: number; correct: boolean }> | undefined
  const equation = data.equation as string | undefined

  return (
    <svg viewBox="0 0 300 160" className="w-full h-full">
      {/* Equation */}
      {equation && (
        <text x={150} y={18} textAnchor="middle" fill="#6d28d9" fontSize={12} fontWeight="bold" fontFamily="monospace">
          {equation}
        </text>
      )}

      {/* Table */}
      <g transform="translate(40, 30)">
        {/* Header row */}
        <rect x={0} y={0} width={220} height={24} rx={4} fill="#e0e7ff" />
        <text x={55} y={16} textAnchor="middle" fill="#4338ca" fontSize={10} fontWeight="bold">Cuba</text>
        <text x={165} y={16} textAnchor="middle" fill="#4338ca" fontSize={10} fontWeight="bold">Hasil</text>
        <line x1={110} y1={0} x2={110} y2={24} stroke="#c7d2fe" strokeWidth={1} />

        {/* Data rows */}
        {rows?.map((row, i) => (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.15 }}>
            <rect x={0} y={28 + i * 28} width={220} height={24} rx={4} fill={row.correct ? '#dcfce7' : '#fef2f2'} stroke={row.correct ? '#22c55e' : '#fca5a5'} strokeWidth={row.correct ? 2 : 1} />
            <text x={55} y={44 + i * 28} textAnchor="middle" fill={row.correct ? '#15803d' : '#dc2626'} fontSize={13} fontWeight="bold" fontFamily="monospace">
              x = {row.trial}
            </text>
            <text x={165} y={44 + i * 28} textAnchor="middle" fill={row.correct ? '#15803d' : '#dc2626'} fontSize={13} fontWeight="bold" fontFamily="monospace">
              {row.result}
            </text>
            <line x1={110} y1={28 + i * 28} x2={110} y2={52 + i * 28} stroke="#e2e8f0" strokeWidth={1} />

            {/* Check / cross */}
            {row.correct && (
              <text x={200} y={44 + i * 28} fill="#22c55e" fontSize={14} fontWeight="black">✓</text>
            )}
            {!row.correct && (
              <text x={200} y={44 + i * 28} fill="#ef4444" fontSize={14} fontWeight="black">✗</text>
            )}
          </motion.g>
        ))}
      </g>
    </svg>
  )
}