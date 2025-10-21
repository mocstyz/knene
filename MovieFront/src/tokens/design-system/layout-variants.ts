/**
 * @fileoverview 布局相关组件变体配置
 * @description 提供统一的布局组件变体配置，包括Navigation、Grid、Container、Section等
 *              布局组件的样式变体定义，按照配置驱动原则实现布局组件的复用和一致性，
 *              确保所有布局组件都遵循统一的设计规范和响应式布局标准
 * @created 2025-10-09 13:10:50
 * @updated 2025-10-21 15:17:14
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// Navigation组件变体配置 - 定义导航的基础样式和变体选项
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

// Navigation组件变体类型 - 定义导航的布局变体选项
export type NavigationVariant =
  | 'horizontal' // 水平导航
  | 'vertical' // 垂直导航
  | 'dropdown' // 下拉导航
  | 'sidebar' // 侧边栏导航

// Grid组件变体配置 - 定义网格的基础样式和变体选项
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

// Grid组件变体类型 - 定义网格的布局变体选项
export type GridVariant =
  | 'default' // 默认网格
  | 'movie' // 影片网格
  | 'movieCompact' // 紧凑影片网格
  | 'movieList' // 影片列表网格
  | 'featured' // 精选网格
  | 'download' // 下载网格

// Container组件变体配置 - 定义容器的基础样式和变体选项
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

// Container组件变体类型 - 定义容器的尺寸变体选项
export type ContainerVariant =
  | 'fluid' // 流体容器
  | 'sm' // 小容器
  | 'md' // 中等容器
  | 'lg' // 大容器
  | 'xl' // 超大容器
  | '2xl' // 超超大容器
  | 'full' // 全宽容器

// Section组件变体配置 - 定义区块的基础样式和变体选项
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

// Section组件变体类型 - 定义区块的间距变体选项
export type SectionVariant =
  | 'default' // 默认间距
  | 'compact' // 紧凑间距
  | 'spacious' // 宽敞间距
  | 'hero' // 英雄区块间距
  | 'none' // 无间距

// Section组件背景类型 - 定义区块的背景样式选项
export type SectionBackground = 'default' | 'gray' | 'primary' | 'gradient'
