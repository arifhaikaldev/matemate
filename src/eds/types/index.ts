// ============================================================
// EDS Types — Lesson, Screen, Visual definitions
// Every lesson JSON must conform to these types
// ============================================================

// ---- Visuals -----------------------------------------------

export type VisualKind =
  'direction' | 'elevator' | 'temperature' | 'numberLine' | 'fractionNumberLine'
  | 'squareGrid' | 'factorTree' | 'cubeBlock' | 'numberBracket' | 'squareRootProduct'
  | 'balanceScale' | 'coordinateGrid' | 'equationBlock' | 'trialTable' | 'tableOfValues'
  | 'algebraTile' | 'orderedPair' | 'substitutionGroup'

export interface DirectionVisual {
  kind: 'direction'
  direction: 'left' | 'right'
  distance: number
  label?: string
}

export interface ElevatorVisual {
  kind: 'elevator'
  floors: number // total floors shown (e.g. 10)
  currentFloor: number // highlighted floor
  groundFloor?: number // default 0
}

export interface TemperatureVisual {
  kind: 'temperature'
  value: number
  min?: number
  max?: number
  unit?: 'C' | 'F'
}

export interface NumberLineVisual {
  kind: 'numberLine'
  min: number
  max: number
  highlights?: number[]
  labels?: Record<number, string>
  showZero?: boolean
  tickInterval?: number
}

export interface FractionNumberLineVisual {
  kind: 'fractionNumberLine'
  min: number // e.g. -2
  max: number // e.g. 2
  denominator: number // e.g. 4 → ticks at 1/4 intervals
  highlights?: number[] // e.g. [0.5, -0.75]
}

export interface SquareGridVisual {
  kind: 'squareGrid'
  n: number
  highlightBorder?: boolean
}

export interface FactorTreeVisual {
  kind: 'factorTree'
  number: number
  branches: [number, number][]
}

export interface CubeBlockVisual {
  kind: 'cubeBlock'
  n: number
  highlightFace?: boolean
}

export interface NumberBracketVisual {
  kind: 'numberBracket'
  value: number
  lowerPerfect: number
  upperPerfect: number
  lowerRoot: number
  upperRoot: number
  operation: 'sqrt' | 'cbrt'
}

export interface SquareRootProductVisual {
  kind: 'squareRootProduct'
  a: number
  b?: number
  showProduct?: boolean
}

export interface BalanceScaleVisual {
  kind: 'balanceScale'
  leftLabel?: string
  rightLabel?: string
  leftValue?: number
  rightValue?: number
  tilt: 'left' | 'right' | 'balanced'
  showItems?: boolean
}

export interface CoordinateGridVisual {
  kind: 'coordinateGrid'
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  points?: { x: number; y: number; label?: string; highlight?: boolean }[]
  lines?: { equation?: string; points: { x: number; y: number }[]; color?: string; dashed?: boolean }[]
  intersection?: { x: number; y: number; label?: string }
  showGrid?: boolean
}

export interface EquationBlockVisual {
  kind: 'equationBlock'
  equation: string
  steps?: { text: string; highlight?: boolean; operation?: string }[]
  showAnswer?: boolean
  answer?: string
}

export interface TrialTableVisual {
  kind: 'trialTable'
  equation: string
  trials: { guess: number; result: string; correct: boolean }[]
}

export interface TableOfValuesVisual {
  kind: 'tableOfValues'
  equation?: string
  rows: { x: number | string; y: number | string; highlight?: boolean }[]
}

export interface AlgebraTileVisual {
  kind: 'algebraTile'
  left: { xCount: number; constant?: number; label?: string }
  right: { xCount: number; constant?: number; label?: string }
  showEquals?: boolean
}

export interface OrderedPairVisual {
  kind: 'orderedPair'
  x: number | string
  y: number | string
  label?: string
}

export interface SubstitutionGroupVisual {
  kind: 'substitutionGroup'
  equation: string
  substitution: string
  result: string
}

export type Visual =
  | DirectionVisual
  | ElevatorVisual
  | TemperatureVisual
  | NumberLineVisual
  | FractionNumberLineVisual
  | SquareGridVisual
  | FactorTreeVisual
  | CubeBlockVisual
  | NumberBracketVisual
  | SquareRootProductVisual
  | BalanceScaleVisual
  | CoordinateGridVisual
  | EquationBlockVisual
  | TrialTableVisual
  | TableOfValuesVisual
  | AlgebraTileVisual
  | OrderedPairVisual
  | SubstitutionGroupVisual

// ---- Screens -----------------------------------------------

export interface ObservationScreen {
  type: 'observation'
  title: string
  text: string
  visual?: Visual
}

export interface MultipleChoiceScreen {
  type: 'multipleChoice'
  question: string
  choices: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
  visual?: Visual
}

export interface NumberInputScreen {
  type: 'numberInput'
  question: string
  answer: string
  hint?: string
  explanation: string
  visual?: Visual
}

export interface DragOrderScreen {
  type: 'dragOrder'
  question: string
  items: string[]
  correctOrder: string[]
  visual?: Visual
}

export interface DragNumberLineScreen {
  type: 'dragNumberLine'
  question: string
  range: { min: number; max: number }
  target: number
  tickInterval?: number
}

export interface ReflectionScreen {
  type: 'reflection'
  text: string
  visual?: Visual
}

export interface WorkedExampleScreen {
  type: 'workedExample'
  problem: string
  steps: string[]
  answer: string
  visual?: Visual
}

export interface MasteryScreen {
  type: 'mastery'
  question: string
  choices: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
  visual?: Visual
}

export type Screen =
  | ObservationScreen
  | MultipleChoiceScreen
  | NumberInputScreen
  | DragOrderScreen
  | DragNumberLineScreen
  | ReflectionScreen
  | WorkedExampleScreen
  | MasteryScreen

export type ScreenType = Screen['type']

// ---- Lesson ------------------------------------------------

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Lesson {
  lessonId: string
  chapter: number
  topic: string
  title: string
  learningGoal: string
  estimatedMinutes: number
  difficulty: Difficulty
  misconceptions: string[]
  screens: Screen[]
}

// ---- Lesson progress (runtime) ----------------------------

export type ScreenStatus = 'pending' | 'correct' | 'incorrect' | 'viewed'

export interface LessonProgress {
  lessonId: string
  currentScreenIndex: number
  screenStatuses: ScreenStatus[]
  completed: boolean
  score: number // 0–100
}
