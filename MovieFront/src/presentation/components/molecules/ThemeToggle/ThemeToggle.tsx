/**
 * @fileoverview 主题切换组件
 * @description 提供明暗模式切换功能的交互组件，支持浅色模式和深色模式切换，使用Radix UI组件构建，符合DDD架构原则
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useTheme, type ThemeName } from '@application/hooks'
import { DropdownMenu, Button, Text } from '@radix-ui/themes'
import { SunIcon, MoonIcon } from 'lucide-react'
import React from 'react'

// 主题选项配置 - 定义可选的主题模式和对应的图标标签
const THEME_OPTIONS = [
  { value: 'light' as ThemeName, label: '浅色模式', icon: SunIcon },
  { value: 'dark' as ThemeName, label: '深色模式', icon: MoonIcon },
] as const

// 主题切换组件属性接口，定义组件的完整配置参数
export interface ThemeToggleProps {
  showLabel?: boolean // 是否显示文本标签，默认true
  size?: '1' | '2' | '3' | '4' // 按钮尺寸变体
  variant?: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost' // 按钮样式变体
  className?: string // 自定义CSS类名
  disabled?: boolean // 是否禁用，默认false
}

// 主题切换组件，提供下拉菜单选择和快速切换功能
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  showLabel = true, // 是否显示文本标签，默认true
  size = '2', // 按钮尺寸，默认2
  variant = 'ghost', // 按钮变体，默认ghost
  className, // 自定义CSS类名
  disabled = false, // 是否禁用，默认false
}): JSX.Element => {
  const { theme, setTheme, isLoaded, getThemeLabel } = useTheme()

  // 主题未加载时显示加载状态
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

  // 获取当前主题对应的图标组件
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
        {/* 渲染主题选项列表 */}
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
          const isActive = theme === value // 检查是否为当前激活主题

          return (
            <DropdownMenu.Item
              key={value}
              onClick={() => setTheme(value)} // 点击切换主题
              className={`flex items-center gap-2 ${isActive ? 'bg-accent-6' : ''}`}
            >
              <Icon size={16} />
              <Text size="2">{label}</Text>
              {/* 当前激活主题显示勾选标记 */}
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

// 简化版主题切换按钮接口 - 仅支持点击切换功能
export interface SimpleThemeToggleProps
  extends Omit<ThemeToggleProps, 'showLabel'> {
  showText?: boolean // 是否显示文本标签
}

// 简化版主题切换组件 - 仅支持点击切换功能，提供更简洁的交互方式
export const SimpleThemeToggle: React.FC<SimpleThemeToggleProps> = ({
  showText = true, // 是否显示文本标签，默认true
  size = '2', // 按钮尺寸，默认2
  variant = 'ghost', // 按钮变体，默认ghost
  className, // 自定义CSS类名
  disabled = false, // 是否禁用，默认false
}) => {
  const { toggleTheme, isDark, isLoaded } = useTheme()

  // 根据当前主题状态选择对应的图标
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
