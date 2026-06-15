import { useLanguage } from '../context/LanguageContext'

export default function MarqueeStats() {
  const { t } = useLanguage()
  const stats = [
    {num: '75,000+', label: t('marquee', 'freelancers')},
    {num: '150+', label: t('marquee', 'partners')},
    {num: '30%', label: t('marquee', 'avgSavings')},
    {num: '92%', label: t('marquee', 'satisfaction')},
    {num: '24/7', label: t('marquee', 'support')},
    {num: '50+', label: t('marquee', 'cities')},
    {num: '100+', label: t('marquee', 'gyms')},
    {num: '200+', label: t('marquee', 'restaurantsPartners')},
  ]

  return (
    <div className="overflow-hidden whitespace-nowrap relative bg-gradient-to-r from-dark via-darkLight to-dark py-6 border-y-2 border-gold/30">
      <div className="inline-flex animate-marquee">
        {[...stats, ...stats, ...stats].map((stat, i) => (
          <span key={i} className="inline-flex items-center mx-10">
            <span className="text-2xl font-bold text-gold">{stat.num}</span>
            <span className="text-goldLight mr-3 text-sm font-medium">{stat.label}</span>
            <span className="text-gold/40 mx-6 text-xl">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}