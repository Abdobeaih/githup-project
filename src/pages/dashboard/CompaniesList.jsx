import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import { getAllCompanies, getAllDiscounts } from '../../data/db'
import { CATEGORY_COLORS as categoryColors, CATEGORY_LABELS as categoryLabels } from '../../types/discount'
import { Search, Building2, MapPin, Eye, Tag } from 'lucide-react'

export default function CompaniesList() {
  const navigate = useNavigate()
  const { t, td } = useLanguage()
  const [companies, setCompanies] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [filterGov, setFilterGov] = useState('all')

  useEffect(() => {
    setCompanies(getAllCompanies().filter(c => c.status === 'approved'))
    setDiscounts(getAllDiscounts())
  }, [])

  const governorates = [...new Set(companies.map(c => c.city))]

  const getDiscountCount = (companyId) => discounts.filter(d => d.company_id === companyId).length

  const filtered = companies.filter(c => {
    if (filterCat !== 'all' && c.category !== filterCat) return false
    if (filterGov !== 'all' && c.city !== filterGov) return false
    if (search && !c.name.includes(search) && !c.city.includes(search)) return false
    return true
  })

  return (
    <>
      <Helmet><title>{t('companiesList', 'title') || 'الشركات'}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-dark mb-2">{t('companiesList', 'heading') || 'الشركات المتعاونة'}</h1>
            <p className="text-dark/60 mb-8">{t('companiesList', 'subtitle') || 'تصفح الشركات المتعاونة وخصوماتهم الحصرية'}</p>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm mb-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder={t('companiesList', 'searchPlaceholder') || 'ابحث عن شركة...'}
                    className="w-full bg-cream border border-gold/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-gold/60 transition-all" />
                </div>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                  className="bg-cream border border-gold/20 rounded-xl px-4 py-3.5 text-dark outline-none focus:border-gold/60 transition-all">
                  <option value="all">{t('companiesList', 'allCategories') || 'جميع التصنيفات'}</option>
                  <option value="medical">طبي</option>
                  <option value="gym">رياضي</option>
                  <option value="food">مطاعم</option>
                  <option value="fun">ترفيهي</option>
                </select>
                <select value={filterGov} onChange={e => setFilterGov(e.target.value)}
                  className="bg-cream border border-gold/20 rounded-xl px-4 py-3.5 text-dark outline-none focus:border-gold/60 transition-all">
                  <option value="all">{t('companiesList', 'allGovernorates') || 'جميع المحافظات'}</option>
                  {governorates.map((g, i) => <option key={i} value={g}>{td('governorates', g) || g}</option>)}
                </select>
              </div>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center">
                <Building2 className="text-gold/30 mx-auto mb-4" size={64} />
                <p className="text-dark/50 font-semibold text-lg">{t('companiesList', 'noCompanies') || 'لا توجد شركات'}</p>
                <p className="text-dark/40 text-sm mt-2">{t('companiesList', 'noCompaniesHint') || 'حاول تغيير معايير البحث'}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => navigate(`/companies/${c.id}`)}
                    className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${categoryColors[c.category] || ''}`}>
                        {categoryLabels[c.category] || c.category}
                      </span>
                      <span className="text-3xl">{c.emoji || '🏢'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-dark mb-2">{td('companies', c.name) || c.name}</h3>
                    <div className="flex items-center gap-4 mb-4 text-sm text-dark/50">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {td('governorates', c.city) || c.city}</span>
                      <span className="flex items-center gap-1"><Tag size={14} /> {getDiscountCount(c.id)} خصم</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gold/10 text-xs text-dark/40">
                      <span className="flex items-center gap-1"><Eye size={14} /> {c.views || 0} مشاهدة</span>
                      <span>{c.uses || 0} استخدام</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
