import React, { forwardRef, useState } from 'react'
import { Eye, EyeOff, Check, X } from 'lucide-react'

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  showStrength?: boolean
  icon?: React.ReactNode
  containerClass?: string
}

const REQUIREMENTS = [
  { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
  { label: 'Uppercase letter (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'Lowercase letter (a-z)', test: (pw) => /[a-z]/.test(pw) },
  { label: 'Number (0-9)', test: (pw) => /\d/.test(pw) },
  { label: 'Special character (!@#$%^&*)', test: (pw) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pw) },
]

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, showStrength = true, icon, containerClass = '', className = '', value, onChange, onFocus, onBlur, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [focused, setFocused] = useState(false)

    const pwValue = (value as string) || ''
    const passedCount = REQUIREMENTS.filter((r) => r.test(pwValue)).length

    const strengthColor =
      passedCount <= 2 ? 'bg-red-500' :
      passedCount <= 3 ? 'bg-orange-500' :
      passedCount === 4 ? 'bg-yellow-500' :
                          'bg-green-500'

    const showChecklist = showStrength && focused && pwValue.length > 0

    return (
      <div className={`space-y-1.5 ${containerClass}`}>
        {label && (
          <label className="block text-sm font-bold flex items-center gap-2">
            {icon && <span className="text-gold shrink-0">{icon}</span>}
            <span>{label}</span>
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            onFocus={(e) => { setFocused(true); onFocus?.(e) }}
            onBlur={(e) => { setFocused(false); onBlur?.(e) }}
            className={`w-full outline-none transition-all ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/50 hover:text-gold transition-colors p-1"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        {showChecklist && (
          <div className="space-y-2 mt-2">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                style={{ width: `${Math.max(10, (passedCount / REQUIREMENTS.length) * 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-1 gap-1">
              {REQUIREMENTS.map((req) => {
                const passed = req.test(pwValue)
                return (
                  <div key={req.label} className="flex items-center gap-2 text-xs">
                    {passed ? (
                      <Check size={12} className="text-green-400 shrink-0" />
                    ) : (
                      <X size={12} className="text-red-400 shrink-0" />
                    )}
                    <span className={passed ? 'text-green-400/80' : 'text-red-400/60'}>
                      {req.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
