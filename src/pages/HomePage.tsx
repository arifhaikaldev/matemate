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
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {selesai}/{jumlahSubtopik}
          </span>
        </div>
      </AppHeader>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Hero section */}
        <div className="card bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-md">
          <div className="space-y-1">
            <p className="text-blue-100 text-sm font-medium">Matematik Tingkatan 4 KSSM</p>
            <h2 className="text-xl font-bold">Selamat Datang!</h2>
            <p className="text-blue-100 text-sm">
              Pilih subtopik untuk mula belajar. Baca nota, jawab kuiz, dan dapat penjelasan segera.
            </p>
          </div>
          {jumlahSubtopik > 0 && (
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs text-blue-100">
                <span>Kemajuan Keseluruhan</span>
                <span>{progressKeseluruhan}%</span>
              </div>
              <div className="h-2 w-full bg-blue-500/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progressKeseluruhan}%` }}
                />
              </div>
              <p className="text-blue-100 text-xs">{selesai} daripada {jumlahSubtopik} subtopik selesai</p>
            </div>
          )}
        </div>

        {/* Notice */}
        <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-300">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Data kemajuan disimpan di peranti ini sahaja. Clear browser data akan memadam kemajuan anda.</span>
        </div>

        {/* Subtopik list */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Senarai Subtopik
          </h2>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="card border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
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
                    className="card w-full text-left hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-150 active:scale-[0.98] group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                            {s.tajuk_subtopik}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 pl-8">
                          <StatusBadge status={status} />
                          {attempt > 0 && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {attempt}x cuba
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-1">
                        {skor !== null && (
                          <span
                            className={`text-lg font-bold ${
                              skor >= 80
                                ? 'text-green-600 dark:text-green-400'
                                : skor >= 50
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-red-500 dark:text-red-400'
                            }`}
                          >
                            {skor}%
                          </span>
                        )}
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    {skor !== null && (
                      <div className="mt-3 pl-8">
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

      <footer className="text-center py-4 text-xs text-gray-400 dark:text-gray-600">
        MateMate T4 · Matematik KSSM · Data disimpan di peranti ini
      </footer>
    </div>
  )
}
