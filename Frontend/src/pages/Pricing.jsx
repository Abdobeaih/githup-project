import { useMemo, useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../context/LanguageContext'
import PricingCard from '../components/PricingCard'
import { getPlansWithFeatures, peekPlansWithFeaturesCache } from '../services/subscriptionsService'
import { buildPricingPlansFromApi, getStaticPricingPlans } from '../utils/pricingPlans'

function resolveInitialPlans(t, ta, lang) {
  const cached = peekPlansWithFeaturesCache()
  if (cached?.length) {
    return buildPricingPlansFromApi(cached, t, ta, lang)
  }
  return getStaticPricingPlans(t, ta)
}

export default function Pricing() {
  const { t, ta, lang } = useLanguage()
  const staticPlans = useMemo(() => getStaticPricingPlans(t, ta), [t, ta])
  const [plans, setPlans] = useState(() => resolveInitialPlans(t, ta, lang))

  // Keep cards visible when language changes; merge cache/static immediately
  useEffect(() => {
    setPlans(resolveInitialPlans(t, ta, lang))
  }, [t, ta, lang])

  // Refresh from API in background — never block the UI with a skeleton
  useEffect(() => {
    let cancelled = false

    getPlansWithFeatures()
      .then((plansRes) => {
        const rawPlans = plansRes?.data || []
        if (!cancelled && rawPlans.length > 0) {
          setPlans(buildPricingPlansFromApi(rawPlans, t, ta, lang))
        }
      })
      .catch(() => {
        if (!cancelled) setPlans(staticPlans)
      })

    return () => { cancelled = true }
  }, [t, ta, lang, staticPlans])

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
