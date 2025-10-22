/**
 * @fileoverview 主题管理Hook - 基于next-themes的主题切换与状态管理
 * @description 基于 next-themes 提供完整的主题管理功能，包括明暗模式切换、系统主题检测和主题状态管理。
 * 符合 DDD 架构原则，作为应用层Hook协调主题相关业务逻辑，提供类型安全的主题操作接口。
 * 支持SSR水合、系统主题自动检测、主题持久化存储等高级功能。
 * @author mosctz
 * @version 1.2.0
 */

import { useTheme as useNextThemes } from 'next-themes'

// 主题名称类型定义 - 定义应用支持的主题类型，限制为明暗两种模式
export type ThemeName = 
  | 'light'  // 浅色主题
  | 'dark'   // 深色主题

// 主题状态接口 - 定义主题管理Hook的完整返回类型，包含主题状态、操作方法和工具函数
export interface UseThemeReturn {
  // 当前主题名称 - 用户设置的主题名称，可能为undefined（SSR期间）
  theme: ThemeName | undefined
  
  // 设置主题的函数 - 用于切换主题的核心方法，支持持久化存储
  setTheme: (theme: ThemeName) => void
  
  // 系统主题名称 - 操作系统的主题偏好设置，通过媒体查询获取
  systemTheme: 'light' | 'dark' | undefined
  
  // 实际解析的主题名称 - 考虑system主题情况下的最终生效主题
  resolvedTheme: 'light' | 'dark' | undefined
  
  // 是否为暗色主题 - 便捷的暗色主题判断标志
  isDark: boolean
  
  // 是否为亮色主题 - 便捷的亮色主题判断标志
  isLight: boolean
  
  // 主题是否已加载 - 解决SSR水合问题的加载状态标志
  isLoaded: boolean
  
  // 可用主题列表 - 应用支持的所有主题选项
  availableThemes: ThemeName[]
  
  // 主题显示名称映射 - 主题名称到用户友好显示文本的映射
  themeLabels: Record<ThemeName, string>
  
  // 切换到下一个主题 - 循环切换主题的便捷方法
  toggleTheme: () => void
  
  // 获取主题的显示名称 - 根据主题名称获取用户友好的显示文本
  getThemeLabel: (theme: ThemeName) => string
  
  // 检查是否为当前主题 - 判断指定主题是否为当前激活主题
  isCurrentTheme: (theme: ThemeName) => boolean
}

// 主题显示名称配置 - 定义主题名称到用户友好显示文本的映射关系
const THEME_LABELS: Record<ThemeName, string> = {
  light: '浅色模式',  // 浅色主题的显示名称
  dark: '深色模式',   // 深色主题的显示名称
}

// 主题管理Hook - 基于 next-themes 提供类型安全的主题管理功能，包括主题切换、状态检测和便捷的工具方法
export const useTheme = (): UseThemeReturn => {
  // 基础主题状态 - 从next-themes获取核心主题数据
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextThemes()

  // 暗色主题判断 - 基于解析后的主题判断是否为暗色模式
  const isDark = resolvedTheme === 'dark'

  // 亮色主题判断 - 基于解析后的主题判断是否为亮色模式
  const isLight = resolvedTheme === 'light'

  // 主题加载状态判断 - 解决 SSR 水合期间的 undefined 问题，确保客户端渲染一致性
  const isLoaded = theme !== undefined

  // 可用主题列表定义 - 应用支持的所有主题选项，用于主题选择器等组件
  const availableThemes: ThemeName[] = ['light', 'dark']

  // 主题循环切换方法 - 按照预定义顺序循环切换主题：light -> dark -> light
  const toggleTheme = (): void => {
    // 防御性检查 - 确保主题已加载
    if (!isLoaded) return

    // 循环切换逻辑 - 计算下一个主题索引
    const currentIndex = availableThemes.indexOf(theme as ThemeName)
    const nextIndex = (currentIndex + 1) % availableThemes.length
    const nextTheme = availableThemes[nextIndex]

    // 应用新主题
    setTheme(nextTheme)
  }

  // 主题显示名称获取方法 - 根据主题名称返回用户友好的显示文本，支持国际化扩展
  const getThemeLabel = (themeName: ThemeName): string => {
    return THEME_LABELS[themeName] || themeName
  }

  // 当前主题判断方法 - 检查指定主题是否为当前激活的主题，用于主题选择器的状态显示
  const isCurrentTheme = (themeName: ThemeName): boolean => {
    return theme === themeName
  }

  // 返回完整的主题管理接口
  return {
    theme: theme as ThemeName | undefined,
    setTheme,
    systemTheme,
    resolvedTheme: resolvedTheme as 'light' | 'dark' | undefined,
    isDark,
    isLight,
    isLoaded,
    availableThemes,
    themeLabels: THEME_LABELS,
    toggleTheme,
    getThemeLabel,
    isCurrentTheme,
  }
}

// 系统主题检测Hook - 专门用于检测操作系统主题偏好的轻量级Hook
export const useSystemThemeDetector = (): boolean => {
  const { systemTheme } = useTheme()
  return systemTheme === 'dark'
}

// 主题状态Hook - 提供主题相关的派生状态和工具方法
export const useThemeState = () => {
  const { isDark, isLight, isLoaded, theme, resolvedTheme } = useTheme()

  // 获取适合当前主题的文本颜色类名 - 根据当前主题返回对应的文本颜色CSS类名
  const getTextClass = (lightClass: string, darkClass: string): string => {
    // SSR兼容性 - 主题未加载时使用浅色主题类名
    if (!isLoaded) return lightClass
    return isDark ? darkClass : lightClass
  }

  // 获取适合当前主题的背景颜色类名 - 根据当前主题返回对应的背景颜色CSS类名
  const getBackgroundClass = (
    lightClass: string,
    darkClass: string
  ): string => {
    // SSR兼容性 - 主题未加载时使用浅色主题类名
    if (!isLoaded) return lightClass
    return isDark ? darkClass : lightClass
  }

  // 获取适合当前主题的边框颜色类名 - 根据当前主题返回对应的边框颜色CSS类名
  const getBorderClass = (lightClass: string, darkClass: string): string => {
    // SSR兼容性 - 主题未加载时使用浅色主题类名
    if (!isLoaded) return lightClass
    return isDark ? darkClass : lightClass
  }

  return {
    isDark,
    isLight,
    isLoaded,
    currentTheme: theme,
    resolvedTheme,
    getTextClass,
    getBackgroundClass,
    getBorderClass,
  }
}

export default useTheme
