import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { fetchIndex, fetchSubtopik } from '../lib/content'
import { getProgress, saveProgress } from '../lib/db'
import type { Subtopik } from '../types'
import { kiraSkor, kiraSubKemahiran, janaCadangan } from '../lib/recommendation'
import { ProgressBar } from '../components/ProgressBar'
import { AppHeader } from '../components/AppHeader'

interface LocationState {
  jawapan: Record<string, number>
}

export function KeputusanPage() {
  const { subtopikId } = useParams<{ subtopikId: string }>()
  const location = useLocation()
  const state = location.state as LocationState | null
  const navigate = useNavigate()

  const [subtopik, setSubtopik] = useState<Subtopik | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subtopikSeterusnyaId, setSubtopikSeterusnyaId] = useState<string | undefined>()

  useEffect(() => {
    if (!subtopikId || !state) return

    async function load() {
      try {
        const idx = await fetchIndex()
        const entryIdx = idx.subtopik.findIndex((s) => s.id === subtopikId)
        const entry = idx.subtopik[entryIdx]
        if (!entry) throw new Error('Subtopik tidak dijumpai')

        const data = await fetchSubtopik(entry.fail)
        setSubtopik(data)

        const next = idx.subtopik[entryIdx + 1]
        if (next) setSubtopikSeterusnyaId(next.id)

        const jawapanData = (location.state as LocationState | null)?.jawapan ?? {}
        const skor = kiraSkor(data.soalan, jawapanData)
        const prog = await getProgress(subtopikId!)
        const attempt = (prog?.attempt ?? 0) + 1

        await saveProgress({
          id: subtopikId!,
          status: 'selesai',
          skor_terakhir: skor,
          attempt,
          jawapan: jawapanData,
          masa_kemaskini: Date.now(),
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ralat')
      } finally {
        setLoading(false)
      }
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtopikId])

  if (loading) return <LoadingState />
  if (error || !subtopik || !state) return <ErrorState error={error} />

  const jawapan = state.jawapan
  const skor = kiraSkor(subtopik.soalan, jawapan)
  const subStats = kiraSubKemahiran(subtopik.soalan, jawapan)
  const cadangan = janaCadangan(skor, subStats, subtopikSeterusnyaId)

  const betulCount = subtopik.soalan.filter((s) => jawapan[s.id] === s.jawapan_betul).length
  const jumlah = subtopik.soalan.length

  const skorColor = skor >= 80 ? 'text-duo-green-dark dark:text-duo-green' : skor >= 50 ? 'text-duo-orange' : 'text-duo-red'

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="Keputusan" showBack backTo="/" />

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8 space-y-5">
        <div className="card text-center space-y-5">
          <p className="text-sm font-bold text-duo-gray">{subtopik.tajuk_subtopik}</p>

          <div className="flex flex-col items-center gap-1">
            <div className="relative mb-2">
              <svg className="w-28 h-28" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#E5E5E5" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="54"
                  fill="none"
                  stroke={skor >= 80 ? '#58CC02' : skor >= 50 ? '#FF9600' : '#FF4B4B'}
                  strokeWidth="8"
                  strokeDasharray={`${(skor / 100) * 339.292} 339.292`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  className="transition-all duration-1000"
                />
                <text x="60" y="60" textAnchor="middle" dominantBaseline="central"
                  className={`text-3xl font-black ${skorColor}`}
                  fill="currentColor"
                >
                  {skor}%
                </text>
              </svg>
            </div>
            <p className="font-bold text-duo-charcoal/60 dark:text-gray-400">
              {betulCount} betul daripada {jumlah} soalan
            </p>
          </div>

          <div className={`font-black text-sm px-5 py-3 rounded-2xl ${
            skor >= 80 ? 'bg-duo-green-light text-duo-green-dark'
            : skor >= 50 ? 'bg-duo-orange-light text-duo-orange'
            : 'bg-duo-red-light text-duo-red'
          }`}>
            {skor >= 80 ? 'Cemerlang! Anda faham subtopik ini.' : skor >= 50 ? 'Usaha yang baik! Ada ruang untuk penambahbaikan.' : 'Jangan putus asa. Cuba semula selepas baca nota.'}
          </div>
        </div>

        {Object.keys(subStats).length > 0 && (
          <div className="card space-y-4">
            <h2 className="text-sm font-black text-duo-charcoal dark:text-gray-100">Prestasi Mengikut Sub-Kemahiran</h2>
            <div className="space-y-3">
              {Object.entries(subStats).map(([sk, { betul, jumlah: jml }]) => {
                const skSkor = Math.round((betul / jml) * 100)
                const warna = skSkor >= 80 ? 'green' : skSkor >= 50 ? 'yellow' : 'red'
                const isLemah = skSkor < 60
                return (
                  <div key={sk} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-duo-charcoal/70 dark:text-gray-300 capitalize">
                          {sk.replace(/_/g, ' ')}
                        </span>
                        {isLemah && <span className="badge bg-duo-red-light dark:bg-duo-red/20 text-duo-red">Lemah</span>}
                      </div>
                      <span className={`text-sm font-black ${warna === 'green' ? 'text-duo-green-dark dark:text-duo-green' : warna === 'yellow' ? 'text-duo-orange' : 'text-duo-red'}`}>
                        {betul}/{jml}
                      </span>
                    </div>
                    <ProgressBar nilai={skSkor} warna={warna} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className={`rounded-2xl border-2 p-5 space-y-3 ${
          cadangan.jenis === 'teruskan' ? 'border-duo-green dark:border-duo-green bg-duo-green-light dark:bg-duo-green/10'
          : cadangan.jenis === 'latihan_fokus' ? 'border-duo-orange dark:border-duo-orange/30 bg-duo-orange-light dark:bg-duo-orange/10'
          : 'border-duo-blue dark:border-duo-blue/30 bg-duo-blue-light dark:bg-duo-blue/10'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              cadangan.jenis === 'teruskan' ? 'bg-duo-green'
              : cadangan.jenis === 'latihan_fokus' ? 'bg-duo-orange'
              : 'bg-duo-blue'
            }`}>
              {cadangan.jenis === 'teruskan' ? (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              ) : cadangan.jenis === 'latihan_fokus' ? (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="font-black text-duo-charcoal dark:text-gray-100 text-sm">Cadangan Seterusnya</h3>
              <p className="text-sm font-semibold text-duo-charcoal/70 dark:text-gray-300 mt-0.5">{cadangan.mesej}</p>
            </div>
          </div>

          {cadangan.kemahiran_lemah.length > 0 && (
            <div className="pl-13">
              <p className="text-xs font-bold text-duo-charcoal/50 dark:text-gray-400 mb-1">Sub-kemahiran perlu diperbaiki:</p>
              <div className="flex flex-wrap gap-1.5">
                {cadangan.kemahiran_lemah.map((k) => (
                  <span key={k} className="badge bg-duo-red-light dark:bg-duo-red/20 text-duo-red capitalize">{k.replace(/_/g, ' ')}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card space-y-3">
          <h2 className="text-sm font-black text-duo-charcoal dark:text-gray-100">Ringkasan Soalan</h2>
          <div className="space-y-2">
            {subtopik.soalan.map((s, i) => {
              const pelajarJawapan = jawapan[s.id]
              const isBetul = pelajarJawapan === s.jawapan_betul
              return (
                <div key={s.id} className={`flex items-start gap-3 p-3 rounded-2xl ${isBetul ? 'bg-duo-green-light' : 'bg-duo-red-light'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${isBetul ? 'bg-duo-green' : 'bg-duo-red'}`}>
                    {isBetul ? (
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-duo-charcoal/80 dark:text-gray-200">S{i + 1}: {s.soalan}</p>
                    {!isBetul && (
                      <div className="mt-1 text-xs space-y-0.5">
                        <p className="text-duo-red font-bold">
                          Anda: {pelajarJawapan !== undefined ? s.pilihan[pelajarJawapan] : 'Tiada'}
                        </p>
                        <p className="text-duo-green-dark dark:text-duo-green font-bold">
                          Betul: {s.pilihan[s.jawapan_betul]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="h-8" />
      </main>

      <div className="sticky bottom-0 z-10 bg-white dark:bg-duo-charcoal border-t-2 border-duo-gray-light dark:border-white/10 px-5 py-4">
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            onClick={() => navigate(`/kuiz/${subtopikId}`)}
            className="btn-secondary flex-1"
          >
            Cuba Semula
          </button>
          {cadangan.jenis === 'teruskan' && subtopikSeterusnyaId ? (
            <button
              onClick={() => navigate(`/nota/${subtopikSeterusnyaId}`)}
              className="btn-primary flex-1"
            >
              Subtopik Seterusnya
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="btn-primary flex-1"
            >
              Halaman Utama
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
      <AppHeader tajuk="Keputusan" showBack backTo="/" />
      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8 animate-pulse space-y-4">
        <div className="h-48 bg-duo-gray-light/50 dark:bg-white/10 rounded-2xl" />
        <div className="h-32 bg-duo-gray-light/50 dark:bg-white/10 rounded-2xl" />
      </main>
    </div>
  )
}

function ErrorState({ error }: { error: string | null }) {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="Keputusan" showBack backTo="/" />
      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8">
        <div className="card">
          <p className="text-duo-charcoal/70 dark:text-duo-peach mb-3">{error ?? 'Ralat memuat keputusan'}</p>
          <button onClick={() => navigate('/')} className="btn-secondary">Halaman Utama</button>
        </div>
      </main>
    </div>
  )
}