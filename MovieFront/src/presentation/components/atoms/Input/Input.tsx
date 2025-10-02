import React from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'outline'
  inputSize?: 'sm' | 'md' | 'lg'
  error?: boolean
  helperText?: string
  label?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      inputSize = 'md',
      error = false,
      helperText,
      label,
      leftIcon,
      rightIcon,
      fullWidth = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    const baseClasses = [
      'w-full rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-gray-400'
    ]

    const variantClasses = {
      default: [
        'border border-gray-300 bg-white',
        'focus:border-blue-500 focus:ring-blue-500',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
      ],
      filled: [
        'border-0 bg-gray-100',
        'focus:bg-white focus:ring-blue-500',
        error ? 'bg-red-50 focus:ring-red-500' : ''
      ],
      outline: [
        'border-2 border-gray-300 bg-transparent',
        'focus:border-blue-500 focus:ring-blue-500',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
      ]
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg'
    }

    const iconPadding = {
      sm: leftIcon ? 'pl-9' : rightIcon ? 'pr-9' : '',
      md: leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '',
      lg: leftIcon ? 'pl-12' : rightIcon ? 'pr-12' : ''
    }

    const iconSize = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    }

    const iconPosition = {
      sm: leftIcon ? 'left-3' : rightIcon ? 'right-3' : '',
      md: leftIcon ? 'left-3' : rightIcon ? 'right-3' : '',
      lg: leftIcon ? 'left-4' : rightIcon ? 'right-4' : ''
    }

    return (
      <div className={cn('relative', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-1',
              error ? 'text-red-700' : 'text-gray-700'
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div
              className={cn(
                'absolute top-1/2 transform -translate-y-1/2 text-gray-400',
                iconPosition[inputSize],
                iconSize[inputSize]
              )}
            >
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            className={cn(
              baseClasses,
              variantClasses[variant],
              sizeClasses[inputSize],
              iconPadding[inputSize],
              className
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div
              className={cn(
                'absolute top-1/2 transform -translate-y-1/2 text-gray-400',
                iconPosition[inputSize],
                iconSize[inputSize]
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>
        
        {helperText && (
          <p
            className={cn(
              'mt-1 text-sm',
              error ? 'text-red-600' : 'text-gray-500'
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }