import { useState } from 'react'

interface MethodItem {
  name: string
  description: string
  steps?: string[]
}

interface Props {
  instruction: string
  connectMethods: MethodItem[]
  commonSolution: string
  onSuccess: () => void
}

const methodDetails: Record<string, { steps: string[] }> = {
  Graf: {
    steps: [
      'Lukis garis untuk x - 3y = 7',
      'Lukis garis untuk 5x + 2y = 1',
      'Cari titik persilangan kedua-dua garis',
      'Titik persilangan: (1, -2)',
    ],
  },
  Penggantian: {
    steps: [
      'x - 3y = 7 → x = 7 + 3y',
      'Gantikan x dalam 5x + 2y = 1',
      '5(7 + 3y) + 2y = 1 → 35 + 17y = 1 → y = -2',
      'Gantikan y = -2 → x = 7 + 3(-2) = 1',
    ],
  },
  Penghapusan: {
    steps: [
      'Darab persamaan pertama dengan 5: 5x - 15y = 35',
      'Tolak daripada persamaan kedua: (5x+2y) - (5x-15y) = 1 - 35',
      '17y = -34 → y = -2',
      'Gantikan y = -2 → x = 1',
    ],
  },
}

export function ConnectMethods({
  instruction,
  connectMethods,
  commonSolution,
  onSuccess,
}: Props) {
  const [activeMethod, setActiveMethod] = useState<number | null>(null)
  const [viewedMethods, setViewedMethods] = useState<Set<number>>(new Set())

  const handleClick = (i: number) => {
    setActiveMethod(i)
    setViewedMethods((prev) => new Set(prev).add(i))
  }

  const allViewed = viewedMethods.size >= connectMethods.length

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
            {viewedMethods.has(i) && (
              <span className="inline-block mt-2 text-xs font-bold" style={{ color: 'var(--teal)' }}>
                ✓ Dilihat
              </span>
            )}
          </button>
        ))}
      </div>

      {activeMethod !== null && (
        <div className="slide-up">
          <div
            className="card-3d p-5"
            style={{ borderColor: 'var(--teal)', background: 'var(--teal-tint)' }}
          >
            <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--teal)' }}>
              Kaedah: {connectMethods[activeMethod].name}
            </h3>
            <div className="space-y-2">
              {(methodDetails[connectMethods[activeMethod].name]?.steps || []).map((step, si) => (
                <div
                  key={si}
                  className="flex items-center gap-3 p-2 rounded-lg"
                  style={{ background: 'var(--card)' }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'var(--teal-tint)', color: 'var(--teal)' }}
                  >
                    {si + 1}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <div
                className="inline-block px-4 py-2 rounded-xl font-bold text-lg"
                style={{ background: 'var(--card)', color: 'var(--coral)', border: '2px solid var(--coral)' }}
              >
                Penyelesaian: {commonSolution}
              </div>
            </div>
          </div>
        </div>
      )}

      {allViewed && (
        <div className="text-center">
          <button
            onClick={onSuccess}
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