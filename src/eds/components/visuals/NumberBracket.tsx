// NumberBracket visual component
// Shows a value sandwiched between two perfect squares or cubes for estimation

interface Props {
  value: number
  lowerPerfect: number
  upperPerfect: number
  lowerRoot: number
  upperRoot: number
  operation: 'sqrt' | 'cbrt'
}

export function NumberBracket({
  value,
  lowerPerfect,
  upperPerfect,
  lowerRoot,
  upperRoot,
  operation,
}: Props) {
  const svgWidth = 300
  const svgHeight = 120
  const trackY = 56
  const left = 40
  const right = svgWidth - 40
  const mid = svgWidth / 2

  const symbol = operation === 'sqrt' ? '√' : '³√'
  const lowerLabel = operation === 'sqrt' ? `${lowerRoot}² = ${lowerPerfect}` : `${lowerRoot}³ = ${lowerPerfect}`
  const upperLabel = operation === 'sqrt' ? `${upperRoot}² = ${upperPerfect}` : `${upperRoot}³ = ${upperPerfect}`

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full max-w-sm"
      role="img"
      aria-label={`${symbol}${value} is between ${lowerRoot} and ${upperRoot}`}
    >
      {/* Horizontal track */}
      <line
        x1={left}
        y1={trackY}
        x2={right}
        y2={trackY}
        className="stroke-duo-gray"
        strokeWidth={2}
      />

      {/* Lower bound marker */}
      <line x1={left} y1={trackY - 10} x2={left} y2={trackY + 10} className="stroke-duo-green" strokeWidth={2.5} />
      <text x={left} y={trackY - 16} textAnchor="middle" fontSize={11} fontWeight="700" className="fill-duo-green">
        {lowerRoot}
      </text>
      <text x={left} y={trackY + 24} textAnchor="middle" fontSize={9} className="fill-duo-gray dark:fill-gray-400">
        {lowerLabel}
      </text>

      {/* Upper bound marker */}
      <line x1={right} y1={trackY - 10} x2={right} y2={trackY + 10} className="stroke-duo-green" strokeWidth={2.5} />
      <text x={right} y={trackY - 16} textAnchor="middle" fontSize={11} fontWeight="700" className="fill-duo-green">
        {upperRoot}
      </text>
      <text x={right} y={trackY + 24} textAnchor="middle" fontSize={9} className="fill-duo-gray dark:fill-gray-400">
        {upperLabel}
      </text>

      {/* Value in middle */}
      <circle
        cx={mid}
        cy={trackY}
        r={14}
        className="fill-duo-orange stroke-white"
        strokeWidth={2}
      />
      <text
        x={mid}
        y={trackY + 4}
        textAnchor="middle"
        fontSize={10}
        fontWeight="800"
        className="fill-white"
      >
        {symbol}{value}
      </text>

      {/* "between" arrows */}
      <text
        x={mid - 48}
        y={trackY + 5}
        textAnchor="middle"
        fontSize={16}
        className="fill-duo-charcoal dark:fill-gray-200"
      >
        &lt;
      </text>
      <text
        x={mid + 48}
        y={trackY + 5}
        textAnchor="middle"
        fontSize={16}
        className="fill-duo-charcoal dark:fill-gray-200"
      >
        &lt;
      </text>

      {/* Label at top */}
      <text
        x={mid}
        y={16}
        textAnchor="middle"
        fontSize={11}
        fontWeight="700"
        className="fill-duo-charcoal dark:fill-gray-200"
      >
        {lowerRoot} &lt; {symbol}{value} &lt; {upperRoot}
      </text>
    </svg>
  )
}
