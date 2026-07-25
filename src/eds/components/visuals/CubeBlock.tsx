// CubeBlock visual component
// Renders an isometric n×n×n cube made of unit blocks to illustrate n³

import type { ReactElement } from 'react'

interface Props {
  n: number
  highlightFace?: boolean
}

export function CubeBlock({ n, highlightFace = false }: Props) {
  const svgWidth = 220
  const svgHeight = 200

  // Isometric projection constants
  const isoAngle = Math.PI / 6 // 30 degrees
  const unitW = Math.max(8, Math.min(22, Math.floor(60 / n))) // face width
  const unitH = unitW * Math.tan(isoAngle) // half height of rhombus

  const cx = svgWidth / 2
  const baseY = svgHeight - 24

  // Draw the three visible faces of each unit cube
  // For an n×n×n cube, we draw layers from back to front
  const topFaces: ReactElement[] = []
  const rightFaces: ReactElement[] = []
  const leftFaces: ReactElement[] = []

  for (let z = 0; z < n; z++) {
    for (let x = 0; x < n; x++) {
      for (let y = 0; y < n; y++) {
        const px = cx + (x - z) * unitW
        const py = baseY - y * unitH * 2 - (x + z) * unitH

        // Top face
        topFaces.push(
          <polygon
            key={`top-${x}-${y}-${z}`}
            points={[
              [px, py - unitH * 2],
              [px + unitW, py - unitH],
              [px, py],
              [px - unitW, py - unitH],
            ]
              .map((p) => p.join(','))
              .join(' ')}
            className={
              highlightFace && y === n - 1
                ? 'fill-duo-blue stroke-duo-blue-dark'
                : 'fill-duo-blue/30 stroke-duo-blue dark:fill-duo-blue/40'
            }
            strokeWidth={0.75}
          />
        )

        // Right face
        rightFaces.push(
          <polygon
            key={`right-${x}-${y}-${z}`}
            points={[
              [px, py],
              [px + unitW, py - unitH],
              [px + unitW, py - unitH + unitH * 2],
              [px, py + unitH * 2],
            ]
              .map((p) => p.join(','))
              .join(' ')}
            className="fill-duo-blue/15 stroke-duo-blue dark:fill-duo-blue/20"
            strokeWidth={0.75}
          />
        )

        // Left face
        leftFaces.push(
          <polygon
            key={`left-${x}-${y}-${z}`}
            points={[
              [px - unitW, py - unitH],
              [px, py],
              [px, py + unitH * 2],
              [px - unitW, py - unitH + unitH * 2],
            ]
              .map((p) => p.join(','))
              .join(' ')}
            className="fill-duo-blue/10 stroke-duo-blue dark:fill-duo-blue/15"
            strokeWidth={0.75}
          />
        )
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full max-w-xs"
      role="img"
      aria-label={`${n} by ${n} by ${n} cube of unit blocks showing ${n} cubed equals ${n ** 3}`}
    >
      {/* Render back-to-front for correct overlap */}
      {leftFaces}
      {rightFaces}
      {topFaces}

      {/* Label */}
      <text
        x={cx}
        y={svgHeight - 6}
        textAnchor="middle"
        fontSize={13}
        fontWeight="800"
        className="fill-duo-charcoal dark:fill-gray-200"
      >
        {n}³ = {n ** 3} unit padu
      </text>
    </svg>
  )
}
