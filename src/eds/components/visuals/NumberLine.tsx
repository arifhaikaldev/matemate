// NumberLine visual component
// Renders a horizontal number line with ticks, labels, highlights

import type { MouseEvent } from 'react'

interface Props {
  min: number
  max: number
  highlights?: number[]
  labels?: Record<number, string>
  showZero?: boolean
  tickInterval?: number
  interactive?: boolean
  dragTarget?: number | null
  onDrag?: (value: number) => void
  ariaLabel?: string
}

const TRACK_WIDTH = 280
const PADDING = 32

function valueToX(value: number, min: number, max: number): number {
  return PADDING + ((value - min) / (max - min)) * TRACK_WIDTH
}

export function NumberLine({
  min,
  max,
  highlights = [],
  labels = {},
  showZero = true,
  tickInterval = 1,
  interactive = false,
  dragTarget = null,
  onDrag,
  ariaLabel,
}: Props) {
  const totalWidth = TRACK_WIDTH + PADDING * 2
  const ticks: number[] = []
  for (let v = min; v <= max; v += tickInterval) {
    ticks.push(Math.round(v * 1000) / 1000)
  }

  const handleClick = (e: MouseEvent<SVGSVGElement>) => {
    if (!interactive || !onDrag) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const raw = min + ((x - PADDING) / TRACK_WIDTH) * (max - min)
    const snapped = Math.round(raw / tickInterval) * tickInterval
    const clamped = Math.max(min, Math.min(max, snapped))
    onDrag(Math.round(clamped * 1000) / 1000)
  }

  return (
    <svg
      viewBox={`0 0 ${totalWidth} 80`}
      className="w-full max-w-sm"
      role={interactive ? 'slider' : 'img'}
      aria-label={ariaLabel ?? `Number line from ${min} to ${max}`}
      aria-valuemin={interactive ? min : undefined}
      aria-valuemax={interactive ? max : undefined}
      aria-valuenow={interactive && dragTarget !== null ? dragTarget : undefined}
      onClick={handleClick}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
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
      {/* Arrow right */}
      <polygon
        points={`${PADDING + TRACK_WIDTH},36 ${PADDING + TRACK_WIDTH - 8},30 ${PADDING + TRACK_WIDTH - 8},42`}
        className="fill-duo-charcoal dark:fill-gray-200"
      />

      {/* Ticks + Labels */}
      {ticks.map((v) => {
        const x = valueToX(v, min, max)
        const isHighlighted = highlights.includes(v)
        const isZero = v === 0
        const label = labels[v] ?? (isZero && showZero ? '0' : Number.isInteger(v) ? String(v) : null)
        return (
          <g key={v}>
            <line
              x1={x}
              y1={isHighlighted || isZero ? 26 : 30}
              x2={x}
              y2={isHighlighted || isZero ? 46 : 42}
              strokeWidth={isHighlighted || isZero ? 2.5 : 1.5}
              className={
                isHighlighted
                  ? 'stroke-duo-blue'
                  : isZero
                    ? 'stroke-duo-charcoal dark:stroke-gray-200'
                    : 'stroke-duo-gray'
              }
            />
            {label && (
              <text
                x={x}
                y={62}
                textAnchor="middle"
                fontSize={isHighlighted || isZero ? 11 : 10}
                fontWeight={isHighlighted || isZero ? '700' : '400'}
                className={isHighlighted ? 'fill-duo-blue' : 'fill-duo-charcoal dark:fill-gray-200'}
              >
                {label}
              </text>
            )}
            {isHighlighted && (
              <circle cx={x} cy={36} r={6} className="fill-duo-blue" />
            )}
          </g>
        )
      })}

      {/* Drag target indicator */}
      {interactive && dragTarget !== null && (
        <g>
          <circle
            cx={valueToX(dragTarget, min, max)}
            cy={36}
            r={9}
            className="fill-duo-orange stroke-white"
            strokeWidth={2}
          />
          <text
            x={valueToX(dragTarget, min, max)}
            y={40}
            textAnchor="middle"
            fontSize={10}
            fontWeight="700"
            className="fill-white"
          >
            {dragTarget}
          </text>
        </g>
      )}
    </svg>
  )
}
