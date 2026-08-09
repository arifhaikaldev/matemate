import { motion } from 'framer-motion'
import { VisualArea } from '../ui/VisualArea'
import { NotationBlock } from '../ui/NotationBlock'
import type { Moment } from '../../types'
import { VisualRenderer } from './VisualRenderer'

interface Props {
  moment: Moment
  onComplete: () => void
}

export function ObservationScreen({ moment, onComplete }: Props) {
  return (
    <motion.div
      key={moment.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <div>
        <h2 className="text-lg font-black text-duo-charcoal dark:text-gray-100">
          {moment.title}
        </h2>
        <p className="text-xs text-duo-gray font-medium mt-0.5">{moment.objective}</p>
      </div>

      {moment.visual && (
        <VisualArea title={moment.content.narration}>
          <VisualRenderer visual={moment.visual} />
        </VisualArea>
      )}

      <p className="text-sm text-duo-charcoal/80 dark:text-gray-300 font-medium leading-relaxed">
        {moment.content.instruction}
      </p>

      {moment.content.notation && moment.content.notation.length > 0 && (
        <NotationBlock lines={moment.content.notation} />
      )}

      {moment.interaction && (
        <div className="pt-2">
          <motion.button
            onClick={onComplete}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl bg-duo-purple text-white font-bold shadow-md hover:bg-duo-purple/90 transition-all"
          >
            Seterusnya
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}