import {
  Crown, CheckCircle, CreditCard, Building2, QrCode, Smartphone,
  ArrowLeft, Phone, Calendar, Hash, User, Landmark, Stethoscope, PiggyBank,
} from 'lucide-react'
import Modal from './Modal'

const PAYMENT_METHODS = [
  {
    id: 'vodafone_cash', icon: Smartphone, nameAr: 'فودافون كاش', nameEn: 'Vodafone Cash',
    fields: [
      { name: 'phone', labelAr: 'رقم الهاتف (فودافون كاش)', labelEn: 'Phone Number (Vodafone Cash)', type: 'tel', icon: Phone, maxLength: 11, required: true },
    ],
  },
  {
    id: 'credit_card', icon: CreditCard, nameAr: 'بطاقة ائتمان', nameEn: 'Credit Card',
    fields: [
      { name: 'cardNumber', labelAr: 'رقم البطاقة', labelEn: 'Card Number', type: 'tel', icon: Hash, maxLength: 16, required: true },
      { name: 'expiryDate', labelAr: 'تاريخ الانتهاء', labelEn: 'Expiry Date', type: 'text', icon: Calendar, maxLength: 5, placeholder: 'MM/YY', required: true },
      { name: 'cvv', labelAr: 'رمز CVV', labelEn: 'CVV', type: 'tel', icon: Hash, maxLength: 4, required: true },
    ],
  },
  {
    id: 'bank_transfer', icon: Building2, nameAr: 'تحويل بنكي', nameEn: 'Bank Transfer',
    fields: [
      { name: 'bankName', labelAr: 'اسم البنك', labelEn: 'Bank Name', type: 'text', icon: Landmark, required: true },
      { name: 'accountNumber', labelAr: 'رقم الحساب', labelEn: 'Account Number', type: 'tel', icon: Hash, maxLength: 20, required: true },
      { name: 'accountHolder', labelAr: 'اسم صاحب الحساب', labelEn: 'Account Holder Name', type: 'text', icon: User, required: true },
    ],
  },
  {
    id: 'instapay', icon: QrCode, nameAr: 'إنستا باي', nameEn: 'InstaPay',
    fields: [
      { name: 'instapayId', labelAr: 'رقم الهاتف أو معرف InstaPay', labelEn: 'Phone Number or InstaPay ID', type: 'tel', icon: Phone, maxLength: 20, required: true },
    ],
  },
]

export default function SubscriptionPlansModals({
  lang,
  plans,
  selectedPlanId,
  showServiceModal,
  showPaymentModal,
  subscribing,
  paymentStep,
  selectedPaymentMethod,
  paymentDetails,
  medicalCenters,
  banks,
  selectedCenterId,
  selectedBankId,
  onCloseServiceModal,
  onClosePaymentModal,
  onSelectCenter,
  onSelectBank,
  onContinueToPayment,
  onMethodSelect,
  onPaymentDetailChange,
  onPaymentConfirm,
  onPaymentBack,
}) {
  const selectedPlan = plans.find(p => p.id === selectedPlanId)

  return (
    <>
      {selectedPlan && (
        <Modal
          open={showServiceModal}
          onClose={onCloseServiceModal}
          title={lang === 'ar' ? 'اختيار مقدمي الخدمات التأمينية' : 'Choose Service Providers'}
          size="md"
        >
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-dark/5 border border-dark/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-dark text-white flex items-center justify-center">
                  <Crown size={24} />
                </div>
                <div>
                  <p className="font-bold text-dark text-lg">{selectedPlan.name}</p>
                  <p className="text-dark/60 text-sm">
                    {selectedPlan.price} ر.س {lang === 'ar' ? '/ شهريًا' : '/month'}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-dark/60 text-sm text-center">
              {lang === 'ar'
                ? 'باقة النخبة تشمل التأمين الطبي والمالي. يرجى اختيار مقدمي الخدمة:'
                : 'The Elite plan includes medical and financial insurance. Please select your providers:'}
            </p>

            <div>
              <label className="text-sm font-bold text-dark mb-2 flex items-center gap-2">
                <Stethoscope size={18} className="text-emerald-600" />
                {lang === 'ar' ? 'التأمين الطبي' : 'Medical Insurance'}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCenterId}
                onChange={(e) => onSelectCenter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-dark/20 bg-cream/30 text-dark focus:outline-none focus:ring-2 focus:ring-gold/40 appearance-none cursor-pointer"
              >
                <option value="">{lang === 'ar' ? '-- اختر مركزاً طبياً --' : '-- Select a medical center --'}</option>
                {medicalCenters.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.governorate}</option>
                ))}
              </select>
              {selectedCenterId && (
                <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                  <CheckCircle size={12} />
                  {lang === 'ar' ? 'تم اختيار مقدم التأمين الطبي' : 'Medical insurance provider selected'}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-dark mb-2 flex items-center gap-2">
                <PiggyBank size={18} className="text-amber-600" />
                {lang === 'ar' ? 'التأمين المالي' : 'Financial Insurance'}
                <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedBankId}
                onChange={(e) => onSelectBank(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-dark/20 bg-cream/30 text-dark focus:outline-none focus:ring-2 focus:ring-gold/40 appearance-none cursor-pointer"
              >
                <option value="">{lang === 'ar' ? '-- اختر بنكاً --' : '-- Select a bank --'}</option>
                {banks.map(b => (
                  <option key={b.id} value={b.id}>{b.name} - {b.governorate}</option>
                ))}
              </select>
              {selectedBankId && (
                <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                  <CheckCircle size={12} />
                  {lang === 'ar' ? 'تم اختيار مقدم التأمين المالي' : 'Financial insurance provider selected'}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onCloseServiceModal}
                className="flex-1 border-2 border-dark/30 text-dark font-bold py-3 px-4 rounded-xl hover:bg-dark/5 transition-all"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={!selectedCenterId || !selectedBankId}
                onClick={onContinueToPayment}
                className={`flex-[2] font-bold py-3 px-4 rounded-xl transition-all ${
                  selectedCenterId && selectedBankId
                    ? 'bg-gradient-to-r from-dark to-darkLight text-white hover:shadow-lg hover:shadow-dark/20'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {lang === 'ar' ? 'متابعة إلى الدفع' : 'Continue to Payment'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Modal
        open={showPaymentModal}
        onClose={onClosePaymentModal}
        title={
          paymentStep === 0
            ? (lang === 'ar' ? 'اختيار طريقة الدفع' : 'Select Payment Method')
            : (lang === 'ar' ? 'بيانات الدفع' : 'Payment Details')
        }
        size="md"
      >
        {paymentStep === 0 ? (
          <div className="space-y-4">
            {selectedPlan && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-dark/5 border border-dark/10">
                <div className="w-10 h-10 rounded-lg bg-dark text-white flex items-center justify-center shrink-0">
                  <Crown size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-dark text-sm">{selectedPlan.name}</p>
                  <p className="text-dark/50 text-xs">{selectedPlan.price} ر.س {lang === 'ar' ? '/ شهريًا' : '/month'}</p>
                </div>
              </div>
            )}

            <p className="text-dark/60 text-sm text-center">
              {lang === 'ar' ? 'يرجى اختيار طريقة الدفع للمتابعة' : 'Please select a payment method to continue'}
            </p>

            <div className="space-y-3">
              {PAYMENT_METHODS.map(m => {
                const Icon = m.icon
                const selected = selectedPaymentMethod === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onMethodSelect(m.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-right transition-all ${
                      selected ? 'border-dark bg-dark/5' : 'border-dark/10 bg-cream/30 hover:border-dark/30'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      selected ? 'bg-dark text-white' : 'bg-dark/10 text-dark'
                    }`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm text-dark">
                        {lang === 'ar' ? m.nameAr : m.nameEn}
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-dark/20 flex items-center justify-center">
                      <ArrowLeft size={14} className="text-dark/40" />
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3 pt-4 border-t border-dark/10">
              <button
                type="button"
                onClick={onClosePaymentModal}
                className="flex-1 border-2 border-dark/30 text-dark font-bold py-3 px-4 rounded-xl hover:bg-dark/5 transition-all"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        ) : (
          (() => {
            const method = PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod)
            if (!method) return null
            const Icon = method.icon
            const allFilled = method.fields.every(f => paymentDetails[f.name]?.trim())

            return (
              <div className="space-y-5">
                {selectedPlan && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark/5 border border-dark/10">
                    <div className="w-10 h-10 rounded-lg bg-dark text-white flex items-center justify-center shrink-0">
                      <Crown size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-dark text-sm">{selectedPlan.name}</p>
                      <p className="text-dark/50 text-xs">{selectedPlan.price} ر.س {lang === 'ar' ? '/ شهريًا' : '/month'}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-dark/5 rounded-xl border border-dark/10">
                  <button
                    type="button"
                    onClick={onPaymentBack}
                    className="p-1.5 rounded-lg hover:bg-dark/10 text-dark transition-all"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-dark/10 flex items-center justify-center text-dark">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-dark text-sm">
                      {lang === 'ar' ? method.nameAr : method.nameEn}
                    </p>
                    <p className="text-dark/40 text-xs">
                      {lang === 'ar' ? 'أدخل بيانات الدفع' : 'Enter payment details'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {method.fields.map(f => {
                    const FieldIcon = f.icon
                    return (
                      <div key={f.name}>
                        <label className="block text-dark font-semibold mb-1.5 text-sm">
                          {lang === 'ar' ? f.labelAr : f.labelEn}
                          {f.required && <span className="text-red-500 mr-1">*</span>}
                        </label>
                        <div className="relative">
                          <FieldIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/50" size={18} />
                          <input
                            type={f.type}
                            value={paymentDetails[f.name] || ''}
                            onChange={(e) => {
                              let val = e.target.value
                              if (f.type === 'tel') val = val.replace(/\D/g, '')
                              if (f.name === 'expiryDate') {
                                val = val.replace(/[^0-9/]/g, '').slice(0, 5)
                                if (val.length === 2 && !val.includes('/')) val = val.slice(0, 2) + '/' + val.slice(2)
                              }
                              onPaymentDetailChange(f.name, val)
                            }}
                            maxLength={f.maxLength || 100}
                            placeholder={f.placeholder || ''}
                            inputMode={f.type === 'tel' ? 'numeric' : 'text'}
                            className="w-full bg-cream border border-dark/20 rounded-xl px-12 py-3.5 text-dark outline-none focus:border-dark/60 transition-all"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-3 pt-4 border-t border-dark/10">
                  <button
                    type="button"
                    onClick={onPaymentBack}
                    className="flex-1 border-2 border-dark/30 text-dark font-bold py-3 px-4 rounded-xl hover:bg-dark/5 transition-all"
                  >
                    {lang === 'ar' ? 'رجوع' : 'Back'}
                  </button>
                  <button
                    type="button"
                    onClick={onPaymentConfirm}
                    disabled={!allFilled}
                    className={`flex-[2] font-bold py-3 px-4 rounded-xl transition-all ${
                      allFilled
                        ? 'bg-gradient-to-r from-dark to-darkLight text-white hover:shadow-lg hover:shadow-dark/20'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {lang === 'ar' ? 'تأكيد الاشتراك' : 'Confirm Subscription'}
                  </button>
                </div>
              </div>
            )
          })()
        )}
      </Modal>
    </>
  )
}
