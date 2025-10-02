import React from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95'
    ]

    const variantClasses = {
      primary: [
        'bg-blue-600 text-white shadow-sm',
        'hover:bg-blue-700 focus:ring-blue-500',
        'border border-transparent'
      ],
      secondary: [
        'bg-gray-100 text-gray-900 shadow-sm',
        'hover:bg-gray-200 focus:ring-gray-500',
        'border border-gray-300'
      ],
      danger: [
        'bg-red-600 text-white shadow-sm',
        'hover:bg-red-700 focus:ring-red-500',
        'border border-transparent'
      ],
      ghost: [
        'bg-transparent text-gray-700',
        'hover:bg-gray-100 focus:ring-gray-500',
        'border border-transparent'
      ],
      outline: [
        'bg-transparent text-blue-600',
        'hover:bg-blue-50 focus:ring-blue-500',
        'border border-blue-600'
      ]
    }

    const sizeClasses = {
      xs: 'px-2 py-1 text-xs gap-1',
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-base gap-2',
      lg: 'px-6 py-3 text-lg gap-2.5',
      xl: 'px-8 py-4 text-xl gap-3'
    }

    const widthClasses = fullWidth ? 'w-full' : ''

    const renderIcon = () => {
      if (loading) {
        return (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )
      }
      return icon
    }

    const iconElement = renderIcon()

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          widthClasses,
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {iconElement && iconPosition === 'left' && iconElement}
        {children}
        {iconElement && iconPosition === 'right' && iconElement}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }