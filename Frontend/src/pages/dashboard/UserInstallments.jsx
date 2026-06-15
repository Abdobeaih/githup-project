import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import { getUserInstallments, payInstallment } from '../../data/db'
import { Calendar, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'

export default function UserInstallments() {
  const { user, refreshUser } = useAuth()
  const { t, td, lang } = useLanguage()
  const [installments, setInstallments] = useState([])

  useEffect(() => {
    if (user) setInstallments(getUserInstallments(user.id))
  }, [user])

  if (!user) return null

  const handlePay = (inst) => {
    payInstallment(inst.id, inst.monthly_amount)
    setInstallments(getUserInstallments(user.id))
    refreshUser()
  }

  const totalRemaining = installments.reduce((sum, i) => sum + (i.total - i.paid), 0)

  return (
    <>
      <Helmet><title>{t('userInstallments', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-dark mb-2">{t('userInstallments', 'heading')}</h1>
            <p className="text-dark/60 mb-8">{t('userInstallments', 'subtitle')}</p>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm">
                <p className="text-dark/50 text-sm mb-1">{t('userInstallments', 'totalRemaining')}</p>
                <p className="text-3xl font-bold text-dark">{totalRemaining.toFixed(2)} {t('pricing', 'egp')}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm">
                <p className="text-dark/50 text-sm mb-1">{t('userInstallments', 'activeInstallments')}</p>
                <p className="text-3xl font-bold text-dark">{installments.length}</p>
              </div>
            </div>

            {installments.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center">
                <CreditCard className="text-gold/30 mx-auto mb-4" size={64} />
                <p className="text-dark/50 font-semibold text-lg">{t('userInstallments', 'noInstallments')}</p>
                <p className="text-dark/40 text-sm mt-2">{t('userInstallments', 'noInstallmentsHint')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {installments.map((inst, i) => {
                  const progress = inst.total > 0 ? Math.round((inst.paid / inst.total) * 100) : 0
                  const isOverdue = new Date(inst.next_due) < new Date()
                  const isCompleted = inst.paid >= inst.total

                  return (
                    <motion.div key={inst.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl p-6 border border-gold/10 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-dark">{td('installmentNames', inst.name)}</h3>
                          <p className="text-dark/50 text-sm mt-1">
                            {isCompleted ? (
                              <span className="text-emerald-500 flex items-center gap-1"><CheckCircle size={14} /> {t('userInstallments', 'completed')}</span>
                            ) : isOverdue ? (
                              <span className="text-red-500 flex items-center gap-1"><AlertCircle size={14} /> {t('userInstallments', 'overdue')}</span>
                            ) : (
                              <span className="flex items-center gap-1"><Calendar size={14} /> {t('userInstallments', 'nextDue')}: {new Date(inst.next_due).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                            )}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="text-xl font-bold text-dark">{inst.total.toFixed(2)} {t('pricing', 'egp')}</p>
                          <p className="text-dark/50 text-xs">{t('userInstallments', 'total')}</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-dark/60">{t('userInstallments', 'paid')}: {inst.paid.toFixed(2)} {t('pricing', 'egp')}</span>
                          <span className="text-dark/60">{progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-cream rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-l from-gold to-[#a67c3d]'}`}
                            style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-dark/50 text-xs">{t('userInstallments', 'monthlyInstallment')}</p>
                          <p className="font-bold text-dark">{inst.monthly_amount.toFixed(2)} {t('pricing', 'egp')}</p>
                        </div>
                        {!isCompleted && (
                          <button onClick={() => handlePay(inst)} className="bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
                            {t('userInstallments', 'pay')} {inst.monthly_amount.toFixed(2)} {t('pricing', 'egp')}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
