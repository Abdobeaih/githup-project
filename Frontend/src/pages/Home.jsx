import { Helmet } from 'react-helmet-async'
import Hero from '../components/Hero'
import MarqueeStats from '../components/MarqueeStats'
import ServiceCard from '../components/ServiceCard'
import { allServices } from '../data/servicesData'
import { useLanguage } from '../context/LanguageContext'

export default function Home() {
  const { t } = useLanguage()
  return (
    <>
      <Helmet>
        <title>{t('home', 'title')}</title>
        <meta name="description" content={t('home', 'description')} />
      </Helmet>
      <Hero />
      <MarqueeStats />
      <section id="services" className="py-24 bg-cream relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-gold font-bold text-sm tracking-wider uppercase mb-2 block">{t('home', 'sectionLabel')}</span>
            <h2 className="text-4xl font-bold text-dark mb-4">{t('home', 'sectionTitle')}</h2>
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
