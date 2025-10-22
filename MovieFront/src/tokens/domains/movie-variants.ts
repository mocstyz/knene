/**
 * @fileoverview 影片管理领域组件变体配置
 * @description 影片管理领域组件的变体配置定义，包括MovieDetail、RatingBadge、HeroSection等
 *              组件的样式变体，按照配置驱动原则实现影片管理领域组件的复用和一致性
 *              注意：MovieCard、MovieGrid等组件已被内容渲染器系统替代，保留的变体由内容渲染器系统统一管理
 * @created 2025-10-16 12:37:26
 * @updated 2025-10-21 15:17:14
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 重构说明 - 已删除的组件变体由内容渲染器系统替代
// MovieCard、MovieGrid、MovieCardItem 组件变体已被内容渲染器系统替代
// 相关变体配置现在由 @components/domains/shared/content-renderers 系统统一管理

// MovieDetail组件变体配置 - 定义影片详情展示组件的基础样式和变体选项
export const movieDetailVariants = {
  base: 'space-y-6',
  variant: {
    default: 'max-w-4xl mx-auto',
    fullscreen: 'w-full h-full',
    modal: 'max-w-6xl mx-auto',
    embedded: 'w-full',
  },
  layout: {
    standard: 'block',
    sidebar: 'grid grid-cols-1 lg:grid-cols-3 gap-8',
    featured:
      'bg-gradient-to-br from-accent-2 to-accent-3 dark:from-accent-3 dark:to-accent-4 rounded-xl p-8',
  },
} as const

// MovieDetail组件变体类型 - 定义影片详情展示组件的样式变体选项
export type MovieDetailVariant = 'default' | 'fullscreen' | 'modal' | 'embedded'

// MovieDetail组件布局类型 - 定义影片详情展示组件的布局选项
export type MovieDetailLayout = 'standard' | 'sidebar' | 'featured'

// RatingBadge组件变体配置 - 定义评分徽章组件的基础样式和变体选项
export const ratingVariants = {
  base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  variant: {
    default: '',
    colored: '',
    minimal: 'bg-transparent border-0',
    outlined: 'border border-gray-300 bg-transparent',
  },
  size: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  },
  colorScheme: {
    standard: '',
    vibrant: '',
    muted: '',
  },
} as const

// RatingBadge组件变体类型 - 定义评分徽章的样式变体选项
export type RatingVariant = 'default' | 'colored' | 'minimal' | 'outlined'

// RatingBadge组件尺寸类型 - 定义评分徽章的尺寸选项
export type RatingSize = 'sm' | 'md' | 'lg'

// RatingBadge组件颜色方案类型 - 定义评分徽章的颜色方案选项
export type RatingColorScheme = 'standard' | 'vibrant' | 'muted'

// HeroSection组件变体配置 - 定义英雄区块组件的基础样式和变体选项
export const heroVariants = {
  base: 'relative overflow-hidden',
  variant: {
    default: 'bg-gradient-to-br from-gray-12 to-gray-10 text-white',
    featured: 'bg-gradient-to-r from-accent-11 to-accent-12 text-white',
    cinematic: 'bg-black text-white',
    minimal: 'bg-white dark:bg-gray-1 text-gray-12 dark:text-gray-1',
    immersive: 'bg-cover bg-center relative',
  },
  size: {
    sm: 'min-h-[60vh]',
    md: 'min-h-[80vh]',
    lg: 'min-h-screen',
    xl: 'min-h-[120vh]',
  },
  overlay: {
    true: 'before:absolute before:inset-0 before:bg-black/40',
    false: '',
  },
} as const

// HeroSection组件变体类型 - 定义英雄区块的样式变体选项
export type HeroVariant =
  | 'default' // 默认样式
  | 'featured' // 精选样式
  | 'cinematic' // 电影风格
  | 'minimal' // 极简风格
  | 'immersive' // 沉浸式风格

// HeroSection组件尺寸类型 - 定义英雄区块的尺寸选项
export type HeroSize = 'sm' | 'md' | 'lg' | 'xl'
