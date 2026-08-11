import { useState } from 'react'

interface Props {
  instruction: string
  quantityLabel1: string
  quantityLabel2: string
  totalLabel?: string
  sliderMin?: number
  sliderMax?: number
  sliderDefault?: number
  relationshipType?: 'sum' | 'difference'
  totalValue?: number
  differenceValue?: number
  onSuccess: () => void
}

export function DualSlider({
  instruction,
  quantityLabel1,
  quantityLabel2,
  totalLabel,
  sliderMin = 0,
  sliderMax = 7,
  sliderDefault = 1,
  relationshipType = 'sum',
  totalValue = 7,
  differenceValue = 18,
  onSuccess,
}: Props) {
  const [val1, setVal1] = useState(sliderDefault)
  const [observed, setObserved] = useState(false)

  const val2 =
    relationshipType === 'sum'
      ? totalValue - val1
      : val1 - differenceValue

  const handleChange = (v: number) => {
    setVal1(v)
    if (!observed) setObserved(true)
  }

  const handleObserve = () => {
    setObserved(true)
    setTimeout(onSuccess, 800)
  }

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      <div className="card-3d p-6 max-w-md mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex-1 text-center">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl mx-auto mb-2"
              style={{ background: 'var(--teal-tint)', border: '2px solid var(--teal)', color: 'var(--teal)' }}
            >
              {val1}
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {quantityLabel1}
            </span>
          </div>

          <span className="text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>
            {relationshipType === 'sum' ? '+' : '−'}
          </span>

          <div className="flex-1 text-center">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl mx-auto mb-2"
              style={{ background: 'var(--coral-tint)', border: '2px solid var(--coral)', color: 'var(--coral)' }}
            >
              {val2}
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {quantityLabel2}
            </span>
          </div>
        </div>

        {totalLabel && (
          <div className="text-center mb-4">
            <span className="text-lg font-bold" style={{ color: 'var(--teal)' }}>
              {totalLabel}: {val1 + val2}
            </span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {quantityLabel1}: {val1}
          </label>
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            value={val1}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: 'var(--teal-tint)',
              accentColor: 'var(--teal)',
            }}
          />
          <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>{sliderMin}</span>
            <span>{sliderMax}</span>
          </div>
        </div>
      </div>

      {observed && (
        <div className="slide-up text-center">
          <div
            className="card-3d inline-block p-4"
            style={{ borderColor: 'var(--teal)' }}
          >
            <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
              ({val1}, {val2})
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Apabila {quantityLabel1.toLowerCase()} berubah, {quantityLabel2.toLowerCase()} juga berubah.
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={handleObserve}
              className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
              style={{ background: 'var(--teal)' }}
            >
              Seterusnya
            </button>
          </div>
        </div>
      )}
    </div>
  )
}