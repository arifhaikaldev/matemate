import { useState, useRef, useCallback } from 'react'
import { MathDisplay } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'

interface Point {
  x: number
  y: number
  label?: string
}

interface Props {
  instruction: string
  equation?: string
  points?: Point[]
  requiredPoints?: Point[]
  editable?: boolean
  showLine?: boolean
  onSuccess: () => void
  axes?: { xMin: number; xMax: number; yMin: number; yMax: number }
  lines?: { equation: string; color: string }[]
  intersectionPoint?: Point
  onPointClick?: (point: Point) => void
  showTable?: boolean
  tablePoints?: Point[]
}

function parseLinearFn(eq: string): (x: number) => number | null {
  const clean = eq.replace(/\s/g, '')
  const patterns: [RegExp, (m: RegExpMatchArray) => (x: number) => number][] = [
    [/^y\s*=\s*(-?\d*)x\s*([+-])\s*(\d+)$/, (m) => {
      const coeff = m[1] === '' || m[1] === undefined ? 1 : m[1] === '-' ? -1 : parseInt(m[1])
      const op = m[2]
      const val = parseInt(m[3])
      return (x: number) => (op === '+' ? coeff * x + val : coeff * x - val)
    }],
    [/^y\s*=\s*(-?\d*)x$/, (m) => {
      const coeff = m[1] === '' || m[1] === undefined ? 1 : m[1] === '-' ? -1 : parseInt(m[1])
      return (x: number) => coeff * x
    }],
    [/^y\s*=\s*x\s*([+-])\s*(\d+)$/, (m) => {
      const op = m[1]
      const val = parseInt(m[2])
      return (x: number) => (op === '+' ? x + val : x - val)
    }],
    [/^(\d*)x\s*([+-])\s*(\d*)y\s*=\s*(\d+)$/, (m) => {
      const a = m[1] === '' ? 1 : parseInt(m[1])
      const op = m[2]
      const b = m[3] === '' ? 1 : parseInt(m[3])
      const c = parseInt(m[4])
      return (x: number) => {
        const rhs = c - a * x
        return op === '+' ? rhs / b : -rhs / b
      }
    }],
    [/^(\d*)x\s*([+-])\s*y\s*=\s*(\d+)$/, (m) => {
      const a = m[1] === '' ? 1 : parseInt(m[1])
      const op = m[2]
      const c = parseInt(m[3])
      return (x: number) => (op === '+' ? c - a * x : -(c - a * x))
    }],
    [/^x\s*([+-])\s*y\s*=\s*(-?\d+)$/, (m) => {
      const op = m[1]
      const c = parseInt(m[2])
      return (x: number) => (op === '+' ? c - x : x - c)
    }],
    [/^x\s*-\s*y\s*=\s*(-?\d+)$/, (m) => {
      const c = parseInt(m[1])
      return (x: number) => x - c
    }],
    [/^(\d*)x\s*\+\s*(\d*)y\s*=\s*(\d+)$/, (m) => {
      const a = m[1] === '' ? 1 : parseInt(m[1])
      const b = m[2] === '' ? 1 : parseInt(m[2])
      const c = parseInt(m[3])
      return (x: number) => (c - a * x) / b
    }],
  ]

  for (const [re, fn] of patterns) {
    const m = clean.match(re)
    if (m) return fn(m)
  }
  return () => null
}

function getLinePoints(eq: string, xMin: number, xMax: number): Point[] | null {
  const fn = parseLinearFn(eq)
  if (!fn) return null
  const pts: Point[] = []
  for (let x = xMin; x <= xMax; x += 0.5) {
    const y = fn(x)
    if (y !== null && isFinite(y)) {
      pts.push({ x, y })
    }
  }
  return pts
}

export function GraphPlot({
  instruction,
  equation,
  points = [],
  requiredPoints = [],
  editable = false,
  showLine = false,
  onSuccess,
  axes = { xMin: -1, xMax: 6, yMin: -1, yMax: 6 },
  lines,
  intersectionPoint,
  onPointClick,
  showTable = false,
  tablePoints = [],
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [placedPoints, setPlacedPoints] = useState<Point[]>([])
  const [lineDrawn, setLineDrawn] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null)

  const { xMin, xMax, yMin, yMax } = axes
  const width = 400
  const height = 400
  const padding = 40
  const plotW = width - 2 * padding
  const plotH = height - 2 * padding

  const toSvg = useCallback(
    (px: number, py: number) => ({
      sx: padding + ((px - xMin) / (xMax - xMin)) * plotW,
      sy: height - padding - ((py - yMin) / (yMax - yMin)) * plotH,
    }),
    [xMin, xMax, yMin, yMax, plotW, plotH, height, padding],
  )

  const toData = useCallback(
    (sx: number, sy: number) => ({
      x: Math.round(((sx - padding) / plotW) * (xMax - xMin) + xMin),
      y: Math.round(((height - padding - sy) / plotH) * (yMax - yMin) + yMin),
    }),
    [xMin, xMax, yMin, yMax, plotW, plotH, height, padding],
  )

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!editable || succeeded || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const sx = e.clientX - rect.left
    const sy = e.clientY - rect.top
    const { x, y } = toData(sx, sy)
    if (x < xMin || x > xMax || y < yMin || y > yMax) return

    setPlacedPoints((prev) => {
      const exists = prev.some((p) => p.x === x && p.y === y)
      if (exists) return prev.filter((p) => !(p.x === x && p.y === y))
      return [...prev, { x, y }]
    })
  }

  const handlePointClick = (pt: Point) => {
    setSelectedPoint(pt)
    if (onPointClick) onPointClick(pt)
  }

  const checkPoints = () => {
    let allCorrect = true
    for (const rp of requiredPoints) {
      const found = placedPoints.some((pp) => pp.x === rp.x && pp.y === rp.y)
      if (!found) {
        allCorrect = false
        break
      }
    }
    if (allCorrect && placedPoints.length >= requiredPoints.length) {
      setLineDrawn(true)
      setSucceeded(true)
      setTimeout(onSuccess, 1200)
    }
  }

  const drawLine = () => {
    setLineDrawn(true)
    setSucceeded(true)
    setTimeout(onSuccess, 1200)
  }

  const gridLines: { x: number; y: number }[] = []
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    gridLines.push({ x, y: 0 })
  }
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
    gridLines.push({ x: 0, y })
  }

  const renderLine = (eq: string, color: string) => {
    const pts = getLinePoints(eq, xMin, xMax)
    if (!pts || pts.length < 2) return null
    const svgPts = pts.map((p) => {
      const { sx, sy } = toSvg(p.x, p.y)
      return `${sx},${sy}`
    })
    return <polyline points={svgPts.join(' ')} fill="none" stroke={color} strokeWidth={2.5} />
  }

  const allPoints = [
    ...points.map((p) => ({ ...p, isExisting: true })),
    ...placedPoints.map((p) => ({ ...p, isPlaced: true })),
    ...tablePoints.map((p) => ({ ...p, isTable: true })),
  ]

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      {equation && (
        <div className="card-3d p-4 text-center">
          <MathDisplay>{equation}</MathDisplay>
        </div>
      )}

      {showTable && tablePoints.length > 0 && (
        <div className="flex justify-center">
          <div className="card-3d p-3 inline-block">
            <table className="text-center text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-1 font-bold" style={{ color: 'var(--teal)' }}>x</th>
                  {tablePoints.map((p, i) => (
                    <th key={i} className="px-3 py-1 font-bold" style={{ color: 'var(--text-primary)' }}>{p.x}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-1 font-bold" style={{ color: 'var(--coral)' }}>y</td>
                  {tablePoints.map((p, i) => (
                    <td key={i} className="px-3 py-1 font-bold" style={{ color: 'var(--text-primary)' }}>{p.y}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          onClick={editable && !succeeded ? handleSvgClick : undefined}
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            cursor: editable && !succeeded ? 'crosshair' : 'default',
          }}
        >
          {/* Grid lines */}
          {gridLines.map((g, i) => {
            if (g.x !== 0) {
              const { sx } = toSvg(g.x, 0)
              return (
                <line key={`gx-${i}`} x1={sx} y1={padding} x2={sx} y2={height - padding} stroke="var(--border)" strokeWidth={0.5} />
              )
            }
            if (g.y !== 0) {
              const { sy } = toSvg(0, g.y)
              return (
                <line key={`gy-${i}`} x1={padding} y1={sy} x2={width - padding} y2={sy} stroke="var(--border)" strokeWidth={0.5} />
              )
            }
            return null
          })}

          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--text-muted)" strokeWidth={1.5} />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--text-muted)" strokeWidth={1.5} />

          {/* Axis labels */}
          {Array.from({ length: xMax - xMin + 1 }, (_, i) => xMin + i).map((v) => {
            if (v === 0) return null
            const { sx } = toSvg(v, 0)
            return (
              <text key={`xl-${v}`} x={sx} y={height - padding + 18} textAnchor="middle" fontSize={11} fill="var(--text-muted)">
                {v}
              </text>
            )
          })}
          {Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i).map((v) => {
            if (v === 0) return null
            const { sy } = toSvg(0, v)
            return (
              <text key={`yl-${v}`} x={padding - 12} y={sy + 4} textAnchor="end" fontSize={11} fill="var(--text-muted)">
                {v}
              </text>
            )
          })}
          <text x={padding} y={height - padding + 18} textAnchor="middle" fontSize={11} fontWeight="bold" fill="var(--text-muted)">0</text>
          <text x={width - padding + 8} y={height - padding + 4} textAnchor="start" fontSize={12} fontWeight="bold" fill="var(--text-muted)">x</text>
          <text x={padding - 4} y={padding - 8} textAnchor="middle" fontSize={12} fontWeight="bold" fill="var(--text-muted)">y</text>

          {/* Lines from equations */}
          {lines?.map((l) => renderLine(l.equation, l.color))}

          {/* Computed line from single equation */}
          {showLine && equation && renderLine(equation, 'var(--teal)')}

          {/* Line through placed points */}
          {lineDrawn && placedPoints.length >= 2 && (
            <polyline
              points={placedPoints.map((p) => {
                const { sx, sy } = toSvg(p.x, p.y)
                return `${sx},${sy}`
              }).join(' ')}
              fill="none"
              stroke="var(--teal)"
              strokeWidth={2.5}
            />
          )}

          {/* Points */}
          {allPoints.map((p, i) => {
            const { sx, sy } = toSvg(p.x, p.y)
            const isSelected = selectedPoint?.x === p.x && selectedPoint?.y === p.y
            const fill = (p as any).isExisting ? 'var(--coral)' : (p as any).isTable ? 'var(--teal)' : 'var(--teal)'
            return (
              <g key={`pt-${i}`} onClick={() => handlePointClick(p)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={sx}
                  cy={sy}
                  r={6}
                  fill={fill}
                  stroke="white"
                  strokeWidth={2}
                  opacity={isSelected ? 0.7 : 1}
                />
                {p.label && (
                  <text x={sx + 10} y={sy - 5} fontSize={11} fill="var(--text-primary)" fontWeight="medium">
                    {p.label}
                  </text>
                )}
              </g>
            )
          })}

          {/* Intersection point */}
          {intersectionPoint && (
            <g>
              <circle
                cx={toSvg(intersectionPoint.x, intersectionPoint.y).sx}
                cy={toSvg(intersectionPoint.x, intersectionPoint.y).sy}
                r={8}
                fill="var(--coral)"
                stroke="white"
                strokeWidth={3}
              />
              <text
                x={toSvg(intersectionPoint.x, intersectionPoint.y).sx + 14}
                y={toSvg(intersectionPoint.x, intersectionPoint.y).sy - 8}
                fontSize={13}
                fontWeight="bold"
                fill="var(--coral)"
              >
                ({intersectionPoint.x},{intersectionPoint.y})
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Selected point info */}
      {selectedPoint && onPointClick && (
        <div className="text-center slide-up">
          <div
            className="card-3d inline-block p-3"
            style={{ borderColor: 'var(--teal)' }}
          >
            <p className="font-bold" style={{ color: 'var(--teal)' }}>
              ({selectedPoint.x}, {selectedPoint.y})
            </p>
            {equation && (
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Gantikan: {equation.replace('y', String(selectedPoint.y)).replace('x', String(selectedPoint.x))}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Check placed points */}
      {editable && placedPoints.length >= requiredPoints.length && !succeeded && (
        <div className="text-center">
          <button
            onClick={checkPoints}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            Semak Titik
          </button>
        </div>
      )}

      {/* Draw line button */}
      {editable && placedPoints.length >= 3 && !succeeded && !lineDrawn && (
        <div className="text-center">
          <button
            onClick={drawLine}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'var(--coral)' }}
          >
            Sambungkan Garis
          </button>
        </div>
      )}

      {succeeded && (
        <Feedback type="correct" message="Tepat! Cuba titik seterusnya." />
      )}
    </div>
  )
}