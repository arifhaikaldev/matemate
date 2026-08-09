import { motion } from 'framer-motion'

interface Row {
  x: number | string
  y: number | string
  highlight?: boolean
}

interface Props {
  equation?: string
  rows: Row[]
  animate?: boolean
}

export function TableOfValues({
  equation,
  rows,
  animate = true,
}: Props) {
  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      {equation && (
        <p className="text-sm font-bold text-center font-mono text-duo-charcoal dark:text-gray-100">
          {equation}
        </p>
      )}
      <div className="overflow-hidden rounded-xl border border-duo-gray-light/40 dark:border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-duo-blue-light/40 dark:bg-duo-blue/10">
              <th className="py-2.5 px-4 text-center font-black text-duo-charcoal dark:text-gray-100 text-base">x</th>
              <th className="py-2.5 px-4 text-center font-black text-duo-charcoal dark:text-gray-100 text-base">y</th>
              <th className="py-2.5 px-4 text-center font-black text-duo-charcoal dark:text-gray-100 text-xs">(x, y)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <motion.tr
                key={i}
                initial={animate ? { opacity: 0 } : undefined}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                className={`border-t border-duo-gray-light/30 dark:border-white/5 ${
                  row.highlight
                    ? 'bg-duo-green-light/50 dark:bg-duo-green/10'
                    : i % 2 === 0
                      ? 'bg-white/50 dark:bg-white/5'
                      : ''
                }`}
              >
                <td className="py-2 px-4 text-center font-mono font-bold text-duo-charcoal dark:text-gray-100">
                  {row.x}
                </td>
                <td className="py-2 px-4 text-center font-mono font-bold text-duo-charcoal dark:text-gray-100">
                  {row.y}
                </td>
                <td className="py-2 px-4 text-center font-mono text-sm text-duo-blue dark:text-duo-blue">
                  ({row.x}, {row.y})
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}