import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchIndex, fetchSubtopik } from '../lib/content'
import type { Subtopik, Soalan } from '../types'
import { AppHeader } from '../components/AppHeader'

export function KuizPage() {
  const { subtopikId } = useParams<{ subtopikId: string }>()
  const [subtopik, setSubtopik] = useState<Subtopik | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Quiz state (first question only; subsequent questions use KuizLanjutPage)
  const semasaIdx = 0
  const [jawapan, setJawapan] = useState<Record<string, number>>({})
  const [pilihan, setPilihan] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!subtopikId) return
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
  const currentSoalan: Soalan = soalan[semasaIdx]
  const jumlah = soalan.length
  const progress = Math.round(((semasaIdx) / jumlah) * 100)

  const handlePilih = (idx: number) => {
    if (answered) return
    setPilihan(idx)
  }

  const handleSemak = () => {
    if (pilihan === null) return
    setAnswered(true)
    setJawapan((prev) => ({ ...prev, [currentSoalan.id]: pilihan }))
  }

  const handleTeruskan = () => {
    // Navigate to explanation
    const updatedJawapan = { ...jawapan, [currentSoalan.id]: pilihan! }
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
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {semasaIdx + 1}/{jumlah}
        </span>
      </AppHeader>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main ref={containerRef} className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
        {/* Question number */}
        <div className="flex items-center gap-2">
          <span className="badge badge-blue">Soalan {semasaIdx + 1}</span>
          {currentSoalan.sub_kemahiran && (
            <span className="badge badge-gray">{currentSoalan.sub_kemahiran.replace(/_/g, ' ')}</span>
          )}
        </div>

        {/* Question text */}
        <div className="card">
          <p className="text-base font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
            {currentSoalan.soalan}
          </p>
          {currentSoalan.imej && (
            <div className="mt-3 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
              <img
                src={currentSoalan.imej}
                alt="Rajah soalan"
                className="w-full object-contain max-h-48"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentSoalan.pilihan.map((opt, i) => {
            const isSelected = pilihan === i
            const isBetul = i === currentSoalan.jawapan_betul
            const showResult = answered

            let cls = 'w-full text-left px-4 py-3.5 rounded-xl border-2 font-medium text-sm transition-all duration-150 '

            if (!showResult) {
              cls += isSelected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
            } else {
              if (isBetul) {
                cls += 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              } else if (isSelected && !isBetul) {
                cls += 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              } else {
                cls += 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 opacity-50'
              }
            }

            return (
              <button
                key={i}
                onClick={() => handlePilih(i)}
                disabled={answered}
                className={cls}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    !showResult
                      ? isSelected
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-400'
                      : isBetul
                      ? 'border-green-500 bg-green-500 text-white'
                      : isSelected
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}>
                    {showResult && isBetul ? '✓' : showResult && isSelected && !isBetul ? '✗' : String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Feedback banner */}
        {answered && (
          <div className={`card border-2 ${betul ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
            <div className="flex items-center gap-2 mb-1">
              {betul ? (
                <>
                  <span className="text-2xl">✅</span>
                  <span className="font-bold text-green-700 dark:text-green-300">Betul! Bagus!</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">❌</span>
                  <span className="font-bold text-red-700 dark:text-red-300">Salah. Jangan risau!</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tekan "Lihat Penjelasan" untuk faham cara selesaikan soalan ini.
            </p>
          </div>
        )}

        {/* Spacer for sticky btn */}
        <div className="h-24" />
      </main>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-t border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          {!answered ? (
            <button
              onClick={handleSemak}
              disabled={pilihan === null}
              className="btn-primary w-full"
            >
              Semak Jawapan
            </button>
          ) : (
            <button
              onClick={handleTeruskan}
              className="btn-primary w-full"
            >
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
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl" />
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
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="card border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-300 mb-3">{error ?? 'Ralat memuat kuiz'}</p>
          <button onClick={() => navigate(-1)} className="btn-secondary">
            Kembali
          </button>
        </div>
      </main>
    </div>
  )
}
