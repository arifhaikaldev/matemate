import { motion } from 'framer-motion'

interface Trial {
  guess: number
  result: string
  correct: boolean
}

interface Props {
  equation: string
  trials: Trial[]
  animate?: boolean
}

export function TrialTable({
  equation,
  trials,
  animate = true,
}: Props) {
  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      <p className="text-sm font-bold text-center text-duo-charcoal dark:text-gray-100">
        <span className="font-mono">{equation}</span> — Cuba Jaya
      </p>
      <div className="overflow-hidden rounded-xl border border-duo-gray-light/40 dark:border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-duo-gray-light/40 dark:bg-white/5">
              <th className="py-2 px-3 text-left font-bold text-duo-charcoal dark:text-gray-100">Cuba</th>
              <th className="py-2 px-3 text-left font-bold text-duo-charcoal dark:text-gray-100">Hasil</th>
              <th className="py-2 px-3 text-center font-bold text-duo-charcoal dark:text-gray-100">Status</th>
            </tr>
          </thead>
          <tbody>
            {trials.map((trial, i) => (
              <motion.tr
                key={i}
                initial={animate ? { opacity: 0, x: -10 } : undefined}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className={`border-t border-duo-gray-light/30 dark:border-white/5 ${
                  trial.correct ? 'bg-duo-green-light/50 dark:bg-duo-green/10' : ''
                }`}
              >
                <td className="py-2 px-3 font-mono font-bold text-duo-charcoal dark:text-gray-100">
                  x = {trial.guess}
                </td>
                <td className="py-2 px-3 font-mono text-duo-charcoal/70 dark:text-gray-300">
                  {trial.result}
                </td>
                <td className="py-2 px-3 text-center">
                  {trial.correct ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-duo-green-dark dark:text-duo-green">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      Betul
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-duo-red">✗</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}