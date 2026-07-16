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

  const [langkahTerpapar, setLangkahTerpapar] = useState(0)
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

  const startAnimation = useCallback(() => {
    if (!currentSoalan || ttsStartedRef.current) return
    ttsStartedRef.current = true

    const langkah = currentSoalan.langkah
    let step = 0

    setLangkahTerpapar(1)

    if (tersedia === false || muted) {
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

    const penjelasan = currentSoalan.penjelasan
    const totalLangkah = langkah.length
    const charsPerStep = Math.floor(penjelasan.length / totalLangkah)

    baca(
      penjelasan,
      currentSoalan.audio_file || undefined,
      (charIndex) => {
        const newStep = Math.min(
          Math.floor(charIndex / charsPerStep) + 1,
          totalLangkah
        )
        setLangkahTerpapar((prev) => Math.max(prev, newStep))
      },
      () => {
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
      navigate(`/kuiz-lanjut/${subtopikId}/${nextIdx}`, {
        state: { jawapan: state.jawapan },
      })
    } else {
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
        {tersedia && (
          <button
            onClick={() => { toggleMute(); ttsStartedRef.current = false }}
            className={`p-2 rounded-xl transition-colors ${
              muted
                ? 'text-deep-charcoal/40 dark:text-gray-400 hover:bg-baby-blue dark:hover:bg-white/5'
                : 'text-sky-blue bg-baby-blue dark:bg-sky-blue/20 hover:bg-sky-blue-light dark:hover:bg-sky-blue/30'
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
        <div className={`rounded-xl border-2 p-5 ${betul ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-soft-peach bg-soft-peach-light dark:bg-soft-peach/10'}`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{betul ? '✅' : '💪'}</span>
            <div>
              <p className={`font-bold text-lg ${betul ? 'text-green-700 dark:text-green-300' : 'text-deep-charcoal/70 dark:text-soft-peach'}`}>
                {betul ? 'Jawapan Betul!' : 'Jawapan Salah'}
              </p>
              {!betul && (
                <p className="text-sm text-deep-charcoal/60 dark:text-gray-400">
                  Jawapan betul: <strong>{currentSoalan.pilihan[currentSoalan.jawapan_betul]}</strong>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="card-white">
          <p className="text-xs font-semibold text-deep-charcoal/50 dark:text-gray-500 uppercase tracking-wider mb-2">Soalan</p>
          <p className="text-sm text-deep-charcoal/70 dark:text-gray-300">{currentSoalan.soalan}</p>
        </div>

        <div className="card-white space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-sky-blue-dark dark:text-sky-blue uppercase tracking-wider">
              Langkah Penyelesaian
            </p>
            {tersedia && !muted && !selesaiAnimasi && (
              <div className="flex items-center gap-1.5 text-xs text-sky-blue dark:text-sky-blue">
                <span className="flex gap-0.5">
                  <span className="w-1 h-3 bg-sky-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-3 bg-sky-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-3 bg-sky-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                    ? 'bg-sky-blue text-white'
                    : 'bg-baby-blue/50 dark:bg-white/10 text-deep-charcoal/40 dark:text-gray-400'
                }`}>
                  {i + 1}
                </span>
                <p className="text-sm text-deep-charcoal/80 dark:text-gray-200 leading-relaxed flex-1">
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

      <div className="sticky bottom-0 z-10 bg-white/95 dark:bg-deep-charcoal/95 backdrop-blur border-t border-baby-blue/50 dark:border-white/5 px-4 py-4">
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
        <div className="h-20 bg-baby-blue/50 dark:bg-white/10 rounded-2xl" />
        <div className="h-32 bg-baby-blue/50 dark:bg-white/10 rounded-2xl" />
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
        <div className="card border-soft-peach/50">
          <p className="text-deep-charcoal/70 dark:text-soft-peach mb-3">{error ?? 'Ralat'}</p>
          <button onClick={() => navigate(-1)} className="btn-secondary">Kembali</button>
        </div>
      </main>
    </div>
  )
}