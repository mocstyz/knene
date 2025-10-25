/**
 * @fileoverview 加载旋转器组件
 * @description 提供统一的加载状态指示器，支持多种尺寸、颜色和显示模式
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0
 */

import { cn } from '@utils/cn'
import React, { useEffect, useState } from 'react'

// 加载旋转器组件属性接口
interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
  color?: string
  fullscreen?: boolean
  overlay?: boolean
  speed?: number
  disableAnimation?: boolean
}

// 加载旋转器组件
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  text,
  color,
  fullscreen = false,
  overlay = false,
  speed = 1,
  disableAnimation = false,
}) => {
  // 检测用户偏好设置 - 减少动画
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
  
  // 判断是否应该显示动画
  const shouldAnimate = !disableAnimation && !prefersReducedMotion
  
  // 尺寸样式映射表 - 定义不同尺寸对应的宽高和边框
  const sizeClasses = {
    xs: 'h-3 w-3 border', // 超小尺寸：12x12px, 1px border
    sm: 'h-4 w-4 border', // 小尺寸：16x16px, 1px border
    md: 'h-8 w-8 border-2', // 中等尺寸：32x32px, 2px border
    lg: 'h-12 w-12 border-2', // 大尺寸：48x48px, 2px border
    xl: 'h-16 w-16 border-3', // 超大尺寸：64x64px, 3px border
  }
  
  // 构建 spinner 元素
  const spinner = (
    <div
      className={cn(
        'rounded-full border-gray-300 border-t-blue-600',
        'dark:border-gray-600 dark:border-t-blue-400',
        shouldAnimate ? 'animate-spin' : '',
        sizeClasses[size]
      )}
      style={{
        borderColor: color ? `${color}20` : undefined,
        borderTopColor: color || undefined,
        animationDuration: `${speed}s`,
      }}
      role="status"
      aria-busy="true"
      aria-label={text || 'Loading'}
    >
      <span className="sr-only">{text || 'Loading...'}</span>
    </div>
  )
  
  // 带文本的 spinner
  const spinnerWithText = text ? (
    <div className="flex flex-col items-center gap-3">
      {spinner}
      <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
    </div>
  ) : spinner
  
  // 全屏模式
  if (fullscreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light dark:bg-background-dark">
        {spinnerWithText}
      </div>
    )
  }
  
  // 遮罩模式
  if (overlay) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        {spinnerWithText}
      </div>
    )
  }
  
  // 默认内联模式
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {spinnerWithText}
    </div>
  )
}

export default LoadingSpinner
