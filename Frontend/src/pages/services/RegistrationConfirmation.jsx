import { useLocation, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, ArrowLeft, Home } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { servicesData } from '../../data/servicesData'

export default function RegistrationConfirmation() {
  const { lang } = useLanguage()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const serviceId = searchParams.get('service')
  const service = serviceId ? servicesData[serviceId] : null
  const data = location.state

  return (
    <>
      <Helmet>
        <title>{lang === 'ar' ? 'تم تقديم الطلب' : 'Request Submitted'}</title>
      </Helmet>

      <section className="min-h-[80vh] flex items-center justify-center bg-cream px-6">
        <motion.div
          className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gold/10 p-10 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={44} className="text-emerald-500" />
          </motion.div>

          <h1 className="text-3xl font-extrabold text-dark mb-3">
            {lang === 'ar' ? 'تم تقديم الطلب بنجاح' : 'Request Submitted Successfully'}
          </h1>
          <p className="text-dark/60 mb-8 text-lg">
            {lang === 'ar'
              ? 'سنقوم بمراجعة طلبك والتواصل معك في أقرب وقت ممكن'
              : 'We will review your request and contact you as soon as possible'}
          </p>

          {service && (
            <motion.div
              className="bg-cream/80 rounded-2xl p-5 border border-gold/10 mb-8 text-right"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gold/10 flex items-center justify-center shrink-0">
                  {service.image ? (
                    <img src={service.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center">
                      <CheckCircle size={24} className="text-gold" />
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-dark text-lg">{service.name}</p>
                  {data?.provider_name && (
                    <p className="text-dark/50 text-sm">{data.provider_name}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {data && (
            <div className="text-right space-y-2 mb-8 text-sm">
              {data.name && (
                <div className="flex justify-between">
                  <span className="text-dark/50">{lang === 'ar' ? 'الاسم' : 'Name'}</span>
                  <span className="text-dark font-semibold">{data.name}</span>
                </div>
              )}
              {data.phone && (
                <div className="flex justify-between">
                  <span className="text-dark/50">{lang === 'ar' ? 'الهاتف' : 'Phone'}</span>
                  <span className="text-dark font-semibold" dir="ltr">{data.phone}</span>
                </div>
              )}
              {data.email && (
                <div className="flex justify-between">
                  <span className="text-dark/50">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</span>
                  <span className="text-dark font-semibold">{data.email}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/services"
              className="bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-gold/30 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              {lang === 'ar' ? 'العودة للخدمات' : 'Back to Services'}
            </Link>
            <Link
              to="/"
              className="border-2 border-gold/30 text-gold font-bold px-8 py-3.5 rounded-xl hover:bg-gold/5 transition-all flex items-center justify-center gap-2"
            >
              <Home size={18} />
              {lang === 'ar' ? 'الصفحة الرئيسية' : 'Home'}
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  )
}
