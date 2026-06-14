import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function NotFound() {
  const { t } = useLanguage()
  
  return (
    <section className="min-h-screen hero-gradient flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/20">
            <AlertTriangle className="text-gold" size={48} />
          </div>
          <h1 className="text-6xl font-extrabold text-white mb-4">404</h1>
          <h2 className="text-2xl font-bold text-goldLight mb-4">{t('notFound', 'title')}</h2>
          <p className="text-goldLight/60 max-w-md mx-auto mb-8">
            {t('notFound', 'subtitle')}
          </p>
          <Link 
            to="/" 
            className="btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20"
          >
            <Home size={20} />
            {t('notFound', 'cta')}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
