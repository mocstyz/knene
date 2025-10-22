/**
 * @fileoverview 间距设计令牌配置
 * @description 间距设计令牌系统定义，包括基础间距、语义化间距、特殊间距和响应式间距等
 *              基于4px基础单位的数学比例关系，确保视觉一致性和和谐的间距体系
 *              提供完整的间距工具函数，确保整个应用的间距效果一致性和布局美观
 * @created 2025-10-21 15:17:14
 * @updated 2025-10-21 15:17:14
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 基础间距单位定义 - 整个间距系统的最小单位，基于4px的数学比例关系
export const baseUnit = 4 // 基础间距单位：4px

// 基础间距系统配置 - 基于4px倍数的完整间距值体系，提供精确的间距控制
export const spacing = {
  0: '0', // 无间距
  px: '1px', // 1像素间距，用于细微调整
  0.5: '2px', // 0.5倍基础单位 - 2px
  1: '4px', // 1倍基础单位 - 4px
  1.5: '6px', // 1.5倍基础单位 - 6px
  2: '8px', // 2倍基础单位 - 8px
  2.5: '10px', // 2.5倍基础单位 - 10px
  3: '12px', // 3倍基础单位 - 12px
  3.5: '14px', // 3.5倍基础单位 - 14px
  4: '16px', // 4倍基础单位 - 16px
  5: '20px', // 5倍基础单位 - 20px
  6: '24px', // 6倍基础单位 - 24px
  7: '28px', // 7倍基础单位 - 28px
  8: '32px', // 8倍基础单位 - 32px
  9: '36px', // 9倍基础单位 - 36px
  10: '40px', // 10倍基础单位 - 40px
  11: '44px', // 11倍基础单位 - 44px
  12: '48px', // 12倍基础单位 - 48px
  14: '56px', // 14倍基础单位 - 56px
  16: '64px', // 16倍基础单位 - 64px
  20: '80px', // 20倍基础单位 - 80px
  24: '96px', // 24倍基础单位 - 96px
  28: '112px', // 28倍基础单位 - 112px
  32: '128px', // 32倍基础单位 - 128px
  36: '144px', // 36倍基础单位 - 144px
  40: '160px', // 40倍基础单位 - 160px
  44: '176px', // 44倍基础单位 - 176px
  48: '192px', // 48倍基础单位 - 192px
  52: '208px', // 52倍基础单位 - 208px
  56: '224px', // 56倍基础单位 - 224px
  60: '240px', // 60倍基础单位 - 240px
  64: '256px', // 64倍基础单位 - 256px
  72: '288px', // 72倍基础单位 - 288px
  80: '320px', // 80倍基础单位 - 320px
  96: '384px', // 96倍基础单位 - 384px
} as const

// 语义化间距配置 - 按使用场景分类的间距系统，提供直观的间距选择
export const semanticSpacing = {
  // 组件内部间距 - 用于组件内部元素之间的间距
  component: {
    xs: spacing[1], // 超小组件间距 - 4px
    sm: spacing[2], // 小组件间距 - 8px
    md: spacing[4], // 中等组件间距 - 16px
    lg: spacing[6], // 大组件间距 - 24px
    xl: spacing[8], // 超大组件间距 - 32px
  },

  // 元素间间距 - 用于独立元素之间的间距
  element: {
    xs: spacing[2], // 超小元素间距 - 8px
    sm: spacing[4], // 小元素间距 - 16px
    md: spacing[6], // 中等元素间距 - 24px
    lg: spacing[8], // 大元素间距 - 32px
    xl: spacing[12], // 超大元素间距 - 48px
  },

  // 区块间距 - 用于内容区块之间的间距
  section: {
    xs: spacing[8], // 超小区块间距 - 32px
    sm: spacing[12], // 小区块间距 - 48px
    md: spacing[16], // 中等区块间距 - 64px
    lg: spacing[20], // 大区块间距 - 80px
    xl: spacing[24], // 超大区块间距 - 96px
  },

  // 布局间距 - 用于页面布局的主要间距
  layout: {
    xs: spacing[16], // 超小布局间距 - 64px
    sm: spacing[20], // 小布局间距 - 80px
    md: spacing[24], // 中等布局间距 - 96px
    lg: spacing[32], // 大布局间距 - 128px
    xl: spacing[40], // 超大布局间距 - 160px
  },

  // 页面边距 - 用于页面容器的边距设置
  container: {
    xs: spacing[4], // 超小页面边距 - 16px
    sm: spacing[6], // 小页面边距 - 24px
    md: spacing[8], // 中等页面边距 - 32px
    lg: spacing[12], // 大页面边距 - 48px
    xl: spacing[16], // 超大页面边距 - 64px
  },
} as const

// 特殊间距配置 - 针对特定组件和场景的专用间距设置
export const specialSpacing = {
  // 图标与文字间距 - 图标和文字之间的标准间距
  iconText: spacing[2], // 图标文字间距 - 8px

  // 按钮内间距配置 - 按钮组件的内边距设置，确保按钮的视觉平衡
  buttonPadding: {
    xs: `${spacing[1]} ${spacing[2]}`, // 超小按钮内边距 - 4px 8px
    sm: `${spacing[2]} ${spacing[3]}`, // 小按钮内边距 - 8px 12px
    md: `${spacing[2.5]} ${spacing[4]}`, // 中等按钮内边距 - 10px 16px
    lg: `${spacing[3]} ${spacing[6]}`, // 大按钮内边距 - 12px 24px
    xl: `${spacing[4]} ${spacing[8]}`, // 超大按钮内边距 - 16px 32px
  },

  // 输入框内间距配置 - 输入框组件的内边距设置，确保文字输入的舒适度
  inputPadding: {
    sm: `${spacing[2]} ${spacing[3]}`, // 小输入框内边距 - 8px 12px
    md: `${spacing[2.5]} ${spacing[4]}`, // 中等输入框内边距 - 10px 16px
    lg: `${spacing[3]} ${spacing[5]}`, // 大输入框内边距 - 12px 20px
  },

  // 卡片内间距配置 - 卡片组件的内边距设置，确保内容的呼吸感
  cardPadding: {
    sm: spacing[4], // 小卡片内边距 - 16px
    md: spacing[6], // 中等卡片内边距 - 24px
    lg: spacing[8], // 大卡片内边距 - 32px
  },

  // 列表项间距配置 - 列表项的内边距设置，确保列表的视觉层次
  listItemPadding: {
    sm: `${spacing[2]} ${spacing[4]}`, // 小列表项内边距 - 8px 16px
    md: `${spacing[3]} ${spacing[6]}`, // 中等列表项内边距 - 12px 24px
    lg: `${spacing[4]} ${spacing[8]}`, // 大列表项内边距 - 16px 32px
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

// 间距工具函数 - 提供便捷的间距获取和处理功能

// 获取基础间距值 - 根据间距值名称返回对应的CSS间距值
export const getSpacing = (value: keyof typeof spacing): string =>
  spacing[value]

// 获取语义化间距 - 根据类别和尺寸返回对应的语义化间距值
export const getSemanticSpacing = (
  category: keyof typeof semanticSpacing, // 间距类别
  size: keyof typeof semanticSpacing.element // 间距尺寸
): string => semanticSpacing[category][size]

// 获取响应式间距 - 根据断点、类别和尺寸返回对应的响应式间距值
export const getResponsiveSpacing = (
  breakpoint: keyof typeof responsiveSpacing, // 响应式断点
  category: keyof typeof responsiveSpacing.mobile, // 间距类别
  size: keyof typeof responsiveSpacing.mobile.element // 间距尺寸
): string => responsiveSpacing[breakpoint][category][size]

// 间距相关类型定义 - 定义间距系统的TypeScript类型，确保类型安全

// 间距值类型 - 定义可用的基础间距值选项
export type SpacingValue = keyof typeof spacing

// 语义化间距类别类型 - 定义可用的语义化间距类别选项
export type SemanticSpacingCategory = keyof typeof semanticSpacing

// 语义化间距尺寸类型 - 定义可用的语义化间距尺寸选项
export type SemanticSpacingSize = keyof typeof semanticSpacing.element

// 响应式断点类型 - 定义可用的响应式断点选项
export type ResponsiveBreakpoint = keyof typeof responsiveSpacing
