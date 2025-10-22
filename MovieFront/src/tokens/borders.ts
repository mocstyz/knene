/**
 * @fileoverview 边框设计令牌配置
 * @description 边框设计令牌系统定义，包括边框圆角、边框宽度、边框样式、边框预设等
 *              完整的边框系统配置，提供预设边框组合、组件边框和工具函数，确保
 *              整个应用的边框效果一致性和可维护性
 * @created 2025-10-21 15:17:14
 * @updated 2025-10-21 15:17:14
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 边框圆角配置 - 定义各种圆角大小选项，用于控制元素的圆角效果
export const borderRadius = {
  none: '0', // 无圆角
  sm: '0.125rem', // 小圆角 - 2px
  base: '0.25rem', // 基础圆角 - 4px
  md: '0.375rem', // 中等圆角 - 6px
  lg: '0.5rem', // 大圆角 - 8px
  xl: '0.75rem', // 超大圆角 - 12px
  '2xl': '1rem', // 2倍超大圆角 - 16px
  '3xl': '1.5rem', // 3倍超大圆角 - 24px
  full: '9999px', // 完全圆角 - 用于圆形元素
} as const

// 边框宽度配置 - 定义各种边框宽度选项，用于控制边框的粗细
export const borderWidths = {
  0: '0', // 无边框
  1: '1px', // 细边框
  2: '2px', // 标准边框
  4: '4px', // 粗边框
  8: '8px', // 超粗边框
} as const

// 边框样式配置 - 定义各种边框样式选项，用于控制边框的视觉效果
export const borderStyles = {
  solid: 'solid', // 实线边框
  dashed: 'dashed', // 虚线边框
  dotted: 'dotted', // 点线边框
  double: 'double', // 双线边框
  groove: 'groove', // 凹槽边框
  ridge: 'ridge', // 脊线边框
  inset: 'inset', // 内嵌边框
  outset: 'outset', // 外凸边框
} as const

// 预设边框组合配置 - 定义常用的边框组合，提供快速应用预定义边框效果的选项
export const borderPresets = {
  // 无边框组合 - 完全透明的边框设置
  none: {
    width: borderWidths[0],
    style: borderStyles.solid,
    radius: borderRadius.none,
  },

  // 细边框组合 - 轻量级的边框效果
  thin: {
    width: borderWidths[1],
    style: borderStyles.solid,
    radius: borderRadius.base,
  },

  // 标准边框组合 - 默认的边框效果
  base: {
    width: borderWidths[1],
    style: borderStyles.solid,
    radius: borderRadius.md,
  },

  // 粗边框组合 - 突出的边框效果
  thick: {
    width: borderWidths[2],
    style: borderStyles.solid,
    radius: borderRadius.lg,
  },

  // 圆角边框组合 - 大圆角的边框效果
  rounded: {
    width: borderWidths[1],
    style: borderStyles.solid,
    radius: borderRadius.xl,
  },

  // 胶囊边框组合 - 完全圆角的边框效果
  pill: {
    width: borderWidths[1],
    style: borderStyles.solid,
    radius: borderRadius.full,
  },
} as const

// 组件边框样式配置 - 定义特定组件的边框样式，确保不同组件的边框效果一致
export const componentBorders = {
  // 按钮组件边框 - 定义按钮的各种边框状态
  button: {
    default: {
      width: borderWidths[0],
      style: borderStyles.solid,
      radius: borderRadius.lg,
    },
    outline: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.lg,
    },
  },

  // 输入框组件边框 - 定义输入框的各种边框状态
  input: {
    default: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.lg,
    },
    filled: {
      width: borderWidths[0],
      style: borderStyles.solid,
      radius: borderRadius.lg,
    },
    outline: {
      width: borderWidths[2],
      style: borderStyles.solid,
      radius: borderRadius.lg,
    },
  },

  // 卡片组件边框 - 定义卡片的各种边框状态
  card: {
    default: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.lg,
    },
    elevated: {
      width: borderWidths[0],
      style: borderStyles.solid,
      radius: borderRadius.xl,
    },
  },

  // 模态框组件边框 - 定义模态框的边框样式
  modal: {
    default: {
      width: borderWidths[0],
      style: borderStyles.solid,
      radius: borderRadius.xl,
    },
  },

  // 下拉菜单组件边框 - 定义下拉菜单的边框样式
  dropdown: {
    default: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.lg,
    },
  },

  // 标签组件边框 - 定义标签的边框样式
  badge: {
    default: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.full,
    },
  },

  // 头像组件边框 - 定义头像的边框样式
  avatar: {
    default: {
      width: borderWidths[2],
      style: borderStyles.solid,
      radius: borderRadius.full,
    },
  },
} as const

// 轮廓线配置 - 定义各种轮廓线样式，主要用于焦点状态和强调效果
export const outlines = {
  none: 'none', // 无轮廓线
  solid: '2px solid transparent', // 透明实线轮廓
  focus: '2px solid', // 焦点轮廓线
  dotted: '2px dotted', // 点线轮廓线
} as const

// 边框工具函数 - 提供便捷的边框样式获取和处理功能

// 获取边框圆角值 - 根据圆角尺寸名称返回对应的CSS值
export const getBorderRadius = (size: keyof typeof borderRadius): string =>
  borderRadius[size]

// 获取边框宽度值 - 根据边框宽度名称返回对应的CSS值
export const getBorderWidth = (width: keyof typeof borderWidths): string =>
  borderWidths[width]

// 获取边框预设组合 - 根据预设名称返回完整的边框配置
export const getBorderPreset = (
  preset: keyof typeof borderPresets
): (typeof borderPresets)[keyof typeof borderPresets] => borderPresets[preset]

// 获取组件边框配置 - 根据组件名称和变体返回对应的边框配置
export const getComponentBorder = (
  component: keyof typeof componentBorders,
  variant?: string
): any => {
  const borders = componentBorders[component]
  return variant
    ? borders[variant as keyof typeof borders]
    : borders.default || Object.values(borders)[0]
}

// 边框相关类型定义 - 定义边框系统的TypeScript类型，确保类型安全

// 边框圆角类型 - 定义可用的边框圆角选项
export type BorderRadius = keyof typeof borderRadius

// 边框宽度类型 - 定义可用的边框宽度选项
export type BorderWidth = keyof typeof borderWidths

// 边框样式类型 - 定义可用的边框样式选项
export type BorderStyle = keyof typeof borderStyles

// 边框预设类型 - 定义可用的边框预设组合选项
export type BorderPreset = keyof typeof borderPresets

// 组件边框类型 - 定义可用的组件边框类型选项
export type ComponentBorderType = keyof typeof componentBorders
