import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  getStats,
  getAllUserScans,
  getAllScansWithDetails,
  getAllRevenueDetails,
  findUserById,
  getUserFullDetail,
} from '../../data/db'
import { useLanguage } from '../../context/LanguageContext'
import Modal from '../../components/Modal'
import {
  Users,
  Building2,
  Tags,
  DollarSign,
  ScanLine,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Activity,
} from 'lucide-react'
import { PLAN_IDS } from '../../types/subscription'

export default function AdminDashboard() {
  const { t, td, lang } = useLanguage()
  const [stats, setStats] = useState(null)
  const [recentScans, setRecentScans] = useState([])
  const [userDetail, setUserDetail] = useState(null)
  const [usageScans, setUsageScans] = useState([])
  const [showUsageModal, setShowUsageModal] = useState(false)
  const [revenueUsers, setRevenueUsers] = useState([])
  const [showRevenueModal, setShowRevenueModal] = useState(false)

  useEffect(() => {
    setStats(getStats())
    const scans = getAllUserScans().slice(-5).reverse()
    setRecentScans(scans)
  }, [])

  if (!stats) return null

  const openUsageModal = () => {
    setUsageScans(getAllScansWithDetails())
    setShowUsageModal(true)
  }

  const openRevenueModal = () => {
    setRevenueUsers(getAllRevenueDetails())
    setShowRevenueModal(true)
  }

  const primaryStats = [
    { label: t('adminDashboard', 'totalUsers'), value: stats.totalUsers, icon: Users, href: '/dashboard/admin/users', color: 'text-blue-500' },
    { label: t('adminDashboard', 'totalCompanies'), value: stats.totalCompanies, icon: Building2, href: '/dashboard/admin/companies', color: 'text-orange-500' },
    { label: t('adminDashboard', 'totalDiscounts'), value: stats.totalDiscounts, icon: Tags, href: '/dashboard/admin/discounts', color: 'text-purple-500' },
    { label: t('adminDashboard', 'totalDiscountUsage'), value: stats.totalScans, icon: ScanLine, color: 'text-emerald-500', onClick: openUsageModal },
  ]

  return (
    <>
      <Helmet><title>{t('adminDashboard', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-dark mb-2">{t('adminDashboard', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{t('adminDashboard', 'subtitle')}</p>

            {/* Primary stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {primaryStats.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  {s.href ? (
                    <Link to={s.href} className="block bg-white rounded-2xl p-5 border border-gold/10 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-dark/50 text-xs">{s.label}</span>
                        <s.icon className={s.color} size={22} />
                      </div>
                      <p className="text-2xl font-bold text-dark">{s.value}</p>
                    </Link>
                  ) : s.onClick ? (
                    <button onClick={s.onClick} className="w-full text-right bg-white rounded-2xl p-5 border border-gold/10 shadow-sm hover:shadow-md hover:border-gold/30 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-dark/50 text-xs">{s.label}</span>
                        <s.icon className={s.color} size={22} />
                      </div>
                      <p className="text-2xl font-bold text-dark">{s.value}</p>
                    </button>
                  ) : (
                    <div className="bg-white rounded-2xl p-5 border border-gold/10 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-dark/50 text-xs">{s.label}</span>
                        <s.icon className={s.color} size={22} />
                      </div>
                      <p className="text-2xl font-bold text-dark">{s.value}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Monthly Revenue */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-dark mb-4">{t('adminDashboard', 'revenue')}</h2>
              <div className="w-full md:w-1/3">
                <button onClick={openRevenueModal} className="w-full text-right bg-white rounded-2xl p-5 border border-gold/10 shadow-sm hover:shadow-md hover:border-gold/30 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-dark/50 text-xs">{t('adminDashboard', 'revenue')}</span>
                    <DollarSign className="text-gold" size={22} />
                  </div>
                  <p className="text-2xl font-bold text-dark">{stats.totalRevenue} {t('pricing', 'egp')}</p>
                </button>
              </div>
            </div>

            {/* Quick links */}
            <h2 className="text-2xl font-bold text-dark mb-6">{t('adminDashboard', 'quickManage')}</h2>
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              {[
                { label: t('adminDashboard', 'manageUsers'), href: '/dashboard/admin/users', icon: Users },
                { label: t('adminDashboard', 'manageCompanies'), href: '/dashboard/admin/companies', icon: Building2 },
                { label: t('adminDashboard', 'manageDiscounts'), href: '/dashboard/admin/discounts', icon: Tags },
                { label: 'التصنيفات', href: '/dashboard/admin/categories', icon: Tags },
                { label: 'الميزات', href: '/dashboard/admin/features', icon: Tags },
                { label: 'التفاعلات', href: '/dashboard/admin/interactions', icon: Tags },
                { label: 'التسويات', href: '/dashboard/admin/settlements', icon: Tags },
              ].map((link, i) => (
                <Link key={i} to={link.href}>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                    className="bg-dark rounded-2xl p-6 text-white hover:bg-darkLight transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <link.icon className="text-gold" size={24} />
                      <span className="font-bold">{link.label}</span>
                    </div>
                    <ArrowLeft size={18} className="text-gold/50 group-hover:-translate-x-1 transition-transform" />
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Recent activity */}
            <h2 className="text-2xl font-bold text-dark mb-6">{t('adminDashboard', 'recentActivity')}</h2>
            <div className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-hidden">
              {recentScans.length === 0 ? (
                <p className="p-8 text-dark/50 text-center">{t('adminDashboard', 'noRecentActivity')}</p>
              ) : (
                <div className="divide-y divide-gold/10">
                  {recentScans.map((scan, i) => {
                    const scanner = findUserById(scan.user_id)
                    return (
                      <div key={i} className="flex items-center justify-between p-4 hover:bg-gold/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-bold cursor-pointer"
                            onClick={() => setUserDetail(scanner ? getUserFullDetail(scanner.id) : null)}>
                            {scanner?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <button onClick={() => setUserDetail(scanner ? getUserFullDetail(scanner.id) : null)}
                              className="font-semibold text-dark text-sm hover:text-gold transition-colors text-right">
                              {scanner?.name || t('adminDashboard', 'user')}
                            </button>
                            <p className="text-dark/40 text-xs">{t('adminDashboard', 'scannedDiscount')} #{scan.discount_id}</p>
                          </div>
                        </div>
                        <span className="text-dark/30 text-xs">
                          {new Date(scan.scanned_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      {/* User Detail Modal */}
      <Modal open={!!userDetail} onClose={() => setUserDetail(null)}
        title={`${t('adminUsers', 'userDetails')}: ${userDetail?.user?.name || ''}`}
        size="xl">
        {userDetail && (
          <div className="space-y-6">
            {/* ── User Info Card ── */}
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
                  <span className="text-dark">{userDetail.user.job}</span>
                </div>
                <div className="flex items-center gap-2 text-dark/70">
                  <Calendar size={14} className="shrink-0 text-dark/40" />
                  <span className="font-semibold text-dark/60">{t('adminUsers', 'joinDate')}:</span>
                  <span className="text-dark">{new Date(userDetail.user.join_date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                </div>
                <div className="flex items-center gap-2 text-dark/70">
                  <span className="font-semibold text-dark/60">{t('adminUsers', 'plan')}:</span>
                  <span className="text-dark font-bold">{userDetail.user.plan}</span>
                </div>
                <div className="flex items-center gap-2 text-dark/70">
                  <Activity size={14} className="shrink-0 text-dark/40" />
                  <span className="font-semibold text-dark/60">{t('adminUsers', 'totalSaved')}:</span>
                  <span className="text-emerald-600 font-bold">{userDetail.user.saved.toFixed(0)} {t('pricing', 'egp')}</span>
                </div>
              </div>
            </div>

            {/* ── Scan History ── */}
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
                          <td className="py-2 px-3 text-dark font-semibold text-xs">{s.discount?.name || `#${s.discount_id}`}</td>
                          <td className="py-2 px-3 text-dark/50 font-mono text-xs" dir="ltr">{s.invoice_id}</td>
                          <td className="py-2 px-3 text-dark text-xs">{s.product}</td>
                          <td className="py-2 px-3 text-dark/70 text-xs">{s.original_price} {t('pricing', 'egp')}</td>
                          <td className="py-2 px-3 text-emerald-600 font-bold text-xs">-{s.discount_value} {t('pricing', 'egp')}</td>
                          <td className="py-2 px-3 text-dark font-bold text-xs">{s.final_price} {t('pricing', 'egp')}</td>
                          <td className="py-2 px-3 text-dark/40 text-xs whitespace-nowrap">{new Date(s.scanned_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-dark/40 text-sm text-center py-4">{t('adminUsers', 'noScans')}</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Discount Usage Detail Modal */}
      <Modal open={showUsageModal} onClose={() => setShowUsageModal(false)}
        title={t('adminDashboard', 'usageModalTitle')}
        size="xl">
        {usageScans.length > 0 ? (() => {
          const grouped = usageScans.reduce((acc, s) => {
            const uid = s.user?.id || 'unknown'
            if (!acc[uid]) acc[uid] = { user: s.user, scans: [] }
            acc[uid].scans.push(s)
            return acc
          }, {})
          return (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-cream rounded-xl p-5 border border-gold/10">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-dark/70">
                    <Users size={16} className="shrink-0 text-dark/40" />
                    <span>{t('adminDashboard', 'totalUsers')}: <strong>{Object.keys(grouped).length}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-dark/70">
                    <ScanLine size={16} className="shrink-0 text-dark/40" />
                    <span>{t('adminDashboard', 'usageModalTotalScans')}: <strong>{usageScans.length}</strong></span>
                  </div>
                </div>
              </div>

              {/* Per-user groups */}
              {Object.entries(grouped).map(([uid, group]) => (
                <div key={uid} className="bg-cream rounded-xl p-5 border border-gold/10">
                  {/* User header */}
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gold/10">
                    <div className="w-9 h-9 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-bold shrink-0">
                      {group.user?.name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-dark">{td('users', group.user?.name)}</span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-dark/50 mt-0.5">
                        <span>{group.user?.email}</span>
                        {group.user?.phone && <span>{group.user.phone}</span>}
                        <span>{group.user?.job}</span>
                        <span>{group.user?.plan}</span>
                      </div>
                    </div>
                  </div>

                  {/* Scan table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gold/20">
                          <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs whitespace-nowrap">{t('adminDashboard', 'usageModalDate')}</th>
                          <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs">{t('adminUsers', 'discountName')}</th>
                          <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs">{t('adminDashboard', 'usageModalCategory')}</th>
                          <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs">{t('adminUsers', 'invoice')}</th>
                          <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs">{t('adminUsers', 'product')}</th>
                          <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs">{t('adminUsers', 'originalPrice')}</th>
                          <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs">{t('adminUsers', 'discountValue')}</th>
                          <th className="text-right py-2 px-3 font-bold text-dark/60 text-xs">{t('adminUsers', 'finalPrice')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold/5">
                        {group.scans.map((s, i) => (
                          <tr key={i} className="hover:bg-white/50 transition-colors">
                            <td className="py-2 px-3 text-dark/40 text-xs whitespace-nowrap">
                              {new Date(s.scanned_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="py-2 px-3 text-dark font-semibold text-xs">{s.discount?.name || `#${s.discount_id}`}</td>
                            <td className="py-2 px-3 text-dark/60 text-xs">{s.discount?.category || '—'}</td>
                            <td className="py-2 px-3 text-dark/50 font-mono text-xs" dir="ltr">{s.invoice_id}</td>
                            <td className="py-2 px-3 text-dark text-xs">{s.product}</td>
                            <td className="py-2 px-3 text-dark/70 text-xs">{s.original_price} {t('pricing', 'egp')}</td>
                            <td className="py-2 px-3 text-emerald-600 font-bold text-xs">-{s.discount_value} {t('pricing', 'egp')}</td>
                            <td className="py-2 px-3 text-dark font-bold text-xs">{s.final_price} {t('pricing', 'egp')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )
        })() : (
          <p className="text-dark/40 text-sm text-center py-8">{t('adminDashboard', 'usageModalNoData')}</p>
        )}
      </Modal>

      {/* Revenue Detail Modal */}
      <Modal open={showRevenueModal} onClose={() => setShowRevenueModal(false)}
        title={t('adminDashboard', 'revenueModalTitle')}
        size="xl">
        {revenueUsers.length > 0 ? (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <p className="text-emerald-700 text-xs font-semibold mb-1">{t('adminDashboard', 'revenueModalMrr')}</p>
                <p className="text-2xl font-bold text-emerald-800">
                  {revenueUsers.reduce((s, u) => s + u.planRevenue, 0)} {t('pricing', 'egp')}
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-blue-700 text-xs font-semibold mb-1">{t('adminDashboard', 'revenueModalPremium')}</p>
                <p className="text-2xl font-bold text-blue-800">
                  {revenueUsers.filter(u => u.plan === PLAN_IDS.PREMIUM).length} <span className="text-sm font-normal text-blue-600">× 99</span>
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <p className="text-purple-700 text-xs font-semibold mb-1">{t('adminDashboard', 'revenueModalElite')}</p>
                <p className="text-2xl font-bold text-purple-800">
                  {revenueUsers.filter(u => u.plan === PLAN_IDS.ELITE).length} <span className="text-sm font-normal text-purple-600">× 199</span>
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-600 text-xs font-semibold mb-1">{t('adminDashboard', 'revenueModalFree')}</p>
                <p className="text-2xl font-bold text-gray-700">{revenueUsers.filter(u => u.plan === PLAN_IDS.FREE).length}</p>
              </div>
            </div>

            {/* Per-user breakdown */}
            {revenueUsers.map((u, i) => (
              <div key={u.id} className="bg-cream rounded-xl p-5 border border-gold/10">
                {/* User header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gold/10">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold shrink-0">
                    {u.name?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-dark">{u.name}</span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${u.subscriptionStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {u.subscriptionStatus === 'active' ? t('adminUsers', 'active') : t('adminUsers', 'subscriptionStatus')}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-dark/50 mt-0.5">
                      <span className="flex items-center gap-1"><Mail size={11} className="shrink-0" />{u.email}</span>
                      <span className="flex items-center gap-1"><Phone size={11} className="shrink-0" />{u.phone || '—'}</span>
                      <span className="flex items-center gap-1"><Briefcase size={11} className="shrink-0" />{u.job}</span>
                      <span className="flex items-center gap-1"><Calendar size={11} className="shrink-0" />{new Date(u.join_date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                    </div>
                  </div>
                </div>

                {/* Revenue & activity stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white rounded-lg p-3 border border-gold/5">
                    <p className="text-dark/40 text-xs">{t('adminDashboard', 'revenueModalPlanRevenue')}</p>
                    <p className="text-dark font-bold text-sm mt-0.5">{u.planRevenue} {t('pricing', 'egp')}<span className="text-dark/40 font-normal text-xs"> / {t('pricing', 'monthly')}</span></p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gold/5">
                    <p className="text-dark/40 text-xs">{t('adminUsers', 'plan')}</p>
                    <p className="text-dark font-bold text-sm mt-0.5">{u.plan}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gold/5">
                    <p className="text-dark/40 text-xs">{t('adminUsers', 'scans')}</p>
                    <p className="text-dark font-bold text-sm mt-0.5">{u.totalScans}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gold/5">
                    <p className="text-dark/40 text-xs">{t('adminUsers', 'totalSaved')}</p>
                    <p className="text-emerald-600 font-bold text-sm mt-0.5">{u.totalScanSaved.toFixed(0)} {t('pricing', 'egp')}</p>
                  </div>
                </div>

                {/* Installments */}
                {u.userInstallments.length > 0 && (
                  <div className="bg-white rounded-lg p-3 border border-gold/5">
                    <h4 className="flex items-center gap-1.5 text-xs font-bold text-dark mb-2">
                      <DollarSign size={13} className="text-gold" />
                      {t('adminDashboard', 'revenueModalInstallments')} ({u.totalInstallments})
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gold/10">
                            <th className="text-right py-1.5 px-2 font-bold text-dark/50">{t('adminUsers', 'installmentName')}</th>
                            <th className="text-right py-1.5 px-2 font-bold text-dark/50">{t('pricing', 'egp')}</th>
                            <th className="text-right py-1.5 px-2 font-bold text-dark/50">{t('adminDashboard', 'revenueModalPaid')}</th>
                            <th className="text-right py-1.5 px-2 font-bold text-dark/50">{t('adminDashboard', 'revenueModalRemaining')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gold/5">
                          {u.userInstallments.map((inst, j) => (
                            <tr key={j} className="hover:bg-cream/50 transition-colors">
                              <td className="py-1.5 px-2 text-dark font-semibold">{inst.name}</td>
                              <td className="py-1.5 px-2 text-dark/70">{inst.total.toFixed(0)} {t('pricing', 'egp')}</td>
                              <td className="py-1.5 px-2 text-emerald-600 font-bold">{inst.paid.toFixed(0)} {t('pricing', 'egp')}</td>
                              <td className="py-1.5 px-2 text-orange-600 font-bold">{(inst.total - inst.paid).toFixed(0)} {t('pricing', 'egp')}</td>
  
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Scan history summary */}
                {u.userScans.length > 0 && (
                  <div className="mt-3">
                    <details className="group">
                      <summary className="text-xs text-gold font-semibold cursor-pointer hover:text-gold/70 transition-colors list-none flex items-center gap-1">
                        <Activity size={13} />
                        {t('adminUsers', 'scanHistory')} ({u.totalScans})
                        <span className="text-dark/20 group-open:rotate-180 transition-transform ml-1">▼</span>
                      </summary>
                      <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gold/10">
                              <th className="text-right py-1.5 px-2 font-bold text-dark/50">{t('adminDashboard', 'usageModalDate')}</th>
                              <th className="text-right py-1.5 px-2 font-bold text-dark/50">{t('adminUsers', 'discountName')}</th>
                              <th className="text-right py-1.5 px-2 font-bold text-dark/50">{t('adminUsers', 'invoice')}</th>
                              <th className="text-right py-1.5 px-2 font-bold text-dark/50">{t('adminUsers', 'product')}</th>
                              <th className="text-right py-1.5 px-2 font-bold text-dark/50">{t('adminUsers', 'originalPrice')}</th>
                              <th className="text-right py-1.5 px-2 font-bold text-dark/50">{t('adminUsers', 'discountValue')}</th>
                              <th className="text-right py-1.5 px-2 font-bold text-dark/50">{t('adminUsers', 'finalPrice')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gold/5">
                            {u.userScans.map((s, j) => (
                              <tr key={j} className="hover:bg-white/50 transition-colors">
                                <td className="py-1.5 px-2 text-dark/40 whitespace-nowrap">{new Date(s.scanned_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                <td className="py-1.5 px-2 text-dark font-semibold">#{s.discount_id}</td>
                                <td className="py-1.5 px-2 text-dark/50 font-mono" dir="ltr">{s.invoice_id}</td>
                                <td className="py-1.5 px-2 text-dark">{s.product}</td>
                                <td className="py-1.5 px-2 text-dark/70">{s.original_price} {t('pricing', 'egp')}</td>
                                <td className="py-1.5 px-2 text-emerald-600 font-bold">-{s.discount_value} {t('pricing', 'egp')}</td>
                                <td className="py-1.5 px-2 text-dark font-bold">{s.final_price} {t('pricing', 'egp')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-dark/40 text-sm text-center py-8">{t('adminDashboard', 'revenueModalNoData')}</p>
        )}
      </Modal>

    </>
  )
}
