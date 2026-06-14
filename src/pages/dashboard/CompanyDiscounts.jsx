import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { getDiscountsByCompany, createDiscount, updateDiscount } from '../../data/db'
import BackButton from '../../components/BackButton'
import { Plus, Percent, MapPin, Tag, Edit3 } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
 
export default function CompanyDiscounts() {
  const { company, refreshUser } = useAuth()
  const { t, td } = useLanguage()
  const [discounts, setDiscounts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', category: 'food', discount_percent: '', description: '', city: '', tier: 'free' })

  useEffect(() => {
    if (company) setDiscounts(getDiscountsByCompany(company.id))
  }, [company])

  if (!company) return null

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const resetForm = () => {
    setForm({ name: '', category: 'food', discount_percent: '', description: '', city: '', tier: 'free' })
    setShowForm(false)
    setEditId(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editId) {
      updateDiscount(editId, form)
    } else {
      createDiscount({ ...form, company_id: company.id, company_name: company.name })
    }
    setDiscounts(getDiscountsByCompany(company.id))
    refreshUser()
    resetForm()
  }

  const handleEdit = (d) => {
    setForm({ name: d.name, category: d.category, discount_percent: d.discount_percent, description: d.description, city: d.city, tier: d.tier })
    setEditId(d.id)
    setShowForm(true)
  }

  const categoryLabels = { medical: t('companyDiscounts', 'medical'), gym: t('companyDiscounts', 'sports'), food: t('companyDiscounts', 'restaurants'), fun: t('companyDiscounts', 'entertainment') }
  const categoryColors = { medical: 'bg-blue-100 text-blue-600', gym: 'bg-orange-100 text-orange-600', food: 'bg-red-100 text-red-600', fun: 'bg-purple-100 text-purple-600' }
  const tierLabels = { free: t('companyDiscounts', 'freeTier'), premium: t('companyDiscounts', 'premiumTier'), elite: t('companyDiscounts', 'eliteTier') }
  const statusLabels = { pending: t('companyDiscounts', 'pending'), approved: t('companyDiscounts', 'approved'), rejected: t('companyDiscounts', 'rejected') }
  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700' }

  return (
    <>
      <Helmet><title>{t('companyDiscounts', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-dark">{t('companyDiscounts', 'heading')}</h1>
                <p className="text-dark/60">{t('companyDiscounts', 'subtitle')}</p>
              </div>
              {!showForm && (
                <button onClick={() => setShowForm(true)} className="bg-dark text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-darkLight transition-all">
                  <Plus size={18} /> {t('companyDiscounts', 'addDiscount')}
                </button>
              )}
            </div>

            {/* Add/Edit form */}
            {showForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm mb-8">
                <h3 className="text-xl font-bold text-dark mb-6">{editId ? t('companyDiscounts', 'editTitle') : t('companyDiscounts', 'addTitle')}</h3>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'name')}</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all" placeholder={t('companyDiscounts', 'namePlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'category')}</label>
                    <select name="category" value={form.category} onChange={handleChange} className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all">
                      <option value="medical">{t('companyDiscounts', 'medical')}</option>
                      <option value="gym">{t('companyDiscounts', 'sports')}</option>
                      <option value="food">{t('companyDiscounts', 'restaurants')}</option>
                      <option value="fun">{t('companyDiscounts', 'entertainment')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'discountPercent')}</label>
                    <input type="text" name="discount_percent" value={form.discount_percent} onChange={handleChange} required className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all" placeholder={t('companyDiscounts', 'discountPlaceholder')} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'description')}</label>
                    <textarea name="description" value={form.description} onChange={handleChange} required rows="3" className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all resize-none" placeholder={t('companyDiscounts', 'descPlaceholder')}></textarea>
                  </div>
                  <div>
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'formCity')}</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange} required className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all" placeholder={t('companyDiscounts', 'cityPlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'formTier')}</label>
                    <select name="tier" value={form.tier} onChange={handleChange} className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all">
                      <option value="free">{t('companyDiscounts', 'freeTier')}</option>
                      <option value="premium">{t('companyDiscounts', 'premiumTier')}</option>
                      <option value="elite">{t('companyDiscounts', 'eliteTier')}</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 flex gap-3">
                    <button type="submit" className="bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-6 py-3 rounded-xl font-bold flex-1">
                      {editId ? t('companyDiscounts', 'saveChanges') : t('companyDiscounts', 'submitAdd')}
                    </button>
                    <button type="button" onClick={resetForm} className="bg-dark/10 text-dark px-6 py-3 rounded-xl font-bold">{t('companyDiscounts', 'cancel')}</button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Discounts list */}
            {discounts.length === 0 && !showForm ? (
              <div className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center">
                <Tag className="text-gold/30 mx-auto mb-4" size={64} />
                <p className="text-dark/50 font-semibold text-lg">{t('companyDiscounts', 'noDiscounts')}</p>
                <p className="text-dark/40 text-sm mt-2">{t('companyDiscounts', 'noDiscountsHint')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {discounts.map((d, i) => (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-dark">{td('discounts', d.name, 'name')}</h3>
                          <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${categoryColors[d.category] || ''}`}>
                            {categoryLabels[d.category] || d.category}
                          </span>
                          <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${statusColors[d.status]}`}>
                            {statusLabels[d.status]}
                          </span>
                        </div>
                        <p className="text-dark/60 text-sm mb-2">{td('discounts', d.name, 'description')}</p>
                        <div className="flex items-center gap-4 text-sm text-dark/50">
                          <span className="flex items-center gap-1"><Percent size={14} /> {d.discount_percent}</span>
                          <span className="flex items-center gap-1"><MapPin size={14} /> {td('governorates', d.city)}</span>
                          <span>🏷️ {tierLabels[d.tier]}</span>
                          <span>👁️ {d.views}</span>
                          <span>🔄 {d.uses}</span>
                        </div>
                      </div>
                      <button onClick={() => handleEdit(d)} className="text-gold hover:text-gold/80 transition-colors p-2" title={t('companyDiscounts', 'editTooltip')}>
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
