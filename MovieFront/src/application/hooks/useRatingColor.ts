/**
 * @fileoverview 评分颜色Hook
 * @description 提供统一的评分颜色计算逻辑，遵循DRY原则和组件复用规范。
 * 支持多种评分颜色策略，可在各种组件中复用，确保颜色逻辑一致性。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useMemo } from 'react'

/**
 * 评分颜色类型枚举
 */
export type RatingColorType = 'red' | 'purple' | 'dimWhite'

/**
 * 评分颜色配置接口
 */
export interface RatingColorConfig {
  /** 评分值 */
  rating: number
  /** 颜色类型 */
  colorType: RatingColorType
  /** Tailwind CSS类名 */
  className: string
}

/**
 * 评分颜色Hook属性接口
 */
export interface UseRatingColorProps {
  /** 评分值 */
  rating?: number
  /** 自定义评分区间配置 */
  customThresholds?: {
    /** 高分阈值 */
    high: number
    /** 中分阈值 */
    medium: number
  }
}

/**
 * 评分颜色Hook
 *
 * 提供统一的评分颜色计算逻辑，支持自定义阈值配置。
 * 遵循Hook复用原则，避免在多个组件中重复实现相同的颜色逻辑。
 *
 * @param props Hook属性
 * @returns 评分颜色配置对象
 */
export const useRatingColor = ({
  rating = 0,
  customThresholds,
}: UseRatingColorProps): RatingColorConfig => {
  // 默认评分阈值配置
  const thresholds = useMemo(
    () => ({
      high: 9.0,
      medium: 7.5,
      ...customThresholds,
    }),
    [customThresholds]
  )

  // 计算评分颜色类型和对应的CSS类名
  const colorConfig = useMemo((): RatingColorConfig => {
    let colorType: RatingColorType
    let className: string

    if (rating >= thresholds.high) {
      colorType = 'red'
      className = 'text-red-500 dark:text-red-400'
    } else if (rating >= thresholds.medium) {
      colorType = 'purple'
      className = 'text-purple-400 dark:text-purple-300'
    } else {
      colorType = 'dimWhite'
      className = 'text-gray-300 dark:text-gray-500'
    }

    return {
      rating,
      colorType,
      className,
    }
  }, [rating, thresholds])

  return colorConfig
}

export default useRatingColor
