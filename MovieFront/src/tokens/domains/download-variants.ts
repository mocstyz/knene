/**
 * 下载管理领域组件变体配置
 * 按照Claude.md第1.3.3节下载管理领域和第3.2.4节变体配置要求
 */

// ============================================================================
// DownloadProgress 组件变体
// ============================================================================

export const downloadProgressVariants = {
  base: 'w-full',
  variant: {
    default:
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4',
    compact: 'bg-transparent border-0 p-2',
    detailed:
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6',
    card: 'bg-white dark:bg-gray-800 shadow-md rounded-lg p-4',
    inline: 'inline-flex items-center gap-3',
  },
  size: {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  },
  status: {
    pending: 'border-gray-300',
    downloading: 'border-blue-300',
    paused: 'border-yellow-300',
    completed: 'border-green-300',
    error: 'border-red-300',
    cancelled: 'border-gray-400',
  },
} as const

export type DownloadProgressVariant =
  | 'default'
  | 'compact'
  | 'detailed'
  | 'card'
  | 'inline'
export type DownloadProgressSize = 'sm' | 'md' | 'lg'

// ============================================================================
// ProgressBar 组件变体
// ============================================================================

export const progressVariants = {
  base: 'w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700',
  variant: {
    default: '',
    success: 'bg-green-100 dark:bg-green-900/30',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30',
    error: 'bg-red-100 dark:bg-red-900/30',
    info: 'bg-blue-100 dark:bg-blue-900/30',
  },
  size: {
    sm: 'h-1',
    md: 'h-2.5',
    lg: 'h-4',
  },
  animated: {
    true: 'transition-all duration-300 ease-in-out',
    false: '',
  },
} as const

export type ProgressVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
export type ProgressSize = 'sm' | 'md' | 'lg'

// ============================================================================
// DownloadButton 组件变体
// ============================================================================

export const downloadButtonVariants = {
  base: 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  variant: {
    default:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary:
      'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning:
      'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline:
      'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  },
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  },
  state: {
    default: '',
    loading: 'opacity-75 cursor-wait',
    disabled: 'opacity-50 cursor-not-allowed',
    downloading: 'bg-blue-600 hover:bg-blue-700',
  },
} as const

export type DownloadButtonVariant =
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline'
  | 'ghost'
export type DownloadButtonSize = 'sm' | 'md' | 'lg'
export type DownloadButtonState =
  | 'default'
  | 'loading'
  | 'disabled'
  | 'downloading'

// ============================================================================
// DownloadList 组件变体
// ============================================================================

export const downloadListVariants = {
  base: 'space-y-4',
  variant: {
    default: 'block',
    compact: 'space-y-2',
    card: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    table: 'block', // 需要配合 table 组件使用
  },
  size: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  },
  filterable: {
    true: 'mb-6',
    false: '',
  },
} as const

export type DownloadListVariant = 'default' | 'compact' | 'card' | 'table'
export type DownloadListSize = 'sm' | 'md' | 'lg'

// ============================================================================
// DownloadStatus 组件变体
// ============================================================================

export const downloadStatusVariants = {
  base: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
  variant: {
    pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    downloading:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    paused:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    completed:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-600 line-through',
  },
  size: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  },
  animated: {
    true: 'animate-pulse',
    false: '',
  },
} as const

export type DownloadStatusVariant =
  | 'pending'
  | 'downloading'
  | 'paused'
  | 'completed'
  | 'error'
  | 'cancelled'
export type DownloadStatusSize = 'sm' | 'md' | 'lg'
