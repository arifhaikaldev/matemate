import { useState, useCallback } from 'react'
import { MathInline } from '../ui/MathDisplay'
import { Feedback } from '../ui/Feedback'
import type { Tile } from '../../types'

interface Props {
  instruction: string
  tiles: Tile[]
  targetEquation: string
  onSuccess: () => void
  sentence?: string
}

export function EquationBuilder({
  instruction,
  tiles,
  targetEquation,
  onSuccess,
  sentence,
}: Props) {
  const [workspace, setWorkspace] = useState<Tile[]>([])
  const [attempted, setAttempted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [wrongTiles, setWrongTiles] = useState<Set<string>>(new Set())

  const addTile = useCallback(
    (tile: Tile) => {
      if (correct) return
      setWorkspace((prev) => [...prev, tile])
    },
    [correct],
  )

  const removeTile = useCallback(
    (index: number) => {
      if (correct) return
      setWorkspace((prev) => prev.filter((_, i) => i !== index))
    },
    [correct],
  )

  const clearWorkspace = () => {
    if (correct) return
    setWorkspace([])
    setAttempted(false)
    setWrongTiles(new Set())
  }

  const workspaceLatex = workspace.map((t) => t.latex || t.label).join(' ')

  const checkAnswer = () => {
    setAttempted(true)
    const normalizedWorkspace = workspaceLatex.replace(/\s+/g, '')
    const normalizedTarget = targetEquation.replace(/\s+/g, '')

    if (normalizedWorkspace === normalizedTarget) {
      setCorrect(true)
      setTimeout(onSuccess, 1200)
    } else {
      // Highlight tiles that don't match target
      const wrong = new Set<string>()
      for (const t of workspace) {
        if (!targetEquation.includes(t.latex || t.label)) {
          wrong.add(t.id)
        }
      }
      setWrongTiles(wrong)
    }
  }

  const availableTiles = tiles.filter(
    (t) => !workspace.some((w) => w.id === t.id),
  )

  return (
    <div className="fade-in space-y-6">
      <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {instruction}
      </p>

      {sentence && (
        <div
          className="card-3d p-4 text-center font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          {sentence}
        </div>
      )}

      {/* Workspace */}
      <div
        className="card-3d min-h-[80px] flex items-center justify-center gap-1 flex-wrap p-4 transition-all duration-200"
        style={{
          borderColor: correct
            ? 'var(--teal)'
            : attempted && !correct
              ? 'var(--coral)'
              : 'var(--border)',
          background: correct ? 'var(--teal-tint)' : 'var(--card)',
        }}
      >
        {workspace.length === 0 && (
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Klik tile di bawah untuk membina persamaan
          </span>
        )}
        {workspace.map((tile, i) => (
          <button
            key={`${tile.id}-${i}`}
            onClick={() => removeTile(i)}
            className={`px-3 py-2 rounded-lg font-bold text-lg transition-all duration-200 ${
              wrongTiles.has(tile.id) ? 'shake' : ''
            }`}
            style={{
              background: wrongTiles.has(tile.id)
                ? 'var(--coral-tint)'
                : 'var(--teal-tint)',
              border: `2px solid ${
                wrongTiles.has(tile.id) ? 'var(--coral)' : 'var(--teal)'
              }`,
              color: 'var(--teal)',
              cursor: correct ? 'default' : 'pointer',
            }}
          >
            {tile.latex ? <MathInline>{tile.latex}</MathInline> : tile.label}
          </button>
        ))}
      </div>

      {/* Available tiles */}
      <div className="flex gap-2 justify-center flex-wrap">
        {availableTiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => addTile(tile)}
            className="px-4 py-3 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105"
            style={{
              background: 'var(--card-secondary)',
              border: '2px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            {tile.latex ? <MathInline>{tile.latex}</MathInline> : tile.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      {workspace.length > 0 && !correct && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={checkAnswer}
            className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'var(--teal)' }}
          >
            Semak
          </button>
          <button
            onClick={clearWorkspace}
            className="px-6 py-3 rounded-xl font-bold transition-all duration-200"
            style={{
              background: 'var(--card-secondary)',
              border: '2px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            Padam
          </button>
        </div>
      )}

      {attempted && !correct && (
        <Feedback
          type="incorrect"
          message="Tidak tepat. Cuba semak semula susunan tile dan operasi."
        />
      )}
    </div>
  )
}