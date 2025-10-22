/**
 * @fileoverview 响应式配置设计令牌
 * @description 统一的响应式列数配置设计令牌，确保各模块间的一致性和可维护性
 *              基于DDD架构设计，按业务领域和使用场景分类配置，提供完整的响应式布局方案
 *              包含标准配置模式、配置映射表、工具函数和使用指南，确保整个应用的响应式效果一致性
 * @created 2025-10-21 15:17:14
 * @updated 2025-10-21 15:17:14
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { ResponsiveColumnsConfig } from '@components/domains/shared'

// 标准响应式配置模式设计原则 - 移动端优先、渐进增强、视觉平衡的响应式设计理念
// 设计原则说明：
// 移动端优先：xs/sm 断点保证小屏幕设备的基本可用性
// 渐进增强：随屏幕尺寸增大逐步增加列数，充分利用更大空间
// 视觉平衡：避免过多或过少的列数影响用户体验和内容可读性

// 6列标准模式配置 - 适用于内容密集型展示，如写真、最新更新、24小时热门等内容丰富的模块
export const RESPONSIVE_6_COLUMN_CONFIG: ResponsiveColumnsConfig = {
  xs: 2,    // 超小屏幕：2列，保证内容在小屏幕上的可见性
  sm: 3,    // 小屏幕：3列，在手机横屏/小平板上平衡内容与空间利用
  md: 4,    // 中等屏幕：4列，在平板竖屏上充分利用中等屏幕空间
  lg: 4,    // 大屏幕：4列，在平板横屏/小笔记本上保持4列，避免内容过小
  xl: 5,    // 超大屏幕：5列，在桌面显示器上优化桌面用户体验
  xxl: 6,   // 超超大屏幕：6列，在大屏显示器上最大化内容展示效果
} as const

// 3列集合模式配置 - 适用于重点内容展示，如影片合集等需要突出展示的内容模块
export const RESPONSIVE_3_COLUMN_CONFIG: ResponsiveColumnsConfig = {
  xs: 1,    // 超小屏幕：1列，确保内容在手机竖屏上的完整显示
  sm: 1,    // 小屏幕：1列，在手机横屏上保持1列，避免内容过小影响阅读
  md: 2,    // 中等屏幕：2列，在平板竖屏上开始利用更大的屏幕空间
  lg: 3,    // 大屏幕：3列，在平板横屏及以上实现最佳的展示效果
  xl: 3,    // 超大屏幕：3列，在桌面显示器上保持3列，避免内容过度分散
  xxl: 3,   // 超超大屏幕：3列，在大屏幕上保持3列，确保内容聚焦突出
} as const

// 5列通用模式配置 - 适用于一般内容展示，如BaseList默认配置等通用场景
export const RESPONSIVE_5_COLUMN_CONFIG: ResponsiveColumnsConfig = {
  xs: 1,    // 超小屏幕：1列，手机竖屏单列布局
  sm: 2,    // 小屏幕：2列，手机横屏双列布局
  md: 3,    // 中等屏幕：3列，平板竖屏三列布局
  lg: 4,    // 大屏幕：4列，平板横屏/小笔记本四列布局
  xl: 5,    // 超大屏幕：5列，桌面及以上五列布局
} as const

// 特殊页面模式配置 - 适用于专题页面等特殊场景的响应式布局需求
export const RESPONSIVE_SPECIAL_PAGE_CONFIG: ResponsiveColumnsConfig = {
  xs: 2,    // 超小屏幕：2列，手机竖屏双列布局，适合专题页面展示
  sm: 2,    // 小屏幕：2列，手机横屏保持双列布局
  md: 3,    // 中等屏幕：3列，平板竖屏三列布局
  lg: 4,    // 大屏幕：4列，平板横屏四列布局
  xl: 5,    // 超大屏幕：5列，桌面显示器五列布局
  xxl: 6,   // 超超大屏幕：6列，大屏显示器六列布局
} as const

// 响应式配置映射表 - 按业务领域和使用场景分类，提供统一的配置访问入口
export const RESPONSIVE_CONFIGS = {
  // 内容展示类配置 - 使用6列标准模式，适用于写真、最新更新、热门等内容密集型模块
  photo: RESPONSIVE_6_COLUMN_CONFIG, // 写真内容响应式配置
  latestUpdate: RESPONSIVE_6_COLUMN_CONFIG, // 最新更新内容响应式配置
  hot: RESPONSIVE_6_COLUMN_CONFIG, // 热门内容响应式配置
  mixedContent: RESPONSIVE_6_COLUMN_CONFIG, // 混合内容响应式配置

  // 集合展示类配置 - 使用3列集合模式，适用于影片合集等需要突出展示的模块
  collection: RESPONSIVE_3_COLUMN_CONFIG, // 影片合集响应式配置

  // 通用展示类配置 - 使用5列通用模式，适用于BaseList等通用列表组件
  baseList: RESPONSIVE_5_COLUMN_CONFIG, // 基础列表响应式配置

  // 特殊页面类配置 - 使用特殊页面模式，适用于专题页面等特殊场景
  specialPage: RESPONSIVE_SPECIAL_PAGE_CONFIG, // 特殊页面响应式配置
} as const

// 响应式配置工具函数 - 提供便捷的配置获取、创建和管理功能

// 获取指定类型的响应式配置 - 根据配置类型名称返回对应的响应式列数配置
export const getResponsiveConfig = (
  configType: keyof typeof RESPONSIVE_CONFIGS // 配置类型名称
): ResponsiveColumnsConfig => {
  return RESPONSIVE_CONFIGS[configType]
}

// 创建自定义响应式配置 - 基于现有配置创建自定义配置，支持部分覆盖
export const createCustomResponsiveConfig = (
  baseConfig: keyof typeof RESPONSIVE_CONFIGS, // 基础配置类型
  overrides: Partial<ResponsiveColumnsConfig> // 覆盖配置项
): ResponsiveColumnsConfig => {
  return {
    ...RESPONSIVE_CONFIGS[baseConfig],
    ...overrides,
  }
}

// 验证响应式配置的合理性 - 检查配置的递增性、极值合理性和跨度平滑性
export const validateResponsiveConfig = (
  config: ResponsiveColumnsConfig // 待验证的响应式配置
): {
  isValid: boolean // 配置是否有效
  warnings: string[] // 警告信息列表
  suggestions: string[] // 优化建议列表
} => {
  const warnings: string[] = []
  const suggestions: string[] = []

  // 检查递增性趋势 - 确保断点配置保持递增，避免响应式体验异常
  const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const
  const values = breakpoints.map(bp => config[bp]).filter(Boolean) as number[]

  for (let i = 1; i < values.length; i++) {
    if (values[i] < values[i - 1]) {
      warnings.push(`断点配置存在递减趋势，可能影响响应式体验`)
      break
    }
  }

  // 检查极值合理性 - 验证最大列数和最小列数是否在合理范围内
  const maxColumns = Math.max(...values)
  const minColumns = Math.min(...values)

  if (maxColumns > 8) {
    warnings.push(`最大列数${maxColumns}可能过多，建议不超过8列`)
    suggestions.push(`考虑减少大屏幕的列数以提升可读性`)
  }

  if (minColumns < 1) {
    warnings.push(`最小列数${minColumns}不合理，应至少为1列`)
  }

  // 检查跨度平滑性 - 验证列数跨度是否过大，影响视觉体验
  const columnSpan = maxColumns - minColumns
  if (columnSpan > 5) {
    suggestions.push(`列数跨度${columnSpan}较大，考虑平滑过渡`)
  }

  return {
    isValid: warnings.length === 0, // 根据警告数量判断配置有效性
    warnings,
    suggestions,
  }
}

// 响应式配置使用指南 - 提供配置选择建议、最佳实践和问题解决方案
export const RESPONSIVE_CONFIG_GUIDE = {
  // 配置选择建议 - 根据模块类型和使用场景推荐合适的配置
  selection: {
    '内容密集型模块': 'photo, latestUpdate, hot - 使用6列标准配置，适合写真、最新更新、热门等丰富内容',
    '重点展示模块': 'collection - 使用3列集合配置，适合影片合集等需要突出展示的内容',
    '通用列表组件': 'baseList - 使用5列通用配置，适合一般列表展示场景',
    '特殊页面': 'specialPage - 使用特殊页面配置，适合专题页面等特殊布局需求',
  },

  // 自定义配置最佳实践 - 提供配置设计的原则和方法指导
  bestPractices: [
    '优先使用预定义配置，确保整个应用的响应式效果一致性',
    '如需自定义，基于现有配置进行微调，避免完全重新设计',
    '保持断点间的平滑过渡，确保用户体验的连续性',
    '考虑内容类型和用户体验，选择合适的列数配置',
    '在不同设备上测试效果，确保各种屏幕尺寸下的良好展示',
  ],

  // 常见问题解决方案 - 针对开发中常见问题提供解决方案
  troubleshooting: {
    '列数过多导致内容过小': '减少大屏幕断点的列数，确保内容可读性',
    '小屏幕显示不佳': '调整xs/sm断点配置，优化移动端用户体验',
    '中等屏幕过渡不自然': '优化md/lg断点设置，确保平滑的响应式过渡',
    '配置不一致': '使用统一的预定义配置，避免手动配置导致的差异',
  },
} as const

// 响应式配置相关类型导出 - 定义响应式配置系统的TypeScript类型，确保类型安全

// 响应式配置类型 - 定义可用的响应式配置选项
export type ResponsiveConfigType = keyof typeof RESPONSIVE_CONFIGS

// 响应式配置指南类型 - 定义响应式配置指南的类型结构
export type ResponsiveConfigGuide = typeof RESPONSIVE_CONFIG_GUIDE
