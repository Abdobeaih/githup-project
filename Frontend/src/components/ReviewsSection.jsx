import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { getReviews, createReview, deleteReview } from '../services/reviewsService'
import { Star, Trash2, Send, User } from 'lucide-react'

export default function ReviewsSection({ targetType, targetId }) {
  const { t, td } = useLanguage()
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  useEffect(() => {
    getReviews(targetType, targetId).then(res => {
      const list = res?.data ?? []
      if (Array.isArray(list)) setReviews(list)
    }).catch(() => {})
  }, [targetType, targetId])

  const handleSubmit = async () => {
    if (!text.trim() || !user) return
    setLoading(true)
    try {
      const res = await createReview({
        target_type: targetType,
        target_id: targetId,
        user_id: user.id,
        rating,
        comment: text,
      })
      if (res?.data) {
        setText('')
        setRating(5)
        const updated = await getReviews(targetType, targetId)
        if (Array.isArray(updated?.data)) setReviews(updated.data)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (reviewId) => {
    if (!window.confirm('حذف التقييم؟')) return
    const res = await deleteReview(reviewId)
    if (res?.success) setReviews(prev => prev.filter(r => r.id !== reviewId))
  }

  return (
    <div>
      <h3 className="font-bold text-dark mb-4">التقييمات ({reviews.length})</h3>

      {/* Add Review */}
      {user && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-cream rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} type="button" onClick={() => setRating(s)}
                onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(0)}>
                <Star size={20} className={(hoveredStar || rating) >= s ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
              </button>
            ))}
          </div>
          <div className="flex items-end gap-3">
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="اكتب تقييمك..."
              className="flex-1 bg-white border border-gold/20 rounded-xl px-4 py-3 text-dark outline-none focus:border-gold/60 min-h-[60px] text-sm resize-none" />
            <button onClick={handleSubmit} disabled={loading || !text.trim()}
              className="bg-dark text-white p-3 rounded-xl hover:bg-darkLight transition-all disabled:opacity-50">
              <Send size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl p-5 border border-gold/10 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                  <User size={14} className="text-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark">{r.user_name || 'مستخدم'}</p>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={12} className={r.rating >= s ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-dark/30">{r.created_at?.split('T')[0] || ''}</span>
                {user && r.user_id === user.id && (
                  <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600 transition-all">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
            <p className="text-dark/60 text-sm">{r.comment || r.text}</p>
          </motion.div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-dark/40 py-8">لا توجد تقييمات بعد. كن أول من يقيم!</p>
        )}
      </div>
    </div>
  )
}
