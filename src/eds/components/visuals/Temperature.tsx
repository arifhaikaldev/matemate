// Temperature visual — a thermometer showing a value on a scale

interface Props {
  value: number
  min?: number
  max?: number
  unit?: 'C' | 'F'
  ariaLabel?: string
}

export function Temperature({ value, min = -20, max = 50, unit = 'C', ariaLabel }: Props) {
  const totalHeight = 200
  const bulbR = 14
  const stemW = 18
  const stemTop = 16
  const stemBottom = totalHeight - bulbR * 2 - 4
  const stemH = stemBottom - stemTop

  const clampedValue = Math.max(min, Math.min(max, value))
  const fillRatio = (clampedValue - min) / (max - min)
  const fillHeight = fillRatio * stemH
  const fillY = stemBottom - fillHeight

  const isNegative = value < 0
  const fillClass = isNegative ? 'fill-duo-blue' : value > 35 ? 'fill-duo-red' : 'fill-duo-orange'

  // Tick marks every 10 degrees
  const ticks: number[] = []
  const step = Math.ceil((max - min) / 7 / 5) * 5
  for (let t = Math.ceil(min / step) * step; t <= max; t += step) {
    ticks.push(t)
  }

  return (
    <svg
      viewBox={`0 0 80 ${totalHeight}`}
      className="h-48 mx-auto"
      role="img"
      aria-label={ariaLabel ?? `Thermometer showing ${value}°${unit}`}
    >
      {/* Stem background */}
      <rect
        x={31}
        y={stemTop}
        width={stemW}
        height={stemH}
        rx={stemW / 2}
        className="fill-duo-gray-light dark:fill-white/10"
      />

      {/* Fill */}
      <rect
        x={31}
        y={fillY}
        width={stemW}
        height={fillHeight + stemW / 2}
        className={fillClass}
      />

      {/* Bulb */}
      <circle cx={40} cy={stemBottom + bulbR + 2} r={bulbR} className={fillClass} />
      <circle cx={40} cy={stemBottom + bulbR + 2} r={bulbR - 4} className="fill-white/30" />

      {/* Stem border */}
      <rect
        x={31}
        y={stemTop}
        width={stemW}
        height={stemH}
        rx={stemW / 2}
        fill="none"
        className="stroke-duo-gray"
        strokeWidth={1.5}
      />

      {/* Ticks + labels */}
      {ticks.map((t) => {
        const ratio = (t - min) / (max - min)
        const y = stemBottom - ratio * stemH
        return (
          <g key={t}>
            <line x1={50} y1={y} x2={55} y2={y} className="stroke-duo-gray" strokeWidth={1} />
            <text
              x={58}
              y={y + 4}
              fontSize={9}
              className={t === 0 ? 'fill-duo-charcoal dark:fill-gray-100 font-bold' : 'fill-duo-gray'}
            >
              {t}°
            </text>
          </g>
        )
      })}

      {/* Current value label */}
      <text
        x={40}
        y={stemBottom + bulbR * 2 + 14}
        textAnchor="middle"
        fontSize={13}
        fontWeight="800"
        className="fill-duo-charcoal dark:fill-gray-100"
      >
        {value}°{unit}
      </text>
    </svg>
  )
}
