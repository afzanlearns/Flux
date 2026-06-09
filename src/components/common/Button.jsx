import { forwardRef } from 'react'

const variantClasses = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  tertiary: 'btn btn-tertiary',
  danger: 'btn btn-danger',
  ghost: 'btn btn-icon'
}

const sizeClasses = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg'
}

const Button = forwardRef(({ variant = 'primary', size = 'md', className = '', children, icon: Icon, disabled, ...props }, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={variant === 'icon' ? 18 : 16} strokeWidth={2} />}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
export default Button
