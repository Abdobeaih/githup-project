import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import LoadingSpinner from '../../components/LoadingSpinner'
import { MousePointerClick, Trash2, X, Search } from 'lucide-react'

const INTERACTIONS_KEY = 'interactions'

export default function AdminInteractions() {
  const { t, lang } = useLanguage()
  const [interactions, setInteractions] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const loadInteractions = () => {
    try {
      const raw = localStorage.getItem(INTERACTIONS_KEY)
      setInteractions(raw ? JSON.parse(raw) : [])
    } catch {
      setInteractions([])
    }
    setLoading(false)
  }

  useEffect(() => { loadInteractions() }, [])

  const clearAll = () => {
    if (!window.confirm('هل أنت متأكد من مسح جميع التفاعلات؟')) return
    localStorage.removeItem(INTERACTIONS_KEY)
    setInteractions([])
  }

  const filtered = interactions.filter(it => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      it.type?.toLowerCase().includes(q) ||
      it.action?.toLowerCase().includes(q) ||
      it.userId?.toLowerCase().includes(q) ||
      it.discountId?.toString().includes(q) ||
      it.targetType?.toLowerCase().includes(q) ||
      it.targetId?.toString().includes(q)
    )
  })

  return (
    <>
      <Helmet><title>التفاعلات - لوحة الإدارة - مستكلين</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-dark">التفاعلات</h1>
                <p className="text-dark/60">سجل تفاعلات المستخدمين مع الخصومات</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/30" />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    className="bg-white border border-gold/20 rounded-xl pl-4 pr-10 py-2.5 text-sm text-dark outline-none focus:border-gold/60 transition-all w-48"
                    placeholder="بحث..." />
                </div>
                {interactions.length > 0 && (
                  <button onClick={clearAll}
                    className="bg-red-50 text-red-500 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 transition-all flex items-center gap-2">
                    <Trash2 size={16} /> مسح الكل
                  </button>
                )}
              </div>
            </div>

            {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gold/10 text-center">
                <MousePointerClick size={48} className="mx-auto mb-4 text-dark/20" />
                <p className="text-dark/50">{search ? 'لا توجد نتائج للبحث' : 'لا توجد تفاعلات بعد'}</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gold/10 bg-cream">
                        <th className="text-right py-3 px-4 font-bold text-dark/60">#</th>
                        <th className="text-right py-3 px-4 font-bold text-dark/60">النوع</th>
                        <th className="text-right py-3 px-4 font-bold text-dark/60">الإجراء</th>
                        <th className="text-right py-3 px-4 font-bold text-dark/60">المستخدم</th>
                        <th className="text-right py-3 px-4 font-bold text-dark/60">الهدف</th>
                        <th className="text-right py-3 px-4 font-bold text-dark/60">التفاصيل</th>
                        <th className="text-right py-3 px-4 font-bold text-dark/60">التاريخ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5">
                      {filtered.map((it, i) => (
                        <tr key={i} className="hover:bg-gold/5 transition-colors cursor-pointer"
                          onClick={() => setSelected(it)}>
                          <td className="py-3 px-4 text-dark/40">{filtered.length - i}</td>
                          <td className="py-3 px-4">
                            <span className="bg-gold/10 text-gold px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              {it.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-dark font-semibold">{it.action}</td>
                          <td className="py-3 px-4 text-dark/60 text-xs">{it.userId || '—'}</td>
                          <td className="py-3 px-4">
                            {it.targetType ? (
                              <span className="text-xs">
                                <span className="text-dark/40">{it.targetType}:</span>{' '}
                                <span className="text-dark font-semibold">{it.targetId || '—'}</span>
                              </span>
                            ) : (
                              <span className="text-dark/40">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <code className="bg-cream px-2 py-0.5 rounded text-xs text-dark/60 max-w-[200px] block truncate" dir="ltr">
                              {it.discountId ? `خصم #${it.discountId}` : it.discountName || '—'}
                            </code>
                          </td>
                          <td className="py-3 px-4 text-dark/30 text-xs whitespace-nowrap">
                            {it.timestamp ? new Date(it.timestamp).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', {
                              year: 'numeric', month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            }) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-cream px-4 py-3 text-xs text-dark/40 flex items-center justify-between">
                  <span>إجمالي {filtered.length} تفاعل</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setSelected(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-lg border border-gold/10 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-dark">تفاصيل التفاعل</h2>
              <button onClick={() => setSelected(null)} className="text-dark/30 hover:text-dark transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              {Object.entries(selected).map(([key, val]) => (
                <div key={key} className="flex items-start gap-3">
                  <span className="font-bold text-dark/60 min-w-[100px] text-xs">{key}:</span>
                  <span className="text-dark break-all">
                    {typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}
                  </span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)}
              className="mt-6 w-full bg-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-darkLight transition-all">
              إغلاق
            </button>
          </motion.div>
        </div>
      )}
    </>
  )
}
