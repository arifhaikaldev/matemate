export type PageType =
  | 'hook-mystery-box'
  | 'hook-number-solve'
  | 'hook-timeline-predict'
  | 'try-number-blocks'
  | 'try-phrase-arrange'
  | 'try-balance-operate'
  | 'try-cost-check'
  | 'prediction-symbol'
  | 'prediction-identify'
  | 'reveal-concept'
  | 'reveal-language-to-algebra'
  | 'reveal-balance'
  | 'reveal-two-equations'
  | 'formalism-sort'
  | 'build-equation-tiles'
  | 'build-guided-solve'
  | 'build-map-to-algebra'
  | 'practice-solve'
  | 'variation-classify'
  | 'variation-build'
  | 'transfer-story-match'
  | 'transfer-model-solve'
  | 'meaning-check'
  | 'solve-context'
  | 'interpret-verify'
  | 'mastery-explain'

export interface EquationPart {
  component: string
  label: string
  meaning: string
}

export interface SortItem {
  id: string
  latex: string
  label: string
}

export interface SortCategory {
  id: string
  label: string
}

export interface PhraseFragment {
  id: string
  text: string
}

export interface Tile {
  id: string
  label: string
  latex?: string
}

export interface Choice {
  id: string
  label: string
  latex?: string
}

export interface BalanceStep {
  equationBefore: string
  operation?: string
  equationAfter: string
  explanation: string
  action?: string
  reason?: string
}

export interface TimelineEvent {
  label: string
  value: string
}

export interface PageConfig {
  id: string
  title?: string
  instruction: string
  feedback?: string
  correctFeedback?: string
  incorrectFeedback?: string
  type: PageType

  // generic shared fields
  question?: string
  choices?: Choice[]
  options?: Choice[]
  correctChoiceId?: string
  correctId?: string

  // hook-mystery-box
  visibleCount?: number
  totalCount?: number

  // hook-number-solve / try-number-blocks
  maxNumber?: number
  correctAnswer?: number | string
  visibleNumber?: number

  // prediction-symbol
  feedbackLabel?: string
  symbols?: Choice[]

  // reveal-concept
  equationParts?: EquationPart[]

  // formalism-sort / variation-classify
  sortItems?: SortItem[]
  sortCategories?: SortCategory[]
  correctMap?: Record<string, string>
  meaningQuestion?: string
  meaningAnswer?: string
  meaningChoices?: Choice[]

  // try-phrase-arrange
  phrases?: PhraseFragment[]
  correctOrder?: string[]

  // reveal-language-to-algebra
  mappingPairs?: { language: string; algebra: string }[]

  // build-equation-tiles
  availableTiles?: Tile[]
  targetEquation?: string | string[]
  sentence?: string

  // build-guided-solve / practice-solve / solve-context
  initialEquation?: string
  steps?: BalanceStep[]
  solveAnswer?: number | string
  intermediateEquations?: string[]
  operationChoices?: string[]
  correctOperations?: string[]

  // build-map-to-algebra
  mappingItems?: { fragment: string; target: string }[]

  // try-balance-operate
  leftExpression?: string
  rightExpression?: string
  operationOptions?: string[]
  correctOperation?: string

  // reveal-balance
  // (reuses leftExpression, rightExpression, operationOptions)

  // hook-timeline-predict
  timelineNow?: string
  timelineFuture?: string
  timelineLabel?: string
  contextQuestion?: string
  contextChoices?: Choice[]

  // prediction-identify
  identifyOptions?: Choice[]
  correctIdentify?: string

  // transfer-story-match
  storyOptions?: { id: string; text: string }[]
  stories?: { id: string; text: string }[]
  correctStoryId?: string
  algebraEquation?: string

  // meaning-check
  questions?: { question: string; choices: Choice[]; correctId: string }[]

  // interpret-verify
  verifyEquation?: string
  verifyResult?: string
  resultLatex?: string

  // mastery-explain
  masteryQuestion?: string
  masteryChoices?: Choice[]
  masteryCorrectId?: string

  // try-cost-check
  costPairs?: { x: number; y: number; cost: number }[]
  totalCost?: number
}

export interface Lesson {
  id: string
  title: string
  pages: PageConfig[]
}

export type LessonStatus = 'not-started' | 'in-progress' | 'completed'