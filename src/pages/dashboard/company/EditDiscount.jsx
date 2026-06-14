import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useLanguage } from '../../../context/LanguageContext'
import { findDiscountById, updateDiscount, setDiscountBranches, getDiscountBranches } from '../../../data/db'
import { getCompanyBranches } from '../../../services/companiesService'
import BackButton from '../../../components/BackButton'
import { Save, Tag, Link, FileText, Banknote } from 'lucide-react'
import { DISCOUNT_TYPES, DISCOUNT_TYPE_LABELS, CATEGORY_LABELS, TIER_LABELS } from '../../../types/discount'

const discountTypeOptions = [
  { value: DISCOUNT_TYPES.EXTERNAL_LINK, label: DISCOUNT_TYPE_LABELS.EXTERNAL_LINK, icon: Link },
  { value: DISCOUNT_TYPES.PROMO_CODE, label: DISCOUNT_TYPE_LABELS.PROMO_CODE, icon: Tag },
  { value: DISCOUNT_TYPES.INSURANCE_FORM, label: DISCOUNT_TYPE_LABELS.INSURANCE_FORM, icon: FileText },
  { value: DISCOUNT_TYPES.BANK_FORM, label: DISCOUNT_TYPE_LABELS.BANK_FORM, icon: Banknote },
]

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))

const tierOptions = Object.entries(TIER_LABELS).map(([value, label]) => ({ value, label }))

export default function EditDiscount() {
  const { id } = useParams()
  const { company } = useAuth()
  const { t, td } = useLanguage()
  const navigate = useNavigate()
  const [discount, setDiscount] = useState(null)
  const [branches, setBranches] = useState([])
  const [selectedBranches, setSelectedBranches] = useState([])
  const [form, setForm] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!company || !id) return

    const d = findDiscountById(Number(id))
    if (!d) {
      setNotFound(true)
      setLoading(false)
      return
    }

    // Verify ownership
    if (d.company_id !== company.id) {
      setNotFound(true)
      setLoading(false)
      return
    }

    setDiscount(d)
    setForm({
      name: d.name || '',
      category: d.category || 'food',
      discount_percent: d.discount_percent || '',
      discount_type: d.discount_type || 'EXTERNAL_LINK',
      promo_code: d.promo_code || '',
      start_date: d.start_date ? d.start_date.split('T')[0] : '',
      end_date: d.end_date ? d.end_date.split('T')[0] : '',
      tier_required: d.tier_required || '',
      description: d.description || '',
      city: d.city || '',
      tier: d.tier || 'free',
    })

    // Load branches
    const discountBranches = getDiscountBranches(Number(id))
    setSelectedBranches(discountBranches.filter(l => l.branch).map(l => l.branch.id))

    getCompanyBranches(company.id).then(res => {
      setBranches(res?.data || [])
    }).catch(() => {})

    setLoading(false)
  }, [company, id])

  if (!company) return null

  if (loading) {
    return (
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6 text-center py-20">
          <p className="text-dark/50">جاري التحميل...</p>
        </div>
      </section>
    )
  }

  if (notFound) {
    return (
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <div className="text-center py-20">
            <Tag className="text-gold/30 mx-auto mb-4" size={64} />
            <p className="text-dark/50 font-bold text-lg">العرض غير موجود</p>
            <p className="text-dark/40 text-sm mt-2">قد يكون قد تم حذفه أو لا تملك صلاحية الوصول إليه</p>
          </div>
        </div>
      </section>
    )
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleBranch = (branchId) => {
    setSelectedBranches(prev =>
      prev.includes(branchId)
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!company || !discount) return
    setSubmitting(true)

    const updates = {
      name: form.name,
      category: form.category,
      discount_percent: form.discount_percent,
      discount_type: form.discount_type,
      // promo_code is read-only — preserve original
      promo_code: discount.promo_code,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
      end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
      tier_required: form.tier_required || null,
      description: form.description,
      city: form.city,
      tier: form.tier,
    }

    try {
      updateDiscount(discount.id, updates)
      setDiscountBranches(discount.id, selectedBranches)
      navigate('/dashboard/company/discounts')
    } catch (err) {
      console.error('Failed to update discount', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!form) return null

  return (
    <>
      <Helmet><title>{t('companyDiscounts', 'editTitle')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-dark">{t('companyDiscounts', 'editTitle')}</h1>
                <p className="text-dark/60">تعديل: {form.name}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm">
              {/* Basic info */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'name')}</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required
                    className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all" />
                </div>

                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'category')}</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all">
                    {categoryOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'discountPercent')}</label>
                  <input type="text" name="discount_percent" value={form.discount_percent} onChange={handleChange} required
                    className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all" />
                </div>
              </div>

              {/* Discount type */}
              <div className="mb-6">
                <label className="block text-dark font-semibold mb-3 text-sm">نوع الخصم</label>
                <div className="grid grid-cols-3 gap-3">
                  {discountTypeOptions.map(opt => {
                    const Icon = opt.icon
                    const isActive = form.discount_type === opt.value
                    return (
                      <button key={opt.value} type="button" onClick={() => setForm(prev => ({ ...prev, discount_type: opt.value }))}
                        className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 text-sm font-bold transition-all ${
                          isActive
                            ? 'border-gold bg-gold/10 text-dark'
                            : 'border-gold/10 bg-cream text-dark/60 hover:border-gold/30'
                        }`}>
                        <Icon size={18} />
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Promo code — read-only display */}
              {discount.discount_type === 'PROMO_CODE' && discount.promo_code && (
                <div className="mb-6">
                  <label className="block text-dark font-semibold mb-2 text-sm">كود الخصم (للقراءة فقط)</label>
                  <input type="text" value={discount.promo_code} readOnly
                    className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-center text-lg font-bold text-gold tracking-widest outline-none"
                    dir="ltr" />
                  <p className="text-dark/40 text-xs mt-1">لا يمكن تعديل كود الخصم بعد الإنشاء.</p>
                </div>
              )}

              {/* Date range */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">تاريخ البدء</label>
                  <input type="date" name="start_date" value={form.start_date} onChange={handleChange}
                    className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all" />
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">تاريخ الانتهاء</label>
                  <input type="date" name="end_date" value={form.end_date} onChange={handleChange}
                    className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all" />
                </div>
              </div>

              {/* Tier required */}
              <div className="mb-6">
                <label className="block text-dark font-semibold mb-2 text-sm">المستوى المطلوب</label>
                <select name="tier_required" value={form.tier_required} onChange={handleChange}
                  className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all">
                  <option value="">الكل (بدون شرط)</option>
                  {tierOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'description')}</label>
                <textarea name="description" value={form.description} onChange={handleChange} required rows="3"
                  className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all resize-none"></textarea>
              </div>

              {/* City & Tier */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'formCity')}</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} required
                    className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all" />
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'formTier')}</label>
                  <select name="tier" value={form.tier} onChange={handleChange}
                    className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all">
                    {tierOptions.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Branch selection */}
              {branches.length > 0 && (
                <div className="mb-6">
                  <label className="block text-dark font-semibold mb-3 text-sm">الفروع المتاحة</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {branches.map(branch => {
                      const isSelected = selectedBranches.includes(branch.id)
                      return (
                        <label key={branch.id}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-gold bg-gold/5'
                              : 'border-gold/10 bg-cream hover:border-gold/30'
                          }`}>
                          <input type="checkbox" checked={isSelected} onChange={() => toggleBranch(branch.id)} className="sr-only" />
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'bg-gold border-gold' : 'border-dark/20'
                          }`}>
                            {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                          </div>
                          <div>
                            <p className="text-dark font-semibold text-sm">{branch.name}</p>
                            {branch.city && <p className="text-dark/40 text-xs">{branch.city}</p>}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex gap-3">
                <button type="submit" disabled={submitting}
                  className="bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-8 py-3 rounded-xl font-bold flex-1 flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50">
                  <Save size={18} />
                  {submitting ? 'جاري الحفظ...' : t('companyDiscounts', 'saveChanges')}
                </button>
                <button type="button" onClick={() => navigate('/dashboard/company/discounts')}
                  className="bg-dark/10 text-dark px-6 py-3 rounded-xl font-bold hover:bg-dark/20 transition-all">
                  {t('companyDiscounts', 'cancel')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}
