import { useState, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { Mail, Lock, ArrowLeft, CheckCircle, KeyRound, Loader2 } from 'lucide-react'
import { PasswordInput } from '../components/ui'
import { USER_ROLES } from '../types/user'

export default function ForgotPassword() {
  const { forgotPassword, verifyOtp, resetPassword, sendingOtp, verifyingOtp, resettingPassword } = useAuth()
  const { t, lang } = useLanguage()
  const [step, setStep] = useState('email') // 'email' | 'otp' | 'reset' | 'done'
  const [form, setForm] = useState({ email: '', role: USER_ROLES.USER, otp: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const otpRefs = useRef([])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleOtpDigit = (index, e) => {
    const val = e.target.value
    if (!/^\d?$/.test(val)) return
    const otpArr = form.otp.split('')
    otpArr[index] = val
    const newOtp = otpArr.join('')
    setForm({ ...form, otp: newOtp })
    // Auto-advance to next input
    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !form.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  // Step 1: Send OTP code to email
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const result = await forgotPassword(form.email, form.role)
    if (result.success) {
      setStep('otp')
      setSuccess(t('forgotPassword', 'otpSent', 'تم إرسال رمز التحقق إلى بريدك الإلكتروني'))
      // Focus first OTP input on next render
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } else {
      setError(result.error)
    }
  }

  // Step 2: Verify OTP code
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.otp.length !== 6) {
      setError(t('forgotPassword', 'errorOtpInvalid', 'يرجى إدخال رمز التحقق المكون من 6 أرقام'))
      return
    }
    const result = await verifyOtp(form.email, form.role, form.otp)
    if (result.success) {
      setStep('reset')
      setSuccess('')
    } else {
      setError(result.error)
    }
  }

  // Step 3: Set new password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password.length < 6) {
      setError(t('forgotPassword', 'errorWeakPassword'))
      return
    }
    if (form.password !== form.confirmPassword) {
      setError(t('forgotPassword', 'errorNotMatch'))
      return
    }

    const result = await resetPassword(form.email, form.password, form.role)
    if (result.success) {
      setStep('done')
      setSuccess(t('forgotPassword', 'resetSuccess'))
    } else {
      setError(result.error)
    }
  }

  const roles = [
    { value: USER_ROLES.USER, label: t('forgotPassword', 'roles.user') },
    { value: USER_ROLES.COMPANY, label: t('forgotPassword', 'roles.company') },
    { value: USER_ROLES.ADMIN, label: t('forgotPassword', 'roles.admin') },
  ]

  return (
    <>
      <Helmet>
        <title>{t('forgotPassword', 'title')}</title>
      </Helmet>
      <section className="min-h-screen hero-gradient flex items-center pt-24 pb-12">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <Link to="/login" className="inline-flex items-center gap-2 text-goldLight hover:text-gold transition-colors mb-6">
                <ArrowLeft size={18} /> {t('forgotPassword', 'backToLogin')}
              </Link>
              <h1 className="text-4xl font-bold text-white mb-2">{t('forgotPassword', 'heading')}</h1>
              <p className="text-goldLight/60">{t('forgotPassword', 'subtitle')}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-gold/20">
              <AnimatePresence mode="wait">
                {/* ═══════ Step 1: Email + Role ═══════ */}
                {step === 'email' && (
                  <motion.form key="email" onSubmit={handleSendOtp} className="space-y-5"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {roles.map(r => (
                        <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })}
                          className={`py-2.5 rounded-xl text-sm font-bold transition-all ${form.role === r.value ? 'bg-gold text-dark' : 'bg-white/10 text-goldLight/60 hover:bg-white/20'}`}>
                          {r.label}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-goldLight font-semibold mb-2 text-sm">{t('forgotPassword', 'email')}</label>
                      <div className="relative">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                        <input type="email" name="email" value={form.email} onChange={handleChange} required
                          className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark outline-none transition-all input-focus"
                          placeholder={t('forgotPassword', 'emailPlaceholder')} dir="auto" />
                      </div>
                    </div>

                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-3">
                        {error}
                      </motion.p>
                    )}

                    <button type="submit" disabled={sendingOtp}
                      className="w-full bg-gradient-to-r from-gold to-[#a67c3d] text-dark py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-gold/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {sendingOtp && <Loader2 size={20} className="animate-spin" />}
                      {sendingOtp ? t('forgotPassword', 'sending', 'جاري الإرسال...') : t('forgotPassword', 'submit', 'إرسال رمز التحقق')}
                    </button>
                  </motion.form>
                )}

                {/* ═══════ Step 2: OTP Entry ═══════ */}
                {step === 'otp' && (
                  <motion.form key="otp" onSubmit={handleVerifyOtp} className="space-y-5"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="text-center mb-2">
                      <div className="flex justify-center mb-3">
                        <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center">
                          <KeyRound className="text-gold" size={28} />
                        </div>
                      </div>
                      <p className="text-goldLight/80 text-sm">{t('forgotPassword', 'otpSent')}</p>
                      <p className="text-goldLight/50 text-xs mt-1">{form.email}</p>
                    </div>

                    {/* 6-digit OTP inputs */}
                    <div className="flex justify-center gap-3 rtl:gap-3" dir="ltr">
                      {[0, 1, 2, 3, 4, 5].map(i => (
                        <input
                          key={i}
                          ref={el => otpRefs.current[i] = el}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={form.otp[i] || ''}
                          onChange={(e) => handleOtpDigit(i, e)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="w-12 h-14 text-center text-xl font-bold bg-white/90 border-0 rounded-xl text-dark outline-none transition-all input-focus"
                        />
                      ))}
                    </div>

                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-3">
                        {error}
                      </motion.p>
                    )}

                    <button type="submit" disabled={verifyingOtp || form.otp.length !== 6}
                      className="w-full bg-gradient-to-r from-gold to-[#a67c3d] text-dark py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-gold/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {verifyingOtp && <Loader2 size={20} className="animate-spin" />}
                      {verifyingOtp ? t('forgotPassword', 'verifying', 'جاري التحقق...') : t('forgotPassword', 'verifyButton', 'تأكيد الرمز')}
                    </button>

                    <p className="text-center">
                      <button type="button" onClick={() => { setStep('email'); setError(''); setSuccess('') }}
                        className="text-gold hover:text-goldLight transition-colors text-sm">
                        {t('forgotPassword', 'changeEmail', 'تغيير البريد الإلكتروني')}
                      </button>
                    </p>
                  </motion.form>
                )}

                {/* ═══════ Step 3: New password ═══════ */}
                {step === 'reset' && (
                  <motion.form key="reset" onSubmit={handleResetPassword} className="space-y-5"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                    <div className="text-center mb-2">
                      <CheckCircle className="text-green-400 mx-auto mb-2" size={28} />
                      <p className="text-goldLight/80 text-sm">{t('forgotPassword', 'otpVerified', 'تم التحقق من البريد الإلكتروني ✓')}</p>
                    </div>

                    <div>
                      <PasswordInput
                        label={t('forgotPassword', 'newPassword')}
                        icon={<Lock size={18} />}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none transition-all input-focus"
                        placeholder="••••••"
                      />
                    </div>
                    <div>
                      <PasswordInput
                        label={t('forgotPassword', 'confirmPassword')}
                        icon={<Lock size={18} />}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none transition-all input-focus"
                        placeholder="••••••"
                      />
                    </div>

                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-3">
                        {error}
                      </motion.p>
                    )}

                    <button type="submit" disabled={resettingPassword}
                      className="w-full bg-gradient-to-r from-gold to-[#a67c3d] text-dark py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-gold/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {resettingPassword && <Loader2 size={20} className="animate-spin" />}
                      {resettingPassword ? t('forgotPassword', 'resetting', 'جاري الحفظ...') : t('forgotPassword', 'resetButton')}
                    </button>
                  </motion.form>
                )}

                {/* ═══════ Step 4: Done ═══════ */}
                {step === 'done' && (
                  <motion.div key="done" className="text-center py-8 space-y-6"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <div className="flex justify-center">
                      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="text-green-400" size={40} />
                      </div>
                    </div>
                    <p className="text-goldLight text-lg font-semibold">{success}</p>
                    <Link to="/login"
                      className="inline-block bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-gold/20 transition-all">
                      {t('forgotPassword', 'backToLogin')}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
