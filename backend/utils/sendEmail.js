const nodemailer = require('nodemailer')

// ─── Transporter (lazy-initialised) ───────────────────────────────
let transporter = null

const getTransporter = () => {
  if (transporter) return transporter

  const { EMAIL_USER, EMAIL_PASS } = process.env
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('Email is not configured. Set EMAIL_USER and EMAIL_PASS in .env')
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  })

  return transporter
}

// ─── Shared template wrapper ──────────────────────────────────────
const BRAND_COLOR = '#2563eb' // blue
const BRAND_LIGHT = '#dbeafe'
const BG_COLOR = '#f1f5f9'
const CARD_BG = '#ffffff'
const TEXT_DARK = '#1e293b'
const TEXT_MUTED = '#64748b'

function wrapHtml(bodyContent) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Freelancer360</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_COLOR};font-family:'Segoe UI',Tahoma,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_COLOR};padding:24px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background-color:${CARD_BG};border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.06);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND_COLOR},#1d4ed8);padding:32px 24px 24px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:1px;">Freelancer360</h1>
              <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.75);">منصة الفريلانسر الأولى في مصر</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 24px;background-color:${CARD_BG};">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 24px;background-color:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:${TEXT_MUTED};line-height:1.6;">
                © ${new Date().getFullYear()} Freelancer360. جميع الحقوق محفوظة.
              </p>
              <p style="margin:0;font-size:12px;color:${TEXT_MUTED};line-height:1.6;">
                هذا البريد الإلكتروني مرسل إليك من Freelancer360<br/>
                إذا لم تطلب هذا البريد، يرجى تجاهله.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function otpBox(code) {
  return `
    <div style="background:${BRAND_LIGHT};border-radius:12px;padding:20px;margin:16px 0;text-align:center;border:2px dashed ${BRAND_COLOR};">
      <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:${BRAND_COLOR};font-family:monospace;">${code}</span>
    </div>`
}

// ── 1. Email Verification ─────────────────────────────────────────
function verificationEmailHtml(name, code, expiresInMinutes = 10) {
  const body = `
    <p style="margin:0 0 8px;font-size:16px;color:${TEXT_DARK};font-weight:600;">
      مرحباً ${name}،
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT_MUTED};line-height:1.7;">
      شكراً لتسجيلك في Freelancer360. يرجى استخدام الرمز التالي لتأكيد بريدك الإلكتروني:
    </p>
    ${otpBox(code)}
    <p style="margin:8px 0 16px;font-size:13px;color:${TEXT_MUTED};text-align:center;">
      هذا الرمز صالح لمدة <strong>${expiresInMinutes} دقائق</strong>.
    </p>
    <div style="background:#fef2f2;border-radius:8px;padding:12px 16px;margin:16px 0;">
      <p style="margin:0;font-size:12px;color:#dc2626;text-align:center;">
        ⚠️ لا تشارك هذا الرمز مع أي شخص. فريق Freelancer360 لن يطلب رمزك أبداً.
      </p>
    </div>
    <p style="margin:16px 0 0;font-size:12px;color:${TEXT_MUTED};text-align:center;">
      إذا لم تقم بإنشاء حساب في Freelancer360، يرجى تجاهل هذا البريد الإلكتروني.
    </p>`
  return wrapHtml(body)
}

// ── 2. Signup OTP ─────────────────────────────────────────────────
function signupOtpHtml(name, code, expiresInMinutes = 10) {
  // Same layout as verification — different intro text
  const body = `
    <p style="margin:0 0 8px;font-size:16px;color:${TEXT_DARK};font-weight:600;">
      مرحباً ${name}،
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT_MUTED};line-height:1.7;">
      أنت على بعد خطوة واحدة من الانضمام إلى Freelancer360. استخدم الرمز التالي لإكمال تسجيلك:
    </p>
    ${otpBox(code)}
    <p style="margin:8px 0 16px;font-size:13px;color:${TEXT_MUTED};text-align:center;">
      هذا الرمز صالح لمدة <strong>${expiresInMinutes} دقائق</strong>.
    </p>
    <div style="background:#fef2f2;border-radius:8px;padding:12px 16px;margin:16px 0;">
      <p style="margin:0;font-size:12px;color:#dc2626;text-align:center;">
        ⚠️ لا تشارك هذا الرمز مع أي شخص. فريق Freelancer360 لن يطلب رمزك أبداً.
      </p>
    </div>
    <p style="margin:16px 0 0;font-size:12px;color:${TEXT_MUTED};text-align:center;">
      إذا لم تقم بإنشاء حساب في Freelancer360، يرجى تجاهل هذا البريد الإلكتروني.
    </p>`
  return wrapHtml(body)
}

// ── 3. Forgot Password OTP ────────────────────────────────────────
function forgotPasswordOtpHtml(name, code, expiresInMinutes = 10) {
  const body = `
    <p style="margin:0 0 8px;font-size:16px;color:${TEXT_DARK};font-weight:600;">
      مرحباً ${name}،
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT_MUTED};line-height:1.7;">
      لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك في Freelancer360. استخدم الرمز التالي لإكمال العملية:
    </p>
    ${otpBox(code)}
    <p style="margin:8px 0 16px;font-size:13px;color:${TEXT_MUTED};text-align:center;">
      هذا الرمز صالح لمدة <strong>${expiresInMinutes} دقائق</strong>.
    </p>
    <div style="background:#fef2f2;border-radius:8px;padding:12px 16px;margin:16px 0;">
      <p style="margin:0;font-size:12px;color:#dc2626;text-align:center;">
        ⚠️ لا تشارك هذا الرمز مع أي شخص. فريق Freelancer360 لن يطلب رمزك أبداً.
      </p>
    </div>
    <p style="margin:16px 0 0;font-size:12px;color:${TEXT_MUTED};text-align:center;">
      إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.
    </p>`
  return wrapHtml(body)
}

// ── 4. Password Reset Confirmation ────────────────────────────────
function passwordResetConfirmationHtml(name) {
  const body = `
    <p style="margin:0 0 8px;font-size:16px;color:${TEXT_DARK};font-weight:600;">
      مرحباً ${name}،
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT_MUTED};line-height:1.7;">
      تم إعادة تعيين كلمة المرور الخاصة بك في Freelancer360 بنجاح.
    </p>
    <div style="background:#f0fdf4;border-radius:12px;padding:20px;margin:16px 0;text-align:center;border:1px solid #bbf7d0;">
      <span style="font-size:32px;">✅</span>
      <p style="margin:8px 0 0;font-size:14px;font-weight:600;color:#16a34a;">
        تم تغيير كلمة المرور بنجاح
      </p>
    </div>
    <p style="margin:16px 0 0;font-size:13px;color:${TEXT_MUTED};line-height:1.7;">
      إذا لم تقم بهذا التغيير، يرجى <a href="mailto:${process.env.EMAIL_USER || 'support@freelancer360.dev'}" style="color:${BRAND_COLOR};text-decoration:underline;">التواصل مع فريق الدعم</a> فوراً.
    </p>
    <p style="margin:8px 0 0;font-size:12px;color:${TEXT_MUTED};text-align:center;">
      إذا كنت أنت من قام بتغيير كلمة المرور، يمكنك تجاهل هذه الرسالة.
    </p>`
  return wrapHtml(body)
}

// ── 5. Welcome Email ──────────────────────────────────────────────
function welcomeEmailHtml(name) {
  const body = `
    <p style="margin:0 0 8px;font-size:16px;color:${TEXT_DARK};font-weight:600;">
      مرحباً ${name}،
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:${TEXT_MUTED};line-height:1.7;">
      تهانينا! لقد تم تفعيل حسابك في <strong>Freelancer360</strong> بنجاح 🎉
    </p>
    <div style="background:${BRAND_LIGHT};border-radius:12px;padding:20px;margin:16px 0;text-align:center;">
      <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:${BRAND_COLOR};">
        مرحباً بك في مجتمع الفريلانسر الأول في مصر
      </p>
      <p style="margin:8px 0 0;font-size:13px;color:${TEXT_MUTED};line-height:1.7;">
        استمتع بخصومات حصرية على التأمين الطبي والمالي والمطاعم والكورسات والترفيه.
      </p>
    </div>
    <p style="margin:16px 0 0;font-size:13px;color:${TEXT_MUTED};line-height:1.7;">
      يمكنك الآن تصفح جميع الخدمات المتاحة والاستفادة من العروض الحصرية لأعضاء Freelancer360.
    </p>
    <p style="margin:8px 0 0;font-size:13px;color:${TEXT_MUTED};line-height:1.7;">
      إذا كان لديك أي استفسار، لا تتردد في التواصل معنا.
    </p>`
  return wrapHtml(body)
}

// ─── Plain-text fallbacks (for email clients that don't support HTML) ──
function plainTextOtp(code, purpose) {
  return [
    `Freelancer360 – ${purpose}`,
    '',
    `رمز التحقق الخاص بك هو: ${code}`,
    '',
    `هذا الرمز صالح لمدة 10 دقائق.`,
    `لا تشارك هذا الرمز مع أي شخص.`,
    '',
    `إذا لم تطلب ذلك، يرجى تجاهل هذه الرسالة.`,
    '',
    `-- Freelancer360`,
  ].join('\n')
}

// ─── Public API ───────────────────────────────────────────────────

/**
 * Send an email using NodeMailer (Gmail SMTP).
 * @param {string} to       - Recipient email
 * @param {string} subject  - Subject line
 * @param {string} text     - Plain-text fallback
 * @param {string} html     - HTML body
 * @returns {{success: boolean, messageId?: string, error?: string}}
 */
const sendEmail = async (to, subject, text, html) => {
  const { EMAIL_USER } = process.env

  try {
    const t = getTransporter()
    const info = await t.sendMail({
      from: `"Freelancer360" <${EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    // Log without exposing email content
    console.error('Email send failed:', error.message)
    return { success: false, error: 'Failed to send email. Please try again later.' }
  }
}

/**
 * Send an email verification OTP.
 */
const sendVerificationOtp = async (name, to, code) => {
  const subject = 'Freelancer360 – تأكيد البريد الإلكتروني'
  const text = plainTextOtp(code, 'تأكيد البريد الإلكتروني')
  const html = verificationEmailHtml(name, code)
  return sendEmail(to, subject, text, html)
}

/**
 * Send a signup OTP to complete registration.
 */
const sendSignupOtp = async (name, to, code) => {
  const subject = 'Freelancer360 – رمز التحقق للتسجيل'
  const text = plainTextOtp(code, 'رمز التحقق للتسجيل')
  const html = signupOtpHtml(name, code)
  return sendEmail(to, subject, text, html)
}

/**
 * Send a forgot-password OTP.
 */
const sendForgotPasswordOtp = async (name, to, code) => {
  const subject = 'Freelancer360 – إعادة تعيين كلمة المرور'
  const text = plainTextOtp(code, 'إعادة تعيين كلمة المرور')
  const html = forgotPasswordOtpHtml(name, code)
  return sendEmail(to, subject, text, html)
}

/**
 * Send a password-reset confirmation email.
 */
const sendPasswordResetConfirmation = async (name, to) => {
  const subject = 'Freelancer360 – تم إعادة تعيين كلمة المرور'
  const text = 'تم إعادة تعيين كلمة المرور الخاصة بك في Freelancer360 بنجاح.'
  const html = passwordResetConfirmationHtml(name)
  return sendEmail(to, subject, text, html)
}

/**
 * Send a welcome email after successful registration.
 */
const sendWelcomeEmail = async (name, to) => {
  const subject = 'مرحباً بك في Freelancer360 🎉'
  const text = `مرحباً ${name}، تم تفعيل حسابك في Freelancer360 بنجاح!`
  const html = welcomeEmailHtml(name)
  return sendEmail(to, subject, text, html)
}

module.exports = {
  sendEmail,
  sendVerificationOtp,
  sendSignupOtp,
  sendForgotPasswordOtp,
  sendPasswordResetConfirmation,
  sendWelcomeEmail,
}
