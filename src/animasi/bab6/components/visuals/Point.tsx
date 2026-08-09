import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function Point({ data }: Props) {
  const label = data.label as string

  return (
    <svg viewBox="0 0 60 60" className="w-14 h-14">
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {/* Coordinate lines */}
        <line x1={30} y1={30} x2={30} y2={10} stroke="#c4b5fd" strokeWidth={1} strokeDasharray="2 2" />
        <line x1={30} y1={30} x2={50} y2={30} stroke="#c4b5fd" strokeWidth={1} strokeDasharray="2 2" />

        {/* Point circle */}
        <circle cx={30} cy={30} r={10} fill="#7c3aed" stroke="#fff" strokeWidth={2.5} />
        <text x={30} y={33} textAnchor="middle" fill="#fff" fontSize={9} fontWeight="black">
          P
        </text>

        {/* Label */}
        {label && (
          <text x={55} y={28} fill="#6d28d9" fontSize={10} fontWeight="bold" fontFamily="monospace">
            {label}
          </text>
        )}
      </motion.g>
    </svg>
  )
}