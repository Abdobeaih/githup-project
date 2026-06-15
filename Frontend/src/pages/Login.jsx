import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import { PasswordInput } from '../components/ui'

export default function Login() {
  const { login } = useAuth()
  const { t, lang } = useLanguage()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const result = login(form.email, form.password)
    if (result.success) {
      if (result.role === 'admin') navigate('/dashboard/admin')
      else if (result.role === 'company') navigate('/dashboard/company')
      else navigate('/dashboard/user')
    } else {
      setError(t('auth', result.error))
    }
  }

  return (
    <>
      <Helmet>
        <title>{t('login', 'title')}</title>
        <meta name="description" content={lang === 'ar' ? 'تسجيل الدخول إلى حسابك في مستقلين للاستفادة من خدمات الفريلانسر الشاملة' : 'Log in to your account to access freelance services'} />
      </Helmet>
      <section className="min-h-screen hero-gradient flex items-center pt-24 pb-12">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <Link to="/" className="inline-flex items-center gap-2 text-goldLight hover:text-gold transition-colors mb-6">
                <ArrowLeft size={18} /> {t('login', 'backHome')}
              </Link>
              <h1 className="text-4xl font-bold text-white mb-2">{t('login', 'heading')}</h1>
              <p className="text-goldLight/60">{t('login', 'subtitle')}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-gold/20">
              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="block text-goldLight font-semibold mb-2 text-sm">{t('login', 'email')}</label>
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                    <input type="email" name="email" value={form.email} onChange={handleChange} required
                      className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark outline-none transition-all input-focus"
                      placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <PasswordInput
                    label={t('login', 'password')}
                    icon={<Lock size={18} />}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    showStrength={false}
                    className="w-full bg-white/90 border-0 rounded-xl px-12 py-3.5 text-dark placeholder-dark/40 outline-none transition-all input-focus"
                    placeholder="••••••"
                  />
                </div>

                <div className="text-left">
                  <Link to="/forgot-password" className="text-sm text-gold hover:text-goldLight transition-colors">
                    {t('login', 'forgotPassword')}
                  </Link>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl py-3">
                    {error}
                  </motion.p>
                )}

                <button type="submit" className="w-full bg-gradient-to-r from-gold to-[#a67c3d] text-dark py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-gold/20 transition-all">
                  {t('login', 'submit')}
                </button>

                <p className="text-center text-goldLight/50 text-sm">
                  {t('login', 'noAccount')}{' '}
                  <Link to="/join" className="text-gold hover:text-goldLight transition-colors font-semibold">{t('login', 'signupLink')}</Link>
                </p>
              </form>


            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}