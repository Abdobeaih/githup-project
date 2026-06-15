import { Search, X } from 'lucide-react'

export default function SearchInput({
  value = '',
  onChange,
  placeholder = 'بحث...',
  className = '',
  autoFocus = false,
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={18}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/30 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 pr-12 text-dark outline-none focus:border-gold/60 transition-all placeholder:text-dark/30"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark/60 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
