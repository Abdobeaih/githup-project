import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { getCompanyAdmins, addCompanyAdmin, removeCompanyAdmin } from '../services/companiesService'
import { Shield, Plus, Trash2, User } from 'lucide-react'

export default function CompanyAdmins({ companyId }) {
  const { t, td } = useLanguage()
  const [admins, setAdmins] = useState([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCompanyAdmins(companyId).then(res => {
      if (Array.isArray(res)) setAdmins(res)
    }).catch(() => {})
  }, [companyId])

  const handleAdd = async () => {
    if (!email.trim()) return
    setLoading(true)
    const res = await addCompanyAdmin(companyId, email)
    if (res?.success) {
      setAdmins(prev => [...prev, { id: Date.now().toString(), email, name: email.split('@')[0] }])
      setEmail('')
    }
    setLoading(false)
  }

  const handleRemove = async (adminId) => {
    if (!window.confirm('إزالة المشرف؟')) return
    const res = await removeCompanyAdmin(adminId)
    if (res?.success) setAdmins(prev => prev.filter(a => a.id !== adminId))
  }

  return (
    <div>
      <h3 className="font-bold text-dark mb-4">المشرفين</h3>

      <div className="flex items-center gap-3 mb-6">
        <input value={email} onChange={e => setEmail(e.target.value)}
          placeholder="البريد الإلكتروني للمشرف"
          className="flex-1 bg-cream border border-gold/20 rounded-xl px-4 py-3 text-sm text-dark outline-none focus:border-gold/60" />
        <button onClick={handleAdd} disabled={loading || !email.trim()}
          className="bg-dark text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-darkLight transition-all disabled:opacity-50 flex items-center gap-2">
          <Plus size={16} /> إضافة
        </button>
      </div>

      <div className="space-y-3">
        {admins.length === 0 && <p className="text-center text-dark/40 py-4 text-sm">لا يوجد مشرفين</p>}
        {admins.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl p-4 border border-gold/10 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                <User size={18} className="text-gold" />
              </div>
              <div>
                <p className="font-bold text-dark text-sm">{a.name || a.email}</p>
                <p className="text-xs text-dark/50">{a.email}</p>
              </div>
            </div>
            <button onClick={() => handleRemove(a.id)}
              className="w-8 h-8 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition-all flex items-center justify-center">
              <Trash2 size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
