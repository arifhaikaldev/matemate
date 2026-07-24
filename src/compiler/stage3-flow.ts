// Stage 3 — Screen Flow Validator
// Checks linear navigation: no dead screens, no loops, no duplicates

import type { Issue, StageResult } from './types'
import type { ValidatedLesson } from './stage1-schema'

export function validateFlow(lesson: ValidatedLesson): StageResult {
  const issues: Issue[] = []
  const { lessonId, screens } = lesson

  // ERROR: empty screen list (belt-and-suspenders, schema should catch this)
  if (screens.length === 0) {
    issues.push({
      stage: 'Flow',
      severity: 'error',
      lessonId,
      message: 'No screens found.',
    })
    return { stage: 'Flow', passed: false, issues, score: 0 }
  }

  // Check for duplicate screen content (same type + same question/text)
  const fingerprints = new Set<string>()
  screens.forEach((screen, i) => {
    let fp = screen.type + '|'
    if ('question' in screen) fp += screen.question
    else if ('text' in screen) fp += screen.text
    else if ('title' in screen) fp += screen.title
    else if ('problem' in screen) fp += screen.problem

    if (fingerprints.has(fp)) {
      issues.push({
        stage: 'Flow',
        severity: 'error',
        lessonId,
        message: `Screen ${i + 1} appears to be a duplicate of a previous screen (type: ${screen.type}).`,
      })
    }
    fingerprints.add(fp)
  })

  // WARNING: reflection placed before any interactive screen
  const firstInteractive = screens.findIndex((s) =>
    ['multipleChoice', 'numberInput', 'dragOrder', 'dragNumberLine'].includes(s.type)
  )
  const firstReflection = screens.findIndex((s) => s.type === 'reflection')
  if (firstReflection !== -1 && firstInteractive !== -1 && firstReflection < firstInteractive) {
    issues.push({
      stage: 'Flow',
      severity: 'warning',
      lessonId,
      message: `Reflection screen appears before any interactive screen (screen ${firstReflection + 1}). Students should interact before reflecting.`,
    })
  }

  // WARNING: workedExample placed before any interactive screen
  const firstWorked = screens.findIndex((s) => s.type === 'workedExample')
  if (firstWorked !== -1 && firstInteractive !== -1 && firstWorked < firstInteractive) {
    issues.push({
      stage: 'Flow',
      severity: 'warning',
      lessonId,
      message: `WorkedExample screen (${firstWorked + 1}) appears before guided practice. Students should discover first, then see examples.`,
    })
  }

  // ERROR: mastery not last
  const lastMastery = screens.map((s) => s.type).lastIndexOf('mastery')
  if (lastMastery !== screens.length - 1) {
    issues.push({
      stage: 'Flow',
      severity: 'error',
      lessonId,
      message: `Mastery screen found at position ${lastMastery + 1} but must be the very last screen (position ${screens.length}).`,
    })
  }

  const errors = issues.filter((i) => i.severity === 'error').length
  const warnings = issues.filter((i) => i.severity === 'warning').length
  const passed = errors === 0
  const score = Math.max(0, 100 - errors * 20 - warnings * 5)

  return { stage: 'Flow', passed, issues, score }
}
