/**
 * @fileoverview Badge Layer组件变体配置
 * @description 提供统一的标签层组件变体配置，支持VIP、评分、质量标签的样式定义
 *              遵循组件变体Token系统原则，保持base-variants.ts简洁性，包含位置、
 *              尺寸、变体类型和评分颜色的完整配置体系
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// Badge Layer组件变体配置 - 定义标签层的基础样式和变体选项
export const badgeLayerVariants = {
  base: 'absolute z-10 inline-flex items-center justify-center font-semibold transition-all duration-200', // 基础样式类
  position: {
    'top-right': 'top-2 right-2', // 右上角位置
    'top-left': 'top-2 left-2', // 左上角位置
    'bottom-right': 'bottom-2 right-2', // 右下角位置
    'bottom-left': 'bottom-2 left-2', // 左下角位置
  },
  size: {
    // 响应式尺寸配置 - 移动端优先，统一文本大小，使用base中的font-bold
    sm: 'px-1 py-0.5 text-xs rounded-sm', // 小尺寸
    md: 'px-1.5 py-0.5 text-xs rounded-md', // 中等尺寸
    lg: 'px-2 py-1 text-xs rounded-lg', // 大尺寸
    // 响应式变体 - 根据屏幕尺寸自动调整
    responsive:
      'px-1 py-0.5 text-xs rounded-sm sm:px-1.5 sm:py-0.5 sm:text-xs sm:rounded-md md:px-2 md:py-1 md:text-xs md:rounded-md',
  },
  variant: {
    // VIP标签变体配置
    vip: {
      default:
        'bg-black/70 dark:bg-black/80 text-yellow-500 dark:text-yellow-400',
      compact:
        'bg-black/60 dark:bg-black/70 text-yellow-500 dark:text-yellow-400',
      prominent:
        'bg-black/80 dark:bg-black/90 text-yellow-500 dark:text-yellow-400 shadow-lg dark:shadow-xl',
    },
    // 评分标签变体配置
    rating: {
      default: 'bg-black/70 dark:bg-black/80 text-white', // 默认样式
      compact: 'bg-black/60 dark:bg-black/70 text-white', // 紧凑样式
      prominent:
        'bg-black/80 dark:bg-black/90 text-white shadow-lg dark:shadow-xl', // 突出样式
    },
    // 质量标签变体配置
    quality: {
      default: 'bg-black/70 dark:bg-black/80 text-white', // 默认样式
      compact: 'bg-black/60 dark:bg-black/70 text-white', // 紧凑样式
      prominent:
        'bg-black/80 dark:bg-black/90 text-white shadow-lg dark:shadow-xl', // 突出样式
    },
    // 新片标签变体配置
    new: {
      default: 'bg-red-500/80 dark:bg-red-600/80 text-white dark:text-gray-100', // 默认样式
      compact: 'bg-red-500/70 dark:bg-red-600/70 text-white dark:text-gray-100', // 紧凑样式
      prominent:
        'bg-red-500/90 dark:bg-red-600/90 text-white dark:text-gray-100 shadow-lg dark:shadow-xl', // 突出样式
    },
  },
  // 评分颜色映射配置 - 匹配hot模块样式
  ratingColor: {
    green: 'text-green-400 dark:text-green-300',
    blue: 'text-blue-400 dark:text-blue-300',
    yellow: 'text-yellow-400 dark:text-yellow-300',
    orange: 'text-orange-400 dark:text-orange-300',
    red: 'text-red-500 dark:text-red-400',
    purple: 'text-purple-400 dark:text-purple-300',
    white: 'text-white dark:text-gray-100',
    gray: 'text-gray-400 dark:text-gray-500', // 新增：用于低分评分显示
    success: 'text-green-400 dark:text-green-300',
    warning: 'text-yellow-400 dark:text-yellow-300',
    danger: 'text-red-500 dark:text-red-400',
    info: 'text-blue-400 dark:text-blue-300',
  },
} as const

// Badge Layer组件类型定义 - 定义标签层组件的TypeScript类型
// 标签层位置类型 - 定义标签在元素中的位置选项
export type BadgeLayerPosition =
  | 'top-right' // 右上角
  | 'top-left' // 左上角
  | 'bottom-right' // 右下角
  | 'bottom-left' // 左下角

// 标签层尺寸类型 - 定义标签的尺寸选项
export type BadgeLayerSize = 'sm' | 'md' | 'lg' | 'responsive'

// 标签层变体类型 - 定义标签的显示样式
export type BadgeLayerVariant = 'default' | 'compact' | 'prominent'

// 标签层类型 - 定义标签的功能类型
export type BadgeLayerType = 'vip' | 'rating' | 'quality' | 'new'

// 评分颜色类型 - 定义评分显示的颜色选项
export type BadgeLayerRatingColor =
  | 'green' // 绿色 - 高分
  | 'blue' // 蓝色
  | 'yellow' // 黄色 - 中等分数
  | 'orange' // 橙色
  | 'red' // 红色 - 高分（≥9.0）
  | 'purple' // 紫色 - 优秀（8.0-8.9）
  | 'white' // 白色 - 良好（7.0-7.9）
  | 'gray' // 灰色 - 一般（<7.0）
  | 'success' // 成功状态
  | 'warning' // 警告状态
  | 'danger' // 危险状态
  | 'info' // 信息状态
