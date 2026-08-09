import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function OrderedPair({ data }: Props) {
  const equation = data.equation as string
  const pairs = data.pairs as Array<{ x: number; y: number; work: string }>

  return (
    <svg viewBox="0 0 300 160" className="w-full h-full">
      {equation && (
        <text x={150} y={20} textAnchor="middle" fill="#6d28d9" fontSize={13} fontWeight="bold" fontFamily="monospace">
          {equation}
        </text>
      )}

      {pairs?.map((pair, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
        >
          <rect x={20} y={32 + i * 40} width={260} height={34} rx={6} fill="#f5f3ff" stroke="#c4b5fd" strokeWidth={1.5} />

          {/* Ordered pair */}
          <rect x={24} y={35 + i * 40} width={70} height={28} rx={4} fill="#7c3aed" />
          <text x={59} y={53 + i * 40} textAnchor="middle" fill="#fff" fontSize={12} fontWeight="bold" fontFamily="monospace">
            ({pair.x},{pair.y})
          </text>

          {/* Work */}
          <text x={104} y={50 + i * 40} fill="#6d28d9" fontSize={10} fontWeight="medium" fontFamily="monospace">
            {pair.work}
          </text>

          {/* Check */}
          <text x={268} y={52 + i * 40} textAnchor="end" fill="#22c55e" fontSize={14} fontWeight="black">✓</text>
        </motion.g>
      ))}
    </svg>
  )
}