import { Icon } from '@components/atoms/Icon'
import React from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: string
  label?: string
  required?: boolean
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = '请选择...',
  disabled = false,
  error,
  label,
  required = false,
  className = '',
}) => {
  const baseClasses = `
    w-full px-3 py-2 border rounded-lg shadow-sm appearance-none bg-white
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    transition-colors duration-200
  `

  const errorClasses = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300'

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          className={`${baseClasses} ${errorClasses} pr-10`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Icon name="chevron-down" className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Select
