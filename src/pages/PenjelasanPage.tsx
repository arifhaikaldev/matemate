import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { fetchIndex, fetchSubtopik } from '../lib/content'
import type { Subtopik, Soalan } from '../types'
import { useTTS } from '../hooks/useTTS'
import { AppHeader } from '../components/AppHeader'

interface LocationState {
  jawapan: Record<string, number>
  semasaIdx: number
  jumlah: number
}

export function PenjelasanPage() {
  const { subtopikId, soalanIdx } = useParams<{ subtopikId: string; soalanIdx: string }>()
  const location = useLocation()
  const state = location.state as LocationState | null

  const [subtopik, setSubtopik] = useState<Subtopik | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Step animation state
  const [langkahTerpapar, setLangkahTerpapar] = useState(0) // how many steps shown (0 = none yet)
  const [selesaiAnimasi, setSelesaiAnimasi] = useState(false)

  const navigate = useNavigate()
  const { tersedia, muted, toggleMute, baca, stop } = useTTS()
  const ttsStartedRef = useRef(false)

  const soalanIdxNum = parseInt(soalanIdx ?? '0', 10)

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

  const currentSoalan: Soalan | undefined = subtopik?.soalan[soalanIdxNum]

  // Auto-start TTS and step animation once loaded
  const startAnimation = useCallback(() => {
    if (!currentSoalan || ttsStartedRef.current) return
    ttsStartedRef.current = true

    const langkah = currentSoalan.langkah
    let step = 0

    // Show first step immediately
    setLangkahTerpapar(1)

    if (tersedia === false || muted) {
      // No TTS: auto-advance steps with setTimeout
      const advance = () => {
        step++
        if (step < langkah.length) {
          setLangkahTerpapar(step + 1)
          setTimeout(advance, 1800)
        } else {
          setSelesaiAnimasi(true)
        }
      }
      setTimeout(advance, 1800)
      return
    }

    // With TTS: use boundary events to sync steps with speech
    // We embed step markers in the text using character positions
    // Simpler: speak penjelasan and show steps progressively by word boundary
    const penjelasan = currentSoalan.penjelasan
    const totalLangkah = langkah.length
    const charsPerStep = Math.floor(penjelasan.length / totalLangkah)

    baca(
      penjelasan,
      currentSoalan.audio_file || undefined,
      (charIndex) => {
        // Show next step based on how far through speech we are
        const newStep = Math.min(
          Math.floor(charIndex / charsPerStep) + 1,
          totalLangkah
        )
        setLangkahTerpapar((prev) => Math.max(prev, newStep))
      },
      () => {
        // TTS ended — show all steps
        setLangkahTerpapar(totalLangkah)
        setSelesaiAnimasi(true)
      }
    )
  }, [currentSoalan, tersedia, muted, baca])

  useEffect(() => {
    if (!loading && currentSoalan && tersedia !== null) {
      startAnimation()
    }
    return () => { stop() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, currentSoalan?.id, tersedia])

  const handleTeruskan = () => {
    stop()
    if (!state || !subtopik) return

    const jumlah = state.jumlah
    const nextIdx = soalanIdxNum + 1

    if (nextIdx < jumlah) {
      // Go to next question with accumulated answers
      navigate(`/kuiz-lanjut/${subtopikId}/${nextIdx}`, {
        state: { jawapan: state.jawapan },
      })
    } else {
      // All questions done — go to result
      navigate(`/keputusan/${subtopikId}`, {
        state: { jawapan: state.jawapan },
      })
    }
  }

  if (loading) return <LoadingState />
  if (error || !currentSoalan || !state) return <ErrorState error={error} />

  const jawapanPelajar = state.jawapan[currentSoalan.id]
  const betul = jawapanPelajar === currentSoalan.jawapan_betul
  const isLastSoalan = soalanIdxNum + 1 >= state.jumlah

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="Penjelasan" showBack>
        {/* Mute toggle — only show if TTS is available */}
        {tersedia && (
          <button
            onClick={() => { toggleMute(); ttsStartedRef.current = false }}
            className={`p-2 rounded-lg transition-colors ${
              muted
                ? 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50'
            }`}
            aria-label={muted ? 'Hidupkan suara' : 'Matikan suara'}
          >
            {muted ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-3.536-9.536a5 5 0 000 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        )}
      </AppHeader>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
        {/* Result banner */}
        <div className={`card border-2 ${betul ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{betul ? '✅' : '❌'}</span>
            <div>
              <p className={`font-bold text-lg ${betul ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                {betul ? 'Jawapan Betul!' : 'Jawapan Salah'}
              </p>
              {!betul && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Jawapan betul: <strong>{currentSoalan.pilihan[currentSoalan.jawapan_betul]}</strong>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Question recap */}
        <div className="card">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Soalan</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{currentSoalan.soalan}</p>
        </div>

        {/* Step-by-step animation */}
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              Langkah Penyelesaian
            </p>
            {tersedia && !muted && !selesaiAnimasi && (
              <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
                <span className="flex gap-0.5">
                  <span className="w-1 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                <span>Sedang membaca...</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {currentSoalan.langkah.map((langkah, i) => (
              <div
                key={i}
                className={`flex gap-3 transition-all duration-500 ${
                  i < langkahTerpapar
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                  i < langkahTerpapar
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}>
                  {i + 1}
                </span>
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed flex-1">
                  {/* Render bold markers */}
                  {langkah.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                    part.startsWith('**') && part.endsWith('**') ? (
                      <strong key={j}>{part.slice(2, -2)}</strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Manual advance button while animating */}
          {!selesaiAnimasi && (
            <button
              onClick={() => {
                const total = currentSoalan.langkah.length
                if (langkahTerpapar < total) {
                  setLangkahTerpapar((p) => Math.min(p + 1, total))
                } else {
                  setSelesaiAnimasi(true)
                  stop()
                }
              }}
              className="btn-secondary text-sm w-full mt-2"
            >
              {langkahTerpapar < currentSoalan.langkah.length ? 'Langkah Seterusnya →' : 'Selesai'}
            </button>
          )}
        </div>

        <div className="h-24" />
      </main>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-t border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleTeruskan}
            className="btn-primary w-full"
          >
            {isLastSoalan ? (
              <>
                Lihat Keputusan
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            ) : (
              <>
                Soalan Seterusnya
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="Penjelasan" showBack />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 animate-pulse space-y-4">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </main>
    </div>
  )
}

function ErrorState({ error }: { error: string | null }) {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="Penjelasan" showBack />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="card border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="text-red-700 dark:text-red-300 mb-3">{error ?? 'Ralat'}</p>
          <button onClick={() => navigate(-1)} className="btn-secondary">Kembali</button>
        </div>
      </main>
    </div>
  )
}
