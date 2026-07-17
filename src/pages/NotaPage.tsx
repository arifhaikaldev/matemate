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
        <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-duo-gray-light/50 dark:bg-white/10 rounded w-2/3" />
            <div className="h-4 bg-duo-gray-light/50 dark:bg-white/10 rounded w-full" />
            <div className="h-4 bg-duo-gray-light/50 dark:bg-white/10 rounded w-5/6" />
            <div className="h-4 bg-duo-gray-light/50 dark:bg-white/10 rounded w-4/6" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !subtopik) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader tajuk="Nota" showBack backTo="/" />
        <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8">
          <div className="card">
            <p className="text-duo-charcoal/70 dark:text-duo-peach">{error ?? 'Kandungan tidak dijumpai'}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader tajuk={subtopik.tajuk_subtopik} showBack backTo="/" />

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8 space-y-5">
        {subtopik.nota.map((section, i) => (
          <div key={i} className="card space-y-3">
            <h2 className="text-base font-black text-duo-charcoal dark:text-gray-100 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-duo-blue text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              {section.tajuk}
            </h2>

            <MarkdownRenderer kandungan={section.kandungan} />

            {section.imej && (
              <div className="rounded-2xl overflow-hidden bg-duo-blue-light/30 dark:bg-white/5 border-2 border-duo-gray-light dark:border-white/10">
                <img
                  src={section.imej}
                  alt={section.tajuk}
                  className="w-full object-contain max-h-64"
                  loading="lazy"
                />
              </div>
            )}

            {section.contoh && (
              <div className="bg-duo-orange-light/50 dark:bg-duo-orange/10 border-2 border-duo-orange/30 dark:border-duo-orange/20 rounded-2xl p-5">
                <p className="text-xs font-bold text-duo-orange uppercase tracking-widest mb-2">
                  Contoh
                </p>
                <MarkdownRenderer kandungan={section.contoh} />
              </div>
            )}
          </div>
        ))}

        <div className="h-24" />
      </main>

      <div className="sticky bottom-0 z-10 bg-white dark:bg-duo-charcoal border-t-2 border-duo-gray-light dark:border-white/10 px-5 py-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={mulaKuiz}
            className="btn-primary w-full text-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Mula Kuiz ({subtopik.soalan.length} soalan)
          </button>
        </div>
      </div>
    </div>
  )
}