/**
 * 阴影设计令牌 - 定义阴影系统
 * 基于Material Design阴影规范，提供层次感
 */

// 阴影系统
export const shadows = {
  // 无阴影
  none: 'none',

  // 微弱阴影
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',

  // 小阴影
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',

  // 中等阴影
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',

  // 大阴影
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

  // 超大阴影
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

  // 2XL阴影
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // 内阴影
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // 软阴影（自定义）
  soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',

  // 强阴影（自定义）
  strong:
    '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)',

  // 彩色阴影
  primary: '0 4px 14px 0 rgba(34, 197, 94, 0.15)',
  secondary: '0 4px 14px 0 rgba(59, 130, 246, 0.15)',
  danger: '0 4px 14px 0 rgba(239, 68, 68, 0.15)',
  warning: '0 4px 14px 0 rgba(245, 158, 11, 0.15)',
} as const

// 组件阴影预设
export const componentShadows = {
  // 按钮阴影
  button: {
    default: shadows.none,
    hover: shadows.sm,
    active: shadows.inner,
    disabled: shadows.none,
  },

  // 卡片阴影
  card: {
    default: shadows.sm,
    hover: shadows.md,
    elevated: shadows.lg,
  },

  // 模态框阴影
  modal: {
    default: shadows.xl,
    overlay: '0 0 0 9999px rgba(0, 0, 0, 0.5)', // 遮罩层
  },

  // 下拉菜单阴影
  dropdown: {
    default: shadows.lg,
  },

  // 工具提示阴影
  tooltip: {
    default: shadows.md,
  },

  // 浮动操作按钮阴影
  fab: {
    default: shadows.lg,
    hover: shadows.xl,
  },

  // 导航栏阴影
  navbar: {
    default: shadows.sm,
  },

  // 侧边栏阴影
  sidebar: {
    default: shadows.lg,
  },

  // 标签阴影
  badge: {
    default: shadows.none,
  },

  // 输入框阴影
  input: {
    default: shadows.none,
    focus: shadows.sm,
    error: shadows.danger,
  },

  // 头像阴影
  avatar: {
    default: shadows.sm,
  },

  // 加载遮罩阴影
  loadingOverlay: {
    default: '0 0 0 9999px rgba(255, 255, 255, 0.8)',
  },
} as const

// 层级阴影（Material Design风格）
export const elevationShadows = {
  dp0: shadows.none,
  dp1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  dp2: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
  dp3: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
  dp4: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  dp6: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
  dp8: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
  dp12: '0 17px 50px rgba(0, 0, 0, 0.19), 0 12px 15px rgba(0, 0, 0, 0.24)',
  dp16: '0 24px 38px rgba(0, 0, 0, 0.14), 0 9px 46px rgba(0, 0, 0, 0.12)',
  dp24: '0 32px 48px rgba(0, 0, 0, 0.18), 0 16px 24px rgba(0, 0, 0, 0.15)',
} as const

// 主题阴影
export const themeShadows = {
  light: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  dark: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
  },
} as const

// 阴影工具函数
export const getShadow = (size: keyof typeof shadows): string => shadows[size]

export const getComponentShadow = (
  component: keyof typeof componentShadows,
  state: string = 'default'
): string => {
  const componentShadow = componentShadows[component]
  return (
    componentShadow[state as keyof typeof componentShadow] ||
    componentShadow.default ||
    shadows.none
  )
}

export const getElevationShadow = (dp: keyof typeof elevationShadows): string =>
  elevationShadows[dp]

export const getThemeShadow = (
  theme: 'light' | 'dark',
  size: keyof typeof themeShadows.light
): string => themeShadows[theme][size]

// 动态阴影生成器
export const createCustomShadow = (config: {
  x?: number
  y?: number
  blur?: number
  spread?: number
  color?: string
  inset?: boolean
}): string => {
  const {
    x = 0,
    y = 0,
    blur = 0,
    spread = 0,
    color = 'rgba(0, 0, 0, 0.1)',
    inset = false,
  } = config
  return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${color}`
}

export type ShadowSize = keyof typeof shadows
export type ComponentShadowType = keyof typeof componentShadows
export type ElevationLevel = keyof typeof elevationShadows
export type ThemeMode = 'light' | 'dark'
