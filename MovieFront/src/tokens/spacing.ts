/**
 * 间距设计令牌 - 定义统一的间距系统
 * 基于数学比例关系，确保视觉一致性
 */

// 基础间距单位 (4px)
export const baseUnit = 4

// 间距系统 - 基于 4px 的倍数
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '2px', // 0.5 * baseUnit
  1: '4px', // 1 * baseUnit
  1.5: '6px', // 1.5 * baseUnit
  2: '8px', // 2 * baseUnit
  2.5: '10px', // 2.5 * baseUnit
  3: '12px', // 3 * baseUnit
  3.5: '14px', // 3.5 * baseUnit
  4: '16px', // 4 * baseUnit
  5: '20px', // 5 * baseUnit
  6: '24px', // 6 * baseUnit
  7: '28px', // 7 * baseUnit
  8: '32px', // 8 * baseUnit
  9: '36px', // 9 * baseUnit
  10: '40px', // 10 * baseUnit
  11: '44px', // 11 * baseUnit
  12: '48px', // 12 * baseUnit
  14: '56px', // 14 * baseUnit
  16: '64px', // 16 * baseUnit
  20: '80px', // 20 * baseUnit
  24: '96px', // 24 * baseUnit
  28: '112px', // 28 * baseUnit
  32: '128px', // 32 * baseUnit
  36: '144px', // 36 * baseUnit
  40: '160px', // 40 * baseUnit
  44: '176px', // 44 * baseUnit
  48: '192px', // 48 * baseUnit
  52: '208px', // 52 * baseUnit
  56: '224px', // 56 * baseUnit
  60: '240px', // 60 * baseUnit
  64: '256px', // 64 * baseUnit
  72: '288px', // 72 * baseUnit
  80: '320px', // 80 * baseUnit
  96: '384px', // 96 * baseUnit
} as const

// 语义化间距
export const semanticSpacing = {
  // 组件内部间距
  component: {
    xs: spacing[1], // 4px
    sm: spacing[2], // 8px
    md: spacing[4], // 16px
    lg: spacing[6], // 24px
    xl: spacing[8], // 32px
  },

  // 元素间间距
  element: {
    xs: spacing[2], // 8px
    sm: spacing[4], // 16px
    md: spacing[6], // 24px
    lg: spacing[8], // 32px
    xl: spacing[12], // 48px
  },

  // 区块间距
  section: {
    xs: spacing[8], // 32px
    sm: spacing[12], // 48px
    md: spacing[16], // 64px
    lg: spacing[20], // 80px
    xl: spacing[24], // 96px
  },

  // 布局间距
  layout: {
    xs: spacing[16], // 64px
    sm: spacing[20], // 80px
    md: spacing[24], // 96px
    lg: spacing[32], // 128px
    xl: spacing[40], // 160px
  },

  // 页面边距
  container: {
    xs: spacing[4], // 16px
    sm: spacing[6], // 24px
    md: spacing[8], // 32px
    lg: spacing[12], // 48px
    xl: spacing[16], // 64px
  },
} as const

// 特殊间距
export const specialSpacing = {
  // 图标与文字间距
  iconText: spacing[2], // 8px

  // 按钮内间距
  buttonPadding: {
    xs: `${spacing[1]} ${spacing[2]}`, // 4px 8px
    sm: `${spacing[2]} ${spacing[3]}`, // 8px 12px
    md: `${spacing[2.5]} ${spacing[4]}`, // 10px 16px
    lg: `${spacing[3]} ${spacing[6]}`, // 12px 24px
    xl: `${spacing[4]} ${spacing[8]}`, // 16px 32px
  },

  // 输入框内间距
  inputPadding: {
    sm: `${spacing[2]} ${spacing[3]}`, // 8px 12px
    md: `${spacing[2.5]} ${spacing[4]}`, // 10px 16px
    lg: `${spacing[3]} ${spacing[5]}`, // 12px 20px
  },

  // 卡片内间距
  cardPadding: {
    sm: spacing[4], // 16px
    md: spacing[6], // 24px
    lg: spacing[8], // 32px
  },

  // 列表项间距
  listItemPadding: {
    sm: `${spacing[2]} ${spacing[4]}`, // 8px 16px
    md: `${spacing[3]} ${spacing[6]}`, // 12px 24px
    lg: `${spacing[4]} ${spacing[8]}`, // 16px 32px
  },
} as const

// 响应式间距
export const responsiveSpacing = {
  // 移动端优先间距
  mobile: {
    component: semanticSpacing.component,
    element: semanticSpacing.element,
    section: semanticSpacing.section,
    layout: semanticSpacing.layout,
    container: semanticSpacing.container,
  },

  // 平板间距
  tablet: {
    component: {
      xs: spacing[2], // 8px
      sm: spacing[4], // 16px
      md: spacing[6], // 24px
      lg: spacing[8], // 32px
      xl: spacing[12], // 48px
    },
    element: {
      xs: spacing[4], // 16px
      sm: spacing[6], // 24px
      md: spacing[8], // 32px
      lg: spacing[12], // 48px
      xl: spacing[16], // 64px
    },
    section: {
      xs: spacing[12], // 48px
      sm: spacing[16], // 64px
      md: spacing[20], // 80px
      lg: spacing[24], // 96px
      xl: spacing[32], // 128px
    },
    layout: {
      xs: spacing[20], // 80px
      sm: spacing[24], // 96px
      md: spacing[32], // 128px
      lg: spacing[40], // 160px
      xl: spacing[48], // 192px
    },
    container: {
      xs: spacing[6], // 24px
      sm: spacing[8], // 32px
      md: spacing[12], // 48px
      lg: spacing[16], // 64px
      xl: spacing[20], // 80px
    },
  },

  // 桌面间距
  desktop: {
    component: semanticSpacing.component,
    element: semanticSpacing.element,
    section: semanticSpacing.section,
    layout: semanticSpacing.layout,
    container: semanticSpacing.container,
  },
} as const

// 间距工具函数
export const getSpacing = (value: keyof typeof spacing): string =>
  spacing[value]

export const getSemanticSpacing = (
  category: keyof typeof semanticSpacing,
  size: keyof typeof semanticSpacing.element
): string => semanticSpacing[category][size]

export const getResponsiveSpacing = (
  breakpoint: keyof typeof responsiveSpacing,
  category: keyof typeof responsiveSpacing.mobile,
  size: keyof typeof responsiveSpacing.mobile.element
): string => responsiveSpacing[breakpoint][category][size]

export type SpacingValue = keyof typeof spacing
export type SemanticSpacingCategory = keyof typeof semanticSpacing
export type SemanticSpacingSize = keyof typeof semanticSpacing.element
export type ResponsiveBreakpoint = keyof typeof responsiveSpacing
