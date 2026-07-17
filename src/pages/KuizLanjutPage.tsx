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

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk={subtopik.tajuk_subtopik} showBack />

      <div className="h-2 bg-duo-gray-light dark:bg-white/10">
        <div className="h-full bg-duo-green transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-duo-gray uppercase tracking-widest">
            Soalan {semasaIdx + 1} / {jumlah}
          </span>
          <button
            onClick={() => navigate(`/nota/${subtopikId}`)}
            className="btn-ghost text-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Mula Semula
          </button>
        </div>

        <div className="text-center space-y-3">
          <p className="text-lg font-bold text-duo-charcoal dark:text-gray-100 leading-relaxed">
            {currentSoalan.soalan}
          </p>
          {currentSoalan.imej && (
            <div className="rounded-2xl overflow-hidden bg-duo-blue-light/50 dark:bg-white/5 border-2 border-duo-gray-light dark:border-white/10">
              <img src={currentSoalan.imej} alt="Rajah soalan" className="w-full object-contain max-h-48" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {currentSoalan.pilihan.map((opt, i) => {
            const isSelected = pilihan === i
            const isBetul = i === currentSoalan.jawapan_betul
            const showResult = answered

            let cls = 'relative flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-2xl border-2 font-bold text-sm transition-all duration-150 min-h-[100px] '

            if (!showResult) {
              cls += isSelected
                ? 'border-duo-green bg-duo-green-light text-duo-green-dark'
                : 'border-duo-gray-light dark:border-white/15 bg-white dark:bg-duo-charcoal text-duo-charcoal dark:text-gray-100 hover:border-duo-blue hover:bg-duo-blue-light/30 dark:hover:border-duo-blue/50'
            } else {
              if (isBetul) {
                cls += 'border-duo-green bg-duo-green-light text-duo-green-dark'
              } else if (isSelected && !isBetul) {
                cls += 'border-duo-red bg-duo-red-light text-duo-red'
              } else {
                cls += 'border-duo-gray-light/50 dark:border-white/5 bg-white dark:bg-duo-charcoal opacity-40'
              }
            }

            return (
              <button key={i} onClick={() => handlePilih(i)} disabled={answered} className={cls}>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                  !showResult
                    ? isSelected
                      ? 'bg-duo-green text-white'
                      : 'bg-duo-gray-light dark:bg-white/10 text-duo-gray dark:text-gray-400'
                    : isBetul
                    ? 'bg-duo-green text-white'
                    : isSelected
                    ? 'bg-duo-red text-white'
                    : 'bg-duo-gray-light dark:bg-white/10 text-duo-gray dark:text-gray-400'
                }`}>
                  {showResult && isBetul ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : showResult && isSelected && !isBetul ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    alphabet[i]
                  )}
                </span>
                <span className="text-center leading-snug">{opt}</span>
              </button>
            )
          })}
        </div>

        {answered && (
          <div className={`rounded-2xl border-2 p-5 text-center ${betul ? 'border-duo-green bg-duo-green-light' : 'border-duo-red bg-duo-red-light'}`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className={`text-lg font-black ${betul ? 'text-duo-green-dark' : 'text-duo-red'}`}>
                {betul ? 'Betul!' : 'Salah'}
              </span>
            </div>
            <p className={`text-sm font-medium ${betul ? 'text-duo-green-dark/70' : 'text-duo-red/70'}`}>
              {betul
                ? 'Bagus! Tekan "Lihat Penjelasan" untuk semak langkah.'
                : 'Jangan risau! Tekan "Lihat Penjelasan" untuk faham cara selesaikan.'}
            </p>
          </div>
        )}

        <div className="h-24" />
      </main>

      <div className="sticky bottom-0 z-10 bg-white dark:bg-duo-charcoal border-t-2 border-duo-gray-light dark:border-white/10 px-5 py-4">
        <div className="max-w-lg mx-auto">
          {!answered ? (
            <button onClick={handleSemak} disabled={pilihan === null} className="btn-primary w-full text-lg">
              Semak
            </button>
          ) : (
            <button onClick={handleTeruskan} className="btn-primary w-full text-lg">
              Lihat Penjelasan
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
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
      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8 animate-pulse space-y-4">
        <div className="h-5 bg-duo-gray-light/50 dark:bg-white/10 rounded w-1/3" />
        <div className="h-24 bg-duo-gray-light/50 dark:bg-white/10 rounded-2xl" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-duo-gray-light/50 dark:bg-white/10 rounded-2xl" />
          ))}
        </div>
      </main>
    </div>
  )
}

function ErrorState({ error }: { error: string | null }) {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="Kuiz" showBack />
      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8">
        <div className="card">
          <p className="text-duo-charcoal/70 dark:text-duo-peach mb-3">{error ?? 'Ralat'}</p>
          <button onClick={() => navigate(-1)} className="btn-secondary">Kembali</button>
        </div>
      </main>
    </div>
  )
}