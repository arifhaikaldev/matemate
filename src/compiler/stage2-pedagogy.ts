// Stage 2 — Pedagogy Validator
// Every lesson must follow the Hook→Discovery→Practice→Reflection→Mastery flow

import type { Issue, StageResult } from './types'
import type { ValidatedLesson } from './stage1-schema'

const INTERACTIVE_TYPES = new Set([
  'multipleChoice',
  'numberInput',
  'dragOrder',
  'dragNumberLine',
])

export function validatePedagogy(lesson: ValidatedLesson): StageResult {
  const issues: Issue[] = []
  const { lessonId, screens } = lesson

  const types = screens.map((s) => s.type)

  // ERROR: must start with observation
  if (types[0] !== 'observation') {
    issues.push({
      stage: 'Pedagogy',
      severity: 'error',
      lessonId,
      message: 'First screen must be "observation" (lesson hook). Found: ' + types[0],
    })
  }

  // ERROR: must end with mastery
  if (types[types.length - 1] !== 'mastery') {
    issues.push({
      stage: 'Pedagogy',
      severity: 'error',
      lessonId,
      message:
        'Last screen must be "mastery". Found: ' + types[types.length - 1],
    })
  }

  // WARNING: must contain at least one reflection
  if (!types.includes('reflection')) {
    issues.push({
      stage: 'Pedagogy',
      severity: 'warning',
      lessonId,
      message: 'No "reflection" screen found — student never summarises the concept.',
    })
  }

  // ERROR: must have at least 2 interactive screens (guided practice)
  const interactiveCount = types.filter((t) => INTERACTIVE_TYPES.has(t)).length
  if (interactiveCount < 2) {
    issues.push({
      stage: 'Pedagogy',
      severity: 'error',
      lessonId,
      message: `Only ${interactiveCount} interactive screen(s) found — minimum is 2 for guided practice.`,
    })
  }

  // WARNING: mastery appears more than once
  const masteryCount = types.filter((t) => t === 'mastery').length
  if (masteryCount > 1) {
    issues.push({
      stage: 'Pedagogy',
      severity: 'warning',
      lessonId,
      message: `${masteryCount} mastery screens found — only one is expected (at the end).`,
    })
  }

  // WARNING: observation appears more than once
  const observationCount = types.filter((t) => t === 'observation').length
  if (observationCount > 1) {
    issues.push({
      stage: 'Pedagogy',
      severity: 'warning',
      lessonId,
      message: `${observationCount} observation screens found — usually only one hook is needed.`,
    })
  }

  // INFO: no workedExample — acceptable but noted
  if (!types.includes('workedExample')) {
    issues.push({
      stage: 'Pedagogy',
      severity: 'info',
      lessonId,
      message: 'No "workedExample" screen. Consider adding one for application phase.',
    })
  }

  const errors = issues.filter((i) => i.severity === 'error').length
  const warnings = issues.filter((i) => i.severity === 'warning').length
  const passed = errors === 0
  const score = Math.max(0, 100 - errors * 25 - warnings * 5)

  return { stage: 'Pedagogy', passed, issues, score }
}
