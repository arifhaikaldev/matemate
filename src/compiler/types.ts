// compiler/types.ts
// Shared types for the Curriculum Compiler pipeline

export type Severity = 'error' | 'warning' | 'info'

export interface Issue {
  stage: string
  severity: Severity
  lessonId: string
  message: string
  detail?: string
}

export interface StageResult {
  stage: string
  passed: boolean
  issues: Issue[]
  score: number // 0–100 for this stage
}

export interface CompilerReport {
  lessonId: string
  title: string
  stages: StageResult[]
  totalScore: number // 0–100 weighted average
  productionReady: boolean
  issues: Issue[]
}
