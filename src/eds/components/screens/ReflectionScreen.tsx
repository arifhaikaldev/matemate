// ReflectionScreen — concept summary, no interaction required

import { VisualRenderer } from '../../registry/VisualRenderer'
import type { ReflectionScreen as TReflection } from '../../types'

interface Props {
  screen: TReflection
  onNext: () => void
}

export function ReflectionScreen({ screen, onNext }: Props) {
  return (
    <div className="flex flex-col gap-6 items-center text-center">
      <div className="w-16 h-16 rounded-full bg-duo-blue-light dark:bg-duo-blue/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-duo-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>

      {screen.visual && (
        <div className="w-full flex justify-center py-1">
          <VisualRenderer visual={screen.visual} />
        </div>
      )}

      <div className="bg-duo-blue-light dark:bg-duo-blue/15 rounded-2xl px-5 py-4">
        <p className="text-base font-semibold text-duo-charcoal dark:text-gray-100 leading-relaxed">
          {screen.text}
        </p>
      </div>

      <button onClick={onNext} className="btn btn-primary w-full">
        Faham, teruskan
      </button>
    </div>
  )
}
