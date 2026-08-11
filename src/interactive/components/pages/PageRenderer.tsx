import { useState, useEffect, type FormEvent } from 'react'
import { useLesson } from '../../context/LessonContext'
import type { PageConfig } from '../../types'
import { MysteryBox } from '../shared/MysteryBox'
import { NumberBlocks } from '../shared/NumberBlocks'
import { SymbolChoice } from '../shared/SymbolChoice'
import { ConceptReveal } from '../shared/ConceptReveal'
import { SortCards } from '../shared/SortCards'
import { BalanceScale } from '../shared/BalanceScale'
import { GuidedSolve, PracticeSolve, ContextSolve } from '../shared/GuidedSolve'
import { EquationBuilder } from '../shared/EquationBuilder'
import { PhraseArrange } from '../shared/PhraseArrange'
import { MapToAlgebra } from '../shared/MapToAlgebra'
import { MeaningCheck } from '../shared/MeaningCheck'
import { Timeline, IdentifyUnknown, AgeVerify } from '../shared/Timeline'
import { StoryMatch } from '../shared/StoryMatch'
import { Feedback } from '../ui/Feedback'
import { DualSlider } from '../shared/DualSlider'
import { PairInput } from '../shared/PairInput'
import { PairTable } from '../shared/PairTable'
import { OrderedPairQuiz } from '../shared/OrderedPairQuiz'
import { GraphPlot } from '../shared/GraphPlot'
import { CostCheck } from '../shared/CostCheck'
import { GraphCases } from '../shared/GraphCases'
import { SubstitutionBuilder } from '../shared/SubstitutionBuilder'
import { RevealTwoVariable } from '../shared/RevealTwoVariable'
import { ConnectMethods } from '../shared/ConnectMethods'
import { PredictionPairChange } from '../shared/PredictionPairChange'
import { PatternRecognize } from '../shared/PatternRecognize'
import { PracticePairs } from '../shared/PracticePairs'
import { StoryBuilder } from '../shared/StoryBuilder'
import { ContextWorkflow } from '../shared/ContextWorkflow'
import { VerifyCheck } from '../shared/VerifyCheck'

export function PageRenderer() {
  const { currentPage, dispatch, currentLesson } = useLesson()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage?.id])

  if (!currentPage || !currentLesson) return null

  const handleSuccess = () => {
    if (currentPage) {
      dispatch({ type: 'COMPLETE_PAGE', pageId: currentPage.id })
    }
    dispatch({ type: 'NEXT_PAGE' })
  }

  return <PageContent page={currentPage} lessonId={currentLesson.id} onSuccess={handleSuccess} />
}

function PageContent({
  page,
  onSuccess,
}: {
  page: PageConfig
  lessonId: string
  onSuccess: () => void
}) {
  switch (page.type) {
    case 'hook-mystery-box':
      return (
        <MysteryBox
          instruction={page.instruction}
          visibleCount={page.visibleCount!}
          totalCount={page.totalCount!}
          onSuccess={onSuccess}
        />
      )

    case 'hook-number-solve':
      return (
        <div className="fade-in space-y-6">
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {page.instruction}
          </p>
          <NumberSolveInput
            correctAnswer={page.correctAnswer as number}
            onSuccess={onSuccess}
          />
        </div>
      )

    case 'try-number-blocks':
      return (
        <NumberBlocks
          instruction={page.instruction}
          visibleNumber={page.visibleNumber ?? 0}
          correctAnswer={page.correctAnswer as number}
          maxNumber={page.maxNumber}
          onSuccess={onSuccess}
        />
      )

    case 'prediction-symbol':
      return (
        <SymbolChoice
          instruction={page.instruction}
          symbols={page.symbols!}
          correctId={page.correctId!}
          onSuccess={onSuccess}
          feedbackLabel={page.feedbackLabel}
        />
      )

    case 'reveal-concept':
      return (
        <ConceptReveal
          instruction={page.instruction}
          parts={page.equationParts!}
          onComplete={onSuccess}
        />
      )

    case 'formalism-sort':
    case 'variation-classify':
      return (
        <SortCards
          instruction={page.instruction}
          items={page.sortItems!}
          categories={page.sortCategories!}
          correctMap={page.correctMap!}
          onSuccess={onSuccess}
          incorrectFeedback={page.incorrectFeedback}
          meaningQuestion={page.meaningQuestion}
          meaningChoices={page.meaningChoices}
          meaningAnswer={page.meaningAnswer}
        />
      )

    case 'try-phrase-arrange':
      return (
        <PhraseArrange
          instruction={page.instruction}
          phrases={page.phrases!}
          correctOrder={page.correctOrder!}
          onSuccess={onSuccess}
        />
      )

    case 'reveal-language-to-algebra':
      return (
        <MapToAlgebra
          instruction={page.instruction}
          mappingPairs={page.mappingPairs!}
          onComplete={onSuccess}
        />
      )

    case 'build-equation-tiles':
    case 'variation-build':
      return (
        <EquationBuilder
          instruction={page.instruction}
          tiles={page.availableTiles!}
          targetEquation={page.targetEquation as string}
          onSuccess={onSuccess}
          sentence={page.sentence}
        />
      )

    case 'transfer-story-match':
      return (
        <StoryMatch
          instruction={page.instruction}
          algebraEquation={page.algebraEquation!}
          stories={page.stories!}
          correctStoryId={page.correctStoryId!}
          onSuccess={onSuccess}
        />
      )

    case 'try-balance-operate':
      return (
        <BalanceScale
          instruction={page.instruction}
          leftLatex={page.leftExpression!}
          rightLatex={page.rightExpression!}
          operationOptions={page.operationOptions!}
          correctOperation={page.correctOperation!}
          onSuccess={onSuccess}
        />
      )

    case 'reveal-balance':
      return (
        <BalanceScale
          instruction={page.instruction}
          leftLatex={page.leftExpression!}
          rightLatex={page.rightExpression!}
          operationOptions={page.operationOptions!}
          correctOperation={page.correctOperation!}
          onSuccess={onSuccess}
          showScale={true}
        />
      )

    case 'build-guided-solve': {
      const steps = page.steps ?? []
      return (
        <GuidedSolve
          instruction={page.instruction}
          initialEquation={page.initialEquation!}
          steps={steps}
          onSuccess={onSuccess}
        />
      )
    }

    case 'practice-solve': {
      const equations = [
        { equation: 'x + 3 = 8', answer: 5, steps: [] },
        { equation: 'x - 4 = 6', answer: 10, steps: [] },
        { equation: '2x = 10', answer: 5, steps: [] },
        { equation: '3x + 2 = 11', answer: 3, steps: [] },
        { equation: '5x - 7 = 18', answer: 5, steps: [] },
      ]
      return (
        <PracticeSolve
          instruction={page.instruction}
          equations={equations}
          onComplete={onSuccess}
        />
      )
    }

    case 'meaning-check':
      return (
        <MeaningCheck
          instruction={page.instruction}
          questions={page.questions!}
          onComplete={onSuccess}
          equation={page.initialEquation}
        />
      )

    case 'hook-timeline-predict':
      return (
        <Timeline
          instruction={page.instruction}
          timelineNow={page.timelineNow!}
          timelineFuture={page.timelineFuture!}
          timelineLabel={page.timelineLabel!}
question={page.question ?? page.instruction}
          choices={page.choices}
          correctChoiceId={page.correctChoiceId}
          onSuccess={onSuccess}
        />
      )

    case 'prediction-identify':
      return (
        <IdentifyUnknown
          instruction={page.instruction}
          options={page.options || page.symbols || []}
          correctId={page.correctId!}
          onSuccess={onSuccess}
        />
      )

    case 'build-map-to-algebra':
      return (
        <MapToAlgebra
          instruction={page.instruction}
          mappingPairs={page.mappingPairs!}
          onComplete={onSuccess}
        />
      )

    case 'solve-context': {
      const eq = page.initialEquation || 'x + 10 = 3x'
      const steps = [
        { question: 'Apa yang perlu dilakukan dahulu?', options: ['+x', '-x', '+10', '-10'], correct: '-x' },
        { question: 'Sekarang apa?', options: ['+2', '-2', '×2', '÷2'], correct: '÷2' },
      ]
      return (
        <ContextSolve
          instruction={page.instruction}
          equation={eq}
          steps={steps}
          onSuccess={onSuccess}
        />
      )
    }

    case 'interpret-verify':
      return (
        <AgeVerify
          instruction={page.instruction}
          verifyLatex={page.verifyEquation || '5 + 10 = 15'}
          resultLatex={page.resultLatex || '3(5) = 15'}
          question={page.question || 'Adakah kedua-dua belah sama?'}
          onSuccess={onSuccess}
        />
      )

    case 'transfer-model-solve': {
      const steps = page.steps ?? []
      return (
        <div className="fade-in space-y-6">
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {page.instruction}
          </p>
          <GuidedSolve
            instruction="Selesaikan langkah demi langkah:"
            initialEquation={page.initialEquation!}
            steps={steps}
            onSuccess={onSuccess}
          />
        </div>
      )
    }

    // === 6.2.x NEW PAGE TYPES ===

    case 'hook-dual-slider':
      return (
        <DualSlider
          instruction={page.instruction}
          quantityLabel1={page.quantityLabel1!}
          quantityLabel2={page.quantityLabel2!}
          totalLabel={page.totalLabel}
          sliderMin={page.sliderMin}
          sliderMax={page.sliderMax}
          sliderDefault={page.sliderDefault}
          relationshipType={page.relationshipType}
          totalValue={page.totalValue}
          differenceValue={page.differenceValue}
          onSuccess={onSuccess}
        />
      )

    case 'try-yes-no':
      return (
        <div className="fade-in space-y-6">
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {page.instruction}
          </p>
          {page.yesNoQuestion && (
            <p className="font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
              {page.yesNoQuestion}
            </p>
          )}
          <div className="flex gap-3 justify-center flex-wrap">
            {(page.choices || []).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  if (c.id === page.correctChoiceId) {
                    setTimeout(onSuccess, 800)
                  }
                }}
                className="px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200"
                style={{
                  background: 'var(--card-secondary)',
                  border: '2px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )

    case 'reveal-two-variable':
      return (
        <RevealTwoVariable
          instruction={page.instruction}
          equation={page.equation!}
          variableMeanings={page.variableMeanings!}
          onSuccess={onSuccess}
        />
      )

    case 'reveal-two-equations':
      return (
        <MapToAlgebra
          instruction={page.instruction}
          mappingPairs={page.mappingPairs!}
          onComplete={onSuccess}
        />
      )

    case 'reveal-graph-points':
      return (
        <GraphPlot
          instruction={page.instruction}
          equation={page.graphEquation}
          points={page.graphPoints}
          showLine={true}
          onSuccess={onSuccess}
          axes={page.graphAxes}
        />
      )

    case 'try-pair-input':
      return (
        <PairInput
          instruction={page.instruction}
          pairTarget={page.pairTarget!}
          pairOperation={page.pairOperation!}
          onSuccess={onSuccess}
        />
      )

    case 'try-pattern-recognize':
      return (
        <PatternRecognize
          instruction={page.instruction}
          patternPoints={page.patternPoints!}
          patternOptions={page.patternOptions!}
          onSuccess={onSuccess}
        />
      )

    case 'try-substitution-predict':
      return (
        <div className="fade-in space-y-6">
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {page.instruction}
          </p>
          <div className="card-3d p-5 text-center">
            <p className="font-bold text-lg" style={{ color: 'var(--teal)' }}>
              x = {page.substitutionExpression}
            </p>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            {(page.choices || []).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  if (c.id === page.correctChoiceId) {
                    setTimeout(onSuccess, 800)
                  }
                }}
                className="px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200"
                style={{
                  background: 'var(--card-secondary)',
                  border: '2px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )

    case 'prediction-pair-change':
      return (
        <PredictionPairChange
          instruction={page.instruction}
          pairEquation={page.pairEquation!}
          initialX={page.initialX!}
          initialY={page.initialY!}
          onSuccess={onSuccess}
        />
      )

    case 'formalism-ordered-pair':
      return (
        <OrderedPairQuiz
          instruction={page.instruction}
          orderedPairEquation={page.orderedPairEquation!}
          orderedPairOptions={page.orderedPairOptions!}
          orderedPairCorrectId={page.orderedPairCorrectId!}
          onSuccess={onSuccess}
        />
      )

    case 'build-pair-table':
      return (
        <PairTable
          instruction={page.instruction}
          tableEquation={page.tableEquation!}
          tableXValues={page.tableXValues}
          onSuccess={onSuccess}
        />
      )

    case 'build-graph':
    case 'practice-graph':
      return (
        <GraphPlot
          instruction={page.instruction}
          equation={page.graphEquationForBuild}
          requiredPoints={page.graphRequiredPoints}
          editable={true}
          showLine={true}
          onSuccess={onSuccess}
          axes={page.graphAxes}
        />
      )

    case 'build-substitution':
      return (
        <SubstitutionBuilder
          instruction={page.instruction}
          substitutionSystem={page.substitutionSystem!}
          substitutionSteps={page.substitutionSteps!}
          onSuccess={onSuccess}
        />
      )

    case 'practice-pairs':
      return (
        <PracticePairs
          instruction={page.instruction}
          practicePairEquation={page.practicePairEquation!}
          onSuccess={onSuccess}
        />
      )

    case 'variation-graph-cases':
      return (
        <GraphCases
          instruction={page.instruction}
          graphCases={page.graphCases!}
          onSuccess={onSuccess}
        />
      )

    case 'graph-intersection':
      return (
        <GraphPlot
          instruction={page.instruction}
          lines={page.graphLines}
          intersectionPoint={page.intersectionPoint}
          onSuccess={onSuccess}
          axes={page.graphAxes}
        />
      )

    case 'connect-methods':
      return (
        <ConnectMethods
          instruction={page.instruction}
          connectMethods={page.connectMethods!}
          commonSolution={page.commonSolution || ''}
          onSuccess={onSuccess}
        />
      )

    case 'transfer-story-build':
      return (
        <StoryBuilder
          instruction={page.instruction}
          storyBuildEquation={page.storyBuildEquation!}
          onSuccess={onSuccess}
        />
      )

    case 'transfer-context-workflow':
      return (
        <ContextWorkflow
          instruction={page.instruction}
          workflowSteps={page.workflowSteps!}
          onSuccess={onSuccess}
        />
      )

    case 'verify-check':
      return (
        <VerifyCheck
          instruction={page.instruction}
          verifyCalculations={page.verifyCalculations!}
          verifyQuestion={page.verifyQuestion!}
          onSuccess={onSuccess}
        />
      )

    case 'try-cost-check':
      return (
        <CostCheck
          instruction={page.instruction}
          costPairs={page.costPairs!}
          totalCost={page.totalCost!}
          onSuccess={onSuccess}
        />
      )

    case 'mastery-explain':
      return (
        <div className="fade-in space-y-6">
          <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {page.instruction}
          </p>
          <div className="card-3d p-5" style={{ borderColor: 'var(--coral)', background: 'var(--coral-tint)' }}>
            <p className="font-medium text-lg" style={{ color: 'var(--text-primary)' }}>
              {page.masteryQuestion}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {(page.masteryChoices || []).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  if (c.id === page.masteryCorrectId) {
                    setTimeout(onSuccess, 1000)
                  }
                }}
                className="w-full p-4 rounded-xl text-left font-medium transition-all duration-200"
                style={{
                  background: 'var(--card-secondary)',
                  border: '2px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )

    default:
      return (
        <div className="card-3d p-6 text-center">
          <p style={{ color: 'var(--text-secondary)' }}>Halaman sedang dibina...</p>
          <button
            onClick={onSuccess}
            className="mt-4 px-6 py-3 rounded-xl font-bold text-white"
            style={{ background: 'var(--teal)' }}
          >
            Seterusnya
          </button>
        </div>
      )
  }
}

function NumberSolveInput({
  correctAnswer,
  onSuccess,
}: {
  correctAnswer: number
  onSuccess: () => void
}) {
  const [value, setValue] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [correct, setCorrect] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setAttempted(true)
    const num = parseFloat(value)
    if (num === correctAnswer) {
      setCorrect(true)
      setTimeout(onSuccess, 1200)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setAttempted(false)
          }}
          className="w-32 px-4 py-3 rounded-xl text-center font-bold text-2xl outline-none transition-all duration-200"
          style={{
            background: 'var(--card)',
            border: `2px solid ${
              attempted && !correct
                ? 'var(--coral)'
                : correct
                  ? 'var(--teal)'
                  : 'var(--border)'
            }`,
            color: 'var(--text-primary)',
          }}
          autoFocus
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-xl font-bold text-white transition-all duration-200 hover:opacity-90"
          style={{ background: 'var(--teal)' }}
        >
          Semak
        </button>
      </form>
      {attempted && !correct && (
        <Feedback type="incorrect" message="Cuba lagi. Fikirkan nombor yang selepas ditolak 8 menjadi 2." />
      )}
      {correct && (
        <div className="text-center bounce-enter">
          <div className="card-3d inline-block p-4">
            <p className="text-xl font-bold" style={{ color: 'var(--teal)' }}>
              {correctAnswer} - 8 = 2
            </p>
          </div>
        </div>
      )}
    </div>
  )
}