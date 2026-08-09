interface Props {
  total: number
  current: number
  results: Record<string, 'correct' | 'incorrect' | 'viewed'>
  momentIds: string[]
  onDotClick: (idx: number) => void
}

export function ProgressBar({ total, current, results, momentIds, onDotClick }: Props) {
  return (
    <div className="fixed right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1">
      {Array.from({ length: total }, (_, i) => {
        const id = momentIds[i]
        const result = id ? results[id] : undefined
        let color = 'bg-gray-300 dark:bg-gray-600'
        if (i === current) color = 'bg-duo-purple'
        else if (result === 'correct') color = 'bg-duo-green'
        else if (result === 'incorrect') color = 'bg-duo-red'
        else if (result === 'viewed') color = 'bg-duo-purple/40'

        return (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${color} ${
              i === current ? 'scale-150' : 'hover:scale-125'
            }`}
            aria-label={`Momen ${i + 1}`}
          />
        )
      })}
    </div>
  )
}