// Text content moved to translations.js — this file now only holds structural/numeric data
export const servicesData = {
  'medical': {
    id: 'medical',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop',
    icon: 'fa-hospital',
    features: [1, 2, 3, 4, 5, 6],
    coverages: [1, 2, 3, 4, 5, 6],
    faq: [1, 2, 3, 4],
    pricing: { monthly: 149, yearly: 1490, discount: '17%' },
  },
  'financial': {
    id: 'financial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop',
    icon: 'fa-wallet',
    features: [1, 2, 3, 4, 5, 6],
    coverages: [1, 2, 3, 4, 5, 6],
    faq: [1, 2, 3, 4],
    pricing: { monthly: 99, yearly: 990, discount: '17%' },
  },
  'courses': {
    id: 'courses',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop',
    icon: 'fa-graduation-cap',
    features: [1, 2, 3, 4, 5, 6],
    coverages: [1, 2, 3, 4, 5, 6],
    faq: [1, 2, 3, 4],
    pricing: { monthly: 99, yearly: 990, discount: '17%' },
  },
  'restaurants': {
    id: 'restaurants',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop',
    icon: 'fa-utensils',
    features: [1, 2, 3, 4, 5, 6],
    coverages: [1, 2, 3, 4, 5, 6],
    faq: [1, 2, 3, 4],
    pricing: { monthly: 49, yearly: 490, discount: '17%' },
  },
  'entertainment': {
    id: 'entertainment',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop',
    icon: 'fa-dumbbell',
    features: [1, 2, 3, 4, 5, 6],
    coverages: [1, 2, 3, 4, 5, 6],
    faq: [1, 2, 3, 4],
    pricing: { monthly: 49, yearly: 490, discount: '17%' },
  },
}

export const allServices = Object.values(servicesData)
