/**
 * @fileoverview 主题切换组件
 * @description 提供明暗模式切换功能的交互组件，支持三种模式：
 * 浅色模式、深色模式和跟随系统。使用 Radix UI 组件构建，
 * 符合 DDD 架构原则，作为分子组件提供具体的交互功能。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.3.0
 */

import { useTheme, type ThemeName } from '@application/hooks'
import { DropdownMenu, Button, Text } from '@radix-ui/themes'
import { SunIcon, MoonIcon } from 'lucide-react'
import React from 'react'

/**
 * 主题选项配置
 */
const THEME_OPTIONS = [
  { value: 'light' as ThemeName, label: '浅色模式', icon: SunIcon },
  { value: 'dark' as ThemeName, label: '深色模式', icon: MoonIcon },
] as const

/**
 * 主题切换组件属性接口
 */
export interface ThemeToggleProps {
  /** 是否显示文本标签，默认为 true */
  showLabel?: boolean
  /** 按钮尺寸变体 */
  size?: '1' | '2' | '3' | '4'
  /** 按钮变体 */
  variant?: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost'
  /** 自定义CSS类名 */
  className?: string
  /** 是否禁用，默认为 false */
  disabled?: boolean
}

/**
 * 主题切换组件
 *
 * 提供用户友好的主题切换界面，支持下拉菜单选择和快速切换。
 * 该组件遵循 DDD 架构原则，作为分子组件提供具体的交互功能。
 * 使用 Radix UI 组件确保一致的设计语言和良好的可访问性。
 *
 * @param props - 组件属性
 * @returns {JSX.Element} 主题切换组件
 *
 * @example
 * ```tsx
 * // 基础用法
 * <ThemeToggle />
 *
 * // 自定义配置
 * <ThemeToggle
 *   showLabel={false}
 *   size="2"
 *   variant="ghost"
 *   className="custom-theme-toggle"
 * />
 * ```
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = true,
  size = '2',
  variant = 'ghost',
  className,
  disabled = false,
}): JSX.Element => {
  const { theme, setTheme, isLoaded, getThemeLabel } = useTheme()

  // 主题未加载时不渲染
  if (!isLoaded) {
    return (
      <Button
        size={size}
        variant={variant}
        className={className}
        disabled
        loading
      >
        <MoonIcon size={20} />
        {showLabel && <Text size="2">主题</Text>}
      </Button>
    )
  }

  // 获取当前主题的图标
  const CurrentIcon =
    THEME_OPTIONS.find(option => option.value === theme)?.icon || MoonIcon

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          size={size}
          variant={variant}
          className={className}
          disabled={disabled}
          title="切换主题"
        >
          <CurrentIcon size={20} />
          {showLabel && (
            <Text size="2">
              {getThemeLabel((theme as ThemeName) || 'dark')}
            </Text>
          )}
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" sideOffset={8}>
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
          const isActive = theme === value

          return (
            <DropdownMenu.Item
              key={value}
              onClick={() => setTheme(value)}
              className={`flex items-center gap-2 ${isActive ? 'bg-accent-6' : ''}`}
            >
              <Icon size={16} />
              <Text size="2">{label}</Text>
              {isActive && (
                <Text size="1" color="green" className="ml-auto">
                  ✓
                </Text>
              )}
            </DropdownMenu.Item>
          )
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

/**
 * 简化版主题切换按钮（仅点击切换）
 */
export interface SimpleThemeToggleProps
  extends Omit<ThemeToggleProps, 'showLabel'> {
  /** 是否显示文本标签 */
  showText?: boolean
}

export const SimpleThemeToggle: React.FC<SimpleThemeToggleProps> = ({
  showText = true,
  size = '2',
  variant = 'ghost',
  className,
  disabled = false,
}) => {
  const { toggleTheme, isDark, isLoaded } = useTheme()

  const Icon = isDark ? SunIcon : MoonIcon

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      disabled={disabled || !isLoaded}
      onClick={toggleTheme}
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
    >
      <Icon size={20} />
      {showText && <Text size="2">{isDark ? '浅色' : '深色'}</Text>}
    </Button>
  )
}

export default ThemeToggle
