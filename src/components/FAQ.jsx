import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function FAQ({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className="max-w-3xl mx-auto">
      {items.map((item, i) => (
        <div key={i} className="border-b border-gold/10 last:border-0">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full py-5 flex items-center justify-between text-right hover:text-gold transition-colors group"
          >
            <span className="font-bold text-lg text-white group-hover:text-gold transition-colors">
              {item.q}
            </span>
            <motion.div
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="text-gold flex-shrink-0" />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="pb-5 text-goldLight/70 leading-relaxed">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
