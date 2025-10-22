/**
 * @fileoverview 阴影设计令牌配置
 * @description 阴影设计令牌系统定义，包括基础阴影、组件阴影、层级阴影和主题阴影等
 *              基于Material Design阴影规范，提供完整的层次感和深度效果，包含阴影工具函数
 *              和动态阴影生成器，确保整个应用的阴影效果一致性和视觉层次清晰
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 基础阴影系统配置 - 定义各种大小和类型的阴影效果，基于Material Design规范
export const shadows = {
  none: 'none', // 无阴影效果

  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // 微弱阴影 - 用于细微的层次区分

  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // 基础阴影 - 默认的阴影效果

  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // 中等阴影 - 用于一般层次提升

  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // 大阴影 - 用于明显的层次区分

  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // 超大阴影 - 用于重要元素突出

  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // 2倍超大阴影 - 用于模态框等弹出层

  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)', // 内阴影 - 用于凹陷效果的元素

  soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)', // 软阴影 - 自定义柔和阴影效果

  strong: '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)', // 强阴影 - 自定义强烈阴影效果

  // 彩色阴影系统 - 用于不同状态和语义的彩色阴影效果
  primary: '0 4px 14px 0 rgba(34, 197, 94, 0.15)', // 主要彩色阴影 - 绿色调
  secondary: '0 4px 14px 0 rgba(59, 130, 246, 0.15)', // 次要彩色阴影 - 蓝色调
  danger: '0 4px 14px 0 rgba(239, 68, 68, 0.15)', // 危险彩色阴影 - 红色调
  warning: '0 4px 14px 0 rgba(245, 158, 11, 0.15)', // 警告彩色阴影 - 黄色调
} as const

// 组件阴影预设配置 - 为特定组件的各个状态定义合适的阴影效果
export const componentShadows = {
  // 按钮组件阴影 - 定义按钮在不同交互状态下的阴影效果
  button: {
    default: shadows.none, // 默认状态：无阴影
    hover: shadows.sm, // 悬停状态：微弱阴影
    active: shadows.inner, // 激活状态：内阴影效果
    disabled: shadows.none, // 禁用状态：无阴影
  },

  // 卡片组件阴影 - 定义卡片在不同状态下的阴影效果
  card: {
    default: shadows.sm, // 默认状态：微弱阴影
    hover: shadows.md, // 悬停状态：中等阴影
    elevated: shadows.lg, // 提升状态：大阴影
  },

  // 模态框组件阴影 - 定义模态框和遮罩层的阴影效果
  modal: {
    default: shadows.xl, // 模态框默认：超大阴影
    overlay: '0 0 0 9999px rgba(0, 0, 0, 0.5)', // 遮罩层：半透明遮罩
  },

  // 下拉菜单组件阴影 - 定义下拉菜单的阴影效果
  dropdown: {
    default: shadows.lg, // 下拉菜单默认：大阴影
  },

  // 工具提示组件阴影 - 定义工具提示的阴影效果
  tooltip: {
    default: shadows.md, // 工具提示默认：中等阴影
  },

  // 浮动操作按钮阴影 - 定义FAB组件的阴影效果
  fab: {
    default: shadows.lg, // FAB默认：大阴影
    hover: shadows.xl, // FAB悬停：超大阴影
  },

  // 导航栏组件阴影 - 定义导航栏的阴影效果
  navbar: {
    default: shadows.sm, // 导航栏默认：微弱阴影
  },

  // 侧边栏组件阴影 - 定义侧边栏的阴影效果
  sidebar: {
    default: shadows.lg, // 侧边栏默认：大阴影
  },

  // 标签组件阴影 - 定义标签的阴影效果
  badge: {
    default: shadows.none, // 标签默认：无阴影
  },

  // 输入框组件阴影 - 定义输入框在不同状态下的阴影效果
  input: {
    default: shadows.none, // 默认状态：无阴影
    focus: shadows.sm, // 焦点状态：微弱阴影
    error: shadows.danger, // 错误状态：危险彩色阴影
  },

  // 头像组件阴影 - 定义头像的阴影效果
  avatar: {
    default: shadows.sm, // 头像默认：微弱阴影
  },

  // 加载遮罩阴影 - 定义加载遮罩层的阴影效果
  loadingOverlay: {
    default: '0 0 0 9999px rgba(255, 255, 255, 0.8)', // 加载遮罩：白色半透明遮罩
  },
} as const

// 层级阴影配置 - Material Design风格的dp（density-independent pixels）层级阴影系统
export const elevationShadows = {
  dp0: shadows.none, // dp0：无阴影，用于基础层级
  dp1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)', // dp1：轻微 elevation
  dp2: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)', // dp2：低 elevation
  dp3: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)', // dp3：中等 elevation
  dp4: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)', // dp4：明显 elevation
  dp6: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)', // dp6：较高 elevation
  dp8: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)', // dp8：高 elevation
  dp12: '0 17px 50px rgba(0, 0, 0, 0.19), 0 12px 15px rgba(0, 0, 0, 0.24)', // dp12：很高 elevation
  dp16: '0 24px 38px rgba(0, 0, 0, 0.14), 0 9px 46px rgba(0, 0, 0, 0.12)', // dp16：极高 elevation
  dp24: '0 32px 48px rgba(0, 0, 0, 0.18), 0 16px 24px rgba(0, 0, 0, 0.15)', // dp24：最高 elevation
} as const

// 主题阴影配置 - 针对浅色和深色主题优化的阴影效果
export const themeShadows = {
  light: {
    // 浅色主题阴影 - 使用较弱的阴影效果，适应浅色背景
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // 微弱阴影
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // 基础阴影
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // 中等阴影
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // 大阴影
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // 超大阴影
  },
  dark: {
    // 深色主题阴影 - 使用较强的阴影效果，适应深色背景
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)', // 微弱阴影
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3)', // 基础阴影
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)', // 中等阴影
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)', // 大阴影
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)', // 超大阴影
  },
} as const

// 阴影工具函数 - 提供便捷的阴影获取和处理功能

// 获取基础阴影 - 根据阴影大小名称返回对应的CSS阴影值
export const getShadow = (size: keyof typeof shadows): string => shadows[size]

// 获取组件阴影 - 根据组件名称和状态返回对应的阴影效果
export const getComponentShadow = (
  component: keyof typeof componentShadows, // 组件名称
  state: string = 'default' // 组件状态，默认为default
): string => {
  const componentShadow = componentShadows[component]
  return (
    componentShadow[state as keyof typeof componentShadow] ||
    componentShadow.default ||
    shadows.none
  )
}

// 获取层级阴影 - 根据Material Design的dp级别返回对应的阴影效果
export const getElevationShadow = (dp: keyof typeof elevationShadows): string =>
  elevationShadows[dp]

// 获取主题阴影 - 根据主题模式和阴影大小返回对应的阴影效果
export const getThemeShadow = (
  theme: 'light' | 'dark', // 主题模式
  size: keyof typeof themeShadows.light // 阴影大小
): string => themeShadows[theme][size]

// 动态阴影生成器 - 根据配置参数生成自定义阴影效果
export const createCustomShadow = (config: {
  x?: number // 水平偏移量，默认0
  y?: number // 垂直偏移量，默认0
  blur?: number // 模糊半径，默认0
  spread?: number // 扩散半径，默认0
  color?: string // 阴影颜色，默认rgba(0, 0, 0, 0.1)
  inset?: boolean // 是否为内阴影，默认false
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

// 阴影相关类型定义 - 定义阴影系统的TypeScript类型，确保类型安全

// 阴影大小类型 - 定义可用的基础阴影大小选项
export type ShadowSize = keyof typeof shadows

// 组件阴影类型 - 定义可用的组件阴影选项
export type ComponentShadowType = keyof typeof componentShadows

// 层级级别类型 - 定义可用的Material Design层级选项
export type ElevationLevel = keyof typeof elevationShadows

// 主题模式类型 - 定义可用的主题模式选项
export type ThemeMode = 'light' | 'dark'
