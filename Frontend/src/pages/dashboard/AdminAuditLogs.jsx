import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import { getAuditLogs } from '../../services/adminService'
import { ClipboardList, User, Shield, Building2, Percent, Filter } from 'lucide-react'

const actionIcons = {
  user: User, company: Building2, discount: Percent, admin: Shield,
}
const actionColors = {
  create: 'bg-emerald-100 text-emerald-600',
  update: 'bg-blue-100 text-blue-600',
  delete: 'bg-red-100 text-red-600',
  approve: 'bg-green-100 text-green-600',
  reject: 'bg-red-100 text-red-600',
  suspend: 'bg-amber-100 text-amber-600',
}
const actionLabels = {
  create: 'إنشاء', update: 'تحديث', delete: 'حذف', approve: 'موافقة', reject: 'رفض', suspend: 'تعليق',
}

export default function AdminAuditLogs() {
  const { t, td } = useLanguage()
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getAuditLogs().then(res => {
      if (Array.isArray(res)) setLogs(res)
    }).catch(() => {})
  }, [])

  const filtered = filter === 'all' ? logs : logs.filter(l => l.action === filter)

  return (
    <>
      <Helmet><title>سجل التدقيق</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-dark mb-2">سجل التدقيق</h1>
            <p className="text-dark/60 mb-8">تتبع جميع العمليات والإجراءات الإدارية</p>

            {/* Filter */}
            <div className="bg-white rounded-2xl p-4 border border-gold/10 shadow-sm mb-6">
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="bg-cream border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-dark outline-none focus:border-gold/60">
                <option value="all">جميع العمليات</option>
                <option value="create">إنشاء</option>
                <option value="update">تحديث</option>
                <option value="delete">حذف</option>
                <option value="approve">موافقة</option>
                <option value="reject">رفض</option>
                <option value="suspend">تعليق</option>
              </select>
            </div>

            {logs.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center">
                <ClipboardList className="text-gold/30 mx-auto mb-4" size={64} />
                <p className="text-dark/50">لا توجد سجلات</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((log, i) => {
                  const ActionIcon = actionIcons[log.entity_type] || ClipboardList
                  return (
                    <motion.div key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="bg-white rounded-2xl p-5 border border-gold/10 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center shrink-0">
                          <ActionIcon size={18} className="text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-bold text-dark">{log.admin_email || 'أدمن'}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${actionColors[log.action] || ''}`}>
                              {actionLabels[log.action] || log.action}
                            </span>
                            {log.entity_type && (
                              <span className="text-[10px] text-dark/50 bg-cream px-2 py-0.5 rounded-full">
                                {log.entity_type}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-dark/60">{log.description || `${log.action} على ${log.entity_type || 'كيان'}`}</p>
                          <p className="text-xs text-dark/30 mt-1">{log.date || log.created_at}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
