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

  const skorColor = skor >= 80 ? 'text-green-600 dark:text-green-400' : skor >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
  const skorBarColor = skor >= 80 ? 'green' : skor >= 50 ? 'yellow' : 'red'

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="Keputusan" showBack backTo="/" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
        {/* Score card */}
        <div className="card-white text-center space-y-5">
          <p className="text-sm text-deep-charcoal/50 dark:text-gray-400 font-medium">{subtopik.tajuk_subtopik}</p>
          <div className="flex flex-col items-center gap-1">
            <span className={`text-6xl font-black ${skorColor}`}>{skor}%</span>
            <p className="text-deep-charcoal/60 dark:text-gray-400">
              {betulCount} betul daripada {jumlah} soalan
            </p>
          </div>
          <ProgressBar nilai={skor} warna={skorBarColor} />

          <div className={`text-sm font-medium px-5 py-3 rounded-xl ${
            skor >= 80 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
            : skor >= 50 ? 'bg-soft-peach-light dark:bg-soft-peach/10 text-deep-charcoal/70 dark:text-soft-peach'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}>
            {skor >= 80 ? '🎉 Cemerlang! Anda faham subtopik ini.' : skor >= 50 ? '👍 Usaha yang baik! Ada ruang untuk penambahbaikan.' : '💪 Jangan putus asa. Cuba semula selepas baca nota.'}
          </div>
        </div>

        {/* Sub-skill breakdown */}
        {Object.keys(subStats).length > 0 && (
          <div className="card-white space-y-4">
            <h2 className="text-sm font-bold text-deep-charcoal dark:text-gray-100">Prestasi Mengikut Sub-Kemahiran</h2>
            <div className="space-y-3">
              {Object.entries(subStats).map(([sk, { betul, jumlah: jml }]) => {
                const skSkor = Math.round((betul / jml) * 100)
                const warna = skSkor >= 80 ? 'green' : skSkor >= 50 ? 'yellow' : 'red'
                const isLemah = skSkor < 60
                return (
                  <div key={sk} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-deep-charcoal/70 dark:text-gray-300 capitalize">
                          {sk.replace(/_/g, ' ')}
                        </span>
                        {isLemah && <span className="badge bg-soft-peach-light dark:bg-soft-peach/20 text-deep-charcoal/60 dark:text-soft-peach">Lemah</span>}
                      </div>
                      <span className={`text-sm font-bold ${warna === 'green' ? 'text-green-600 dark:text-green-400' : warna === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
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

        {/* Recommendation */}
        <div className={`rounded-xl border-2 p-5 space-y-3 ${
          cadangan.jenis === 'teruskan' ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10'
          : cadangan.jenis === 'latihan_fokus' ? 'border-soft-peach dark:border-soft-peach/30 bg-soft-peach-light dark:bg-soft-peach/10'
          : 'border-baby-blue dark:border-sky-blue/30 bg-baby-blue/30 dark:bg-sky-blue/10'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {cadangan.jenis === 'teruskan' ? '🚀' : cadangan.jenis === 'latihan_fokus' ? '🎯' : '📖'}
            </span>
            <div>
              <h3 className="font-bold text-deep-charcoal dark:text-gray-100 text-sm">Cadangan Seterusnya</h3>
              <p className="text-sm text-deep-charcoal/70 dark:text-gray-300 mt-0.5">{cadangan.mesej}</p>
            </div>
          </div>

          {cadangan.kemahiran_lemah.length > 0 && (
            <div className="pl-9">
              <p className="text-xs text-deep-charcoal/50 dark:text-gray-400 mb-1">Sub-kemahiran perlu diperbaiki:</p>
              <div className="flex flex-wrap gap-1.5">
                {cadangan.kemahiran_lemah.map((k) => (
                  <span key={k} className="badge bg-soft-peach-light dark:bg-soft-peach/20 text-deep-charcoal/60 dark:text-soft-peach capitalize">{k.replace(/_/g, ' ')}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Per-question summary */}
        <div className="card-white space-y-3">
          <h2 className="text-sm font-bold text-deep-charcoal dark:text-gray-100">Ringkasan Soalan</h2>
          <div className="space-y-2">
            {subtopik.soalan.map((s, i) => {
              const pelajarJawapan = jawapan[s.id]
              const isBetul = pelajarJawapan === s.jawapan_betul
              return (
                <div key={s.id} className={`flex items-start gap-3 p-3 rounded-xl ${isBetul ? 'bg-green-50 dark:bg-green-900/10' : 'bg-soft-peach-light dark:bg-soft-peach/10'}`}>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${isBetul ? 'bg-green-500 text-white' : 'bg-soft-peach text-deep-charcoal/60'}`}>
                    {isBetul ? '✓' : '✗'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-deep-charcoal/80 dark:text-gray-200 font-medium">S{i + 1}: {s.soalan}</p>
                    {!isBetul && (
                      <div className="mt-1 text-xs space-y-0.5">
                        <p className="text-red-600 dark:text-red-400">
                          Jawapan anda: {pelajarJawapan !== undefined ? s.pilihan[pelajarJawapan] : 'Tiada jawapan'}
                        </p>
                        <p className="text-green-600 dark:text-green-400">
                          Jawapan betul: {s.pilihan[s.jawapan_betul]}
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

      {/* Action buttons */}
      <div className="sticky bottom-0 z-10 bg-white/95 dark:bg-deep-charcoal/95 backdrop-blur border-t border-baby-blue/50 dark:border-white/5 px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
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
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 animate-pulse space-y-4">
        <div className="h-48 bg-baby-blue/50 dark:bg-white/10 rounded-2xl" />
        <div className="h-32 bg-baby-blue/50 dark:bg-white/10 rounded-2xl" />
      </main>
    </div>
  )
}

function ErrorState({ error }: { error: string | null }) {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="Keputusan" showBack backTo="/" />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <div className="card border-soft-peach/50">
          <p className="text-deep-charcoal/70 dark:text-soft-peach mb-3">{error ?? 'Ralat memuat keputusan'}</p>
          <button onClick={() => navigate('/')} className="btn-secondary">Halaman Utama</button>
        </div>
      </main>
    </div>
  )
}