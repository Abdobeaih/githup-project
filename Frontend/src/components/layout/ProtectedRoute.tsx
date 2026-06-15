import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores'
import type { UserRole } from '../../types'

interface ProtectedRouteProps {
  children?: React.ReactNode
  roles?: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { isAuthenticated, role, loading } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream/30">
        <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={`/join?redirect=${encodeURIComponent(location.pathname.slice(1) + location.search)}`} state={{ from: location }} replace />
  }

  if (roles && role && !roles.includes(role)) {
    const redirectMap: Record<string, string> = {
      USER: '/dashboard',
      COMPANY_ADMIN: '/dashboard/company',
      ADMIN: '/dashboard/admin',
      SUPER_ADMIN: '/dashboard/admin',
    }
    return <Navigate to={redirectMap[role] || '/'} replace />
  }

  return <>{children}</>
}
