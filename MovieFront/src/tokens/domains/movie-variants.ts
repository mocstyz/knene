/**
 * 电影管理领域组件变体配置
 * 按照Claude.md第1.3.2节影片管理领域和第3.2.4节变体配置要求
 */

// ============================================================================
// MovieCard 组件变体
// ============================================================================

export const movieCardVariants = {
  base: 'group relative overflow-hidden rounded-lg transition-all duration-300',
  variant: {
    default: 'bg-white dark:bg-gray-1 shadow-md hover:shadow-lg',
    poster: 'aspect-[2/3] bg-gray-3 dark:bg-gray-6',
    simple: '', // 首页专用样式：完全透明，无背景，让外层样式控制
    topic: 'relative rounded-lg overflow-hidden group cursor-pointer', // 专题卡片样式
    featured:
      'bg-gradient-to-br from-accent-2 to-accent-3 dark:from-accent-3 dark:to-accent-4 border-2 border-accent-7 dark:border-accent-6',
    grid: 'bg-white dark:bg-gray-1 shadow-md hover:shadow-xl hover:scale-[1.02]',
    list: 'bg-white dark:bg-gray-1 shadow-sm hover:shadow-md flex gap-4 p-4',
    compact: 'bg-white dark:bg-gray-1 shadow-sm hover:shadow-md',
  },
  size: {
    sm: 'w-48 h-72',
    md: 'w-56 h-80',
    lg: 'w-64 h-96',
    xl: 'w-72 h-[28rem]',
  },
  interactive: {
    true: 'cursor-pointer',
    false: '',
  },
} as const

export type MovieCardVariant =
  | 'default'
  | 'poster'
  | 'simple'
  | 'topic'
  | 'featured'
  | 'grid'
  | 'list'
  | 'compact'
export type MovieCardSize = 'sm' | 'md' | 'lg' | 'xl'

// ============================================================================
// MovieItem 组件变体
// ============================================================================

export const movieItemVariants = {
  base: 'flex items-center gap-4 p-3 rounded-lg transition-all duration-200',
  variant: {
    default:
      'bg-white dark:bg-gray-1 border border-gray-6 dark:border-gray-5 hover:border-accent-8',
    simple: 'hover:bg-gray-2 dark:hover:bg-gray-9',
    detailed: 'bg-white dark:bg-gray-1 shadow-md hover:shadow-lg',
    compact: 'bg-transparent hover:bg-gray-2 dark:hover:bg-gray-9/50',
  },
  size: {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  },
} as const

export type MovieItemVariant = 'default' | 'simple' | 'detailed' | 'compact'
export type MovieItemSize = 'sm' | 'md' | 'lg'

// ============================================================================
// MovieGrid 组件变体
// ============================================================================

export const movieGridVariants = {
  base: 'grid',
  variant: {
    default:
      'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6',
    compact: 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3',
    featured: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8',
    list: 'grid-cols-1 gap-4',
    category: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
  },
  loading: {
    true: 'opacity-50',
    false: '',
  },
} as const

export type MovieGridVariant =
  | 'default'
  | 'compact'
  | 'featured'
  | 'list'
  | 'category'

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
