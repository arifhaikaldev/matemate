import { motion } from 'framer-motion'

interface Props {
  passed: boolean
  score: number
  requiredScore: number
  onRetry?: () => void
  onContinue?: () => void
}

export function GateResult({ passed, score, requiredScore, onRetry, onContinue }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-full w-full bg-white dark:bg-white/5 rounded-3xl p-6 shadow-sm border border-duo-gray-light dark:border-white/10 text-center space-y-4"
    >
      {passed ? (
        <>
          <div className="w-16 h-16 rounded-full bg-duo-green/20 dark:bg-duo-green/10 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-duo-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-black text-duo-green">Lulus!</p>
            <p className="text-sm text-duo-charcoal/70 dark:text-gray-400 mt-1">
              Skor: {score}% (perlukan {requiredScore}%)
            </p>
          </div>
          {onContinue && (
            <motion.button
              onClick={onContinue}
              whileTap={{ scale: 0.97 }}
              className="btn btn-primary"
            >
              Teruskan ke Topik Seterusnya
            </motion.button>
          )}
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-duo-orange/20 dark:bg-duo-orange/10 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-duo-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-black text-duo-orange">Belum Lulus</p>
            <p className="text-sm text-duo-charcoal/70 dark:text-gray-400 mt-1">
              Skor: {score}% (perlukan {requiredScore}%)
            </p>
            <p className="text-xs text-duo-charcoal/50 dark:text-gray-500 mt-1">
              Cuba semula untuk mencapai masteri.
            </p>
          </div>
          {onRetry && (
            <motion.button
              onClick={onRetry}
              whileTap={{ scale: 0.97 }}
              className="btn btn-primary"
            >
              Cuba Semula
            </motion.button>
          )}
        </>
      )}
    </motion.div>
  )
}