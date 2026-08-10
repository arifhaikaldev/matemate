import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { NotaPage } from './pages/NotaPage'
import { KuizPage } from './pages/KuizPage'
import { KuizLanjutPage } from './pages/KuizLanjutPage'
import { PenjelasanPage } from './pages/PenjelasanPage'
import { KeputusanPage } from './pages/KeputusanPage'
import { Form1ChapterPage } from './pages/Form1ChapterPage'
import { Form1Bab2Page } from './pages/Form1Bab2Page'
import { Form1Bab3Page } from './pages/Form1Bab3Page'
import { Form1Bab6Page } from './pages/Form1Bab6Page'
import { LessonPage } from './pages/LessonPage'
import { AnimasiBab6Page } from './pages/AnimasiBab6Page'
import { PedagogiBab6Page } from './pages/PedagogiBab6Page'
import { InteractivePage } from './pages/InteractivePage'
import MathMateLesson from './components/MathMateLesson'
import bab61 from './data/bab6-1.json'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Tingkatan 4 — existing quiz system */}
        <Route path="/nota/:subtopikId" element={<NotaPage />} />
        <Route path="/kuiz/:subtopikId" element={<KuizPage />} />
        <Route path="/kuiz-lanjut/:subtopikId/:soalanIdx" element={<KuizLanjutPage />} />
        <Route path="/penjelasan/:subtopikId/:soalanIdx" element={<PenjelasanPage />} />
        <Route path="/keputusan/:subtopikId" element={<KeputusanPage />} />

        {/* Tingkatan 1 — EDS lesson system */}
        <Route path="/form1/bab1" element={<Form1ChapterPage />} />
        <Route path="/form1/bab2" element={<Form1Bab2Page />} />
<Route path="/form1/bab3" element={<Form1Bab3Page />} />
<Route path="/form1/bab6" element={<Form1Bab6Page />} />
<Route path="/lesson/:lessonId" element={<LessonPage />} />
<Route path="/animasi/bab6" element={<AnimasiBab6Page />} />
<Route path="/form1/bab6-pedagogi" element={<PedagogiBab6Page />} />

        {/* Prototype: 6.1 Lesson Builder */}
        <Route path="/prototype/bab6-1" element={<MathMateLesson data={bab61 as any} />} />

        {/* Interactive lessons (direct integration) */}
        <Route path="/interactive" element={<InteractivePage />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-5xl font-black text-duo-gray-light dark:text-white/10">404</p>
        <p className="text-duo-charcoal/60 dark:text-gray-400">Halaman tidak dijumpai.</p>
        <a href="/" className="btn-primary inline-flex">
          Kembali ke Halaman Utama
        </a>
      </div>
    </div>
  )
}
