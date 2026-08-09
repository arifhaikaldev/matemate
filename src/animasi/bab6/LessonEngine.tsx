import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ObservationScreen } from './components/screens/ObservationScreen'
import { MCQuestionScreen } from './components/screens/MCQuestionScreen'
import { NumberInputScreen } from './components/screens/NumberInputScreen'
import { GateScreen } from './components/screens/GateScreen'
import { ProgressDots } from './components/ui/ProgressDots'
import { NavButtons } from './components/ui/NavButtons'
import { GateResult } from './components/ui/GateResult'
import { useAnimasiProgress } from '../../hooks/useAnimasiProgress'
import type { Bab6Content, Subtopic, Moment } from './types'

type ScreenState =
  | { type: 'loading' }
  | { type: 'intro' }
  | { type: 'moment'; moment: Moment; subtopicId: string }
  | { type: 'gate'; subtopic: Subtopic; score: number }
  | { type: 'gateResult'; passed: boolean; subtopic: Subtopic; score: number }
  | { type: 'completed' }

export function LessonEngine() {
  const [content, setContent] = useState<Bab6Content | null>(null)
  const [screenState, setScreenState] = useState<ScreenState>({ type: 'loading' })
  const [currentMomentIdx, setCurrentMomentIdx] = useState(0)
  const [currentSubtopicIdx, setCurrentSubtopicIdx] = useState(0)
  const [momentResults, setMomentResults] = useState<Record<string, 'correct' | 'incorrect' | 'viewed'>>({})
  const [answeredInSubtopic, setAnsweredInSubtopic] = useState(0)
  const [correctInSubtopic, setCorrectInSubtopic] = useState(0)
  const [gateQuestions, setGateQuestions] = useState<Moment[]>([])
  const [gateIdx, setGateIdx] = useState(0)
  const [gateCorrect, setGateCorrect] = useState(0)

  const { saveProgress } = useAnimasiProgress()

  useEffect(() => {
    async function load() {
      try {
        const [s1, s2, s3] = await Promise.all([
          fetch('/animasi/form1/bab6/6.1.json').then((r) => r.json()),
          fetch('/animasi/form1/bab6/6.2.json').then((r) => r.json()),
          fetch('/animasi/form1/bab6/6.3.json').then((r) => r.json()),
        ])
        setContent({
          id: 'bab6',
          title: 'Persamaan Linear',
          subtopics: [s1, s2, s3],
        })
        const firstMoment = s1.moments[0]
        if (firstMoment) {
          setScreenState({ type: 'moment', moment: firstMoment, subtopicId: '6.1' })
        }
      } catch (e) {
        console.error('Failed to load Bab 6 content:', e)
        setScreenState({ type: 'completed' })
      }
    }
    load()
  }, [])

  const currentSubtopic = useMemo(() => {
    if (!content) return null
    return content.subtopics[currentSubtopicIdx] ?? null
  }, [content, currentSubtopicIdx])

  const isGateMoment = (id: string) => id.includes('.A') || id.includes('gate')

  // Navigate to next screen
  const goNext = useCallback(() => {
    if (!content) return

    const subtopic = content.subtopics[currentSubtopicIdx]
    if (!subtopic) return

    if (screenState.type === 'moment') {
      const nextIdx = currentMomentIdx + 1

      // Check if we've finished this subtopic's moments
      if (nextIdx >= subtopic.moments.length) {
        // If this subtopic has a gate, show it
        if (subtopic.gate) {
          // Build gate questions from all interactive moments in this subtopic
          const moments = subtopic.moments.filter(
            (m) => m.type !== 'gate' && m.interaction,
          )
          setGateQuestions(moments)
          setGateIdx(0)
          setGateCorrect(0)
          setScreenState({ type: 'gate', subtopic, score: calculateScore() })
        } else {
          // No gate, move to next subtopic
          moveToSubtopic(currentSubtopicIdx + 1)
        }
        return
      }

      // If next moment is a gate, navigate to it so GateScreen handles the intro
      const nextMoment = subtopic.moments[nextIdx]
      if (isGateMoment(nextMoment.id)) {
        setCurrentMomentIdx(nextIdx)
        setScreenState({ type: 'moment', moment: nextMoment, subtopicId: subtopic.id })
        return
      }

      setCurrentMomentIdx(nextIdx)
      setScreenState({
        type: 'moment',
        moment: nextMoment,
        subtopicId: subtopic.id,
      })
      return
    }

    if (screenState.type === 'gateResult') {
      if (screenState.passed) {
        moveToSubtopic(currentSubtopicIdx + 1)
      } else {
        // Retry: go back to start of subtopic
        setCurrentMomentIdx(0)
        setAnsweredInSubtopic(0)
        setCorrectInSubtopic(0)
        const firstMoment = subtopic.moments[0]
        if (firstMoment) {
          setScreenState({ type: 'moment', moment: firstMoment, subtopicId: subtopic.id })
        }
      }
    }
  }, [content, currentSubtopicIdx, currentMomentIdx, screenState, momentResults])

  const calculateScore = useCallback(() => {
    if (answeredInSubtopic === 0) return 0
    return Math.round((correctInSubtopic / answeredInSubtopic) * 100)
  }, [answeredInSubtopic, correctInSubtopic])

  // Move to a specific subtopic
  const moveToSubtopic = useCallback((idx: number) => {
    if (!content) return
    const subtopic = content.subtopics[idx]
    if (!subtopic) {
      setScreenState({ type: 'completed' })
      return
    }
    setCurrentSubtopicIdx(idx)
    setCurrentMomentIdx(0)
    setAnsweredInSubtopic(0)
    setCorrectInSubtopic(0)
    const firstMoment = subtopic.moments[0]
    if (firstMoment) {
      setScreenState({ type: 'moment', moment: firstMoment, subtopicId: subtopic.id })
    }
  }, [content])

  // Go back
  const goBack = useCallback(() => {
    if (!content || currentMomentIdx <= 0) return
    const prevIdx = currentMomentIdx - 1
    setCurrentMomentIdx(prevIdx)
    const subtopic = content.subtopics[currentSubtopicIdx]
    if (subtopic) {
      setScreenState({
        type: 'moment',
        moment: subtopic.moments[prevIdx],
        subtopicId: subtopic.id,
      })
    }
  }, [content, currentMomentIdx, currentSubtopicIdx])

  // Handle answer from screens
  const handleAnswer = useCallback(
    async (momentId: string, correct: boolean, subtopicId: string) => {
      setMomentResults((prev) => ({ ...prev, [momentId]: correct ? 'correct' : 'incorrect' }))
      setAnsweredInSubtopic((a) => a + 1)
      if (correct) setCorrectInSubtopic((c) => c + 1)

      await saveProgress({
        momentId,
        subtopic: subtopicId,
        completed: true,
        correct,
        hintsUsed: 0,
        masa_kemaskini: Date.now(),
      })

      // Auto-advance
      setTimeout(() => {
        if (!content) return
        const subtopic = content.subtopics[currentSubtopicIdx]
        if (!subtopic) return

        const nextIdx = currentMomentIdx + 1

        // Check if we need to go to next moment or gate
        if (nextIdx < subtopic.moments.length) {
          const nextMoment = subtopic.moments[nextIdx]
          if (isGateMoment(nextMoment.id)) {
            // Navigate to gate moment intro first
            setCurrentMomentIdx(nextIdx)
            setScreenState({ type: 'moment', moment: nextMoment, subtopicId: subtopic.id })
          } else {
            setCurrentMomentIdx(nextIdx)
            setScreenState({
              type: 'moment',
              moment: nextMoment,
              subtopicId: subtopic.id,
            })
          }
        }
      }, correct ? 600 : 1400)
    },
    [content, currentSubtopicIdx, currentMomentIdx, answeredInSubtopic, correctInSubtopic, saveProgress],
  )

  // Handle gate answer
  const handleGateAnswer = useCallback(
    async (_momentId: string, correct: boolean) => {
      if (correct) setGateCorrect((g) => g + 1)
      setGateIdx((i) => i + 1)

      const nextIdx = gateIdx + 1
      if (nextIdx >= gateQuestions.length) {
        // Gate complete
        const score = Math.round(
          ((gateCorrect + (correct ? 1 : 0)) / gateQuestions.length) * 100,
        )
        const subtopic = content?.subtopics[currentSubtopicIdx]
        if (subtopic && subtopic.gate) {
          const passed = score >= subtopic.gate.requiredScore
          setScreenState({ type: 'gateResult', passed, subtopic, score })
        }
      }
    },
    [gateIdx, gateQuestions, gateCorrect, content, currentSubtopicIdx],
  )

  // Loading state
  if (screenState.type === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-duo-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (screenState.type === 'completed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 space-y-4"
      >
        <div className="w-20 h-20 rounded-full bg-duo-green/20 dark:bg-duo-green/10 flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-duo-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-duo-charcoal dark:text-gray-100">
          Tahniah! Bab 6 Selesai!
        </h2>
        <p className="text-sm text-duo-charcoal/60 dark:text-gray-400 max-w-sm mx-auto">
          Anda telah menguasai Persamaan Linear — termasuk satu pemboleh ubah, dua pemboleh ubah, dan persamaan serentak.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-black text-duo-charcoal dark:text-gray-100">
            Bab 6: {content?.title}
          </h1>
          <p className="text-xs text-duo-gray font-medium">
            {currentSubtopic?.title}
          </p>
        </div>
        {screenState.type === 'moment' && (
          <span className="text-xs font-bold text-duo-gray bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
            {currentMomentIdx + 1}/{currentSubtopic?.moments.length ?? 0}
          </span>
        )}
      </div>

      {/* Progress dots */}
      {screenState.type === 'moment' && (
        <ProgressDots
          current={currentMomentIdx}
          total={currentSubtopic?.moments.length ?? 0}
          completed={Object.entries(momentResults)
            .filter(([_, v]) => v === 'correct' || v === 'viewed')
            .map(([k]) => {
              const idx = currentSubtopic?.moments.findIndex((m) => m.id === k)
              return idx !== undefined && idx >= 0 ? String(idx) : '-1'
            })}
        />
      )}

      {/* Screen content */}
      <AnimatePresence mode="wait">
        {screenState.type === 'moment' && (
          <motion.div
            key={screenState.moment.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {screenState.moment.type === 'observation' && (
              <ObservationScreen
                moment={screenState.moment}
                onComplete={() => goNext()}
              />
            )}
            {screenState.moment.type === 'multipleChoice' && (
              <MCQuestionScreen
                moment={screenState.moment}
                onAnswer={(correct) =>
                  handleAnswer(screenState.moment.id, correct, screenState.subtopicId)
                }
              />
            )}
            {screenState.moment.type === 'numberInput' && (
              <NumberInputScreen
                moment={screenState.moment}
                onAnswer={(correct) =>
                  handleAnswer(screenState.moment.id, correct, screenState.subtopicId)
                }
              />
            )}
            {screenState.moment.type === 'gate' && (() => {
              const subtopic = content?.subtopics[currentSubtopicIdx]
              return (
                <GateScreen
                  moment={screenState.moment}
                  onComplete={() => {
                    if (!subtopic) return
                    const moments = subtopic.moments.filter(
                      (m) => m.type !== 'gate' && m.interaction,
                    )
                    setGateQuestions(moments)
                    setGateIdx(0)
                    setGateCorrect(0)
                    setScreenState({ type: 'gate', subtopic, score: calculateScore() })
                  }}
                />
              )
            })()}
          </motion.div>
        )}

        {screenState.type === 'gate' && (
          <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {gateIdx < gateQuestions.length ? (
              gateQuestions[gateIdx].type === 'multipleChoice' ? (
                <MCQuestionScreen
                  moment={gateQuestions[gateIdx]}
                  onAnswer={(correct) => handleGateAnswer(gateQuestions[gateIdx].id, correct)}
                />
              ) : (
                <NumberInputScreen
                  moment={gateQuestions[gateIdx]}
                  onAnswer={(correct) => handleGateAnswer(gateQuestions[gateIdx].id, correct)}
                />
              )
            ) : (
              <GateScreen
                moment={{
                  id: 'gate-screen',
                  type: 'gate',
                  title: `Gate ${screenState.subtopic.id}`,
                  objective: `Selesaikan soalan masteri untuk ${screenState.subtopic.title}.`,
                  visual: null,
                  content: { instruction: '', notation: [] },
                }}
                onComplete={() => {
                  setScreenState(screenState)
                }}
              />
            )}
          </motion.div>
        )}

        {screenState.type === 'gateResult' && (
          <motion.div key="gateResult" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <GateResult
              passed={screenState.passed}
              score={screenState.score}
              requiredScore={screenState.subtopic.gate?.requiredScore ?? 80}
              onRetry={() => {
                setCurrentMomentIdx(0)
                setAnsweredInSubtopic(0)
                setCorrectInSubtopic(0)
                const firstMoment = screenState.subtopic.moments[0]
                if (firstMoment) {
                  setScreenState({
                    type: 'moment',
                    moment: firstMoment,
                    subtopicId: screenState.subtopic.id,
                  })
                }
              }}
              onContinue={() => moveToSubtopic(currentSubtopicIdx + 1)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {screenState.type === 'moment' && screenState.moment.type === 'observation' && (
        <NavButtons
          onBack={goBack}
          onNext={goNext}
          canGoBack={currentMomentIdx > 0}
          canGoNext={true}
        />
      )}
    </div>
  )
}