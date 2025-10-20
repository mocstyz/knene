/**
 * @fileoverview 基础按钮原子组件
 * @description 提供统一的按钮功能，支持多种变体、尺寸和状态，集成加载状态和图标显示，遵循组件变体Token系统
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 15:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  buttonVariants,
  type ButtonVariant as ButtonVariantType,
  type ButtonSize,
} from '@tokens/design-system/base-variants'
import { cn } from '@utils/cn'
import React from 'react'

// 按钮组件属性接口，扩展原生按钮属性，定义按钮组件的所有配置选项
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | ButtonVariantType
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'ghost'
    | 'outline' // 按钮变体类型
  size?: ButtonSize | 'xs' | 'sm' | 'md' | 'lg' | 'xl' // 按钮尺寸预设
  loading?: boolean // 是否显示加载状态
  icon?: React.ReactNode // 按钮图标
  iconPosition?: 'left' | 'right' // 图标位置
  fullWidth?: boolean // 是否占满容器宽度
  children?: React.ReactNode // 按钮内容
}

// 基础按钮组件，提供统一的按钮功能，支持多种变体、尺寸和状态，集成加载状态和图标显示
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
    // 变体映射 - 将兼容的variant名称映射到设计系统variant配置
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

    // 尺寸映射 - 将兼容的size名称映射到设计系统size配置
    const mappedSize: ButtonSize = (() => {
      if (['xs', 'sm', 'md', 'lg', 'xl'].includes(size as string)) {
        return size as ButtonSize
      }
      return 'md'
    })()

    // 样式类组合 - 合并设计系统变体样式和自定义样式
    const buttonClasses = cn(
      buttonVariants.base,
      buttonVariants.variant[mappedVariant],
      buttonVariants.size[mappedSize],
      fullWidth && buttonVariants.fullWidth.true,
      className
    )

    // 图标渲染函数 - 根据加载状态决定显示加载动画还是自定义图标
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

    // 渲染按钮元素 - 根据图标位置和内容组织按钮布局
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
