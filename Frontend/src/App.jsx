import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

/**
 * Lazy-load every page that is NOT needed on initial render.
 * This reduces the initial JS bundle by ~80% (35+ components deferred).
 */
const Pricing = lazy(() => import('./pages/Pricing'))
const Signup = lazy(() => import('./pages/Signup'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const Courses = lazy(() => import('./pages/services/Courses'))
const Restaurants = lazy(() => import('./pages/services/Restaurants'))
const Entertainment = lazy(() => import('./pages/services/Entertainment'))
const MedicalInsurance = lazy(() => import('./pages/services/MedicalInsurance'))
const FinancialInsurance = lazy(() => import('./pages/services/FinancialInsurance'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetail = lazy(() => import('./pages/services/ServiceDetail'))
const ServiceRegistration = lazy(() => import('./pages/services/ServiceRegistration'))
const RegistrationConfirmation = lazy(() => import('./pages/services/RegistrationConfirmation'))
const Enrollment = lazy(() => import('./pages/services/Enrollment'))

// Dashboard pages
const UserDashboard = lazy(() => import('./pages/dashboard/UserDashboard'))
const UserProfile = lazy(() => import('./pages/dashboard/UserProfile'))
const UserCards = lazy(() => import('./pages/dashboard/UserCards'))
const UserInstallments = lazy(() => import('./pages/dashboard/UserInstallments'))
const UserScans = lazy(() => import('./pages/dashboard/UserScans'))
const DiscountsBrowse = lazy(() => import('./pages/dashboard/DiscountsBrowse'))
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'))
const AdminUsers = lazy(() => import('./pages/dashboard/AdminUsers'))
const AdminCompanies = lazy(() => import('./pages/dashboard/AdminCompanies'))
const AdminDiscounts = lazy(() => import('./pages/dashboard/AdminDiscounts'))
const CompanyDashboard = lazy(() => import('./pages/dashboard/CompanyDashboard'))
const CompanyDiscounts = lazy(() => import('./pages/dashboard/CompanyDiscounts'))
const CreateDiscount = lazy(() => import('./pages/dashboard/company/CreateDiscount'))
const EditDiscount = lazy(() => import('./pages/dashboard/company/EditDiscount'))
const CompanyAnalytics = lazy(() => import('./pages/dashboard/CompanyAnalytics'))
const CompanyProfile = lazy(() => import('./pages/dashboard/CompanyProfile'))

// Phase 2-8 pages
const CompaniesList = lazy(() => import('./pages/dashboard/CompaniesList'))
const CompanyDetail = lazy(() => import('./pages/dashboard/CompanyDetail'))
const DiscountDetail = lazy(() => import('./pages/dashboard/DiscountDetail'))
const SubscriptionPlans = lazy(() => import('./pages/dashboard/SubscriptionPlans'))
const MySubscription = lazy(() => import('./pages/dashboard/MySubscription'))
const Settings = lazy(() => import('./pages/dashboard/Settings'))
const PaymentHistory = lazy(() => import('./pages/dashboard/PaymentHistory'))
const NotificationsPage = lazy(() => import('./pages/dashboard/NotificationsPage'))

const AdminAuditLogs = lazy(() => import('./pages/dashboard/AdminAuditLogs'))
const AdminSubscriptionPlans = lazy(() => import('./pages/dashboard/AdminSubscriptionPlans'))
const AdminCategories = lazy(() => import('./pages/dashboard/AdminCategories'))
const AdminFeatures = lazy(() => import('./pages/dashboard/AdminFeatures'))
const AdminInteractions = lazy(() => import('./pages/dashboard/AdminInteractions'))
const AdminSettlements = lazy(() => import('./pages/dashboard/AdminSettlements'))

function SuspenseWrapper({ children }) {
  return (
    <Suspense fallback={<PageLoading />}>
      {children}
    </Suspense>
  )
}

function PageLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <LoadingSpinner />
    </motion.div>
  )
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <ErrorBoundary
        title="Page Error"
        message="Something went wrong loading this page. Try refreshing."
      >
        <SuspenseWrapper>{children}</SuspenseWrapper>
      </ErrorBoundary>
    </motion.div>
  )
}

function App() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/pricing" element={<PageWrapper><Pricing /></PageWrapper>} />
          <Route path="/join" element={<PageWrapper><Signup /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
          <Route path="/reset-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />

          {/* Service routes */}
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/services/courses" element={<PageWrapper><Courses /></PageWrapper>} />
          <Route path="/services/restaurants" element={<PageWrapper><Restaurants /></PageWrapper>} />
          <Route path="/services/entertainment" element={<PageWrapper><Entertainment /></PageWrapper>} />
          <Route path="/services/medical" element={<PageWrapper><MedicalInsurance /></PageWrapper>} />
          <Route path="/services/medical-insurance" element={<Navigate to="/services/medical" replace />} />
          <Route path="/services/financial" element={<PageWrapper><FinancialInsurance /></PageWrapper>} />
          <Route path="/services/financial-insurance" element={<Navigate to="/services/financial" replace />} />
          <Route path="/services/medical-center/:id" element={<PageWrapper><ServiceDetail /></PageWrapper>} />
          <Route path="/services/bank/:id" element={<PageWrapper><ServiceDetail /></PageWrapper>} />
          <Route path="/services/enroll" element={<PageWrapper><Enrollment /></PageWrapper>} />
          <Route path="/services/register" element={<PageWrapper><ServiceRegistration /></PageWrapper>} />
          <Route path="/services/register/success" element={<PageWrapper><RegistrationConfirmation /></PageWrapper>} />

          {/* Public company & discount browsing */}
          <Route path="/companies" element={<PageWrapper><CompaniesList /></PageWrapper>} />
          <Route path="/companies/:id" element={<PageWrapper><CompanyDetail /></PageWrapper>} />
          <Route path="/discounts/:id" element={<PageWrapper><DiscountDetail /></PageWrapper>} />

          {/* User Dashboard routes */}
          <Route path="/dashboard/user" element={<ProtectedRoute requiredRole="user"><PageWrapper><UserDashboard /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/user/profile" element={<ProtectedRoute requiredRole="user"><PageWrapper><UserProfile /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/user/cards" element={<ProtectedRoute requiredRole="user"><PageWrapper><UserCards /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/user/installments" element={<ProtectedRoute requiredRole="user"><PageWrapper><UserInstallments /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/user/scans" element={<ProtectedRoute requiredRole="user"><PageWrapper><UserScans /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/user/settings" element={<ProtectedRoute requiredRole="user"><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />

          <Route path="/dashboard/discounts" element={<ProtectedRoute><PageWrapper><DiscountsBrowse /></PageWrapper></ProtectedRoute>} />

          {/* Subscription routes */}
          <Route path="/subscriptions/plans" element={<ProtectedRoute><PageWrapper><SubscriptionPlans /></PageWrapper></ProtectedRoute>} />
          <Route path="/subscriptions/my" element={<ProtectedRoute><PageWrapper><MySubscription /></PageWrapper></ProtectedRoute>} />
          <Route path="/subscriptions/payments" element={<ProtectedRoute><PageWrapper><PaymentHistory /></PageWrapper></ProtectedRoute>} />


          {/* Notifications */}
          <Route path="/notifications" element={<ProtectedRoute><PageWrapper><NotificationsPage /></PageWrapper></ProtectedRoute>} />

          {/* Admin Dashboard routes */}
          <Route path="/dashboard/admin" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminDashboard /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/admin/users" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminUsers /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/admin/companies" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminCompanies /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/admin/discounts" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminDiscounts /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/admin/audit-logs" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminAuditLogs /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/admin/subscriptions/plans" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminSubscriptionPlans /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/admin/categories" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminCategories /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/admin/features" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminFeatures /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/admin/interactions" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminInteractions /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/admin/settlements" element={<ProtectedRoute requiredRole="admin"><PageWrapper><AdminSettlements /></PageWrapper></ProtectedRoute>} />

          {/* Company Dashboard routes */}
          <Route path="/dashboard/company" element={<ProtectedRoute requiredRole="company"><PageWrapper><CompanyDashboard /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/company/discounts" element={<ProtectedRoute requiredRole="company"><PageWrapper><CompanyDiscounts /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/company/discounts/create" element={<ProtectedRoute requiredRole="company"><PageWrapper><CreateDiscount /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/company/discounts/edit/:id" element={<ProtectedRoute requiredRole="company"><PageWrapper><EditDiscount /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/company/analytics" element={<ProtectedRoute requiredRole="company"><PageWrapper><CompanyAnalytics /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/company/profile" element={<ProtectedRoute requiredRole="company"><PageWrapper><CompanyProfile /></PageWrapper></ProtectedRoute>} />
          <Route path="/dashboard/company/settings" element={<ProtectedRoute requiredRole="company"><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App
