/** Shared helpers — keep every pricing-card field when merging API + translation data */

const STATIC_PLAN_IDS = ['free', 'premium', 'elite']

export function getStaticPricingPlans(t, ta) {
  return [
    {
      id: 'free',
      name: t('pricing', 'freeName'),
      price: '0',
      period: t('pricing', 'monthly'),
      description: t('pricing', 'freeDesc'),
      features: ta('pricing', 'freeFeatures'),
      popular: false,
      duration_months: 0,
    },
    {
      id: 'premium',
      name: t('pricing', 'premiumName'),
      price: '99',
      period: t('pricing', 'monthly'),
      description: t('pricing', 'premiumDesc'),
      features: ta('pricing', 'premiumFeatures'),
      popular: true,
      duration_months: 1,
    },
    {
      id: 'elite',
      name: t('pricing', 'eliteName'),
      price: '199',
      period: t('pricing', 'monthly'),
      description: t('pricing', 'eliteDesc'),
      features: ta('pricing', 'eliteFeatures'),
      popular: false,
      duration_months: 1,
    },
  ]
}

function featureLabel(feature, lang) {
  if (!feature) return ''
  if (typeof feature === 'string') return feature
  if (lang === 'en' && feature.nameEn) return feature.nameEn
  return feature.name || feature.nameAr || ''
}

export function extractFeatureLabels(features, lang = 'ar') {
  if (!Array.isArray(features)) return []
  return features.map(f => featureLabel(f, lang)).filter(Boolean)
}

export function mergeFeatureLists(...lists) {
  const seen = new Set()
  const merged = []
  for (const list of lists) {
    for (const item of list || []) {
      const label = typeof item === 'string' ? item : featureLabel(item)
      if (label && !seen.has(label)) {
        seen.add(label)
        merged.push(label)
      }
    }
  }
  return merged
}

function resolvePeriod(plan, t, lang) {
  const months = plan.duration_months ?? (
    plan.durationDays != null ? Math.max(0, Math.round(plan.durationDays / 30)) : null
  )
  if (months === 0) return t('pricing', 'monthly')
  if (months != null && months > 1) {
    return lang === 'ar' ? `كل ${months} أشهر` : `Every ${months} months`
  }
  return t('pricing', 'monthly')
}

function resolveDescription(plan, staticPlan, t, lang) {
  if (lang === 'en' && plan.description) return plan.description
  if (lang === 'ar' && plan.descriptionAr) return plan.descriptionAr
  if (plan.description) return plan.description
  return staticPlan?.description || ''
}

/**
 * Merge API/local plan with static translation card data.
 * Static fields are the base; API fields override when present.
 * Features are combined so nothing from either source is dropped.
 */
export function enrichPricingPlan(plan, staticPlan, t, lang) {
  const id = String(plan.id || plan._id || staticPlan?.id || '')
  const staticFeatures = staticPlan?.features || []
  const apiFeatureLabels = extractFeatureLabels(plan.features, lang)

  return {
    ...staticPlan,
    ...plan,
    id: id || staticPlan?.id,
    name: (lang === 'en' && plan.nameEn)
      ? plan.nameEn
      : (lang === 'ar' && plan.nameAr)
        ? plan.nameAr
        : staticPlan?.name || plan.name,
    price: String(plan.price ?? staticPlan?.price ?? '0'),
    period: resolvePeriod({ ...staticPlan, ...plan }, t, lang),
    description: resolveDescription(plan, staticPlan, t, lang),
    features: mergeFeatureLists(staticFeatures, apiFeatureLabels),
    popular: plan.popular ?? staticPlan?.popular ?? false,
    duration_months: plan.duration_months ?? staticPlan?.duration_months,
    max_discount_usage: plan.max_discount_usage ?? staticPlan?.max_discount_usage,
    max_monthly_promo_uses: plan.max_monthly_promo_uses ?? staticPlan?.max_monthly_promo_uses,
    is_active: plan.is_active ?? plan.isActive ?? staticPlan?.is_active ?? true,
  }
}

export function buildPricingPlansFromApi(rawPlans, t, ta, lang) {
  const staticPlans = getStaticPricingPlans(t, ta)
  const staticById = Object.fromEntries(staticPlans.map(p => [p.id, p]))

  if (!rawPlans?.length) return staticPlans

  const enriched = rawPlans.map(plan => {
    const id = String(plan.id || plan._id || '')
    const staticPlan = staticById[id] || staticPlans.find(s => s.name === plan.name) || null
    return enrichPricingPlan(plan, staticPlan, t, lang)
  })

  // Keep any static cards missing from the API response
  for (const staticPlan of staticPlans) {
    if (!enriched.some(p => p.id === staticPlan.id)) {
      enriched.push({ ...staticPlan })
    }
  }

  return enriched.sort((a, b) => {
    const ai = STATIC_PLAN_IDS.indexOf(a.id)
    const bi = STATIC_PLAN_IDS.indexOf(b.id)
    if (ai === -1 && bi === -1) return 0
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}
