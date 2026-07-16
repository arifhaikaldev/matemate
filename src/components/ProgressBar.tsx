interface Props {
  nilai: number
  label?: string
  warna?: 'sky' | 'green' | 'yellow' | 'red'
}

export function ProgressBar({ nilai, label, warna = 'sky' }: Props) {
  const colourMap = {
    sky: 'bg-sky-blue',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-deep-charcoal/50 dark:text-gray-400 mb-1">
          <span>{label}</span>
          <span>{nilai}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-baby-blue/50 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${colourMap[warna]} rounded-full transition-all duration-500`}
          style={{ width: `${nilai}%` }}
        />
      </div>
    </div>
  )
}