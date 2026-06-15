import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import { getGovernorates } from '../../data/db'
import { User, Mail, Briefcase, Lock, Calendar, Award, MapPin, Phone } from 'lucide-react'

export default function UserProfile() {
  const { user } = useAuth()
  const { t, td, lang } = useLanguage()
  const [governorates, setGovernorates] = useState([])
  const form = { name: user?.name || '', email: user?.email || '', phone: user?.phone || '', nationalId: user?.nationalId || '', job: user?.job || '', governorate: user?.governorate || '' }

  useEffect(() => { setGovernorates(getGovernorates()) }, [])

  if (!user) return null

  const planLabels = { free: t('discountsBrowse', 'free'), premium: t('discountsBrowse', 'premium'), elite: t('discountsBrowse', 'elite') }
  const planColors = { free: 'bg-gray-500', premium: 'bg-gold', elite: 'bg-emerald-500' }

  return (
    <>
      <Helmet><title>{t('userProfile', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-dark mb-2">{t('userProfile', 'heading')}</h1>
            <p className="text-dark/60 mb-10">{t('userProfile', 'subtitle')}</p>

            {/* Member info */}
            <div className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm mb-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-cream rounded-xl p-4 text-center">
                  <Calendar className="text-gold mx-auto mb-2" size={24} />
                  <p className="text-dark/50 text-xs">{t('userProfile', 'joinDate')}</p>
                  <p className="font-bold text-dark text-sm mt-1">{new Date(user.join_date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                </div>
                <div className="bg-cream rounded-xl p-4 text-center">
                  <Award className="text-gold mx-auto mb-2" size={24} />
                  <p className="text-dark/50 text-xs">{t('userProfile', 'memberId')}</p>
                  <p className="font-bold text-dark text-sm mt-1" dir="ltr">{user.id}</p>
                </div>
                <div className="bg-cream rounded-xl p-4 text-center">
                  <span className={`inline-block ${planColors[user.plan]} text-white px-4 py-2 rounded-full font-bold text-sm`}>{planLabels[user.plan]}</span>
                  <p className="text-dark/50 text-xs mt-2">{t('dashboard', 'currentPlan')}</p>
                </div>
              </div>
            </div>

            {/* Profile info (read-only) */}
            <div className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm">
              <h2 className="text-xl font-bold text-dark mb-6">{t('userProfile', 'personalInfo')}</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('userProfile', 'fullName')}</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <div className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark">
                      {td('users', form.name) || form.name}
                    </div>
                  </div>
                </div>
                 <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('userProfile', 'email')}</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <div className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark">
                      {form.email}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('userProfile', 'phone')}</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <div className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark">
                      {form.phone}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('userProfile', 'nationalId')}</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <div className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark">
                      {form.nationalId}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('userProfile', 'specialty')}</label>
                  <div className="relative">
                    <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <div className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark">
                      {td('jobs', form.job) || form.job}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('userProfile', 'governorate')}</label>
                  <div className="relative">
                    <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <div className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark">
                      {td('governorates', form.governorate) || form.governorate || t('userProfile', 'chooseGovernorate')}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('userProfile', 'password')}</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <div className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark">
                      {'••••••••'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
