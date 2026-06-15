import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Shield, HeartPulse, Landmark, GraduationCap, Utensils, Dumbbell, ArrowLeft, Users, Target, Award, Zap, Globe, Star, CheckCircle, TrendingUp, Clock, Smartphone, CreditCard } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { allServices } from '../data/servicesData'

const serviceIcons = {
  'fa-hospital': HeartPulse,
  'fa-landmark': Landmark,
  'fa-graduation-cap': GraduationCap,
  'fa-utensils': Utensils,
  'fa-dumbbell': Dumbbell,
}

const statIcons = [Users, Star, TrendingUp, Award, Globe, Clock]
const howItWorksIcons = [Smartphone, CreditCard, Users, Shield]
const benefitIcons = [Shield, Zap, CheckCircle, Award, Smartphone, TrendingUp]

export default function About() {
  const { t, ta, lang } = useLanguage()
  const isRtl = lang === 'ar'
  const rtlRotate = isRtl ? 'rotate-180' : ''
  const imgAnimDir = isRtl ? -50 : 50
  const aboutAnimDir = isRtl ? 30 : -30
  const statsData = ta('aboutPage', 'stats')
  const howItWorksData = ta('aboutPage', 'howItWorks')
  const audienceData = ta('aboutPage', 'audience')
  const benefitsData = ta('aboutPage', 'benefits')
  const highlightBoxData = ta('aboutPage', 'aboutPlatformHighlightBox')
  const visionGoalsData = ta('aboutPage', 'visionGoals')
  const aboutPlatformParagraphs = ta('aboutPage', 'aboutPlatformParagraphs')
  const aboutPlatformChecklist = ta('aboutPage', 'aboutPlatformChecklist')

  return (
    <>
      <Helmet>
        <title>{t('aboutPage', 'seoTitle')}</title>
        <meta name="description" content={t('aboutPage', 'seoDescription')} />
        <meta property="og:title" content={t('aboutPage', 'seoTitle')} />
        <meta property="og:description" content={t('aboutPage', 'seoDescription')} />
        <meta name="keywords" content={t('aboutPage', 'seoKeywords')} />
      </Helmet>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen hero-gradient flex items-center pt-24 overflow-hidden">
        <div className={`absolute w-96 h-96 bg-gold/5 rounded-full top-20 ${isRtl ? '-right-48' : '-left-48'} animate-float`}></div>
        <div className={`absolute w-72 h-72 bg-gold/5 rounded-full bottom-20 ${isRtl ? 'left-10' : 'right-10'} animate-float`} style={{animationDelay: '-5s'}}></div>
        <div className={`absolute top-40 ${isRtl ? 'left-1/4' : 'right-1/4'} w-64 h-64 bg-gold/3 rounded-full animate-float`} style={{animationDelay: '-2s'}}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className={`grid md:grid-cols-2 gap-12 items-center`}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 bg-dark/60 backdrop-blur px-4 py-2 rounded-full shadow-sm mb-6 border border-gold/30">
                <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-goldLight">{t('aboutPage', 'heroBadge')}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6" dangerouslySetInnerHTML={{ __html: t('aboutPage', 'heroHeading') }} />
              <p className="text-lg text-goldLight/80 mb-8 leading-relaxed max-w-lg">
                {t('aboutPage', 'heroParagraph')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/join" className="btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20">
                  {t('aboutPage', 'heroCtaPrimary')} <ArrowLeft size={20} className={rtlRotate} />
                </Link>
                <Link to="/services" className="border border-gold/40 text-goldLight px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gold/10 transition-all">
                  {t('aboutPage', 'heroCtaSecondary')}
                </Link>
              </div>
            </motion.div>

            <motion.div className="relative" initial={{ opacity: 0, x: imgAnimDir }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop" alt={t('aboutPage', 'heroBadge')} className="rounded-3xl shadow-2xl w-full object-cover h-[500px] border border-gold/20" />
                <motion.div className={`absolute -bottom-6 ${isRtl ? '-right-6' : '-left-6'} bg-dark p-4 rounded-2xl shadow-xl border border-gold/30`} animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center text-gold"><Shield size={24} /></div>
                    <div><p className="font-bold text-white">{t('aboutPage', 'heroCard1Title')}</p><p className="text-xs text-goldLight/70">{t('aboutPage', 'heroCard1Desc')}</p></div>
                  </div>
                </motion.div>
                <motion.div className={`absolute -top-6 ${isRtl ? '-left-6' : '-right-6'} bg-dark p-4 rounded-2xl shadow-xl border border-gold/30`} animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: -3 }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center text-gold"><TrendingUp size={24} /></div>
                    <div><p className="font-bold text-white">{t('aboutPage', 'heroCard2Title')}</p><p className="text-xs text-goldLight/70">{t('aboutPage', 'heroCard2Desc')}</p></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATISTICS SECTION ===== */}
      <section className={`py-16 bg-gradient-to-${isRtl ? 'l' : 'r'} from-dark via-darkLight to-dark border-y-2 border-gold/30`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {statsData.map((stat, i) => {
              const StatIcon = statIcons[i] || Users
              return (
                <motion.div key={i} className="text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gold">
                    <StatIcon size={28} />
                  </div>
                  <div className="text-3xl font-bold text-gold mb-1">{stat.value}</div>
                  <div className="text-white font-semibold text-sm">{stat.label}</div>
                  <div className="text-goldLight/50 text-xs mt-1">{stat.desc}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== ABOUT PLATFORM ===== */}
      <section className="py-24 bg-[#0a0f12]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: aboutAnimDir }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">{t('aboutPage', 'aboutPlatformBadge')}</span>
              <h2 className="text-4xl font-bold text-white mt-3 mb-6">{t('aboutPage', 'aboutPlatformHeading')}</h2>
              {aboutPlatformParagraphs.map((p, i) => (
                <p key={i} className={`text-goldLight/70 leading-relaxed ${i < aboutPlatformParagraphs.length - 1 ? 'mb-4' : 'mb-8'} ${i === 0 ? 'text-lg' : ''}`}>
                  {p}
                </p>
              ))}
              <div className="flex flex-wrap gap-6">
                {aboutPlatformChecklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-gold shrink-0" size={20} />
                    <span className="text-goldLight font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -aboutAnimDir }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="bg-gradient-to-br from-gold/10 to-transparent p-8 rounded-3xl border border-gold/20">
                <div className="grid grid-cols-2 gap-4">
                  {highlightBoxData.map((item, i) => (
                    <div key={i} className="bg-dark/60 p-6 rounded-2xl border border-gold/10 text-center">
                      <div className="text-3xl font-bold text-gold mb-1">{item.num}</div>
                      <div className="text-goldLight/60 text-sm">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-dark/60 p-6 rounded-2xl border border-gold/10">
                  <p className="text-goldLight/80 text-center text-sm leading-relaxed">
                    {t('aboutPage', 'aboutPlatformQuote')}
                  </p>
              </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== OUR SERVICES ===== */}
      <section className="py-24 bg-dark">
        <div className="container mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-gold font-semibold text-sm tracking-widest uppercase">{t('aboutPage', 'servicesBadge')}</span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-4">{t('aboutPage', 'servicesHeading')}</h2>
            <p className="text-goldLight/70 max-w-2xl mx-auto text-lg">{t('aboutPage', 'servicesSubheading')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allServices.map((service, i) => {
              const Icon = serviceIcons[service.icon] || Shield
              const section = service.id
              const display = {
                heading: t(section, 'heading'),
                heroText: t(section, 'heroText'),
                pricing: service.pricing,
              }
              return (
                <motion.div key={service.id} className="bg-[#0a0f12] rounded-3xl border border-gold/15 overflow-hidden group hover:border-gold/40 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={service.image} alt={display.heading} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f12] via-transparent to-transparent"></div>
                    <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} w-12 h-12 bg-gradient-to-br from-gold to-[#a67c3d] rounded-xl flex items-center justify-center text-dark shadow-lg`}>
                      <Icon size={22} />
                    </div>
                    <div className={`absolute bottom-4 ${isRtl ? 'right-4' : 'left-4'} bg-dark/80 backdrop-blur px-3 py-1.5 rounded-lg border border-gold/20`}>
                      <span className="text-gold font-bold text-sm">{display.pricing.monthly} EGP<span className="text-goldLight/50 font-normal">/mo</span></span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">{display.heading}</h3>
                    <p className="text-goldLight/60 text-sm leading-relaxed mb-4 line-clamp-2">{display.heroText}</p>
                    <Link to={`/services/${service.id}`} className="text-gold font-semibold text-sm inline-flex items-center gap-2 group/link hover:gap-3 transition-all">
                      {t('aboutPage', 'servicesLearnMore')} <ArrowLeft size={14} className={rtlRotate} />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div className="text-center mt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Link to="/services" className="inline-flex items-center gap-3 bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-gold/20 hover:shadow-lg hover:shadow-gold/30 transition-all">
              {t('aboutPage', 'servicesCta')} <ArrowLeft size={20} className={rtlRotate} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 bg-[#0a0f12]">
        <div className="container mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-gold font-semibold text-sm tracking-widest uppercase">{t('aboutPage', 'howItWorksBadge')}</span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-4">{t('aboutPage', 'howItWorksHeading')}</h2>
            <p className="text-goldLight/70 max-w-2xl mx-auto text-lg">{t('aboutPage', 'howItWorksSubheading')}</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className={`hidden md:block absolute top-16 ${isRtl ? 'right-[12%]' : 'left-[12%]'} ${isRtl ? 'left-[12%]' : 'right-[12%]'} h-0.5 bg-gradient-to-r from-gold/40 via-gold to-gold/40`}></div>
            {howItWorksData.map((item, i) => {
              const ItemIcon = howItWorksIcons[i] || Smartphone
              return (
                <motion.div key={i} className="relative text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  <div className="w-16 h-16 bg-gradient-to-br from-gold to-[#a67c3d] rounded-2xl flex items-center justify-center mx-auto mb-6 text-dark font-bold text-lg shadow-lg shadow-gold/20 relative z-10">
                    <ItemIcon size={28} />
                  </div>
                  <div className="text-gold font-bold text-sm mb-3">{item.step}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-goldLight/60 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== WHO CAN BENEFIT ===== */}
      <section className="py-24 bg-dark">
        <div className="container mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-gold font-semibold text-sm tracking-widest uppercase">{t('aboutPage', 'audienceBadge')}</span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-4">{t('aboutPage', 'audienceHeading')}</h2>
            <p className="text-goldLight/70 max-w-2xl mx-auto text-lg">{t('aboutPage', 'audienceSubheading')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {audienceData.map((group, i) => (
              <motion.div key={i} className="bg-[#0a0f12] rounded-3xl border border-gold/15 p-8 hover:border-gold/40 transition-all" 
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 text-gold">
                  <Users size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{group.title}</h3>
                <ul className="space-y-3">
                  {group.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-goldLight/60 text-sm">
                      <CheckCircle className="text-gold mt-0.5 shrink-0" size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-24 bg-[#0a0f12]">
        <div className="container mx-auto px-6">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-gold font-semibold text-sm tracking-widest uppercase">{t('aboutPage', 'benefitsBadge')}</span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-4">{t('aboutPage', 'benefitsHeading')}</h2>
            <p className="text-goldLight/70 max-w-2xl mx-auto text-lg">{t('aboutPage', 'benefitsSubheading')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefitsData.map((benefit, i) => {
              const BenefitIcon = benefitIcons[i] || Shield
              return (
                <motion.div key={i} className="bg-dark rounded-3xl border border-gold/15 p-8 hover:border-gold/40 transition-all group"
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                >
                  <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 text-gold group-hover:bg-gold/20 transition-all">
                    <BenefitIcon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-goldLight/60 text-sm leading-relaxed">{benefit.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== OUR VISION ===== */}
      <section className="py-24 bg-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #c19553 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-[#a67c3d] rounded-2xl flex items-center justify-center mx-auto mb-8 text-dark shadow-lg shadow-gold/20">
                <Target size={32} />
              </div>
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">{t('aboutPage', 'visionBadge')}</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: t('aboutPage', 'visionHeading') }} />
              <p className="text-goldLight/70 text-lg leading-relaxed max-w-3xl mx-auto mb-12">
                {t('aboutPage', 'visionParagraph')}
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                {visionGoalsData.map((goal, i) => (
                  <div key={i} className="bg-[#0a0f12] rounded-2xl border border-gold/15 p-8">
                    <div className="text-3xl font-bold text-gold mb-2">{goal.value}</div>
                    <div className="text-goldLight/60 text-sm">{goal.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className={`py-20 bg-gradient-to-${isRtl ? 'l' : 'r'} from-dark via-darkLight to-dark relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #c19553 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('aboutPage', 'ctaHeading')}</h2>
            <p className="text-goldLight/70 max-w-2xl mx-auto mb-8 text-lg">
              {t('aboutPage', 'ctaParagraph')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/join" className="btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20">
                {t('aboutPage', 'ctaPrimary')} <ArrowLeft size={20} className={rtlRotate} />
              </Link>
              <Link to="/pricing" className="border border-gold/40 text-goldLight px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gold/10 transition-all">
                {t('aboutPage', 'ctaSecondary')}
              </Link>
            </div>
            <p className="text-goldLight/40 text-sm mt-6">{t('aboutPage', 'ctaFinePrint')}</p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
