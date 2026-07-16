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
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-deep-charcoal/95 backdrop-blur border-b border-baby-blue/50 dark:border-white/5">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-xl text-deep-charcoal/60 dark:text-gray-400 hover:bg-baby-blue dark:hover:bg-white/5 transition-colors"
            aria-label="Kembali"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="flex-1 text-base font-bold text-deep-charcoal dark:text-gray-100 truncate">{tajuk}</h1>
        {children}
        <DarkModeToggle />
      </div>
    </header>
  )
}