/**
 * @fileoverview 评分徽章组件
 * @description 提供统一的评分显示徽章，支持多种颜色和尺寸，通常显示在卡片左下角
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 15:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React from 'react'

// 评分徽章组件属性接口，定义评分显示的各种配置
export interface RatingBadgeProps {
  rating: string // 评分值，如 "8.5" 或 "PG-13"
  color?: 'purple' | 'red' | 'white' | 'yellow' | 'green' | 'default' // 徽章颜色主题
  size?: 'sm' | 'md' | 'lg' // 徽章尺寸
  className?: string // 自定义CSS类名
}

// 评分徽章组件，用于在卡片上显示评分信息，默认定位在左下角
const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating, // 评分值
  color = 'default', // 默认紫色主题
  size = 'sm', // 默认小尺寸
  className, // 自定义类名
}) => {
  // 颜色样式映射表 - 定义不同颜色主题的文字颜色
  const colorClasses = {
    purple: 'text-purple-400', // 紫色主题
    red: 'text-red-500', // 红色主题
    white: 'text-white', // 白色主题
    yellow: 'text-yellow-400', // 黄色主题
    green: 'text-green-400', // 绿色主题
    default: 'text-purple-400', // 默认紫色主题
  }

  // 尺寸样式映射表 - 定义不同尺寸的内边距和字体大小
  const sizeClasses = {
    sm: 'text-xs px-2 py-1', // 小尺寸：12px字体，紧凑内边距
    md: 'text-sm px-3 py-1.5', // 中等尺寸：14px字体，标准内边距
    lg: 'text-base px-4 py-2', // 大尺寸：16px字体，宽松内边距
  }

  return (
    <div
      className={cn(
        'absolute bottom-2 left-2 z-10 rounded-md bg-black/70 font-bold', // 基础样式：绝对定位、圆角、半透明背景
        colorClasses[color], // 应用颜色主题
        sizeClasses[size], // 应用尺寸样式
        className // 应用自定义类名
      )}
    >
      {rating}
    </div>
  )
}

export { RatingBadge }
