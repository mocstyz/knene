/**
 * @fileoverview 加载旋转器组件
 * @description 提供统一的加载状态指示器，支持多种尺寸和自定义样式
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'

// 加载旋转器组件属性接口，定义尺寸和样式配置
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' // 旋转器尺寸
  className?: string // 自定义CSS类名
}

// 加载旋转器组件，用于显示加载状态的动画指示器
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md', // 默认中等尺寸
  className = '', // 默认无额外类名
}) => {
  // 尺寸样式映射表 - 定义不同尺寸对应的宽高
  const sizeClasses = {
    sm: 'h-4 w-4', // 小尺寸：16x16px
    md: 'h-8 w-8', // 中等尺寸：32x32px
    lg: 'h-12 w-12', // 大尺寸：48x48px
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* 旋转圆环元素 - 使用CSS动画实现旋转效果 */}
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`}
      />
    </div>
  )
}

export default LoadingSpinner
