import { useState, useEffect, useCallback, Fragment as ReactFragment } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'

import Modal from '../../components/Modal'
import { getUserEnrollments, confirmEnrollmentSubscription } from '../../data/db'
import { QrCode, Wallet, CreditCard, Clock, TrendingUp, Sparkles, Stethoscope, Landmark, CheckCircle, Calendar, Phone, Shield, FileText } from 'lucide-react'

export default function UserDashboard() {
  const { user } = useAuth()
  const { t, td, lang } = useLanguage()
  const [enrollments, setEnrollments] = useState([])
  const [subModalOpen, setSubModalOpen] = useState(false)
  const [subSelectedEnr, setSubSelectedEnr] = useState(null)
  const [subForm, setSubForm] = useState({ name: '', dob: '', phone: '', dataUseAgree: false, termsAgree: false })

  useEffect(() => {
    if (user) setEnrollments(getUserEnrollments(user.id))
  }, [user])

  const serviceLabels = { medical: t('footer', 'medicalInsurance'), financial: t('footer', 'financialInsurance') }
  const serviceIcons = { medical: Stethoscope, financial: Landmark }

  if (!user) return null

  const openSubModal = (enr) => {
    setSubSelectedEnr(enr)
    setSubForm({ name: '', dob: '', phone: '', dataUseAgree: false, termsAgree: false })
    setSubModalOpen(true)
  }

  const handleCloseModal = useCallback(() => {
    setSubModalOpen(false)
    setSubSelectedEnr(null)
  }, [])

  const handleConfirmSubscription = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    if (!subSelectedEnr) return
    try {
      confirmEnrollmentSubscription(subSelectedEnr.id, {
        name: subForm.name,
        dob: subForm.dob,
        phone: subForm.phone,
        dataUseAgree: subForm.dataUseAgree,
        termsAgree: subForm.termsAgree,
      })
      console.log('[UserDashboard] Enrollment confirmed:', subSelectedEnr.id)
      setSubModalOpen(false)
      setSubSelectedEnr(null)
      if (user) setEnrollments(getUserEnrollments(user.id))
    } catch (err) {
      console.error('[UserDashboard] Failed to confirm enrollment:', err)
    }
  }

  const quickActions = [
    { label: t('dashboard', 'browseDiscounts'), icon: QrCode, href: '/dashboard/discounts', color: 'from-gold to-[#a67c3d]' },
    { label: t('dashboard', 'myCards'), icon: CreditCard, href: '/dashboard/user/cards', color: 'from-blue-500 to-blue-600' },
    { label: t('dashboard', 'myInstallments'), icon: Clock, href: '/dashboard/user/installments', color: 'from-emerald-500 to-emerald-600' },
    { label: t('dashboard', 'scanHistory'), icon: TrendingUp, href: '/dashboard/user/scans', color: 'from-purple-500 to-purple-600' },

  ]

  const stats = [
    { label: t('dashboard', 'scansCount'), value: user.scans, icon: QrCode, color: 'text-gold' },
    { label: t('dashboard', 'totalSavings'), value: `${user.saved.toFixed(0)} ${t('pricing', 'egp')}`, icon: Wallet, color: 'text-emerald-400' },
    { label: t('dashboard', 'loyaltyPoints'), value: user.points, icon: Sparkles, color: 'text-purple-400' },
  ]

  const planColors = { free: 'bg-gray-500', premium: 'bg-gold', elite: 'bg-emerald-500' }
  const subCompany = subSelectedEnr
    ? (td('medicalCenters', subSelectedEnr.center?.name, 'name') || td('banks', subSelectedEnr.bank?.name, 'name') || '')
    : ''

  const isFormValid = subForm.name.trim() !== '' && subForm.dob !== '' && subForm.phone.trim().length === 11 && subForm.dataUseAgree && subForm.termsAgree

  return (
    <>
      <Helmet><title>{t('dashboard', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="text-3xl font-bold text-dark mb-2">{t('dashboard', 'welcome')} {td('users', user.name)} 👋</h1>
            <p className="text-dark/60">{t('dashboard', 'overview')}</p>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {stats.map((s, i) => {
              // First stat (Total Discounts Used) is clickable
              const isClickable = i === 0
              const href = isClickable ? '/dashboard/user/scans' : null
              
              const CardContent = (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-white rounded-2xl p-6 border border-gold/10 shadow-sm ${
                    isClickable
                      ? 'hover:shadow-md hover:border-gold/30 cursor-pointer transition-all group'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-dark/50 text-sm ${
                      isClickable ? 'group-hover:text-dark/70 transition-colors' : ''
                    }`}>
                      {s.label}
                      {isClickable && (
                        <span className="inline-block ml-1 text-gold text-xs">
                          {' '}→
                        </span>
                      )}
                    </span>
                    <s.icon className={`${s.color} ${
                      isClickable ? 'group-hover:scale-110 transition-transform' : ''
                    }`} size={24} />
                  </div>
                  <p className={`text-3xl font-bold text-dark ${
                    isClickable ? 'group-hover:text-gold transition-colors' : ''
                  }`}>
                    {s.value}
                  </p>
                </motion.div>
              )

              // Wrap in Link if clickable
              return isClickable && href ? (
                <Link key={i} to={href}>
                  {CardContent}
                </Link>
              ) : (
                <ReactFragment key={i}>
                  {CardContent}
                </ReactFragment>
              )
            })}
          </div>

          {/* Plan info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm mb-12">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-dark/50 text-sm">{t('dashboard', 'currentPlan')}</span>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xl font-bold text-dark capitalize">
                    {user.plan === 'elite' ? t('discountsBrowse', 'elite') : user.plan === 'premium' ? t('discountsBrowse', 'premium') : t('discountsBrowse', 'free')}
                  </p>
                  <span className={`${planColors[user.plan]} text-white text-xs px-3 py-1 rounded-full font-bold`}>{user.plan}</span>
                </div>
              </div>
              <div className="text-left">
                <span className="text-dark/50 text-sm">{t('dashboard', 'membershipDate')}</span>
                <p className="font-bold text-dark">{new Date(user.join_date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <h2 className="text-2xl font-bold text-dark mb-6">{t('common', 'quickActions')}</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <Link key={i} to={action.href}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.05 }}
                  className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center">
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                    <action.icon size={26} />
                  </div>
                  <p className="font-bold text-dark">{action.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Enrolled Services */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12">
            <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-2">
              <Sparkles className="text-gold" size={24} />
              {t('common', 'myServices')}
            </h2>
            {enrollments.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm text-center">
                <p className="text-dark/50 mb-4">{t('common', 'noServices')}</p>
                <Link to="/services" className="inline-block bg-dark text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-darkLight transition-all">
                  {t('common', 'browseServices')}
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {enrollments.map((enr) => {
                  const Icon = serviceIcons[enr.service_type]
                  const name = td('medicalCenters', enr.center?.name, 'name') || td('banks', enr.bank?.name, 'name') || ''
                  return (
                    <div key={enr.id} className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold shrink-0">
                          <Icon size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-dark">{serviceLabels[enr.service_type]}</p>
                          <p className="text-dark/60 text-sm truncate">{name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${enr.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                              {enr.status === 'active' ? t('common', 'enrollActive') : t('common', 'enrollCancelled')}
                            </span>
                            <span className="text-dark/40 text-xs">{new Date(enr.enrolled_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                            {enr.subscription_confirmed && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-gold/10 text-gold flex items-center gap-1">
                                <CheckCircle size={12} />
                                {t('common', 'enrollmentConfirmed')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {enr.status === 'active' && !enr.subscription_confirmed && (
                        <div className="mt-4 pt-4 border-t border-gold/10">
                          <button type="button" onClick={() => openSubModal(enr)}
                            className="w-full bg-gradient-to-r from-gold to-[#a67c3d] text-white font-bold text-sm py-2.5 px-4 rounded-xl hover:shadow-md transition-all">
                            {t('common', 'confirmSubscription')}
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Confirm Subscription Modal */}
      {subModalOpen && subSelectedEnr && (
        <Modal open={subModalOpen} onClose={handleCloseModal}
          title={t('common', 'subscriptionTitle')} size="md">
          <div className="space-y-4">
            {/* Company Name */}
            <div className="p-3 bg-gold/5 rounded-xl border border-gold/10">
              <div className="flex items-center gap-2 text-dark/60 text-sm mb-1">
                <Shield size={14} />
                {t('common', 'companyName')}
              </div>
              <p className="font-bold text-dark text-lg">{subCompany}</p>
            </div>

            {/* Your Full Name */}
            <div>
              <label className="block text-sm font-bold text-dark mb-1.5 flex items-center gap-2">
                <FileText size={14} className="text-gold" />
                {t('common', 'yourFullName')}
              </label>
              <input type="text" value={subForm.name} onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                placeholder={t('common', 'fullNamePlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-cream/30 text-dark focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-bold text-dark mb-1.5 flex items-center gap-2">
                <Calendar size={14} className="text-gold" />
                {t('common', 'dateOfBirth')}
              </label>
              <input type="date" value={subForm.dob} onChange={(e) => setSubForm({ ...subForm, dob: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-cream/30 text-dark focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-dark mb-1.5 flex items-center gap-2">
                <Phone size={14} className="text-gold" />
                {t('common', 'phoneNumber')}
              </label>
              <input type="tel" value={subForm.phone} onChange={(e) => setSubForm({ ...subForm, phone: e.target.value })}
                inputMode="numeric" maxLength={11}
                onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
                placeholder={t('common', 'phonePlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl border border-gold/20 bg-cream/30 text-dark focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={subForm.dataUseAgree}
                  onChange={(e) => setSubForm({ ...subForm, dataUseAgree: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-sm text-dark/80">{t('common', 'agreeDataUse')}</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={subForm.termsAgree}
                  onChange={(e) => setSubForm({ ...subForm, termsAgree: e.target.checked })}
                  className="mt-1"
                />
                <span className="text-sm text-dark/80">{t('common', 'agreeTerms')}</span>
              </label>
            </div>

            {/* Confirm Button */}
            <div className="pt-2">
              <button type="button" onClick={handleConfirmSubscription} disabled={!isFormValid}
                className={`w-full font-bold text-sm py-3 rounded-xl transition-all ${
                  isFormValid
                    ? 'bg-gradient-to-r from-gold to-[#a67c3d] text-white hover:shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}>
                {t('common', 'confirmDiscountReceipt')}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
