// Stage 5 — Difficulty Curve Validator
// Interactive screens should progress easy → medium → hard, not jump randomly

import type { Issue, StageResult } from './types'
import type { ValidatedLesson } from './stage1-schema'

// Heuristic: score a screen's perceived difficulty from its content
// We use question length + choice similarity + presence of negatives as proxy
function scoreScreenDifficulty(screen: {
  type: string
  question?: string
  choices?: string[]
  items?: string[]
}): number {
  let score = 1 // base = easy

  const q = screen.question ?? ''

  // Longer questions tend to be harder
  if (q.length > 80) score += 1
  if (q.length > 150) score += 1

  // Multiple negatives suggest harder reasoning
  const negativeMatches = (q.match(/tidak|bukan|negatif|tolak|kurang/gi) ?? []).length
  if (negativeMatches >= 2) score += 1

  // dragOrder with many items is harder
  if (screen.type === 'dragOrder' && Array.isArray(screen.items)) {
    if (screen.items.length >= 5) score += 1
  }

  // multipleChoice with all negative choices is harder
  if (screen.type === 'multipleChoice' && Array.isArray(screen.choices)) {
    const allNeg = screen.choices.every((c: string) => c.startsWith('-') || c.includes('−'))
    if (allNeg) score += 1
  }

  return Math.min(score, 3) // cap at 3 (hard)
}

export function validateDifficultyCurve(lesson: ValidatedLesson): StageResult {
  const issues: Issue[] = []
  const { lessonId, screens } = lesson

  const interactiveScreens = screens
    .map((s, i) => ({ screen: s, index: i }))
    .filter(({ screen }) =>
      ['multipleChoice', 'numberInput', 'dragOrder', 'dragNumberLine'].includes(screen.type)
    )

  if (interactiveScreens.length < 2) {
    // Not enough screens to assess curve
    return { stage: 'DifficultyyCurve', passed: true, issues, score: 100 }
  }

  const difficulties = interactiveScreens.map(({ screen, index }) => ({
    index,
    type: screen.type,
    difficulty: scoreScreenDifficulty(
      screen as { type: string; question?: string; choices?: string[]; items?: string[] }
    ),
  }))

  // Detect significant backwards jumps: hard → easy (drop of 2+)
  let badJumps = 0
  for (let i = 1; i < difficulties.length; i++) {
    const prev = difficulties[i - 1]
    const curr = difficulties[i]
    const drop = prev.difficulty - curr.difficulty
    if (drop >= 2) {
      badJumps++
      issues.push({
        stage: 'DifficultyyCurve',
        severity: 'warning',
        lessonId,
        message: `Screen ${curr.index + 1} (${curr.type}) appears significantly easier than screen ${prev.index + 1} (${prev.type}). Difficulty should not drop sharply mid-lesson.`,
      })
    }
  }

  // INFO: good progressive curve
  const isProgressive = difficulties.every(
    (d, i) => i === 0 || d.difficulty >= difficulties[i - 1].difficulty - 1
  )
  if (isProgressive && badJumps === 0) {
    issues.push({
      stage: 'DifficultyyCurve',
      severity: 'info',
      lessonId,
      message: 'Difficulty curve looks progressive.',
    })
  }

  const warnings = issues.filter((i) => i.severity === 'warning').length
  const passed = true // difficulty curve is advisory only (warnings, not errors)
  const score = Math.max(0, 100 - warnings * 10)

  return { stage: 'DifficultyyCurve', passed, issues, score }
}
