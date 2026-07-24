// compiler/index.ts
// Main pipeline: runs all 10 stages on a lesson, returns CompilerReport

import type { CompilerReport, StageResult } from './types'
import { validateSchema, LessonSchema } from './stage1-schema'
import { validatePedagogy } from './stage2-pedagogy'
import { validateFlow } from './stage3-flow'
import { validateMisconceptions } from './stage4-misconceptions'
import { validateDifficultyCurve } from './stage5-difficulty'
import { validateCoverage } from './stage6-coverage'
import { validateAssets } from './stage7-assets'
import { validateDependencies, DEFAULT_DEPENDENCY_MAP } from './stage8-dependencies'
import type { DependencyMap } from './stage8-dependencies'
import { validateRepetition } from './stage9-repetition'
import { validateAppCompatibility } from './stage10-appcompat'

export interface CompilerOptions {
  knownLessonIds?: Set<string>
  dependencyMap?: DependencyMap
}

// Stage weights for overall score (must sum to 100)
const STAGE_WEIGHTS: Record<string, number> = {
  Schema: 25,
  Pedagogy: 20,
  Flow: 15,
  Misconceptions: 5,
  DifficultyyCurve: 5,
  Coverage: 10,
  Assets: 10,
  Dependencies: 5,
  Repetition: 3,
  AppCompatibility: 2,
}

function weightedScore(stages: StageResult[]): number {
  let total = 0
  let weightSum = 0
  for (const stage of stages) {
    const w = STAGE_WEIGHTS[stage.stage] ?? 5
    total += stage.score * w
    weightSum += w
  }
  return weightSum === 0 ? 0 : Math.round(total / weightSum)
}

export function compileLesson(raw: unknown, options: CompilerOptions = {}): CompilerReport {
  const lessonId =
    typeof raw === 'object' && raw !== null && 'lessonId' in raw
      ? String((raw as { lessonId: unknown }).lessonId)
      : 'unknown'

  const title =
    typeof raw === 'object' && raw !== null && 'title' in raw
      ? String((raw as { title: unknown }).title)
      : 'Untitled'

  // Stage 1: Schema (always runs first — others need a valid lesson)
  const schemaResult = validateSchema(raw, lessonId)

  if (!schemaResult.passed) {
    // If schema fails, skip remaining stages
    const totalScore = schemaResult.score
    const allIssues = schemaResult.issues
    return {
      lessonId,
      title,
      stages: [schemaResult],
      totalScore,
      productionReady: false,
      issues: allIssues,
    }
  }

  // Schema passed — we have a valid lesson
  // Re-parse to get typed data (schema validator already confirmed it's valid)
  const lesson = LessonSchema.parse(raw)

  const knownLessonIds =
    options.knownLessonIds ?? new Set<string>([lessonId]) // at minimum, know itself
  const dependencyMap = options.dependencyMap ?? DEFAULT_DEPENDENCY_MAP

  // Stages 2–10
  const stages: StageResult[] = [
    schemaResult,
    validatePedagogy(lesson),
    validateFlow(lesson),
    validateMisconceptions(lesson),
    validateDifficultyCurve(lesson),
    validateCoverage(lesson),
    validateAssets(lesson),
    validateDependencies(lesson, knownLessonIds, dependencyMap),
    validateRepetition(lesson),
    validateAppCompatibility(lesson),
  ]

  const allIssues = stages.flatMap((s) => s.issues)
  const totalScore = weightedScore(stages)
  const hasErrors = allIssues.some((i) => i.severity === 'error')
  const productionReady = !hasErrors && totalScore >= 70

  return {
    lessonId,
    title,
    stages,
    totalScore,
    productionReady,
    issues: allIssues,
  }
}

// Compile a full curriculum (array of raw lesson JSONs)
export function compileCurriculum(
  rawLessons: unknown[],
  options: CompilerOptions = {}
): CompilerReport[] {
  // Build the full set of known IDs first (for dependency checking)
  const knownLessonIds = new Set<string>(
    rawLessons
      .filter((r) => typeof r === 'object' && r !== null && 'lessonId' in r)
      .map((r) => String((r as { lessonId: unknown }).lessonId))
  )

  return rawLessons.map((raw) =>
    compileLesson(raw, {
      knownLessonIds,
      dependencyMap: options.dependencyMap ?? DEFAULT_DEPENDENCY_MAP,
    })
  )
}

export { formatReport, formatBatchReport } from './report'
export type { CompilerReport, StageResult } from './types'
