import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getDiscountsByCompany } from '../../data/db'

import CompanyBranches from '../../components/CompanyBranches'
import CompanyAdmins from '../../components/CompanyAdmins'
import { Eye, Activity, Tag, Percent, Clock, Building2, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'

export default function CompanyDashboard() {
  const { company } = useAuth()
  const { t, td, lang } = useLanguage()
  const [discounts, setDiscounts] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (company) setDiscounts(getDiscountsByCompany(company.id))
  }, [company])

  if (!company) return null

  const totalViews = discounts.reduce((sum, d) => sum + d.views, 0)
  const totalUses = discounts.reduce((sum, d) => sum + d.uses, 0)

  const stats = [
    { label: t('companyAnalytics', 'totalViews'), value: totalViews, icon: Eye, color: 'text-blue-500' },
    { label: t('companyAnalytics', 'totalUses'), value: totalUses, icon: Activity, color: 'text-emerald-500' },
    { label: t('companyDashboard', 'offeredDiscounts'), value: discounts.length, icon: Tag, color: 'text-gold' },
    { label: t('companyAnalytics', 'commission'), value: `${company.commission}%`, icon: Percent, color: 'text-purple-500' },
  ]

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700' }
  const statusLabels = { pending: t('companyDiscounts', 'pending'), approved: t('companyDiscounts', 'approved'), rejected: t('companyDiscounts', 'rejected') }

  const tabs = [
    { id: 'overview', label: t('companyDashboard', 'overview') || 'الرئيسية', icon: Tag },
    { id: 'branches', label: t('companyDashboard', 'branches') || 'الفروع', icon: Building2 },
    { id: 'admins', label: t('companyDashboard', 'admins') || 'المشرفين', icon: Users },
  ]

  return (
    <>
      <Helmet><title>{t('companyDashboard', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-dark mb-2">{t('companyDashboard', 'welcome')} {td('companies', company.name)}</h1>
            <p className="text-dark/60 mb-6">{t('companyDashboard', 'overview')}</p>

            {/* Tabs */}
            <div className="flex gap-1 mb-8 bg-white rounded-2xl p-1.5 border border-gold/10 shadow-sm w-fit">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-dark text-white shadow-md'
                      : 'text-dark/50 hover:text-dark hover:bg-dark/5'
                  }`}>
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <>
              {/* Pending banner */}
              {company.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 flex items-center gap-3 mb-8">
                  <Clock className="text-yellow-600" size={24} />
                  <div>
                    <p className="font-bold text-yellow-800">{t('companyDashboard', 'pendingTitle')}</p>
                    <p className="text-yellow-600 text-sm">{t('companyDashboard', 'pendingDesc')}</p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-4 mb-12">
                {stats.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl p-5 border border-gold/10 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-dark/50 text-xs">{s.label}</span>
                      <s.icon className={s.color} size={22} />
                    </div>
                    <p className="text-2xl font-bold text-dark">{s.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick actions */}
              <h2 className="text-2xl font-bold text-dark mb-6">{t('companyDashboard', 'quickActions')}</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-12">
                {[
                  { label: t('companyDashboard', 'manageDiscounts'), href: '/dashboard/company/discounts', icon: Tag },
                  { label: t('companyDashboard', 'analyticsLink'), href: '/dashboard/company/analytics', icon: Activity },
                  { label: t('companyDashboard', 'profileLink'), href: '/dashboard/company/profile', icon: Percent },
                ].map((link, i) => (
                  <Link key={i} to={link.href}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                      className="bg-dark rounded-2xl p-6 text-white hover:bg-darkLight transition-all flex items-center gap-3 group">
                      <link.icon className="text-gold" size={24} />
                      <span className="font-bold">{link.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Company info card */}
              <div className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm">
                <h3 className="text-xl font-bold text-dark mb-4">{t('companyDashboard', 'companyInfo')}</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-dark/40">{t('companyDashboard', 'accountNumber')}</p>
                    <p className="font-bold text-dark mt-1" dir="ltr">{company.id}</p>
                  </div>
                  <div>
                    <p className="text-dark/40">{t('companyDashboard', 'status')}</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-xl text-xs font-bold ${statusColors[company.status]}`}>
                      {statusLabels[company.status]}
                    </span>
                  </div>
                  <div>
                    <p className="text-dark/40">{t('companyDashboard', 'joinDate')}</p>
                    <p className="font-bold text-dark mt-1">{new Date(company.join_date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                  </div>
                </div>
              </div>
              </>
            )}

            {activeTab === 'branches' && (
              <CompanyBranches companyId={company.id} />
            )}

            {activeTab === 'admins' && (
              <CompanyAdmins companyId={company.id} />
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
