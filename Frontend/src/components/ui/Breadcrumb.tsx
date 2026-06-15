import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { useUIStore } from '../../stores'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const direction = useUIStore((s) => s.direction)
  const Chevron = direction === 'rtl' ? ChevronLeft : ChevronRight

  return (
    <nav className="flex items-center gap-2 text-sm text-dark/50 mb-6">
      <Link to="/" className="hover:text-gold transition-colors">
        <Home size={16} />
      </Link>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <Chevron size={14} className="text-dark/30" />
          {item.href ? (
            <Link to={item.href} className="hover:text-gold transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-dark/80 font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
