import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Percent, Users, GraduationCap, Rocket } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const Hero = memo(function Hero() {
  const { t } = useLanguage()
  const badges = [
    { icon: Shield, text: t('hero', 'badgeMedical') },
    { icon: Rocket, text: t('hero', 'badgeFinancial') },
    { icon: Users, text: t('hero', 'badgeSocial') },
    { icon: GraduationCap, text: t('hero', 'badgeCourses') },
  ]

  return (
    <section id="home" className="relative min-h-screen hero-gradient flex items-center pt-20 overflow-hidden">
      <div className="absolute w-96 h-96 bg-gold/5 rounded-full top-20 -left-48 animate-float"></div>
      <div className="absolute w-72 h-72 bg-gold/5 rounded-full bottom-20 right-10 animate-float" style={{animationDelay: '-5s'}}></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-dark/60 backdrop-blur px-4 py-2 rounded-full shadow-sm mb-6 border border-gold/30">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-goldLight">{t('hero', 'badge')}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              {t('hero', 'title1')}<br/><span className="gold-text">{t('hero', 'title2')}</span>
            </h1>
            <p className="text-lg text-goldLight/80 mb-8 leading-relaxed max-w-lg">
              {t('hero', 'subtitle')}
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {badges.map((badge, i) => (
                <span key={i} className="bg-dark/60 px-4 py-2 rounded-xl shadow-sm border border-gold/20 text-sm font-semibold text-goldLight flex items-center gap-2 hover:border-gold/50 transition-colors">
                  <badge.icon className="text-gold" size={16} />
                  {badge.text}
                </span>
              ))}
            </div>
            <Link to="/join" className="btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20">
              <Rocket size={20} />
              {t('hero', 'cta')}
            </Link>
          </motion.div>
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              <picture>
              <source srcSet="/Hero-img.png" type="image/png" />
              <img 
                src="/Hero-img.png" 
                alt={t('hero', 'altText') || 'Freelancer Team'} 
                width="800" height="500"
                fetchpriority="high"
                decoding="async"
                className="rounded-3xl shadow-2xl w-full object-cover h-[500px] border border-gold/20"
              />
            </picture>
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-dark p-4 rounded-2xl shadow-xl border border-gold/30"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center text-gold">
                    <Shield size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-white">{t('hero', 'cardProtection')}</p>
                    <p className="text-xs text-goldLight/70">{t('hero', 'cardMedicalFinancial')}</p>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                className="absolute -top-6 -right-6 bg-dark p-4 rounded-2xl shadow-xl border border-gold/30"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: -3 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center text-gold">
                    <Percent size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-white">{t('hero', 'cardDiscounts')}</p>
                    <p className="text-xs text-goldLight/70">{t('hero', 'cardSaving')}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
})

export default Hero