import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import { Construction } from 'lucide-react'

export default function AdminSettlements() {
  const { t } = useLanguage()

  return (
    <>
      <Helmet><title>التسويات - لوحة الإدارة - مستكلين</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BackButton />
            <h1 className="text-3xl font-bold text-dark mb-2">التسويات</h1>
            <p className="text-dark/60 mb-8">إدارة التسويات المالية مع الشركات</p>

            <div className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center">
              <Construction size={64} className="mx-auto mb-6 text-gold/40" />
              <h2 className="text-2xl font-bold text-dark mb-3">قيد التطوير</h2>
              <p className="text-dark/50 max-w-md mx-auto">
                صفحة إدارة التسويات المالية قيد التطوير حاليًا. سيتم إطلاقها في التحديث القادم.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
