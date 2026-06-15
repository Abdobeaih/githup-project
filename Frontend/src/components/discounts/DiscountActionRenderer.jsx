/**
 * DiscountActionRenderer — Renders type-specific discount action UI
 * 
 * Handles 4 types:
 * - PROMO_CODE: Copy-to-clipboard button with code display
 * - EXTERNAL_LINK: External link redirect button
 * - INSURANCE_FORM: Info card redirecting to services
 * - BANK_FORM: BankCard display + submit button
 *
 * Integrates with interactionTracker for COPY/CLICK events.
 * Can be used in DiscountDetail, card modals, or any discount display.
 *
 * Usage:
 *   <DiscountActionRenderer discount={discount} userId={userId} />
 *
 * Events are automatically tracked. Pass onAction callback for UI side-effects.
 */
import { useState } from "react";
import { Copy, ExternalLink, ShieldCheck, Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import interactionTracker from "../../services/interactionTracker";
import BankCard from "../BankCard";

export default function DiscountActionRenderer({ discount, userId, onAction }) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  if (!discount) return null;

  // ── PROMO_CODE ─────────────────────────────────────────
  if (discount.discount_type === "PROMO_CODE" && discount.promo_code) {
    const handleCopy = () => {
      navigator.clipboard.writeText(discount.promo_code).then(() => {
        setCopied(true);
        interactionTracker.trackCopy(userId, discount.id, discount.promo_code);
        if (onAction) onAction("COPY", discount.id);
        setTimeout(() => setCopied(false), 2500);
      });
    };

    return (
      <div className="bg-cream rounded-2xl p-6 border border-dashed border-gold/30">
        <p className="text-dark/60 text-sm mb-3">انسخ الكود واستخدمه عند الدفع</p>
        <div className="flex items-center gap-3">
          <code
            className="flex-1 bg-white border border-gold/20 rounded-xl px-4 py-3 text-center text-xl font-bold text-gold tracking-widest"
            dir="ltr"
          >
            {discount.promo_code}
          </code>
          <button
            onClick={handleCopy}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              copied ? "bg-emerald-500 text-white" : "bg-dark text-white hover:bg-darkLight"
            }`}
          >
            <Copy size={16} />
            {copied ? "تم النسخ!" : "نسخ الكود"}
          </button>
        </div>
      </div>
    );
  }

  // ── EXTERNAL_LINK ──────────────────────────────────────
  if (discount.discount_type === "EXTERNAL_LINK" && discount.external_link) {
    const handleClick = () => {
      window.open(discount.external_link, "_blank", "noopener,noreferrer");
      interactionTracker.trackClick(userId, discount.id);
      if (onAction) onAction("CLICK", discount.id);
    };

    return (
      <div className="bg-cream rounded-2xl p-6 border border-dashed border-gold/30">
        <p className="text-dark/60 text-sm mb-3">اضغط على الرابط للانتقال إلى العرض</p>
        <button
          onClick={handleClick}
          className="w-full bg-dark text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-darkLight transition-all flex items-center justify-center gap-2"
        >
          <ExternalLink size={16} /> الذهاب إلى العرض
        </button>
      </div>
    );
  }

  // ── INSURANCE_FORM ─────────────────────────────────────
  if (discount.discount_type === "INSURANCE_FORM") {
    const handleRedirect = () => {
      interactionTracker.trackClick(userId, discount.id);
      if (onAction) onAction("CLICK", discount.id);
      navigate("/services");
    };

    return (
      <div className="bg-cream rounded-2xl p-6 border border-dashed border-gold/30 cursor-pointer hover:bg-cream/80 transition-colors" onClick={handleRedirect}>
        <ShieldCheck size={24} className="text-gold mb-2" />
        <p className="text-dark font-bold mb-1">نموذج تسجيل</p>
        <p className="text-dark/60 text-sm">هذا العرض يتطلب تعبئة نموذج التسجيل. تفضل بزيارة صفحة الخدمات للتفاصيل.</p>
      </div>
    );
  }

  // ── BANK_FORM ──────────────────────────────────────────
  if (discount.discount_type === "BANK_FORM") {
    const handleClick = () => {
      if (discount.external_link) {
        window.open(discount.external_link, "_blank", "noopener,noreferrer");
        interactionTracker.trackClick(userId, discount.id);
        if (onAction) onAction("CLICK", discount.id);
      }
    };

    return (
      <div className="bg-cream rounded-2xl p-6 border border-dashed border-gold/30">
        {discount.bank_form_data && <BankCard formData={discount.bank_form_data} />}
        {discount.external_link && (
          <button
            onClick={handleClick}
            className="w-full mt-4 bg-dark text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-darkLight transition-all flex items-center justify-center gap-2"
          >
            <Banknote size={16} /> تقديم الطلب
          </button>
        )}
      </div>
    );
  }

  // ── Fallback: Unknown type ─────────────────────────────
  return (
    <div className="bg-cream rounded-2xl p-6 border border-dashed border-gold/30">
      <p className="text-dark/50 text-sm">نوع العرض غير معروف</p>
    </div>
  );
}