/**
 * @fileoverview 统一主题提供者组件
 * @description 基于 next-themes 和 Radix UI Themes 的统一主题系统，
 * 提供明暗模式切换、系统主题检测和持久化存储功能。
 * 符合 DDD 架构，放在应用层负责主题逻辑协调。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.3.0
 */

import { Theme, type ThemeProps } from '@radix-ui/themes'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React from 'react'

/**
 * 主题提供者属性接口
 */
export interface AppThemeProviderProps {
  /** 子组件 */
  children: React.ReactNode
  /** Radix UI 主题配置 */
  themeConfig?: Partial<ThemeProps>
  /** next-themes 提供者属性 */
  themesProviderConfig?: {
    /** HTML 属性名，默认为 'class' */
    attribute?: string
    /** 默认主题，默认为 'system' */
    defaultTheme?: string
    /** 是否启用系统主题检测，默认为 true */
    enableSystem?: boolean
    /** 是否在主题切换时禁用过渡动画，默认为 true */
    disableTransitionOnChange?: boolean
    /** 是否强制页面重新渲染，默认为 false */
    forcedTheme?: string
    /** 本地存储键名，默认为 'movie-theme' */
    storageKey?: string
  }
}

/**
 * 统一主题提供者组件
 *
 * 整合 next-themes 的主题切换功能和 Radix UI Themes 的设计系统，
 * 为整个应用提供一致的主题体验。该组件遵循 DDD 架构原则，
 * 作为应用层组件负责协调不同的主题服务。
 *
 * @param props - 组件属性
 * @returns {JSX.Element} 包装了主题功能的组件树
 *
 * @example
 * ```tsx
 * <AppThemeProvider
 *   themeConfig={{
 *     accentColor: "green",
 *     grayColor: "slate",
 *     radius: "medium",
 *     scaling: "100%"
 *   }}
 *   themesProviderConfig={{
 *     defaultTheme: "system",
 *     enableSystem: true
 *   }}
 * >
 *   <App />
 * </AppThemeProvider>
 * ```
 */
export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({
  children,
  themeConfig = {
    accentColor: 'green',
    grayColor: 'slate',
    radius: 'medium',
    scaling: '100%',
    // 自定义CSS变量，用于覆盖主题色
    style: {
      '--color-accent-11': '#6ee7b7',
      '--color-accent-12': '#059669',
      '--color-accent-9': '#6ee7b7',
      '--color-accent-10': '#059669',
    } as React.CSSProperties,
  },
  themesProviderConfig = {
    attribute: 'class' as const,
    defaultTheme: 'dark' as const,
    enableSystem: false,
    disableTransitionOnChange: true,
    storageKey: 'movie-theme',
  },
}): JSX.Element => {
  return (
    <NextThemesProvider {...(themesProviderConfig as any)}>
      <Theme {...themeConfig}>{children}</Theme>
    </NextThemesProvider>
  )
}

/**
 * 默认导出主题提供者组件
 */
export default AppThemeProvider
