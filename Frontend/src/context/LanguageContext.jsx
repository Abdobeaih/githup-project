import { createContext, useContext, useState, useEffect } from 'react'
import translations from '../data/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ar')

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => setLang(prev => (prev === 'ar' ? 'en' : 'ar'))
  const t = (section, key) => translations[section]?.[key]?.[lang] ?? key
  const ta = (section, key) => translations[section]?.[key]?.[lang] ?? translations[section]?.[key]?.ar ?? []
  const tf = (section, key, i, field) => translations[section]?.[key]?.[i]?.[lang]?.[field] ?? ''
  const td = (section, key, field) => {
    if (lang === 'ar') return key
    const entry = translations.dataTranslations?.[section]?.[key]
    if (!entry) return key
    if (field !== undefined) return entry?.[field] ?? key
    return entry ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, ta, tf, td }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
