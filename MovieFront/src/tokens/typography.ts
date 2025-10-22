/**
 * @fileoverview 字体设计令牌系统
 * @description 定义完整的字体设计系统，包括字体族、字号、行高、字重、字母间距等排版相关的设计令牌，提供统一的文本样式组合和响应式字号配置
 * @created 2025-10-09 13:10:50
 * @updated 2025-10-22 10:01:33
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 字体族常量，定义不同类型的字体栈，确保跨平台一致性
export const fontFamilies = {
  // 主要无衬线字体栈，优先使用Manrope
  sans: [
    'Manrope',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
  // 等宽字体栈，用于代码和数据显示
  mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
  // 衬线字体栈，用于标题和正文
  serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
  // 图标字体栈，用于Material Design图标
  icons: ['Material Icons', 'sans-serif'],
} as const

// 字号系统常量，基于rem单位的语义化字号定义，支持响应式设计
export const fontSizes = {
  xs: '0.75rem', // 12px，用于小号标签和注解
  sm: '0.875rem', // 14px，用于小号正文和按钮
  base: '1rem', // 16px，默认正文字号
  lg: '1.125rem', // 18px，大号正文
  xl: '1.25rem', // 20px，小标题
  '2xl': '1.5rem', // 24px，中标题
  '3xl': '1.875rem', // 30px，大标题
  '4xl': '2.25rem', // 36px，超大标题
  '5xl': '3rem', // 48px，主标题
  '6xl': '3.75rem', // 60px，特大标题
  '7xl': '4.5rem', // 72px，巨大标题
  '8xl': '6rem', // 96px，超巨大标题
  '9xl': '8rem', // 128px，最大标题
} as const

// 字重系统常量，定义标准的字体粗细值，支持不同强调级别的文本展示
export const fontWeights = {
  thin: '100', // 超细体
  extralight: '200', // 极细体
  light: '300', // 细体
  normal: '400', // 正常体，默认字重
  medium: '500', // 中等体
  semibold: '600', // 半粗体
  bold: '700', // 粗体
  extrabold: '800', // 极粗体
  black: '900', // 超粗体
} as const

// 行高系统常量，定义文本行高比例，影响文本的可读性和视觉密度
export const lineHeights = {
  none: '1', // 无行高，单行文本
  tight: '1.25', // 紧凑行高，用于标题
  snug: '1.375', // 贴合行高，用于小号文本
  normal: '1.5', // 正常行高，默认正文
  relaxed: '1.625', // 宽松行高，用于长文本阅读
  loose: '2', // 很宽行高，用于特殊强调
} as const

// 字母间距常量，定义字符间的间距值，用于调整文本的视觉密度和风格
export const letterSpacings = {
  tighter: '-0.05em', // 紧缩间距，用于大标题
  tight: '-0.025em', // 紧密间距，用于中号标题
  normal: '0em', // 正常间距，默认设置
  wide: '0.025em', // 宽间距，用于标签和按钮
  wider: '0.05em', // 更宽间距，用于强调文本
  widest: '0.1em', // 最宽间距，用于特殊标题
} as const

// 文本样式组合常量，预定义常用的文本样式组合，提供一致的视觉风格
export const textStyles = {
  // 一级标题样式，用于页面主标题
  heading1: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.tight,
  },
  // 二级标题样式，用于章节标题
  heading2: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.tight,
  },
  // 三级标题样式，用于子章节标题
  heading3: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacings.normal,
  },
  // 四级标题样式，用于小节标题
  heading4: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacings.normal,
  },
  // 五级标题样式，用于卡片标题
  heading5: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  // 六级标题样式，用于小组件标题
  heading6: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },

  // 大号正文样式，用于重要段落
  bodyLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacings.normal,
  },
  // 标准正文样式，用于常规内容
  body: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  // 小号正文样式，用于辅助信息
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  // 超小号正文样式，用于注解说明
  bodyXSmall: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },

  // 大号标签样式，用于重要标签
  labelLarge: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.wide,
  },
  // 标准标签样式，用于表单标签
  label: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.wide,
  },
  // 小号标签样式，用于小尺寸标签
  labelSmall: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.wider,
  },

  // 大号按钮样式，用于主要按钮文本
  buttonLarge: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacings.wide,
  },
  // 标准按钮样式，用于常规按钮文本
  button: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacings.wide,
  },
  // 小号按钮样式，用于小按钮文本
  buttonSmall: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacings.wider,
  },

  // 标准代码样式，用于内联代码
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
  // 小号代码样式，用于小尺寸代码
  codeSmall: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
} as const

// 响应式字号常量，针对不同设备尺寸提供优化的字号配置，确保移动端和桌面端都有良好的阅读体验
export const responsiveFontSizes = {
  // 移动端字号配置，针对小屏幕优化
  mobile: {
    heading1: fontSizes['2xl'],
    heading2: fontSizes.xl,
    heading3: fontSizes.lg,
    body: fontSizes.sm,
  },
  // 平板端字号配置，针对中等屏幕优化
  tablet: {
    heading1: fontSizes['3xl'],
    heading2: fontSizes['2xl'],
    heading3: fontSizes.xl,
    body: fontSizes.base,
  },
  // 桌面端字号配置，针对大屏幕优化
  desktop: {
    heading1: fontSizes['4xl'],
    heading2: fontSizes['3xl'],
    heading3: fontSizes['2xl'],
    body: fontSizes.base,
  },
} as const

// 字体族类型，确保类型安全
export type FontFamily = keyof typeof fontFamilies
// 字号类型，确保类型安全
export type FontSize = keyof typeof fontSizes
// 字重类型，确保类型安全
export type FontWeight = keyof typeof fontWeights
// 行高类型，确保类型安全
export type LineHeight = keyof typeof lineHeights
// 字母间距类型，确保类型安全
export type LetterSpacing = keyof typeof letterSpacings
// 文本样式类型，确保类型安全
export type TextStyle = keyof typeof textStyles
