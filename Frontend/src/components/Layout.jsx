import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useAuth } from '../context/AuthContext'
import { USER_ROLES } from '../types/user'
import { prefetchPlansWithFeatures } from '../services/subscriptionsService'

export default function Layout({ children }) {
  const { isAuthenticated, role } = useAuth()

  // Prefetch packages data during browser idle time for logged-in users
  useEffect(() => {
    if (!isAuthenticated || role !== USER_ROLES.USER) return

    const runPrefetch = () => {
      prefetchPlansWithFeatures().catch(() => {})
      import('../pages/dashboard/SubscriptionPlans.jsx').catch(() => {})
    }

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(runPrefetch, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    }

    const timer = setTimeout(runPrefetch, 1500)
    return () => clearTimeout(timer)
  }, [isAuthenticated, role])

  return (
    <div className="min-h-screen bg-cream text-dark font-cairo overflow-x-hidden flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
