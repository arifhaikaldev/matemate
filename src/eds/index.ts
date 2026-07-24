// EDS — Educational Design System
// Public API — import everything from here

// Types
export type {
  Lesson,
  Screen,
  ScreenType,
  Visual,
  VisualKind,
  Difficulty,
  LessonProgress,
  ScreenStatus,
  ObservationScreen as ObservationScreenData,
  MultipleChoiceScreen as MultipleChoiceScreenData,
  NumberInputScreen as NumberInputScreenData,
  DragOrderScreen as DragOrderScreenData,
  DragNumberLineScreen as DragNumberLineScreenData,
  ReflectionScreen as ReflectionScreenData,
  WorkedExampleScreen as WorkedExampleScreenData,
  MasteryScreen as MasteryScreenData,
  DirectionVisual,
  ElevatorVisual,
  TemperatureVisual,
  NumberLineVisual,
  FractionNumberLineVisual,
} from './types'

// Renderers
export { LessonRenderer } from './renderers/LessonRenderer'
export { ScreenRenderer } from './renderers/ScreenRenderer'
export { VisualRenderer } from './registry/VisualRenderer'

// Visual components (for direct use)
export { NumberLine } from './components/visuals/NumberLine'
export { FractionNumberLine } from './components/visuals/FractionNumberLine'
export { Direction } from './components/visuals/Direction'
export { Elevator } from './components/visuals/Elevator'
export { Temperature } from './components/visuals/Temperature'

// Screen components (for direct use)
export { ObservationScreen } from './components/screens/ObservationScreen'
export { MultipleChoiceScreen } from './components/screens/MultipleChoiceScreen'
export { NumberInputScreen } from './components/screens/NumberInputScreen'
export { DragOrderScreen } from './components/screens/DragOrderScreen'
export { DragNumberLineScreen } from './components/screens/DragNumberLineScreen'
export { ReflectionScreen } from './components/screens/ReflectionScreen'
export { WorkedExampleScreen } from './components/screens/WorkedExampleScreen'
export { MasteryScreen } from './components/screens/MasteryScreen'
