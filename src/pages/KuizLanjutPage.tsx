import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { fetchIndex, fetchSubtopik } from '../lib/content'
import type { Subtopik, Soalan } from '../types'
import { AppHeader } from '../components/AppHeader'

interface LocationState {
  jawapan: Record<string, number>
}

export function KuizLanjutPage() {
  const { subtopikId, soalanIdx } = useParams<{ subtopikId: string; soalanIdx: string }>()
  const location = useLocation()
  const state = (location.state ?? { jawapan: {} }) as LocationState

  const [subtopik, setSubtopik] = useState<Subtopik | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [pilihan, setPilihan] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const navigate = useNavigate()
  const semasaIdx = parseInt(soalanIdx ?? '0', 10)

  const loadedRef = useRef(false)

  useEffect(() => {
    if (!subtopikId || loadedRef.current) return
    loadedRef.current = true
    async function load() {
      try {
        const idx = await fetchIndex()
        const entry = idx.subtopik.find((s) => s.id === subtopikId)
        if (!entry) throw new Error('Subtopik tidak dijumpai')
        const data = await fetchSubtopik(entry.fail)
        setSubtopik(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ralat')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [subtopikId])

  if (loading) return <LoadingState />
  if (error || !subtopik) return <ErrorState error={error} />

  const soalan = subtopik.soalan
  const jumlah = soalan.length
  const currentSoalan: Soalan = soalan[semasaIdx]
  const progress = Math.round((semasaIdx / jumlah) * 100)

  const handlePilih = (idx: number) => { if (!answered) setPilihan(idx) }

  const handleSemak = () => {
    if (pilihan === null) return
    setAnswered(true)
  }

  const handleTeruskan = () => {
    const updatedJawapan = { ...state.jawapan, [currentSoalan.id]: pilihan! }
    navigate(`/penjelasan/${subtopikId}/${semasaIdx}`, {
      state: {
        jawapan: updatedJawapan,
        semasaIdx,
        jumlah,
      },
    })
  }

  const betul = pilihan !== null && pilihan === currentSoalan.jawapan_betul

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk={subtopik.tajuk_subtopik} showBack>
        <span className="text-sm text-deep-charcoal/50 dark:text-gray-400 font-medium">
          {semasaIdx + 1}/{jumlah}
        </span>
      </AppHeader>

      <div className="h-1.5 bg-baby-blue/50 dark:bg-white/10">
        <div className="h-full bg-sky-blue transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
        <div className="flex items-center gap-2">
          <span className="badge-sky">Soalan {semasaIdx + 1}</span>
          {currentSoalan.sub_kemahiran && (
            <span className="badge-gray">{currentSoalan.sub_kemahiran.replace(/_/g, ' ')}</span>
          )}
        </div>

        <div className="card-white">
          <p className="text-base font-medium text-deep-charcoal dark:text-gray-100 leading-relaxed">
            {currentSoalan.soalan}
          </p>
          {currentSoalan.imej && (
            <div className="mt-3 rounded-xl overflow-hidden bg-baby-blue/30 dark:bg-white/5">
              <img src={currentSoalan.imej} alt="Rajah soalan" className="w-full object-contain max-h-48" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          {currentSoalan.pilihan.map((opt, i) => {
            const isSelected = pilihan === i
            const isBetul = i === currentSoalan.jawapan_betul
            const showResult = answered
            let cls = 'w-full text-left px-4 py-3.5 rounded-xl border-2 font-medium text-sm transition-all duration-150 '
            if (!showResult) {
              cls += isSelected
                ? 'border-sky-blue bg-baby-blue dark:bg-sky-blue/10 text-sky-blue-dark dark:text-sky-blue'
                : 'border-baby-blue/50 dark:border-white/10 bg-white dark:bg-deep-charcoal hover:border-sky-blue-light dark:hover:border-sky-blue/30 hover:bg-baby-blue/30 dark:hover:bg-sky-blue/5'
            } else {
              if (isBetul) cls += 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              else if (isSelected && !isBetul) cls += 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              else cls += 'border-baby-blue/30 dark:border-white/5 bg-white dark:bg-deep-charcoal opacity-50'
            }
            return (
              <button key={i} onClick={() => handlePilih(i)} disabled={answered} className={cls}>
                <div className="flex items-center gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    !showResult
                      ? isSelected ? 'border-sky-blue bg-sky-blue text-white' : 'border-baby-blue/60 dark:border-white/20 text-deep-charcoal/40 dark:text-gray-400'
                      : isBetul ? 'border-green-500 bg-green-500 text-white'
                      : isSelected ? 'border-red-500 bg-red-500 text-white'
                      : 'border-baby-blue/60 dark:border-white/20 text-deep-charcoal/40 dark:text-gray-400'
                  }`}>
                    {showResult && isBetul ? '✓' : showResult && isSelected && !isBetul ? '✗' : String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                </div>
              </button>
            )
          })}
        </div>

        {answered && (
          <div className={`rounded-xl border-2 p-5 ${betul ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-soft-peach bg-soft-peach-light dark:bg-soft-peach/10'}`}>
            <div className="flex items-center gap-2 mb-1">
              {betul ? (
                <><span className="text-2xl">✅</span><span className="font-bold text-green-700 dark:text-green-300">Betul! Bagus!</span></>
              ) : (
                <><span className="text-2xl">💪</span><span className="font-bold text-deep-charcoal/70 dark:text-soft-peach">Salah. Jangan risau!</span></>
              )}
            </div>
            <p className="text-sm text-deep-charcoal/60 dark:text-gray-400">Tekan "Lihat Penjelasan" untuk faham cara selesaikan soalan ini.</p>
          </div>
        )}

        <div className="h-24" />
      </main>

      <div className="sticky bottom-0 z-10 bg-white/95 dark:bg-deep-charcoal/95 backdrop-blur border-t border-baby-blue/50 dark:border-white/5 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {!answered ? (
            <button onClick={handleSemak} disabled={pilihan === null} className="btn-primary w-full">
              Semak Jawapan
            </button>
          ) : (
            <button onClick={handleTeruskan} className="btn-primary w-full">
              Lihat Penjelasan
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="Kuiz" showBack />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 animate-pulse space-y-4">
        <div className="h-5 bg-baby-blue/50 dark:bg-white/10 rounded w-1/4" />
        <div className="h-24 bg-baby-blue/50 dark:bg-white/10 rounded-2xl" />
        {[1,2,3,4].map(i => <div key={i} className="h-14 bg-baby-blue/50 dark:bg-white/10 rounded-xl" />)}
      </main>
    </div>
  )
}

function ErrorState({ error }: { error: string | null }) {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="Kuiz" showBack />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="card border-soft-peach/50">
          <p className="text-deep-charcoal/70 dark:text-soft-peach mb-3">{error ?? 'Ralat'}</p>
          <button onClick={() => navigate(-1)} className="btn-secondary">Kembali</button>
        </div>
      </main>
    </div>
  )
}