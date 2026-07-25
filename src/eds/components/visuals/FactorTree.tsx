// FactorTree visual component
// Renders a prime factorisation tree showing branches from a root number

interface Props {
  number: number
  branches: [number, number][]
}

const LEVEL_HEIGHT = 52
const NODE_R = 16

function treeLayout(number: number, branches: [number, number][]) {
  // Build a simple left-leaning tree layout
  // branches: list of splits from top to bottom, each split goes [left, right]
  // The right factor at each level is a prime; the left continues down

  const nodes: { id: string; label: string; x: number; y: number }[] = []
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = []

  const centerX = 160
  const spreadX = 60

  // Root
  nodes.push({ id: 'root', label: String(number), x: centerX, y: 28 })

  let currentX = centerX
  let currentY = 28

  branches.forEach(([left, right], idx) => {
    const nextY = currentY + LEVEL_HEIGHT
    const leftX = currentX - spreadX + idx * 8
    const rightX = currentX + spreadX - idx * 8

    // edge to left (continues)
    edges.push({ x1: currentX, y1: currentY + NODE_R, x2: leftX, y2: nextY - NODE_R })
    // edge to right (prime)
    edges.push({ x1: currentX, y1: currentY + NODE_R, x2: rightX, y2: nextY - NODE_R })

    nodes.push({ id: `left-${idx}`, label: String(left), x: leftX, y: nextY })
    nodes.push({ id: `right-${idx}`, label: String(right), x: rightX, y: nextY })

    currentX = leftX
    currentY = nextY
  })

  const totalHeight = 28 + LEVEL_HEIGHT * branches.length + 24
  return { nodes, edges, totalHeight }
}

export function FactorTree({ number, branches }: Props) {
  const { nodes, edges, totalHeight } = treeLayout(number, branches)
  const svgWidth = 320
  const primeIds = new Set<string>()

  // The right-hand node at each level and the final left node are primes
  branches.forEach((_, idx) => {
    primeIds.add(`right-${idx}`)
  })
  // Last left node is also a prime
  if (branches.length > 0) {
    primeIds.add(`left-${branches.length - 1}`)
  }

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${totalHeight}`}
      className="w-full max-w-xs"
      role="img"
      aria-label={`Factor tree for ${number}`}
    >
      {/* Edges */}
      {edges.map((e, i) => (
        <line
          key={i}
          x1={e.x1}
          y1={e.y1}
          x2={e.x2}
          y2={e.y2}
          className="stroke-duo-gray"
          strokeWidth={1.5}
        />
      ))}

      {/* Nodes */}
      {nodes.map((n) => {
        const isPrime = primeIds.has(n.id)
        const isRoot = n.id === 'root'
        return (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={NODE_R}
              className={
                isPrime
                  ? 'fill-duo-green stroke-duo-green-dark'
                  : isRoot
                    ? 'fill-duo-orange stroke-duo-orange'
                    : 'fill-duo-blue/20 stroke-duo-blue dark:fill-duo-blue/30'
              }
              strokeWidth={isPrime || isRoot ? 0 : 1.5}
            />
            <text
              x={n.x}
              y={n.y + 5}
              textAnchor="middle"
              fontSize={11}
              fontWeight="700"
              className={
                isPrime || isRoot
                  ? 'fill-white'
                  : 'fill-duo-charcoal dark:fill-gray-100'
              }
            >
              {n.label}
            </text>
          </g>
        )
      })}

      {/* Legend */}
      <g>
        <circle cx={12} cy={totalHeight - 10} r={6} className="fill-duo-green" />
        <text
          x={22}
          y={totalHeight - 6}
          fontSize={9}
          className="fill-duo-gray dark:fill-gray-400"
        >
          Nombor perdana
        </text>
      </g>
    </svg>
  )
}
