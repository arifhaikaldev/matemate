interface Props {
  nilai: number   // 0–100
  label?: string
  warna?: 'blue' | 'green' | 'yellow' | 'red'
}

export function ProgressBar({ nilai, label, warna = 'blue' }: Props) {
  const colourMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>{label}</span>
          <span>{nilai}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colourMap[warna]} rounded-full transition-all duration-500`}
          style={{ width: `${nilai}%` }}
        />
      </div>
    </div>
  )
}
