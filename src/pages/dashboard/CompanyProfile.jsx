import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { updateCompany } from '../../data/db'
import BackButton from '../../components/BackButton'
import { Building2, Mail, Lock, MapPin, Tag, Percent, Calendar } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { COMPANY_CATEGORIES } from '../../types/company'
 
export default function CompanyProfile() {
  const { company, refreshUser } = useAuth()
  const { t, lang } = useLanguage()
  const [form, setForm] = useState({
    name: company?.name || '',
    email: company?.email || '',
    category: company?.category || COMPANY_CATEGORIES.FOOD,
    city: company?.city || '',
    emoji: company?.emoji || '🏢',
    password: company?.password || '',
  })
  const [saved, setSaved] = useState(false)

  if (!company) return null

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = (e) => {
    e.preventDefault()
    updateCompany(company.id, form)
    refreshUser()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const categoryLabels = { medical: t('companyProfile', 'medical'), gym: t('companyProfile', 'sports'), food: t('companyProfile', 'restaurants'), fun: t('companyProfile', 'entertainment') }

  return (
    <>
      <Helmet><title>{t('companyProfile', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <BackButton />
            <h1 className="text-3xl font-bold text-dark mb-2">{t('companyProfile', 'heading')}</h1>
            <p className="text-dark/60 mb-10">{t('companyProfile', 'subtitle')}</p>

            {/* Info cards */}
            <div className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm mb-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-cream rounded-xl p-4 text-center">
                  <Calendar className="text-gold mx-auto mb-2" size={24} />
                  <p className="text-dark/50 text-xs">{t('companyProfile', 'joinDate')}</p>
                  <p className="font-bold text-dark text-sm mt-1">{new Date(company.join_date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
                </div>
                <div className="bg-cream rounded-xl p-4 text-center">
                  <Tag className="text-gold mx-auto mb-2" size={24} />
                  <p className="text-dark/50 text-xs">{t('companyProfile', 'accountNumber')}</p>
                  <p className="font-bold text-dark text-sm mt-1" dir="ltr">{company.id}</p>
                </div>
                <div className="bg-cream rounded-xl p-4 text-center">
                  <Percent className="text-gold mx-auto mb-2" size={24} />
                  <p className="text-dark/50 text-xs">{t('companyProfile', 'commission')}</p>
                  <p className="font-bold text-dark text-sm mt-1">{company.commission}%</p>
                </div>
              </div>
            </div>

            {/* Edit form */}
            <form onSubmit={handleSave} className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm">
              <div className="space-y-5">
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('companyProfile', 'companyName')}</label>
                  <div className="relative">
                    <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('companyProfile', 'email')}</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('companyProfile', 'category')}</label>
                    <div className="relative">
                      <Tag className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                      <select name="category" value={form.category} onChange={handleChange} className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all appearance-none cursor-pointer">
                        <option value={COMPANY_CATEGORIES.MEDICAL}>{t('companyProfile', 'medical')}</option>
                        <option value={COMPANY_CATEGORIES.GYM}>{t('companyProfile', 'sports')}</option>
                        <option value={COMPANY_CATEGORIES.FOOD}>{t('companyProfile', 'restaurants')}</option>
                        <option value={COMPANY_CATEGORIES.FUN}>{t('companyProfile', 'entertainment')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('companyProfile', 'city')}</label>
                    <div className="relative">
                      <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                      <input type="text" name="city" value={form.city} onChange={handleChange} className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('companyProfile', 'emoji')}</label>
                  <input type="text" name="emoji" value={form.emoji} onChange={handleChange} className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3.5 text-dark outline-none focus:border-gold/60 transition-all text-center text-2xl" />
                </div>
                <div>
                  <label className="block text-dark font-semibold mb-2 text-sm">{t('companyProfile', 'password')}</label>
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all" />
                  </div>
                </div>
              </div>
              <button type="submit" className="mt-8 w-full bg-gradient-to-r from-gold to-[#a67c3d] text-dark py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-gold/20 transition-all">
                {saved ? t('companyProfile', 'saved') : t('companyProfile', 'save')}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </>
  )
}
