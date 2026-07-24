// ObservationScreen — hook/intro screen, no interaction required

import { VisualRenderer } from '../../registry/VisualRenderer'
import type { ObservationScreen as TObservation } from '../../types'

interface Props {
  screen: TObservation
  onNext: () => void
}

export function ObservationScreen({ screen, onNext }: Props) {
  return (
    <div className="flex flex-col gap-6 items-center text-center">
      {screen.visual && (
        <div className="w-full flex justify-center py-2">
          <VisualRenderer visual={screen.visual} />
        </div>
      )}
      <div className="space-y-2">
        <h2 className="text-lg font-black text-duo-charcoal dark:text-gray-100">{screen.title}</h2>
        <p className="text-base text-duo-charcoal dark:text-gray-300 leading-relaxed">{screen.text}</p>
      </div>
      <button onClick={onNext} className="btn btn-primary w-full mt-2">
        Teruskan
      </button>
    </div>
  )
}
