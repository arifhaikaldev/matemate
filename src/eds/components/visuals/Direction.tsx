// Direction visual — a road/track showing a vehicle moving left or right

interface Props {
  direction: 'left' | 'right'
  distance: number
  label?: string
  ariaLabel?: string
}

export function Direction({ direction, distance, label, ariaLabel }: Props) {
  const w = 280
  const h = 80
  const midY = 40
  const startX = direction === 'right' ? 40 : w - 40
  const endX = direction === 'right' ? w - 40 : 40
  const arrowSize = 10

  const arrowX = endX
  const arrowPoints =
    direction === 'right'
      ? `${arrowX},${midY} ${arrowX - arrowSize},${midY - arrowSize / 2} ${arrowX - arrowSize},${midY + arrowSize / 2}`
      : `${arrowX},${midY} ${arrowX + arrowSize},${midY - arrowSize / 2} ${arrowX + arrowSize},${midY + arrowSize / 2}`

  const sign = direction === 'right' ? '+' : '−'
  const displayLabel = label ?? `${sign}${distance}`

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full max-w-xs"
      role="img"
      aria-label={ariaLabel ?? `Moving ${direction} by ${distance}`}
    >
      {/* Road */}
      <rect
        x={20}
        y={midY - 6}
        width={w - 40}
        height={12}
        rx={6}
        className="fill-duo-gray-light dark:fill-white/10"
      />
      {/* Dashes */}
      {[60, 100, 140, 180, 220].map((x) => (
        <rect
          key={x}
          x={x}
          y={midY - 1}
          width={16}
          height={2}
          rx={1}
          className="fill-white dark:fill-white/40"
        />
      ))}

      {/* Arrow line */}
      <line
        x1={startX}
        y1={midY}
        x2={direction === 'right' ? endX - arrowSize : endX + arrowSize}
        y2={midY}
        className={direction === 'right' ? 'stroke-duo-green' : 'stroke-duo-red'}
        strokeWidth={3}
        strokeDasharray="none"
      />
      {/* Arrowhead */}
      <polygon
        points={arrowPoints}
        className={direction === 'right' ? 'fill-duo-green' : 'fill-duo-red'}
      />

      {/* Car icon (simple rect) */}
      <rect
        x={startX - (direction === 'right' ? 16 : -4)}
        y={midY - 10}
        width={20}
        height={14}
        rx={4}
        className="fill-duo-blue"
      />
      <rect
        x={startX - (direction === 'right' ? 12 : 0)}
        y={midY - 16}
        width={12}
        height={8}
        rx={3}
        className="fill-duo-blue-light"
      />

      {/* Distance label */}
      <text
        x={(startX + endX) / 2}
        y={midY - 18}
        textAnchor="middle"
        fontSize={13}
        fontWeight="800"
        className={direction === 'right' ? 'fill-duo-green-dark' : 'fill-duo-red'}
      >
        {displayLabel}
      </text>
    </svg>
  )
}
