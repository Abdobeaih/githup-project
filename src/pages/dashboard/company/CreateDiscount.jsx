import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useLanguage } from '../../../context/LanguageContext'
import { createDiscount, setDiscountBranches } from '../../../data/db'
import { getCompanyBranches } from '../../../services/companiesService'
import BackButton from '../../../components/BackButton'
import { Plus, Tag, Link, FileText, Banknote } from 'lucide-react'
import { DISCOUNT_TYPES, DISCOUNT_TYPE_LABELS, CATEGORY_LABELS, TIER_LABELS } from '../../../types/discount'

const discountTypeOptions = [
  { value: DISCOUNT_TYPES.EXTERNAL_LINK, label: DISCOUNT_TYPE_LABELS.EXTERNAL_LINK, icon: Link },
  { value: DISCOUNT_TYPES.PROMO_CODE, label: DISCOUNT_TYPE_LABELS.PROMO_CODE, icon: Tag },
  { value: DISCOUNT_TYPES.INSURANCE_FORM, label: DISCOUNT_TYPE_LABELS.INSURANCE_FORM, icon: FileText },
  { value: DISCOUNT_TYPES.BANK_FORM, label: DISCOUNT_TYPE_LABELS.BANK_FORM, icon: Banknote },
]

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))

const tierOptions = Object.entries(TIER_LABELS).map(([value, label]) => ({ value, label }))

function generatePromoCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function CreateDiscount() {
  const { company, refreshUser } = useAuth()
  const { t, td } = useLanguage()
  const navigate = useNavigate()
  const [branches, setBranches] = useState([])
  const [form, setForm] = useState({
    name: '',
    category: 'food',
    discount_percent: '',
    discount_type: 'EXTERNAL_LINK',
    promo_code: generatePromoCode(),
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    tier_required: '',
    description: '',
    city: '',
    tier: 'free',
  })
  const [selectedBranches, setSelectedBranches] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (company) {
      getCompanyBranches(company.id).then(res => {
        setBranches(res?.data || [])
      }).catch(() => {})
    }
  }, [company])

  if (!company) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      // Regenerate promo code when type changes to PROMO_CODE
      ...(name === 'discount_type' && value === 'PROMO_CODE' ? { promo_code: generatePromoCode() } : {}),
      // Clear promo_code when switching away from PROMO_CODE
      ...(name === 'discount_type' && value !== 'PROMO_CODE' ? { promo_code: '' } : {}),
    }))
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
    if (!company) return
    setSubmitting(true)

    const payload = {
      name: form.name,
      category: form.category,
      discount_percent: form.discount_percent,
      discount_type: form.discount_type,
      promo_code: form.discount_type === 'PROMO_CODE' ? form.promo_code : null,
      start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
      end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
      tier_required: form.tier_required || null,
      description: form.description,
      city: form.city,
      tier: form.tier,
      company_id: company.id,
      company_name: company.name,
    }

    try {
      const result = await createDiscount(payload)
      const discountId = result?.data?.id || result?.id

      // Save branch associations if any were selected
      if (discountId && selectedBranches.length > 0) {
        setDiscountBranches(discountId, selectedBranches)
      }

      refreshUser()
      navigate('/dashboard/company/discounts')
    } catch (err) {
      console.error('Failed to create discount', err)
    } finally {
      setSubmitting(false)
    }
  }

  const DiscountTypeIcon = discountTypeOptions.find(o => o.value === form.discount_type)?.icon || Tag

  return (
    <>
      <Helmet><title>{t('companyDiscounts', 'addTitle')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-dark">{t('companyDiscounts', 'addDiscount')}</h1>
                <p className="text-dark/60">أضف عرض خصم جديد لمتجرك</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm">
              {/* Basic info */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="md:col-span-2">
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'name')}</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required
                    className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all"
                    placeholder="اسم العرض" />
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
                    className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all"
                    placeholder="مثال: 30%" />
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
                      <button key={opt.value} type="button" onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          discount_type: opt.value,
                          promo_code: opt.value === 'PROMO_CODE' ? generatePromoCode() : '',
                        }))
                      }}
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

              {/* Promo code (only visible for PROMO_CODE type) */}
              {form.discount_type === 'PROMO_CODE' && (
                <div className="mb-6">
                  <label className="block text-dark font-semibold mb-2 text-sm">كود الخصم</label>
                  <div className="flex items-center gap-3">
                    <input type="text" name="promo_code" value={form.promo_code} readOnly
                      className="flex-1 bg-cream border border-gold/20 rounded-xl px-4 py-3 text-center text-lg font-bold text-gold tracking-widest outline-none"
                      dir="ltr" />
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, promo_code: generatePromoCode() }))}
                      className="bg-dark text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-darkLight transition-all">
                      تجديد
                    </button>
                  </div>
                  <p className="text-dark/40 text-xs mt-1">كود الخصم للقراءة فقط. يتم إنشاؤه تلقائياً.</p>
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
                  className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all resize-none"
                  placeholder="وصف العرض"></textarea>
              </div>

              {/* City & Tier */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('companyDiscounts', 'formCity')}</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} required
                    className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all"
                    placeholder="المدينة" />
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
                  <Plus size={18} />
                  {submitting ? 'جاري الحفظ...' : 'إضافة العرض'}
                </button>
                <button type="button" onClick={() => navigate('/dashboard/company/discounts')}
                  className="bg-dark/10 text-dark px-6 py-3 rounded-xl font-bold hover:bg-dark/20 transition-all">
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}
