// Visual Registry — maps visual kind to React component
// Add new visuals here without touching any renderer

import type { Visual } from '../types'
import { Direction } from '../components/visuals/Direction'
import { Elevator } from '../components/visuals/Elevator'
import { Temperature } from '../components/visuals/Temperature'
import { NumberLine } from '../components/visuals/NumberLine'
import { FractionNumberLine } from '../components/visuals/FractionNumberLine'
import { SquareGrid } from '../components/visuals/SquareGrid'
import { FactorTree } from '../components/visuals/FactorTree'
import { CubeBlock } from '../components/visuals/CubeBlock'
import { NumberBracket } from '../components/visuals/NumberBracket'
import { SquareRootProduct } from '../components/visuals/SquareRootProduct'
import { BalanceScale } from '../components/visuals/BalanceScale'
import { CoordinateGrid } from '../components/visuals/CoordinateGrid'
import { EquationBlock } from '../components/visuals/EquationBlock'
import { TrialTable } from '../components/visuals/TrialTable'
import { TableOfValues } from '../components/visuals/TableOfValues'
import { AlgebraTile } from '../components/visuals/AlgebraTile'
import { OrderedPair } from '../components/visuals/OrderedPair'
import { SubstitutionGroup } from '../components/visuals/SubstitutionGroup'

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
        <Direction direction={visual.direction} distance={visual.distance} label={visual.label} />
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
        <Temperature value={visual.value} min={visual.min} max={visual.max} unit={visual.unit} />
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
    case 'squareGrid':
      return <SquareGrid n={visual.n} highlightBorder={visual.highlightBorder} />
    case 'factorTree':
      return <FactorTree number={visual.number} branches={visual.branches} />
    case 'cubeBlock':
      return <CubeBlock n={visual.n} highlightFace={visual.highlightFace} />
    case 'numberBracket':
      return (
        <NumberBracket
          value={visual.value}
          lowerPerfect={visual.lowerPerfect}
          upperPerfect={visual.upperPerfect}
          lowerRoot={visual.lowerRoot}
          upperRoot={visual.upperRoot}
          operation={visual.operation}
        />
      )
    case 'squareRootProduct':
      return <SquareRootProduct a={visual.a} b={visual.b} showProduct={visual.showProduct} />
    case 'balanceScale':
      return (
        <BalanceScale
          leftLabel={visual.leftLabel}
          rightLabel={visual.rightLabel}
          leftValue={visual.leftValue}
          rightValue={visual.rightValue}
          tilt={visual.tilt}
          showItems={visual.showItems}
        />
      )
    case 'coordinateGrid':
      return (
        <CoordinateGrid
          xMin={visual.xMin}
          xMax={visual.xMax}
          yMin={visual.yMin}
          yMax={visual.yMax}
          points={visual.points}
          lines={visual.lines}
          intersection={visual.intersection}
          showGrid={visual.showGrid}
        />
      )
    case 'equationBlock':
      return (
        <EquationBlock
          equation={visual.equation}
          steps={visual.steps}
          showAnswer={visual.showAnswer}
          answer={visual.answer}
        />
      )
    case 'trialTable':
      return <TrialTable equation={visual.equation} trials={visual.trials} />
    case 'tableOfValues':
      return <TableOfValues equation={visual.equation} rows={visual.rows} />
    case 'algebraTile':
      return (
        <AlgebraTile
          left={visual.left}
          right={visual.right}
          showEquals={visual.showEquals}
        />
      )
    case 'orderedPair':
      return <OrderedPair x={visual.x} y={visual.y} label={visual.label} />
    case 'substitutionGroup':
      return (
        <SubstitutionGroup
          equation={visual.equation}
          substitution={visual.substitution}
          result={visual.result}
        />
      )
  }
}
