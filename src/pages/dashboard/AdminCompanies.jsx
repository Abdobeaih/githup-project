import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { getAllCompanies, getAllUsers, updateCompany, getDiscountsByCompany, getAllUserScans, getUserCards, getUserInstallments, getUserScans, getSubscribersByServiceType } from '../../data/db'
import BackButton from '../../components/BackButton'
import Modal from '../../components/Modal'
import { Search, CheckCircle, XCircle, Building2, BarChart3, Eye, MousePointerClick, UserCheck, Calendar, ChevronDown, ChevronUp, X, Receipt, CreditCard, Hash, User, Package, CalendarDays, DollarSign, BadgePercent, FileText, MapPin, Phone, Mail, Briefcase, Shield, Clock, Layers, ChevronRight, ChevronLeft, Users } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { COMPANY_CATEGORIES } from '../../types/company'
import { PLAN_IDS } from '../../types/subscription'
import { USER_ROLES } from '../../types/user'

function formatDate(iso) {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function getCompanyUsage(companyId) {
  const discounts = getDiscountsByCompany(companyId)
  const allScans = getAllUserScans()
  const users = getAllUsers()
  const userMap = {}
  users.forEach(u => { userMap[u.id] = u })

  const discountIds = discounts.map(d => d.id)
  const companyScans = allScans
    .filter(s => discountIds.includes(s.discount_id))
    .map(s => {
      const discount = discounts.find(d => d.id === s.discount_id)
      const user = userMap[s.user_id] || null
      return {
        ...s,
        discountName: discount ? discount.name : '—',
        userName: user ? user.name : s.user_id,
      }
    })
    .sort((a, b) => new Date(b.scanned_at) - new Date(a.scanned_at))

  const uniqueUserIds = new Set(companyScans.map(s => s.user_id))

  return { discounts, companyScans, uniqueUsers: uniqueUserIds.size, totalScans: companyScans.length }
}

/* ─── Company Usage Modal Content ─── */
function CompanyUsageModalContent({ company, t, td }) {
  const usage = getCompanyUsage(company.id)

  const statusLabels = { pending: t('adminCompanies', 'pending'), approved: t('adminCompanies', 'approved'), rejected: t('adminCompanies', 'rejected') }
  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700' }
  const planColors = { [PLAN_IDS.FREE]: 'bg-gray-100 text-gray-600', [PLAN_IDS.PREMIUM]: 'bg-yellow-100 text-yellow-700', [PLAN_IDS.ELITE]: 'bg-emerald-100 text-emerald-700' }
  const planLabels = { [PLAN_IDS.FREE]: 'Free', [PLAN_IDS.PREMIUM]: 'Premium', [PLAN_IDS.ELITE]: 'Elite' }
  const categoryLabels = {
    [COMPANY_CATEGORIES.MEDICAL]: t('adminCompanies', 'medical'),
    [COMPANY_CATEGORIES.GYM]: t('adminCompanies', 'sports'),
    [COMPANY_CATEGORIES.FOOD]: t('adminCompanies', 'restaurants'),
    [COMPANY_CATEGORIES.FUN]: t('adminCompanies', 'entertainment'),
  }

  const statusDate = company.status === 'approved'
    ? (company.approved_at || null)
    : company.status === 'rejected'
      ? (company.rejected_at || null)
      : null

  return (
    <div className="space-y-6">
      {/* ── Document Review Status ── */}
      <div className={`rounded-xl p-5 border ${company.status === 'approved' ? 'bg-emerald-50 border-emerald-200' : company.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${company.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : company.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
              {company.status === 'approved' ? <CheckCircle size={20} /> : company.status === 'rejected' ? <XCircle size={20} /> : <Clock size={20} />}
            </div>
            <div>
              <p className="text-sm font-bold text-dark">
                {t('adminCompanies', 'documentReview')}
              </p>
              <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-xs font-bold ${statusColors[company.status]}`}>
                {statusLabels[company.status] || company.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            {company.status === 'approved' && statusDate && (
              <div>
                <p className="text-xs text-emerald-700 font-semibold">{t('adminCompanies', 'approvedAt')}</p>
                <p className="text-sm text-emerald-800 font-bold" dir="ltr">{formatDate(statusDate)}</p>
              </div>
            )}
            {company.status === 'rejected' && statusDate && (
              <div>
                <p className="text-xs text-red-700 font-semibold">{t('adminCompanies', 'rejectedAt')}</p>
                <p className="text-sm text-red-800 font-bold" dir="ltr">{formatDate(statusDate)}</p>
              </div>
            )}
            {company.status === 'pending' && (
              <div>
                <p className="text-xs text-yellow-700 font-semibold">{t('adminCompanies', 'underReview')}</p>
                <p className="text-sm text-yellow-800 font-bold">{t('adminCompanies', 'underReviewSince')}: {company.join_date ? formatDate(company.join_date) : '—'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Company Profile ── */}
      <div className="bg-cream rounded-xl p-5 border border-gold/10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-dark/40 text-xs mb-0.5">{t('adminCompanies', 'companyDetails')}</p>
            <p className="text-dark font-semibold">{td('companies', company.name)}</p>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5"><Mail size={12} className="inline mr-1" />Email</p>
            <p className="text-dark font-semibold truncate" dir="ltr">{company.email}</p>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5"><MapPin size={12} className="inline mr-1" />{t('adminCompanies', 'governorate')}</p>
            <p className="text-dark font-semibold">{td('governorates', company.city)}</p>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5"><Building2 size={12} className="inline mr-1" />{t('adminCompanies', 'category')}</p>
            <p className="text-dark font-semibold">{categoryLabels[company.category] || company.category}</p>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5"><BadgePercent size={12} className="inline mr-1" />{t('adminCompanies', 'commission')}</p>
            <p className="text-dark font-semibold">{company.commission}%</p>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5"><CalendarDays size={12} className="inline mr-1" />{t('adminCompanies', 'joinDate')}</p>
            <p className="text-dark font-semibold">{company.join_date ? formatDate(company.join_date) : '—'}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${statusColors[company.status]}`}>
            {statusLabels[company.status] || company.status}
          </span>
          <span className="text-xs text-dark/40">{t('adminCompanies', 'views')}: {company.views}</span>
        </div>
      </div>

      {/* ── Subscription (only when active) ── */}
      {company.plan && (
        <div className="bg-cream rounded-xl p-5 border border-gold/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-gold" />
              <span className="text-sm font-bold text-dark">{t('adminCompanies', 'subscription')}</span>
            </div>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${planColors[company.plan]}`}>
              {planLabels[company.plan] || company.plan}
            </span>
          </div>
        </div>
      )}

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-cream rounded-xl p-4 border border-gold/10">
          <p className="text-xs text-dark/40 mb-1">{t('adminCompanies', 'discountBreakdown')}</p>
          <p className="text-2xl font-bold text-dark">{usage.discounts.length}</p>
        </div>
        <div className="bg-cream rounded-xl p-4 border border-gold/10">
          <p className="text-xs text-dark/40 mb-1">{t('adminCompanies', 'uniqueUsers')}</p>
          <p className="text-2xl font-bold text-dark">{usage.uniqueUsers}</p>
        </div>
        <div className="bg-cream rounded-xl p-4 border border-gold/10">
          <p className="text-xs text-dark/40 mb-1">{t('adminCompanies', 'totalScans')}</p>
          <p className="text-2xl font-bold text-dark">{usage.totalScans}</p>
        </div>
        <div className="bg-cream rounded-xl p-4 border border-gold/10">
          <p className="text-xs text-dark/40 mb-1">{t('adminCompanies', 'views')}</p>
          <p className="text-2xl font-bold text-dark">{company.views}</p>
        </div>
      </div>

      {/* ── Discounts Table ── */}
      <div>
        <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
          <BadgePercent size={16} className="text-gold" />
          {t('adminCompanies', 'discountBreakdown')}
        </h4>
        {usage.discounts.length === 0 ? (
          <div className="bg-cream rounded-xl p-6 text-center border border-gold/10">
            <p className="text-dark/50 text-sm font-semibold">{t('adminCompanies', 'noUsageDiscounts')}</p>
          </div>
        ) : (
          <div className="bg-cream rounded-xl border border-gold/10 overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gold/10 bg-white">
                  <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'discountName')}</th>
                  <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'tier')}</th>
                  <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'discountUses')}</th>
                  <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'discountViews')}</th>
                  <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {usage.discounts.map(d => (
                  <tr key={d.id} className="hover:bg-white/50 transition-colors">
                    <td className="p-3 text-sm text-dark font-semibold">{td('discounts', d.name, 'name')}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${planColors[d.tier]}`}>{planLabels[d.tier] || d.tier}</span>
                    </td>
                    <td className="p-3 text-sm text-dark/70">{d.uses}</td>
                    <td className="p-3 text-sm text-dark/70">{d.views}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[d.status]}`}>{statusLabels[d.status] || d.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Scan / Invoice History ── */}
      <div>
        <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
          <Receipt size={16} className="text-gold" />
          {t('adminCompanies', 'scanHistory')}
        </h4>
        {usage.companyScans.length === 0 ? (
          <div className="bg-cream rounded-xl p-6 text-center border border-gold/10">
            <p className="text-dark/50 text-sm font-semibold">{t('adminCompanies', 'noScans')}</p>
          </div>
        ) : (
          <div className="bg-cream rounded-xl border border-gold/10 overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gold/10 bg-white">
                  <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'userName')}</th>
                  <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'invoice')}</th>
                  <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'product')}</th>
                  <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'originalPrice')}</th>
                  <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'discountValue')}</th>
                  <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'priceAfter')}</th>
                  <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'scanDate')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {usage.companyScans.map((s, idx) => (
                  <tr key={`${s.user_id}-${s.discount_id}-${idx}`} className="hover:bg-white/50 transition-colors">
                    <td className="p-3 text-sm text-dark font-semibold">{s.userName}</td>
                    <td className="p-3 text-sm font-mono text-dark/60 text-xs" dir="ltr">{s.invoice_id || '—'}</td>
                    <td className="p-3 text-sm text-dark/70">{s.product || '—'}</td>
                    <td className="p-3 text-sm text-dark/70">
                      {s.original_price != null ? `${s.original_price.toLocaleString()} ${t('pricing', 'egp')}` : '—'}
                    </td>
                    <td className="p-3 text-sm">
                      {s.discount_value != null ? (
                        <span className="text-emerald-600 font-semibold">
                          -{s.discount_value.toLocaleString()} {t('pricing', 'egp')}
                          {s.discount_percent && <span className="text-dark/40 text-xs font-normal mr-1">({s.discount_percent})</span>}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="p-3 text-sm text-dark font-semibold">
                      {s.final_price != null ? `${s.final_price.toLocaleString()} ${t('pricing', 'egp')}` : '—'}
                    </td>
                    <td className="p-3 text-sm text-dark/70">{formatDate(s.scanned_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── User Detail Modal Content ─── */
function UserDetailModalContent({ userId, userDetail, cards, installments, scans, t, td, onClose }) {
  if (!userDetail) {
    return <p className="text-dark/50 text-sm font-semibold text-center py-8">{t('adminUsers', 'userNotFound')}</p>
  }

  const planColors = { [PLAN_IDS.FREE]: 'bg-gray-100 text-gray-600', [PLAN_IDS.PREMIUM]: 'bg-yellow-100 text-yellow-700', [PLAN_IDS.ELITE]: 'bg-emerald-100 text-emerald-700' }
  const planLabels = { [PLAN_IDS.FREE]: 'Free', [PLAN_IDS.PREMIUM]: 'Premium', [PLAN_IDS.ELITE]: 'Elite' }

  const totalPaid = installments.reduce((sum, inst) => sum + (Number(inst.paid) || 0), 0)
  const totalScans = scans.length
  const points = userDetail.points || 0

  return (
    <div className="space-y-5">
      {/* ── User Profile ── */}
      <div className="bg-cream rounded-xl p-5 border border-gold/10">
        <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
          <User size={16} className="text-gold" />
          {t('adminCompanies', 'userInfo')}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-dark/40 text-xs mb-0.5">{t('adminUsers', 'name')}</p>
            <p className="text-dark font-semibold">{userDetail.name}</p>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5"><Mail size={12} className="inline mr-1" />{t('adminUsers', 'email')}</p>
            <p className="text-dark font-semibold truncate" dir="ltr">{userDetail.email}</p>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5"><Phone size={12} className="inline mr-1" />{t('adminUsers', 'phone')}</p>
            <p className="text-dark font-semibold" dir="ltr">{userDetail.phone || '—'}</p>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5"><Briefcase size={12} className="inline mr-1" />{t('adminUsers', 'job')}</p>
            <p className="text-dark font-semibold">{userDetail.job || '—'}</p>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5"><MapPin size={12} className="inline mr-1" />{t('adminUsers', 'governorate')}</p>
            <p className="text-dark font-semibold">{td('governorates', userDetail.governorate || userDetail.city)}</p>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5"><Hash size={12} className="inline mr-1" />National ID</p>
            <p className="text-dark font-semibold" dir="ltr">{userDetail.nationalId || '—'}</p>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5"><CalendarDays size={12} className="inline mr-1" />{t('adminUsers', 'joinDate')}</p>
            <p className="text-dark font-semibold">{userDetail.join_date ? formatDate(userDetail.join_date) : '—'}</p>
          </div>
        </div>
      </div>

      {/* ── Subscription ── */}
      <div className="bg-cream rounded-xl p-5 border border-gold/10">
        <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
          <Package size={16} className="text-gold" />
          {t('adminCompanies', 'subscription')}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-dark/40 text-xs mb-0.5">{t('adminCompanies', 'subscription')}</p>
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${planColors[userDetail.plan]}`}>
              {planLabels[userDetail.plan] || userDetail.plan || '—'}
            </span>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5">{t('adminCompanies', 'points')}</p>
            <p className="text-dark font-semibold text-lg">{points.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5">{t('adminCompanies', 'userScans')}</p>
            <p className="text-dark font-semibold text-lg">{totalScans.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-dark/40 text-xs mb-0.5">{t('adminCompanies', 'totalSaved')}</p>
            <p className="text-dark font-semibold text-lg text-emerald-600">
              {userDetail.total_savings != null
                ? `${userDetail.total_savings.toLocaleString()} ${t('pricing', 'egp')}`
                : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Payment / Installment History ── */}
      <div className="bg-cream rounded-xl p-5 border border-gold/10">
        <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
          <DollarSign size={16} className="text-gold" />
          {t('adminCompanies', 'paymentHistory')}
        </h4>
        {installments.length === 0 ? (
          <p className="text-dark/50 text-sm font-semibold text-center py-4">{t('adminCompanies', 'noInstallments')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-gold/10 bg-white">
                  <th className="p-2.5 text-dark font-bold text-xs">{t('adminCompanies', 'subscription')}</th>
                  <th className="p-2.5 text-dark font-bold text-xs">{t('adminCompanies', 'monthlyAmount')}</th>
                  <th className="p-2.5 text-dark font-bold text-xs">{t('adminCompanies', 'totalPaid')}</th>
                  <th className="p-2.5 text-dark font-bold text-xs">{t('adminCompanies', 'nextDue')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/5">
                {installments.map((inst, idx) => (
                  <tr key={inst.id || idx} className="hover:bg-white/50 transition-colors">
                    <td className="p-2.5 text-sm text-dark font-semibold">{inst.name || '—'}</td>
                    <td className="p-2.5 text-sm text-dark font-semibold">
                      {inst.monthly_amount != null ? `${Number(inst.monthly_amount).toLocaleString()} ${t('pricing', 'egp')}` : '—'}
                    </td>
                    <td className="p-2.5 text-sm">
                      {inst.paid != null ? (
                        <span className="text-emerald-600 font-semibold">
                          {Number(inst.paid).toLocaleString()} {t('pricing', 'egp')} / {inst.total != null ? `${Number(inst.total).toLocaleString()} ${t('pricing', 'egp')}` : '—'}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="p-2.5 text-sm text-dark/70">
                      {inst.next_due ? formatDate(inst.next_due) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPaid > 0 && (
          <p className="text-xs text-dark/40 mt-3 text-left">
            {t('adminCompanies', 'totalPaid')}: <span className="font-bold text-dark">{totalPaid.toLocaleString()} {t('pricing', 'egp')}</span>
          </p>
        )}
      </div>

      {/* ── Card on File ── */}
      <div className="bg-cream rounded-xl p-5 border border-gold/10">
        <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
          <CreditCard size={16} className="text-gold" />
          {t('adminCompanies', 'cardOnFile')}
        </h4>
        {cards.length === 0 ? (
          <p className="text-dark/50 text-sm font-semibold text-center py-4">{t('adminCompanies', 'noCards')}</p>
        ) : (
          <div className="space-y-2">
            {cards.map((card, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-gold/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-gold/50" />
                  <div>
                    <p className="text-sm text-dark font-semibold font-mono" dir="ltr">{card.card_number || '—'}</p>
                    <p className="text-xs text-dark/40">{t('adminCompanies', 'cardExpiry')}: {card.expiry || '—'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Subscribers Modal Content ─── */
function SubscribersModalContent({ subscribers, typeLabel, onSelectUser, t, td }) {
  const planColors = { [PLAN_IDS.FREE]: 'bg-gray-100 text-gray-600', [PLAN_IDS.PREMIUM]: 'bg-yellow-100 text-yellow-700', [PLAN_IDS.ELITE]: 'bg-emerald-100 text-emerald-700' }
  const planLabels = { [PLAN_IDS.FREE]: 'Free', [PLAN_IDS.PREMIUM]: 'Premium', [PLAN_IDS.ELITE]: 'Elite' }

  if (subscribers.length === 0) {
    return (
      <div className="bg-cream rounded-xl p-12 text-center border border-gold/10">
        <Users className="text-gold/30 mx-auto mb-4" size={48} />
        <p className="text-dark/50 font-semibold">{t('adminCompanies', 'noSubscribers')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-dark/60">
          {t('adminCompanies', 'subscriberCount')}: <span className="font-bold text-dark">{subscribers.length.toLocaleString()}</span>
        </p>
        <p className="text-sm text-dark/40">{typeLabel}</p>
      </div>

      <div className="bg-cream rounded-xl border border-gold/10 overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="border-b border-gold/10 bg-white">
              <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'subscriberName')}</th>
              <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden md:table-cell">{t('adminCompanies', 'subscriberEmail')}</th>
              <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden lg:table-cell">{t('adminCompanies', 'subscriberPhone')}</th>
              <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'subscriberPlan')}</th>
              <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'subscriberScans')}</th>
              <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden lg:table-cell">{t('adminCompanies', 'subscriberSaved')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/5">
            {subscribers.map((u) => (
              <tr key={u.id} className="hover:bg-white/50 transition-colors">
                <td className="p-3">
                  <button onClick={() => onSelectUser(u.id)}
                    className="text-left group">
                    <p className="text-sm text-dark font-semibold group-hover:text-gold transition-colors">{td('users', u.name)}</p>
                    <p className="text-xs text-dark/40 group-hover:text-gold/60 transition-colors" dir="ltr">{u.id}</p>
                  </button>
                </td>
                <td className="p-3 text-sm text-dark/70 truncate max-w-[180px] hidden md:table-cell" dir="ltr">{u.email}</td>
                <td className="p-3 text-sm text-dark/70 hidden lg:table-cell" dir="ltr">{u.phone || '—'}</td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${planColors[u.plan]}`}>
                    {planLabels[u.plan] || u.plan || '—'}
                  </span>
                </td>
                <td className="p-3 text-sm text-dark font-semibold">{u.typeScans}</td>
                <td className="p-3 text-sm text-emerald-600 font-semibold hidden lg:table-cell">
                  {u.typeSaved > 0 ? `${u.typeSaved.toLocaleString()} ${t('pricing', 'egp')}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminCompanies() {
  const { t, td } = useLanguage()
  const [companies, setCompanies] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState(null) // null | 'financial' | 'training' | 'restaurants' | 'clubs'
  const [expandedId, setExpandedId] = useState(null)
  const [companyModal, setCompanyModal] = useState(null) // company object or null
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [subscribers, setSubscribers] = useState([])
  const [showSubscribers, setShowSubscribers] = useState(false)

  // User detail modal data
  const [userDetail, setUserDetail] = useState(null)
  const [userCards, setUserCards] = useState([])
  const [userInstallments, setUserInstallments] = useState([])
  const [userScanHistory, setUserScanHistory] = useState([])

  useEffect(() => { setCompanies(getAllCompanies()) }, [])

  useEffect(() => {
    if (!selectedUserId) {
      setUserDetail(null)
      setUserCards([])
      setUserInstallments([])
      setUserScanHistory([])
      return
    }
    const all = getAllUsers()
    const found = all.find(u => u.id === selectedUserId) || null
    setUserDetail(found)
    setUserCards(getUserCards(selectedUserId) || [])
    setUserInstallments(getUserInstallments(selectedUserId) || [])
    setUserScanHistory(getUserScans(selectedUserId) || [])
  }, [selectedUserId])

  const COMPANY_TYPE_CATEGORIES = {
    financial: [],
    training: [],
    restaurants: [COMPANY_CATEGORIES.FOOD],
    clubs: [COMPANY_CATEGORIES.GYM, COMPANY_CATEGORIES.FUN],
  }

  const filtered = companies.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (typeFilter && COMPANY_TYPE_CATEGORIES[typeFilter]?.length > 0) {
      if (!COMPANY_TYPE_CATEGORIES[typeFilter].includes(c.category)) return false
    }
    if (search && !c.name.includes(search) && !c.email.includes(search)) return false
    return true
  })

  const typeCounts = {}
  Object.keys(COMPANY_TYPE_CATEGORIES).forEach(key => {
    const cats = COMPANY_TYPE_CATEGORIES[key]
    typeCounts[key] = cats.length > 0 ? companies.filter(c => cats.includes(c.category)).length : 0
  })

  const handleStatus = (id, status) => {
    const now = new Date().toISOString()
    const updates = { status }
    if (status === 'approved') updates.approved_at = now
    if (status === 'rejected') updates.rejected_at = now
    updateCompany(id, updates)
    setCompanies(getAllCompanies())
  }

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  const handleViewSubscribers = (type) => {
    const data = getSubscribersByServiceType(type)
    setSubscribers(data)
    setShowSubscribers(true)
  }

  const categoryLabels = {
    [COMPANY_CATEGORIES.MEDICAL]: t('adminCompanies', 'medical'),
    [COMPANY_CATEGORIES.GYM]: t('adminCompanies', 'sports'),
    [COMPANY_CATEGORIES.FOOD]: t('adminCompanies', 'restaurants'),
    [COMPANY_CATEGORIES.FUN]: t('adminCompanies', 'entertainment'),
  }
  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700' }
  const statusLabels = { pending: t('adminCompanies', 'pending'), approved: t('adminCompanies', 'approved'), rejected: t('adminCompanies', 'rejected') }

  const planColors = { [PLAN_IDS.FREE]: 'bg-gray-100 text-gray-600', [PLAN_IDS.PREMIUM]: 'bg-yellow-100 text-yellow-700', [PLAN_IDS.ELITE]: 'bg-emerald-100 text-emerald-700' }
  const planLabels = { [PLAN_IDS.FREE]: 'Free', [PLAN_IDS.PREMIUM]: 'Premium', [PLAN_IDS.ELITE]: 'Elite' }

  return (
    <>
      <Helmet><title>{t('adminCompanies', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <h1 className="text-3xl font-bold text-dark mb-2">{t('adminCompanies', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{companies.length}</p>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm mb-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('adminCompanies', 'search')}
                    className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3 text-dark outline-none focus:border-gold/60 transition-all" />
                </div>
                <div className="flex gap-2">
                  {['all', 'pending', 'approved', 'rejected'].map(s => (
                    <button key={s} onClick={() => { setStatusFilter(s); if (s === 'all') setTypeFilter(null) }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === s ? 'bg-dark text-white' : 'bg-cream text-dark/60 hover:bg-dark/10'}`}>
                      {s === 'all' ? t('adminCompanies', 'all') : statusLabels[s]}
                    </button>
                  ))}
                </div>
              </div>
              {/* ── Company Type Filter ── */}
              <div className="mt-4 pt-4 border-t border-gold/10">
                <p className="text-xs font-bold text-dark/40 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Building2 size={14} className="text-gold" />
                  {t('adminCompanies', 'typeFilter')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'financial', icon: '🏦' },
                    { key: 'training', icon: '📚' },
                    { key: 'restaurants', icon: '🍽️' },
                    { key: 'clubs', icon: '🎯' },
                  ].map(({ key, icon }) => (
                    <div key={key} className="flex items-center">
                      <button onClick={() => setTypeFilter(typeFilter === key ? null : key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          typeFilter === key
                            ? 'bg-dark text-white border-dark shadow-md'
                            : 'bg-cream text-dark/60 border-gold/10 hover:bg-dark/10 hover:border-dark/20'
                        }`}>
                        <span>{icon}</span>
                        <span>{t('adminCompanies', key)}</span>
                        {typeFilter === key && (
                          <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">
                            {typeCounts[key]}
                          </span>
                        )}
                      </button>
                      {typeFilter === key && (
                        <button onClick={() => handleViewSubscribers(key)}
                          className="ml-2 flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-all whitespace-nowrap">
                          <Users size={14} />
                          {t('adminCompanies', 'viewSubscribers')}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Companies list */}
            <div className="space-y-4">
              {filtered.map((c, i) => {
                const isExpanded = expandedId === c.id
                const usage = isExpanded ? getCompanyUsage(c.id) : null

                return (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-hidden">
                    {/* Company card header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-cream rounded-2xl flex items-center justify-center text-2xl">
                            {c.emoji || <Building2 className="text-gold/50" size={28} />}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-dark">{td('companies', c.name)}</h3>
                            <p className="text-dark/50 text-sm">{c.email}</p>
                            <div className="flex items-center gap-3 mt-1 text-sm text-dark/50">
                              <span>{categoryLabels[c.category] || c.category}</span>
                              <span>•</span>
                              <span>{td('governorates', c.city)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${statusColors[c.status]}`}>{statusLabels[c.status]}</span>
                          {c.status === 'pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleStatus(c.id, 'approved')} className="bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-600 transition-all" title={t('adminCompanies', 'approve')}>
                                <CheckCircle size={18} />
                              </button>
                              <button onClick={() => handleStatus(c.id, 'rejected')} className="bg-red-500 text-white p-2.5 rounded-xl hover:bg-red-600 transition-all" title={t('adminCompanies', 'reject')}>
                                <XCircle size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gold/10 text-sm text-dark/50">
                        <span className="flex items-center gap-1.5"><Eye size={14} /> {t('adminCompanies', 'views')}: {c.views}</span>
                        <button onClick={(e) => { e.stopPropagation(); setCompanyModal(c) }}
                          className="flex items-center gap-1.5 hover:text-gold transition-colors">
                          <MousePointerClick size={14} /> {t('adminCompanies', 'uses')}: {c.uses}
                        </button>
                        <span className="flex items-center gap-1.5">{t('adminCompanies', 'commission')}: {c.commission}%</span>
                      </div>
                      {/* View Usage toggle */}
                      <button onClick={() => toggleExpand(c.id)}
                        className="mt-4 flex items-center gap-2 text-sm font-bold text-gold hover:text-gold/70 transition-colors">
                        <BarChart3 size={16} />
                        {isExpanded ? t('adminCompanies', 'hideUsage') : t('adminCompanies', 'viewUsage')}
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                    {/* Expanded usage details */}
                    {isExpanded && usage && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="border-t border-gold/10 bg-cream/50">
                        <div className="p-6 space-y-6">
                          {/* Summary stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl p-4 border border-gold/10 shadow-sm">
                              <div className="flex items-center gap-2 text-gold mb-1">
                                <Building2 size={16} />
                                <span className="text-xs font-bold text-dark/50 uppercase tracking-wide">{t('adminCompanies', 'discountBreakdown')}</span>
                              </div>
                              <p className="text-2xl font-bold text-dark">{usage.discounts.length}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gold/10 shadow-sm">
                              <div className="flex items-center gap-2 text-gold mb-1">
                                <UserCheck size={16} />
                                <span className="text-xs font-bold text-dark/50 uppercase tracking-wide">{t('adminCompanies', 'uniqueUsers')}</span>
                              </div>
                              <p className="text-2xl font-bold text-dark">{usage.uniqueUsers}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gold/10 shadow-sm">
                              <div className="flex items-center gap-2 text-gold mb-1">
                                <MousePointerClick size={16} />
                                <span className="text-xs font-bold text-dark/50 uppercase tracking-wide">{t('adminCompanies', 'totalScans')}</span>
                              </div>
                              <p className="text-2xl font-bold text-dark">{usage.totalScans}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gold/10 shadow-sm">
                              <div className="flex items-center gap-2 text-gold mb-1">
                                <Eye size={16} />
                                <span className="text-xs font-bold text-dark/50 uppercase tracking-wide">{t('adminCompanies', 'views')}</span>
                              </div>
                              <p className="text-2xl font-bold text-dark">{c.views}</p>
                            </div>
                          </div>

                          {/* ── Subscription (only when active) ── */}
                          {c.plan && (
                            <div className="bg-white rounded-xl p-4 border border-gold/10 shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Package size={16} className="text-gold" />
                                  <span className="text-xs font-bold text-dark/50 uppercase tracking-wide">{t('adminCompanies', 'subscription')}</span>
                                </div>
                                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${planColors[c.plan]}`}>
                                  {planLabels[c.plan] || c.plan}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Discounts breakdown table */}
                          <div>
                            <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
                              <BarChart3 size={16} className="text-gold" />
                              {t('adminCompanies', 'discountBreakdown')}
                            </h4>
                            {usage.discounts.length === 0 ? (
                              <div className="bg-white rounded-xl p-6 text-center border border-gold/10">
                                <p className="text-dark/50 text-sm font-semibold">{t('adminCompanies', 'noUsageDiscounts')}</p>
                              </div>
                            ) : (
                              <div className="bg-white rounded-xl border border-gold/10 overflow-x-auto">
                                <table className="w-full text-right">
                                  <thead>
                                    <tr className="border-b border-gold/10 bg-cream">
                                      <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'discountName')}</th>
                                      <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'tier')}</th>
                                      <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'discountUses')}</th>
                                      <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'discountViews')}</th>
                                      <th className="p-3 text-dark font-bold text-xs">{t('adminCompanies', 'status')}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gold/5">
                                    {usage.discounts.map(d => (
                                      <tr key={d.id} className="hover:bg-gold/5 transition-colors">
                                        <td className="p-3 text-sm text-dark font-semibold">{td('discounts', d.name, 'name')}</td>
                                        <td className="p-3">
                                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${planColors[d.tier]}`}>
                                            {planLabels[d.tier] || d.tier}
                                          </span>
                                        </td>
                                        <td className="p-3 text-sm text-dark/70">{d.uses}</td>
                                        <td className="p-3 text-sm text-dark/70">{d.views}</td>
                                        <td className="p-3">
                                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusColors[d.status]}`}>
                                            {statusLabels[d.status] || d.status}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>

                          {/* Scan history table */}
                          <div>
                            <h4 className="text-sm font-bold text-dark mb-3 flex items-center gap-2">
                              <Calendar size={16} className="text-gold" />
                              {t('adminCompanies', 'scanHistory')}
                            </h4>
                            {usage.companyScans.length === 0 ? (
                              <div className="bg-white rounded-xl p-6 text-center border border-gold/10">
                                <p className="text-dark/50 text-sm font-semibold">{t('adminCompanies', 'noScans')}</p>
                              </div>
                            ) : (
                              <div className="bg-white rounded-xl border border-gold/10 overflow-x-auto">
                                <table className="w-full text-right">
                                  <thead>
                                    <tr className="border-b border-gold/10 bg-cream">
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'userName')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden md:table-cell">{t('adminCompanies', 'invoice')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'discountName')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden md:table-cell">{t('adminCompanies', 'product')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden lg:table-cell">{t('adminCompanies', 'originalPrice')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden lg:table-cell">{t('adminCompanies', 'discountValue')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden md:table-cell">{t('adminCompanies', 'priceAfter')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap">{t('adminCompanies', 'scanDate')}</th>
                                      <th className="p-3 text-dark font-bold text-xs whitespace-nowrap hidden md:table-cell">{t('adminCompanies', 'scanTime')}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gold/5">
                                    {usage.companyScans.map((s, idx) => (
                                      <tr key={`${s.user_id}-${s.discount_id}-${idx}`} className="hover:bg-gold/5 transition-colors">
                                        <td className="p-3">
                                          <button onClick={() => setSelectedUserId(s.user_id)}
                                            className="text-left group">
                                            <p className="text-sm text-dark font-semibold group-hover:text-gold transition-colors">{s.userName}</p>
                                            <p className="text-xs text-dark/40 group-hover:text-gold/60 transition-colors" dir="ltr">{s.user_id}</p>
                                          </button>
                                        </td>
                                        <td className="p-3 text-sm hidden md:table-cell">
                                          <span className="font-mono text-xs text-dark/60" dir="ltr">{s.invoice_id || '—'}</span>
                                        </td>
                                        <td className="p-3 text-sm text-dark/70">{td('discounts', s.discountName, 'name')}</td>
                                        <td className="p-3 text-sm text-dark/70 hidden md:table-cell">{s.product || '—'}</td>
                                        <td className="p-3 text-sm text-dark/70 hidden lg:table-cell">
                                          {s.original_price != null ? `${s.original_price.toLocaleString()} ${t('pricing', 'egp')}` : '—'}
                                        </td>
                                        <td className="p-3 text-sm hidden lg:table-cell">
                                          {s.discount_value != null ? (
                                            <span className="text-emerald-600 font-semibold">
                                              -{s.discount_value.toLocaleString()} {t('pricing', 'egp')}
                                              {s.discount_percent && <span className="text-dark/40 text-xs font-normal mr-1">({s.discount_percent})</span>}
                                            </span>
                                          ) : '—'}
                                        </td>
                                        <td className="p-3 text-sm text-dark font-semibold hidden md:table-cell">
                                          {s.final_price != null ? `${s.final_price.toLocaleString()} ${t('pricing', 'egp')}` : '—'}
                                        </td>
                                        <td className="p-3 text-sm text-dark/70">{formatDate(s.scanned_at)}</td>
                                        <td className="p-3 text-sm text-dark/70 hidden md:table-cell" dir="ltr">{formatTime(s.scanned_at)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )
              })}
              {filtered.length === 0 && (
                <div className="bg-white rounded-2xl p-16 text-center border border-gold/10">
                  <Building2 className="text-gold/30 mx-auto mb-4" size={48} />
                  <p className="text-dark/50 font-semibold">{t('adminCompanies', 'noCompanies')}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────── Company Usage Modal ──────────── */}
      <Modal open={!!companyModal} onClose={() => setCompanyModal(null)}
        title={`${t('adminCompanies', 'usesInCompanies')} — ${companyModal?.name || ''}`} size="xl">
        {companyModal && <CompanyUsageModalContent company={companyModal} t={t} td={td} />}
      </Modal>

      {/* ──────────── User Detail Modal ──────────── */}
      <Modal open={!!selectedUserId} onClose={() => setSelectedUserId(null)}
        title={t('adminCompanies', 'userDetails')} size="lg">
        {selectedUserId && (
          <UserDetailModalContent
            userId={selectedUserId}
            userDetail={userDetail}
            cards={userCards}
            installments={userInstallments}
            scans={userScanHistory}
            t={t}
            td={td}
            onClose={() => setSelectedUserId(null)}
          />
        )}
      </Modal>

      {/* ──────────── Subscribers Modal ──────────── */}
      <Modal open={showSubscribers} onClose={() => setShowSubscribers(false)}
        title={`${t('adminCompanies', 'subscribersTitle')}${typeFilter ? t('adminCompanies', typeFilter) : ''}`} size="xl">
        <SubscribersModalContent
          subscribers={subscribers}
          typeLabel={typeFilter ? t('adminCompanies', typeFilter) : ''}
          onSelectUser={(userId) => { setShowSubscribers(false); setSelectedUserId(userId) }}
          t={t}
          td={td}
        />
      </Modal>
    </>
  )
}
