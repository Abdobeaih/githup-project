import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { getCompanyBranches, createCompanyBranch, updateCompanyBranch, deleteCompanyBranch } from '../services/companiesService'
import { MapPin, Plus, Edit3, Trash2, X, Check, Save } from 'lucide-react'

export default function CompanyBranches({ companyId }) {
  const { t, td } = useLanguage()
  const [branches, setBranches] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', city: '', address: '', phone: '' })
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    getCompanyBranches(companyId).then(res => {
      if (Array.isArray(res)) setBranches(res)
    }).catch(() => {})
  }, [companyId])

  const handleCreate = async () => {
    if (!form.name) return
    const res = await createCompanyBranch(companyId, form)
    if (res?.success) {
      setBranches(prev => [...prev, res.branch || { ...form, id: Date.now().toString() }])
      setForm({ name: '', city: '', address: '', phone: '' })
      setShowForm(false)
    }
  }

  const handleUpdate = async (branchId) => {
    const res = await updateCompanyBranch(branchId, editing)
    if (res?.success) {
      setBranches(prev => prev.map(b => b.id === branchId ? { ...b, ...editing } : b))
      setEditing(null)
    }
  }

  const handleDelete = async (branchId) => {
    if (!window.confirm('حذف الفرع؟')) return
    const res = await deleteCompanyBranch(branchId)
    if (res?.success) setBranches(prev => prev.filter(b => b.id !== branchId))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-dark">الفروع</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="text-gold text-sm font-bold hover:text-goldDark transition-all flex items-center gap-1">
          <Plus size={14} /> إضافة فرع
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-cream rounded-2xl p-4 mb-4 space-y-3">
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="اسم الفرع" className="w-full bg-white border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-dark outline-none" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
              placeholder="المدينة" className="bg-white border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-dark outline-none" />
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              inputMode="numeric" maxLength={11}
              onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
              placeholder="الهاتف" className="bg-white border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-dark outline-none" />
          </div>
          <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
            placeholder="العنوان" className="w-full bg-white border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-dark outline-none" />
          <div className="flex gap-2">
            <button onClick={handleCreate} className="bg-dark text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-darkLight transition-all">
              <Save size={14} className="inline ml-1" /> حفظ
            </button>
            <button onClick={() => setShowForm(false)} className="text-red-500 px-3 py-2 text-xs font-bold">إلغاء</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {branches.length === 0 && <p className="text-center text-dark/40 py-4 text-sm">لا توجد فروع</p>}
        {branches.map(b => (
          <div key={b.id} className="bg-white rounded-2xl p-4 border border-gold/10 shadow-sm">
            {editing?.id === b.id ? (
              <div className="space-y-3">
                <input value={editing.name} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-dark outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={editing.city} onChange={e => setEditing(p => ({ ...p, city: e.target.value }))}
                    className="bg-cream border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-dark outline-none" />
                  <input value={editing.phone} onChange={e => setEditing(p => ({ ...p, phone: e.target.value }))}
                    inputMode="numeric" maxLength={11}
                    onInput={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
                    className="bg-cream border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-dark outline-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(b.id)} className="bg-dark text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-darkLight">
                    <Save size={14} className="inline ml-1" /> حفظ
                  </button>
                  <button onClick={() => setEditing(null)} className="text-red-500 px-3 py-2 text-xs font-bold">إلغاء</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-dark text-sm">{b.name}</p>
                  <div className="flex items-center gap-3 text-xs text-dark/50 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {b.city}</span>
                    {b.phone && <span>{b.phone}</span>}
                  </div>
                  {b.address && <p className="text-xs text-dark/40 mt-1">{b.address}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditing(b)} className="w-8 h-8 rounded-xl bg-gold/10 text-gold hover:bg-gold/20 flex items-center justify-center">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="w-8 h-8 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
