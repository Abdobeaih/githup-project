import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { getAllDiscounts, updateDiscount, getDiscountUsageDetail } from '../../data/db'
import BackButton from '../../components/BackButton'
import Modal from '../../components/Modal'
import { Search, CheckCircle, XCircle, Tag, Percent, Users, Eye, CalendarDays, Clock, MapPin } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

export default function AdminDiscounts() {
  const { t, td, lang } = useLanguage()
  const [discounts, setDiscounts] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [usageDetail, setUsageDetail] = useState(null)
  const [usageDiscName, setUsageDiscName] = useState('')

  useEffect(() => { setDiscounts(getAllDiscounts()) }, [])

  // Pre-compute usage data for each discount
  const usageMap = useMemo(() => {
    const map = {}
    for (const d of discounts) {
      const records = getDiscountUsageDetail(d.id)
      map[d.id] = {
        records,
        uniqueUsers: new Set(records.map(r => r.user_id)).size,
      }
    }
    return map
  }, [discounts])

  const filtered = discounts.filter(d => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false
    if (catFilter !== 'all' && d.category !== catFilter) return false
    if (search && !d.name.includes(search) && !d.company_name.includes(search)) return false
    return true
  })

  const handleStatus = (id, status) => {
    updateDiscount(id, { status })
    setDiscounts(getAllDiscounts())
  }

  const showUsageDetail = (d) => {
    const usage = getDiscountUsageDetail(d.id)
    setUsageDetail(usage)
    setUsageDiscName(d.name)
  }

  const dateTimeFormat = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const categoryLabels = { medical: t('adminDiscounts', 'medical'), gym: t('adminDiscounts', 'sports'), food: t('adminDiscounts', 'restaurants'), fun: t('adminDiscounts', 'entertainment') }
  const categoryColors = { medical: 'bg-blue-100 text-blue-600', gym: 'bg-orange-100 text-orange-600', food: 'bg-red-100 text-red-600', fun: 'bg-purple-100 text-purple-600' }
  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700' }
  const statusLabels = { pending: t('adminDiscounts', 'pending'), approved: t('adminDiscounts', 'approved'), rejected: t('adminDiscounts', 'rejected') }

  return (
    <>
      <Helmet><title>{t('adminDiscounts', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <h1 className="text-3xl font-bold text-dark mb-2">{t('adminDiscounts', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{discounts.length} {t('adminDiscounts', 'subtitle')}</p>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm mb-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('adminDiscounts', 'search')}
                    className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3 text-dark outline-none focus:border-gold/60 transition-all" />
                </div>
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                  className="bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all">
                  <option value="all">{t('adminDiscounts', 'allCategories')}</option>
                  <option value="medical">{t('adminDiscounts', 'medical')}</option>
                  <option value="gym">{t('adminDiscounts', 'sports')}</option>
                  <option value="food">{t('adminDiscounts', 'restaurants')}</option>
                  <option value="fun">{t('adminDiscounts', 'entertainment')}</option>
                </select>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'pending', 'approved', 'rejected'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === s ? 'bg-dark text-white' : 'bg-cream text-dark/60 hover:bg-dark/10'}`}>
                      {s === 'all' ? t('adminDiscounts', 'all') : statusLabels[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Discounts list */}
            <div className="space-y-4">
              {filtered.map((d, i) => {
                const usage = usageMap[d.id]
                const totalScans = usage?.records?.length || 0
                const uniqueUsers = usage?.uniqueUsers || 0
                return (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Title row */}
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-dark truncate">{td('discounts', d.name, 'name')}</h3>
                          <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${categoryColors[d.category] || ''}`}>
                            {categoryLabels[d.category] || d.category}
                          </span>
                        </div>
                        <p className="text-dark/50 text-sm mb-2">{t('adminDiscounts', 'byCompany')} {td('companies', d.company_name)}</p>

                        {/* Details grid */}
                        <div className="grid md:grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                          {/* Left column — stats */}
                          <div>
                            <div className="flex items-center gap-4 text-dark/60">
                              <span className="flex items-center gap-1"><Percent size={14} /> {d.discount_percent}</span>
                              <span className="flex items-center gap-1"><MapPin size={14} /> {td('governorates', d.city)}</span>
                              <span className="flex items-center gap-1"><Tag size={14} /> {d.tier}</span>
                            </div>
                            <div className="flex items-center gap-4 text-dark/60 mt-1">
                              <span className="flex items-center gap-1"><Eye size={14} /> {d.views}</span>
                              <span className="flex items-center gap-1"><Users size={14} /> {d.uses}</span>
                              {totalScans > 0 && (
                                <button onClick={() => showUsageDetail(d)}
                                  className="text-gold hover:text-gold/70 font-bold underline underline-offset-2 transition-all">
                                  {uniqueUsers} {t('adminDiscounts', 'usersUsed')}
                                </button>
                              )}
                              {totalScans === 0 && (
                                <span className="text-dark/30 text-xs">{t('adminDiscounts', 'noUsage')}</span>
                              )}
                            </div>
                          </div>
                          {/* Right column — dates */}
                          <div className="text-dark/50">
                            <div className="flex items-center gap-1">
                              <CalendarDays size={14} />
                              <span>{t('adminDiscounts', 'createdAt')}: {dateTimeFormat(d.created_at)}</span>
                            </div>
                            {d.approved_at && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Clock size={14} />
                                <span>{t('adminDiscounts', 'approvedAt')}: {dateTimeFormat(d.approved_at)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${statusColors[d.status]}`}>{statusLabels[d.status]}</span>
                        {d.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleStatus(d.id, 'approved')} className="bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-600 transition-all" title={t('adminDiscounts', 'approve')}>
                              <CheckCircle size={18} />
                            </button>
                            <button onClick={() => handleStatus(d.id, 'rejected')} className="bg-red-500 text-white p-2.5 rounded-xl hover:bg-red-600 transition-all" title={t('adminDiscounts', 'reject')}>
                              <XCircle size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
              {filtered.length === 0 && (
                <div className="bg-white rounded-2xl p-16 text-center border border-gold/10">
                  <Tag className="text-gold/30 mx-auto mb-4" size={48} />
                  <p className="text-dark/50 font-semibold">{t('adminDiscounts', 'noDiscounts')}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Usage Detail Modal */}
      <Modal open={!!usageDetail} onClose={() => setUsageDetail(null)} title={`${t('adminDiscounts', 'usageModalTitle')}: ${td('discounts', usageDiscName, 'name')}`} size="lg">
        {usageDetail && usageDetail.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold/10">
                  <th className="text-right py-3 px-3 font-bold text-dark">{t('adminDiscounts', 'usageModalUser')}</th>
                  <th className="text-right py-3 px-3 font-bold text-dark">{t('adminDiscounts', 'usageModalDate')}</th>
                  <th className="text-right py-3 px-3 font-bold text-dark">{t('adminDiscounts', 'usageModalInvoice')}</th>
                  <th className="text-right py-3 px-3 font-bold text-dark">{t('adminDiscounts', 'usageModalProduct')}</th>
                  <th className="text-right py-3 px-3 font-bold text-dark">{t('adminDiscounts', 'usageModalPrice')}</th>
                  <th className="text-right py-3 px-3 font-bold text-dark">{t('adminDiscounts', 'usageModalDiscount')}</th>
                  <th className="text-right py-3 px-3 font-bold text-dark">{t('adminDiscounts', 'usageModalFinal')}</th>
                </tr>
              </thead>
              <tbody>
                {usageDetail.map((u, i) => (
                  <tr key={i} className="border-b border-gold/5 hover:bg-gold/5 transition-colors">
                    <td className="py-3 px-3 text-dark">{td('users', u.user?.name) || '—'}</td>
                    <td className="py-3 px-3 text-dark/70">{dateTimeFormat(u.scanned_at)}</td>
                    <td className="py-3 px-3 text-dark/70 font-mono text-xs">{u.invoice_id}</td>
                    <td className="py-3 px-3 text-dark">{u.product}</td>
                    <td className="py-3 px-3 text-dark/70">{u.original_price} {t('pricing', 'egp')}</td>
                    <td className="py-3 px-3 text-emerald-600 font-bold">-{u.discount_value} {t('pricing', 'egp')}</td>
                    <td className="py-3 px-3 text-dark font-bold">{u.final_price} {t('pricing', 'egp')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-dark/50 text-center py-8">{t('adminDiscounts', 'noUsage')}</p>
        )}
      </Modal>
    </>
  )
}
