import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getAllDiscounts } from '../../data/db'
import { DISCOUNT_CATEGORY_LABELS, CATEGORY_COLORS } from '../../types/discount'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AdminCategories() {
  const { t, lang } = useLanguage()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const discounts = getAllDiscounts()
    const categoryMap = {}

    discounts.forEach(d => {
      const cat = d.category
      if (!categoryMap[cat]) {
        categoryMap[cat] = { category: cat, count: 0 }
      }
      categoryMap[cat].count++
    })

    const result = Object.values(categoryMap).map(c => ({
      ...c,
      label: DISCOUNT_CATEGORY_LABELS[c.category] || c.category,
      colorClass: CATEGORY_COLORS[c.category] || 'bg-gray-100 text-gray-600',
    })).sort((a, b) => b.count - a.count)

    setCategories(result)
    setLoading(false)
  }, [])

  return (
    <>
      <Helmet><title>{t('adminCategories', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <h1 className="text-3xl font-bold text-dark mb-2">{t('adminCategories', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{t('adminCategories', 'subtitle')}</p>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {categories.map((cat, i) => (
                  <Link key={cat.category} to={`/dashboard/admin/discounts?category=${cat.category}`} className="group">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm hover:shadow-lg hover:border-gold/30 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${cat.colorClass}`}>{cat.label}</span>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="text-gold/50 group-hover:text-gold transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </motion.div>
                      </div>
                      <p className="text-3xl font-bold text-dark">{cat.count}</p>
                      <p className="text-dark/50 text-sm mt-1">{t('adminCategories', 'discountsCount')}</p>
                    </motion.div>
                  </Link>
                ))}
                {categories.length === 0 && (
                  <div className="col-span-full bg-white rounded-2xl p-12 border border-gold/10 text-center">
                    <p className="text-dark/50">{t('adminCategories', 'noCategories')}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}