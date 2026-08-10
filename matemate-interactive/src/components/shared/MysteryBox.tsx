import { useState } from 'react'
import { Feedback } from '../ui/Feedback'

interface Props {
  instruction: string
  visibleCount: number
  totalCount: number
  onSuccess: () => void
}

export function MysteryBox({ instruction, visibleCount, totalCount, onSuccess }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const hidden = totalCount - visibleCount

  const handleSelect = (n: number) => {
    if (revealed) return
    setSelected(n)
    setAttempted(true)
    if (n === hidden) {
      setRevealed(true)
      setTimeout(onSuccess, 1500)
    }
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="flex items-center justify-center gap-8 flex-wrap">
        {/* Visible objects outside box */}
        <div className="flex flex-col items-center">
          <div className="flex gap-1 flex-wrap justify-center mb-2">
            {Array.from({ length: visibleCount }).map((_, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-lg bounce-enter"
                style={{ background: 'var(--teal-tint)', border: '2px solid var(--teal)' }}
                title="Objek kelihatan"
              />
            ))}
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {visibleCount} objek (kelihatan)
          </span>
        </div>

        {/* Mystery box */}
        <div
          className={`relative w-36 h-44 rounded-xl flex items-center justify-center transition-all duration-500 bounce-enter ${revealed ? 'border-2' : 'border-2 border-dashed'}`}
          style={{
            background: revealed ? 'var(--teal-tint)' : 'var(--card-secondary)',
            borderColor: revealed ? 'var(--teal)' : 'var(--border)',
          }}
        >
          {revealed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1 flex-wrap justify-center">
                {Array.from({ length: hidden }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded bounce-enter"
                    style={{ background: 'var(--coral-tint)', border: '2px solid var(--coral)' }}
                    title="Objek dalam kotak"
                  />
                ))}
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--coral)' }}>
                {hidden} objek
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">❓</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                ?
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="text-center">
        <span className="text-lg font-bold" style={{ color: 'var(--teal)' }}>
          Jumlah = {totalCount}
        </span>
      </div>

      {!revealed && (
        <div className="space-y-3">
          <p className="font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
            Berapa objek dalam kotak?
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {Array.from({ length: totalCount }).map((_, i) => {
              const n = i + 1
              return (
                <button
                  key={n}
                  onClick={() => handleSelect(n)}
                  className={`w-11 h-11 rounded-lg font-bold text-lg transition-all duration-200 ${
                    selected === n && attempted && n !== hidden ? 'shake' : ''
                  }`}
                  style={{
                    background: selected === n ? 'var(--coral-tint)' : 'var(--card-secondary)',
                    border: `2px solid ${selected === n ? 'var(--coral)' : 'var(--border)'}`,
                    color: 'var(--text-primary)',
                  }}
                >
                  {n}
                </button>
              )
            })}
          </div>
          {attempted && selected !== null && selected !== hidden && (
            <Feedback
              type="incorrect"
              message={`Tidak tepat. Cuba lihat: ${visibleCount} + ? = ${totalCount}`}
            />
          )}
        </div>
      )}

      {revealed && (
        <div className="text-center bounce-enter">
          <div className="card-3d inline-block p-4">
            <p className="text-xl font-bold" style={{ color: 'var(--teal)' }}>
              {visibleCount} + {hidden} = {totalCount}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}