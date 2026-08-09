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
        className={`btn-ghost ${!canGoBack ? 'opacity-30 cursor-not-allowed' : ''}`}
      >
        Kembali
      </motion.button>
      <motion.button
        onClick={onNext}
        disabled={!canGoNext}
        whileTap={{ scale: 0.97 }}
        className={`btn btn-primary ${!canGoNext ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        {nextLabel}
      </motion.button>
    </div>
  )
}