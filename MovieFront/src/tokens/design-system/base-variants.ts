/**
 * 基础组件变体配置
 * 按照Claude.md第3.2.4节要求，通过配置驱动实现基础组件复用
 */

// ============================================================================
// Button 组件变体
// ============================================================================

export const buttonVariants = {
  base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed',
  size: {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  },
  variant: {
    primary:
      'btn-primary text-black shadow-sm hover:opacity-90 focus:ring-0 focus:ring-offset-0 border border-transparent font-medium',
    secondary:
      'bg-gray-4 dark:bg-gray-6 text-gray-12 dark:text-gray-1 shadow-sm hover:bg-gray-5 dark:hover:bg-gray-7 focus:ring-0 focus:ring-offset-0 border border-transparent font-semibold',
    outline:
      'bg-gray-2 dark:bg-gray-9 text-gray-11 dark:text-gray-2 hover:bg-gray-3 dark:hover:bg-gray-8 focus:ring-0 focus:ring-offset-0 border border-gray-6 dark:border-gray-5 font-medium',
    danger:
      'bg-red-11 text-white shadow-sm hover:bg-red-12 focus:ring-0 focus:ring-offset-0 border border-transparent',
    ghost:
      'bg-transparent text-gray-11 dark:text-gray-2 hover:bg-gray-3 dark:hover:bg-gray-8 focus:ring-0 focus:ring-offset-0 border border-transparent',
    success:
      'bg-green-11 text-white hover:bg-green-12 focus:ring-0 focus:ring-offset-0',
    warning:
      'bg-yellow-11 text-white hover:bg-yellow-12 focus:ring-0 focus:ring-offset-0',
    info: 'bg-blue-11 text-white hover:bg-blue-12 focus:ring-0 focus:ring-offset-0',
    link: 'text-accent-11 underline-offset-4 hover:underline focus:ring-0 focus:ring-offset-0 p-0',
  },
  fullWidth: {
    true: 'w-full',
    false: '',
  },
} as const

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'
  | 'outline'
  | 'success'
  | 'warning'
  | 'info'
  | 'link'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// ============================================================================
// Input 组件变体
// ============================================================================

export const inputVariants = {
  base: 'flex w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed',
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  },
  variant: {
    default:
      'border-gray-6 bg-white dark:bg-gray-1 focus:border-accent-8 focus:ring-accent-7',
    filled:
      'border-gray-5 bg-gray-2 dark:bg-gray-3 focus:border-accent-8 focus:ring-accent-7',
    outlined:
      'border-2 border-gray-6 bg-transparent focus:border-accent-8 focus:ring-accent-7',
    underlined:
      'border-0 border-b-2 border-gray-6 rounded-none px-0 bg-transparent focus:border-accent-8 focus:ring-0',
  },
  state: {
    default: '',
    error: 'border-red-8 focus:border-red-9 focus:ring-red-7',
    success: 'border-green-8 focus:border-green-9 focus:ring-green-7',
    warning: 'border-yellow-8 focus:border-yellow-9 focus:ring-yellow-7',
  },
} as const

export type InputVariant = 'default' | 'filled' | 'outlined' | 'underlined'
export type InputSize = 'sm' | 'md' | 'lg'

// ============================================================================
// Badge 组件变体
// ============================================================================

export const badgeVariants = {
  base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  variant: {
    default: 'bg-gray-3 text-gray-11',
    primary: 'bg-accent-3 text-accent-11',
    secondary: 'bg-blue-3 text-blue-11',
    success: 'bg-green-3 text-green-11',
    warning: 'bg-yellow-3 text-yellow-11',
    danger: 'bg-red-3 text-red-11',
    info: 'bg-cyan-3 text-cyan-11',
    outline: 'border border-gray-6 text-gray-11 bg-transparent',
  },
  size: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  },
} as const

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'
export type BadgeSize = 'sm' | 'md' | 'lg'

// ============================================================================
// Card 组件变体
// ============================================================================

export const cardVariants = {
  base: 'rounded-lg shadow-md transition-all duration-200',
  variant: {
    default: 'bg-white dark:bg-gray-1 border border-gray-6 dark:border-gray-5',
    elevated: 'bg-white dark:bg-gray-1 shadow-lg hover:shadow-xl',
    outlined:
      'bg-white dark:bg-gray-1 border-2 border-gray-6 dark:border-gray-5',
    ghost: 'bg-transparent hover:bg-gray-2 dark:hover:bg-gray-9',
    featured:
      'bg-gradient-to-br from-accent-2 to-accent-3 dark:from-accent-3 dark:to-accent-4 border-2 border-accent-7 dark:border-accent-6',
  },
  size: {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },
  interactive: {
    true: 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
    false: '',
  },
} as const

export type CardVariant =
  | 'default'
  | 'elevated'
  | 'outlined'
  | 'ghost'
  | 'featured'
export type CardSize = 'sm' | 'md' | 'lg' | 'xl'

// ============================================================================
// Select 组件变体
// ============================================================================

export const selectVariants = {
  base: 'flex w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white',
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  },
  variant: {
    default: 'border-gray-6 focus:border-accent-8 focus:ring-accent-7',
    filled: 'border-gray-5 bg-gray-2 focus:border-accent-8 focus:ring-accent-7',
    outlined:
      'border-2 border-gray-6 bg-transparent focus:border-accent-8 focus:ring-accent-7',
  },
} as const

export type SelectVariant = 'default' | 'filled' | 'outlined'
export type SelectSize = 'sm' | 'md' | 'lg'

// ============================================================================
// Switch 组件变体
// ============================================================================

export const switchVariants = {
  base: 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-7 focus:ring-offset-2',
  size: {
    sm: 'h-4 w-7',
    md: 'h-6 w-11',
    lg: 'h-8 w-15',
  },
  variant: {
    default: 'bg-gray-6 data-[state=checked]:bg-accent-11',
    success: 'bg-gray-6 data-[state=checked]:bg-green-11',
    warning: 'bg-gray-6 data-[state=checked]:bg-yellow-11',
    danger: 'bg-gray-6 data-[state=checked]:bg-red-11',
  },
} as const

export type SwitchVariant = 'default' | 'success' | 'warning' | 'danger'
export type SwitchSize = 'sm' | 'md' | 'lg'
