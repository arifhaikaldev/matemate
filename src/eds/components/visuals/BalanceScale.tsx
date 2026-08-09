import { motion } from 'framer-motion'

interface Props {
  leftLabel?: string
  rightLabel?: string
  leftValue?: number
  rightValue?: number
  tilt?: 'left' | 'right' | 'balanced'
  showItems?: boolean
}

export function BalanceScale({
  leftLabel = 'Kiri',
  rightLabel = 'Kanan',
  leftValue,
  rightValue,
  tilt = 'balanced',
  showItems = true,
}: Props) {
  const cx = 200

  const angle =
    tilt === 'left' ? -12 : tilt === 'right' ? 12 : 0

  const leftPanY = tilt === 'left' ? 30 : tilt === 'right' ? -30 : 0
  const rightPanY = tilt === 'right' ? 30 : tilt === 'left' ? -30 : 0

  return (
    <svg
      viewBox="0 0 400 250"
      className="w-full max-w-sm mx-auto"
      role="img"
      aria-label={`Penimbang: ${tilt === 'balanced' ? 'seimbang' : `senget ke ${tilt}`}`}
    >
      {/* Base / stand */}
      <polygon
        points="185,220 215,220 210,170 190,170"
        className="fill-duo-charcoal/30 dark:fill-white/20"
      />
      <rect x="170" y="220" width="60" height="8" rx="4" className="fill-duo-charcoal/40 dark:fill-white/25" />

      {/* Pivot */}
      <polygon
        points="190,170 210,170 220,140 180,140"
        className="fill-duo-charcoal/40 dark:fill-white/30"
      />
      <circle cx={cx} cy={138} r={8} className="fill-duo-charcoal dark:fill-gray-200" />

      {/* Beam — animated */}
      <motion.g
        animate={{ rotate: angle }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        style={{ originX: `${cx}px`, originY: `${138}px` }}
      >
        <rect
          x={60}
          y={132}
          width={280}
          height={12}
          rx={6}
          className="fill-duo-brown dark:fill-amber-700"
        />

        {/* Left pan strings */}
        <line x1={100} y1={144} x2={100} y2={170 + leftPanY} className="stroke-duo-charcoal/50 dark:stroke-white/40" strokeWidth={1.5} />
        <line x1={140} y1={144} x2={140} y2={170 + leftPanY} className="stroke-duo-charcoal/50 dark:stroke-white/40" strokeWidth={1.5} />

        {/* Right pan strings */}
        <line x1={260} y1={144} x2={260} y2={170 + rightPanY} className="stroke-duo-charcoal/50 dark:stroke-white/40" strokeWidth={1.5} />
        <line x1={300} y1={144} x2={300} y2={170 + rightPanY} className="stroke-duo-charcoal/50 dark:stroke-white/40" strokeWidth={1.5} />

        {/* Left pan */}
        <motion.g animate={{ y: leftPanY }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
          <rect
            x={80}
            y={170}
            width={80}
            height={16}
            rx={3}
            className="fill-duo-blue-light stroke-duo-blue dark:fill-duo-blue/30 dark:stroke-duo-blue"
            strokeWidth={1.5}
          />
          {showItems && leftValue !== undefined && (
            <text
              x={120}
              y={182}
              textAnchor="middle"
              fontSize={13}
              fontWeight="700"
              className="fill-duo-charcoal dark:fill-gray-100"
            >
              {leftLabel}: {leftValue}
            </text>
          )}
        </motion.g>

        {/* Right pan */}
        <motion.g animate={{ y: rightPanY }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
          <rect
            x={240}
            y={170}
            width={80}
            height={16}
            rx={3}
            className="fill-duo-green-light stroke-duo-green dark:fill-duo-green/30 dark:stroke-duo-green"
            strokeWidth={1.5}
          />
          {showItems && rightValue !== undefined && (
            <text
              x={280}
              y={182}
              textAnchor="middle"
              fontSize={13}
              fontWeight="700"
              className="fill-duo-charcoal dark:fill-gray-100"
            >
              {rightLabel}: {rightValue}
            </text>
          )}
        </motion.g>
      </motion.g>

      {/* Center label */}
      <text
        x={cx}
        y={115}
        textAnchor="middle"
        fontSize={16}
        fontWeight="800"
        className="fill-duo-charcoal dark:fill-gray-100"
      >
        {tilt === 'balanced' ? '=' : '\u2260'}
      </text>
    </svg>
  )
}