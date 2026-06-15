import React from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-dark text-white hover:bg-darkLight active:scale-[0.98]',
  secondary: 'bg-cream text-dark hover:bg-cream/80',
  outline: 'border-2 border-gold/30 text-gold hover:bg-gold/5',
  ghost: 'text-dark/60 hover:text-dark hover:bg-dark/5',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  gold: 'bg-gradient-to-r from-gold to-[#a67c3d] text-white hover:shadow-md active:scale-[0.98]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-2xl',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth,
  children,
  disabled,
  className = '',
  ...props
}) => (
  <button
    className={`inline-flex items-center justify-center gap-2 font-bold transition-all
      ${variantClasses[variant]} ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
      ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${className}`}
    disabled={disabled || loading}
    {...props}
  >
    {loading ? (
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    ) : icon ? (
      <span className="shrink-0">{icon}</span>
    ) : null}
    {children}
  </button>
)
