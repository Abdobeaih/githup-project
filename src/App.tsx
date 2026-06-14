import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { Navbar } from './components/layout/Navbar'
import { useAuthStore, useUIStore } from './stores'


// ─── Public Pages ────────────────────────────────────
import { LoginPage } from './pages/auth/LoginPage'
// (Existing JSX pages for Home, Services, Pricing, etc. are reused)

// ─── User Dashboard Pages ────────────────────────────
import { UserDashboardPage } from './pages/user/UserDashboardPage'

// ─── Admin Dashboard Pages ───────────────────────────
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminCompaniesPage } from './pages/admin/AdminCompaniesPage'
import { AdminDiscountsPage } from './pages/admin/AdminDiscountsPage'

// ─── Company Dashboard Pages ─────────────────────────
import { CompanyDashboardPage } from './pages/company/CompanyDashboardPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const ProtectedDashboard: React.FC = () => {
  const role = useAuthStore((s) => s.role)

  const roleRedirect: Record<string, string> = {
    USER: '/dashboard',
    COMPANY_ADMIN: '/dashboard/company',
    ADMIN: '/dashboard/admin',
    SUPER_ADMIN: '/dashboard/admin',
  }

  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  )
}

function AppContent() {
  const direction = useUIStore((s) => s.direction)

  return (
    <div dir={direction}>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          {/* ─── Public ─────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />

          {/* ─── Dashboard (role-based) ─────────────── */}
          <Route path="/dashboard" element={<ProtectedDashboard />}>
            {/* User Dashboard */}
            <Route index element={
              <ProtectedRoute roles={['USER']}>
                <UserDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="user/profile" element={
              <ProtectedRoute roles={['USER']}>
                <div>User Profile Page</div>
              </ProtectedRoute>
            } />
            <Route path="user/cards" element={
              <ProtectedRoute roles={['USER']}>
                <div>Cards Page</div>
              </ProtectedRoute>
            } />
            <Route path="user/installments" element={
              <ProtectedRoute roles={['USER']}>
                <div>Installments Page</div>
              </ProtectedRoute>
            } />
            <Route path="user/scans" element={
              <ProtectedRoute roles={['USER']}>
                <div>Scans Page</div>
              </ProtectedRoute>
            } />
            <Route path="discounts" element={
              <ProtectedRoute roles={['USER']}>
                <div>Discounts Browse Page</div>
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute roles={['USER', 'COMPANY_ADMIN']}>
                <div>Settings Page</div>
              </ProtectedRoute>
            } />

            {/* Admin Dashboard */}
            <Route path="admin" element={
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="admin/users" element={
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <AdminUsersPage />
              </ProtectedRoute>
            } />
            <Route path="admin/companies" element={
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <AdminCompaniesPage />
              </ProtectedRoute>
            } />
            <Route path="admin/discounts" element={
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <AdminDiscountsPage />
              </ProtectedRoute>
            } />
            <Route path="admin/subscriptions/plans" element={
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <div>Subscription Plans Page</div>
              </ProtectedRoute>
            } />
            <Route path="admin/features" element={
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <div>Features Page</div>
              </ProtectedRoute>
            } />
            <Route path="admin/categories" element={
              <ProtectedRoute roles={['ADMIN', 'SUPER_ADMIN']}>
                <div>Categories Page</div>
              </ProtectedRoute>
            } />
            <Route path="admin/audit-logs" element={
              <ProtectedRoute roles={['SUPER_ADMIN']}>
                <div>Audit Logs Page</div>
              </ProtectedRoute>
            } />
            <Route path="admin/settlements" element={
              <ProtectedRoute roles={['SUPER_ADMIN']}>
                <div>Settlements Page</div>
              </ProtectedRoute>
            } />

            {/* Company Dashboard */}
            <Route path="company" element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <CompanyDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="company/discounts" element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <div>Company Discounts Page</div>
              </ProtectedRoute>
            } />
            <Route path="company/discounts/create" element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <div>Create Discount Page</div>
              </ProtectedRoute>
            } />
            <Route path="company/discounts/edit/:id" element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <div>Edit Discount Page</div>
              </ProtectedRoute>
            } />
            <Route path="company/analytics" element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <div>Company Analytics Page</div>
              </ProtectedRoute>
            } />
            <Route path="company/profile" element={
              <ProtectedRoute roles={['COMPANY_ADMIN']}>
                <div>Company Profile Page</div>
              </ProtectedRoute>
            } />
          </Route>

          {/* ─── Subscriptions (outside dashboard) ─── */}
          <Route path="/subscriptions/plans" element={
            <ProtectedRoute roles={['USER']}>
              <div>Subscription Plans Page</div>
            </ProtectedRoute>
          } />
          <Route path="/subscriptions/my" element={
            <ProtectedRoute roles={['USER']}>
              <div>My Subscription Page</div>
            </ProtectedRoute>
          } />
          <Route path="/subscriptions/payments" element={
            <ProtectedRoute roles={['USER']}>
              <div>Payment History Page</div>
            </ProtectedRoute>
          } />

          {/* ─── Notifications ─────────────────────── */}
          <Route path="/notifications" element={
            <ProtectedRoute roles={['USER']}>
              <div>Notifications Page</div>
            </ProtectedRoute>
          } />

          {/* ─── Fallback ──────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AppContent />
      </HelmetProvider>

    </QueryClientProvider>
  )
}
