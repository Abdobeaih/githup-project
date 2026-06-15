import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/BackButton'
import { getUserCards, saveCard, deleteCard } from '../../data/db'
import { CreditCard, Plus, Trash2 } from 'lucide-react'

export default function UserCards() {
  const { user, refreshUser } = useAuth()
  const { t, td } = useLanguage()
  const [cards, setCards] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ card_holder_name: '', card_number: '', expiry: '' })

  useEffect(() => {
    if (user) setCards(getUserCards(user.id))
  }, [user])

  if (!user) return null

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = (e) => {
    e.preventDefault()
    saveCard(user.id, form)
    setCards(getUserCards(user.id))
    setShowForm(false)
    setForm({ card_holder_name: '', card_number: '', expiry: '' })
  }

  const handleDelete = () => {
    deleteCard(user.id)
    setCards([])
  }

  // Mask card number for display
  const maskCard = (num) => {
    if (!num || num.length < 4) return '**** **** **** ****'
    const last4 = num.slice(-4)
    return `**** **** **** ${last4}`
  }

  return (
    <>
      <Helmet><title>{t('userCards', 'title')}</title></Helmet>
      <section className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-6">
          <BackButton />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="text-3xl font-bold text-dark">{t('userCards', 'heading')}</h1>
                <p className="text-dark/60">{t('userCards', 'subtitle')}</p>
              </div>
              {!showForm && (
                <button onClick={() => setShowForm(true)} className="bg-dark text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-darkLight transition-all">
                  <Plus size={18} /> {t('userCards', 'addCard')}
                </button>
              )}
            </div>

            {/* Add card form */}
            {showForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white rounded-2xl p-8 border border-gold/10 shadow-sm mb-8">
                <h3 className="text-xl font-bold text-dark mb-6">{t('userCards', 'addNewCard')}</h3>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('userCards', 'cardHolderName')}</label>
                    <input type="text" name="card_holder_name" value={form.card_holder_name} onChange={handleChange} required className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3.5 text-dark outline-none focus:border-gold/60 transition-all" placeholder={t('userCards', 'cardHolderPlaceholder')} />
                  </div>
                  <div>
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('userCards', 'cardNumber')}</label>
                    <input type="text" name="card_number" value={form.card_number} onChange={handleChange} required className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3.5 text-dark outline-none focus:border-gold/60 transition-all" placeholder="4532 XXXX XXXX XXXX" />
                  </div>
                  <div>
                    <label className="block text-dark font-semibold mb-2 text-sm">{t('userCards', 'expiryDate')}</label>
                    <input type="text" name="expiry" value={form.expiry} onChange={handleChange} required className="w-full bg-cream border border-gold/20 rounded-xl px-4 py-3.5 text-dark outline-none focus:border-gold/60 transition-all" placeholder="MM/YY" />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="bg-gradient-to-r from-gold to-[#a67c3d] text-dark px-6 py-3 rounded-xl font-bold flex-1">{t('userCards', 'saveCard')}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="bg-dark/10 text-dark px-6 py-3 rounded-xl font-bold">{t('userCards', 'cancel')}</button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Cards list */}
            {cards.length === 0 && !showForm ? (
              <div className="bg-white rounded-2xl p-16 border border-gold/10 shadow-sm text-center">
                <CreditCard className="text-gold/30 mx-auto mb-4" size={64} />
                <p className="text-dark/50 font-semibold text-lg">{t('userCards', 'noCards')}</p>
                <p className="text-dark/40 text-sm mt-2">{t('userCards', 'noCardsHint')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cards.map((card, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bank-card rounded-2xl p-6 relative overflow-hidden">
                    <div className="card-shine"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <p className="text-gold/50 text-xs tracking-widest mb-1">CARD HOLDER</p>
                          <p className="text-goldLight font-bold text-lg">{td('users', card.card_holder_name)}</p>
                        </div>
                        <button onClick={handleDelete} className="text-red-400 hover:text-red-300 transition-colors p-2" title={t('userCards', 'deleteCardTitle')}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="mb-6">
                        <p className="text-gold/50 text-xs tracking-widest mb-1">CARD NUMBER</p>
                        <p className="text-goldLight text-xl font-mono tracking-wider">{maskCard(card.card_number)}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-gold/50 text-xs tracking-widest mb-1">EXPIRES</p>
                          <p className="text-goldLight font-bold">{card.expiry}</p>
                        </div>
                        <div className="text-goldLight/80 font-black text-xl tracking-widest">VISA</div>
                      </div>
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
