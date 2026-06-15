import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { findUser, findCompany, findAdmin, createUser, createCompany, findUserById, findCompanyById, findUserByEmail, findCompanyByEmail, findAdminByEmail, enrollUserInService } from '../data/db'
import { USER_ROLES } from '../types/user'
import api from '../api/axios'
import { authApi } from '../api/endpoints'

const AuthContext = createContext(null)

// persist current session
const SESSION_KEY = 'mustakleen_session'

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return null
}

function saveSession(s) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s))
  } catch (_) {}
}

function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY) } catch (_) {}
}

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)   // logged-in user object or null
  const [company, setCompany] = useState(null) // logged-in company or null
  const [admin, setAdmin]   = useState(null)   // logged-in admin or null
  const [loading, setLoading] = useState(true)

  // hydrate session on mount
  useEffect(() => {
    const session = loadSession()
    if (session) {
      if (session.type === USER_ROLES.USER) {
        const u = findUserById(session.id)
        if (u) setUser(u)
      } else if (session.type === USER_ROLES.COMPANY) {
        const c = findCompanyById(session.id)
        if (c) setCompany(c)
      } else if (session.type === USER_ROLES.ADMIN) {
        const a = findAdminByEmail(session.email)
        if (a) setAdmin(a)
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback((email, password) => {
    // Try User first
    const u = findUser(email, password)
    if (u) {
      setUser(u)
      setCompany(null)
      setAdmin(null)
      saveSession({ type: USER_ROLES.USER, id: u.id })
      return { success: true, user: u, role: 'user' }
    }
    // Try Company
    const c = findCompany(email, password)
    if (c) {
      setCompany(c)
      setUser(null)
      setAdmin(null)
      saveSession({ type: USER_ROLES.COMPANY, id: c.id })
      return { success: true, company: c, role: 'company' }
    }
    // Try Admin
    const a = findAdmin(email, password)
    if (a) {
      setAdmin(a)
      setUser(null)
      setCompany(null)
      saveSession({ type: USER_ROLES.ADMIN, email: a.email })
      return { success: true, admin: a, role: 'admin' }
    }
    return { error: 'invalid_credentials' }
  }, [])

  const signup = useCallback(({ name, email, phone, nationalId, job, password, plan, role, governorate }) => {
    if (role === USER_ROLES.USER) {
      const result = createUser({ name, email, phone, nationalId, job, password, plan, governorate })
      if (result.error) return { error: result.error }
      setUser(result.user)
      setCompany(null)
      setAdmin(null)
      saveSession({ type: USER_ROLES.USER, id: result.user.id })
      return { success: true, user: result.user }
    }
    if (role === USER_ROLES.COMPANY) {
      const result = createCompany({ name, email, password, category: job, city: '', emoji: '🏢' })
      if (result.error) return { error: result.error }
      setCompany(result.company)
      setUser(null)
      setAdmin(null)
      saveSession({ type: USER_ROLES.COMPANY, id: result.company.id })
      return { success: true, company: result.company }
    }
    return { error: 'unknown_role' }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setCompany(null)
    setAdmin(null)
    clearSession()
  }, [])

  // Forgot / Reset Password
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [resettingPassword, setResettingPassword] = useState(false)

  // ── forgotPassword ────────────────────────────────────────────
  // 1. Check local db.js first (that's where user accounts actually live)
  // 2. If found, call backend API to generate + email the OTP
  const forgotPassword = useCallback(async (email, role) => {
    // Local existence check
    let exists = false
    if (role === USER_ROLES.USER) exists = !!findUserByEmail(email)
    else if (role === USER_ROLES.COMPANY) exists = !!findCompanyByEmail(email)
    else if (role === USER_ROLES.ADMIN) exists = !!findAdminByEmail(email)
    if (!exists) return { error: 'البريد الإلكتروني غير مسجل' }

    setSendingOtp(true)
    try {
      const { data } = await api.post('/auth/forgot-password', { email, role })
      return { success: true, message: data.message }
    } catch (err) {
      const msg = err.response?.data?.message || 'حدث خطأ أثناء إرسال الرمز'
      return { error: msg }
    } finally {
      setSendingOtp(false)
    }
  }, [])

  const verifyOtp = useCallback(async (email, role, code) => {
    setVerifyingOtp(true)
    try {
      const { data } = await api.post('/auth/verify-otp', { email, role, code })
      return { success: true, message: data.message }
    } catch (err) {
      const msg = err.response?.data?.message || 'رمز التحقق غير صحيح'
      return { error: msg }
    } finally {
      setVerifyingOtp(false)
    }
  }, [])

  // ── resetPassword ─────────────────────────────────────────────
  // 1. Call backend to verify OTP and update MongoDB
  // 2. ALSO update the local db.js so the change takes effect
  const resetPassword = useCallback(async (email, newPassword, role) => {
    setResettingPassword(true)
    try {
      const { data } = await api.put('/auth/reset-password', { email, password: newPassword, role })
      // Also update local db.js
      const { resetUserPassword, resetCompanyPassword, resetAdminPassword } = await import('../data/db')
      if (role === USER_ROLES.USER) resetUserPassword(email, newPassword)
      else if (role === USER_ROLES.COMPANY) resetCompanyPassword(email, newPassword)
      else if (role === USER_ROLES.ADMIN) resetAdminPassword(email, newPassword)
      return { success: true, message: data.message }
    } catch (err) {
      const msg = err.response?.data?.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور'
      return { error: msg }
    } finally {
      setResettingPassword(false)
    }
  }, [])

  // ── Signup Email Verification ────────────────────────────────────
  const [sendingSignupOtp, setSendingSignupOtp] = useState(false)
  const [verifyingSignupOtp, setVerifyingSignupOtp] = useState(false)

  const sendSignupOtp = useCallback(async (email, name, role = USER_ROLES.USER) => {
    setSendingSignupOtp(true)
    try {
      const { data } = await authApi.sendSignupOtp(email, name, role)
      return { success: true, message: data.message }
    } catch (err) {
      const msg = err.response?.data?.message || 'حدث خطأ أثناء إرسال رمز التحقق'
      return { error: msg }
    } finally {
      setSendingSignupOtp(false)
    }
  }, [])

  const verifySignupEmail = useCallback(async (email, code, role = USER_ROLES.USER) => {
    setVerifyingSignupOtp(true)
    try {
      const { data } = await authApi.verifyEmail(email, code, role)
      return { success: true, message: data.message }
    } catch (err) {
      const msg = err.response?.data?.message || 'رمز التحقق غير صحيح'
      return { error: msg }
    } finally {
      setVerifyingSignupOtp(false)
    }
  }, [])

  // Helper to refresh user data after mutations
  const refreshUser = useCallback(() => {
    if (user) {
      const u = findUserById(user.id)
      if (u) {
        setUser(u)
        saveSession({ type: USER_ROLES.USER, id: u.id })
      }
    }
    if (company) {
      const c = findCompanyById(company.id)
      if (c) {
        setCompany(c)
        saveSession({ type: USER_ROLES.COMPANY, id: c.id })
      }
    }
  }, [user, company])

  const value = {
    user,
    company,
    admin,
    loading,
    isAuthenticated: !!(user || company || admin),
    role: user ? USER_ROLES.USER : company ? USER_ROLES.COMPANY : admin ? USER_ROLES.ADMIN : null,
    login,
    signup,
    logout,
    refreshUser,

    // Forgot / Reset Password
    forgotPassword,
    verifyOtp,
    resetPassword,
    sendingOtp,
    verifyingOtp,
    resettingPassword,

    // Signup email verification
    sendSignupOtp,
    verifySignupEmail,
    sendingSignupOtp,
    verifyingSignupOtp,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
