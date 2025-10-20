/**
 * @fileoverview 输入框组件
 * @description 提供多种样式变体的输入框组件，支持标签、图标、错误状态和帮助文本等功能
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 15:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'

// 输入框组件属性接口，扩展原生input属性并添加自定义功能
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'outline' // 输入框变体样式
  inputSize?: 'sm' | 'md' | 'lg' // 输入框尺寸
  error?: boolean // 是否显示错误状态
  helperText?: string // 帮助文本
  label?: string // 输入框标签
  leftIcon?: React.ReactNode // 左侧图标
  rightIcon?: React.ReactNode // 右侧图标
  fullWidth?: boolean // 是否占满容器宽度
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
    // 生成唯一的input ID - 如果没有提供ID则自动生成随机ID
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    // 基础样式类名数组 - 定义所有变体共享的基础样式
    const baseClasses = [
      'w-full rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-gray-400',
    ]

    // 变体样式映射表 - 定义不同视觉风格的样式
    const variantClasses = {
      default: [
        'border border-gray-300 bg-white',
        'focus:border-blue-500 focus:ring-blue-500',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
      ],
      filled: [
        'border-0 bg-gray-100',
        'focus:bg-white focus:ring-blue-500',
        error ? 'bg-red-50 focus:ring-red-500' : '',
      ],
      outline: [
        'border-2 border-gray-300 bg-transparent',
        'focus:border-blue-500 focus:ring-blue-500',
        error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '',
      ],
    }

    // 尺寸样式映射表 - 定义不同尺寸的内边距和字体大小
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    }

    // 图标内边距映射表 - 根据图标位置和尺寸调整输入框内边距
    const iconPadding = {
      sm: leftIcon ? 'pl-9' : rightIcon ? 'pr-9' : '',
      md: leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '',
      lg: leftIcon ? 'pl-12' : rightIcon ? 'pr-12' : '',
    }

    // 图标尺寸映射表 - 定义不同输入框尺寸对应的图标尺寸
    const iconSize = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    }

    // 图标位置映射表 - 定义图标在输入框中的绝对定位位置
    const iconPosition = {
      sm: leftIcon ? 'left-3' : rightIcon ? 'right-3' : '',
      md: leftIcon ? 'left-3' : rightIcon ? 'right-3' : '',
      lg: leftIcon ? 'left-4' : rightIcon ? 'right-4' : '',
    }

    return (
      <div className={cn('relative', fullWidth ? 'w-full' : 'w-auto')}>
        {/* 渲染标签元素 - 如果提供了label属性则显示对应的label标签 */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'mb-1 block text-sm font-medium',
              error ? 'text-red-700' : 'text-gray-700'
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* 渲染左侧图标 - 如果提供了leftIcon则显示在输入框左侧 */}
          {leftIcon && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 transform text-gray-400',
                iconPosition[inputSize],
                iconSize[inputSize]
              )}
            >
              {leftIcon}
            </div>
          )}

          {/* 渲染原生input元素 - 应用组合后的样式类名和所有原生属性 */}
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

          {/* 渲染右侧图标 - 如果提供了rightIcon则显示在输入框右侧 */}
          {rightIcon && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 transform text-gray-400',
                iconPosition[inputSize],
                iconSize[inputSize]
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {/* 渲染帮助文本 - 如果提供了helperText则显示在输入框下方，错误状态时使用红色文字 */}
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
