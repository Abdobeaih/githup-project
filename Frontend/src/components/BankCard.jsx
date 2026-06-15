import { useLanguage } from '../context/LanguageContext'

export default function BankCard({ formData }) {
  const { t } = useLanguage()
  const memberId = formData.fullName ? 'MS-' + Math.random().toString(36).substr(2, 6).toUpperCase() : 'MS-XXXXXX'
  const cardNumber = formData.fullName ? '4532  ****  ****  ' + Math.floor(1000 + Math.random() * 9000) : '****  ****  ****  ****'

  return (
    <div className="bank-card rounded-2xl p-6 relative overflow-hidden max-w-md mx-auto w-full" style={{aspectRatio: '1.586/1'}}>
      <div className="card-shine"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-gold to-goldLight rounded-lg flex items-center justify-center text-dark font-bold text-sm shadow-lg">
            <span>م</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gold/60 text-[10px] tracking-wider">MEMBER CARD</span>
          </div>
        </div>
        <div className="text-goldLight/90 font-black italic text-2xl tracking-wider text-shadow">VISA</div>
      </div>
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-9 rounded-md relative overflow-hidden shadow-lg" style={{background: 'linear-gradient(135deg, #e8d5b5 0%, #c19553 100%)'}}>
          <div className="absolute inset-0 border border-dark/30 rounded-md m-0.5"></div>
          <div className="absolute w-full h-[1px] bg-dark/20 top-1/2 left-0 -translate-y-1/2"></div>
          <div className="absolute h-full w-[1px] bg-dark/20 left-1/3 top-0"></div>
          <div className="absolute h-full w-[1px] bg-dark/20 left-2/3 top-0"></div>
        </div>
        <div className="w-12 h-9 rounded bg-gradient-to-br from-gold/30 to-goldLight/20 relative overflow-hidden">
          <div className="absolute inset-0" style={{background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(193,149,83,0.1) 2px, rgba(193,149,83,0.1) 4px)'}}></div>
        </div>
        <svg className="text-gold/40 w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
      </div>
      <div className="mb-5 relative z-10">
        <div className="text-gold/50 text-[10px] mb-1 tracking-[0.2em] uppercase">Card Number</div>
        <div className="text-goldLight text-xl font-bold tracking-[0.12em]" style={{fontFamily: 'Courier New, monospace'}}>{cardNumber}</div>
      </div>
      <div className="mb-5 relative z-10">
        <div className="text-gold/50 text-[10px] mb-1 tracking-[0.2em] uppercase">Member ID</div>
        <div className="text-goldLight text-sm font-mono tracking-[0.15em] font-bold">{memberId}</div>
      </div>
      <div className="flex justify-between items-end relative z-10">
        <div className="flex-1 min-w-0 mr-4">
          <div className="text-gold/50 text-[10px] mb-1 tracking-[0.2em] uppercase">Card Holder</div>
          <div className="text-goldLight font-bold text-sm truncate" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 -1px 1px rgba(255,255,255,0.1)'}}>
            {formData.fullName || 'YOUR NAME HERE'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gold/50 text-[10px] mb-1 tracking-[0.2em] uppercase">Expires</div>
          <div className="text-goldLight font-bold text-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 -1px 1px rgba(255,255,255,0.1)'}}>12/28</div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gold/15 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <svg className="text-gold w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>
          <span className="text-gold/70 text-[10px] font-bold tracking-wider">VIP MEMBER</span>
        </div>
        <div className="text-gold/40 text-[10px]">{formData.specialty || 'FREELANCER'}</div>
      </div>
    </div>
  )
}
