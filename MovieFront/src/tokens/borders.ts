/**
 * 边框设计令牌 - 定义边框系统
 * 包括圆角、边框宽度、边框样式等
 */

// 圆角系统
export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  base: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px', // 完全圆角
} as const

// 边框宽度
export const borderWidths = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const

// 边框样式
export const borderStyles = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
  double: 'double',
  groove: 'groove',
  ridge: 'ridge',
  inset: 'inset',
  outset: 'outset',
} as const

// 预设边框组合
export const borderPresets = {
  // 无边框
  none: {
    width: borderWidths[0],
    style: borderStyles.solid,
    radius: borderRadius.none,
  },

  // 细边框
  thin: {
    width: borderWidths[1],
    style: borderStyles.solid,
    radius: borderRadius.base,
  },

  // 标准边框
  base: {
    width: borderWidths[1],
    style: borderStyles.solid,
    radius: borderRadius.md,
  },

  // 粗边框
  thick: {
    width: borderWidths[2],
    style: borderStyles.solid,
    radius: borderRadius.lg,
  },

  // 圆角边框
  rounded: {
    width: borderWidths[1],
    style: borderStyles.solid,
    radius: borderRadius.xl,
  },

  // 完全圆角
  pill: {
    width: borderWidths[1],
    style: borderStyles.solid,
    radius: borderRadius.full,
  },
} as const

// 组件边框样式
export const componentBorders = {
  // 按钮边框
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

  // 输入框边框
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

  // 卡片边框
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

  // 模态框边框
  modal: {
    default: {
      width: borderWidths[0],
      style: borderStyles.solid,
      radius: borderRadius.xl,
    },
  },

  // 下拉菜单边框
  dropdown: {
    default: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.lg,
    },
  },

  // 标签边框
  badge: {
    default: {
      width: borderWidths[1],
      style: borderStyles.solid,
      radius: borderRadius.full,
    },
  },

  // 头像边框
  avatar: {
    default: {
      width: borderWidths[2],
      style: borderStyles.solid,
      radius: borderRadius.full,
    },
  },
} as const

// 轮廓线（Outline）
export const outlines = {
  none: 'none',
  solid: '2px solid transparent',
  focus: '2px solid',
  dotted: '2px dotted',
} as const

// 边框工具函数
export const getBorderRadius = (size: keyof typeof borderRadius): string =>
  borderRadius[size]

export const getBorderWidth = (width: keyof typeof borderWidths): string =>
  borderWidths[width]

export const getBorderPreset = (
  preset: keyof typeof borderPresets
): (typeof borderPresets)[keyof typeof borderPresets] => borderPresets[preset]

export const getComponentBorder = (
  component: keyof typeof componentBorders,
  variant?: string
): any => {
  const borders = componentBorders[component]
  return variant
    ? borders[variant as keyof typeof borders]
    : borders.default || Object.values(borders)[0]
}

export type BorderRadius = keyof typeof borderRadius
export type BorderWidth = keyof typeof borderWidths
export type BorderStyle = keyof typeof borderStyles
export type BorderPreset = keyof typeof borderPresets
export type ComponentBorderType = keyof typeof componentBorders
