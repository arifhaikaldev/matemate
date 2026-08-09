interface Props {
  current: number
  total: number
  completed: string[]
  onDotClick?: (index: number) => void
}

export function ProgressDots({ current, total, completed, onDotClick }: Props) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-3">
      {Array.from({ length: total }, (_, i) => {
        const isCurrent = i === current
        const isCompleted = completed.includes(String(i))
        return (
          <button
            key={i}
            onClick={() => onDotClick?.(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              isCurrent
                ? 'w-6 bg-duo-purple dark:bg-duo-purple'
                : isCompleted
                  ? 'w-2 bg-duo-green dark:bg-duo-green'
                  : 'w-2 bg-gray-200 dark:bg-gray-700'
            }`}
            aria-label={`Momen ${i + 1}`}
          />
        )
      })}
    </div>
  )
}