/**
 * @fileoverview 渐变变体配置
 * @description 提供统一的渐变效果配置，遵循DRY原则和组件变体Token系统。
 * 统一管理所有组件中使用的渐变样式，避免重复实现。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// ============================================================================
// 渐变变体配置
// ============================================================================

export const gradientVariants = {
  /**
   * 遮罩渐变 - 用于卡片底部文字可读性的渐变遮罩
   * 统一替代各个组件中重复的渐变实现
   */
  overlay: {
    /**
     * 轻微遮罩 - 用于专题卡片的轻量渐变效果
     * 对应 TopicLayer.light 的渐变强度
     */
    subtle: 'bg-gradient-to-t from-black/40 via-black/10 to-transparent', // 对应 TopicLayer.light

    /**
     * 中等遮罩 - 最常用的渐变强度，适用于大多数卡片
     * 对应 MovieLayer 和 SimpleMovieLayer 的渐变效果
     */
    medium: 'bg-gradient-to-t from-black/50 via-black/20 to-transparent', // 对应 MovieLayer

    /**
     * 强烈遮罩 - 用于需要更强对比度的场景
     * 对应 TopicLayer.medium 的渐变强度，稍微增强以保持一致性
     */
    strong: 'bg-gradient-to-t from-black/60 via-black/30 to-transparent', // 对应 TopicLayer.medium

    /**
     * 密集遮罩 - 用于导航菜单等需要强力遮罩的场景
     * 对应 HomeMenu 的渐变效果
     */
    intense: 'bg-gradient-to-t from-black/70 via-transparent to-transparent', // 对应 HomeMenu

    /**
     * 重度遮罩 - 用于需要最强对比度的场景
     * 对应 TopicLayer.strong 的渐变强度
     */
    heavy: 'bg-gradient-to-t from-black/80 via-black/40 to-transparent', // 对应 TopicLayer.strong
  },

  /**
   * 特殊效果渐变 - 用于特定视觉效果的渐变
   */
  special: {
    /**
     * 主题色渐变 - 用于品牌色彩相关的渐变效果
     */
    primary: 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500',

    /**
     * 成功状态渐变 - 用于成功提示和正面反馈
     */
    success: 'bg-gradient-to-br from-green-400 via-green-500 to-green-600',

    /**
     * 警告状态渐变 - 用于警告提示和注意事项
     */
    warning: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',

    /**
     * 信息状态渐变 - 用于信息提示和说明文字
     */
    info: 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500',
  },

  /**
   * 背景渐变 - 用于页面和容器背景的渐变效果
   */
  background: {
    /**
     * 轻量背景 - 用于页面主背景
     */
    light: 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200',

    /**
     * 深色背景 - 用于深色主题背景
     */
    dark: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',

    /**
     * 玻璃效果 - 用于毛玻璃背景效果
     */
    glass: 'bg-gradient-to-br from-white/10 via-white/5 to-transparent',
  },
} as const

// ============================================================================
// 类型定义
// ============================================================================

/**
 * 渐变遮罩强度类型
 */
export type GradientOverlayIntensity =
  | 'subtle' // 轻微遮罩
  | 'medium' // 中等遮罩
  | 'strong' // 强烈遮罩
  | 'intense' // 密集遮罩
  | 'heavy' // 重度遮罩

/**
 * 特殊效果渐变类型
 */
export type GradientSpecialVariant =
  | 'primary' // 主题色渐变
  | 'success' // 成功状态渐变
  | 'warning' // 警告状态渐变
  | 'info' // 信息状态渐变

/**
 * 背景渐变类型
 */
export type GradientBackgroundVariant =
  | 'light' // 轻量背景
  | 'dark' // 深色背景
  | 'glass' // 玻璃效果

/**
 * 渐变类型联合类型
 */
export type GradientVariant =
  | GradientOverlayIntensity
  | GradientSpecialVariant
  | GradientBackgroundVariant

/**
 * 渐变类别类型
 */
export type GradientCategory = 'overlay' | 'special' | 'background'

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 获取渐变类名
 * @param category 渐变类别
 * @param variant 渐变变体
 * @returns CSS类名字符串
 */
export const getGradientClass = (
  category: GradientCategory,
  variant: GradientVariant
): string => {
  // 类型安全的访问方式
  switch (category) {
    case 'overlay':
      return gradientVariants.overlay[variant as GradientOverlayIntensity] || ''
    case 'special':
      return gradientVariants.special[variant as GradientSpecialVariant] || ''
    case 'background':
      return (
        gradientVariants.background[variant as GradientBackgroundVariant] || ''
      )
    default:
      return ''
  }
}

/**
 * 获取遮罩渐变类名的便捷函数
 * @param intensity 渐变强度
 * @returns CSS类名字符串
 */
export const getOverlayGradient = (
  intensity: GradientOverlayIntensity
): string => {
  return gradientVariants.overlay[intensity] || gradientVariants.overlay.medium
}
