import { motion } from 'framer-motion'
import { NotationBlock } from '../ui/NotationBlock'
import type { Moment } from '../../types'

interface Props {
  moment: Moment
  onComplete: () => void
}

export function GateScreen({ moment, onComplete }: Props) {
  return (
    <motion.div
      key={moment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-full w-full bg-white dark:bg-white/5 rounded-3xl p-6 shadow-sm border border-duo-gray-light dark:border-white/10 space-y-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-duo-purple/20 dark:bg-duo-purple/10 flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-duo-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <div>
        <h2 className="text-xl font-black text-duo-charcoal dark:text-gray-100">
          {moment.title}
        </h2>
        <p className="text-sm text-duo-charcoal/70 dark:text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
          {moment.objective}
        </p>
      </div>

      {moment.content.notation && moment.content.notation.length > 0 && (
        <NotationBlock lines={moment.content.notation} />
      )}

      <motion.button
        onClick={onComplete}
        whileTap={{ scale: 0.97 }}
        className="btn btn-primary"
      >
        Mulakan Ujian Masteri
      </motion.button>
    </motion.div>
  )
}