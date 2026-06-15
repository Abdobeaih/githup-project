import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import { getFeatures, createFeature, updateFeature, deleteFeature } from '../../data/db'
import BackButton from '../../components/BackButton'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'

export default function AdminFeatures() {
  const { t } = useLanguage()
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', key: '' })

  const loadFeatures = () => {
    setFeatures(getFeatures())
    setLoading(false)
  }

  useEffect(() => { loadFeatures() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', key: '' })
    setShowModal(true)
  }

  const openEdit = (feat) => {
    setEditing(feat)
    setForm({ name: feat.name, key: feat.key })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editing) {
      updateFeature(editing.id, { name: form.name.trim(), key: form.key.trim() })
    } else {
      createFeature({ name: form.name.trim(), key: form.key.trim() })
    }
    setShowModal(false)
    loadFeatures()
  }

  const handleDelete = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الميزة؟')) return
    deleteFeature(id)
    loadFeatures()
  }

  return (
    <>
      <Helmet><title>الميزات - لوحة الإدارة - مستكلين</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-dark">الميزات</h1>
                <p className="text-dark/60">إدارة ميزات الباقات</p>
              </div>
              <button onClick={openCreate}
                className="bg-dark text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-darkLight transition-all flex items-center gap-2">
                <Plus size={18} /> إضافة ميزة
              </button>
            </div>

            {loading ? <LoadingSpinner /> : features.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-gold/10 text-center">
                <p className="text-dark/50">لا توجد ميزات بعد</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold/10 bg-cream">
                      <th className="text-right py-3 px-4 font-bold text-dark/60">#</th>
                      <th className="text-right py-3 px-4 font-bold text-dark/60">الاسم</th>
                      <th className="text-right py-3 px-4 font-bold text-dark/60">المفتاح</th>
                      <th className="text-right py-3 px-4 font-bold text-dark/60">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/5">
                    {features.map((feat, i) => (
                      <tr key={feat.id} className="hover:bg-gold/5 transition-colors">
                        <td className="py-3 px-4 text-dark/40">{i + 1}</td>
                        <td className="py-3 px-4 text-dark font-semibold">{feat.name}</td>
                        <td className="py-3 px-4">
                          <code className="bg-cream px-2 py-0.5 rounded text-xs text-dark/60">{feat.key}</code>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(feat)}
                              className="p-2 rounded-lg hover:bg-gold/10 text-dark/50 hover:text-dark transition-all">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDelete(feat.id)}
                              className="p-2 rounded-lg hover:bg-red-50 text-dark/50 hover:text-red-500 transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-md border border-gold/10 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-dark">{editing ? 'تعديل الميزة' : 'إضافة ميزة'}</h2>
              <button onClick={() => setShowModal(false)} className="text-dark/30 hover:text-dark transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-dark font-semibold mb-2 text-sm">الاسم</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all"
                  placeholder="اسم الميزة" />
              </div>
              <div>
                <label className="block text-dark font-semibold mb-2 text-sm">المفتاح</label>
                <input type="text" value={form.key} onChange={e => setForm(p => ({ ...p, key: e.target.value }))}
                  className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all font-mono text-sm"
                  placeholder="feature_key" dir="ltr" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave}
                className="flex-1 bg-dark text-white px-6 py-3 rounded-xl font-bold hover:bg-darkLight transition-all flex items-center justify-center gap-2">
                <Save size={18} /> حفظ
              </button>
              <button onClick={() => setShowModal(false)}
                className="bg-dark/10 text-dark px-6 py-3 rounded-xl font-bold hover:bg-dark/20 transition-all">
                إلغاء
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
