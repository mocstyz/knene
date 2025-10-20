/**
 * @fileoverview 响应式配置常量
 * @description 统一的响应式列数配置常量，确保各模块间的一致性和可维护性。
 * 基于DDD架构设计，按业务领域和使用场景分类配置。
 * 
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { ResponsiveColumnsConfig } from '@components/domains/shared'

/**
 * 标准响应式配置模式
 * 
 * 设计原则：
 * - 移动端优先：xs/sm 保证小屏幕可用性
 * - 渐进增强：随屏幕增大逐步增加列数
 * - 视觉平衡：避免过多或过少的列数影响用户体验
 */

/**
 * 6列标准模式 - 适用于内容密集型展示
 * 用于：写真、最新更新、24小时热门等内容丰富的模块
 */
export const RESPONSIVE_6_COLUMN_CONFIG: ResponsiveColumnsConfig = {
  xs: 2,    // 手机竖屏：2列，保证内容可见性
  sm: 3,    // 手机横屏/小平板：3列，平衡内容与空间
  md: 4,    // 平板竖屏：4列，充分利用中等屏幕
  lg: 4,    // 平板横屏/小笔记本：保持4列，避免内容过小
  xl: 5,    // 桌面显示器：5列，优化桌面体验
  xxl: 6,   // 大屏显示器：6列，最大化内容展示
} as const

/**
 * 3列集合模式 - 适用于重点内容展示
 * 用于：影片合集等需要突出展示的内容模块
 */
export const RESPONSIVE_3_COLUMN_CONFIG: ResponsiveColumnsConfig = {
  xs: 1,    // 手机竖屏：1列，确保内容完整显示
  sm: 1,    // 手机横屏：保持1列，避免内容过小
  md: 2,    // 平板竖屏：2列，开始利用更大空间
  lg: 3,    // 平板横屏及以上：3列，最佳展示效果
  xl: 3,    // 桌面：保持3列，避免内容分散
  xxl: 3,   // 大屏：保持3列，确保内容聚焦
} as const

/**
 * 5列通用模式 - 适用于一般内容展示
 * 用于：BaseList默认配置等通用场景
 */
export const RESPONSIVE_5_COLUMN_CONFIG: ResponsiveColumnsConfig = {
  xs: 1,    // 手机竖屏：1列
  sm: 2,    // 手机横屏：2列
  md: 3,    // 平板竖屏：3列
  lg: 4,    // 平板横屏/小笔记本：4列
  xl: 5,    // 桌面及以上：5列
} as const

/**
 * 特殊页面配置 - 适用于专题页面等特殊场景
 */
export const RESPONSIVE_SPECIAL_PAGE_CONFIG: ResponsiveColumnsConfig = {
  xs: 2,    // 手机竖屏：2列
  sm: 2,    // 手机横屏：保持2列
  md: 3,    // 平板竖屏：3列
  lg: 4,    // 平板横屏：4列
  xl: 5,    // 桌面：5列
  xxl: 6,   // 大屏：6列
} as const

/**
 * 响应式配置映射表
 * 按业务领域和使用场景分类
 */
export const RESPONSIVE_CONFIGS = {
  // 内容展示类（6列标准）
  photo: RESPONSIVE_6_COLUMN_CONFIG,
  latestUpdate: RESPONSIVE_6_COLUMN_CONFIG,
  hot: RESPONSIVE_6_COLUMN_CONFIG,
  mixedContent: RESPONSIVE_6_COLUMN_CONFIG,
  
  // 集合展示类（3列集合）
  collection: RESPONSIVE_3_COLUMN_CONFIG,
  
  // 通用展示类（5列通用）
  baseList: RESPONSIVE_5_COLUMN_CONFIG,
  
  // 特殊页面类
  specialPage: RESPONSIVE_SPECIAL_PAGE_CONFIG,
} as const

/**
 * 响应式配置工具函数
 */

/**
 * 获取指定类型的响应式配置
 * @param configType 配置类型
 * @returns 响应式列数配置
 */
export const getResponsiveConfig = (
  configType: keyof typeof RESPONSIVE_CONFIGS
): ResponsiveColumnsConfig => {
  return RESPONSIVE_CONFIGS[configType]
}

/**
 * 创建自定义响应式配置
 * @param baseConfig 基础配置类型
 * @param overrides 覆盖配置
 * @returns 合并后的响应式配置
 */
export const createCustomResponsiveConfig = (
  baseConfig: keyof typeof RESPONSIVE_CONFIGS,
  overrides: Partial<ResponsiveColumnsConfig>
): ResponsiveColumnsConfig => {
  return {
    ...RESPONSIVE_CONFIGS[baseConfig],
    ...overrides,
  }
}

/**
 * 验证响应式配置的合理性
 * @param config 响应式配置
 * @returns 验证结果和建议
 */
export const validateResponsiveConfig = (
  config: ResponsiveColumnsConfig
): {
  isValid: boolean
  warnings: string[]
  suggestions: string[]
} => {
  const warnings: string[] = []
  const suggestions: string[] = []
  
  // 检查递增趋势
  const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const
  const values = breakpoints.map(bp => config[bp]).filter(Boolean) as number[]
  
  for (let i = 1; i < values.length; i++) {
    if (values[i] < values[i - 1]) {
      warnings.push(`断点配置存在递减趋势，可能影响响应式体验`)
      break
    }
  }
  
  // 检查极值
  const maxColumns = Math.max(...values)
  const minColumns = Math.min(...values)
  
  if (maxColumns > 8) {
    warnings.push(`最大列数${maxColumns}可能过多，建议不超过8列`)
    suggestions.push(`考虑减少大屏幕的列数以提升可读性`)
  }
  
  if (minColumns < 1) {
    warnings.push(`最小列数${minColumns}不合理，应至少为1列`)
  }
  
  // 检查跨度
  const columnSpan = maxColumns - minColumns
  if (columnSpan > 5) {
    suggestions.push(`列数跨度${columnSpan}较大，考虑平滑过渡`)
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions,
  }
}

/**
 * 响应式配置使用指南
 */
export const RESPONSIVE_CONFIG_GUIDE = {
  /**
   * 选择配置的建议
   */
  selection: {
    '内容密集型模块': 'photo, latestUpdate, hot - 使用6列标准配置',
    '重点展示模块': 'collection - 使用3列集合配置',
    '通用列表组件': 'baseList - 使用5列通用配置',
    '特殊页面': 'specialPage - 使用特殊页面配置',
  },
  
  /**
   * 自定义配置的最佳实践
   */
  bestPractices: [
    '优先使用预定义配置，确保一致性',
    '如需自定义，基于现有配置进行微调',
    '保持断点间的平滑过渡',
    '考虑内容类型和用户体验',
    '在不同设备上测试效果',
  ],
  
  /**
   * 常见问题和解决方案
   */
  troubleshooting: {
    '列数过多导致内容过小': '减少大屏幕断点的列数',
    '小屏幕显示不佳': '调整xs/sm断点配置',
    '中等屏幕过渡不自然': '优化md/lg断点设置',
    '配置不一致': '使用统一的预定义配置',
  },
} as const

// 类型导出
export type ResponsiveConfigType = keyof typeof RESPONSIVE_CONFIGS
export type ResponsiveConfigGuide = typeof RESPONSIVE_CONFIG_GUIDE