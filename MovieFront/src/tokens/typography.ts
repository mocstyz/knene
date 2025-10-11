/**
 * 字体设计令牌 - 定义字体系统
 * 包括字体族、字号、行高、字重等
 */

// 字体族
export const fontFamilies = {
  // 主要字体
  sans: [
    'Manrope',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
  // 等宽字体
  mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
  // 衬线字体
  serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
  // 图标字体
  icons: ['Material Icons', 'sans-serif'],
} as const

// 字号系统
export const fontSizes = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem', // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem', // 72px
  '8xl': '6rem', // 96px
  '9xl': '8rem', // 128px
} as const

// 字重系统
export const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const

// 行高系统
export const lineHeights = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const

// 字母间距
export const letterSpacings = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const

// 文本样式组合
export const textStyles = {
  // 标题样式
  heading1: {
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.tight,
  },
  heading2: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.tight,
  },
  heading3: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacings.normal,
  },
  heading4: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacings.normal,
  },
  heading5: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  heading6: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },

  // 正文样式
  bodyLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacings.normal,
  },
  body: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  bodyXSmall: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },

  // 标签样式
  labelLarge: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.wide,
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.wide,
  },
  labelSmall: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.wider,
  },

  // 按钮样式
  buttonLarge: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacings.wide,
  },
  button: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacings.wide,
  },
  buttonSmall: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacings.wider,
  },

  // 代码样式
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
  codeSmall: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
} as const

// 响应式字号
export const responsiveFontSizes = {
  mobile: {
    heading1: fontSizes['2xl'],
    heading2: fontSizes.xl,
    heading3: fontSizes.lg,
    body: fontSizes.sm,
  },
  tablet: {
    heading1: fontSizes['3xl'],
    heading2: fontSizes['2xl'],
    heading3: fontSizes.xl,
    body: fontSizes.base,
  },
  desktop: {
    heading1: fontSizes['4xl'],
    heading2: fontSizes['3xl'],
    heading3: fontSizes['2xl'],
    body: fontSizes.base,
  },
} as const

export type FontFamily = keyof typeof fontFamilies
export type FontSize = keyof typeof fontSizes
export type FontWeight = keyof typeof fontWeights
export type LineHeight = keyof typeof lineHeights
export type LetterSpacing = keyof typeof letterSpacings
export type TextStyle = keyof typeof textStyles
