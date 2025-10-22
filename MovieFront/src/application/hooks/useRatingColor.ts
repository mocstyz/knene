/**
 * @fileoverview 评分颜色管理Hook - 统一的评分颜色计算与样式管理
 * @description 提供统一的评分颜色计算逻辑，遵循DRY原则和组件复用规范。
 * 支持多种评分颜色策略和自定义阈值配置，可在各种组件中复用，确保颜色逻辑一致性。
 * 基于评分值自动计算对应的颜色类型和Tailwind CSS类名，支持明暗主题适配。
 * 
 * @author mosctz
 * @version 1.1.0
 */

import { useMemo } from 'react'

// 评分颜色类型枚举 - 定义支持的评分颜色类型，用于区分不同评分等级的视觉表现
export type RatingColorType = 
  | 'red'      // 高分 - 红色，表示优秀评分
  | 'purple'   // 中分 - 紫色，表示良好评分
  | 'dimWhite' // 低分 - 灰色，表示一般评分

// 评分颜色配置接口 - 定义评分颜色计算结果的数据结构，包含评分值、颜色类型和对应的CSS类名
export interface RatingColorConfig {
  // 评分值 - 原始评分数值，通常为0-10的浮点数
  rating: number
  
  // 颜色类型 - 基于评分值计算得出的颜色类型标识
  colorType: RatingColorType
  
  // Tailwind CSS类名 - 对应颜色类型的完整CSS类名，支持明暗主题
  className: string
}

// 评分颜色Hook属性接口 - 定义useRatingColor Hook的输入参数，支持评分值和自定义阈值配置
export interface UseRatingColorProps {
  // 评分值 - 需要计算颜色的评分数值，默认为0
  rating?: number
  
  // 自定义评分区间配置 - 可选的自定义阈值设置，用于覆盖默认的评分区间
  customThresholds?: {
    // 高分阈值 - 高分区间的最低评分值，大于等于此值显示为红色，默认9.0
    high: number
    
    // 中分阈值 - 中分区间的最低评分值，大于等于此值且小于高分阈值显示为紫色，默认7.5
    medium: number
  }
}

// 评分颜色管理Hook - 提供统一的评分颜色计算逻辑，支持自定义阈值配置和主题适配
export const useRatingColor = ({
  rating = 0,
  customThresholds,
}: UseRatingColorProps): RatingColorConfig => {
  // 默认阈值配置 - 定义标准的评分区间划分
  const defaultThresholds = {
    high: 9.0,    // 高分阈值：9.0分及以上为优秀
    medium: 7.5,  // 中分阈值：7.5分及以上为良好
  }

  // 合并阈值配置 - 使用自定义阈值或默认阈值
  const thresholds = customThresholds || defaultThresholds

  // 计算评分颜色配置 - 使用useMemo优化性能，仅在评分值或阈值变化时重新计算
  const colorConfig = useMemo((): RatingColorConfig => {
    let colorType: RatingColorType
    let className: string

    // 评分颜色映射逻辑 - 根据评分值和阈值确定颜色类型
    if (rating >= thresholds.high) {
      // 高分区间：红色主题
      colorType = 'red'
      className = 'text-red-500 dark:text-red-400'
    } else if (rating >= thresholds.medium) {
      // 中分区间：紫色主题
      colorType = 'purple'
      className = 'text-purple-500 dark:text-purple-400'
    } else {
      // 低分区间：灰色主题
      colorType = 'dimWhite'
      className = 'text-gray-500 dark:text-gray-400'
    }

    return {
      rating,
      colorType,
      className,
    }
  }, [rating, thresholds.high, thresholds.medium])

  return colorConfig
}

export default useRatingColor
