import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, HeartPulse, Wallet, GraduationCap, Utensils, Dumbbell, Landmark } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const iconMap = {
  'fa-hospital': HeartPulse,
  'fa-wallet': Wallet,
  'fa-graduation-cap': GraduationCap,
  'fa-utensils': Utensils,
  'fa-dumbbell': Dumbbell,
  'fa-landmark': Landmark,
}

export default function ServiceCard({ service, index }) {
  const { t, tf } = useLanguage()
  const isReversed = index % 2 === 1
  const IconComponent = iconMap[service.icon] || HeartPulse
  const section = service.id

  return (
    <motion.div 
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-16 ${isReversed ? 'md:flex-row-reverse' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex-1 w-full">
        <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl border border-gold/20 group">
          <img 
            src={service.image} 
            alt={t(section, 'heading')} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent"></div>
          <div className={`absolute bottom-6 ${isReversed ? 'left-6' : 'right-6'}`}>
            <div className="w-16 h-16 bg-gradient-to-br from-gold to-[#a67c3d] rounded-2xl flex items-center justify-center text-dark shadow-lg shadow-gold/30">
              <IconComponent size={28} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full">
        <h3 className="text-3xl font-bold text-dark mb-4">{t(section, 'heading')}</h3>
        <p className="text-dark/70 leading-relaxed mb-6 text-lg">{t(section, 'heroText')}</p>
        <div className="flex flex-wrap gap-3 mb-8">
          {service.features.slice(0, 4).map((feature, j) => (
            <span key={j} className="bg-dark/5 border border-gold/20 px-4 py-2 rounded-xl text-sm font-semibold text-dark/80 flex items-center gap-2">
              <Check className="text-gold" size={14} />
              {tf(section, 'features', j, 'title')}
            </span>
          ))}
        </div>
        <Link 
          to={`/services/${service.id}`}
          className="bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-gold/30 transition-all flex items-center gap-2 group w-fit"
        >
          {t('serviceCard', 'discoverMore')}
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>
    </motion.div>
  )
}
