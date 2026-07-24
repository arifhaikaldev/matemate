// Stage 7 — Asset Validator
// Checks that all visual kinds referenced in screens are supported by the EDS

import type { Issue, StageResult } from './types'
import type { ValidatedLesson } from './stage1-schema'

const SUPPORTED_VISUAL_KINDS = new Set([
  'direction',
  'elevator',
  'temperature',
  'numberLine',
  'fractionNumberLine',
])

const SUPPORTED_SCREEN_TYPES = new Set([
  'observation',
  'multipleChoice',
  'numberInput',
  'dragOrder',
  'dragNumberLine',
  'reflection',
  'workedExample',
  'mastery',
])

export function validateAssets(lesson: ValidatedLesson): StageResult {
  const issues: Issue[] = []
  const { lessonId, screens } = lesson

  screens.forEach((screen, i) => {
    // Screen type check
    if (!SUPPORTED_SCREEN_TYPES.has(screen.type)) {
      issues.push({
        stage: 'Assets',
        severity: 'error',
        lessonId,
        message: `Screen ${i + 1}: unsupported screen type "${screen.type}". Renderer cannot handle this.`,
      })
    }

    // Visual kind check
    if ('visual' in screen && screen.visual) {
      const { kind } = screen.visual
      if (!SUPPORTED_VISUAL_KINDS.has(kind)) {
        issues.push({
          stage: 'Assets',
          severity: 'error',
          lessonId,
          message: `Screen ${i + 1}: unsupported visual kind "${kind}". EDS has no component for this.`,
        })
      }
    }

    // numberLine range sanity
    if ('visual' in screen && screen.visual?.kind === 'numberLine') {
      const v = screen.visual
      if (v.min >= v.max) {
        issues.push({
          stage: 'Assets',
          severity: 'error',
          lessonId,
          message: `Screen ${i + 1}: numberLine visual has min (${v.min}) >= max (${v.max}).`,
        })
      }
      if (v.tickInterval !== undefined && v.tickInterval <= 0) {
        issues.push({
          stage: 'Assets',
          severity: 'error',
          lessonId,
          message: `Screen ${i + 1}: numberLine tickInterval must be positive.`,
        })
      }
    }

    // fractionNumberLine denominator sanity
    if ('visual' in screen && screen.visual?.kind === 'fractionNumberLine') {
      const v = screen.visual
      if (v.denominator < 2) {
        issues.push({
          stage: 'Assets',
          severity: 'warning',
          lessonId,
          message: `Screen ${i + 1}: fractionNumberLine denominator ${v.denominator} is < 2 — consider using a regular numberLine instead.`,
        })
      }
    }
  })

  const errors = issues.filter((i) => i.severity === 'error').length
  const warnings = issues.filter((i) => i.severity === 'warning').length
  const passed = errors === 0
  const score = Math.max(0, 100 - errors * 25 - warnings * 5)

  return { stage: 'Assets', passed, issues, score }
}
