/**
 * @fileoverview 样式工具类，统一管理可复用的样式类
 * @description 提供动画、响应式、布局、交互状态、文本、边框、背景、滚动条等样式工具类，
 *              遵循组件样式隔离原则，避免全局样式污染。支持组合样式和条件样式生成器，
 *              与Radix UI Themes集成，提供语义化的颜色和样式系统。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 动画相关工具类
export const animations = {
  // 加载动画
  loading: 'animate-spin',
  loadingSpinner:
    'inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin',

  // 淡入动画
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',

  // 滑动动画
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',

  // 缩放动画
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',

  // 弹跳动画
  bounce: 'animate-bounce',
  bounceSubtle: 'animate-bounce-subtle',

  // 脉冲动画
  pulse: 'animate-pulse',
  ping: 'animate-ping',
} as const

// 响应式显示工具类
export const responsive = {
  // 移动端隐藏
  mobileHidden: 'hidden md:block',
  // 桌面端隐藏
  desktopHidden: 'block md:hidden',
  // 小屏隐藏
  smHidden: 'hidden sm:block',
  // 大屏隐藏
  lgHidden: 'block lg:hidden',

  // 响应式文本大小
  responsiveText: 'text-sm md:text-base lg:text-lg',
  responsiveHeading: 'text-xl md:text-2xl lg:text-3xl',

  // 响应式间距
  responsivePadding: 'p-2 md:p-4 lg:p-6',
  responsiveMargin: 'm-2 md:m-4 lg:m-6',
} as const

// 布局工具类
export const layouts = {
  // Flexbox布局
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-center justify-start',
  flexEnd: 'flex items-center justify-end',
  flexCol: 'flex flex-col',
  flexColCenter: 'flex flex-col items-center justify-center',

  // Grid布局
  gridBasic: 'grid grid-cols-1 gap-4',
  gridResponsive:
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
  gridMovie:
    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6',

  // 定位
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',

  // 覆盖层
  overlay: 'absolute inset-0 bg-black bg-opacity-50',
  fullscreen: 'fixed inset-0 z-50',
} as const

// 交互状态工具类
export const interactions = {
  // 悬停效果
  hoverLift: 'transition-transform duration-200 hover:-translate-y-1',
  hoverScale: 'transition-transform duration-200 hover:scale-105',
  hoverShadow: 'transition-shadow duration-200 hover:shadow-lg',

  // 焦点效果 - 使用Radix UI Themes的accent颜色
  focusRing:
    'focus:outline-none focus:ring-2 focus:ring-accent-7 focus:ring-offset-2',
  focusRingOffset:
    'focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-accent-7',

  // 活跃状态
  activeScale: 'active:scale-95',
  activeShadow: 'active:shadow-lg',

  // 过渡效果
  transitionAll: 'transition-all duration-200',
  transitionColors: 'transition-colors duration-200',
  transitionOpacity: 'transition-opacity duration-200',
} as const

// 文本工具类
export const texts = {
  // 文本截断
  truncate: 'truncate',
  lineClamp1: 'line-clamp-1',
  lineClamp2: 'line-clamp-2',
  lineClamp3: 'line-clamp-3',

  // 文本对齐
  textLeft: 'text-left',
  textCenter: 'text-center',
  textRight: 'text-right',
  textJustify: 'text-justify',

  // 字体粗细
  fontLight: 'font-light',
  fontNormal: 'font-normal',
  fontMedium: 'font-medium',
  fontSemibold: 'font-semibold',
  fontBold: 'font-bold',

  // 文本颜色 - 使用Radix UI Themes语义化颜色
  textMuted: 'text-gray-500 dark:text-gray-400',
  textPrimary: 'text-accent-11',
  textSecondary: 'text-gray-600 dark:text-gray-300',
} as const

// 边框和阴影工具类
export const borders = {
  // 圆角
  rounded: 'rounded',
  roundedSm: 'rounded-sm',
  roundedMd: 'rounded-md',
  roundedLg: 'rounded-lg',
  roundedXl: 'rounded-xl',
  roundedFull: 'rounded-full',

  // 边框
  border: 'border border-gray-200 dark:border-gray-700',
  borderLight: 'border border-gray-100 dark:border-gray-800',
  borderStrong: 'border-2 border-gray-300 dark:border-gray-600',

  // 阴影
  shadow: 'shadow-sm',
  shadowMd: 'shadow-md',
  shadowLg: 'shadow-lg',
  shadowXl: 'shadow-xl',
  shadowSoft: 'shadow-soft',
} as const

// 背景工具类
export const backgrounds = {
  // 透明背景
  transparent: 'bg-transparent',
  white: 'bg-white dark:bg-gray-1',
  muted: 'bg-gray-2 dark:bg-gray-9',
  accent: 'bg-accent-2/10', // 使用Radix UI Themes的accent颜色

  // 渐变背景 - 使用Radix UI Themes颜色
  gradient: 'bg-gradient-to-r from-accent-11 to-blue-11',
  gradientRadial: 'bg-gradient-radial from-accent-11 to-blue-11',
} as const

// 滚动条样式
export const scrollbars = {
  hidden: 'scrollbar-hide',
  thin: 'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
  none: 'scrollbar-none',
} as const

// 组合样式类
export const composed = {
  // 卡片样式 - 使用Radix UI Themes语义化颜色
  card: 'bg-white dark:bg-gray-1 rounded-lg shadow-sm border border-gray-6 dark:border-gray-5',
  cardHover: 'hover:shadow-md transition-shadow duration-200',

  // 按钮样式
  buttonBase:
    'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',

  // 输入框样式 - 使用Radix UI Themes的accent颜色
  inputBase:
    'w-full px-3 py-2 text-sm border border-gray-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-7 focus:border-transparent transition-all duration-200',

  // 模态框样式
  modalOverlay:
    'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50',
  modalContent:
    'bg-white dark:bg-gray-1 rounded-lg shadow-xl max-w-md w-full mx-4',

  // 导航样式 - 使用Radix UI Themes的accent颜色
  navItem:
    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
  navItemHover: 'hover:bg-accent-2 hover:text-accent-11',

  // 加载状态 - 使用Radix UI Themes的accent颜色
  loadingOverlay:
    'absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center',
  loadingSpinner: 'animate-spin h-5 w-5 text-accent-11',
} as const

// 条件样式生成器
export const createConditionalClass = (
  condition: boolean,
  trueClass: string,
  falseClass = ''
) => (condition ? trueClass : falseClass)

// 合并样式类工具函数
export const mergeClasses = (
  ...classes: (string | undefined | null | false)[]
): string => classes.filter(Boolean).join(' ')

// 类型定义
export type AnimationClass = keyof typeof animations
export type ResponsiveClass = keyof typeof responsive
export type LayoutClass = keyof typeof layouts
export type InteractionClass = keyof typeof interactions
export type TextClass = keyof typeof texts
export type BorderClass = keyof typeof borders
export type BackgroundClass = keyof typeof backgrounds
export type ScrollbarClass = keyof typeof scrollbars
export type ComposedClass = keyof typeof composed
