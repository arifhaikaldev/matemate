// Stage 6 — Coverage Validator
// Checks that the lesson's learningGoal is meaningfully addressed by its screens

import type { Issue, StageResult } from './types'
import type { ValidatedLesson } from './stage1-schema'

// Extract all text content from a lesson's screens for keyword matching
function extractScreenText(lesson: ValidatedLesson): string {
  return lesson.screens
    .map((s) => {
      const parts: string[] = [s.type]
      if ('question' in s) parts.push(s.question)
      if ('text' in s && typeof s.text === 'string') parts.push(s.text)
      if ('title' in s && typeof s.title === 'string') parts.push(s.title)
      if ('problem' in s && typeof s.problem === 'string') parts.push(s.problem)
      if ('choices' in s && Array.isArray(s.choices)) parts.push(...(s.choices as string[]))
      if ('steps' in s && Array.isArray(s.steps)) parts.push(...(s.steps as string[]))
      if ('items' in s && Array.isArray(s.items)) parts.push(...(s.items as string[]))
      if ('correctOrder' in s && Array.isArray(s.correctOrder))
        parts.push(...(s.correctOrder as string[]))
      if ('answer' in s && typeof s.answer === 'string') parts.push(s.answer)
      return parts.join(' ')
    })
    .join(' ')
    .toLowerCase()
}

// Extract meaningful keywords from a learning goal string
function extractKeywords(goal: string): string[] {
  const stopwords = new Set([
    'dan',
    'atau',
    'yang',
    'dengan',
    'pada',
    'untuk',
    'dalam',
    'adalah',
    'ialah',
    'kepada',
    'oleh',
    'berdasarkan',
    'menggunakan',
    'membuat',
    'mengenal',
    'menghuraikan',
    'memerihalkan',
    'mewakilkan',
    'membanding',
    'menyusun',
    'menambah',
    'menolak',
    'mendarab',
    'membahagi',
    'menyelesaikan',
    'mengikut',
  ])
  return goal
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopwords.has(w))
}

export function validateCoverage(lesson: ValidatedLesson): StageResult {
  const issues: Issue[] = []
  const { lessonId, learningGoal, topic } = lesson

  const screenText = extractScreenText(lesson)
  const keywords = extractKeywords(learningGoal)
  const topicKeywords = extractKeywords(topic)

  // Check learning goal keywords appear in screens
  const missingGoalKeywords = keywords.filter((kw) => !screenText.includes(kw))
  const missingTopicKeywords = topicKeywords.filter((kw) => !screenText.includes(kw))

  if (missingGoalKeywords.length > keywords.length * 0.5) {
    issues.push({
      stage: 'Coverage',
      severity: 'warning',
      lessonId,
      message: `Learning goal keywords not well covered by screens. Missing: ${missingGoalKeywords.join(', ')}`,
      detail: `learningGoal: "${learningGoal}"`,
    })
  }

  if (missingTopicKeywords.length > 0) {
    issues.push({
      stage: 'Coverage',
      severity: 'info',
      lessonId,
      message: `Topic keywords not found in screens: ${missingTopicKeywords.join(', ')}`,
    })
  }

  // Check that at least one interactive screen relates to the learning goal
  const interactiveScreens = lesson.screens.filter((s) =>
    ['multipleChoice', 'numberInput', 'dragOrder', 'dragNumberLine', 'mastery'].includes(s.type)
  )
  if (interactiveScreens.length === 0) {
    issues.push({
      stage: 'Coverage',
      severity: 'error',
      lessonId,
      message: 'No interactive screens found — learning goal cannot be assessed.',
    })
  }

  const errors = issues.filter((i) => i.severity === 'error').length
  const warnings = issues.filter((i) => i.severity === 'warning').length
  const passed = errors === 0
  const score = Math.max(0, 100 - errors * 30 - warnings * 10)

  return { stage: 'Coverage', passed, issues, score }
}
