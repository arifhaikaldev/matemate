import { motion } from 'framer-motion'

interface Props {
  data: Record<string, unknown>
}

export function BalanceScale({ data }: Props) {
  const leftValue = data.leftValue as number
  const rightValue = data.rightValue as number
  const showValues = data.showValues as boolean
  const animations = data.animations as Array<{
    action: string
    direction?: string
    value?: number
    label?: string
  }>

  const tilted = animations?.some((a) => a.action === 'tilt')

  return (
    <svg viewBox="0 0 300 220" className="w-full h-full">
      {/* Stand */}
      <motion.line
        x1={150} y1={60} x2={150} y2={180}
        stroke="#94a3b8" strokeWidth={4} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      {/* Base */}
      <motion.path
        d="M110 180 h80"
        stroke="#94a3b8" strokeWidth={4} strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      {/* Beam (rotates when tilted) */}
      <motion.line
        x1={60} y1={60} x2={240} y2={60}
        stroke="#475569" strokeWidth={6} strokeLinecap="round"
        animate={{
          rotate: tilted ? 15 : 0,
          transformOrigin: '150px 60px',
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      />
      {/* Left pan */}
      <motion.g
        animate={tilted ? { y: 12 } : { y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <line x1={60} y1={80} x2={60} y2={110} stroke="#475569" strokeWidth={3} />
        <rect x={30} y={110} width={60} height={12} rx={4} fill="#a78bfa" />
        {showValues && (
          <text x={60} y={130} textAnchor="middle" fill="#6d28d9" fontSize={11} fontWeight="bold">
            {leftValue} kg
          </text>
        )}
      </motion.g>
      {/* Right pan */}
      <motion.g
        animate={tilted ? { y: -12 } : { y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      >
        <line x1={240} y1={80} x2={240} y2={110} stroke="#475569" strokeWidth={3} />
        <rect x={210} y={110} width={60} height={12} rx={4} fill="#c084fc" />
        {showValues && (
          <text x={240} y={130} textAnchor="middle" fill="#6d28d9" fontSize={11} fontWeight="bold">
            {rightValue} kg
          </text>
        )}
      </motion.g>
      {/* Pivot */}
      <motion.polygon
        points="145,60 155,60 150,50"
        fill="#475569"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      />
      {/* Labels */}
      <text x={60} y={95} textAnchor="middle" fill="#64748b" fontSize={9} fontWeight="bold">KIRI</text>
      <text x={240} y={95} textAnchor="middle" fill="#64748b" fontSize={9} fontWeight="bold">KANAN</text>
      {/* Animation labels */}
      {animations?.map((anim, i) => (
        anim.label && (
          <motion.text
            key={i}
            x={150} y={155 + i * 16}
            textAnchor="middle"
            fill={anim.action === 'wrongRemove' || anim.action === 'tilt' ? '#ef4444' : '#059669'}
            fontSize={10}
            fontWeight="bold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.3 }}
          >
            {anim.label}
          </motion.text>
        )
      ))}
    </svg>
  )
}