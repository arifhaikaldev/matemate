import { motion } from 'framer-motion'

interface Point {
  x: number
  y: number
  label?: string
  highlight?: boolean
}

interface LineDef {
  equation?: string
  points: Point[]
  color?: string
  dashed?: boolean
}

interface Intersection {
  x: number
  y: number
  label?: string
}

interface Props {
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  points?: Point[]
  lines?: LineDef[]
  intersection?: Intersection
  showGrid?: boolean
  animate?: boolean
}

const SVG_W = 320
const SVG_H = 320
const MARGIN = 30

function toSvg(px: number, py: number, xMin: number, xMax: number, yMin: number, yMax: number): { sx: number; sy: number } {
  const plotW = SVG_W - 2 * MARGIN
  const plotH = SVG_H - 2 * MARGIN
  const sx = MARGIN + ((px - xMin) / (xMax - xMin)) * plotW
  const sy = MARGIN + plotH - ((py - yMin) / (yMax - yMin)) * plotH
  return { sx, sy }
}

export function CoordinateGrid({
  xMin = -5,
  xMax = 5,
  yMin = -5,
  yMax = 5,
  points = [],
  lines = [],
  intersection,
  showGrid = true,
  animate = true,
}: Props) {
  const plotW = SVG_W - 2 * MARGIN
  const plotH = SVG_H - 2 * MARGIN

  const ticks: number[] = []
  for (let v = Math.ceil(xMin); v <= Math.floor(xMax); v++) ticks.push(v)
  const yTicks: number[] = []
  for (let v = Math.ceil(yMin); v <= Math.floor(yMax); v++) yTicks.push(v)

  const { sx: originX, sy: originY } = toSvg(0, 0, xMin, xMax, yMin, yMax)
  const originVisible = xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0

  const Dot = ({ p, idx }: { p: Point; idx: number }) => {
    const { sx, sy } = toSvg(p.x, p.y, xMin, xMax, yMin, yMax)
    const isOnScreen = sx >= MARGIN - 5 && sx <= SVG_W - MARGIN + 5 && sy >= MARGIN - 5 && sy <= SVG_H - MARGIN + 5
    if (!isOnScreen) return null

    return (
      <motion.g
        initial={animate ? { opacity: 0, scale: 0 } : undefined}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: idx * 0.2, type: 'spring', stiffness: 200, damping: 15 }}
      >
        <circle
          cx={sx}
          cy={sy}
          r={p.highlight ? 7 : 5}
          className={p.highlight ? 'fill-duo-red stroke-white' : 'fill-duo-blue stroke-white'}
          strokeWidth={2}
        />
        {p.label && (
          <text
            x={sx + 10}
            y={sy - 6}
            fontSize={12}
            fontWeight="700"
            className="fill-duo-charcoal dark:fill-gray-100"
          >
            {p.label}
          </text>
        )}
      </motion.g>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="w-full max-w-xs mx-auto"
      role="img"
      aria-label="Satah Cartes"
    >
      {/* Grid */}
      {showGrid &&
        ticks.map((v) => {
          const { sx } = toSvg(v, 0, xMin, xMax, yMin, yMax)
          return (
            <line
              key={`gx-${v}`}
              x1={sx}
              y1={MARGIN}
              x2={sx}
              y2={MARGIN + plotH}
              className="stroke-duo-gray-light/50 dark:stroke-white/5"
              strokeWidth={0.5}
            />
          )
        })}
      {showGrid &&
        yTicks.map((v) => {
          const { sy } = toSvg(0, v, xMin, xMax, yMin, yMax)
          return (
            <line
              key={`gy-${v}`}
              x1={MARGIN}
              y1={sy}
              x2={MARGIN + plotW}
              y2={sy}
              className="stroke-duo-gray-light/50 dark:stroke-white/5"
              strokeWidth={0.5}
            />
          )
        })}

      {/* Axes */}
      {originVisible && (
        <>
          <line
            x1={originX}
            y1={MARGIN}
            x2={originX}
            y2={MARGIN + plotH}
            className="stroke-duo-charcoal dark:stroke-gray-300"
            strokeWidth={1.5}
          />
          <line
            x1={MARGIN}
            y1={originY}
            x2={MARGIN + plotW}
            y2={originY}
            className="stroke-duo-charcoal dark:stroke-gray-300"
            strokeWidth={1.5}
          />
          {/* Arrows */}
          <polygon
            points={`${originX},${MARGIN - 4} ${originX - 4},${MARGIN + 6} ${originX + 4},${MARGIN + 6}`}
            className="fill-duo-charcoal dark:fill-gray-300"
          />
          <polygon
            points={`${MARGIN + plotW + 4},${originY} ${MARGIN + plotW - 6},${originY - 4} ${MARGIN + plotW - 6},${originY + 4}`}
            className="fill-duo-charcoal dark:fill-gray-300"
          />
        </>
      )}

      {/* Axis labels */}
      {ticks
        .filter((v) => v !== 0 || !originVisible)
        .map((v) => {
          const { sx } = toSvg(v, 0, xMin, xMax, yMin, yMax)
          if (sx < MARGIN || sx > MARGIN + plotW) return null
          return (
            <text
              key={`lx-${v}`}
              x={sx}
              y={originVisible ? originY + 16 : MARGIN + plotH + 16}
              textAnchor="middle"
              fontSize={10}
              className="fill-duo-gray dark:fill-gray-400"
            >
              {v}
            </text>
          )
        })}
      {yTicks
        .filter((v) => v !== 0 || !originVisible)
        .map((v) => {
          const { sy } = toSvg(0, v, xMin, xMax, yMin, yMax)
          if (sy < MARGIN || sy > MARGIN + plotH) return null
          return (
            <text
              key={`ly-${v}`}
              x={originVisible ? originX - 10 : MARGIN - 10}
              y={sy + 4}
              textAnchor="end"
              fontSize={10}
              className="fill-duo-gray dark:fill-gray-400"
            >
              {v}
            </text>
          )
        })}

      {/* Origin label */}
      {originVisible && (
        <text
          x={originX - 8}
          y={originY + 16}
          textAnchor="middle"
          fontSize={10}
          className="fill-duo-gray dark:fill-gray-400"
        >
          0
        </text>
      )}

      {/* Axis names */}
      <text x={SVG_W - 10} y={originVisible ? originY - 10 : MARGIN + 12} textAnchor="end" fontSize={12} fontWeight="700" className="fill-duo-charcoal dark:fill-gray-200">x</text>
      <text x={originVisible ? originX + 12 : MARGIN + 8} y={MARGIN + 2} textAnchor="start" fontSize={12} fontWeight="700" className="fill-duo-charcoal dark:fill-gray-200">y</text>

      {/* Lines */}
      {lines.map((line, li) => {
        const linePoints = line.points.map((p) => toSvg(p.x, p.y, xMin, xMax, yMin, yMax))
        if (linePoints.length < 2) return null
        const d = linePoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx},${p.sy}`).join(' ')
        const color = line.color ?? 'duo-green'
        return (
          <motion.path
            key={`line-${li}`}
            d={d}
            fill="none"
            className={`stroke-${color}`}
            strokeWidth={2.5}
            strokeDasharray={line.dashed ? '6,4' : undefined}
            initial={animate ? { pathLength: 0 } : undefined}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: li * 0.3 }}
          />
        )
      })}

      {/* Points */}
      {points.map((p, i) => (
        <Dot key={`pt-${i}`} p={p} idx={i} />
      ))}

      {/* Line points */}
      {lines.map((line, li) =>
        line.points.map((p, pi) => (
          <Dot key={`lp-${li}-${pi}`} p={p} idx={0} />
        ))
      )}

      {/* Intersection */}
      {intersection && (() => {
        const { sx, sy } = toSvg(intersection.x, intersection.y, xMin, xMax, yMin, yMax)
        return (
          <motion.g
            initial={animate ? { opacity: 0, scale: 0 } : undefined}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 150, damping: 12 }}
          >
            <circle cx={sx} cy={sy} r={9} fill="none" className="stroke-duo-red" strokeWidth={3} />
            <circle cx={sx} cy={sy} r={5} className="fill-duo-red" />
            <text
              x={sx + 14}
              y={sy + 4}
              fontSize={13}
              fontWeight="800"
              className="fill-duo-red"
            >
              {intersection.label ?? `(${intersection.x},${intersection.y})`}
            </text>
          </motion.g>
        )
      })()}
    </svg>
  )
}