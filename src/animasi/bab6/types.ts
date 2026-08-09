export type VisualKind =
  | 'balanceScale'
  | 'algebraTile'
  | 'equationBlock'
  | 'numberLine'
  | 'trialTable'
  | 'coordinateGrid'
  | 'point'
  | 'line'
  | 'intersection'
  | 'orderedPair'
  | 'substitutionGroup'
  | 'eliminationGroup'
  | 'tableOfValues'
  | 'expressionBlock'
  | 'comparisonBlock'
  | 'semanticBlock'
  | 'visualStep'
  | 'verificationBlock'

export type MomentType = 'observation' | 'multipleChoice' | 'numberInput' | 'gate'

export interface VisualConfig {
  kind: VisualKind
  data: Record<string, unknown>
}

export interface ContentBlock {
  instruction: string
  narration?: string
  notation?: string[]
}

export interface Choice {
  label: string
  correct: boolean
}

export interface Moment {
  id: string
  type: MomentType
  title: string
  objective: string
  visual: VisualConfig | null
  content: ContentBlock
  interaction?: {
    question: string
    choices?: Choice[]
    correctAnswer?: number
    hints: string[]
  }
}

export interface Subtopic {
  id: string
  title: string
  moments: Moment[]
  gate?: {
    requiredScore: number
    requiredAnswered: number
  }
}

export interface Bab6Content {
  id: string
  title: string
  subtopics: Subtopic[]
}

export interface MomentResult {
  momentId: string
  subtopic: string
  completed: boolean
  correct: boolean | null
  hintsUsed: number
}

export interface AnimasiProgressRecord {
  momentId: string
  subtopic: string
  completed: boolean
  correct: boolean | null
  hintsUsed: number
  masa_kemaskini: number
}