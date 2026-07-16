import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchIndex, fetchSubtopik } from '../lib/content'
import { getProgress, saveProgress } from '../lib/db'
import type { Subtopik } from '../types'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { AppHeader } from '../components/AppHeader'

export function NotaPage() {
  const { subtopikId } = useParams<{ subtopikId: string }>()
  const [subtopik, setSubtopik] = useState<Subtopik | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

        // Mark as sedang_belajar if belum_mula
        const prog = await getProgress(subtopikId!)
        if (!prog || prog.status === 'belum_mula') {
          await saveProgress({
            id: subtopikId!,
            status: 'sedang_belajar',
            skor_terakhir: prog?.skor_terakhir ?? null,
            attempt: prog?.attempt ?? 0,
            jawapan: prog?.jawapan ?? {},
            masa_kemaskini: Date.now(),
          })
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ralat')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [subtopikId])

  const mulaKuiz = () => {
    navigate(`/kuiz/${subtopikId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader tajuk="Nota" showBack backTo="/" />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !subtopik) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader tajuk="Nota" showBack backTo="/" />
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
          <div className="card border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <p className="text-red-700 dark:text-red-300">{error ?? 'Kandungan tidak dijumpai'}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk={subtopik.tajuk_subtopik} showBack backTo="/" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
        {/* Sections */}
        {subtopik.nota.map((section, i) => (
          <div key={i} className="card space-y-3">
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              {section.tajuk}
            </h2>

            <MarkdownRenderer kandungan={section.kandungan} />

            {section.imej && (
              <div className="rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
                <img
                  src={section.imej}
                  alt={section.tajuk}
                  className="w-full object-contain max-h-64"
                  loading="lazy"
                />
              </div>
            )}

            {section.contoh && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2">
                  Contoh
                </p>
                <MarkdownRenderer kandungan={section.contoh} />
              </div>
            )}
          </div>
        ))}

        {/* CTA — spacer so button not blocked by bottom nav */}
        <div className="h-24" />
      </main>

      {/* Sticky bottom CTA */}
      <div className="sticky bottom-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-t border-gray-100 dark:border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={mulaKuiz}
            className="btn-primary w-full text-base"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Mula Kuiz ({subtopik.soalan.length} soalan)
          </button>
        </div>
      </div>
    </div>
  )
}
