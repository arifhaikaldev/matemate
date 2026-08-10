export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percent}%`, background: 'var(--teal)' }}
      />
    </div>
  )
}