import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { getAllUsers, updateUser, deleteUser, getUserFullDetail, removeUserSubscription } from '../../data/db'
import BackButton from '../../components/BackButton'
import Modal from '../../components/Modal'
import {
  Search, Trash2, Eye, User, Mail, Phone, Briefcase, MapPin,
  Calendar, CreditCard, Shield, Activity, Clock, Tag, Percent,
  FileText, ChevronDown, ChevronUp, XCircle,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { PLAN_IDS } from '../../types/subscription'
import { USER_ROLES } from '../../types/user'

export default function AdminUsers() {
  const { t, td, lang } = useLanguage()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [subFilter, setSubFilter] = useState('all')
  const [userDetail, setUserDetail] = useState(null)

  useEffect(() => { setUsers(getAllUsers()) }, [])

  const subCounts = {
    active: users.filter(u => u.plan === PLAN_IDS.PREMIUM || u.plan === PLAN_IDS.ELITE).length,
    inactive: users.filter(u => u.plan === PLAN_IDS.FREE).length,
    pending: users.filter(u => u.plan !== PLAN_IDS.FREE && u.plan !== PLAN_IDS.PREMIUM && u.plan !== PLAN_IDS.ELITE).length,
  }

  const q = search.trim().toLowerCase()
  const filtered = users.filter(u =>
    (planFilter === 'all' || u.plan === planFilter) &&
    (subFilter === 'all' ||
      (subFilter === 'active' && (u.plan === PLAN_IDS.PREMIUM || u.plan === PLAN_IDS.ELITE)) ||
      (subFilter === 'inactive' && u.plan === PLAN_IDS.FREE) ||
      (subFilter === 'pending' && u.plan !== PLAN_IDS.FREE && u.plan !== PLAN_IDS.PREMIUM && u.plan !== PLAN_IDS.ELITE)) &&
    (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q))
  )

  const handlePlanChange = (id, plan) => {
    updateUser(id, { plan })
    setUsers(getAllUsers())
  }

  const handleCancelSubscription = (id) => {
    if (window.confirm(t('adminUsers', 'confirmCancelSub'))) {
      removeUserSubscription(id)
      setUsers(getAllUsers())
      // Refresh user detail if open
      if (userDetail?.user?.id === id) {
        setUserDetail(getUserFullDetail(id))
      }
    }
  }

  const handleDelete = (id) => {
    if (window.confirm(t('adminUsers', 'confirmDelete'))) {
      deleteUser(id)
      setUsers(getAllUsers())
    }
  }

  const handleViewUser = (id) => {
    setUserDetail(getUserFullDetail(id))
  }

  const getSubStatus = (plan) => {
    if (plan === PLAN_IDS.PREMIUM || plan === PLAN_IDS.ELITE) return { label: t('adminUsers', 'subActive'), color: 'bg-emerald-100 text-emerald-700' }
    if (plan === PLAN_IDS.FREE) return { label: t('adminUsers', 'subInactive'), color: 'bg-gray-100 text-gray-500' }
    return { label: t('adminUsers', 'subPending'), color: 'bg-yellow-100 text-yellow-700' }
  }

  const dateTimeFormat = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const dateFormat = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  }

  const planColors = { free: 'bg-gray-100 text-gray-600', premium: 'bg-yellow-100 text-yellow-700', elite: 'bg-emerald-100 text-emerald-700' }
  const planLabels = { free: t('adminUsers', 'free'), premium: t('adminUsers', 'premium'), elite: t('adminUsers', 'elite') }
  const planBadgeColors = { free: 'bg-gray-200 text-gray-700', premium: 'bg-yellow-200 text-yellow-800', elite: 'bg-emerald-200 text-emerald-800' }

  return (
    <>
      <Helmet><title>{t('adminUsers', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <h1 className="text-3xl font-bold text-dark mb-2">{t('adminUsers', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{users.length}</p>

            {/* Search + Filter */}
            <div className="bg-white rounded-2xl p-4 border border-gold/10 shadow-sm mb-6">
              <div className="relative mb-4">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('adminUsers', 'search')}
                  className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3 text-dark outline-none focus:border-gold/60 transition-all" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'free', 'premium', 'elite'].map(p => (
                  <button key={p} onClick={() => setPlanFilter(p)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${planFilter === p ? 'bg-dark text-white' : 'bg-cream text-dark/60 hover:bg-dark/10'}`}>
                    {p === 'all' ? t('adminUsers', 'all') : planLabels[p]}
                  </button>
                ))}
              </div>
              {/* ── Subscription Status Filter ── */}
              <div className="mt-3 pt-3 border-t border-gold/10">
                <div className="flex gap-2 flex-wrap">
                  {[
                    { key: 'all', label: t('adminUsers', 'all') },
                    { key: 'active', label: `${t('adminUsers', 'subActive')} (${subCounts.active})`, color: 'text-emerald-600' },
                    { key: 'inactive', label: `${t('adminUsers', 'subInactive')} (${subCounts.inactive})`, color: 'text-gray-500' },
                    { key: 'pending', label: `${t('adminUsers', 'subPending')} (${subCounts.pending})`, color: 'text-yellow-600' },
                  ].map(({ key, label, color }) => (
                    <button key={key} onClick={() => setSubFilter(subFilter === key ? 'all' : key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        subFilter === key
                          ? (color ? color.replace('text-', 'bg-').replace('-600', '-100') + ' ' + color + ' border border-current' : 'bg-dark text-white')
                          : 'bg-cream text-dark/40 hover:bg-dark/5'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Users table */}
            <div className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-gold/10 bg-cream">
                    <th className="p-4 text-dark font-bold text-sm">{t('adminUsers', 'name')}</th>
                    <th className="p-4 text-dark font-bold text-sm hidden md:table-cell">{t('adminUsers', 'email')}</th>
                    <th className="p-4 text-dark font-bold text-sm hidden lg:table-cell">{t('adminUsers', 'job')}</th>
                    <th className="p-4 text-dark font-bold text-sm">{t('adminUsers', 'plan')}</th>
                    <th className="p-4 text-dark font-bold text-sm hidden lg:table-cell">{t('adminUsers', 'scans')}</th>
                    <th className="p-4 text-dark font-bold text-sm hidden lg:table-cell">{t('adminUsers', 'saved')}</th>
                    <th className="p-4 text-dark font-bold text-sm">{t('adminUsers', 'actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {filtered.map((u, i) => (
                    <tr key={u.id} className="hover:bg-gold/5 transition-colors">
                      <td className="p-4">
                        <button onClick={() => handleViewUser(u.id)}
                          className="font-bold text-dark hover:text-gold transition-colors text-right">
                          {td('users', u.name)}
                        </button>
                        <p className="text-dark/40 text-xs" dir="ltr">{u.id}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell text-dark/70 text-sm">{u.email}</td>
                      <td className="p-4 hidden lg:table-cell text-dark/70 text-sm">{td('jobs', u.job)}</td>
                       <td className="p-4">
                         <select value={u.plan} onChange={e => handlePlanChange(u.id, e.target.value)}
                           className={`px-3 py-1.5 rounded-xl text-xs font-bold border-0 cursor-pointer outline-none ${planColors[u.plan]}`}>
                           <option value={PLAN_IDS.FREE}>{t('adminUsers', 'free')}</option>
                           <option value={PLAN_IDS.PREMIUM}>{t('adminUsers', 'premium')}</option>
                           <option value={PLAN_IDS.ELITE}>{t('adminUsers', 'elite')}</option>
                         </select>
                       </td>
                      <td className="p-4 hidden lg:table-cell text-dark/70 text-sm">{u.scans}</td>
                      <td className="p-4 hidden lg:table-cell text-dark/70 text-sm">{u.saved.toFixed(0)} {t('pricing', 'egp')}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleViewUser(u.id)}
                            className="text-gold hover:text-gold/70 transition-colors p-2" title={t('adminUsers', 'userDetails')}>
                            <Eye size={16} />
                          </button>
                          <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-600 transition-colors p-2" title={t('adminUsers', 'delete')}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="p-8 text-center text-dark/50">{t('adminUsers', 'noUsers')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* User Details Modal */}
      <Modal open={!!userDetail} onClose={() => setUserDetail(null)}
        title={`${t('adminUsers', 'userDetails')}: ${td('users', userDetail?.user?.name || '')}`}
        size="xl">
        {userDetail && (
          <div className="space-y-6">
            {/* ── User Info Card ────────────────────────────── */}
            <div className="bg-cream rounded-xl p-5 border border-gold/10">
              <h3 className="flex items-center gap-2 font-bold text-dark mb-4">
                <User size={18} className="text-gold" />
                {t('adminUsers', 'userInfo')}
              </h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div className="flex items-center gap-2 text-dark/70">
                  <Mail size={14} className="shrink-0 text-dark/40" />
                  <span className="font-semibold text-dark/60">{t('adminUsers', 'email')}:</span>
                  <span dir="ltr" className="text-dark">{userDetail.user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-dark/70">
                  <Phone size={14} className="shrink-0 text-dark/40" />
                  <span className="font-semibold text-dark/60">{t('adminUsers', 'phone')}:</span>
                  <span className="text-dark" dir="ltr">{userDetail.user.phone || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-dark/70">
                  <Briefcase size={14} className="shrink-0 text-dark/40" />
                  <span className="font-semibold text-dark/60">{t('adminUsers', 'job')}:</span>
                  <span className="text-dark">{td('jobs', userDetail.user.job)}</span>
                </div>
                <div className="flex items-center gap-2 text-dark/70">
                  <MapPin size={14} className="shrink-0 text-dark/40" />
                  <span className="font-semibold text-dark/60">{t('adminUsers', 'governorate')}:</span>
                  <span className="text-dark">{td('governorates', userDetail.user.governorate)}</span>
                </div>
                <div className="flex items-center gap-2 text-dark/70">
                  <Calendar size={14} className="shrink-0 text-dark/40" />
                  <span className="font-semibold text-dark/60">{t('adminUsers', 'joinDate')}:</span>
                  <span className="text-dark">{dateFormat(userDetail.user.join_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-dark/70">
                  <FileText size={14} className="shrink-0 text-dark/40" />
                  <span className="font-semibold text-dark/60">{t('adminUsers', 'memberId')}:</span>
                  <span className="text-dark font-mono text-xs" dir="ltr">{userDetail.user.id}</span>
                </div>
                {userDetail.user.nationalId && (
                  <div className="flex items-center gap-2 text-dark/70">
                    <Shield size={14} className="shrink-0 text-dark/40" />
                    <span className="font-semibold text-dark/60">{t('adminUsers', 'nationalId')}:</span>
                    <span className="text-dark font-mono text-xs" dir="ltr">{userDetail.user.nationalId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Subscription Card ─────────────────────────── */}
            <div className="bg-cream rounded-xl p-5 border border-gold/10">
              <h3 className="flex items-center gap-2 font-bold text-dark mb-4">
                <CreditCard size={18} className="text-gold" />
                {t('adminUsers', 'subscription')}
              </h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <div className="flex items-center gap-2 text-dark/70">
                  <Tag size={14} className="shrink-0 text-dark/40" />
                  <span className="font-semibold text-dark/60">{t('adminUsers', 'plan')}:</span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${planBadgeColors[userDetail.user.plan]}`}>
                    {planLabels[userDetail.user.plan]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-dark/70">
                  <Activity size={14} className="shrink-0 text-dark/40" />
                  <span className="font-semibold text-dark/60">{t('adminUsers', 'subscriptionStatus')}:</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${getSubStatus(userDetail.user.plan).color}`}>
                    {getSubStatus(userDetail.user.plan).label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-dark/70">
                  <span className="font-semibold text-dark/60">{t('adminUsers', 'points')}:</span>
                  <span className="text-dark font-bold">{userDetail.user.points}</span>
                </div>
                <div className="flex items-center gap-2 text-dark/70">
                  <Percent size={14} className="shrink-0 text-dark/40" />
                  <span className="font-semibold text-dark/60">{t('adminUsers', 'totalSaved')}:</span>
                  <span className="text-emerald-600 font-bold">{userDetail.user.saved.toFixed(0)} {t('pricing', 'egp')}</span>
                </div>
              </div>

              {/* Card on file */}
              {userDetail.cards.length > 0 ? (
                <div className="mt-4 pt-4 border-t border-gold/10">
                  <p className="text-sm font-bold text-dark mb-2">{t('adminUsers', 'cardOnFile')}</p>
                  {userDetail.cards.map((card, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 border border-gold/10 text-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard size={16} className="text-gold" />
                        <span className="font-mono text-dark" dir="ltr">{card.card_number}</span>
                      </div>
                      <span className="text-dark/50 text-xs">{t('adminUsers', 'cardExpiry')}: {card.expiry}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 pt-4 border-t border-gold/10 text-dark/40 text-sm">{t('adminUsers', 'noCards')}</p>
              )}

              {/* ── Cancel Subscription ── */}
              {(userDetail.user.plan === 'premium' || userDetail.user.plan === 'elite') && (
                <div className="mt-4 pt-4 border-t border-gold/10">
                  <button onClick={() => handleCancelSubscription(userDetail.user.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all text-sm font-bold">
                    <XCircle size={16} />
                    {t('adminUsers', 'cancelSubscription')}
                  </button>
                </div>
              )}
            </div>

            {/* ── Scan History ──────────────────────────────── */}
            <div className="bg-cream rounded-xl p-5 border border-gold/10">
              <h3 className="flex items-center gap-2 font-bold text-dark mb-4">
                <Activity size={18} className="text-gold" />
                {t('adminUsers', 'scanHistory')} ({userDetail.scans.length})
              </h3>
              {userDetail.scans.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gold/20">
                        <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs">{t('adminUsers', 'discountName')}</th>
                        <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs">{t('adminUsers', 'invoice')}</th>
                        <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs">{t('adminUsers', 'product')}</th>
                        <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs">{t('adminUsers', 'originalPrice')}</th>
                        <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs">{t('adminUsers', 'discountValue')}</th>
                        <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs">{t('adminUsers', 'finalPrice')}</th>
                        <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs whitespace-nowrap">{t('adminUsers', 'scanHistory')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5">
                      {userDetail.scans.map((s, i) => (
                        <tr key={i} className="hover:bg-white/50 transition-colors">
                          <td className="py-2 px-3 text-dark font-semibold text-xs">
                            {td('discounts', s.discount?.name || '', 'name')}
                          </td>
                          <td className="py-2 px-3 text-dark/50 font-mono text-xs" dir="ltr">{s.invoice_id}</td>
                          <td className="py-2 px-3 text-dark text-xs">{s.product}</td>
                          <td className="py-2 px-3 text-dark/70 text-xs">{s.original_price} {t('pricing', 'egp')}</td>
                          <td className="py-2 px-3 text-emerald-600 font-bold text-xs">-{s.discount_value} {t('pricing', 'egp')}</td>
                          <td className="py-2 px-3 text-dark font-bold text-xs">{s.final_price} {t('pricing', 'egp')}</td>
                          <td className="py-2 px-3 text-dark/40 text-xs whitespace-nowrap">
                            <Clock size={11} className="inline mr-1" />
                            {dateTimeFormat(s.scanned_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-dark/40 text-sm text-center py-4">{t('adminUsers', 'noScans')}</p>
              )}
            </div>

            {/* ── Installments ──────────────────────────────── */}
            <div className="bg-cream rounded-xl p-5 border border-gold/10">
              <h3 className="flex items-center gap-2 font-bold text-dark mb-4">
                <CreditCard size={18} className="text-gold" />
                {t('adminUsers', 'installments')} ({userDetail.installments.length})
              </h3>
              {userDetail.installments.length > 0 ? (
                <div className="space-y-3">
                  {userDetail.installments.map((inst) => (
                    <div key={inst.id} className="bg-white rounded-xl p-4 border border-gold/10">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-dark text-sm">{td('installmentNames', inst.name)}</p>
                        <div className="flex items-center gap-3 text-xs text-dark/50">
                          <span>{t('adminUsers', 'monthly')}: <span className="font-bold text-dark">{inst.monthly_amount} {t('pricing', 'egp')}</span></span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="text-dark/50">{t('adminUsers', 'total')}:</span>
                          <span className="mr-1 font-bold text-dark">{inst.total} {t('pricing', 'egp')}</span>
                        </div>
                        <div>
                          <span className="text-dark/50">{t('adminUsers', 'paid')}:</span>
                          <span className="mr-1 font-bold text-emerald-600">{inst.paid} {t('pricing', 'egp')}</span>
                        </div>
                        <div>
                          <span className="text-dark/50">{t('adminUsers', 'remaining')}:</span>
                          <span className="mr-1 font-bold text-dark">{(inst.total - inst.paid).toFixed(2)} {t('pricing', 'egp')}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-dark/40">
                        {t('adminUsers', 'nextDue')}: {dateFormat(inst.next_due)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark/40 text-sm text-center py-4">{t('adminUsers', 'noInstallments')}</p>
              )}
            </div>

            {/* ── Enrollments ───────────────────────────────── */}
            <div className="bg-cream rounded-xl p-5 border border-gold/10">
              <h3 className="flex items-center gap-2 font-bold text-dark mb-4">
                <Shield size={18} className="text-gold" />
                {t('adminUsers', 'enrollments')} ({userDetail.enrollments.length})
              </h3>
              {userDetail.enrollments.length > 0 ? (
                <div className="space-y-3">
                  {userDetail.enrollments.map((e) => (
                    <div key={e.id} className="bg-white rounded-xl p-4 border border-gold/10">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${e.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                            {e.status === 'active' ? t('adminUsers', 'active') : t('adminUsers', 'enrollmentType')}
                          </span>
                          <span className="font-bold text-dark text-sm">
                            {e.service_type === 'medical'
                              ? t('adminUsers', 'medicalCenter')
                              : e.service_type === 'financial'
                                ? t('adminUsers', 'bank')
                                : t('adminUsers', 'enrollmentType')}
                          </span>
                        </div>
                        <span className="text-dark/40 text-xs">
                          <Calendar size={11} className="inline mr-1" />
                          {t('adminUsers', 'enrolledAt')}: {dateFormat(e.enrolled_at)}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-dark/60">
                        {e.center && <span>{td('medicalCenters', e.center.name, 'name')}</span>}
                        {e.bank && <span>{td('banks', e.bank.name, 'name')}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark/40 text-sm text-center py-4">{t('adminUsers', 'noEnrollments')}</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
