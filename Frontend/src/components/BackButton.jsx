import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function BackButton() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-dark/50 hover:text-dark transition-colors mb-6 group"
    >
      <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      <span className="text-sm font-semibold">{t('common', 'back')}</span>
    </button>
  )
}
