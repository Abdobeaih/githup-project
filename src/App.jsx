import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Pricing from './pages/Pricing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import NotFound from './pages/NotFound'
import Courses from './pages/services/Courses'
import Restaurants from './pages/services/Restaurants'
import Entertainment from './pages/services/Entertainment'
import MedicalInsurance from './pages/services/MedicalInsurance'
import FinancialInsurance from './pages/services/FinancialInsurance'
import About from './pages/About'
import Services from './pages/Services'
import ServiceDetail from './pages/services/ServiceDetail'
import ServiceRegistration from './pages/services/ServiceRegistration'
import RegistrationConfirmation from './pages/services/RegistrationConfirmation'
import Enrollment from './pages/services/Enrollment'

// Dashboard pages
import UserDashboard from './pages/dashboard/UserDashboard'
import UserProfile from './pages/dashboard/UserProfile'
import UserCards from './pages/dashboard/UserCards'
import UserInstallments from './pages/dashboard/UserInstallments'
import UserScans from './pages/dashboard/UserScans'
import DiscountsBrowse from './pages/dashboard/DiscountsBrowse'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import AdminUsers from './pages/dashboard/AdminUsers'
import AdminCompanies from './pages/dashboard/AdminCompanies'
import AdminDiscounts from './pages/dashboard/AdminDiscounts'
import CompanyDashboard from './pages/dashboard/CompanyDashboard'
import CompanyDiscounts from './pages/dashboard/CompanyDiscounts'
import CreateDiscount from './pages/dashboard/company/CreateDiscount'
import EditDiscount from './pages/dashboard/company/EditDiscount'
import CompanyAnalytics from './pages/dashboard/CompanyAnalytics'
import CompanyProfile from './pages/dashboard/CompanyProfile'

// New Phase 2-8 pages
import CompaniesList from './pages/dashboard/CompaniesList'
import CompanyDetail from './pages/dashboard/CompanyDetail'
import DiscountDetail from './pages/dashboard/DiscountDetail'
import SubscriptionPlans from './pages/dashboard/SubscriptionPlans'
import MySubscription from './pages/dashboard/MySubscription'
import Settings from './pages/dashboard/Settings'
import PaymentHistory from './pages/dashboard/PaymentHistory'
import NotificationsPage from './pages/dashboard/NotificationsPage'

import AdminAuditLogs from './pages/dashboard/AdminAuditLogs'
import AdminSubscriptionPlans from './pages/dashboard/AdminSubscriptionPlans'
import AdminCategories from './pages/dashboard/AdminCategories'
import AdminFeatures from './pages/dashboard/AdminFeatures'
import AdminInteractions from './pages/dashboard/AdminInteractions'
import AdminSettlements from './pages/dashboard/AdminSettlements'

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <ErrorBoundary
        title="Page Error"
        message="Something went wrong loading this page. Try refreshing."
      >
        {children}
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
