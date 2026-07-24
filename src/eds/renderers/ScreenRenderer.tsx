// ScreenRenderer — picks the right screen component based on screen.type

import type { Screen } from '../types'
import { ObservationScreen } from '../components/screens/ObservationScreen'
import { MultipleChoiceScreen } from '../components/screens/MultipleChoiceScreen'
import { NumberInputScreen } from '../components/screens/NumberInputScreen'
import { DragOrderScreen } from '../components/screens/DragOrderScreen'
import { DragNumberLineScreen } from '../components/screens/DragNumberLineScreen'
import { ReflectionScreen } from '../components/screens/ReflectionScreen'
import { WorkedExampleScreen } from '../components/screens/WorkedExampleScreen'
import { MasteryScreen } from '../components/screens/MasteryScreen'

interface Props {
  screen: Screen
  onNext: (correct?: boolean) => void
}

export function ScreenRenderer({ screen, onNext }: Props) {
  switch (screen.type) {
    case 'observation':
      return <ObservationScreen screen={screen} onNext={() => onNext()} />

    case 'multipleChoice':
      return <MultipleChoiceScreen screen={screen} onNext={(correct) => onNext(correct)} />

    case 'numberInput':
      return <NumberInputScreen screen={screen} onNext={(correct) => onNext(correct)} />

    case 'dragOrder':
      return <DragOrderScreen screen={screen} onNext={(correct) => onNext(correct)} />

    case 'dragNumberLine':
      return <DragNumberLineScreen screen={screen} onNext={(correct) => onNext(correct)} />

    case 'reflection':
      return <ReflectionScreen screen={screen} onNext={() => onNext()} />

    case 'workedExample':
      return <WorkedExampleScreen screen={screen} onNext={() => onNext()} />

    case 'mastery':
      return <MasteryScreen screen={screen} onNext={(correct) => onNext(correct)} />
  }
}
