import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function CoordinateGrid({ data }: Props) {
  const xMin = data.xMin as number ?? -2
  const xMax = data.xMax as number ?? 6
  const yMin = data.yMin as number ?? -2
  const yMax = data.yMax as number ?? 8
  const points = data.points as Array<{ x: number; y: number; label?: string }> | undefined
  const drawLine = data.drawLine as boolean
  const showGrid = data.showGrid as boolean
  const animatePlot = data.animatePlot as boolean

  const W = 260
  const H = 220
  const pad = 30
  const plotW = W - pad * 2
  const plotH = H - pad * 2
  const xRange = xMax - xMin
  const yRange = yMax - yMin

  const toX = (v: number) => pad + ((v - xMin) / xRange) * plotW
  const toY = (v: number) => pad + plotH - ((v - yMin) / yRange) * plotH

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      {/* Grid */}
      {showGrid && Array.from({ length: xRange + 1 }, (_, i) => {
        const x = toX(xMin + i)
        return <line key={`gx${i}`} x1={x} y1={pad} x2={x} y2={pad + plotH} stroke="#e2e8f0" strokeWidth={0.5} />
      })}
      {showGrid && Array.from({ length: yRange + 1 }, (_, i) => {
        const y = toY(yMin + i)
        return <line key={`gy${i}`} x1={pad} y1={y} x2={pad + plotW} y2={y} stroke="#e2e8f0" strokeWidth={0.5} />
      })}

      {/* Axes */}
      <motion.line x1={pad} y1={pad + plotH / 2} x2={pad + plotW} y2={pad + plotH / 2} stroke="#94a3b8" strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
      <motion.line x1={pad + plotW / 2} y1={pad} x2={pad + plotW / 2} y2={pad + plotH} stroke="#94a3b8" strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />

      {/* Axis labels */}
      <text x={pad + plotW / 2} y={pad + plotH + 14} textAnchor="middle" fill="#94a3b8" fontSize={9} fontWeight="bold">x</text>
      <text x={pad + plotW + 8} y={pad + plotH / 2 + 3} textAnchor="middle" fill="#94a3b8" fontSize={9} fontWeight="bold">y</text>
      <text x={pad - 6} y={pad + plotH / 2 + 3} textAnchor="end" fill="#94a3b8" fontSize={8}>O</text>

      {/* Ticks */}
      {Array.from({ length: xRange + 1 }, (_, i) => {
        const x = toX(xMin + i)
        return (
          <g key={`tx${i}`}>
            <line x1={x} y1={pad + plotH / 2 - 3} x2={x} y2={pad + plotH / 2 + 3} stroke="#94a3b8" strokeWidth={1} />
            <text x={x} y={pad + plotH / 2 + 12} textAnchor="middle" fill="#94a3b8" fontSize={8}>{xMin + i}</text>
          </g>
        )
      })}
      {Array.from({ length: yRange + 1 }, (_, i) => {
        const y = toY(yMin + i)
        return (
          <g key={`ty${i}`}>
            <line x1={pad + plotW / 2 - 3} y1={y} x2={pad + plotW / 2 + 3} y2={y} stroke="#94a3b8" strokeWidth={1} />
            <text x={pad + plotW / 2 - 6} y={y + 3} textAnchor="end" fill="#94a3b8" fontSize={8}>{yMin + i}</text>
          </g>
        )
      })}

      {/* Line through points */}
      {drawLine && points && points.length >= 2 && (
        <motion.line
          x1={toX(points[0].x)} y1={toY(points[0].y)}
          x2={toX(points[points.length - 1].x)} y2={toY(points[points.length - 1].y)}
          stroke="#6d28d9" strokeWidth={2.5} strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
      )}

      {/* Points */}
      {points?.map((p, i) => (
        <motion.g key={i}
          initial={animatePlot ? { opacity: 0, scale: 0 } : undefined}
          animate={animatePlot ? { opacity: 1, scale: 1 } : undefined}
          transition={{ delay: 0.15 * i, type: 'spring' }}
        >
          {/* Dashed lines to axes */}
          <line x1={toX(p.x)} y1={toY(p.y)} x2={toX(p.x)} y2={pad + plotH / 2} stroke="#c4b5fd" strokeWidth={1} strokeDasharray="3 2" />
          <line x1={toX(p.x)} y1={toY(p.y)} x2={pad + plotW / 2} y2={toY(p.y)} stroke="#c4b5fd" strokeWidth={1} strokeDasharray="3 2" />
          {/* Point */}
          <circle cx={toX(p.x)} cy={toY(p.y)} r={5} fill="#7c3aed" stroke="#fff" strokeWidth={2} />
          {p.label && (
            <text x={toX(p.x) + 8} y={toY(p.y) - 6} fill="#6d28d9" fontSize={9} fontWeight="bold" fontFamily="monospace">
              {p.label}
            </text>
          )}
        </motion.g>
      ))}
    </svg>
  )
}