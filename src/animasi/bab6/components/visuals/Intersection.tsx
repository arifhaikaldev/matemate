import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function Intersection({ data }: Props) {
  const equation1 = data.equation1 as string
  const equation2 = data.equation2 as string
  const intersection = data.intersection as { x: number; y: number }
  const animateLines = data.animateLines as boolean
  const animatePoint = data.animatePoint as boolean
  const cases = data.cases as Array<{
    label: string
    equation1: string
    equation2: string
    type: string
  }>

  const W = 260
  const H = 200
  const pad = 30
  const plotW = W - pad * 2
  const plotH = H - pad * 2

  // Standard view with intersection
  const renderStandard = () => {
    const xMin = data.xMin as number ?? -1
    const xMax = data.xMax as number ?? 8
    const yMin = data.yMin as number ?? -1
    const yMax = data.yMax as number ?? 14
    const xRange = xMax - xMin
    const yRange = yMax - yMin

    const tx = (v: number) => pad + ((v - xMin) / xRange) * plotW
    const ty = (v: number) => pad + plotH - ((v - yMin) / yRange) * plotH

    // Line 1: x + y = 7 -> points (0,7) and (7,0)
    const l1x1 = tx(0), l1y1 = ty(7), l1x2 = tx(7), l1y2 = ty(0)
    // Line 2: 2x + y = 12 -> points (0,12) and (6,0)
    const l2x1 = tx(0), l2y1 = ty(12), l2x2 = tx(6), l2y2 = ty(0)

    return (
      <>
        {/* Axes */}
        <motion.line x1={pad} y1={pad + plotH / 2} x2={pad + plotW} y2={pad + plotH / 2} stroke="#94a3b8" strokeWidth={1} />
        <motion.line x1={pad + plotW / 2} y1={pad} x2={pad + plotW / 2} y2={pad + plotH} stroke="#94a3b8" strokeWidth={1} />
        <text x={pad + plotW / 2} y={pad + plotH + 12} textAnchor="middle" fill="#94a3b8" fontSize={8}>x</text>
        <text x={pad + plotW + 6} y={pad + plotH / 2 + 3} textAnchor="middle" fill="#94a3b8" fontSize={8}>y</text>

        {/* Line 1 */}
        <motion.line x1={l1x1} y1={l1y1} x2={l1x2} y2={l1y2} stroke="#7c3aed" strokeWidth={2.5} strokeLinecap="round"
          initial={animateLines ? { pathLength: 0 } : undefined}
          animate={animateLines ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.5 }} />
        <text x={tx(6) + 4} y={ty(1) + 4} fill="#7c3aed" fontSize={9} fontWeight="bold">{equation1}</text>

        {/* Line 2 */}
        <motion.line x1={l2x1} y1={l2y1} x2={l2x2} y2={l2y2} stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round"
          initial={animateLines ? { pathLength: 0 } : undefined}
          animate={animateLines ? { pathLength: 1 } : undefined}
          transition={{ duration: 0.5, delay: 0.2 }} />
        <text x={tx(4) + 4} y={ty(4) - 6} fill="#f59e0b" fontSize={9} fontWeight="bold">{equation2}</text>

        {/* Intersection point */}
        {intersection && (
          <motion.g
            initial={animatePoint ? { scale: 0 } : undefined}
            animate={animatePoint ? { scale: 1 } : undefined}
            transition={{ type: 'spring', delay: 0.5 }}
          >
            <circle cx={tx(intersection.x)} cy={ty(intersection.y)} r={6} fill="#ef4444" stroke="#fff" strokeWidth={2.5} />
            <motion.text
              x={tx(intersection.x) + 10} y={ty(intersection.y) - 8}
              fill="#ef4444" fontSize={11} fontWeight="black" fontFamily="monospace"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            >
              ({intersection.x},{intersection.y})
            </motion.text>
          </motion.g>
        )}
      </>
    )
  }

  // Multiple cases view
  const renderCases = () => {
    return (
      <>
        {/* Axes */}
        <line x1={pad} y1={pad + plotH / 2} x2={pad + plotW} y2={pad + plotH / 2} stroke="#94a3b8" strokeWidth={1} />
        <line x1={pad + plotW / 2} y1={pad} x2={pad + plotW / 2} y2={pad + plotH} stroke="#94a3b8" strokeWidth={1} />

        {cases?.map((c, ci) => {
          const xo = ci * 90
          return (
            <motion.g key={ci} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: ci * 0.3 }}>
              <svg x={xo} y={0} width={90} height={H - 10}>
                {/* Line 1 */}
                {c.type === 'intersecting' && (
                  <>
                    <line x1={10} y1={20} x2={80} y2={80} stroke="#7c3aed" strokeWidth={2} />
                    <line x1={20} y1={80} x2={75} y2={25} stroke="#f59e0b" strokeWidth={2} />
                    <circle cx={48} cy={48} r={4} fill="#ef4444" />
                  </>
                )}
                {c.type === 'parallel' && (
                  <>
                    <line x1={10} y1={30} x2={80} y2={30} stroke="#7c3aed" strokeWidth={2} />
                    <line x1={10} y1={70} x2={80} y2={70} stroke="#f59e0b" strokeWidth={2} />
                  </>
                )}
                {c.type === 'coincident' && (
                  <>
                    <line x1={10} y1={50} x2={80} y2={50} stroke="#7c3aed" strokeWidth={2} />
                    <line x1={12} y1={48} x2={78} y2={48} stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 3" />
                  </>
                )}
                <text x={45} y={98} textAnchor="middle" fill="#1e293b" fontSize={7} fontWeight="bold">{c.label}</text>
              </svg>
            </motion.g>
          )
        })}
      </>
    )
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      {cases ? renderCases() : renderStandard()}
    </svg>
  )
}