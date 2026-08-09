import { type ReactNode } from 'react'

interface Props {
  children: ReactNode
  title?: string
  className?: string
}

export function VisualArea({ children, title, className = '' }: Props) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-100 dark:border-gray-800 p-4 flex items-center justify-center min-h-[280px] ${className}`}
    >
      <div className="w-full max-w-md">
        {title && (
          <p className="text-xs font-bold text-duo-gray mb-2 text-center">{title}</p>
        )}
        {children}
      </div>
    </div>
  )
}