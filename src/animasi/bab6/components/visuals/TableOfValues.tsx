import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function TableOfValues({ data }: Props) {
  const equation = data.equation as string
  const columns = data.columns as Array<{ header: string; values: number[] }>
  const connection = data.connection as string

  return (
    <svg viewBox="0 0 300 160" className="w-full h-full">
      {equation && (
        <text x={150} y={18} textAnchor="middle" fill="#6d28d9" fontSize={12} fontWeight="bold" fontFamily="monospace">
          {equation}
        </text>
      )}

      <g transform="translate(50, 30)">
        {/* Header */}
        {columns?.map((col, ci) => (
          <g key={`h${ci}`}>
            <rect x={ci * 100} y={0} width={100} height={24} rx={4} fill="#e0e7ff" stroke="#c7d2fe" strokeWidth={1} />
            <text x={ci * 100 + 50} y={16} textAnchor="middle" fill="#4338ca" fontSize={11} fontWeight="bold">
              {col.header}
            </text>
          </g>
        ))}
        <line x1={0} y1={24} x2={columns ? columns.length * 100 : 100} y2={24} stroke="#c7d2fe" strokeWidth={1} />

        {/* Values */}
        {columns?.[0]?.values.map((_, rowIdx) => (
          <motion.g key={rowIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: rowIdx * 0.12 }}>
            {columns.map((col, ci) => (
              <g key={`d${ci}r${rowIdx}`}>
                <rect x={ci * 100} y={28 + rowIdx * 28} width={100} height={26} fill="#fafafa" stroke="#e2e8f0" strokeWidth={0.5} />
                <text x={ci * 100 + 50} y={45 + rowIdx * 28} textAnchor="middle" fill="#1e293b" fontSize={13} fontWeight="bold" fontFamily="monospace">
                  {col.values[rowIdx]}
                </text>
              </g>
            ))}
          </motion.g>
        ))}
      </g>

      {/* Connection label */}
      {connection && (
        <text x={150} y={150} textAnchor="middle" fill="#64748b" fontSize={9} fontStyle="italic">
          {connection}
        </text>
      )}
    </svg>
  )
}