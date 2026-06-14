import { useState, useEffect, useCallback, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import BackButton from '../../components/BackButton'
import { getPaymentHistory } from '../../services/subscriptionsService'
import { CreditCard, CheckCircle, XCircle, Clock, Search, Filter, ArrowUpDown } from 'lucide-react'
import {
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from '../../types/payment'

const statusIcons = {
  [PAYMENT_STATUS.SUCCESS]: CheckCircle,
  [PAYMENT_STATUS.FAILED]: XCircle,
  [PAYMENT_STATUS.PENDING]: Clock,
  [PAYMENT_STATUS.REFUNDED]: Clock,
}

const PAYMENT_METHODS = ['الكل', 'VISA', 'MASTERCARD', 'FAWRY', 'CASH', 'BANK_TRANSFER']
const STATUS_FILTERS = ['الكل', ...Object.keys(PAYMENT_STATUS)]

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function getMonthKey(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function getMonthLabel(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })
}

export default function PaymentHistory() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [methodFilter, setMethodFilter] = useState('الكل')
  const [statusFilter, setStatusFilter] = useState('الكل')
  const [monthFilter, setMonthFilter] = useState('الكل')
  const [sortAsc, setSortAsc] = useState(false)

  const fetchPayments = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const res = await getPaymentHistory(user.id)
      setPayments(res?.data || [])
    } catch {
      setPayments([])
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  // ── Unique months for filter ──
  const monthOptions = useMemo(() => {
    const months = new Set()
    payments.forEach(p => {
      const key = getMonthKey(p.paid_at)
      if (key) months.add(key)
    })
    return ['الكل', ...[...months].sort().reverse()]
  }, [payments])

  // ── Filtered + sorted ──
  const filtered = useMemo(() => {
    let list = [...payments]

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter(p =>
        p.id?.toLowerCase().includes(q) ||
        p.transaction_id?.toLowerCase().includes(q) ||
        p.payment_method?.toLowerCase().includes(q)
      )
    }

    // Method
    if (methodFilter !== 'الكل') {
      list = list.filter(p => p.payment_method === methodFilter)
    }

    // Status
    if (statusFilter !== 'الكل') {
      list = list.filter(p => p.status === statusFilter)
    }

    // Month
    if (monthFilter !== 'الكل') {
      list = list.filter(p => getMonthKey(p.paid_at) === monthFilter)
    }

    // Sort
    list.sort((a, b) => {
      const da = new Date(a.paid_at || 0).getTime()
      const db = new Date(b.paid_at || 0).getTime()
      return sortAsc ? da - db : db - da
    })

    return list
  }, [payments, searchQuery, methodFilter, statusFilter, monthFilter, sortAsc])

  // ── Stats ──
  const stats = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + (p.status === 'SUCCESS' ? Number(p.amount) : 0), 0)
    const success = payments.filter(p => p.status === 'SUCCESS').length
    const failed = payments.filter(p => p.status === 'FAILED').length
    return { total, success, failed }
  }, [payments])

  const resetFilters = () => {
    setSearchQuery('')
    setMethodFilter('الكل')
    setStatusFilter('الكل')
    setMonthFilter('الكل')
    setSortAsc(false)
  }

  const hasActiveFilters = searchQuery || methodFilter !== 'الكل' || statusFilter !== 'الكل' || monthFilter !== 'الكل'

  return (
    <>
      <Helmet><title>سجل المدفوعات</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-dark mb-2">سجل المدفوعات</h1>
            <p className="text-dark/50 text-sm mb-8">جميع معاملاتك المالية المتعلقة بالاشتراكات</p>

            {/* ── Stats cards ── */}
            {payments.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 border border-gold/10 text-center">
                  <p className="text-2xl font-extrabold text-dark">{stats.total.toLocaleString()} <span className="text-xs font-normal text-dark/50">ر.س</span></p>
                  <p className="text-xs text-dark/50 mt-1">إجمالي المدفوعات</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gold/10 text-center">
                  <p className="text-2xl font-extrabold text-emerald-600">{stats.success}</p>
                  <p className="text-xs text-dark/50 mt-1">ناجحة</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gold/10 text-center">
                  <p className="text-2xl font-extrabold text-red-500">{stats.failed}</p>
                  <p className="text-xs text-dark/50 mt-1">فاشلة</p>
                </div>
              </div>
            )}

            {/* ── Filters ── */}
            <div className="bg-white rounded-2xl p-4 border border-gold/10 shadow-sm mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter size={16} className="text-gold" />
                <span className="text-sm font-bold text-dark">تصفية</span>
                {hasActiveFilters && (
                  <button onClick={resetFilters} className="text-xs text-gold mr-auto hover:underline">
                    إعادة تعيين
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/30" />
                  <input type="text" placeholder="بحث برقم المعاملة..."
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pr-9 pl-3 py-2 bg-cream rounded-xl text-sm text-dark border border-gold/10 focus:outline-none focus:border-gold/40 transition-all" />
                </div>

                {/* Payment method */}
                <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}
                  className="px-3 py-2 bg-cream rounded-xl text-sm text-dark border border-gold/10 focus:outline-none focus:border-gold/40">
                  {PAYMENT_METHODS.map(m => (
                    <option key={m} value={m}>{m === 'الكل' ? 'جميع طرق الدفع' : m}</option>
                  ))}
                </select>

                {/* Status */}
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-cream rounded-xl text-sm text-dark border border-gold/10 focus:outline-none focus:border-gold/40">
                  {STATUS_FILTERS.map(s => (
                    <option key={s} value={s}>{s === 'الكل' ? 'جميع الحالات' : PAYMENT_STATUS_LABELS[s] || s}</option>
                  ))}
                </select>

                {/* Month */}
                <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}
                  className="px-3 py-2 bg-cream rounded-xl text-sm text-dark border border-gold/10 focus:outline-none focus:border-gold/40">
                  <option value="الكل">جميع الأشهر</option>
                  {monthOptions.filter(m => m !== 'الكل').map(m => (
                    <option key={m} value={m}>{getMonthLabel(m.replace('-', '-') + '-01') || m}</option>
                  ))}
                </select>

                {/* Sort toggle */}
                <button onClick={() => setSortAsc(p => !p)}
                  className="px-3 py-2 bg-cream rounded-xl text-sm text-dark border border-gold/10 hover:bg-gold/10 transition-all flex items-center gap-1">
                  <ArrowUpDown size={16} className="text-gold" />
                  {sortAsc ? 'الأقدم' : 'الأحدث'}
                </button>
              </div>
            </div>

            {/* ── Payments list ── */}
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gold/10">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center"
              >
                <CreditCard className="text-gold/30 mx-auto mb-4" size={64} />
                <p className="text-dark/50 text-lg mb-1">
                  {payments.length === 0 ? 'لا توجد مدفوعات حتى الآن' : 'لا توجد نتائج للتصفية الحالية'}
                </p>
                <p className="text-dark/30 text-sm">
                  {payments.length === 0 ? 'عند إجراء أول عملية دفع، ستظهر هنا' : 'حاول تغيير معايير التصفية'}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filtered.map((p, i) => {
                  const StatusIcon = statusIcons[p.status] || CreditCard
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="bg-white rounded-2xl p-5 border border-gold/10 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            p.status === 'SUCCESS' ? 'bg-emerald-100' :
                            p.status === 'FAILED' ? 'bg-red-100' : 'bg-amber-100'
                          }`}>
                            <StatusIcon size={20} className={
                              p.status === 'SUCCESS' ? 'text-emerald-600' :
                              p.status === 'FAILED' ? 'text-red-600' : 'text-amber-600'
                            } />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-dark text-sm truncate">
                              {p.subscription?.plan?.name || 'اشتراك'}
                            </p>
                            <p className="text-xs text-dark/40">
                              {formatDate(p.paid_at)} {formatTime(p.paid_at) && `- ${formatTime(p.paid_at)}`}
                            </p>
                          </div>
                        </div>

                        <div className="text-left shrink-0">
                          <p className="font-extrabold text-dark">{Number(p.amount).toLocaleString()} <span className="text-xs font-normal">ر.س</span></p>
                          <p className="text-xs text-dark/40">{p.payment_method || '-'}</p>
                        </div>

                        <div className="shrink-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${PAYMENT_STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-600'}`}>
                            {PAYMENT_STATUS_LABELS[p.status] || p.status}
                          </span>
                        </div>

                        <div className="hidden md:block text-xs text-dark/30 shrink-0" dir="ltr">
                          {p.transaction_id && <span className="font-mono">#{p.transaction_id}</span>}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* ── Count ── */}
            {!loading && filtered.length > 0 && (
              <p className="text-center text-xs text-dark/40 mt-6">
                عرض {filtered.length} من {payments.length} مدفوعات
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
