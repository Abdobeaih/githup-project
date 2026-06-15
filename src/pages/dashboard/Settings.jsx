import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import { updateUser, updateCompany } from '../../data/db'
import { useNavigate } from 'react-router-dom'
import { USER_ROLES } from '../../types/user'
import { PLAN_LABELS, PLAN_PRICES } from '../../types/subscription'
import { COMPANY_CATEGORIES } from '../../types/company'
import {
  User, Mail, Lock, ShieldCheck, Crown, Building2, Phone,
  MapPin, Briefcase, Tag, Eye, EyeOff, CheckCircle, Save, AlertCircle
} from 'lucide-react'

const planColors = {
  free: 'bg-gray-500',
  premium: 'bg-gold',
  elite: 'bg-emerald-500',
}

function PasswordStrength({ password }) {
  const { t } = useLanguage()
  if (!password) return null
  const hasLetter = /[a-zA-Z\u0600-\u06FF]/.test(password)
  const hasNumber = /\d/.test(password)
  const longEnough = password.length >= 8
  const level = !longEnough ? 'weak' : !hasNumber ? 'medium' : 'strong'
  const colors = { weak: 'bg-red-500', medium: 'bg-amber-500', strong: 'bg-emerald-500' }
  const pct = { weak: '33%', medium: '66%', strong: '100%' }
  return (
    <div className="mt-2">
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${colors[level]} rounded-full transition-all duration-300`} style={{ width: pct[level] }} />
      </div>
      <p className={`text-xs mt-1 ${level === 'weak' ? 'text-red-500' : level === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
        {t('settings', level)}
      </p>
    </div>
  )
}

const tabs = [
  { key: 'profile', icon: User },
  { key: 'security', icon: ShieldCheck },
  { key: 'subscription', icon: Crown },
]

export default function Settings() {
  const { user, company, role, refreshUser } = useAuth()
  const { t, td, lang } = useLanguage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')

  // Profile state
  const [isEditing, setIsEditing] = useState(false)
  const profileDefaults = role === USER_ROLES.COMPANY && company
    ? { name: company.name || '', email: company.email || '', category: company.category || '', city: company.city || '', emoji: company.emoji || '' }
    : { name: user?.name || '', email: user?.email || '', phone: user?.phone || '', nationalId: user?.nationalId || '', job: user?.job || '', governorate: user?.governorate || '' }
  const [profileForm, setProfileForm] = useState(profileDefaults)
  const [profileSaved, setProfileSaved] = useState(false)
  const [profileErrors, setProfileErrors] = useState({})

  // Security state
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passErrors, setPassErrors] = useState({})
  const [passSaved, setPassSaved] = useState(false)
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false })

  if (!user && !company) return null

  const handleProfileChange = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value })

  const cancelEdit = () => {
    setProfileForm(role === USER_ROLES.COMPANY && company
      ? { name: company.name || '', email: company.email || '', category: company.category || '', city: company.city || '', emoji: company.emoji || '' }
      : { name: user?.name || '', email: user?.email || '', phone: user?.phone || '', nationalId: user?.nationalId || '', job: user?.job || '', governorate: user?.governorate || '' })
    setProfileErrors({})
    setIsEditing(false)
  }

  const validateProfile = () => {
    const errors = {}
    if (!profileForm.name.trim()) errors.name = t('settings', 'nameRequired')
    if (!profileForm.email.includes('@')) errors.email = t('settings', 'validEmail')
    if (role !== USER_ROLES.COMPANY && profileForm.phone && profileForm.phone.replace(/\D/g, '').length !== 11) {
      errors.phone = t('settings', 'phoneInvalid')
    }
    if (role !== USER_ROLES.COMPANY && profileForm.nationalId && profileForm.nationalId.replace(/\D/g, '').length !== 14) {
      errors.nationalId = 'National ID must be exactly 14 digits.'
    }
    return errors
  }

  const handleProfileSave = (e) => {
    e.preventDefault()
    const errors = validateProfile()
    setProfileErrors(errors)
    if (Object.keys(errors).length > 0) return
    if (role === USER_ROLES.COMPANY && company) {
      updateCompany(company.id, profileForm)
    } else if (user) {
      updateUser(user.id, profileForm)
    }
    refreshUser()
    setProfileSaved(true)
    setIsEditing(false)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  const handlePassChange = (e) => setPassForm({ ...passForm, [e.target.name]: e.target.value })

  const validatePassword = () => {
    const errors = {}
    const current = user || company
    if (!passForm.currentPassword) errors.currentPassword = t('settings', 'currentPasswordRequired')
    else if (passForm.currentPassword !== current?.password) errors.currentPassword = t('settings', 'currentPasswordIncorrect')
    if (!passForm.newPassword) errors.newPassword = t('settings', 'newPasswordRequired')
    else if (passForm.newPassword.length < 8) errors.newPassword = t('settings', 'newPasswordLength')
    else if (!/(?=.*[a-zA-Z\u0600-\u06FF])(?=.*\d)/.test(passForm.newPassword)) errors.newPassword = t('settings', 'newPasswordComplexity')
    if (!passForm.confirmPassword) errors.confirmPassword = t('settings', 'confirmPasswordRequired')
    else if (passForm.confirmPassword !== passForm.newPassword) errors.confirmPassword = t('settings', 'passwordsNotMatch')
    return errors
  }

  const handlePasswordSave = (e) => {
    e.preventDefault()
    const errors = validatePassword()
    setPassErrors(errors)
    if (Object.keys(errors).length > 0) return
    if (role === USER_ROLES.COMPANY && company) {
      updateCompany(company.id, { password: passForm.newPassword })
    } else if (user) {
      updateUser(user.id, { password: passForm.newPassword })
    }
    refreshUser()
    setPassSaved(true)
    setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowPass({ current: false, new: false, confirm: false })
    setTimeout(() => setPassSaved(false), 3000)
  }

  const planLabel = user?.plan ? PLAN_LABELS[user.plan] || user.plan : ''
  const planPrice = user?.plan ? PLAN_PRICES[user.plan] : 0

  return (
    <>
      <Helmet><title>{t('settings', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-dark mb-2">{t('settings', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{t('settings', 'subtitle')}</p>

            {/* Tab bar */}
            <div className="flex gap-2 mb-8">
              {tabs.map(tab => {
                const Icon = tab.icon
                const isActive = activeTab === tab.key
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                      isActive
                        ? 'bg-dark text-white shadow-lg'
                        : 'bg-white text-dark/60 border border-gold/20 hover:bg-gold/5'
                    }`}>
                    <Icon size={18} />
                    {t('settings', tab.key === 'profile'
                      ? (role === USER_ROLES.COMPANY ? 'companyInfo' : 'personalInfo')
                      : tab.key === 'security' ? 'securityTab' : 'subscriptionTab')}
                  </button>
                )
              })}
            </div>

            {/* ── Profile Tab ── */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSave} className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-dark">
                    {t('settings', role === USER_ROLES.COMPANY ? 'companyInfo' : 'personalInfo')}
                  </h2>
                  {!isEditing ? (
                    <button type="button" onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gold/20 transition-all">
                      <Save size={16} /> {t('settings', 'edit')}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={cancelEdit}
                        className="px-5 py-2.5 rounded-xl font-bold text-sm border border-gold/30 text-goldLight hover:bg-gold/10 transition-all">
                        {t('settings', 'cancel')}
                      </button>
                      <button type="submit"
                        className="flex items-center gap-2 bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
                        {profileSaved ? t('settings', 'saved') : t('settings', 'saveChanges')}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-5">
                  {role === USER_ROLES.COMPANY ? (
                    <>
                      {/* Company: emoji */}
                      <div>
                        <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'emoji')}</label>
                        <div className="relative">
                          <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                          <input type="text" name="emoji" value={profileForm.emoji} onChange={handleProfileChange} disabled={!isEditing}
                            className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                        </div>
                      </div>
                      {/* Company: name */}
                      <div>
                        <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'companyName')}</label>
                        <div className="relative">
                          <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                          <input type="text" name="name" value={profileForm.name} onChange={handleProfileChange} disabled={!isEditing}
                            className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                        </div>
                        {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>}
                      </div>
                      {/* Company: email */}
                      <div>
                        <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'email')}</label>
                        <div className="relative">
                          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                          <input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} disabled={!isEditing}
                            className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                        </div>
                        {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>}
                      </div>
                      {/* Company: category */}
                      <div>
                        <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'category')}</label>
                        <div className="relative">
                          <Tag className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                          <select name="category" value={profileForm.category} onChange={handleProfileChange} disabled={!isEditing}
                            className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                            <option value="">--</option>
                            {Object.values(COMPANY_CATEGORIES).map(cat => (
                              <option key={cat} value={cat}>{td('companyCategories', cat) || cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {/* Company: city */}
                      <div>
                        <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'city')}</label>
                        <div className="relative">
                          <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                          <input type="text" name="city" value={profileForm.city} onChange={handleProfileChange} disabled={!isEditing}
                            className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* User: name */}
                      <div>
                        <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'fullName')}</label>
                        <div className="relative">
                          <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                          <input type="text" name="name" value={profileForm.name} onChange={handleProfileChange} disabled={!isEditing}
                            className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                        </div>
                        {profileErrors.name && <p className="text-red-500 text-xs mt-1">{profileErrors.name}</p>}
                      </div>
                      {/* User: email */}
                      <div>
                        <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'email')}</label>
                        <div className="relative">
                          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                          <input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} disabled={!isEditing}
                            className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                        </div>
                        {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email}</p>}
                      </div>
                      {/* User: phone */}
                      <div>
                        <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'phone')}</label>
                        <div className="relative">
                          <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                          <input type="tel" name="phone" value={profileForm.phone} onChange={handleProfileChange} disabled={!isEditing}
                            inputMode="numeric" maxLength={11}
                            onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
                            className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                        </div>
                        {profileErrors.phone && <p className="text-red-500 text-xs mt-1">{profileErrors.phone}</p>}
                      </div>
                      {/* User: nationalId */}
                      <div>
                        <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'nationalId')}</label>
                        <div className="relative">
                          <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                          <input type="text" name="nationalId" value={profileForm.nationalId} onChange={handleProfileChange} disabled={!isEditing}
                            inputMode="numeric" maxLength={14}
                            onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
                            className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                        </div>
                        {profileErrors.nationalId && <p className="text-red-500 text-xs mt-1">{profileErrors.nationalId}</p>}
                      </div>
                      {/* User: job */}
                      <div>
                        <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'specialty')}</label>
                        <div className="relative">
                          <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                          <input type="text" name="job" value={!isEditing ? (td('jobs', profileForm.job) || profileForm.job) : profileForm.job} onChange={handleProfileChange} disabled={!isEditing}
                            className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                        </div>
                      </div>
                      {/* User: governorate */}
                      <div>
                        <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'governorate')}</label>
                        <div className="relative">
                          <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                          <input type="text" name="governorate" value={!isEditing ? (td('governorates', profileForm.governorate) || profileForm.governorate) : profileForm.governorate} onChange={handleProfileChange} disabled={!isEditing}
                            className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all disabled:opacity-60 disabled:cursor-not-allowed" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </form>
            )}

            {/* ── Security Tab ── */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSave} className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm">
                <h2 className="text-xl font-bold text-dark mb-6">{t('settings', 'securityHeading')}</h2>
                <div className="space-y-5">
                  {/* Current password */}
                  <div>
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'currentPassword')}</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                      <input type={showPass.current ? 'text' : 'password'} name="currentPassword" value={passForm.currentPassword} onChange={handlePassChange}
                        className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all" />
                      <button type="button" onClick={() => setShowPass({ ...showPass, current: !showPass.current })}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 hover:text-gold transition-all">
                        {showPass.current ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passErrors.currentPassword && <p className="text-red-500 text-xs mt-1">{passErrors.currentPassword}</p>}
                  </div>
                  {/* New password */}
                  <div>
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'newPassword')}</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                      <input type={showPass.new ? 'text' : 'password'} name="newPassword" value={passForm.newPassword} onChange={handlePassChange}
                        className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all" />
                      <button type="button" onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 hover:text-gold transition-all">
                        {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <PasswordStrength password={passForm.newPassword} />
                    {passErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passErrors.newPassword}</p>}
                  </div>
                  {/* Confirm password */}
                  <div>
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('settings', 'confirmPassword')}</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                      <input type={showPass.confirm ? 'text' : 'password'} name="confirmPassword" value={passForm.confirmPassword} onChange={handlePassChange}
                        className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all" />
                      <button type="button" onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 hover:text-gold transition-all">
                        {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{passErrors.confirmPassword}</p>}
                  </div>
                  {/* Submit */}
                  <div className="flex justify-end pt-2">
                    <button type="submit"
                      className="flex items-center gap-2 bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
                      {passSaved ? t('settings', 'passwordUpdated') : t('settings', 'saveChanges')}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ── Subscription Tab ── */}
            {activeTab === 'subscription' && (
              <div className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm">
                <h2 className="text-xl font-bold text-dark mb-6">{t('settings', 'subscriptionHeading')}</h2>

                {role === USER_ROLES.COMPANY ? (
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 flex items-start gap-3">
                    <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700">{t('settings', 'companySubscriptionMsg')}</p>
                  </div>
                ) : (
                  <>
                    {user?.plan && user.plan !== 'free' ? (
                      <div className="bg-gradient-to-l from-dark to-darkLight rounded-2xl p-6 text-white mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-white/60 text-xs mb-1">{t('settings', 'currentPlan')}</p>
                            <p className="text-xl font-bold">{t('settings', 'currentPlan')}</p>
                          </div>
                          <span className={`${planColors[user.plan]} text-white px-4 py-2 rounded-full font-bold text-sm`}>
                            {planLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <Crown size={16} className="text-gold" />
                          <span>{planPrice > 0 ? `${planPrice} ر.س / شهرياً` : t('settings', 'noSubscription')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Crown className="text-gold/30 mx-auto mb-4" size={64} />
                        <p className="text-dark/50 mb-6">{t('settings', 'noSubscription')}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => navigate('/subscriptions/plans')}
                        className="flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-darkLight transition-all">
                        {t('settings', 'viewPlans')}
                      </button>
                      <button onClick={() => navigate('/subscriptions/my')}
                        className="flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-6 py-3 rounded-xl font-bold text-sm hover:bg-gold/20 transition-all">
                        {t('settings', 'mySubscription')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
