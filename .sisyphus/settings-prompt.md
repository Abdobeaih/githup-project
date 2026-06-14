# Settings.jsx — Unified Settings Page

Create `D:\githup project\src\pages\dashboard\Settings.jsx`

## Patterns to Follow
- Read `UserProfile.jsx` and `CompanyProfile.jsx` in the same directory for exact styling patterns
- Read `MySubscription.jsx` for subscription card patterns
- Colors: dark (#041a21), gold (#c19553), goldLight (#e8d5b5), cream (#f5f0e8), darkLight (#0a2e3a)
- RTL layout (Arabic-first)
- All user-facing strings use `t('settings', 'key')` translation function

## Component Structure
A single default-exported function component with 3 tabs: Profile, Security, Subscription.

### Tabs
- State: `activeTab` = 'profile' | 'security' | 'subscription'
- Tab bar: 3 buttons side by side, active = bg-dark text-white, inactive = bg-white text-dark/60 border
- Icons: User (profile), ShieldCheck (security), Crown (subscription)

### Profile Tab
- Check `role` from useAuth (USER_ROLES.USER vs USER_ROLES.COMPANY)
- **User mode**: show name, email, phone, nationalId, job, governorate fields
- **Company mode**: show name, email, category (select with COMPANY_CATEGORIES values), city, emoji fields
- Edit toggle: when not editing show values as plain text, when editing show inputs
- Icon on right side of each input (User, Mail, Phone, Building2, MapPin, Briefcase, Tag)
- Save: `updateUser(user.id, form)` or `updateCompany(company.id, form)`, then `refreshUser()`
- Show "saved" confirmation for 3 seconds
- Validate: name required, email contains @, phone 10+ digits

### Security Tab
- Three password fields: currentPassword, newPassword, confirmPassword
- Each has show/hide toggle (Eye/EyeOff icons)
- Validate: currentPassword matches user/company password; newPassword >= 8 chars with letter+number; confirmPassword matches newPassword
- Show inline red validation errors
- Password strength bar: red (weak < 8), amber (8+ but no number), green (8+ with letter+number)
- Save: `updateUser(user.id, { password: newPassword })` or `updateCompany(...)`
- Never expose current password as plain text

### Subscription Tab
- If role is COMPANY: show message "Subscription management is available for user accounts"
- If role is USER: show current plan badge (free=gray, premium=gold, elite=emerald)
- Import PLAN_LABELS, PLAN_PRICES from ../../types/subscription
- Show plan name, price, duration
- Two buttons: "View Plans" -> navigate('/subscriptions/plans'), "My Subscription" -> navigate('/subscriptions/my')
- Import useNavigate from react-router-dom

## Imports Required
```
useState from react
Helmet from react-helmet-async
motion from framer-motion
useAuth from ../../context/AuthContext
useLanguage from ../../context/LanguageContext
BackButton from ../../components/BackButton
updateUser, updateCompany from ../../data/db
useNavigate from react-router-dom
USER_ROLES from ../../types/user
PLAN_LABELS, PLAN_PRICES from ../../types/subscription
COMPANY_CATEGORIES from ../../types/company
User, Mail, Lock, ShieldCheck, Crown, Building2, Phone, MapPin, Briefcase, Tag, Eye, EyeOff, CheckCircle, Save, AlertCircle from lucide-react
```

## Notes
- Full Arabic text for all labels (use t() with 'settings' section key)
- Section wrapper: pt-28 pb-20 bg-cream min-h-screen, container mx-auto px-6
- BackButton at top
- motion.div with initial/animate for entrance animation
- Responsive: stacked on mobile, side-by-side on md+
- Handle null user/company: `if (!user && !company) return null`
