import { forwardRef } from 'react'

const Input = forwardRef(({ label, error, className = '', prefix, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary font-mono text-base">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={`
            input-field
            ${prefix ? '!pl-8' : ''}
            ${error ? 'input-error' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="input-error-text">{error}</span>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
