import { useNavigate } from 'react-router-dom'
import { DarkModeToggle } from './DarkModeToggle'

interface Props {
  tajuk: string
  showBack?: boolean
  backTo?: string
  children?: React.ReactNode
}

export function AppHeader({ tajuk, showBack = false, backTo, children }: Props) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (backTo) navigate(backTo)
    else navigate(-1)
  }

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-duo-charcoal border-b-2 border-duo-gray-light dark:border-white/10">
      <div className="max-w-lg mx-auto px-5 h-14 flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-xl text-duo-gray dark:text-gray-400 hover:bg-duo-gray-light/50 dark:hover:bg-white/10 transition-colors"
            aria-label="Kembali"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="flex-1 text-base font-black text-duo-charcoal dark:text-gray-100 truncate">{tajuk}</h1>
        {children}
        <DarkModeToggle />
      </div>
    </header>
  )
}