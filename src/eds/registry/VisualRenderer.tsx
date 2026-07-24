// Visual Registry — maps visual kind to React component
// Add new visuals here without touching any renderer

import type { Visual } from '../types'
import { Direction } from '../components/visuals/Direction'
import { Elevator } from '../components/visuals/Elevator'
import { Temperature } from '../components/visuals/Temperature'
import { NumberLine } from '../components/visuals/NumberLine'
import { FractionNumberLine } from '../components/visuals/FractionNumberLine'

interface VisualProps {
  visual: Visual
  interactive?: boolean
  dragTarget?: number | null
  onDrag?: (value: number) => void
}

export function VisualRenderer({ visual, interactive, dragTarget, onDrag }: VisualProps) {
  switch (visual.kind) {
    case 'direction':
      return (
        <Direction
          direction={visual.direction}
          distance={visual.distance}
          label={visual.label}
        />
      )
    case 'elevator':
      return (
        <Elevator
          floors={visual.floors}
          currentFloor={visual.currentFloor}
          groundFloor={visual.groundFloor}
        />
      )
    case 'temperature':
      return (
        <Temperature
          value={visual.value}
          min={visual.min}
          max={visual.max}
          unit={visual.unit}
        />
      )
    case 'numberLine':
      return (
        <NumberLine
          min={visual.min}
          max={visual.max}
          highlights={visual.highlights}
          labels={visual.labels}
          showZero={visual.showZero}
          tickInterval={visual.tickInterval}
          interactive={interactive}
          dragTarget={dragTarget}
          onDrag={onDrag}
        />
      )
    case 'fractionNumberLine':
      return (
        <FractionNumberLine
          min={visual.min}
          max={visual.max}
          denominator={visual.denominator}
          highlights={visual.highlights}
        />
      )
  }
}
