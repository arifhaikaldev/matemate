import { motion } from 'framer-motion'

interface Props {
  onBack: () => void
  onNext: () => void
  canGoBack: boolean
  canGoNext: boolean
  nextLabel?: string
}

export function NavButtons({ onBack, onNext, canGoBack, canGoNext, nextLabel = 'Seterusnya' }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 pt-4">
      <motion.button
        onClick={onBack}
        disabled={!canGoBack}
        whileTap={{ scale: 0.97 }}
        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
          canGoBack
            ? 'bg-gray-100 dark:bg-gray-800 text-duo-charcoal dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            : 'bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-600 cursor-not-allowed'
        }`}
      >
        Kembali
      </motion.button>
      <motion.button
        onClick={onNext}
        disabled={!canGoNext}
        whileTap={{ scale: 0.97 }}
        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
          canGoNext
            ? 'bg-duo-purple text-white shadow-md hover:bg-duo-purple/90'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
        }`}
      >
        {nextLabel}
      </motion.button>
    </div>
  )
}