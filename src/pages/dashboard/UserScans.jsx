import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import UsedDiscountCard from '../../components/UsedDiscountCard'
import DiscountDetailsModal from '../../components/DiscountDetailsModal'
import { getUserScans } from '../../data/db'
import { QrCode, Tag, TrendingDown, History, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function UserScans() {
  const { user } = useAuth()
  const { t, td, lang } = useLanguage()
  const [scans, setScans] = useState([])
  const [selectedScan, setSelectedScan] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (user) setScans(getUserScans(user.id))
  }, [user])

  if (!user) return null

  const handleCardClick = (scan) => {
    setSelectedScan(scan)
    setModalOpen(true)
  }

  // Calculate summary stats
  const totalSavings = scans.reduce((sum, scan) => sum + (scan.discount_value || 0), 0)
  const totalDiscounts = scans.length

  return (
    <>
      <Helmet><title>{t('userScans', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <History className="text-gold" size={20} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-dark">{t('userScans', 'heading')}</h1>
                  <p className="text-dark/60">{t('userScans', 'subtitle')}</p>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            {scans.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-4 mb-8"
              >
                {/* Total Discounts Used */}
                <div className="bg-white rounded-2xl p-4 border border-gold/10 shadow-sm">
                  <div className="flex items-center gap-2 text-dark/50 text-xs mb-2">
                    <Tag size={12} className="text-gold" />
                    <span>{t('userScans', 'scansCount') || 'Total Discounts'}</span>
                  </div>
                  <p className="text-2xl font-bold text-dark">{totalDiscounts}</p>
                </div>

                {/* Total Savings */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-100 shadow-sm">
                  <div className="flex items-center gap-2 text-dark/50 text-xs mb-2">
                    <TrendingDown size={12} className="text-emerald-500" />
                    <span>{t('dashboard', 'totalSavings') || 'Total Savings'}</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {totalSavings} {t('pricing', 'egp')}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {scans.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center"
              >
                <div className="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="text-gold/30" size={40} />
                </div>
                <p className="text-dark/50 font-semibold text-lg mb-2">
                  {t('userScans', 'noScans')}
                </p>
                <p className="text-dark/40 text-sm mb-6">
                  {t('userScans', 'noScansHint')}
                </p>
                <Link
                  to="/dashboard/discounts"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-[#a67c3d] text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-md transition-all"
                >
                  <Tag size={16} />
                  {t('discountsBrowse', 'heading') || 'Browse Discounts'}
                  <ArrowRight size={14} className={lang === 'ar' ? 'rotate-180' : ''} />
                </Link>
              </motion.div>
            ) : (
              /* Discount List */
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {scans.map((scan, i) => (
                    <motion.div
                      key={scan.id || i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <UsedDiscountCard
                        scan={scan}
                        discount={scan.discount}
                        onClick={() => handleCardClick(scan)}
                        index={i}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Clickable Info Note */}
            {scans.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-3 bg-blue-50 rounded-xl border border-blue-100 text-center"
              >
                <p className="text-sm text-blue-700">
                  💡 {t('userScans', 'clickToViewDetails') || 'Click on any discount to view full details'}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Discount Details Modal - Read Only */}
      <DiscountDetailsModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedScan(null)
        }}
        discount={selectedScan?.discount}
        scan={selectedScan}
      />
    </>
  )
}
