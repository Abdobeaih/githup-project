import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Crown, Check, CheckCircle, Zap, Shield } from 'lucide-react'

const planIcons = {
  free: Shield,
  premium: Zap,
  elite: Crown,
}

/**
 * Memoized PlanCard component
 * Prevents unnecessary re-renders when parent re-renders but props haven't changed
 * This is important when modal state changes (payment modal, service modal) but plan data is the same
 */
const PlanCard = memo(function PlanCard({
  plan,
  index,
  isCurrent,
  subscribing,
  onSubscribe,
}) {
  const Icon = useMemo(() => planIcons[plan.id] || Crown, [plan.id])
  const isFree = useMemo(() => plan.price === 0, [plan.price])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`bg-white rounded-2xl p-6 border shadow-sm transition-all hover:-translate-y-1 flex flex-col ${
        plan.popular ? 'border-gold/40 ring-1 ring-gold/20 relative' : 'border-gold/10'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white px-4 py-1 rounded-full text-xs font-bold">
          الأكثر طلباً
        </div>
      )}

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          isFree
            ? 'bg-gray-100 text-gray-600'
            : plan.popular
              ? 'bg-yellow-100 text-yellow-600'
              : 'bg-emerald-100 text-emerald-600'
        }`}
      >
        <Icon size={24} />
      </div>

      <h3 className="text-xl font-bold text-dark mb-1">{plan.name}</h3>

      <div className="mb-6">
        <span className="text-3xl font-extrabold text-dark">
          {isFree ? 'مجانًا' : `${plan.price} ر.س`}
        </span>
        {!isFree && <span className="text-dark/40 text-sm"> /شهريًا</span>}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {(plan.features?.length > 0 ? plan.features : ['لا توجد مميزات محددة']).map((f, j) => (
          <li key={j} className="flex items-center gap-2 text-sm text-dark/60">
            <CheckCircle size={16} className="text-emerald-500 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSubscribe(plan.id)}
        disabled={subscribing || isCurrent}
        className={`w-full py-3 rounded-xl text-sm font-bold transition-all mt-auto ${
          isCurrent
            ? 'bg-dark/10 text-dark/40 cursor-not-allowed'
            : plan.popular
              ? 'bg-dark text-white hover:bg-darkLight'
              : 'bg-cream text-dark border border-gold/20 hover:bg-gold/10'
        }`}
      >
        {isCurrent ? 'الباقة الحالية' : subscribing ? 'جاري...' : isFree ? 'البدء مجانًا' : 'اشتراك'}
      </button>
    </motion.div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison: re-render only if these props actually change
  return (
    prevProps.plan.id === nextProps.plan.id &&
    prevProps.plan.price === nextProps.plan.price &&
    prevProps.plan.name === nextProps.plan.name &&
    prevProps.isCurrent === nextProps.isCurrent &&
    prevProps.subscribing === nextProps.subscribing &&
    // Compare features array length as a proxy (if features changed, plan changed)
    prevProps.plan.features?.length === nextProps.plan.features?.length
  )
})

PlanCard.displayName = 'PlanCard'

export default PlanCard
