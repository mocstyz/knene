/**
 * @fileoverview 导航菜单设计令牌系统
 * @description 实现导航菜单的样式变体和主题配置，支持不同页面和场景的灵活复用，提供完整的设计系统配置
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 导航菜单样式变体配置 - 定义不同场景下的导航菜单样式风格
export const navigationVariants = {
  default: 'default-style', // 默认样式，适用于首页使用
  minimal: 'minimal-style', // 紧凑样式，适用于其他页面使用
  detailed: 'detailed-style', // 详细样式，适用于包含更多信息的页面
  sidebar: 'sidebar-style', // 侧边栏样式，适用于侧边导航场景
} as const

// 导航菜单主题配置 - 定义明暗主题和自动主题的颜色样式
export const navigationThemes = {
  light: {
    background: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-500',
    border: 'border-gray-200',
    hoverBg: 'hover:bg-green-100',
    hoverText: 'hover:text-green-600',
    dropdownBg: 'bg-white',
    shadow: 'shadow-xl',
  },
  dark: {
    background: 'bg-gray-900',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    hoverBg: 'hover:bg-green-900/20',
    hoverText: 'hover:text-green-400',
    dropdownBg: 'bg-gray-900',
    shadow: 'shadow-xl',
  },
  auto: {
    background: 'bg-white dark:bg-gray-900',
    text: 'text-gray-900 dark:text-white',
    textSecondary: 'text-gray-500 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
    hoverBg: 'hover:bg-green-100 dark:hover:bg-green-900/20',
    hoverText: 'hover:text-green-600 dark:hover:text-green-400',
    dropdownBg: 'bg-white dark:bg-gray-900',
    shadow: 'shadow-xl',
  },
} as const

// 导航菜单尺寸配置 - 定义不同尺寸下的容器宽度和内边距
export const navigationSizes = {
  sm: {
    container: 'w-56',
    padding: 'p-3',
    fontSize: 'text-xs',
    spacing: 'space-y-1',
  },
  md: {
    container: 'w-64',
    padding: 'p-4',
    fontSize: 'text-sm',
    spacing: 'space-y-2',
  },
  lg: {
    container: 'w-80',
    padding: 'p-4',
    fontSize: 'text-base',
    spacing: 'space-y-2',
  },
  xl: {
    container: 'w-[30rem]',
    padding: 'p-5',
    fontSize: 'text-base',
    spacing: 'space-y-3',
  },
} as const

// 导航菜单动画配置 - 定义不同类型的过渡动画效果
export const navigationAnimations = {
  fadeIn: 'transition-opacity duration-200', // 淡入动画效果
  slideIn: 'transition-transform duration-200', // 滑入动画效果
  scaleIn: 'transition-all duration-200', // 缩放动画效果
} as const

// 页面配置示例 - 为不同页面提供预设的导航配置方案
export const pageConfigs = {
  home: {
    variant: 'default' as const,
    theme: 'auto' as const,
    size: 'lg' as const,
    animation: 'fadeIn' as const,
    showImages: true,
    layout: 'grid',
  },
  movies: {
    variant: 'minimal' as const,
    theme: 'auto' as const,
    size: 'md' as const,
    animation: 'slideIn' as const,
    showImages: false,
    layout: 'list',
  },
  user: {
    variant: 'detailed' as const,
    theme: 'auto' as const,
    size: 'md' as const,
    animation: 'fadeIn' as const,
    showImages: false,
    layout: 'list',
  },
} as const

// 组件样式生成器 - 根据指定的变体、主题和尺寸生成完整的导航样式
export const createNavigationStyles = (
  _variant: keyof typeof navigationVariants, // 导航变体类型
  theme: keyof typeof navigationThemes, // 主题类型
  size: keyof typeof navigationSizes // 尺寸类型
) => {
  // 获取主题和尺寸配置
  const themeConfig = navigationThemes[theme]
  const sizeConfig = navigationSizes[size]

  // 组合生成完整的样式配置
  return {
    container: `${themeConfig.shadow} ${sizeConfig.container} ${sizeConfig.padding} rounded-lg`,
    text: `${themeConfig.text} ${sizeConfig.fontSize}`,
    textSecondary: `${themeConfig.textSecondary} text-xs`,
    hoverEffect: `${themeConfig.hoverBg} ${themeConfig.hoverText} transition-all duration-200`,
    spacing: sizeConfig.spacing,
  }
}

// 导航相关类型定义 - 基于配置对象的键类型生成联合类型
export type NavigationVariant = keyof typeof navigationVariants // 导航变体类型
export type NavigationTheme = keyof typeof navigationThemes // 导航主题类型
export type NavigationSize = keyof typeof navigationSizes // 导航尺寸类型
export type NavigationAnimation = keyof typeof navigationAnimations // 导航动画类型
