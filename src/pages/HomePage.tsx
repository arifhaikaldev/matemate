import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchIndex } from '../lib/content'
import { getAllProgress } from '../lib/db'
import type { ContentIndex, SubtopikProgress } from '../types'
import { StatusBadge } from '../components/StatusBadge'
import { ProgressBar } from '../components/ProgressBar'
import { AppHeader } from '../components/AppHeader'

export function HomePage() {
  const [index, setIndex] = useState<ContentIndex | null>(null)
  const [progress, setProgress] = useState<Record<string, SubtopikProgress>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        const [idx, prog] = await Promise.all([fetchIndex(), getAllProgress()])
        setIndex(idx)
        const progMap: Record<string, SubtopikProgress> = {}
        for (const p of prog) progMap[p.id] = p
        setProgress(progMap)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ralat tidak diketahui')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const jumlahSubtopik = index?.subtopik.length ?? 0
  const selesai = Object.values(progress).filter((p) => p.status === 'selesai').length
  const progressKeseluruhan = jumlahSubtopik > 0 ? Math.round((selesai / jumlahSubtopik) * 100) : 0

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk="MateMate T4">
        <span className="text-xs font-bold text-duo-gray">
          {selesai}/{jumlahSubtopik}
        </span>
      </AppHeader>

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-6 space-y-5">
        <div className="rounded-2xl bg-gradient-to-br from-duo-blue to-duo-blue-dark text-white p-6 shadow-lg">
          <p className="text-white/80 text-sm font-bold">Matematik Tingkatan 4 KSSM</p>
          <h2 className="text-2xl font-black mt-1">Selamat Datang!</h2>
          <p className="text-white/80 text-sm mt-1 leading-relaxed">
            Pilih subtopik untuk mula belajar. Baca nota, jawab kuiz, dan dapat penjelasan segera.
          </p>
          {jumlahSubtopik > 0 && (
            <div className="mt-5 space-y-1">
              <div className="flex justify-between text-xs text-white/80 font-bold">
                <span>Kemajuan Keseluruhan</span>
                <span>{progressKeseluruhan}%</span>
              </div>
              <div className="h-3 w-full bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progressKeseluruhan}%` }}
                />
              </div>
              <p className="text-white/70 text-xs font-medium">{selesai} daripada {jumlahSubtopik} subtopik selesai</p>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2.5 px-5 py-3.5 bg-duo-orange-light/50 dark:bg-duo-orange/10 border-2 border-duo-orange/30 dark:border-duo-orange/20 rounded-2xl text-sm font-medium text-duo-charcoal/70 dark:text-duo-orange">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Data kemajuan disimpan di peranti ini sahaja.</span>
        </div>

        <section>
          <h2 className="text-xs font-bold text-duo-gray uppercase tracking-widest mb-4">
            Senarai Subtopik
          </h2>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-duo-gray-light/50 dark:bg-white/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-duo-gray-light/50 dark:bg-white/10 rounded w-1/4" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="card">
              <p className="text-duo-charcoal/70 dark:text-duo-peach text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-3">
              {index?.subtopik.map((s, idx) => {
                const p = progress[s.id]
                const status = p?.status ?? 'belum_mula'
                const skor = p?.skor_terakhir ?? null
                const attempt = p?.attempt ?? 0

                return (
                  <button
                    key={s.id}
                    onClick={() => navigate(`/nota/${s.id}`)}
                    className="card w-full text-left hover:border-duo-blue hover:shadow-md transition-all duration-150 active:scale-[0.98] group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-duo-blue-light dark:bg-duo-blue/20 text-duo-blue-dark dark:text-duo-blue text-xs font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h3 className="font-bold text-duo-charcoal dark:text-gray-100 text-sm leading-snug truncate group-hover:text-duo-blue-dark dark:group-hover:text-duo-blue transition-colors">
                            {s.tajuk_subtopik}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 pl-10">
                          <StatusBadge status={status} />
                          {attempt > 0 && (
                            <span className="text-xs font-medium text-duo-gray">
                              {attempt}x cuba
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-1">
                        {skor !== null && (
                          <span
                            className={`text-lg font-black ${
                              skor >= 80
                                ? 'text-duo-green-dark dark:text-duo-green'
                                : skor >= 50
                                ? 'text-duo-orange'
                                : 'text-duo-red'
                            }`}
                          >
                            {skor}%
                          </span>
                        )}
                        <svg className="w-4 h-4 text-duo-gray group-hover:text-duo-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    {skor !== null && (
                      <div className="mt-3 pl-10">
                        <ProgressBar
                          nilai={skor}
                          warna={skor >= 80 ? 'green' : skor >= 50 ? 'yellow' : 'red'}
                        />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="text-center py-4 text-xs font-medium text-duo-gray">
        MateMate T4 · Matematik KSSM
      </footer>
    </div>
  )
}