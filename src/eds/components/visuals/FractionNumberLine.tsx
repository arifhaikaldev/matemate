// FractionNumberLine — number line with fractional tick marks

interface Props {
  min: number
  max: number
  denominator: number
  highlights?: number[]
  ariaLabel?: string
}

const TRACK_WIDTH = 260
const PADDING = 30

function valToX(value: number, min: number, max: number): number {
  return PADDING + ((value - min) / (max - min)) * TRACK_WIDTH
}

export function FractionNumberLine({ min, max, denominator, highlights = [], ariaLabel }: Props) {
  const totalWidth = TRACK_WIDTH + PADDING * 2
  const ticks: number[] = []

  // Generate all fractional ticks
  const totalUnits = max - min
  const totalTicks = totalUnits * denominator
  for (let i = 0; i <= totalTicks; i++) {
    const v = min + i / denominator
    ticks.push(Math.round(v * 10000) / 10000)
  }

  // Only label integers and key fractions
  const shouldLabel = (v: number) => {
    if (Number.isInteger(v)) return true
    const num = Math.round(v * denominator) % denominator
    // Label half-way points for denominators > 4
    if (denominator <= 4) return true
    return num === denominator / 2
  }

  const formatLabel = (v: number) => {
    if (Number.isInteger(v)) return String(v)
    const absV = Math.abs(v)
    const wholePart = Math.floor(absV)
    const fracNum = Math.round((absV - wholePart) * denominator)
    const sign = v < 0 ? '−' : ''
    if (wholePart === 0) return `${sign}${fracNum}/${denominator}`
    return `${sign}${wholePart} ${fracNum}/${denominator}`
  }

  return (
    <svg
      viewBox={`0 0 ${totalWidth} 80`}
      className="w-full max-w-sm"
      role="img"
      aria-label={ariaLabel ?? `Fraction number line from ${min} to ${max}`}
    >
      {/* Track */}
      <line
        x1={PADDING}
        y1={36}
        x2={PADDING + TRACK_WIDTH}
        y2={36}
        className="stroke-duo-charcoal dark:stroke-gray-200"
        strokeWidth={2}
      />
      {/* Arrowhead */}
      <polygon
        points={`${PADDING + TRACK_WIDTH},36 ${PADDING + TRACK_WIDTH - 8},30 ${PADDING + TRACK_WIDTH - 8},42`}
        className="fill-duo-charcoal dark:fill-gray-200"
      />

      {ticks.map((v) => {
        const x = valToX(v, min, max)
        const isInteger = Number.isInteger(v)
        const isHighlighted = highlights.some((h) => Math.abs(h - v) < 0.0001)
        const showLabel = shouldLabel(v)

        return (
          <g key={v}>
            <line
              x1={x}
              y1={isInteger ? 26 : 31}
              x2={x}
              y2={isInteger ? 46 : 41}
              strokeWidth={isInteger ? 2 : 1}
              className={
                isHighlighted
                  ? 'stroke-duo-blue'
                  : isInteger
                    ? 'stroke-duo-charcoal dark:stroke-gray-200'
                    : 'stroke-duo-gray'
              }
            />
            {showLabel && (
              <text
                x={x}
                y={62}
                textAnchor="middle"
                fontSize={isInteger ? 10 : 8}
                fontWeight={isInteger ? '700' : '400'}
                className={isHighlighted ? 'fill-duo-blue' : 'fill-duo-charcoal dark:fill-gray-200'}
              >
                {formatLabel(v)}
              </text>
            )}
            {isHighlighted && (
              <circle cx={x} cy={36} r={6} className="fill-duo-blue" />
            )}
          </g>
        )
      })}
    </svg>
  )
}
