/**
 * 字体配置文件 - DDD设计令牌系统
 *
 * 遵循DDD架构规范，作为基础设施层的字体配置
 * 符合Claude.md第8章设计令牌系统要求
 */

export interface FontConfig {
  family: string
  weights: number[]
  styles: string[]
  display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
}

/**
 * HarmonyOS Sans SC 字体系统配置
 * 项目统一字体，遵循单一数据源原则
 */
export const fontConfigs = {
  // 主要字体族 - HarmonyOS Sans SC
  primary: {
    family: 'HarmonyOS Sans SC',
    weights: [100, 300, 400, 500, 700, 900], // Thin, Light, Regular, Medium, Bold, Black
    styles: ['normal'],
    display: 'swap' as const,
  },

  // 等宽字体 - 保持原有配置
  mono: {
    family: 'JetBrains Mono',
    weights: [400, 500],
    styles: ['normal'],
    display: 'swap' as const,
  },

  // 显示字体 - 特殊场景使用
  display: {
    family: 'HarmonyOS Sans SC',
    weights: [100, 300, 400, 500, 700, 900],
    styles: ['normal'],
    display: 'swap' as const,
  },
} as const

export type FontFamily = keyof typeof fontConfigs

/**
 * 字体权重映射 - 设计令牌
 */
export const fontWeights = {
  thin: 100,
  light: 300,
  normal: 400,
  medium: 500,
  bold: 700,
  black: 900,
} as const

/**
 * 生成 @font-face 声明的工具函数
 */
export const generateFontFace = (
  fontFamily: string,
  fontPath: string,
  weight: number = 400,
  style: string = 'normal',
  display: string = 'swap'
): string => {
  return `
@font-face {
  font-family: '${fontFamily}';
  src: url('${fontPath}.woff2') format('woff2'),
       url('${fontPath}.woff') format('woff');
  font-weight: ${weight};
  font-style: ${style};
  font-display: ${display};
}`
}

/**
 * HarmonyOS Sans SC 字体声明（当前使用的字体）
 * 注意：字体声明已移至 src/index.css，此处保留作为备份参考
 */
export const harmonyFontFaceDeclarations = `
/* === HarmonyOS Sans SC 字体声明 === */
@font-face {
  font-family: 'HarmonyOS Sans SC';
  src: url('./assets/fonts/HarmonyOS_Sans_SC/HarmonyOS_SansSC_Thin.ttf') format('truetype');
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'HarmonyOS Sans SC';
  src: url('./assets/fonts/HarmonyOS_Sans_SC/HarmonyOS_SansSC_Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'HarmonyOS Sans SC';
  src: url('./assets/fonts/HarmonyOS_Sans_SC/HarmonyOS_SansSC_Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'HarmonyOS Sans SC';
  src: url('./assets/fonts/HarmonyOS_Sans_SC/HarmonyOS_SansSC_Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'HarmonyOS Sans SC';
  src: url('./assets/fonts/HarmonyOS_Sans_SC/HarmonyOS_SansSC_Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'HarmonyOS Sans SC';
  src: url('./assets/fonts/HarmonyOS_Sans_SC/HarmonyOS_SansSC_Black.ttf') format('truetype');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
`
