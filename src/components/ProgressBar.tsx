interface Props {
  nilai: number
  label?: string
  warna?: 'sky' | 'green' | 'yellow' | 'red'
}

export function ProgressBar({ nilai, label, warna = 'sky' }: Props) {
  const colourMap = {
    sky: 'bg-duo-blue',
    green: 'bg-duo-green',
    yellow: 'bg-duo-orange',
    red: 'bg-duo-red',
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs font-bold text-duo-gray mb-1">
          <span>{label}</span>
          <span>{nilai}%</span>
        </div>
      )}
      <div className="h-2.5 w-full bg-duo-gray-light dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${colourMap[warna]} rounded-full transition-all duration-500`}
          style={{ width: `${nilai}%` }}
        />
      </div>
    </div>
  )
}