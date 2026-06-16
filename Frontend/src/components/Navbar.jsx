import { useState, useEffect, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, LogOut, User, LogIn, Globe, Building2, Bell, CreditCard, ShieldCheck, Settings as SettingsIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import NotificationBell from './NotificationBell'
import { USER_ROLES } from '../types/user'
import { usePrefetchSubscriptionPlans, usePrefetchPricing } from '../hooks/usePrefetchSubscriptionPlans'

const Navbar = memo(function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const { user, company, admin, isAuthenticated, role, logout } = useAuth()
  const { lang, toggleLang, t, td } = useLanguage()
  const prefetchPlans = usePrefetchSubscriptionPlans()
  const prefetchPricing = usePrefetchPricing()

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location])

  const dashboardLink = role === USER_ROLES.ADMIN ? '/dashboard/admin' : role === USER_ROLES.COMPANY ? '/dashboard/company' : '/dashboard/user'
  const displayName = (user?.name && (td('users', user.name) || user.name)) || (company?.name && (td('companies', company.name, 'name') || company.name)) || admin?.email || ''

  const navItems = [
    { label: t('navbar', 'home'), href: '/' },
    { label: t('navbar', 'services'), href: '/services' },
    { label: t('about', 'about') || 'About', href: '/about' },
    { label: t('navbar', 'pricing'), href: '/pricing' },
    { label: t('navbar', 'companies'), href: '/companies' },
    ...(isAuthenticated ? [] : [{ label: t('navbar', 'join'), href: '/join' }]),
  ]

  return (
    <nav aria-label="Main navigation" className="fixed top-0 w-full z-50 bg-dark/95 backdrop-blur-xl shadow-lg py-3">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="/Freelancer360.png" alt="Freelancer 360" width="160" height="51" loading="eager" decoding="async" className="h-16 w-auto" />
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item, i) => (
            <Link key={i} to={item.href}
              onMouseEnter={item.href === '/pricing' ? prefetchPricing : undefined}
              className="text-goldLight hover:text-gold font-semibold transition-colors relative group">
              {item.label}
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
            </Link>
          ))}

          <button onClick={toggleLang} aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            className="text-goldLight hover:text-gold transition-colors p-2 border border-gold/30 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <Globe size={14} />
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>

          {isAuthenticated ? (
            <>
            <NotificationBell />
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-haspopup="true" aria-expanded={dropdownOpen}
                className="flex items-center gap-2 bg-gold/10 border border-gold/30 px-4 py-2 rounded-xl text-goldLight hover:text-gold transition-all font-semibold text-sm">
                <div className="w-7 h-7 bg-gradient-to-br from-gold to-goldLight rounded-full flex items-center justify-center text-dark">
                  <User size={14} />
                </div>
                <span className="max-w-[100px] truncate">{displayName}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-dark border border-gold/20 rounded-2xl shadow-xl py-3 backdrop-blur-xl">
                  <Link to={dashboardLink} onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-5 py-2.5 text-goldLight hover:text-gold hover:bg-gold/10 transition-all text-sm">
                    <LayoutDashboard size={16} /> {t('navbar', 'dashboard')}
                  </Link>
                  {role === USER_ROLES.USER && (
                    <>
                    <Link to="/dashboard/user/profile" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-goldLight hover:text-gold hover:bg-gold/10 transition-all text-sm">
                      <User size={16} /> {t('navbar', 'profile')}
                    </Link>
                    <Link 
                      to="/subscriptions/plans" 
                      onMouseEnter={prefetchPlans}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-goldLight hover:text-gold hover:bg-gold/10 transition-all text-sm">
                      <CreditCard size={16} /> {t('navbar', 'subscriptions') || 'الباقات'}
                    </Link>
                    <Link to="/dashboard/user/settings" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-goldLight hover:text-gold hover:bg-gold/10 transition-all text-sm">
                      <SettingsIcon size={16} /> {t('navbar', 'settings') || 'الإعدادات'}
                    </Link>
                    </>
                  )}
                  {role === USER_ROLES.COMPANY && (
                    <Link to="/dashboard/company/settings" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-goldLight hover:text-gold hover:bg-gold/10 transition-all text-sm">
                      <SettingsIcon size={16} /> {t('navbar', 'settings') || 'الإعدادات'}
                    </Link>
                  )}
                  <hr className="border-gold/10 my-2" />
                  <button onClick={() => { logout(); setDropdownOpen(false) }}
                    className="flex items-center gap-3 px-5 py-2.5 text-red-400 hover:text-red-300 hover:bg-gold/10 transition-all text-sm w-full text-right">
                    <LogOut size={16} /> {t('navbar', 'logout')}
                  </button>
                </div>
              )}
            </div>
            </>
          ) : (
            <Link to="/login"
              className="flex items-center gap-2 bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
              <LogIn size={16} /> {t('navbar', 'enter')}
            </Link>
          )}
        </div>

        <button className="md:hidden text-goldLight text-2xl" onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? (lang === 'ar' ? 'إغلاق القائمة' : 'Close menu') : (lang === 'ar' ? 'فتح القائمة' : 'Open menu')}
          aria-expanded={mobileOpen} aria-controls="mobile-menu">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden bg-dark/95 backdrop-blur-xl border-t border-gold/20">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navItems.map((item, i) => (
              <Link
                key={i}
                to={item.href}
                onMouseEnter={item.href === '/pricing' ? prefetchPricing : undefined}
                className="text-goldLight hover:text-gold font-semibold py-2 block"
              >
                {item.label}
              </Link>
            ))}
            <button onClick={toggleLang}
              className="text-goldLight hover:text-gold font-semibold py-2 flex items-center gap-2">
              <Globe size={16} /> {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            {isAuthenticated ? (
              <>
                <Link to={dashboardLink} className="text-gold hover:text-goldLight font-semibold py-2 block">{t('navbar', 'dashboard')}</Link>
                <Link to="/companies" className="text-goldLight hover:text-gold font-semibold py-2 block">{t('navbar', 'companies')}</Link>
                {role === USER_ROLES.USER && (
                  <>
                    <Link to="/subscriptions/plans" onMouseEnter={prefetchPlans} className="text-goldLight hover:text-gold font-semibold py-2 block">{t('navbar', 'subscriptions') || 'الباقات'}</Link>
                    <Link to="/dashboard/user/settings" className="text-goldLight hover:text-gold font-semibold py-2 block">{t('navbar', 'settings') || 'الإعدادات'}</Link>
                    <Link to="/notifications" className="text-goldLight hover:text-gold font-semibold py-2 block">{t('navbar', 'notifications') || 'الإشعارات'}</Link>
                  </>
                )}
                {role === USER_ROLES.COMPANY && (
                  <Link to="/dashboard/company/settings" className="text-goldLight hover:text-gold font-semibold py-2 block">{t('navbar', 'settings') || 'الإعدادات'}</Link>
                )}
                <button onClick={() => { logout(); setMobileOpen(false) }} className="text-red-400 font-semibold py-2 block text-right">{t('navbar', 'logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gold font-semibold py-2 block">{t('navbar', 'login')}</Link>
                <Link to="/join" className="text-goldLight hover:text-gold font-semibold py-2 block">{t('navbar', 'join')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
})

export default Navbar
