import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { handleSubscribe } from '../../utils/subscribeUtils'
import { motion } from 'framer-motion'
import { Check, ArrowLeft, Shield, HelpCircle, CreditCard, Star, Store } from 'lucide-react'
import Breadcrumb from '../../components/Breadcrumb'
import FAQ from '../../components/FAQ'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useLanguage } from '../../context/LanguageContext'
import { servicesData } from '../../data/servicesData'
import { getAllRestaurants } from '../../data/db'

/* ── Marquee component — scrolls all items through, then restarts from beginning ── */
function Marquee({ children }) {
  return (
    <div className="relative overflow-hidden w-full">
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-scroll 40s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="marquee-track">
        {children}
      </div>
    </div>
  )
}

/* ── Restaurant Card inside marquee ── */
function RestaurantCard({ restaurant }) {
  const { td } = useLanguage()
  return (
    <div className="flex-shrink-0 w-64 mx-3 bg-white rounded-2xl border border-gold/10 shadow-sm hover:shadow-md hover:border-gold/30 transition-all overflow-hidden">
      <div className="h-36 overflow-hidden relative">
        <img
          src={restaurant.img_url}
          alt={td('companies', restaurant.name)}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-dark/70 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {restaurant.discount_percent} خصم
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-bold text-dark mb-1 truncate">{td('companies', restaurant.name)}</h4>
        <div className="flex items-center justify-between text-xs text-dark/60 mb-1">
          <span>{td('cuisines', restaurant.cuisine)}</span>
          <div className="flex items-center gap-1" dir="ltr">
            <Star size={12} className="text-gold" fill="currentColor" />
            <span className="font-semibold text-dark">{restaurant.rating}</span>
          </div>
        </div>
        <span className="inline-block bg-gold/10 text-gold text-xs font-bold px-2 py-0.5 rounded-full mt-1">
          {td('governorates', restaurant.governorate)}
        </span>
      </div>
    </div>
  )
}

export default function Restaurants() {
  const service = servicesData['restaurants']
  const section = 'restaurants'
  const { t, tf, td } = useLanguage()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = getAllRestaurants()
    setRestaurants(data)
    setLoading(false)
  }, [])

  if (!service) return null
  if (loading) return <LoadingSpinner />

  const breadcrumbItems = [
    { label: t('serviceDetail', 'backToServices'), href: '/#services' },
    { label: t(section, 'heading') },
  ]

  return (
    <>
      <Helmet>
        <title>{t(section, 'title')}</title>
        <meta name="description" content={t(section, 'description')} />
        <meta property="og:title" content={t(section, 'title')} />
        <meta property="og:description" content={t(section, 'description')} />
      </Helmet>

      {/* ── Hero Section ── */}
      <section className="relative min-h-[60vh] hero-gradient flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gold/5 rounded-full top-20 -left-48 animate-float" />
        <div className="absolute w-72 h-72 bg-gold/5 rounded-full bottom-10 right-10 animate-float" style={{ animationDelay: '-5s' }} />
        <div className="container mx-auto px-6 relative z-10">
          <Breadcrumb items={breadcrumbItems} />
          <motion.div
            className="mt-8 grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-4 py-2 rounded-full mb-6">
                <Star className="text-gold" size={14} />
                <span className="text-gold text-sm font-bold">{t('common', 'premiumService')}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
                {t(section, 'heading')}
              </h1>
              <p className="text-xl text-goldLight/80 mb-6">{t(section, 'subtitle')}</p>
              <p className="text-goldLight/70 leading-relaxed mb-8 text-lg">{t(section, 'heroText')}</p>
              <button
                onClick={() => handleSubscribe(navigate, isAuthenticated, { service: 'restaurants' })}
                className="btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20"
              >
                <CreditCard size={20} />
                {t(section, 'cta')}
              </button>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gold/20">
                <img
                  src={service.image}
                  alt={t(section, 'heading')}
                  className="w-full object-cover h-[400px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Description Section (at top) ── */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-dark mb-6 text-center">{t('common', 'serviceDesc')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full mb-10" />
            <p className="text-dark/70 leading-loose text-lg text-center">{t(section, 'longDesc')}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Marquee 1: Participating Restaurants & Cafes ── */}
      <section className="py-16 bg-cream overflow-hidden">
        <div className="container mx-auto px-6 mb-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 mb-3">
              <Store size={24} className="text-gold" />
              <h2 className="text-2xl md:text-3xl font-bold text-dark">
                جميع المطاعم والمقاهي المشاركة
              </h2>
            </div>
            <p className="text-dark/50 text-sm">
              {restaurants.length} مطعم وكافيه شريك في جميع المحافظات
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full mt-4" />
          </motion.div>
        </div>
        <Marquee>
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </Marquee>
      </section>

      {/* ── Features Section ── */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">{t('common', 'features')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {service.features.map((feature, i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-[#a67c3d] rounded-xl flex items-center justify-center text-dark mb-4 shadow-lg shadow-gold/20 group-hover:scale-110 transition-transform">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">{tf(section, 'features', i, 'title')}</h3>
                <p className="text-dark/60 text-sm leading-relaxed">{tf(section, 'features', i, 'desc')}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coverage Table ── */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">{t('common', 'coverages')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full" />
          </div>
          <motion.div
            className="max-w-3xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-gold/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-dark to-darkLight p-6">
              <div className="flex items-center gap-3 text-white">
                <Shield className="text-gold" size={24} />
                <h3 className="text-xl font-bold">{t('common', 'coverageTable')}</h3>
              </div>
            </div>
            <div className="divide-y divide-gold/10">
              {service.coverages.map((coverage, i) => (
                <div key={i} className="flex items-center justify-between p-5 hover:bg-gold/5 transition-colors">
                  <span className="text-dark font-semibold">{tf(section, 'coverages', i, 'name')}</span>
                  <span className="bg-gold/10 text-gold px-4 py-1.5 rounded-full text-sm font-bold">{tf(section, 'coverages', i, 'value')}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ & CTA ── */}
      <section className="py-20 bg-gradient-to-br from-dark via-darkLight to-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #c19553 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          {/* FAQ */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <HelpCircle className="text-gold" size={24} />
              <h2 className="text-3xl font-bold text-white">{t('common', 'faq')}</h2>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full" />
          </div>
          <FAQ items={service.faq.map((_, i) => ({ q: tf(section, 'faq', i, 'q'), a: tf(section, 'faq', i, 'a') }))} />

          {/* Join CTA */}
          <div className="mt-16 pt-16 border-t border-gold/10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('common', 'ctaTitle')}</h2>
              <p className="text-goldLight/70 max-w-2xl mx-auto mb-8 text-lg">{t('common', 'ctaSubtitle')}</p>
              <button onClick={() => handleSubscribe(navigate, isAuthenticated, { service: 'restaurants' })} className="btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20">
                {t('common', 'ctaButton')}
                <ArrowLeft size={20} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
