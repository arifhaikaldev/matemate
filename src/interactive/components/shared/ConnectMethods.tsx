import { useState } from 'react'

interface MethodItem {
  name: string
  description: string
}

interface Props {
  instruction: string
  connectMethods: MethodItem[]
  commonSolution: string
  onSuccess: () => void
}

export function ConnectMethods({
  instruction,
  connectMethods,
  commonSolution,
  onSuccess,
}: Props) {
  const [activeMethod, setActiveMethod] = useState<number | null>(null)
  const [viewedAll, setViewedAll] = useState(false)

  const handleClick = (i: number) => {
    setActiveMethod(i)
    if (connectMethods.every((_, idx) => idx === i || activeMethod === idx || activeMethod !== null)) {
      if (activeMethod !== null) {
        setViewedAll(true)
      }
    }
  }

  const handleContinue = () => {
    setViewedAll(true)
    setTimeout(onSuccess, 1000)
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {connectMethods.map((m, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="card-3d p-4 text-center transition-all duration-300"
            style={{
              borderColor: activeMethod === i ? 'var(--teal)' : 'var(--border)',
              background: activeMethod === i ? 'var(--teal-tint)' : 'var(--card)',
              transform: activeMethod === i ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: activeMethod === i ? 'var(--teal)' : 'var(--text-primary)' }}
            >
              {m.name}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {m.description}
            </p>
          </button>
        ))}
      </div>

      {activeMethod !== null && (
        <div className="slide-up text-center">
          <div
            className="card-3d inline-block p-4"
            style={{ borderColor: 'var(--coral)', background: 'var(--coral-tint)' }}
          >
            <p className="font-bold text-lg" style={{ color: 'var(--coral)' }}>
              Penyelesaian: {commonSolution}
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              Ketiga-tiga kaedah mencari titik persilangan yang sama.
            </p>
          </div>
        </div>
      )}

      {activeMethod !== null && !viewedAll && (
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            Seterusnya
          </button>
        </div>
      )}
    </div>
  )
}