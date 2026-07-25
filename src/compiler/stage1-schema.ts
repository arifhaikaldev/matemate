// Stage 1 — Schema Validator
// Checks structural correctness of a lesson JSON using Zod

import { z } from 'zod'
import type { Issue, StageResult } from './types'

// ── Visual schemas ──────────────────────────────────────────────────────────

const DirectionVisualSchema = z.object({
  kind: z.literal('direction'),
  direction: z.enum(['left', 'right']),
  distance: z.number(),
  label: z.string().optional(),
})

const ElevatorVisualSchema = z.object({
  kind: z.literal('elevator'),
  floors: z.number().int().positive(),
  currentFloor: z.number().int(),
  groundFloor: z.number().int().optional(),
})

const TemperatureVisualSchema = z.object({
  kind: z.literal('temperature'),
  value: z.number(),
  min: z.number().optional(),
  max: z.number().optional(),
  unit: z.enum(['C', 'F']).optional(),
})

const NumberLineVisualSchema = z.object({
  kind: z.literal('numberLine'),
  min: z.number(),
  max: z.number(),
  highlights: z.array(z.number()).optional(),
  labels: z.record(z.string(), z.string()).optional(),
  showZero: z.boolean().optional(),
  tickInterval: z.number().positive().optional(),
})

const FractionNumberLineVisualSchema = z.object({
  kind: z.literal('fractionNumberLine'),
  min: z.number(),
  max: z.number(),
  denominator: z.number().int().positive(),
  highlights: z.array(z.number()).optional(),
})

const SquareGridVisualSchema = z.object({
  kind: z.literal('squareGrid'),
  n: z.number().int().positive(),
  highlightBorder: z.boolean().optional(),
})

const FactorTreeVisualSchema = z.object({
  kind: z.literal('factorTree'),
  number: z.number().int().positive(),
  branches: z.array(z.tuple([z.number(), z.number()])),
})

const CubeBlockVisualSchema = z.object({
  kind: z.literal('cubeBlock'),
  n: z.number().int().positive(),
  highlightFace: z.boolean().optional(),
})

const NumberBracketVisualSchema = z.object({
  kind: z.literal('numberBracket'),
  value: z.number(),
  lowerPerfect: z.number(),
  upperPerfect: z.number(),
  lowerRoot: z.number(),
  upperRoot: z.number(),
  operation: z.enum(['sqrt', 'cbrt']),
})

const SquareRootProductVisualSchema = z.object({
  kind: z.literal('squareRootProduct'),
  a: z.number().int().positive(),
  b: z.number().int().positive().optional(),
  showProduct: z.boolean().optional(),
})

const VisualSchema = z.discriminatedUnion('kind', [
  DirectionVisualSchema,
  ElevatorVisualSchema,
  TemperatureVisualSchema,
  NumberLineVisualSchema,
  FractionNumberLineVisualSchema,
  SquareGridVisualSchema,
  FactorTreeVisualSchema,
  CubeBlockVisualSchema,
  NumberBracketVisualSchema,
  SquareRootProductVisualSchema,
])

// ── Screen schemas ───────────────────────────────────────────────────────────

const ObservationScreenSchema = z.object({
  type: z.literal('observation'),
  title: z.string().min(1),
  text: z.string().min(1),
  visual: VisualSchema.optional(),
})

const FourChoicesSchema = z.tuple([
  z.string().min(1),
  z.string().min(1),
  z.string().min(1),
  z.string().min(1),
])

const CorrectIndexSchema = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])

const MultipleChoiceScreenSchema = z.object({
  type: z.literal('multipleChoice'),
  question: z.string().min(1),
  choices: FourChoicesSchema,
  correctIndex: CorrectIndexSchema,
  explanation: z.string().min(1),
  visual: VisualSchema.optional(),
})

const NumberInputScreenSchema = z.object({
  type: z.literal('numberInput'),
  question: z.string().min(1),
  answer: z.string().min(1),
  hint: z.string().optional(),
  explanation: z.string().min(1),
  visual: VisualSchema.optional(),
})

const DragOrderScreenSchema = z.object({
  type: z.literal('dragOrder'),
  question: z.string().min(1),
  items: z.array(z.string().min(1)).min(2),
  correctOrder: z.array(z.string().min(1)).min(2),
  visual: VisualSchema.optional(),
})

const DragNumberLineScreenSchema = z.object({
  type: z.literal('dragNumberLine'),
  question: z.string().min(1),
  range: z.object({ min: z.number(), max: z.number() }),
  target: z.number(),
  tickInterval: z.number().positive().optional(),
})

const ReflectionScreenSchema = z.object({
  type: z.literal('reflection'),
  text: z.string().min(1),
  visual: VisualSchema.optional(),
})

const WorkedExampleScreenSchema = z.object({
  type: z.literal('workedExample'),
  problem: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
  answer: z.string().min(1),
  visual: VisualSchema.optional(),
})

const MasteryScreenSchema = z.object({
  type: z.literal('mastery'),
  question: z.string().min(1),
  choices: FourChoicesSchema,
  correctIndex: CorrectIndexSchema,
  explanation: z.string().min(1),
  visual: VisualSchema.optional(),
})

const ScreenSchema = z.discriminatedUnion('type', [
  ObservationScreenSchema,
  MultipleChoiceScreenSchema,
  NumberInputScreenSchema,
  DragOrderScreenSchema,
  DragNumberLineScreenSchema,
  ReflectionScreenSchema,
  WorkedExampleScreenSchema,
  MasteryScreenSchema,
])

// ── Lesson schema ────────────────────────────────────────────────────────────

export const LessonSchema = z.object({
  lessonId: z.string().min(1),
  chapter: z.number().int().positive(),
  topic: z.string().min(1),
  title: z.string().min(1),
  learningGoal: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  misconceptions: z.array(z.string().min(1)),
  screens: z.array(ScreenSchema).min(6).max(10),
})

export type ValidatedLesson = z.infer<typeof LessonSchema>

// ── Stage runner ─────────────────────────────────────────────────────────────

export function validateSchema(raw: unknown, lessonId = 'unknown'): StageResult {
  const issues: Issue[] = []
  const result = LessonSchema.safeParse(raw)

  if (!result.success) {
    const flat = result.error.flatten()

    // Root-level field errors
    for (const [field, msgs] of Object.entries(flat.fieldErrors)) {
      for (const msg of msgs ?? []) {
        issues.push({
          stage: 'Schema',
          severity: 'error',
          lessonId,
          message: `Field "${field}": ${msg}`,
        })
      }
    }

    // Nested errors
    for (const issue of result.error.issues) {
      const path = issue.path.join('.')
      const fieldErrors = flat.fieldErrors as Record<string, string[] | undefined>
      if (path && !fieldErrors[path]) {
        issues.push({
          stage: 'Schema',
          severity: 'error',
          lessonId,
          message: `${path}: ${issue.message}`,
        })
      }
    }

    // Extra: screen count check (belt-and-suspenders)
    if (
      typeof raw === 'object' &&
      raw !== null &&
      'screens' in raw &&
      Array.isArray((raw as { screens: unknown[] }).screens)
    ) {
      const count = (raw as { screens: unknown[] }).screens.length
      if (count < 6) {
        issues.push({
          stage: 'Schema',
          severity: 'error',
          lessonId,
          message: `screens.length is ${count} — minimum is 6`,
        })
      }
      if (count > 10) {
        issues.push({
          stage: 'Schema',
          severity: 'error',
          lessonId,
          message: `screens.length is ${count} — maximum is 10`,
        })
      }
    }
  }

  // Duplicate screen index check (if schema passed basic parse)
  // dragNumberLine range check
  if (result.success) {
    result.data.screens.forEach((screen, i) => {
      if (screen.type === 'dragNumberLine') {
        if (screen.target < screen.range.min || screen.target > screen.range.max) {
          issues.push({
            stage: 'Schema',
            severity: 'error',
            lessonId,
            message: `Screen ${i + 1} (dragNumberLine): target ${screen.target} is outside range [${screen.range.min}, ${screen.range.max}]`,
          })
        }
      }
      if (screen.type === 'dragOrder') {
        const itemSet = new Set(screen.items)
        const orderSet = new Set(screen.correctOrder)
        const sameItems =
          screen.items.length === screen.correctOrder.length &&
          [...itemSet].every((v) => orderSet.has(v))
        if (!sameItems) {
          issues.push({
            stage: 'Schema',
            severity: 'error',
            lessonId,
            message: `Screen ${i + 1} (dragOrder): items and correctOrder must contain the same elements`,
          })
        }
      }
    })
  }

  const errors = issues.filter((i) => i.severity === 'error')
  const passed = errors.length === 0
  const score = passed ? 100 : Math.max(0, 100 - errors.length * 20)

  return { stage: 'Schema', passed, issues, score }
}
