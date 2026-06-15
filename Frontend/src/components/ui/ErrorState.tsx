import React from 'react'
import { RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-400 mb-4">
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <h3 className="text-lg font-bold text-dark mb-2">Error</h3>
    <p className="text-dark/50 text-sm max-w-sm mb-6">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark text-white text-sm font-bold hover:bg-darkLight transition-all"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    )}
  </div>
)
