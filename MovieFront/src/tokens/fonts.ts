/**
 * @fileoverview 字体设计令牌配置
 * @description 字体设计令牌系统定义，包括字体配置、字体权重、字体声明等
 *              遵循DDD架构规范，作为基础设施层的字体配置，符合设计令牌系统要求
 *              提供完整的字体系统配置，包括HarmonyOS Sans SC字体系统、字体权重映射
 *              和字体工具函数，确保整个应用的字体效果一致性和可维护性
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 字体配置接口 - 定义字体配置的标准结构
export interface FontConfig {
  family: string // 字体族名称
  weights: number[] // 支持的字体权重列表
  styles: string[] // 支持的字体样式列表
  display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional' // 字体加载策略
}

// 字体系统配置 - 定义项目中使用的各种字体配置，遵循单一数据源原则
export const fontConfigs = {
  // 主要字体族配置 - HarmonyOS Sans SC，项目统一字体
  primary: {
    family: 'HarmonyOS Sans SC', // 字体族名称
    weights: [100, 300, 400, 500, 700, 900], // 支持的权重：Thin, Light, Regular, Medium, Bold, Black
    styles: ['normal'], // 支持的样式
    display: 'swap' as const, // 字体加载策略
  },

  // 等宽字体配置 - 用于代码显示、数据表格等场景
  mono: {
    family: 'JetBrains Mono', // 等宽字体族名称
    weights: [400, 500], // 支持的权重：Regular, Medium
    styles: ['normal'], // 支持的样式
    display: 'swap' as const, // 字体加载策略
  },

  // 显示字体配置 - 用于标题、大字体等特殊显示场景
  display: {
    family: 'HarmonyOS Sans SC', // 显示字体族名称
    weights: [100, 300, 400, 500, 700, 900], // 支持的权重
    styles: ['normal'], // 支持的样式
    display: 'swap' as const, // 字体加载策略
  },
} as const

// 字体族类型 - 定义可用的字体族选项
export type FontFamily = keyof typeof fontConfigs

// 字体权重映射配置 - 定义语义化的字体权重名称，便于在代码中使用
export const fontWeights = {
  thin: 100, // 极细字体
  light: 300, // 细字体
  normal: 400, // 正常字体
  medium: 500, // 中等字体
  bold: 700, // 粗字体
  black: 900, // 极粗字体
} as const

// 字体工具函数 - 提供字体相关的工具函数和声明生成

// 生成@font-face声明 - 根据字体配置生成CSS @font-face声明
export const generateFontFace = (
  fontFamily: string, // 字体族名称
  fontPath: string, // 字体文件路径
  weight: number = 400, // 字体权重
  style: string = 'normal', // 字体样式
  display: string = 'swap' // 字体加载策略
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

// HarmonyOS Sans SC字体声明 - 当前项目使用的主要字体声明
// 注意：字体声明已移至 src/index.css，此处保留作为备份参考
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
