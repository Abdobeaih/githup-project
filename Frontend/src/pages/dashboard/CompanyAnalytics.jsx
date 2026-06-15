import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { getDiscountsByCompany } from '../../data/db'
import BackButton from '../../components/BackButton'
import { Eye, Activity, Percent } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
 
export default function CompanyAnalytics() {
  const { company } = useAuth()
  const { t, td } = useLanguage()
  const [discounts, setDiscounts] = useState([])

  useEffect(() => {
    if (company) setDiscounts(getDiscountsByCompany(company.id))
  }, [company])

  if (!company) return null

  const totalViews = discounts.reduce((sum, d) => sum + d.views, 0)
  const totalUses = discounts.reduce((sum, d) => sum + d.uses, 0)
  const maxViews = Math.max(...discounts.map(d => d.views), 1)

  return (
    <>
      <Helmet><title>{t('companyAnalytics', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <h1 className="text-3xl font-bold text-dark mb-2">{t('companyAnalytics', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{t('companyAnalytics', 'subtitle')}</p>

            {/* Summary cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {[
                { label: t('companyAnalytics', 'totalViews'), value: totalViews, icon: Eye, color: 'text-blue-500' },
                { label: t('companyAnalytics', 'totalUses'), value: totalUses, icon: Activity, color: 'text-emerald-500' },
                { label: t('companyAnalytics', 'commission'), value: `${company.commission}%`, icon: Percent, color: 'text-gold' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-5 border border-gold/10 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-dark/50 text-xs">{s.label}</span>
                    <s.icon className={s.color} size={22} />
                  </div>
                  <p className="text-2xl font-bold text-dark">{s.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Per-discount breakdown */}
            <h2 className="text-2xl font-bold text-dark mb-6">{t('companyAnalytics', 'perDiscount')}</h2>
            <div className="bg-white rounded-2xl border border-gold/10 shadow-sm overflow-hidden">
              {discounts.length === 0 ? (
                <p className="p-8 text-center text-dark/50">{t('companyAnalytics', 'noData')}</p>
              ) : (
                <div className="divide-y divide-gold/10">
                  {discounts.map((d, i) => (
                    <div key={d.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-bold text-dark">{td('discounts', d.name, 'name')}</p>
                          <p className="text-dark/40 text-xs">{d.discount_percent} {t('companyAnalytics', 'discountPercent')} • {td('governorates', d.city)}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-dark/50">
                          <span className="flex items-center gap-1"><Eye size={14} /> {d.views}</span>
                          <span className="flex items-center gap-1"><Activity size={14} /> {d.uses}</span>
                        </div>
                      </div>
                      {/* Views bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-dark/40 mb-1">
                          <span>{t('companyAnalytics', 'views')}</span>
                          <span>{d.views}</span>
                        </div>
                        <div className="w-full h-2.5 bg-cream rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(d.views / maxViews) * 100}%` }}></div>
                        </div>
                      </div>
                      {/* Uses bar */}
                      <div>
                        <div className="flex justify-between text-xs text-dark/40 mb-1">
                          <span>{t('companyAnalytics', 'uses')}</span>
                          <span>{d.uses}</span>
                        </div>
                        <div className="w-full h-2.5 bg-cream rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min((d.uses / Math.max(totalUses, 1)) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
