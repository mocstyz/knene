import {
  buttonVariants,
  type ButtonVariant as ButtonVariantType,
  type ButtonSize,
} from '@tokens/design-system/base-variants'
import { cn } from '@utils/cn'
import React from 'react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | ButtonVariantType
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost'
    | 'outline'
  size?: ButtonSize | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  children?: React.ReactNode
  asChild?: boolean
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
      _asChild = false,
      ...props
    },
    ref
  ) => {
    // 映射旧variant到新variant配置
    const mappedVariant: ButtonVariantType = (() => {
      switch (variant) {
        case 'primary':
          return 'primary'
        case 'secondary':
          return 'secondary'
        case 'danger':
          return 'danger'
        case 'ghost':
          return 'ghost'
        case 'outline':
          return 'outline'
        default:
          return variant as ButtonVariantType
      }
    })()

    // 映射旧size到新size配置
    const mappedSize: ButtonSize = (() => {
      if (['xs', 'sm', 'md', 'lg', 'xl'].includes(size as string)) {
        return size as ButtonSize
      }
      return 'md'
    })()

    // 使用Radix UI + Tailwind样式的组合
    const buttonClasses = cn(
      buttonVariants.base,
      buttonVariants.variant[mappedVariant],
      buttonVariants.size[mappedSize],
      fullWidth && buttonVariants.fullWidth.true,
      className
    )

    const renderIcon = () => {
      if (loading) {
        return (
          <svg
            className="h-4 w-4 animate-spin"
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

    // 使用标准HTML button + Tailwind CSS（按照Claude.md第8章要求）
    return (
      <button
        className={buttonClasses}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {iconElement && iconPosition === 'left' && (
          <span className="mr-2">{iconElement}</span>
        )}
        {children}
        {iconElement && iconPosition === 'right' && (
          <span className="ml-2">{iconElement}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
