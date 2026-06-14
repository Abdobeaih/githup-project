import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) {
  const { lang } = useLanguage()
  const isRtl = lang === 'ar'

  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const delta = 1
    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

    pages.push(1)
    if (rangeStart > 2) pages.push('...')
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)
    if (rangeEnd < totalPages - 1) pages.push('...')
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  const btnBase = 'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed'

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`${btnBase} bg-cream border border-gold/20 text-dark hover:bg-gold/10`}
      >
        {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {getPageNumbers().map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="text-dark/30 px-1">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} ${
              page === currentPage
                ? 'bg-gold text-white shadow-md shadow-gold/20'
                : 'bg-cream border border-gold/20 text-dark hover:bg-gold/10'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`${btnBase} bg-cream border border-gold/20 text-dark hover:bg-gold/10`}
      >
        {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </div>
  )
}
