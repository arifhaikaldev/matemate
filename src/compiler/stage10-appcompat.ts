// Stage 10 — App Compatibility
// Final gate: verifies the lesson is 100% renderable by the current EDS

import type { Issue, StageResult } from './types'
import type { ValidatedLesson } from './stage1-schema'

const RENDERABLE_SCREEN_TYPES = new Set([
  'observation',
  'multipleChoice',
  'numberInput',
  'dragOrder',
  'dragNumberLine',
  'reflection',
  'workedExample',
  'mastery',
])

const RENDERABLE_VISUAL_KINDS = new Set([
  'direction',
  'elevator',
  'temperature',
  'numberLine',
  'fractionNumberLine',
  'squareGrid',
  'factorTree',
  'cubeBlock',
  'numberBracket',
  'squareRootProduct',
  'balanceScale',
  'coordinateGrid',
  'equationBlock',
  'trialTable',
  'tableOfValues',
  'algebraTile',
  'orderedPair',
  'substitutionGroup',
])

export function validateAppCompatibility(lesson: ValidatedLesson): StageResult {
  const issues: Issue[] = []
  const { lessonId, screens } = lesson

  screens.forEach((screen, i) => {
    // Screen type renderable?
    if (!RENDERABLE_SCREEN_TYPES.has(screen.type)) {
      issues.push({
        stage: 'AppCompatibility',
        severity: 'error',
        lessonId,
        message: `Screen ${i + 1}: type "${screen.type}" is not renderable. Only these types are supported: ${[...RENDERABLE_SCREEN_TYPES].join(', ')}.`,
      })
    }

    // Visual kind renderable?
    if ('visual' in screen && screen.visual) {
      const { kind } = screen.visual
      if (!RENDERABLE_VISUAL_KINDS.has(kind)) {
        issues.push({
          stage: 'AppCompatibility',
          severity: 'error',
          lessonId,
          message: `Screen ${i + 1}: visual kind "${kind}" is not renderable. Supported: ${[...RENDERABLE_VISUAL_KINDS].join(', ')}.`,
        })
      }
    }

    // multipleChoice / mastery: choices must be exactly 4 strings
    if (screen.type === 'multipleChoice' || screen.type === 'mastery') {
      if (!Array.isArray(screen.choices) || screen.choices.length !== 4) {
        issues.push({
          stage: 'AppCompatibility',
          severity: 'error',
          lessonId,
          message: `Screen ${i + 1} (${screen.type}): must have exactly 4 choices. Found ${Array.isArray(screen.choices) ? screen.choices.length : 'none'}.`,
        })
      }
      const idx = screen.correctIndex
      if (typeof idx !== 'number' || idx < 0 || idx > 3) {
        issues.push({
          stage: 'AppCompatibility',
          severity: 'error',
          lessonId,
          message: `Screen ${i + 1} (${screen.type}): correctIndex must be 0, 1, 2, or 3.`,
        })
      }
    }

    // numberInput: answer must be string
    if (screen.type === 'numberInput' && typeof screen.answer !== 'string') {
      issues.push({
        stage: 'AppCompatibility',
        severity: 'error',
        lessonId,
        message: `Screen ${i + 1} (numberInput): "answer" must be a string, not a number.`,
      })
    }

    // dragOrder: items and correctOrder same length
    if (screen.type === 'dragOrder') {
      if (screen.items.length !== screen.correctOrder.length) {
        issues.push({
          stage: 'AppCompatibility',
          severity: 'error',
          lessonId,
          message: `Screen ${i + 1} (dragOrder): items.length (${screen.items.length}) ≠ correctOrder.length (${screen.correctOrder.length}).`,
        })
      }
    }
  })

  // Overall: lessonId format check (should be like "1.1.1")
  if (!/^\d+\.\d+\.\d+$/.test(lesson.lessonId)) {
    issues.push({
      stage: 'AppCompatibility',
      severity: 'warning',
      lessonId,
      message: `lessonId "${lesson.lessonId}" does not follow the expected format "X.Y.Z" (e.g. "1.1.1").`,
    })
  }

  const errors = issues.filter((i) => i.severity === 'error').length
  const warnings = issues.filter((i) => i.severity === 'warning').length
  const passed = errors === 0
  const score = Math.max(0, 100 - errors * 25 - warnings * 5)

  return { stage: 'AppCompatibility', passed, issues, score }
}
