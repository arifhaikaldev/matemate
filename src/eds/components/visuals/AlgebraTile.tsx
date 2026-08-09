import { motion } from 'framer-motion'

interface TileGroup {
  xCount: number
  constant?: number
  label?: string
}

interface Props {
  left: TileGroup
  right: TileGroup
  animate?: boolean
  showEquals?: boolean
}

export function AlgebraTile({
  left,
  right,
  animate = true,
  showEquals = true,
}: Props) {
  const TILE_W = 36
  const TILE_H = 28
  const GAP = 4

  const renderTiles = (group: TileGroup, color: string, colorDark: string, side: 'left' | 'right') => {
    const tiles = []
    for (let i = 0; i < group.xCount; i++) {
      tiles.push(
        <g key={`${side}-x-${i}`}>
          <rect
            x={i * (TILE_W + GAP)}
            y={0}
            width={TILE_W}
            height={TILE_H}
            rx={4}
            className={`fill-${color} dark:fill-${colorDark}`}
          />
          <text
            x={i * (TILE_W + GAP) + TILE_W / 2}
            y={TILE_H / 2 + 1}
            textAnchor="middle"
            fontSize={13}
            fontWeight="800"
            className="fill-white"
          >
            x
          </text>
        </g>
      )
    }
    if (group.constant) {
      const offset = group.xCount * (TILE_W + GAP)
      const absConst = Math.abs(group.constant)
      for (let i = 0; i < absConst; i++) {
        const isNeg = group.constant < 0
        tiles.push(
          <g key={`${side}-c-${i}`}>
            <rect
              x={offset + i * (TILE_W + GAP)}
              y={0}
              width={TILE_W}
              height={TILE_H}
              rx={4}
              className={isNeg ? 'fill-duo-red/30 dark:fill-duo-red/20 stroke-duo-red' : 'fill-duo-orange/30 dark:fill-duo-orange/20 stroke-duo-orange'}
              strokeWidth={1.5}
            />
            <text
              x={offset + i * (TILE_W + GAP) + TILE_W / 2}
              y={TILE_H / 2 + 1}
              textAnchor="middle"
              fontSize={11}
              fontWeight="700"
              className="fill-duo-charcoal dark:fill-gray-100"
            >
              {isNeg ? '\u22121' : '1'}
            </text>
          </g>
        )
      }
    }
    if (group.label) {
      tiles.push(
        <text
          key={`${side}-label`}
          x={0}
          y={TILE_H + 16}
          fontSize={10}
          fontWeight="700"
          className="fill-duo-gray"
        >
          {group.label}
        </text>
      )
    }
    return tiles
  }

  const leftW = Math.max(left.xCount + (left.constant ? Math.abs(left.constant) : 0), 1) * (TILE_W + GAP)
  const rightW = Math.max(right.xCount + (right.constant ? Math.abs(right.constant) : 0), 1) * (TILE_W + GAP)
  const totalW = leftW + rightW + 60
  const rightX = leftW + 60

  return (
    <svg
      viewBox={`0 0 ${totalW} ${TILE_H + 24}`}
      className="w-full max-w-sm mx-auto"
      role="img"
      aria-label="Algebra tiles"
    >
      {/* Left side */}
      {animate ? (
        <motion.g
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderTiles(left, 'duo-blue', 'duo-blue', 'left')}
        </motion.g>
      ) : (
        <g>{renderTiles(left, 'duo-blue', 'duo-blue', 'left')}</g>
      )}

      {/* Equals sign */}
      {showEquals && (
        <text
          x={leftW + 30}
          y={TILE_H / 2 + 1}
          textAnchor="middle"
          fontSize={20}
          fontWeight="800"
          className="fill-duo-charcoal dark:fill-gray-100"
        >
          =
        </text>
      )}

      {/* Right side */}
      {animate ? (
        <motion.g
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <g transform={`translate(${rightX}, 0)`}>
            {renderTiles(right, 'duo-green', 'duo-green', 'right')}
          </g>
        </motion.g>
      ) : (
        <g transform={`translate(${rightX}, 0)`}>
          {renderTiles(right, 'duo-green', 'duo-green', 'right')}
        </g>
      )}
    </svg>
  )
}