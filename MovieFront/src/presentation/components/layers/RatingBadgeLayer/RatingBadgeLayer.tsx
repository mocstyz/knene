/**
 * @fileoverview 评分标签层组件
 * @description 提供统一的评分标签显示逻辑，遵循DRY原则和组件变体Token系统。
 * 支持多种评分颜色和样式变体，可在各种卡片组件中复用。响应式设计，移动端优先。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  badgeLayerVariants,
  type BadgeLayerPosition,
  type BadgeLayerVariant,
  type BadgeLayerSize,
  type BadgeLayerRatingColor,
} from '@tokens/design-system'
import { cn } from '@utils/cn'
import { formatRating } from '@utils/formatters'
import React from 'react'

/**
 * 评分验证和格式化函数
 */
const formatAndValidateRating = (
  rating: number | string
): { isValid: boolean; displayText: string; numericValue?: number } => {
  // 处理字符串评分
  if (typeof rating === 'string') {
    // 去除空格并转为大写
    const cleanRating = rating.trim().toUpperCase()

    // 处理特殊评分文本
    if (
      cleanRating === 'NC-17' ||
      cleanRating === 'NR' ||
      cleanRating === 'NOT RATED'
    ) {
      return { isValid: true, displayText: cleanRating }
    }

    // 尝试提取数字部分
    const numericMatch = cleanRating.match(/(\d+\.?\d*)/)
    if (numericMatch) {
      const numValue = parseFloat(numericMatch[1])
      return {
        isValid: true,
        displayText: rating,
        numericValue: numValue,
      }
    }

    // 其他字符串评分（如"A"、"B+"等）
    return { isValid: true, displayText: rating }
  }

  // 处理数字评分
  if (typeof rating === 'number') {
    if (isNaN(rating) || rating < 0) {
      return { isValid: false, displayText: '', numericValue: 0 }
    }

    // 限制评分范围在0-10之间
    const clampedRating = Math.min(Math.max(rating, 0), 10)
    return {
      isValid: true,
      displayText: formatRating(clampedRating),
      numericValue: clampedRating,
    }
  }

  return { isValid: false, displayText: '', numericValue: 0 }
}

/**
 * 获取评分颜色样式函数 - 使用组件变体Token系统
 */
const getRatingColorClass = (rating: number): BadgeLayerRatingColor => {
  if (rating >= 8.5) return 'green'
  if (rating >= 7.5) return 'blue'
  if (rating >= 6.5) return 'yellow'
  if (rating >= 5.5) return 'orange'
  return 'red'
}

/**
 * 评分标签层组件属性接口
 */
export interface RatingBadgeLayerProps {
  /** 评分值 (0-10) 或字符串评分 */
  rating?: number | string
  /** 自定义CSS类名 */
  className?: string
  /** 标签位置 */
  position?: BadgeLayerPosition
  /** 标签尺寸 */
  size?: BadgeLayerSize
  /** 标签变体 */
  variant?: BadgeLayerVariant
  /** 是否显示星标图标 */
  showIcon?: boolean
  /** 强制指定文本颜色类型 (覆盖自动计算的评分颜色) */
  textColor?: BadgeLayerRatingColor
  /** 自定义背景色 */
  backgroundColor?: string
}

/**
 * 评分标签层组件
 *
 * 提供统一的评分标签显示，使用组件变体Token系统，支持多种位置和样式变体。
 * 响应式设计，移动端优先。
 */
const RatingBadgeLayer: React.FC<RatingBadgeLayerProps> = ({
  rating = 0,
  className,
  position = 'bottom-left',
  size = 'responsive',
  variant = 'default',
  showIcon = false,
  textColor,
  backgroundColor,
}) => {
  // 使用评分验证和格式化函数
  const ratingResult = formatAndValidateRating(rating)

  // 如果评分无效，不显示标签
  if (!ratingResult.isValid) {
    return null
  }

  // 确定文本颜色 - 使用组件变体Token系统
  const finalTextColor =
    textColor ||
    (ratingResult.numericValue
      ? getRatingColorClass(ratingResult.numericValue)
      : 'white')

  // 使用组件变体Token系统组合CSS类名
  const badgeClasses = cn(
    badgeLayerVariants.base,
    badgeLayerVariants.position[position],
    badgeLayerVariants.size[size],
    badgeLayerVariants.variant.rating[variant],
    badgeLayerVariants.ratingColor[finalTextColor],
    // 如果指定了自定义背景色，覆盖默认背景
    backgroundColor && `!${backgroundColor}`,
    className
  )

  return (
    <div className={badgeClasses}>
      {showIcon && (
        <span className="inline-flex items-center gap-1">
          <span className="text-yellow-400">★</span>
          {ratingResult.displayText}
        </span>
      )}
      {!showIcon && ratingResult.displayText}
    </div>
  )
}

export default RatingBadgeLayer
