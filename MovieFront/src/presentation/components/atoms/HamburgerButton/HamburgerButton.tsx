/**
 * @fileoverview 汉堡菜单按钮组件
 * @description 移动端导航菜单开关按钮，支持开启/关闭状态切换、平滑动画过渡效果和完整的可访问性支持
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 15:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Icon } from '@components/atoms/Icon'
import React from 'react'

// 汉堡菜单按钮组件属性接口，定义按钮的各种配置选项
export interface HamburgerButtonProps {
  isOpen?: boolean // 是否开启状态
  onClick?: () => void // 点击回调函数
  size?: 'sm' | 'md' | 'lg' // 按钮尺寸
  className?: string // 自定义CSS类名
  disabled?: boolean // 是否禁用状态
  ariaLabel?: string // ARIA标签，用于无障碍访问
}

// 汉堡菜单按钮原子组件，功能：移动端导航菜单开关按钮，支持开启/关闭状态切换，24px × 24px 标准尺寸，平滑的动画过渡效果，完整的可访问性支持
export const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  isOpen = false,
  onClick,
  size = 'md',
  className = '',
  disabled = false,
  ariaLabel = isOpen ? '关闭菜单' : '打开菜单',
}) => {
  // 按钮尺寸样式映射表 - 定义不同尺寸的宽度和高度
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
  }

  // 图标尺寸映射表 - 将按钮尺寸映射到对应的图标尺寸
  const iconSizes: Record<string, 'xs' | 'sm' | 'md' | 'lg' | 'xl'> = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
  }

  return (
    <button
      type="button"
      className={` ${sizeClasses[size]} inline-flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className} `}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation-menu"
    >
      <span className="sr-only">{ariaLabel}</span>
      <Icon
        name={isOpen ? 'close' : 'menu'}
        size={iconSizes[size]}
        className={`transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-90' : 'rotate-0'} `}
      />
    </button>
  )
}

HamburgerButton.displayName = 'HamburgerButton'

export default HamburgerButton
