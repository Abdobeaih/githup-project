import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import PricingCard from '../components/PricingCard'
import { getPlans, getPlanFeatures, getFeatures } from '../services/subscriptionsService'

export default function Pricing() {
  const { t, ta } = useLanguage()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const plansRes = await getPlans()
        const rawPlans = plansRes?.data || []
        const allFeaturesRes = await getFeatures()
        const allFeatures = allFeaturesRes?.data || []

        // Attach features to each plan
        const enriched = await Promise.all(rawPlans.map(async (plan) => {
          const pfRes = await getPlanFeatures(plan.id)
          const pfData = pfRes?.data || []
          const features = pfData
            .map(pf => {
              const feat = pf.feature || allFeatures.find(f => f.id === pf.feature_id)
              return feat?.name || null
            })
            .filter(Boolean)

          return {
            id: plan.id,
            name: plan.name,
            price: String(plan.price),
            period: plan.duration_months === 0 ? 'شهرية' : plan.duration_months > 1 ? `كل ${plan.duration_months} أشهر` : 'شهرية',
            description: plan.name === 'مجاني' ? 'ابدأ رحلة التوفير' : `باقة ${plan.name}`,
            features,
            popular: plan.popular,
          }
        }))
        setPlans(enriched)
      } catch {
        // Fallback to translation-based data
        setPlans([
          { name: t('pricing', 'freeName'), price: '0', period: t('pricing', 'monthly'), description: t('pricing', 'freeDesc'), features: ta('pricing', 'freeFeatures') },
          { name: t('pricing', 'premiumName'), price: '99', period: t('pricing', 'monthly'), description: t('pricing', 'premiumDesc'), features: ta('pricing', 'premiumFeatures') },
          { name: t('pricing', 'eliteName'), price: '199', period: t('pricing', 'monthly'), description: t('pricing', 'eliteDesc'), features: ta('pricing', 'eliteFeatures') },
        ])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [t, ta])

  if (loading) {
    return (
      <section className="pt-32 pb-24 bg-white min-h-screen">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-24 mx-auto" />
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <Helmet>
        <title>{t('pricing', 'title')}</title>
        <meta name="description" content={t('pricing', 'description')} />
      </Helmet>
      <section className="pt-32 pb-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-gold font-bold text-sm tracking-wider uppercase mb-2 block">{t('pricing', 'sectionLabel')}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">{t('pricing', 'heading')}</h1>
            <p className="text-dark/60 max-w-2xl mx-auto">{t('pricing', 'paragraph')}</p>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full mt-6"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {plans.map((plan, i) => (
              <PricingCard key={plan.id || i} plan={plan} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
