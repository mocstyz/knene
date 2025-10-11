/**
 * 布局相关组件变体配置
 * 按照Claude.md第3.2.4节要求，通过配置驱动实现布局组件复用
 */

// ============================================================================
// Navigation 组件变体
// ============================================================================

export const navigationVariants = {
  base: 'flex items-center space-x-1',
  variant: {
    horizontal: 'flex-row',
    vertical: 'flex-col space-y-1 space-x-0',
    dropdown:
      'flex-col absolute top-full left-0 z-50 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800',
    sidebar:
      'flex-col space-y-2 p-4 border-r border-gray-200 dark:border-gray-700',
  },
  item: {
    base: 'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
    default:
      'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
    active:
      'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
    disabled: 'opacity-50 cursor-not-allowed',
  },
} as const

export type NavigationVariant =
  | 'horizontal'
  | 'vertical'
  | 'dropdown'
  | 'sidebar'

// ============================================================================
// Grid 组件变体
// ============================================================================

export const gridVariants = {
  base: 'grid',
  variant: {
    default: 'grid-cols-1 gap-4',
    movie:
      'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6',
    movieCompact:
      'grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3',
    movieList: 'grid-cols-1 gap-4',
    featured: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8',
    download: 'grid-cols-1 gap-4',
  },
  responsive: {
    true: '',
    false: 'grid-cols-1',
  },
} as const

export type GridVariant =
  | 'default'
  | 'movie'
  | 'movieCompact'
  | 'movieList'
  | 'featured'
  | 'download'

// ============================================================================
// Container 组件变体
// ============================================================================

export const containerVariants = {
  base: 'w-full mx-auto px-4 sm:px-6 lg:px-8',
  variant: {
    fluid: 'max-w-none',
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-8xl',
    full: 'max-w-full',
  },
  centered: {
    true: 'flex items-center justify-center min-h-screen',
    false: '',
  },
} as const

export type ContainerVariant =
  | 'fluid'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'full'

// ============================================================================
// Section 组件变体
// ============================================================================

export const sectionVariants = {
  base: 'w-full',
  variant: {
    default: 'py-12 md:py-16',
    compact: 'py-6 md:py-8',
    spacious: 'py-16 md:py-24',
    hero: 'py-20 md:py-32',
    none: 'py-0',
  },
  background: {
    default: 'bg-white dark:bg-gray-900',
    gray: 'bg-gray-50 dark:bg-gray-800',
    primary: 'bg-primary-50 dark:bg-primary-900/20',
    gradient:
      'bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800',
  },
} as const

export type SectionVariant =
  | 'default'
  | 'compact'
  | 'spacious'
  | 'hero'
  | 'none'
export type SectionBackground = 'default' | 'gray' | 'primary' | 'gradient'
