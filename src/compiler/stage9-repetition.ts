// Stage 9 — Repetition Detector
// Detects screens with suspiciously similar content (LLM tends to repeat itself)

import type { Issue, StageResult } from './types'
import type { ValidatedLesson } from './stage1-schema'

// Simple token-based Jaccard similarity
function tokenise(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2)
  )
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const intersection = [...a].filter((x) => b.has(x)).length
  const union = new Set([...a, ...b]).size
  return union === 0 ? 0 : intersection / union
}

function getScreenText(screen: Record<string, unknown>): string {
  const parts: string[] = []
  for (const key of ['question', 'text', 'title', 'problem']) {
    if (typeof screen[key] === 'string') parts.push(screen[key] as string)
  }
  if (Array.isArray(screen['choices'])) parts.push(...(screen['choices'] as string[]))
  if (Array.isArray(screen['steps'])) parts.push(...(screen['steps'] as string[]))
  return parts.join(' ')
}

const SIMILARITY_WARNING_THRESHOLD = 0.75
const SIMILARITY_ERROR_THRESHOLD = 0.92

export function validateRepetition(lesson: ValidatedLesson): StageResult {
  const issues: Issue[] = []
  const { lessonId, screens } = lesson

  const tokens = screens.map((s) => tokenise(getScreenText(s as Record<string, unknown>)))
  let maxSimilarity = 0

  for (let i = 0; i < screens.length; i++) {
    for (let j = i + 1; j < screens.length; j++) {
      // Only compare same-type screens (observation vs mastery are naturally different)
      if (screens[i].type !== screens[j].type) continue

      const sim = jaccard(tokens[i], tokens[j])
      if (sim > maxSimilarity) maxSimilarity = sim

      if (sim >= SIMILARITY_ERROR_THRESHOLD) {
        issues.push({
          stage: 'Repetition',
          severity: 'error',
          lessonId,
          message: `Screen ${i + 1} and screen ${j + 1} (both "${screens[i].type}") are ${Math.round(sim * 100)}% similar — likely duplicated. Rewrite recommended.`,
        })
      } else if (sim >= SIMILARITY_WARNING_THRESHOLD) {
        issues.push({
          stage: 'Repetition',
          severity: 'warning',
          lessonId,
          message: `Screen ${i + 1} and screen ${j + 1} (both "${screens[i].type}") are ${Math.round(sim * 100)}% similar — consider varying the wording or context.`,
        })
      }
    }
  }

  // INFO: similarity score summary
  issues.push({
    stage: 'Repetition',
    severity: 'info',
    lessonId,
    message: `Max same-type screen similarity: ${Math.round(maxSimilarity * 100)}%`,
  })

  const errors = issues.filter((i) => i.severity === 'error').length
  const warnings = issues.filter((i) => i.severity === 'warning').length
  const passed = errors === 0
  const score = Math.max(0, 100 - errors * 20 - warnings * 5)

  return { stage: 'Repetition', passed, issues, score }
}
