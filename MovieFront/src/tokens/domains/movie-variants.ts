/**
 * 影片管理领域组件变体配置
 * 按照Claude.md第1.3.2节影片管理领域和第3.2.4节变体配置要求
 *
 * 重构说明：
 * - MovieCard、MovieGrid等组件已被内容渲染器系统替代
 * - 保留RatingBadge、HeroSection等通用组件变体
 * - 这些变体现在由内容渲染器系统统一管理
 */

// ============================================================================
// 已删除的组件变体 - 由内容渲染器系统替代
// ============================================================================
// MovieCard、MovieGrid、MovieCardItem 组件变体已被内容渲染器系统替代
// 相关变体配置现在由 @components/domains/shared/content-renderers 系统统一管理

// ============================================================================
// MovieDetail 组件变体
// ============================================================================

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

export type MovieDetailVariant = 'default' | 'fullscreen' | 'modal' | 'embedded'
export type MovieDetailLayout = 'standard' | 'sidebar' | 'featured'

// ============================================================================
// RatingBadge 组件变体
// ============================================================================

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

export type RatingVariant = 'default' | 'colored' | 'minimal' | 'outlined'
export type RatingSize = 'sm' | 'md' | 'lg'
export type RatingColorScheme = 'standard' | 'vibrant' | 'muted'

// ============================================================================
// HeroSection 组件变体
// ============================================================================

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

export type HeroVariant =
  | 'default'
  | 'featured'
  | 'cinematic'
  | 'minimal'
  | 'immersive'
export type HeroSize = 'sm' | 'md' | 'lg' | 'xl'
