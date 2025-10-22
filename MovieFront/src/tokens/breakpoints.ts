/**
 * @fileoverview 响应式断点设计令牌配置
 * @description 响应式断点设计令牌系统定义，包括断点定义、媒体查询、响应式布局等
 *              完整的响应式系统配置，提供预设断点组合、媒体查询工具和响应式布局方案，
 *              支持移动端优先的响应式设计理念，确保整个应用在不同设备上的一致体验
 * @created 2025-10-21 15:17:14
 * @updated 2025-10-21 15:17:14
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 响应式断点定义 - 定义各种屏幕尺寸断点，支持移动端优先的响应式设计
export const breakpoints = {
  xs: '0px', // 超小屏幕断点 - 手机竖屏 (320px+)
  sm: '640px', // 小屏幕断点 - 手机横屏 (640px+)
  md: '768px', // 中等屏幕断点 - 平板竖屏 (768px+)
  lg: '1024px', // 大屏幕断点 - 平板横屏/小笔记本 (1024px+)
  xl: '1280px', // 超大屏幕断点 - 桌面显示器 (1280px+)
  '2xl': '1536px', // 2倍超大屏幕断点 - 大桌面显示器 (1536px+)
} as const

// 媒体查询配置 - 定义各种媒体查询条件，用于响应式布局和样式适配
export const mediaQueries = {
  // 最小宽度查询 - 从指定断点开始生效的媒体查询
  up: {
    xs: `(min-width: ${breakpoints.xs})`, // 超小屏幕及以上
    sm: `(min-width: ${breakpoints.sm})`, // 小屏幕及以上
    md: `(min-width: ${breakpoints.md})`, // 中等屏幕及以上
    lg: `(min-width: ${breakpoints.lg})`, // 大屏幕及以上
    xl: `(min-width: ${breakpoints.xl})`, // 超大屏幕及以上
    '2xl': `(min-width: ${breakpoints['2xl']})`, // 2倍超大屏幕及以上
  },

  // 最大宽度查询 - 到指定断点为止生效的媒体查询
  down: {
    xs: `(max-width: ${parseInt(breakpoints.sm) - 1}px)`, // 仅超小屏幕
    sm: `(max-width: ${parseInt(breakpoints.md) - 1}px)`, // 小屏幕及以下
    md: `(max-width: ${parseInt(breakpoints.lg) - 1}px)`, // 中等屏幕及以下
    lg: `(max-width: ${parseInt(breakpoints.xl) - 1}px)`, // 大屏幕及以下
    xl: `(max-width: ${parseInt(breakpoints['2xl']) - 1}px)`, // 超大屏幕及以下
  },

  // 范围查询 - 仅在指定断点范围内生效的媒体查询
  only: {
    xs: `(min-width: ${breakpoints.xs}) and (max-width: ${parseInt(breakpoints.sm) - 1}px)`, // 仅超小屏幕
    sm: `(min-width: ${breakpoints.sm}) and (max-width: ${parseInt(breakpoints.md) - 1}px)`, // 仅小屏幕
    md: `(min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg) - 1}px)`, // 仅中等屏幕
    lg: `(min-width: ${breakpoints.lg}) and (max-width: ${parseInt(breakpoints.xl) - 1}px)`, // 仅大屏幕
    xl: `(min-width: ${breakpoints.xl}) and (max-width: ${parseInt(breakpoints['2xl']) - 1}px)`, // 仅超大屏幕
  },

  // 屏幕方向查询 - 根据设备方向应用不同样式
  orientation: {
    portrait: '(orientation: portrait)', // 竖屏方向
    landscape: '(orientation: landscape)', // 横屏方向
  },

  // 设备类型查询 - 根据设备类型应用不同样式
  device: {
    mobile: `(max-width: ${breakpoints.md})`, // 移动设备
    tablet: `(min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.lg})`, // 平板设备
    desktop: `(min-width: ${breakpoints.lg})`, // 桌面设备
  },

  // 屏幕分辨率查询 - 根据屏幕分辨率应用不同样式
  resolution: {
    retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)', // 高分辨率屏幕
    standard: '(-webkit-max-device-pixel-ratio: 1), (max-resolution: 191dpi)', // 标准分辨率屏幕
  },

  // 主题偏好查询 - 根据用户主题偏好应用不同样式
  theme: {
    light: '(prefers-color-scheme: light)', // 浅色主题偏好
    dark: '(prefers-color-scheme: dark)', // 深色主题偏好
    noPreference: '(prefers-color-scheme: no-preference)', // 无主题偏好
  },

  // 动画偏好查询 - 根据用户动画偏好应用不同样式
  motion: {
    reduce: '(prefers-reduced-motion: reduce)', // 减少动画偏好
    noPreference: '(prefers-reduced-motion: no-preference)', // 无动画偏好
  },

  // 交互模式查询 - 根据用户交互方式应用不同样式
  interaction: {
    hover: '(hover: hover)', // 支持悬停交互
    none: '(hover: none)', // 不支持悬停交互
    coarse: '(pointer: coarse)', // 粗精度指针（触摸）
    fine: '(pointer: fine)', // 精精度指针（鼠标）
  },
} as const

// 响应式容器最大宽度配置 - 定义各断点下容器的最大宽度，确保内容在大屏幕上的可读性
export const containerMaxWidths = {
  xs: '100%', // 超小屏幕容器宽度
  sm: '640px', // 小屏幕容器宽度
  md: '768px', // 中等屏幕容器宽度
  lg: '1024px', // 大屏幕容器宽度
  xl: '1280px', // 超大屏幕容器宽度
  '2xl': '1536px', // 2倍超大屏幕容器宽度
} as const

// 网格系统配置 - 定义基础网格列数选项，支持12列网格系统
export const gridColumns = {
  1: 'grid-cols-1', // 1列布局
  2: 'grid-cols-2', // 2列布局
  3: 'grid-cols-3', // 3列布局
  4: 'grid-cols-4', // 4列布局
  5: 'grid-cols-5', // 5列布局
  6: 'grid-cols-6', // 6列布局
  7: 'grid-cols-7', // 7列布局
  8: 'grid-cols-8', // 8列布局
  9: 'grid-cols-9', // 9列布局
  10: 'grid-cols-10', // 10列布局
  11: 'grid-cols-11', // 11列布局
  12: 'grid-cols-12', // 12列布局
  none: 'grid-cols-none', // 无网格布局
} as const

// 响应式网格配置 - 定义特定业务场景的响应式网格布局方案
export const responsiveGrids = {
  // 电影内容网格 - 适用于电影海报、影片卡片等内容的网格布局
  movieGrid: {
    xs: 'grid-cols-2', // 超小屏幕：2列
    sm: 'grid-cols-3', // 小屏幕：3列
    md: 'grid-cols-4', // 中等屏幕：4列
    lg: 'grid-cols-5', // 大屏幕：5列
    xl: 'grid-cols-6', // 超大屏幕：6列
    '2xl': 'grid-cols-7', // 2倍超大屏幕：7列
  },

  // 卡片内容网格 - 适用于通用卡片、信息卡片等内容的网格布局
  cardGrid: {
    xs: 'grid-cols-1', // 超小屏幕：1列
    sm: 'grid-cols-2', // 小屏幕：2列
    md: 'grid-cols-3', // 中等屏幕：3列
    lg: 'grid-cols-4', // 大屏幕：4列
    xl: 'grid-cols-4', // 超大屏幕：4列
    '2xl': 'grid-cols-5', // 2倍超大屏幕：5列
  },

  // 侧边栏布局网格 - 适用于包含侧边栏的页面布局
  sidebarLayout: {
    mobile: 'grid-cols-1', // 移动端：单列布局
    desktop: 'grid-cols-4', // 桌面端：4列布局（侧边栏+内容）
  },

  // 内容区域网格 - 适用于主要内容区域的网格布局
  contentLayout: {
    xs: 'grid-cols-1', // 超小屏幕：1列
    md: 'grid-cols-3', // 中等屏幕：3列
    lg: 'grid-cols-4', // 大屏幕：4列
  },
} as const

// 响应式间距配置 - 定义各断点下的内边距、外边距和间隙配置
export const responsiveSpacings = {
  padding: {
    xs: 'p-2', // 超小屏幕内边距
    sm: 'p-4', // 小屏幕内边距
    md: 'p-6', // 中等屏幕内边距
    lg: 'p-8', // 大屏幕内边距
    xl: 'p-10', // 超大屏幕内边距
    '2xl': 'p-12', // 2倍超大屏幕内边距
  },
  margin: {
    xs: 'm-2', // 超小屏幕外边距
    sm: 'm-4', // 小屏幕外边距
    md: 'm-6', // 中等屏幕外边距
    lg: 'm-8', // 大屏幕外边距
    xl: 'm-10', // 超大屏幕外边距
    '2xl': 'm-12', // 2倍超大屏幕外边距
  },
  gap: {
    xs: 'gap-2', // 超小屏幕间隙
    sm: 'gap-4', // 小屏幕间隙
    md: 'gap-6', // 中等屏幕间隙
    lg: 'gap-8', // 大屏幕间隙
    xl: 'gap-10', // 超大屏幕间隙
    '2xl': 'gap-12', // 2倍超大屏幕间隙
  },
} as const

// 响应式字体大小配置 - 定义各断点下不同文本类型的字体大小
export const responsiveFontSizes = {
  heading: {
    xs: 'text-xl', // 超小屏幕标题字体
    sm: 'text-2xl', // 小屏幕标题字体
    md: 'text-3xl', // 中等屏幕标题字体
    lg: 'text-4xl', // 大屏幕标题字体
    xl: 'text-5xl', // 超大屏幕标题字体
    '2xl': 'text-6xl', // 2倍超大屏幕标题字体
  },
  body: {
    xs: 'text-sm', // 超小屏幕正文字体
    sm: 'text-base', // 小屏幕正文字体
    md: 'text-base', // 中等屏幕正文字体
    lg: 'text-lg', // 大屏幕正文字体
    xl: 'text-lg', // 超大屏幕正文字体
    '2xl': 'text-xl', // 2倍超大屏幕正文字体
  },
  caption: {
    xs: 'text-xs', // 超小屏幕说明文字字体
    sm: 'text-xs', // 小屏幕说明文字字体
    md: 'text-sm', // 中等屏幕说明文字字体
    lg: 'text-sm', // 大屏幕说明文字字体
    xl: 'text-base', // 超大屏幕说明文字字体
    '2xl': 'text-base', // 2倍超大屏幕说明文字字体
  },
} as const

// 断点工具函数 - 提供便捷的断点值获取和媒体查询生成功能

// 获取断点值 - 根据断点名称返回对应的CSS值
export const getBreakpoint = (size: keyof typeof breakpoints): string =>
  breakpoints[size]

// 获取媒体查询 - 根据媒体查询类型和尺寸返回对应的媒体查询字符串
export const getMediaQuery = (
  type: keyof typeof mediaQueries,
  size?: string
): string => {
  const querySet = mediaQueries[type]
  return size ? querySet[size as keyof typeof querySet] : ''
}

// 获取响应式网格配置 - 根据布局名称返回对应的网格配置
export const getResponsiveGrid = (
  layout: keyof typeof responsiveGrids
): (typeof responsiveGrids)[keyof typeof responsiveGrids] =>
  responsiveGrids[layout]

// 生成响应式类名 - 将断点配置转换为Tailwind CSS的响应式类名字符串
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

// 创建响应式配置 - 为响应式Hook提供辅助函数，自动处理断点间的值继承
export const createResponsiveConfig = <T>(config: {
  xs?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
  '2xl'?: T
}): Record<keyof typeof breakpoints, T> => {
  const result = {} as Record<keyof typeof breakpoints, T>

  // 设置默认值 - 自动向上继承未定义断点的值
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

// 响应式相关类型定义 - 定义响应式系统的TypeScript类型，确保类型安全

// 断点类型 - 定义可用的断点选项
export type Breakpoint = keyof typeof breakpoints

// 媒体查询类型 - 定义可用的媒体查询类型选项
export type MediaType = keyof typeof mediaQueries

// 网格布局类型 - 定义可用的网格布局选项
export type GridLayout = keyof typeof responsiveGrids

// 容器尺寸类型 - 定义可用的容器尺寸选项
export type ContainerSize = keyof typeof containerMaxWidths
