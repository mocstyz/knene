import { Icon } from '@components/atoms/Icon'
import React from 'react'

/**
 * 汉堡菜单按钮组件属性
 */
export interface HamburgerButtonProps {
  /** 是否开启状态 */
  isOpen?: boolean
  /** 点击回调 */
  onClick?: () => void
  /** 按钮大小 */
  size?: 'sm' | 'md' | 'lg'
  /** 自定义类名 */
  className?: string
  /** 是否禁用 */
  disabled?: boolean
  /** ARIA标签 */
  ariaLabel?: string
}

/**
 * 汉堡菜单按钮原子组件
 *
 * 功能：
 * - 移动端导航菜单开关按钮
 * - 支持开启/关闭状态切换
 * - 24px × 24px 标准尺寸
 * - 平滑的动画过渡效果
 * - 完整的可访问性支持
 *
 * 规范：
 * - 位置：头部右侧
 * - 交互：点击切换菜单状态
 * - 状态：支持键盘导航（ESC关闭）
 * - 动画：200ms ease-in-out过渡
 */
export const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  isOpen = false,
  onClick,
  size = 'md',
  className = '',
  disabled = false,
  ariaLabel = isOpen ? '关闭菜单' : '打开菜单',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
  }

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
