import { useState } from 'react'

interface TablePair {
  x: number
  y: number
}

interface Props {
  instruction: string
  tablePairs: TablePair[]
  equation: string
  onSuccess: () => void
}

export function TableToPlot({
  instruction,
  tablePairs,
  equation,
  onSuccess,
}: Props) {
  const [plotted, setPlotted] = useState(false)

  const handlePlot = () => {
    setPlotted(true)
    setTimeout(onSuccess, 1200)
  }

  const padding = 30
  const size = 220
  const plotW = size - 2 * padding
  const plotH = size - 2 * padding
  const xMin = -1
  const xMax = 6
  const yMin = -1
  const yMax = 6

  const toSvg = (px: number, py: number) => ({
    sx: padding + ((px - xMin) / (xMax - xMin)) * plotW,
    sy: size - padding - ((py - yMin) / (yMax - yMin)) * plotH,
  })

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d p-6 max-w-sm mx-auto">
        <p className="font-medium text-center mb-3" style={{ color: 'var(--text-secondary)' }}>
          Pasangan penyelesaian untuk {equation}
        </p>
        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="px-4 py-2 font-bold" style={{ color: 'var(--teal)' }}>x</th>
              {tablePairs.map((p, i) => (
                <th key={i} className="px-4 py-2 font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{p.x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 font-bold" style={{ color: 'var(--coral)' }}>y</td>
              {tablePairs.map((p, i) => (
                <td key={i} className="px-4 py-2 font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{p.y}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {!plotted && (
        <div className="text-center">
          <button
            onClick={handlePlot}
            className="px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            Plot
          </button>
        </div>
      )}

      {plotted && (
        <div className="slide-up text-center">
          <div className="card-3d inline-block p-4">
            <svg width={size} height={size} style={{ background: 'var(--card-secondary)', borderRadius: '0.5rem' }}>
              <line x1={padding} y1={size - padding} x2={size - padding} y2={size - padding} stroke="var(--text-muted)" strokeWidth={1.5} />
              <line x1={padding} y1={padding} x2={padding} y2={size - padding} stroke="var(--text-muted)" strokeWidth={1.5} />
              {[0,1,2,3,4,5].map((v) => {
                if (v === 0) return null
                const { sx } = toSvg(v, 0)
                return (
                  <text key={`xl-${v}`} x={sx} y={size - padding + 16} textAnchor="middle" fontSize={10} fill="var(--text-muted)">
                    {v}
                  </text>
                )
              })}
              {[0,1,2,3,4,5].map((v) => {
                if (v === 0) return null
                const { sy } = toSvg(0, v)
                return (
                  <text key={`yl-${v}`} x={padding - 10} y={sy + 4} textAnchor="end" fontSize={10} fill="var(--text-muted)">
                    {v}
                  </text>
                )
              })}
              <text x={padding} y={size - padding + 16} textAnchor="middle" fontSize={10} fontWeight="bold" fill="var(--text-muted)">0</text>
              {tablePairs.map((p, i) => {
                const { sx, sy } = toSvg(p.x, p.y)
                return (
                  <g key={i}>
                    <circle cx={sx} cy={sy} r={5} fill="var(--coral)" stroke="white" strokeWidth={2} />
                    <text x={sx + 8} y={sy - 5} fontSize={10} fill="var(--text-primary)" fontWeight="medium">
                      ({p.x},{p.y})
                    </text>
                  </g>
                )
              })}
            </svg>
            <p className="mt-3 font-medium" style={{ color: 'var(--teal)' }}>
              Semua titik ini memenuhi persamaan {equation}!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}