/**
 * 导航菜单设计令牌系统
 * 实现样式变体和主题配置，支持不同页面的灵活复用
 */

// 导航菜单样式变体
export const navigationVariants = {
  // 默认样式 - 首页使用
  default: 'default-style',
  // 紧凑样式 - 其他页面使用
  minimal: 'minimal-style',
  // 详细样式 - 包含更多信息的页面
  detailed: 'detailed-style',
  // 侧边栏样式
  sidebar: 'sidebar-style',
} as const

// 导航菜单主题配置
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

// 导航菜单尺寸配置
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

// 动画配置
export const navigationAnimations = {
  fadeIn: 'transition-opacity duration-200',
  slideIn: 'transition-transform duration-200',
  scaleIn: 'transition-all duration-200',
} as const

// 页面配置示例
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

// 组件样式生成器
export const createNavigationStyles = (
  _variant: keyof typeof navigationVariants,
  theme: keyof typeof navigationThemes,
  size: keyof typeof navigationSizes
) => {
  const themeConfig = navigationThemes[theme]
  const sizeConfig = navigationSizes[size]

  return {
    container: `${themeConfig.shadow} ${sizeConfig.container} ${sizeConfig.padding} rounded-lg`,
    text: `${themeConfig.text} ${sizeConfig.fontSize}`,
    textSecondary: `${themeConfig.textSecondary} text-xs`,
    hoverEffect: `${themeConfig.hoverBg} ${themeConfig.hoverText} transition-all duration-200`,
    spacing: sizeConfig.spacing,
  }
}

export type NavigationVariant = keyof typeof navigationVariants
export type NavigationTheme = keyof typeof navigationThemes
export type NavigationSize = keyof typeof navigationSizes
export type NavigationAnimation = keyof typeof navigationAnimations
