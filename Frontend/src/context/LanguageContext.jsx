import { createContext, useContext, useState, useEffect, useCallback } from 'react'
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
  const t = useCallback((section, key) => translations[section]?.[key]?.[lang] ?? key, [lang])
  const ta = useCallback((section, key) => translations[section]?.[key]?.[lang] ?? translations[section]?.[key]?.ar ?? [], [lang])
  const tf = useCallback((section, key, i, field) => translations[section]?.[key]?.[i]?.[lang]?.[field] ?? '', [lang])
  const td = useCallback((section, key, field) => {
    if (lang === 'ar') return key
    const entry = translations.dataTranslations?.[section]?.[key]
    if (!entry) return key
    if (field !== undefined) return entry?.[field] ?? key
    return entry ?? key
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, ta, tf, td }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
