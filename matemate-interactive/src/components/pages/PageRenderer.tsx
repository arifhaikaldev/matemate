import { useState, useEffect } from 'react'
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

  const handleSubmit = (e: React.FormEvent) => {
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