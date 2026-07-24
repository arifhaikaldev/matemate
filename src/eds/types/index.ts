// ============================================================
// EDS Types — Lesson, Screen, Visual definitions
// Every lesson JSON must conform to these types
// ============================================================

// ---- Visuals -----------------------------------------------

export type VisualKind = 'direction' | 'elevator' | 'temperature' | 'numberLine' | 'fractionNumberLine'

export interface DirectionVisual {
  kind: 'direction'
  direction: 'left' | 'right'
  distance: number
  label?: string
}

export interface ElevatorVisual {
  kind: 'elevator'
  floors: number          // total floors shown (e.g. 10)
  currentFloor: number    // highlighted floor
  groundFloor?: number    // default 0
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
  min: number   // e.g. -2
  max: number   // e.g. 2
  denominator: number   // e.g. 4 → ticks at 1/4 intervals
  highlights?: number[] // e.g. [0.5, -0.75]
}

export type Visual =
  | DirectionVisual
  | ElevatorVisual
  | TemperatureVisual
  | NumberLineVisual
  | FractionNumberLineVisual

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
  score: number   // 0–100
}
