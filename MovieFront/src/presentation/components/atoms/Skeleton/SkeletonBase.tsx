/**
 * @fileoverview 骨架屏基础组件
 * @description 提供统一的 shimmer 动画效果,是所有骨架屏组件的基础构建块,支持明暗主题切换和可访问性
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React, { useEffect, useState } from 'react'
import './shimmer.css'

export interface SkeletonBaseProps {
  className?: string
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  disableAnimation?: boolean
  children?: React.ReactNode
  style?: React.CSSProperties
}

// 检测用户是否偏好减少动画
const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// 检测是否为低端设备
const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false
  const memory = (navigator as any).deviceMemory
  return memory && memory < 4
}

// 骨架屏基础组件,提供统一的 shimmer 动画效果
export const SkeletonBase: React.FC<SkeletonBaseProps> = ({
  className,
  width,
  height,
  borderRadius,
  disableAnimation = false,
  children,
  style,
}) => {
  const [shouldDisableAnimation, setShouldDisableAnimation] = useState(false)

  useEffect(() => {
    setShouldDisableAnimation(
      disableAnimation || prefersReducedMotion() || isLowEndDevice()
    )
  }, [disableAnimation])

  const inlineStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    ...style,
  }

  return (
    <div
      className={cn(
        'skeleton-shimmer',
        shouldDisableAnimation && 'animation-none',
        className
      )}
      style={inlineStyle}
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      {children}
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default SkeletonBase
