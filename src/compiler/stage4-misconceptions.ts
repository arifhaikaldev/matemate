// Stage 4 — Misconception Validator
// Every lesson should explicitly address common misconceptions

import type { Issue, StageResult } from './types'
import type { ValidatedLesson } from './stage1-schema'

export function validateMisconceptions(lesson: ValidatedLesson): StageResult {
  const issues: Issue[] = []
  const { lessonId, misconceptions } = lesson

  // ERROR: no misconceptions at all
  if (!misconceptions || misconceptions.length === 0) {
    issues.push({
      stage: 'Misconceptions',
      severity: 'error',
      lessonId,
      message: 'No misconceptions listed. Every lesson must address student misconceptions.',
    })
  } else if (misconceptions.length < 2) {
    // WARNING: only 1 — lesson is probably too shallow
    issues.push({
      stage: 'Misconceptions',
      severity: 'warning',
      lessonId,
      message: `Only ${misconceptions.length} misconception listed. Aim for at least 2 to ensure depth.`,
    })
  }

  // WARNING: any misconception is very short (likely a placeholder)
  misconceptions.forEach((m, i) => {
    if (m.trim().length < 8) {
      issues.push({
        stage: 'Misconceptions',
        severity: 'warning',
        lessonId,
        message: `Misconception ${i + 1} is too short ("${m}") — likely a placeholder.`,
      })
    }
  })

  // INFO: 3+ misconceptions is excellent
  if (misconceptions.length >= 3) {
    issues.push({
      stage: 'Misconceptions',
      severity: 'info',
      lessonId,
      message: `${misconceptions.length} misconceptions listed — excellent depth.`,
    })
  }

  const errors = issues.filter((i) => i.severity === 'error').length
  const warnings = issues.filter((i) => i.severity === 'warning').length
  const passed = errors === 0
  const score = Math.max(0, 100 - errors * 30 - warnings * 10)

  return { stage: 'Misconceptions', passed, issues, score }
}
