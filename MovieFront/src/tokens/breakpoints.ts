/**
 * 响应式断点设计令牌 - 定义断点系统
 * 支持移动端优先的响应式设计
 */

// 断点定义
export const breakpoints = {
  xs: '0px', // 超小屏幕 (手机竖屏)
  sm: '640px', // 小屏幕 (手机横屏)
  md: '768px', // 中等屏幕 (平板竖屏)
  lg: '1024px', // 大屏幕 (平板横屏/小笔记本)
  xl: '1280px', // 超大屏幕 (桌面)
  '2xl': '1536px', // 2倍超大屏幕 (大桌面)
} as const

// 媒体查询
export const mediaQueries = {
  // 最小宽度查询 (min-width)
  up: {
    xs: `(min-width: ${breakpoints.xs})`,
    sm: `(min-width: ${breakpoints.sm})`,
    md: `(min-width: ${breakpoints.md})`,
    lg: `(min-width: ${breakpoints.lg})`,
    xl: `(min-width: ${breakpoints.xl})`,
    '2xl': `(min-width: ${breakpoints['2xl']})`,
  },

  // 最大宽度查询 (max-width)
  down: {
    xs: `(max-width: ${parseInt(breakpoints.sm) - 1}px)`,
    sm: `(max-width: ${parseInt(breakpoints.md) - 1}px)`,
    md: `(max-width: ${parseInt(breakpoints.lg) - 1}px)`,
    lg: `(max-width: ${parseInt(breakpoints.xl) - 1}px)`,
    xl: `(max-width: ${parseInt(breakpoints['2xl']) - 1}px)`,
  },

  // 范围查询 (min-width and max-width)
  only: {
    xs: `(min-width: ${breakpoints.xs}) and (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
    sm: `(min-width: ${breakpoints.sm}) and (max-width: ${parseInt(breakpoints.md) - 1}px)`,
    md: `(min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
    lg: `(min-width: ${breakpoints.lg}) and (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
    xl: `(min-width: ${breakpoints.xl}) and (max-width: ${parseInt(breakpoints['2xl']) - 1}px)`,
  },

  // 方向查询
  orientation: {
    portrait: '(orientation: portrait)',
    landscape: '(orientation: landscape)',
  },

  // 设备类型查询
  device: {
    mobile: `(max-width: ${breakpoints.md})`,
    tablet: `(min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.lg})`,
    desktop: `(min-width: ${breakpoints.lg})`,
  },

  // 高分辨率查询
  resolution: {
    retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
    standard: '(-webkit-max-device-pixel-ratio: 1), (max-resolution: 191dpi)',
  },

  // 主题查询
  theme: {
    light: '(prefers-color-scheme: light)',
    dark: '(prefers-color-scheme: dark)',
    noPreference: '(prefers-color-scheme: no-preference)',
  },

  // 动画偏好查询
  motion: {
    reduce: '(prefers-reduced-motion: reduce)',
    noPreference: '(prefers-reduced-motion: no-preference)',
  },

  // 交互模式查询
  interaction: {
    hover: '(hover: hover)',
    none: '(hover: none)',
    coarse: '(pointer: coarse)',
    fine: '(pointer: fine)',
  },
} as const

// 响应式容器最大宽度
export const containerMaxWidths = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// 网格系统
export const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
  none: 'grid-cols-none',
} as const

// 响应式网格配置
export const responsiveGrids = {
  // 电影网格
  movieGrid: {
    xs: 'grid-cols-2',
    sm: 'grid-cols-3',
    md: 'grid-cols-4',
    lg: 'grid-cols-5',
    xl: 'grid-cols-6',
    '2xl': 'grid-cols-7',
  },

  // 卡片网格
  cardGrid: {
    xs: 'grid-cols-1',
    sm: 'grid-cols-2',
    md: 'grid-cols-3',
    lg: 'grid-cols-4',
    xl: 'grid-cols-4',
    '2xl': 'grid-cols-5',
  },

  // 侧边栏布局
  sidebarLayout: {
    mobile: 'grid-cols-1',
    desktop: 'grid-cols-4',
  },

  // 内容区域
  contentLayout: {
    xs: 'grid-cols-1',
    md: 'grid-cols-3',
    lg: 'grid-cols-4',
  },
} as const

// 响应式间距
export const responsiveSpacings = {
  padding: {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
    '2xl': 'p-12',
  },
  margin: {
    xs: 'm-2',
    sm: 'm-4',
    md: 'm-6',
    lg: 'm-8',
    xl: 'm-10',
    '2xl': 'm-12',
  },
  gap: {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
    '2xl': 'gap-12',
  },
} as const

// 响应式字体大小
export const responsiveFontSizes = {
  heading: {
    xs: 'text-xl',
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
    '2xl': 'text-6xl',
  },
  body: {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-lg',
    '2xl': 'text-xl',
  },
  caption: {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-sm',
    xl: 'text-base',
    '2xl': 'text-base',
  },
} as const

// 断点工具函数
export const getBreakpoint = (size: keyof typeof breakpoints): string =>
  breakpoints[size]

export const getMediaQuery = (
  type: keyof typeof mediaQueries,
  size?: string
): string => {
  const querySet = mediaQueries[type]
  return size ? querySet[size as keyof typeof querySet] : ''
}

export const getResponsiveGrid = (
  layout: keyof typeof responsiveGrids
): (typeof responsiveGrids)[keyof typeof responsiveGrids] =>
  responsiveGrids[layout]

export const getResponsiveClass = (
  classes: Record<keyof typeof breakpoints, string>
): string => {
  return Object.entries(classes)
    .map(([breakpoint, className]) => {
      if (breakpoint === 'xs') return className
      return `${breakpoint}:${className}`
    })
    .join(' ')
}

// 响应式Hook辅助函数
export const createResponsiveConfig = <T>(config: {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
}): Record<keyof typeof breakpoints, T> => {
  const result = {} as Record<keyof typeof breakpoints, T>

  // 设置默认值
  let lastValue: T | undefined
  for (const bp of ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const) {
    if (config[bp] !== undefined) {
      lastValue = config[bp]
    }
    if (lastValue !== undefined) {
      result[bp] = lastValue
    }
  }

  return result
}

export type Breakpoint = keyof typeof breakpoints
export type MediaType = keyof typeof mediaQueries
export type GridLayout = keyof typeof responsiveGrids
export type ContainerSize = keyof typeof containerMaxWidths
