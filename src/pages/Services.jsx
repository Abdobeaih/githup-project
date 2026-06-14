import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ServiceCard from '../components/ServiceCard'
import { allServices } from '../data/servicesData'
import { useLanguage } from '../context/LanguageContext'

export default function Services() {
  const { t } = useLanguage()
  return (
    <>
      <Helmet>
        <title>{t('services', 'title')}</title>
        <meta name="description" content={t('services', 'description')} />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 hero-gradient overflow-hidden">
        <div className="absolute w-96 h-96 bg-gold/5 rounded-full top-20 -left-48 animate-float"></div>
        <div className="absolute w-72 h-72 bg-gold/5 rounded-full bottom-10 right-10 animate-float" style={{animationDelay: '-5s'}}></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-goldLight hover:text-gold transition-colors mb-6 text-sm">
              <ArrowLeft size={16} /> {t('services', 'backHome')}
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t('services', 'heading')}</h1>
            <p className="text-goldLight/60 text-lg leading-relaxed">
              {t('services', 'subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services list */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-gold font-bold text-sm tracking-wider uppercase mb-2 block">{t('services', 'sectionLabel')}</span>
            <h2 className="text-4xl font-bold text-dark mb-4">{t('services', 'sectionTitle')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-goldLight mx-auto rounded-full"></div>
          </div>
          <div className="max-w-6xl mx-auto">
            {allServices.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
