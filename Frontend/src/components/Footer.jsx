import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Twitter, Linkedin, Instagram, Facebook } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

const Footer = memo(function Footer() {
  const { t } = useLanguage()
  const socials = [
    { icon: Twitter, label: 'Twitter' },
    { icon: Linkedin, label: 'LinkedIn' },
    { icon: Instagram, label: 'Instagram' },
    { icon: Facebook, label: 'Facebook' },
  ]

  return (
    <footer className="bg-dark text-goldLight/60 py-12 border-t border-gold/20">
      <div className="container mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src="/Freelancer360.png" alt="Freelancer 360" width="200" height="64" loading="lazy" className="h-16 w-auto" />
        </div>
        <p className="mb-6">{t('footer', 'tagline')}</p>
        <div className="flex justify-center gap-6 mb-8">
          {socials.map((social, i) => (
            <a key={i} href="#" aria-label={social.label} className="w-10 h-10 bg-darkLight rounded-full flex items-center justify-center hover:bg-gold hover:text-dark transition-all text-goldLight">
              <social.icon size={18} />
            </a>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">

          <Link to="/services/courses" className="hover:text-gold transition-colors">{t('footer', 'courses')}</Link>
          <Link to="/services/restaurants" className="hover:text-gold transition-colors">{t('footer', 'restaurants')}</Link>
          <Link to="/services/entertainment" className="hover:text-gold transition-colors">{t('footer', 'entertainment')}</Link>
        </div>
        <p className="text-sm">{t('footer', 'copyright')}</p>
      </div>
    </footer>
  )
})

export default Footer