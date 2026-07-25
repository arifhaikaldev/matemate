// SquareRootProduct visual component
// Illustrates √a × √a = a and √a × √b = √(ab)

interface Props {
  a: number
  b?: number
  showProduct?: boolean
}

export function SquareRootProduct({ a, b, showProduct = true }: Props) {
  const svgWidth = 300
  const svgHeight = 90
  const isSame = b === undefined || b === a

  // Case 1: √a × √a = a
  // Case 2: √a × √b = √(ab)
  const leftLabel = `√${a}`
  const rightLabel = isSame ? `√${a}` : `√${b}`
  const resultLabel = isSame ? String(a) : `√${a * (b ?? a)}`
  const resultNote = isSame ? `= ${a}` : `= √${a * (b ?? a)}`

  const cx = svgWidth / 2
  const cy = 40
  const boxW = 52
  const boxH = 36
  const gap = 24

  const leftX = cx - gap / 2 - boxW
  const rightX = cx + gap / 2

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full max-w-sm"
      role="img"
      aria-label={`${leftLabel} times ${rightLabel} equals ${resultLabel}`}
    >
      {/* Left box */}
      <rect
        x={leftX}
        y={cy - boxH / 2}
        width={boxW}
        height={boxH}
        rx={8}
        className="fill-duo-blue/20 stroke-duo-blue dark:fill-duo-blue/30"
        strokeWidth={1.5}
      />
      <text
        x={leftX + boxW / 2}
        y={cy + 5}
        textAnchor="middle"
        fontSize={15}
        fontWeight="800"
        className="fill-duo-blue dark:fill-duo-blue"
      >
        {leftLabel}
      </text>

      {/* × symbol */}
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontSize={16}
        fontWeight="700"
        className="fill-duo-charcoal dark:fill-gray-200"
      >
        ×
      </text>

      {/* Right box */}
      <rect
        x={rightX}
        y={cy - boxH / 2}
        width={boxW}
        height={boxH}
        rx={8}
        className="fill-duo-blue/20 stroke-duo-blue dark:fill-duo-blue/30"
        strokeWidth={1.5}
      />
      <text
        x={rightX + boxW / 2}
        y={cy + 5}
        textAnchor="middle"
        fontSize={15}
        fontWeight="800"
        className="fill-duo-blue dark:fill-duo-blue"
      >
        {rightLabel}
      </text>

      {/* = and result */}
      {showProduct && (
        <>
          <text
            x={rightX + boxW + 14}
            y={cy + 5}
            textAnchor="middle"
            fontSize={16}
            fontWeight="700"
            className="fill-duo-charcoal dark:fill-gray-200"
          >
            =
          </text>
          <text
            x={rightX + boxW + 38}
            y={cy + 5}
            textAnchor="start"
            fontSize={15}
            fontWeight="800"
            className="fill-duo-green-dark dark:fill-duo-green"
          >
            {resultNote}
          </text>
        </>
      )}

      {/* Subtitle */}
      <text
        x={cx}
        y={svgHeight - 6}
        textAnchor="middle"
        fontSize={10}
        className="fill-duo-gray dark:fill-gray-400"
      >
        {isSame ? `√${a} × √${a} = ${a}` : `√${a} × √${b} = √${a * (b ?? a)}`}
      </text>
    </svg>
  )
}
