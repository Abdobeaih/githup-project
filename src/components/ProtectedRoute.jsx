import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'
import { USER_ROLES } from '../types/user'

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, role, loading } = useAuth()

  if (loading) return <LoadingSpinner />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect to the correct dashboard based on their actual role
    const dashboards = {
      [USER_ROLES.USER]: '/dashboard/user',
      [USER_ROLES.COMPANY]: '/dashboard/company',
      [USER_ROLES.ADMIN]: '/dashboard/admin',
    }
    return <Navigate to={dashboards[role] || '/'} replace />
  }

  return children
}
