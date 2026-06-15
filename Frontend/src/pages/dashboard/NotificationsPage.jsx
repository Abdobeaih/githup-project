import { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import NotificationItem from '../../components/notifications/NotificationItem'
import NotificationTypeIcon, { getTypeLabel } from '../../components/notifications/NotificationTypeIcon'
import BackButton from '../../components/BackButton'
import { Bell, CheckCheck, Filter, X, ChevronDown } from 'lucide-react'
import { NOTIFICATION_TYPE_FILTERS, NOTIFICATION_READ_FILTERS, NOTIFICATION_GROUP_LABELS } from '../../types/notification'

function groupByDate(items) {
  const now = new Date()
  const today = now.toDateString()
  const yesterday = new Date(now - 86400000).toDateString()
  const groups = { today: [], yesterday: [], thisWeek: [], older: [] }

  items.forEach(n => {
    const d = new Date(n.created_at)
    const ds = d.toDateString()
    if (ds === today) groups.today.push(n)
    else if (ds === yesterday) groups.yesterday.push(n)
    else if ((now - d) / 86400000 < 7) groups.thisWeek.push(n)
    else groups.older.push(n)
  })

  return Object.entries(groups).filter(([_, v]) => v.length > 0)
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotif } = useNotifications()
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [readFilter, setReadFilter] = useState('ALL')
  const [showTypeMenu, setShowTypeMenu] = useState(false)

  // filter
  const filtered = useMemo(() => {
    let list = notifications
    if (typeFilter !== 'ALL') list = list.filter(n => n.type === typeFilter)
    if (readFilter === 'UNREAD') list = list.filter(n => !n.is_read)
    if (readFilter === 'READ') list = list.filter(n => n.is_read)
    return list
  }, [notifications, typeFilter, readFilter])

  const groups = useMemo(() => groupByDate(filtered), [filtered])

  if (!user) {
    return (
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6 text-center py-20">
          <Bell className="text-gold/30 mx-auto mb-4" size={64} />
          <p className="text-dark/50">يرجى تسجيل الدخول لعرض الإشعارات</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <Helmet><title>الإشعارات - مستكلين</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen" style={{ direction: 'rtl' }}>
        <div className="container mx-auto px-6">
          <BackButton />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-dark">الإشعارات</h1>
                <p className="text-dark/60 text-sm mt-1">
                  {notifications.filter(n => !n.is_read).length} غير مقروء من أصل {notifications.length}
                </p>
              </div>
              {notifications.some(n => !n.is_read) && (
                <button onClick={markAllAsRead}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold/10 text-gold font-bold text-sm hover:bg-gold/20 transition-all">
                  <CheckCheck size={16} /> تحديد الكل كمقروء
                </button>
              )}
            </div>

            {/* filters */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {/* type filter */}
              <div className="relative">
                <button
                  onClick={() => setShowTypeMenu(!showTypeMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gold/10 text-dark text-sm font-medium hover:border-gold/30 transition-all"
                >
                  <Filter size={14} />
                  {typeFilter === 'ALL' ? 'جميع الأنواع' : getTypeLabel(typeFilter)}
                  <ChevronDown size={14} className={`transition-transform ${showTypeMenu ? 'rotate-180' : ''}`} />
                </button>
                {showTypeMenu && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gold/10 rounded-xl shadow-xl z-20 py-1 w-40">
                    {NOTIFICATION_TYPE_FILTERS.map(t => (
                      <button
                        key={t}
                        onClick={() => { setTypeFilter(t); setShowTypeMenu(false) }}
                        className={`w-full text-right px-3 py-2 text-sm flex items-center gap-2 hover:bg-cream transition-all ${
                          typeFilter === t ? 'text-gold font-bold' : 'text-dark'
                        }`}
                      >
                        {t !== 'ALL' && <NotificationTypeIcon type={t} size={14} />}
                        <span>{t === 'ALL' ? 'جميع الأنواع' : getTypeLabel(t)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* read/unread filter */}
              <div className="flex bg-white rounded-xl border border-gold/10 p-0.5">
                {NOTIFICATION_READ_FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setReadFilter(f.value)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                      readFilter === f.value
                        ? 'bg-gold text-white font-bold'
                        : 'text-dark hover:text-gold'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* clear filters */}
              {(typeFilter !== 'ALL' || readFilter !== 'ALL') && (
                <button
                  onClick={() => { setTypeFilter('ALL'); setReadFilter('ALL') }}
                  className="flex items-center gap-1 text-sm text-red-400 hover:text-red-500 transition-all"
                >
                  <X size={14} /> مسح التصفية
                </button>
              )}
            </div>

            {/* loading */}
            {loading && (
              <div className="text-center py-10">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            )}

            {/* list */}
            {!loading && filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center">
                <Bell className="text-gold/30 mx-auto mb-4" size={64} />
                <p className="text-dark/50">لا توجد إشعارات</p>
                {(typeFilter !== 'ALL' || readFilter !== 'ALL') && (
                  <p className="text-dark/30 text-sm mt-2">حاول تغيير عوامل التصفية</p>
                )}
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {groups.map(([key, items]) => (
                  <div key={key} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-dark/40 uppercase tracking-wider">
                        {NOTIFICATION_GROUP_LABELS[key]}
                      </span>
                      <span className="h-px flex-1 bg-gold/10" />
                      <span className="text-[10px] text-dark/30">{items.length}</span>
                    </div>
                    <div className="space-y-2">
                      {items.map(n => (
                        <NotificationItem
                          key={n.id}
                          notification={n}
                          onMarkRead={markAsRead}
                          onDelete={deleteNotif}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </AnimatePresence>
            )}

            {/* count summary */}
            {!loading && filtered.length > 0 && (
              <p className="text-center text-xs text-dark/30 mt-6">
                عرض {filtered.length} من أصل {notifications.length} إشعار
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* overlay for type menu */}
      {showTypeMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowTypeMenu(false)} />
      )}
    </>
  )
}
