/**
 * @fileoverview 主题管理Hook
 * @description 基于 next-themes 提供主题切换和管理功能，
 * 包括明暗模式切换、系统主题检测和主题状态管理。
 * 符合 DDD 架构，作为应用层Hook协调主题相关业务逻辑。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.3.0
 */

import { useTheme as useNextThemes } from 'next-themes'

/**
 * 主题名称类型定义
 */
export type ThemeName = 'light' | 'dark'

/**
 * 主题状态接口
 */
export interface UseThemeReturn {
  /** 当前主题名称 */
  theme: ThemeName | undefined
  /** 设置主题的函数 */
  setTheme: (theme: ThemeName) => void
  /** 系统主题名称 */
  systemTheme: 'light' | 'dark' | undefined
  /** 实际解析的主题名称（考虑 system 主题的情况） */
  resolvedTheme: 'light' | 'dark' | undefined
  /** 是否为暗色主题 */
  isDark: boolean
  /** 是否为亮色主题 */
  isLight: boolean
  /** 主题是否已加载（解决SSR水合问题） */
  isLoaded: boolean
  /** 可用主题列表 */
  availableThemes: ThemeName[]
  /** 主题显示名称映射 */
  themeLabels: Record<ThemeName, string>
  /** 切换到下一个主题 */
  toggleTheme: () => void
  /** 获取主题的显示名称 */
  getThemeLabel: (theme: ThemeName) => string
  /** 检查是否为当前主题 */
  isCurrentTheme: (theme: ThemeName) => boolean
}

/**
 * 主题显示名称配置
 */
const THEME_LABELS: Record<ThemeName, string> = {
  light: '浅色模式',
  dark: '深色模式',
}

/**
 * 主题管理Hook
 *
 * 基于 next-themes 提供类型安全的主题管理功能，
 * 包括主题切换、状态检测和便捷的工具方法。
 * 该Hook遵循 DDD 架构原则，作为应用层Hook协调主题相关的业务逻辑。
 *
 * @returns {UseThemeReturn} 主题状态和操作方法
 *
 * @example
 * ```tsx
 * const { theme, setTheme, isDark, toggleTheme, getThemeLabel } = useTheme()
 *
 * // 切换主题
 * const handleThemeChange = () => {
 *   setTheme(isDark ? 'light' : 'dark')
 * }
 *
 * // 渲染主题切换按钮
 * <button onClick={toggleTheme}>
 *   {getThemeLabel(theme)}
 * </button>
 * ```
 */
export const useTheme = (): UseThemeReturn => {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextThemes()

  /**
   * 判断是否为暗色主题
   */
  const isDark = resolvedTheme === 'dark'

  /**
   * 判断是否为亮色主题
   */
  const isLight = resolvedTheme === 'light'

  /**
   * 判断主题是否已加载
   * 解决 SSR 水合期间的 undefined 问题
   */
  const isLoaded = theme !== undefined

  /**
   * 可用主题列表
   */
  const availableThemes: ThemeName[] = ['light', 'dark']

  /**
   * 切换到下一个主题
   * 按照顺序：light -> dark -> light
   */
  const toggleTheme = (): void => {
    if (!isLoaded) return

    const currentIndex = availableThemes.indexOf(theme as ThemeName)
    const nextIndex = (currentIndex + 1) % availableThemes.length
    const nextTheme = availableThemes[nextIndex]

    setTheme(nextTheme)
  }

  /**
   * 获取主题的显示名称
   */
  const getThemeLabel = (themeName: ThemeName): string => {
    return THEME_LABELS[themeName] || themeName
  }

  /**
   * 检查是否为当前主题
   */
  const isCurrentTheme = (themeName: ThemeName): boolean => {
    return theme === themeName
  }

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

/**
 * 主题检测Hook - 检测系统主题偏好
 *
 * @returns {boolean} 系统是否偏好暗色主题
 */
export const useSystemThemeDetector = (): boolean => {
  const { systemTheme } = useTheme()
  return systemTheme === 'dark'
}

/**
 * 主题状态Hook - 提供主题相关的派生状态
 *
 * @returns {ThemeStateReturn} 主题相关的派生状态和工具方法
 */
export const useThemeState = () => {
  const { isDark, isLight, isLoaded, theme, resolvedTheme } = useTheme()

  /**
   * 获取适合当前主题的文本颜色类名
   */
  const getTextClass = (lightClass: string, darkClass: string): string => {
    if (!isLoaded) return lightClass
    return isDark ? darkClass : lightClass
  }

  /**
   * 获取适合当前主题的背景颜色类名
   */
  const getBackgroundClass = (
    lightClass: string,
    darkClass: string
  ): string => {
    if (!isLoaded) return lightClass
    return isDark ? darkClass : lightClass
  }

  /**
   * 获取适合当前主题的边框颜色类名
   */
  const getBorderClass = (lightClass: string, darkClass: string): string => {
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
