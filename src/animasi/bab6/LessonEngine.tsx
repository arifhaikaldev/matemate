import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ObservationScreen } from './components/screens/ObservationScreen'
import { MCQuestionScreen } from './components/screens/MCQuestionScreen'
import { NumberInputScreen } from './components/screens/NumberInputScreen'
import { GateScreen } from './components/screens/GateScreen'
import { GateResult } from './components/ui/GateResult'
import { useAnimasiProgress } from '../../hooks/useAnimasiProgress'
import type { Bab6Content, Moment } from './types'

export function LessonEngine() {
  const [content, setContent] = useState<Bab6Content | null>(null)
  const [currentSubtopicIdx, setCurrentSubtopicIdx] = useState(0)
  const [momentResults, setMomentResults] = useState<Record<string, 'correct' | 'incorrect' | 'viewed'>>({})
  const [gateActive, setGateActive] = useState(false)
  const [gateQuestions, setGateQuestions] = useState<Moment[]>([])
  const [gateIdx, setGateIdx] = useState(0)
  const [gateCorrect, setGateCorrect] = useState(0)
  const [gateDone, setGateDone] = useState(false)
  const [showGateFailed, setShowGateFailed] = useState(false)

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
      } catch (e) {
        console.error('Failed to load Bab 6 content:', e)
      }
    }
    load()
  }, [])

  const subtopic = content?.subtopics[currentSubtopicIdx]
  const allMoments = gateActive ? [...(subtopic?.moments ?? []), ...gateQuestions] : (subtopic?.moments ?? [])

  const handleAnswer = useCallback(
    async (momentId: string, correct: boolean, _subtopicId: string) => {
      setMomentResults((prev) => ({ ...prev, [momentId]: correct ? 'correct' : 'incorrect' }))
      if (gateActive) {
        if (correct) setGateCorrect((g) => g + 1)
        setGateIdx((i) => i + 1)
        await saveProgress({ momentId, subtopic: 'gate', completed: true, correct, hintsUsed: 0, masa_kemaskini: Date.now() })
        return
      }
      await saveProgress({ momentId, subtopic: subtopic?.id ?? '', completed: true, correct, hintsUsed: 0, masa_kemaskini: Date.now() })
    },
    [gateActive, subtopic, saveProgress],
  )

  // Check gate completion
  useEffect(() => {
    if (!gateActive || !subtopic?.gate || gateIdx < gateQuestions.length) return
    setGateDone(true)
    const score = Math.round((gateCorrect / gateQuestions.length) * 100)
    if (score < subtopic.gate.requiredScore) {
      setShowGateFailed(true)
    } else {
      const timer = setTimeout(() => moveToNextSubtopic(), 1500)
      return () => clearTimeout(timer)
    }
  }, [gateActive, gateIdx, gateQuestions, gateCorrect, subtopic])

  const startGate = useCallback(() => {
    if (!subtopic) return
    const questions = subtopic.moments.filter((m) => m.interaction)
    setGateQuestions(questions)
    setGateActive(true)
    setGateIdx(0)
    setGateCorrect(0)
    setGateDone(false)
    setShowGateFailed(false)
  }, [subtopic])

  const moveToNextSubtopic = useCallback(() => {
    if (!content) return
    const nextIdx = currentSubtopicIdx + 1
    if (nextIdx >= content.subtopics.length) return
    setCurrentSubtopicIdx(nextIdx)
    setMomentResults({})
    setGateActive(false)
    setGateQuestions([])
    setGateIdx(0)
    setGateCorrect(0)
    setGateDone(false)
    setShowGateFailed(false)
  }, [content, currentSubtopicIdx])

  const retrySubtopic = useCallback(() => {
    setMomentResults({})
    setGateActive(false)
    setGateQuestions([])
    setGateIdx(0)
    setGateCorrect(0)
    setGateDone(false)
    setShowGateFailed(false)
  }, [])

  if (!content) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-duo-purple border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // End of all subtopics
  if (currentSubtopicIdx >= content.subtopics.length) {
    return (
      <div className="flex items-center justify-center min-h-screen px-5">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-duo-green/20 flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-duo-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-duo-charcoal dark:text-gray-100">Tahniah! Bab 6 Selesai!</h2>
          <p className="text-sm text-duo-charcoal/60 dark:text-gray-400 max-w-xs mx-auto">
            Anda telah menguasai Persamaan Linear — satu pemboleh ubah, dua pemboleh ubah, dan persamaan serentak.
          </p>
        </div>
      </div>
    )
  }

  if (!subtopic) return null

  const isGateIntro = (m: Moment) => m.type === 'gate'
  const isGateQuestion = (m: Moment) => gateActive && gateQuestions.includes(m)
  const isGateResultCard = gateDone && gateActive
  const allMomentsAnswered = subtopic.moments.every(
    (m) => !m.interaction || momentResults[m.id],
  )
  const gatePassed = gateDone && gateQuestions.length > 0 &&
    Math.round((gateCorrect / gateQuestions.length) * 100) >= (subtopic.gate?.requiredScore ?? 80)
  const canContinue = allMomentsAnswered && (!gateActive || gatePassed)

  return (
    <div className="min-h-screen bg-white dark:bg-duo-charcoal">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 h-12 border-b border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-duo-charcoal/90 backdrop-blur-sm">
        <h1 className="text-sm font-bold text-duo-charcoal dark:text-gray-100 truncate">
          {subtopic.title}
        </h1>
        <span className="text-xs font-bold text-duo-gray">
          {currentSubtopicIdx + 1}/{content.subtopics.length}
        </span>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto w-full px-5 py-6 space-y-4">
        {allMoments.map((moment) => {
          if (isGateIntro(moment) && !gateActive) {
            return (
              <div key={moment.id}>
                <GateScreen moment={moment} onComplete={startGate} />
              </div>
            )
          }

          if (isGateQuestion(moment)) {
            return (
              <div key={moment.id}>
                {moment.interaction?.choices ? (
                  <MCQuestionScreen moment={moment} onAnswer={(c) => handleAnswer(moment.id, c, 'gate')} />
                ) : (
                  <NumberInputScreen moment={moment} onAnswer={(c) => handleAnswer(moment.id, c, 'gate')} />
                )}
              </div>
            )
          }

          if (moment.interaction?.choices) {
            return (
              <div key={moment.id}>
                <MCQuestionScreen moment={moment} onAnswer={(c) => handleAnswer(moment.id, c, subtopic.id)} />
              </div>
            )
          }

          if (moment.interaction?.correctAnswer !== undefined) {
            return (
              <div key={moment.id}>
                <NumberInputScreen moment={moment} onAnswer={(c) => handleAnswer(moment.id, c, subtopic.id)} />
              </div>
            )
          }

          // Pure observation
          return (
            <div key={moment.id}>
              <ObservationScreen moment={moment} onComplete={() => {}} />
            </div>
          )
        })}

        {/* Gate Result Card */}
        {isGateResultCard && subtopic.gate && (
          <GateResult
            passed={gatePassed}
            score={Math.round((gateCorrect / gateQuestions.length) * 100)}
            requiredScore={subtopic.gate.requiredScore}
            onRetry={retrySubtopic}
            onContinue={moveToNextSubtopic}
          />
        )}

        {/* Gate failed retry button */}
        {showGateFailed && !gatePassed && (
          <motion.button
            onClick={retrySubtopic}
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary w-full"
          >
            Cuba Semula
          </motion.button>
        )}

        {/* Subtopic transition */}
        {canContinue && currentSubtopicIdx < content.subtopics.length - 1 && (
          <motion.button
            onClick={moveToNextSubtopic}
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary w-full"
          >
            Teruskan ke Subtopik Seterusnya
          </motion.button>
        )}

        {/* Last subtopic done */}
        {canContinue && currentSubtopicIdx >= content.subtopics.length - 1 && (
          <div className="text-center text-sm font-bold text-duo-green py-4">
            Kesemua subtopik telah selesai!
          </div>
        )}
      </div>
    </div>
  )
}