import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ObservationScreen } from './components/screens/ObservationScreen'
import { MCQuestionScreen } from './components/screens/MCQuestionScreen'
import { NumberInputScreen } from './components/screens/NumberInputScreen'
import { GateScreen } from './components/screens/GateScreen'
import { ProgressBar } from './components/ui/ProgressBar'
import { GateResult } from './components/ui/GateResult'
import { useAnimasiProgress } from '../../hooks/useAnimasiProgress'
import type { Bab6Content, Moment } from './types'

export function LessonEngine() {
  const [content, setContent] = useState<Bab6Content | null>(null)
  const [currentSubtopicIdx, setCurrentSubtopicIdx] = useState(0)
  const [momentResults, setMomentResults] = useState<Record<string, 'correct' | 'incorrect' | 'viewed'>>({})
  const [visibleMomentIdx, setVisibleMomentIdx] = useState(0)
  const [gateActive, setGateActive] = useState(false)
  const [gateQuestions, setGateQuestions] = useState<Moment[]>([])
  const [gateIdx, setGateIdx] = useState(0)
  const [gateCorrect, setGateCorrect] = useState(0)
  const [gateDone, setGateDone] = useState(false)
  const [scrollBlocked, setScrollBlocked] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

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
    const total = gateQuestions.length
    const score = Math.round((gateCorrect / total) * 100)
    if (score < subtopic.gate.requiredScore) {
      setScrollBlocked(true)
    } else {
      // Auto-advance to next subtopic after brief delay
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
    setScrollBlocked(false)
    // Scroll to the gate section
    setTimeout(() => {
      const idx = (subtopic.moments.length)
      cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
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
    setScrollBlocked(false)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [content, currentSubtopicIdx])

  const retrySubtopic = useCallback(() => {
    setMomentResults({})
    setGateActive(false)
    setGateQuestions([])
    setGateIdx(0)
    setGateCorrect(0)
    setGateDone(false)
    setScrollBlocked(false)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [])

  // IntersectionObserver for visible moment tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-moment-idx'))
            if (!isNaN(idx)) setVisibleMomentIdx(idx)
          }
        }
      },
      { threshold: 0.4 },
    )
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
    cards.forEach((c) => observer.observe(c))
    return () => observer.disconnect()
  }, [allMoments.length])

  const scrollToMoment = useCallback((idx: number) => {
    cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth' })
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
      <div className="flex items-center justify-center h-screen px-5">
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

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-duo-charcoal">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 h-12 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentSubtopicIdx > 0) {
                moveToNextSubtopic()
              }
            }}
            className="text-duo-gray hover:text-duo-charcoal dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-sm font-bold text-duo-charcoal dark:text-gray-100 truncate">
            {subtopic.title}
          </h1>
        </div>
        <span className="text-xs font-bold text-duo-gray">
          {visibleMomentIdx + 1}/{allMoments.length}
        </span>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-scroll snap-y snap-mandatory ${scrollBlocked ? 'overflow-hidden' : ''}`}
      >
        {allMoments.map((moment, idx) => {
          if (isGateIntro(moment) && !gateActive) {
            return (
              <div
                key={moment.id}
                data-moment-idx={idx}
                ref={(el) => { cardRefs.current[idx] = el }}
                className="h-screen snap-start flex-shrink-0 flex items-center justify-center px-5"
              >
                <GateScreen moment={moment} onComplete={startGate} />
              </div>
            )
          }

          if (isGateQuestion(moment)) {
            return (
              <div
                key={moment.id}
                data-moment-idx={idx}
                ref={(el) => { cardRefs.current[idx] = el }}
                className="h-screen snap-start flex-shrink-0 overflow-y-auto"
              >
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
              <div
                key={moment.id}
                data-moment-idx={idx}
                ref={(el) => { cardRefs.current[idx] = el }}
                className="h-screen snap-start flex-shrink-0 overflow-y-auto"
              >
                <MCQuestionScreen moment={moment} onAnswer={(c) => handleAnswer(moment.id, c, subtopic.id)} />
              </div>
            )
          }

          if (moment.interaction?.correctAnswer !== undefined) {
            return (
              <div
                key={moment.id}
                data-moment-idx={idx}
                ref={(el) => { cardRefs.current[idx] = el }}
                className="h-screen snap-start flex-shrink-0 overflow-y-auto"
              >
                <NumberInputScreen moment={moment} onAnswer={(c) => handleAnswer(moment.id, c, subtopic.id)} />
              </div>
            )
          }

          // Pure observation
          return (
            <div
              key={moment.id}
              data-moment-idx={idx}
              ref={(el) => { cardRefs.current[idx] = el }}
              className="h-screen snap-start flex-shrink-0 overflow-y-auto"
            >
              <ObservationScreen moment={moment} onComplete={() => {}} />
            </div>
          )
        })}

        {/* Gate Result Card */}
        {isGateResultCard && subtopic.gate && (
          <div
            key="gate-result"
            data-moment-idx={allMoments.length}
            ref={(el) => { cardRefs.current[allMoments.length] = el }}
            className="h-screen snap-start flex-shrink-0 flex items-center justify-center"
          >
            <GateResult
              passed={Math.round((gateCorrect / gateQuestions.length) * 100) >= subtopic.gate.requiredScore}
              score={Math.round((gateCorrect / gateQuestions.length) * 100)}
              requiredScore={subtopic.gate.requiredScore}
              onRetry={retrySubtopic}
              onContinue={moveToNextSubtopic}
            />
          </div>
        )}

        {/* Subtopic transition */}
        {!gateActive && !isGateResultCard && subtopic.moments.every(
          (m) => !m.interaction || momentResults[m.id],
        ) && (
          <div
            key="subtopic-done"
            data-moment-idx={allMoments.length}
            className="h-screen snap-start flex-shrink-0 flex items-center justify-center px-5"
          >
            <motion.button
              onClick={moveToNextSubtopic}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 rounded-xl bg-duo-purple text-white font-bold shadow-md text-base"
            >
              Teruskan ke Subtopik Seterusnya
            </motion.button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <ProgressBar
        total={allMoments.length + (isGateResultCard ? 1 : 0)}
        current={visibleMomentIdx}
        results={momentResults}
        momentIds={allMoments.map((m) => m.id)}
        onDotClick={scrollToMoment}
      />

      {/* Scroll blocker overlay */}
      {scrollBlocked && (
        <div className="fixed inset-0 z-30 bg-black/50 flex items-center justify-center px-5">
          <div className="bg-white dark:bg-duo-charcoal rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-duo-orange/20 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-duo-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-black text-duo-charcoal dark:text-gray-100">Belum Lulus Gate</p>
              <p className="text-sm text-duo-charcoal/60 dark:text-gray-400 mt-1">
                Skor: {gateQuestions.length > 0 ? Math.round((gateCorrect / gateQuestions.length) * 100) : 0}% (perlukan {subtopic?.gate?.requiredScore ?? 80}%)
              </p>
            </div>
            <motion.button
              onClick={retrySubtopic}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl bg-duo-orange text-white font-bold shadow-md"
            >
              Cuba Semula
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}