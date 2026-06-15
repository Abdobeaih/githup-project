import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function CTA({ title, subtitle, buttonText, buttonLink = '/join' }) {
  return (
    <section className="py-20 bg-gradient-to-br from-dark via-darkLight to-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, #c19553 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
      </div>
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-goldLight/70 max-w-2xl mx-auto mb-8 text-lg">{subtitle}</p>
          <Link to={buttonLink} className="btn-primary text-dark px-8 py-4 rounded-2xl font-bold text-lg inline-flex items-center gap-3 shadow-xl shadow-gold/20">
            {buttonText}
            <ArrowLeft size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
