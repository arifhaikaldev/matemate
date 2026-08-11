export type PageType =
  | 'hook-mystery-box'
  | 'hook-number-solve'
  | 'hook-timeline-predict'
  | 'hook-dual-slider'
  | 'hook-two-equations'
  | 'try-number-blocks'
  | 'try-phrase-arrange'
  | 'try-balance-operate'
  | 'try-cost-check'
  | 'try-yes-no'
  | 'try-pair-input'
  | 'try-pattern-recognize'
  | 'try-substitution-predict'
  | 'prediction-symbol'
  | 'prediction-identify'
  | 'prediction-pair-change'
  | 'reveal-concept'
  | 'reveal-language-to-algebra'
  | 'reveal-balance'
  | 'reveal-two-equations'
  | 'reveal-two-variable'
  | 'reveal-graph-points'
  | 'formalism-sort'
  | 'formalism-ordered-pair'
  | 'build-equation-tiles'
  | 'build-guided-solve'
  | 'build-map-to-algebra'
  | 'build-pair-table'
  | 'build-graph'
  | 'build-substitution'
  | 'practice-solve'
  | 'practice-pairs'
  | 'practice-graph'
  | 'variation-classify'
  | 'variation-build'
  | 'variation-graph-cases'
  | 'transfer-story-match'
  | 'transfer-model-solve'
  | 'transfer-story-build'
  | 'transfer-context-workflow'
  | 'meaning-check'
  | 'solve-context'
  | 'interpret-verify'
  | 'mastery-explain'
  | 'graph-intersection'
  | 'connect-methods'
  | 'verify-check'

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

  // hook-dual-slider
  quantityLabel1?: string
  quantityLabel2?: string
  totalLabel?: string
  sliderMin?: number
  sliderMax?: number
  sliderDefault?: number
  relationshipType?: 'sum' | 'difference'
  totalValue?: number
  differenceValue?: number

  // try-yes-no
  observationPairs?: { x: number; y: number }[]
  yesNoQuestion?: string

  // try-pair-input
  pairTarget?: number
  pairOperation?: string

  // try-pattern-recognize
  patternPoints?: { x: number; y: number }[]
  patternOptions?: Choice[]

  // try-substitution-predict
  substitutionEquation?: string
  substitutionExpression?: string

  // prediction-pair-change
  pairEquation?: string
  initialX?: number
  initialY?: number

  // reveal-two-variable
  variableMeanings?: { symbol: string; meaning: string }[]
  equation?: string

  // reveal-graph-points
  graphEquation?: string
  graphPoints?: { x: number; y: number; label: string }[]

  // formalism-ordered-pair
  orderedPairEquation?: string
  orderedPairOptions?: Choice[]
  orderedPairCorrectId?: string

  // build-pair-table
  tableEquation?: string
  tableXValues?: number[]

  // build-graph / practice-graph
  graphEquationForBuild?: string
  graphRequiredPoints?: { x: number; y: number }[]
  graphAxes?: { xMin: number; xMax: number; yMin: number; yMax: number }

  // build-substitution
  substitutionSystem?: { eq1: string; eq2: string }
  substitutionSteps?: { instruction: string; equation: string }[]

  // practice-pairs
  practicePairEquation?: string
  practicePairQuestions?: { pairs: { x: number; y: number }[]; correct: boolean }[]

  // variation-graph-cases
  graphCases?: {
    id: string
    label: string
    description: string
    equations: string[]
    correctMeaning: string
  }[]

  // transfer-story-build
  storyBuildEquation?: string

  // transfer-context-workflow
  workflowSteps?: { instruction: string; type: string }[]

  // graph-intersection
  graphLines?: { equation: string; color: string }[]
  intersectionPoint?: { x: number; y: number }

  // connect-methods
  connectMethods?: { name: string; description: string }[]
  commonSolution?: string

  // verify-check
  verifyCalculations?: { latex: string; label: string }[]
  verifyQuestion?: string
}

export interface Lesson {
  id: string
  title: string
  pages: PageConfig[]
}

export type LessonStatus = 'not-started' | 'in-progress' | 'completed'