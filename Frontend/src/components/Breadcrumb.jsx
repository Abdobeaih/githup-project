import { Link } from 'react-router-dom'
import { ChevronLeft, Home } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function Breadcrumb({ items }) {
  const { t } = useLanguage()
  
  return (
    <nav className="py-4 px-6 bg-dark/50 backdrop-blur-sm border-b border-gold/10">
      <div className="container mx-auto">
        <ol className="flex items-center gap-2 text-sm flex-wrap">
          <li>
            <Link to="/" className="flex items-center gap-1 text-goldLight hover:text-gold transition-colors">
              <Home size={14} />
              <span>{t('common', 'home')}</span>
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <ChevronLeft size={14} className="text-gold/50" />
              {item.href ? (
                <Link to={item.href} className="text-goldLight hover:text-gold transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gold font-semibold">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}
