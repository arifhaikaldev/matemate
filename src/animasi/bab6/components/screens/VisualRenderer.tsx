import type { VisualConfig } from '../../types'
import { BalanceScale } from '../visuals/BalanceScale'
import { AlgebraTile } from '../visuals/AlgebraTile'
import { EquationBlock } from '../visuals/EquationBlock'
import { NumberLine } from '../visuals/NumberLine'
import { TrialTable } from '../visuals/TrialTable'
import { CoordinateGrid } from '../visuals/CoordinateGrid'
import { Point } from '../visuals/Point'
import { Line } from '../visuals/Line'
import { Intersection } from '../visuals/Intersection'
import { OrderedPair } from '../visuals/OrderedPair'
import { SubstitutionGroup } from '../visuals/SubstitutionGroup'
import { EliminationGroup } from '../visuals/EliminationGroup'
import { TableOfValues } from '../visuals/TableOfValues'
import { ExpressionBlock } from '../visuals/ExpressionBlock'
import { ComparisonBlock } from '../visuals/ComparisonBlock'
import { SemanticBlock } from '../visuals/SemanticBlock'
import { VisualStep } from '../visuals/VisualStep'
import { VerificationBlock } from '../visuals/VerificationBlock'

interface Props {
  visual: VisualConfig
}

export function VisualRenderer({ visual }: Props) {
  switch (visual.kind) {
    case 'balanceScale':
      return <BalanceScale data={visual.data} />
    case 'algebraTile':
      return <AlgebraTile data={visual.data} />
    case 'equationBlock':
      return <EquationBlock data={visual.data} />
    case 'numberLine':
      return <NumberLine data={visual.data} />
    case 'trialTable':
      return <TrialTable data={visual.data} />
    case 'coordinateGrid':
      return <CoordinateGrid data={visual.data} />
    case 'point':
      return <Point data={visual.data} />
    case 'line':
      return <Line data={visual.data} />
    case 'intersection':
      return <Intersection data={visual.data} />
    case 'orderedPair':
      return <OrderedPair data={visual.data} />
    case 'substitutionGroup':
      return <SubstitutionGroup data={visual.data} />
    case 'eliminationGroup':
      return <EliminationGroup data={visual.data} />
    case 'tableOfValues':
      return <TableOfValues data={visual.data} />
    case 'expressionBlock':
      return <ExpressionBlock data={visual.data} />
    case 'comparisonBlock':
      return <ComparisonBlock data={visual.data} />
    case 'semanticBlock':
      return <SemanticBlock data={visual.data} />
    case 'visualStep':
      return <VisualStep data={visual.data} />
    case 'verificationBlock':
      return <VerificationBlock data={visual.data} />
    default:
      return (
        <div className="flex items-center justify-center h-48 text-duo-gray text-sm font-medium">
          Visual: {visual.kind}
        </div>
      )
  }
}