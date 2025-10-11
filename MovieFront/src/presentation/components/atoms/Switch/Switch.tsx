import React from 'react'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  label?: string
  description?: string
  className?: string
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-10 h-5',
    lg: 'w-12 h-6',
  }

  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const translateClasses = {
    sm: checked ? 'translate-x-4' : 'translate-x-0',
    md: checked ? 'translate-x-5' : 'translate-x-0',
    lg: checked ? 'translate-x-6' : 'translate-x-0',
  }

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
          ${sizeClasses[size]}
          ${checked ? 'bg-blue-600' : 'bg-gray-200'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${thumbSizeClasses[size]}
            ${translateClasses[size]}
          `}
        />
      </button>

      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label className="text-sm font-medium text-gray-900">{label}</label>
          )}
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Switch
