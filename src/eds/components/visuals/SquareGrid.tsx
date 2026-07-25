// SquareGrid visual component
// Renders an n×n grid of unit cells to illustrate n² as a square area

interface Props {
  n: number
  highlightBorder?: boolean
}

export function SquareGrid({ n, highlightBorder = true }: Props) {
  const cellSize = Math.max(8, Math.min(28, Math.floor(220 / n)))
  const gridSize = n * cellSize
  const svgSize = gridSize + 48
  const offsetX = (svgSize - gridSize) / 2
  const offsetY = 8

  const cells: { x: number; y: number }[] = []
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      cells.push({ x: offsetX + col * cellSize, y: offsetY + row * cellSize })
    }
  }

  return (
    <svg
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      className="w-full max-w-xs"
      role="img"
      aria-label={`${n} by ${n} square grid showing ${n} squared equals ${n * n}`}
    >
      {/* Cell fills */}
      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.x + 1}
          y={c.y + 1}
          width={cellSize - 2}
          height={cellSize - 2}
          className="fill-duo-blue/20 dark:fill-duo-blue/30"
          rx={1}
        />
      ))}

      {/* Grid lines */}
      {Array.from({ length: n + 1 }, (_, i) => i).map((i) => (
        <g key={i}>
          <line
            x1={offsetX + i * cellSize}
            y1={offsetY}
            x2={offsetX + i * cellSize}
            y2={offsetY + gridSize}
            className="stroke-duo-blue/40 dark:stroke-duo-blue/50"
            strokeWidth={0.75}
          />
          <line
            x1={offsetX}
            y1={offsetY + i * cellSize}
            x2={offsetX + gridSize}
            y2={offsetY + i * cellSize}
            className="stroke-duo-blue/40 dark:stroke-duo-blue/50"
            strokeWidth={0.75}
          />
        </g>
      ))}

      {/* Outer border */}
      {highlightBorder && (
        <rect
          x={offsetX}
          y={offsetY}
          width={gridSize}
          height={gridSize}
          fill="none"
          className="stroke-duo-blue"
          strokeWidth={2}
          rx={2}
        />
      )}

      {/* Side label: n */}
      <text
        x={offsetX - 10}
        y={offsetY + gridSize / 2 + 4}
        textAnchor="middle"
        fontSize={13}
        fontWeight="700"
        className="fill-duo-charcoal dark:fill-gray-200"
      >
        {n}
      </text>
      {/* Bottom label: n */}
      <text
        x={offsetX + gridSize / 2}
        y={offsetY + gridSize + 18}
        textAnchor="middle"
        fontSize={13}
        fontWeight="700"
        className="fill-duo-charcoal dark:fill-gray-200"
      >
        {n}
      </text>

      {/* n² label in centre */}
      <text
        x={offsetX + gridSize / 2}
        y={offsetY + gridSize / 2 + 5}
        textAnchor="middle"
        fontSize={Math.max(10, Math.min(18, cellSize * n / 5))}
        fontWeight="800"
        className="fill-duo-blue dark:fill-duo-blue"
      >
        {n}² = {n * n}
      </text>
    </svg>
  )
}
