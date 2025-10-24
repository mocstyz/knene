/**
 * @fileoverview 分页组件设计令牌
 * @description 定义分页组件的样式变体系统，包括基础样式、变体样式、尺寸样式和容器样式
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 分页组件样式变体配置
export const paginationVariants = {
  base: 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',

  variant: {
    default: {
      button:
        'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
      active:
        'bg-green-100 text-green-900 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    primary: {
      button:
        'text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/20',
      active: 'bg-blue-600 text-white hover:bg-blue-700',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    ghost: {
      button:
        'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
      active: 'text-gray-900 font-bold dark:text-gray-100',
      disabled: 'opacity-50 cursor-not-allowed',
    },
  },

  size: {
    sm: {
      button: 'h-8 w-8 text-xs sm:h-8 sm:w-8',
      spacing: 'space-x-1',
      info: 'text-xs',
    },
    md: {
      button: 'h-8 w-8 text-xs sm:h-10 sm:w-10 sm:text-sm',
      spacing: 'space-x-1 sm:space-x-2',
      info: 'text-sm',
    },
    lg: {
      button: 'h-10 w-10 text-sm sm:h-12 sm:w-12 sm:text-base',
      spacing: 'space-x-2',
      info: 'text-base',
    },
  },

  container: 'flex items-center justify-center',

  info: 'text-gray-500 dark:text-gray-400',
} as const

// 分页组件变体类型
export type PaginationVariantKey = keyof typeof paginationVariants.variant
export type PaginationSizeKey = keyof typeof paginationVariants.size
