import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import Modal from '../../components/Modal'
import useInteractionTracker from '../../hooks/useInteractionTracker'
import { getApprovedDiscounts, getGovernorates, incrementDiscountUses, recordScan } from '../../data/db'
import { Search, MapPin, Tag, Building2, Percent, CheckCircle, QrCode, Copy, Check, ShoppingCart, DollarSign, CreditCard } from 'lucide-react'

// Tier hierarchy: higher tier includes lower tiers
const TIER_LEVEL = { free: 1, premium: 2, elite: 3 }

// Generate promo code (e.g., MSTK-ABC123)
function generatePromoCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = 'MSTK-'
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export default function DiscountsBrowse() {
  const { user, refreshUser } = useAuth()
  const { t, td, lang } = useLanguage()
  const [discounts, setDiscounts] = useState([])
  const [governorates, setGovernorates] = useState([])
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [filterTier, setFilterTier] = useState('all')
  const [filterGov, setFilterGov] = useState(user?.governorate || 'all')
  const [scannedId, setScannedId] = useState(null)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState(null)
  const [promoCode, setPromoCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [applyForm, setApplyForm] = useState({
    discountName: '',
    priceAfterDiscount: '',
    amountPaid: '',
    last4Digits: '',
  })

  const { trackView, trackClick, trackCopy, viewRef } = useInteractionTracker()
  const userTier = user?.plan ? TIER_LEVEL[user.plan] || 0 : 3

  useEffect(() => {
    setDiscounts(getApprovedDiscounts())
    setGovernorates(getGovernorates())
  }, [])

  const filtered = discounts.filter(d => {
    if (filterCat !== 'all' && d.category !== filterCat) return false
    if (filterTier !== 'all' && d.tier !== filterTier) return false
    if (filterGov !== 'all' && d.city !== filterGov) return false
    if (search && !d.name.includes(search) && !d.company_name.includes(search) && !d.city.includes(search)) return false
    // Only show discounts the user's plan tier can access
    if (userTier < (TIER_LEVEL[d.tier] || 0)) return false
    return true
  })

  const handleOpenModal = (discount) => {
    if (!user) {
      alert(t('discountsBrowse', 'loginRequired'))
      return
    }
    if (TIER_LEVEL[user.plan] < TIER_LEVEL[discount.tier]) {
      alert(t('discountsBrowse', 'upgradeRequired'))
      return
    }
    // Silent click tracking
    trackClick(discount.id)
    setSelectedDiscount(discount)
    setPromoCode(generatePromoCode())
    setApplyForm({
      discountName: td('discounts', discount.name, 'name') || discount.name,
      priceAfterDiscount: '',
      amountPaid: '',
      last4Digits: '',
    })
    setCopied(false)
    setModalOpen(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setApplyForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCopyPromo = () => {
    navigator.clipboard?.writeText(promoCode)
    setCopied(true)
    if (selectedDiscount) {
      trackCopy(selectedDiscount.id, promoCode)
    }
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirmApply = () => {
    if (!selectedDiscount) return

    incrementDiscountUses(selectedDiscount.id)
    recordScan(user.id, selectedDiscount.id, {
      discountName: applyForm.discountName,
      priceAfterDiscount: applyForm.priceAfterDiscount,
      amountPaid: applyForm.amountPaid,
      last4Digits: applyForm.last4Digits,
    })
    refreshUser()
    setScannedId(selectedDiscount.id)
    setModalOpen(false)
    setTimeout(() => setScannedId(null), 2000)
  }

  const categoryLabels = { medical: t('adminDiscounts', 'medical'), gym: t('adminDiscounts', 'sports'), food: t('adminDiscounts', 'restaurants'), fun: t('adminDiscounts', 'entertainment') }
  const categoryColors = { medical: 'bg-blue-100 text-blue-600', gym: 'bg-orange-100 text-orange-600', food: 'bg-red-100 text-red-600', fun: 'bg-purple-100 text-purple-600' }
  const tierLabels = { free: t('discountsBrowse', 'free'), premium: t('discountsBrowse', 'premium'), elite: t('discountsBrowse', 'elite') }
  const tierColors = { free: 'bg-gray-100 text-gray-600', premium: 'bg-yellow-100 text-yellow-600', elite: 'bg-emerald-100 text-emerald-600' }

  return (
    <>
      <Helmet><title>{t('discountsBrowse', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-dark mb-2">{t('discountsBrowse', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{t('discountsBrowse', 'subtitle')}</p>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm mb-8">
              <div className="grid md:grid-cols-5 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('discountsBrowse', 'searchPlaceholder')}
                    className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all" />
                </div>
                <select value={filterGov} onChange={e => setFilterGov(e.target.value)}
                  className="bg-cream border border-gold/20 rounded-xl px-4 py-3.5 text-dark outline-none focus:border-gold/60 transition-all">
                  <option value="all">{t('discountsBrowse', 'allGovernorates')}</option>
                  {governorates.map((g, i) => <option key={i} value={g}>{td('governorates', g)}</option>)}
                </select>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                  className="bg-cream border border-gold/20 rounded-xl px-4 py-3.5 text-dark outline-none focus:border-gold/60 transition-all">
                  <option value="all">{t('discountsBrowse', 'allCategories')}</option>
                  <option value="medical">{t('discountsBrowse', 'medical')}</option>
                  <option value="gym">{t('discountsBrowse', 'sports')}</option>
                  <option value="food">{t('discountsBrowse', 'restaurants')}</option>
                  <option value="fun">{t('discountsBrowse', 'entertainment')}</option>
                </select>
                <select value={filterTier} onChange={e => setFilterTier(e.target.value)}
                  className="bg-cream border border-gold/20 rounded-xl px-4 py-3.5 text-dark outline-none focus:border-gold/60 transition-all">
                  <option value="all">{t('discountsBrowse', 'allTiers')}</option>
                  <option value="free">{t('discountsBrowse', 'free')}</option>
                  <option value="premium">{t('discountsBrowse', 'premium')}</option>
                  <option value="elite">{t('discountsBrowse', 'elite')}</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center">
                <Percent className="text-gold/30 mx-auto mb-4" size={64} />
                <p className="text-dark/50 font-semibold text-lg">{t('discountsBrowse', 'noDiscounts')}</p>
                <p className="text-dark/40 text-sm mt-2">{t('discountsBrowse', 'noDiscountsHint')}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((discount, i) => (
                  <motion.div key={discount.id} ref={viewRef(discount.id)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className={`bg-white rounded-2xl p-6 border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 ${scannedId === discount.id ? 'border-emerald-400 ring-2 ring-emerald-200' : 'border-gold/10'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[discount.category] || ''}`}>
                        {categoryLabels[discount.category] || discount.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${tierColors[discount.tier] || ''}`}>
                        {tierLabels[discount.tier] || discount.tier}
                      </span>
                    </div>
                    <Link to={`/discounts/${discount.id}`}>
                      <h3 className="text-lg font-bold text-dark mb-2 hover:text-gold transition-colors">{td('discounts', discount.name, 'name')}</h3>
                    </Link>
                    <p className="text-dark/60 text-sm mb-4 line-clamp-2">{td('discounts', discount.name, 'description')}</p>
                    <div className="flex items-center gap-4 mb-4 text-sm text-dark/50">
                      <Link to={`/discounts/${discount.id}`} className="flex items-center gap-1 hover:text-gold transition-colors">
                        <Building2 size={14} /> {td('companies', discount.company_name)}
                      </Link>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {td('governorates', discount.city)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold text-gold">{discount.discount_percent}</span>
                        <span className="text-dark/40 text-xs">{t('discountsBrowse', 'discount')}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-dark/40">
                        <span>{discount.uses} {t('discountsBrowse', 'uses')}</span>
                        {scannedId === discount.id ? (
                          <span className="text-emerald-500 flex items-center gap-1 font-bold"><CheckCircle size={16} /> {t('discountsBrowse', 'done')}</span>
                        ) : (
                          <button onClick={() => handleOpenModal(discount)} className="bg-dark text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-darkLight transition-all">
                            <Tag size={14} /> {t('discountsBrowse', 'useDiscount')}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Apply Discount Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('discountsBrowse', 'applyDiscount')}
        size="md"
      >
        {selectedDiscount && (
          <div className="space-y-6">
            {/* Discount Info */}
            <div className="bg-cream rounded-xl p-4 text-center">
              <p className="text-dark/60 text-sm mb-1">{td('discounts', selectedDiscount.name, 'name')}</p>
              <p className="text-3xl font-extrabold text-gold">{selectedDiscount.discount_percent} {t('discountsBrowse', 'discount')}</p>
            </div>

            {/* Promo Code - Bold and Prominent */}
            <div className="bg-dark rounded-xl p-5 text-center">
              <p className="text-white/60 text-xs mb-2">{t('discountsBrowse', 'promoCode')}</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-black text-gold tracking-widest" dir="ltr">{promoCode}</span>
                <button
                  onClick={handleCopyPromo}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                >
                  {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} className="text-white/60" />}
                </button>
              </div>
              {copied && <p className="text-emerald-400 text-xs mt-2">{t('discountsBrowse', 'copied')}</p>}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Discount Name */}
              <div>
                <label className="block text-dark font-semibold mb-2 text-sm">
                  <ShoppingCart size={14} className="inline ml-1" /> {t('discountsBrowse', 'discountName')}
                </label>
                <input
                  type="text"
                  name="discountName"
                  value={applyForm.discountName}
                  onChange={handleFormChange}
                  placeholder={t('discountsBrowse', 'discountNamePlaceholder')}
                  className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all"
                />
              </div>

              {/* Price After Discount */}
              <div>
                <label className="block text-dark font-semibold mb-2 text-sm">
                  <DollarSign size={14} className="inline ml-1" /> {t('discountsBrowse', 'priceAfterDiscount')}
                </label>
                <input
                  type="number"
                  name="priceAfterDiscount"
                  value={applyForm.priceAfterDiscount}
                  onChange={handleFormChange}
                  placeholder={t('discountsBrowse', 'pricePlaceholder')}
                  className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all"
                />
              </div>

              {/* Amount Paid */}
              <div>
                <label className="block text-dark font-semibold mb-2 text-sm">
                  <DollarSign size={14} className="inline ml-1" /> {t('discountsBrowse', 'amountPaid')}
                </label>
                <input
                  type="number"
                  name="amountPaid"
                  value={applyForm.amountPaid}
                  onChange={handleFormChange}
                  placeholder={t('discountsBrowse', 'amountPlaceholder')}
                  className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all"
                />
              </div>

              {/* Last 4 Digits of Invoice */}
              <div>
                <label className="block text-dark font-semibold mb-2 text-sm">
                  <CreditCard size={14} className="inline ml-1" /> {t('discountsBrowse', 'last4Digits')}
                </label>
                <input
                  type="text"
                  name="last4Digits"
                  value={applyForm.last4Digits}
                  onChange={handleFormChange}
                  maxLength={4}
                  placeholder={t('discountsBrowse', 'last4Placeholder')}
                  className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmApply}
              className="w-full bg-gradient-to-r from-gold to-[#a67c3d] text-dark py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-gold/20 transition-all"
            >
              {t('discountsBrowse', 'confirmApply')}
            </button>
          </div>
        )}
      </Modal>
    </>
  )
}
