/**
 * @fileoverview Badge Layer 组件变体配置
 * @description 提供统一的标签层组件变体配置，支持VIP、评分、质量标签。
 * 遵循组件变体Token系统原则，保持base-variants.ts简洁性。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// ============================================================================
// Badge Layer 组件变体
// ============================================================================

export const badgeLayerVariants = {
  base: 'absolute z-10 inline-flex items-center justify-center font-semibold transition-all duration-200',
  position: {
    'top-right': 'top-2 right-2',
    'top-left': 'top-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'bottom-left': 'bottom-2 left-2',
  },
  size: {
    // 响应式尺寸配置 - 移动端优先，统一文本大小，使用base中的font-bold
    sm: 'px-1 py-0.5 text-xs rounded-sm',
    md: 'px-1.5 py-0.5 text-xs rounded-md',
    lg: 'px-2 py-1 text-xs rounded-lg',
    // 响应式变体
    responsive:
      'px-1 py-0.5 text-xs rounded-sm sm:px-1.5 sm:py-0.5 sm:text-xs sm:rounded-md md:px-2 md:py-1 md:text-xs md:rounded-md',
  },
  variant: {
    // VIP标签变体
    vip: {
      default:
        'bg-black/70 dark:bg-black/80 text-yellow-500 dark:text-yellow-400',
      compact:
        'bg-black/60 dark:bg-black/70 text-yellow-500 dark:text-yellow-400',
      prominent:
        'bg-black/80 dark:bg-black/90 text-yellow-500 dark:text-yellow-400 shadow-lg dark:shadow-xl',
    },
    // 评分标签变体
    rating: {
      default: 'bg-black/70 dark:bg-black/80 text-white',
      compact: 'bg-black/60 dark:bg-black/70 text-white',
      prominent:
        'bg-black/80 dark:bg-black/90 text-white shadow-lg dark:shadow-xl',
    },
    // 质量标签变体
    quality: {
      default: 'bg-black/70 dark:bg-black/80 text-white',
      compact: 'bg-black/60 dark:bg-black/70 text-white',
      prominent:
        'bg-black/80 dark:bg-black/90 text-white shadow-lg dark:shadow-xl',
    },
    // 新片标签变体
    new: {
      default: 'bg-red-500/80 dark:bg-red-600/80 text-white dark:text-gray-100',
      compact: 'bg-red-500/70 dark:bg-red-600/70 text-white dark:text-gray-100',
      prominent: 'bg-red-500/90 dark:bg-red-600/90 text-white dark:text-gray-100 shadow-lg dark:shadow-xl',
    },
  },
  // 评分颜色映射 - 匹配trending模块样式
  ratingColor: {
    green: 'text-green-400 dark:text-green-300',
    blue: 'text-blue-400 dark:text-blue-300',
    yellow: 'text-yellow-400 dark:text-yellow-300',
    orange: 'text-orange-400 dark:text-orange-300',
    red: 'text-red-500 dark:text-red-400',
    purple: 'text-purple-400 dark:text-purple-300',
    white: 'text-white dark:text-gray-100',
    success: 'text-green-400 dark:text-green-300',
    warning: 'text-yellow-400 dark:text-yellow-300',
    danger: 'text-red-500 dark:text-red-400',
    info: 'text-blue-400 dark:text-blue-300',
  },
} as const

// ============================================================================
// 类型定义
// ============================================================================

export type BadgeLayerPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
export type BadgeLayerSize = 'sm' | 'md' | 'lg' | 'responsive'
export type BadgeLayerVariant = 'default' | 'compact' | 'prominent'
export type BadgeLayerType = 'vip' | 'rating' | 'quality'
export type BadgeLayerRatingColor =
  | 'green'
  | 'blue'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'purple'
  | 'white'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
