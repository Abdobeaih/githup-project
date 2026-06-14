import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-bold text-dark flex items-center gap-2">
          {icon && <span className="text-gold shrink-0">{icon}</span>}
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-xl border text-sm
            ${error
              ? 'border-red-300 focus:ring-red-400/40 focus:border-red-400'
              : 'border-gold/20 focus:ring-gold/40 focus:border-gold/30'
            }
            bg-cream/30 text-dark placeholder:text-dark/40
            focus:outline-none focus:ring-2
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {helperText && !error && <p className="text-dark/40 text-xs">{helperText}</p>}
    </div>
  )
)

Input.displayName = 'Input'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string | number; label: string; disabled?: boolean }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-bold text-dark">{label}</label>}
      <select
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-cream/30 text-dark
          ${error ? 'border-red-300' : 'border-gold/20'}
          focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/30
          disabled:opacity-50 transition-all ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
)

Select.displayName = 'Select'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-bold text-dark">{label}</label>}
      <textarea
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-cream/30 text-dark
          ${error ? 'border-red-300' : 'border-gold/20'}
          focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold/30
          disabled:opacity-50 transition-all resize-none ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  )
)

TextArea.displayName = 'TextArea'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', ...props }) => (
  <label className="flex items-start gap-3 cursor-pointer group select-none">
    <div className="mt-0.5 relative">
      <input
        type="checkbox"
        className="peer w-4 h-4 rounded border-gold/40 text-gold focus:ring-gold/30 cursor-pointer"
        {...props}
      />
      <svg
        className="absolute top-0.5 left-0.5 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <span className="text-sm text-dark/80 group-hover:text-dark/95 transition-colors">{label}</span>
  </label>
)
