import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function ComparisonBlock({ data }: Props) {
  const left = data.left as { equation: string; label: string }
  const right = data.right as { equation: string; label: string }
  const highlightTerms = data.highlightTerms as Array<{
    term: string
    note: string
    isLinear: boolean
  }>

  return (
    <svg viewBox="0 0 300 160" className="w-full h-full">
      {/* Left column */}
      <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <rect x={10} y={10} width={130} height={50} rx={8} fill="#e0e7ff" stroke="#818cf8" strokeWidth={2} />
        <text x={75} y={30} textAnchor="middle" fill="#4338ca" fontSize={13} fontWeight="bold" fontFamily="monospace">
          {left.equation}
        </text>
        <text x={75} y={48} textAnchor="middle" fill="#4338ca" fontSize={10} fontWeight="bold">
          {left.label}
        </text>
      </motion.g>

      {/* Right column */}
      <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
        <rect x={160} y={10} width={130} height={50} rx={8} fill="#fce7f3" stroke="#f472b6" strokeWidth={2} />
        <text x={225} y={30} textAnchor="middle" fill="#be185d" fontSize={13} fontWeight="bold" fontFamily="monospace">
          {right.equation}
        </text>
        <text x={225} y={48} textAnchor="middle" fill="#be185d" fontSize={10} fontWeight="bold">
          {right.label}
        </text>
      </motion.g>

      {/* Highlight terms */}
      {highlightTerms?.map((ht, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.25 }}>
          <svg x={30 + i * 130} y={72}>
            <rect width={110} height={34} rx={6} fill={ht.isLinear ? '#dcfce7' : '#fef2f2'} stroke={ht.isLinear ? '#22c55e' : '#ef4444'} strokeWidth={1.5} />
            <text x={55} y={16} textAnchor="middle" fill={ht.isLinear ? '#15803d' : '#dc2626'} fontSize={11} fontWeight="bold" fontFamily="monospace">
              {ht.term}
            </text>
            <text x={55} y={28} textAnchor="middle" fill={ht.isLinear ? '#16a34a' : '#ef4444'} fontSize={9}>
              {ht.note}
            </text>
          </svg>
        </motion.g>
      ))}

      {/* VS */}
      <text x={150} y={42} textAnchor="middle" fill="#94a3b8" fontSize={14} fontWeight="black">
        vs
      </text>
    </svg>
  )
}