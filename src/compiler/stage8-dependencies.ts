// Stage 8 — Dependency Validator
// Checks that prerequisite lessons exist in the known lesson map

import type { Issue, StageResult } from './types'
import type { ValidatedLesson } from './stage1-schema'

export interface DependencyMap {
  // lessonId → array of prerequisite lessonIds
  [lessonId: string]: string[]
}

// Default dependency rules derived from T1B1 curriculum structure
// Each lesson depends on the previous one in the same subtopic
export const DEFAULT_DEPENDENCY_MAP: DependencyMap = {
  '1.1.2': ['1.1.1'],
  '1.1.3': ['1.1.2'],
  '1.1.4': ['1.1.3'],
  '1.2.1': ['1.1.4'],
  '1.2.2': ['1.2.1'],
  '1.2.3': ['1.2.2'],
  '1.2.4': ['1.2.3'],
  '1.2.5': ['1.2.4'],
  '1.3.1': ['1.1.4'],
  '1.3.2': ['1.3.1'],
  '1.3.3': ['1.3.2'],
  '1.3.4': ['1.3.3'],
  '1.4.1': ['1.1.4'],
  '1.4.2': ['1.4.1'],
  '1.4.3': ['1.4.2'],
  '1.4.4': ['1.4.3'],
  '1.5.1': ['1.3.4', '1.4.4'],
  '1.5.2': ['1.5.1'],
  '1.5.3': ['1.5.2'],

  // Bab 2 — Faktor dan Gandaan
  '2.1.2': ['2.1.1'],
  '2.1.3': ['2.1.2'],
  '2.1.4': ['2.1.3'],
  '2.1.5': ['2.1.4'],
  // first of 2.2 depends on last of 2.1
  '2.2.1': ['2.1.5'],
  '2.2.2': ['2.2.1'],
  '2.2.3': ['2.2.2'],
}

export function validateDependencies(
  lesson: ValidatedLesson,
  knownLessonIds: Set<string>,
  dependencyMap: DependencyMap = DEFAULT_DEPENDENCY_MAP
): StageResult {
  const issues: Issue[] = []
  const { lessonId } = lesson

  const prereqs = dependencyMap[lessonId] ?? []

  for (const prereq of prereqs) {
    if (!knownLessonIds.has(prereq)) {
      issues.push({
        stage: 'Dependencies',
        severity: 'error',
        lessonId,
        message: `Prerequisite lesson "${prereq}" is missing from the curriculum. Students cannot attempt this lesson without it.`,
      })
    }
  }

  if (prereqs.length === 0) {
    issues.push({
      stage: 'Dependencies',
      severity: 'info',
      lessonId,
      message: 'No prerequisites defined for this lesson (entry point or standalone).',
    })
  }

  const errors = issues.filter((i) => i.severity === 'error').length
  const passed = errors === 0
  const score = passed ? 100 : Math.max(0, 100 - errors * 25)

  return { stage: 'Dependencies', passed, issues, score }
}
