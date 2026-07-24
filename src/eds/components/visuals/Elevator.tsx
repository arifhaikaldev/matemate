// Elevator visual — shows a building cross-section with a highlighted floor

interface Props {
  floors: number // total floors above ground (e.g. 5)
  currentFloor: number // highlighted floor (negative = below ground)
  groundFloor?: number // default 0
  ariaLabel?: string
}

export function Elevator({ floors, currentFloor, groundFloor = 0, ariaLabel }: Props) {
  const below = Math.abs(Math.min(0, currentFloor, groundFloor)) + 2
  const above = Math.max(floors, currentFloor) + 1
  const totalFloors = above + below
  const floorH = 36
  const width = 120
  const height = totalFloors * floorH + 16

  const allFloors: number[] = []
  for (let f = above - 1; f >= -(below - 1); f--) {
    allFloors.push(f)
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-28 mx-auto"
      role="img"
      aria-label={ariaLabel ?? `Elevator at floor ${currentFloor}`}
    >
      {allFloors.map((f, i) => {
        const y = 8 + i * floorH
        const isGround = f === groundFloor
        const isCurrent = f === currentFloor
        const isNegative = f < groundFloor

        return (
          <g key={f}>
            {/* Floor box */}
            <rect
              x={20}
              y={y}
              width={80}
              height={floorH - 2}
              rx={4}
              className={
                isCurrent
                  ? 'fill-duo-blue'
                  : isGround
                    ? 'fill-duo-gray-light dark:fill-white/10'
                    : isNegative
                      ? 'fill-duo-red-light dark:fill-red-900/30'
                      : 'fill-duo-bg dark:fill-white/5'
              }
              stroke={isGround ? '#afb0b2' : 'transparent'}
              strokeWidth={1}
            />
            {/* Floor label */}
            <text
              x={60}
              y={y + floorH / 2 + 4}
              textAnchor="middle"
              fontSize={11}
              fontWeight={isCurrent ? '800' : '500'}
              className={isCurrent ? 'fill-white' : 'fill-duo-charcoal dark:fill-gray-200'}
            >
              {f > 0 ? `+${f}` : f === 0 ? 'G' : String(f)}
            </text>
            {/* Ground marker */}
            {isGround && (
              <text
                x={10}
                y={y + floorH / 2 + 4}
                textAnchor="middle"
                fontSize={8}
                className="fill-duo-gray"
              >
                G
              </text>
            )}
          </g>
        )
      })}

      {/* Elevator shaft lines */}
      <line x1={20} y1={8} x2={20} y2={height - 8} className="stroke-duo-gray" strokeWidth={1} />
      <line x1={100} y1={8} x2={100} y2={height - 8} className="stroke-duo-gray" strokeWidth={1} />
    </svg>
  )
}
