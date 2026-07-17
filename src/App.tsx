import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { NotaPage } from './pages/NotaPage'
import { KuizPage } from './pages/KuizPage'
import { KuizLanjutPage } from './pages/KuizLanjutPage'
import { PenjelasanPage } from './pages/PenjelasanPage'
import { KeputusanPage } from './pages/KeputusanPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nota/:subtopikId" element={<NotaPage />} />
        {/* First question — fresh start */}
        <Route path="/kuiz/:subtopikId" element={<KuizPage />} />
        {/* Subsequent questions — carries accumulated answers */}
        <Route path="/kuiz-lanjut/:subtopikId/:soalanIdx" element={<KuizLanjutPage />} />
        {/* Explanation for a question */}
        <Route path="/penjelasan/:subtopikId/:soalanIdx" element={<PenjelasanPage />} />
        {/* Result summary */}
        <Route path="/keputusan/:subtopikId" element={<KeputusanPage />} />
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
        <a href="/" className="btn-primary inline-flex">Kembali ke Halaman Utama</a>
      </div>
    </div>
  )
}
