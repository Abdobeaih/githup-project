import { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import {
  getPlans, createPlan, updatePlan, deletePlan,
  getPlanFeatures, getFeatures, setPlanFeatures
} from '../../services/subscriptionsService'
import {
  Crown, Plus, Edit3, Trash2, X, CheckCircle, AlertCircle,
  Package, DollarSign, Calendar, Hash, Star, Save
} from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return dateStr
  }
}

// ── Form Modal ──
function PlanFormModal({ plan, features, allFeatures, onClose, onSave }) {
  const isEdit = !!plan
  const [form, setForm] = useState({
    name: plan?.name || '',
    price: plan?.price ?? '',
    duration_months: plan?.duration_months ?? 1,
    max_discount_usage: plan?.max_discount_usage ?? 10,
    max_monthly_promo_uses: plan?.max_monthly_promo_uses ?? 5,
    popular: plan?.popular || false,
  })
  const [selectedFeatureIds, setSelectedFeatureIds] = useState(
    features.map(f => f.feature_id || f.id)
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleToggleFeature = (fid) => {
    setSelectedFeatureIds(prev =>
      prev.includes(fid) ? prev.filter(id => id !== fid) : [...prev, fid]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('اسم الباقة مطلوب'); return }
    setSaving(true)
    setError('')
    try {
      let saved
      if (isEdit) {
        saved = await updatePlan(plan.id, { ...form, price: Number(form.price) })
      } else {
        saved = await createPlan({ ...form, price: Number(form.price) })
      }
      // Save feature associations
      if (saved?.data) {
        await setPlanFeatures(saved.data.id || plan.id, selectedFeatureIds)
      }
      onSave()
    } catch {
      setError('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-dark">{isEdit ? 'تعديل الباقة' : 'إضافة باقة جديدة'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream flex items-center justify-center hover:bg-gold/10 transition-all">
            <X size={18} className="text-dark/50" />
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 rounded-xl text-sm font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-dark mb-1.5">اسم الباقة</label>
            <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-2.5 bg-cream rounded-xl text-sm text-dark border border-gold/10 focus:outline-none focus:border-gold/40 transition-all"
              placeholder="مثال: الباقة الذهبية" />
          </div>

          {/* Price + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-dark mb-1.5">السعر (ر.س)</label>
              <input type="number" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                className="w-full px-4 py-2.5 bg-cream rounded-xl text-sm text-dark border border-gold/10 focus:outline-none focus:border-gold/40 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-dark mb-1.5">المدة (أشهر)</label>
              <input type="number" min="0" value={form.duration_months} onChange={e => setForm(p => ({ ...p, duration_months: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-cream rounded-xl text-sm text-dark border border-gold/10 focus:outline-none focus:border-gold/40 transition-all" />
            </div>
          </div>

          {/* Usage limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-dark mb-1.5">حد الخصومات</label>
              <input type="number" min="-1" value={form.max_discount_usage} onChange={e => setForm(p => ({ ...p, max_discount_usage: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-cream rounded-xl text-sm text-dark border border-gold/10 focus:outline-none focus:border-gold/40 transition-all" />
              <p className="text-xs text-dark/30 mt-1">-1 = غير محدود</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-dark mb-1.5">حد العروض الشهرية</label>
              <input type="number" min="-1" value={form.max_monthly_promo_uses} onChange={e => setForm(p => ({ ...p, max_monthly_promo_uses: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-cream rounded-xl text-sm text-dark border border-gold/10 focus:outline-none focus:border-gold/40 transition-all" />
              <p className="text-xs text-dark/30 mt-1">-1 = غير محدود</p>
            </div>
          </div>

          {/* Popular toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-12 h-6 rounded-full transition-all ${form.popular ? 'bg-gold' : 'bg-gray-200'} relative`}
              onClick={() => setForm(p => ({ ...p, popular: !p.popular }))}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow transition-all ${form.popular ? 'right-0.5' : 'right-6'}`} />
            </div>
            <span className="text-sm text-dark font-bold">باقة مميزة (Popular)</span>
          </label>

          {/* Features multi-select */}
          <div>
            <label className="block text-sm font-bold text-dark mb-2">المميزات</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-cream rounded-xl">
              {allFeatures.map(f => (
                <label key={f.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                  selectedFeatureIds.includes(f.id) ? 'bg-gold/15 text-gold border border-gold/30' : 'text-dark/60 border border-transparent hover:bg-gold/5'
                }`}>
                  <input type="checkbox" checked={selectedFeatureIds.includes(f.id)}
                    onChange={() => handleToggleFeature(f.id)} className="sr-only" />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    selectedFeatureIds.includes(f.id) ? 'border-gold bg-gold' : 'border-gray-300'
                  }`}>
                    {selectedFeatureIds.includes(f.id) && <CheckCircle size={12} className="text-white" />}
                  </div>
                  {f.name}
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-bold border border-gold/20 text-dark hover:bg-cream transition-all">
              إلغاء
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl text-sm font-bold bg-dark text-white hover:bg-darkLight transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              <Save size={16} />
              {saving ? 'جاري الحفظ...' : isEdit ? 'حفظ التغييرات' : 'إضافة الباقة'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ── Delete Confirm Modal ──
function DeleteConfirmModal({ plan, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center"
        onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={28} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-dark mb-2">حذف الباقة</h3>
        <p className="text-sm text-dark/50 mb-6">
          هل أنت متأكد من حذف باقة <span className="font-bold text-dark">{plan?.name}</span>؟ سيتم إخفاؤها ولن تكون متاحة للاشتراك.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-bold border border-gold/20 text-dark hover:bg-cream transition-all">
            إلغاء
          </button>
          <button onClick={async () => {
            setDeleting(true)
            await onConfirm(plan?.id)
            setDeleting(false)
          }} disabled={deleting}
            className="flex-1 py-3 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50">
            {deleting ? 'جاري...' : 'حذف'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main Page ──
export default function AdminSubscriptionPlans() {
  const { t } = useLanguage()
  const [plans, setPlans] = useState([])
  const [allFeatures, setAllFeatures] = useState([])
  const [planFeaturesMap, setPlanFeaturesMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editPlan, setEditPlan] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [message, setMessage] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const [plansRes, featuresRes] = await Promise.all([getPlans(), getFeatures()])
      const plansData = plansRes?.data || []
      const featuresData = featuresRes?.data || []
      setPlans(plansData)
      setAllFeatures(featuresData)

      // Load features per plan
      const pfMap = {}
      await Promise.all(plansData.map(async (plan) => {
        const pfRes = await getPlanFeatures(plan.id)
        pfMap[plan.id] = pfRes?.data || []
      }))
      setPlanFeaturesMap(pfMap)
    } catch {
      setMessage({ type: 'error', text: 'فشل تحميل البيانات' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = () => {
    setShowForm(false)
    setEditPlan(null)
    setMessage({ type: 'success', text: 'تم حفظ الباقة بنجاح' })
    load()
    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id) => {
    await deletePlan(id)
    setDeleteTarget(null)
    setMessage({ type: 'success', text: 'تم حذف الباقة بنجاح' })
    load()
    setTimeout(() => setMessage(null), 3000)
  }

  const openEdit = async (plan) => {
    // Re-fetch features for this plan
    const pfRes = await getPlanFeatures(plan.id)
    setEditPlan(plan)
    setPlanFeaturesMap(prev => ({ ...prev, [plan.id]: pfRes?.data || [] }))
    setShowForm(true)
  }

  const activePlans = plans.filter(p => !p.deleted_at)
  const inactivePlans = plans.filter(p => p.deleted_at)

  return (
    <>
      <Helmet><title>إدارة باقات الاشتراك</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-dark">إدارة الباقات</h1>
                <p className="text-dark/50 text-sm mt-1">إضافة وتعديل وحذف باقات الاشتراك</p>
              </div>
              <button onClick={() => { setEditPlan(null); setShowForm(true) }}
                className="bg-dark text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-darkLight transition-all flex items-center gap-2">
                <Plus size={18} />
                إضافة باقة
              </button>
            </div>

            {/* Toast */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className={`mb-6 px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${
                    message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                  {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading */}
            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gold/10 animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-48 mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Active Plans */}
                {activePlans.length === 0 ? (
                  <div className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center">
                    <Package className="text-gold/30 mx-auto mb-4" size={64} />
                    <p className="text-dark/50 text-lg mb-1">لا توجد باقات</p>
                    <p className="text-dark/30 text-sm">أضف أول باقة اشتراك الآن</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activePlans.map((plan, i) => {
                      const pf = planFeaturesMap[plan.id] || []
                      return (
                        <motion.div
                          key={plan.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                plan.popular ? 'bg-gold/15' : 'bg-cream'
                              }`}>
                                <Crown size={24} className={plan.popular ? 'text-gold' : 'text-dark/40'} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-bold text-dark">{plan.name}</h3>
                                  {plan.popular && (
                                    <span className="px-2 py-0.5 bg-gold/10 text-gold rounded-full text-xs font-bold">الأكثر طلباً</span>
                                  )}
                                </div>
                                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-dark/50">
                                  <span className="flex items-center gap-1">
                                    <DollarSign size={14} className="text-gold" />
                                    {plan.price} ر.س
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar size={14} className="text-gold" />
                                    {plan.duration_months === 0 ? 'شهري' : `${plan.duration_months} أشهر`}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Hash size={14} className="text-gold" />
                                    خصومات: {plan.max_discount_usage === -1 ? '∞' : plan.max_discount_usage}
                                  </span>
                                  {plan.is_active === false && (
                                    <span className="text-amber-600 font-bold">غير نشط</span>
                                  )}
                                </div>
                                {/* Features tags */}
                                {pf.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-3">
                                    {pf.map((item, j) => (
                                      <span key={j} className="px-2.5 py-1 bg-cream rounded-full text-xs text-dark/50 border border-gold/5">
                                        {item.feature?.name || `ميزة ${item.feature_id}`}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button onClick={() => openEdit(plan)}
                                className="w-9 h-9 rounded-xl bg-cream flex items-center justify-center hover:bg-gold/10 transition-all"
                                title="تعديل">
                                <Edit3 size={16} className="text-dark/50" />
                              </button>
                              <button onClick={() => setDeleteTarget(plan)}
                                className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition-all"
                                title="حذف">
                                <Trash2 size={16} className="text-red-500" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}

                {/* Inactive (deleted) plans */}
                {inactivePlans.length > 0 && (
                  <details className="mt-8 group">
                    <summary className="cursor-pointer text-sm text-dark/40 hover:text-dark/60 transition-all font-bold">
                      الباقات المحذوفة ({inactivePlans.length})
                    </summary>
                    <div className="mt-4 space-y-2 opacity-60">
                      {inactivePlans.map(plan => (
                        <div key={plan.id} className="bg-white rounded-xl p-4 border border-gold/5 flex items-center justify-between">
                          <div>
                            <span className="text-sm text-dark font-bold">{plan.name}</span>
                            <span className="text-xs text-dark/30 mr-3">تم الحذف: {formatDate(plan.deleted_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      <AnimatePresence>
        {showForm && (
          <PlanFormModal
            plan={editPlan}
            features={editPlan ? (planFeaturesMap[editPlan.id] || []) : []}
            allFeatures={allFeatures}
            onClose={() => { setShowForm(false); setEditPlan(null) }}
            onSave={handleSave}
          />
        )}
        {deleteTarget && (
          <DeleteConfirmModal
            plan={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </>
  )
}
