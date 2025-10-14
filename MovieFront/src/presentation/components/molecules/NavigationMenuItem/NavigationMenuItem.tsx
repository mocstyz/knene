import { Icon } from '@components/atoms/Icon'
import React from 'react'

/**
 * 导航菜单项属性
 */
export interface NavigationMenuItemProps {
  /** 菜单标题 */
  title: string
  /** 菜单链接 */
  href: string
  /** 菜单描述 */
  description: string
  /** 图标名称 */
  icon?: string
  /** 是否为可展开菜单项 */
  hasSubmenu?: boolean
  /** 子菜单内容 */
  submenuContent?: React.ReactNode
  /** 当前页面标识 */
  currentPage?: string
  /** 是否展开 */
  isExpanded?: boolean
  /** 菜单项点击回调 */
  onItemClick?: () => void
  /** 自定义类名 */
  className?: string
}

/**
 * NavigationMenuItem分子组件
 *
 * 功能：
 * - 处理单个导航项的展开/收起逻辑
 * - 支持二级菜单的显示/隐藏
 * - 提供展开/收起的视觉反馈
 * - 确保同时只有一个二级菜单展开
 */
export const NavigationMenuItem: React.FC<NavigationMenuItemProps> = ({
  title,
  href,
  description,
  icon,
  hasSubmenu = false,
  submenuContent,
  currentPage,
  isExpanded = false,
  onItemClick,
  className = '',
}) => {
  // 处理菜单项点击
  const handleClick = (e: React.MouseEvent) => {
    if (hasSubmenu) {
      e.preventDefault()
    }
    onItemClick?.()
  }

  // 获取展开图标
  const expandIcon = isExpanded ? 'expand_more' : 'chevron_right'

  return (
    <li role="none">
      {/* 主菜单项 */}
      <a
        href={href}
        className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition-all duration-200 ease-in-out hover:bg-green-100 hover:text-green-600 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-primary/40 focus:ring-offset-1 focus:ring-offset-transparent dark:text-gray-300 dark:hover:bg-green-900/20 dark:hover:text-green-400 ${currentPage === href?.slice(1) ? 'bg-primary text-white focus:bg-primary focus:text-white' : ''} ${hasSubmenu ? 'cursor-pointer' : ''} ${className} `}
        role="menuitem"
        onClick={handleClick}
      >
        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
          {icon && <Icon name={icon} size="sm" />}
        </div>
        <div className="flex-1">
          <div className="font-medium">{title}</div>
          <div className="text-sm opacity-75">{description}</div>
        </div>
        {hasSubmenu && (
          <Icon
            name={expandIcon}
            size="xs"
            className={`opacity-50 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} `}
          />
        )}
      </a>

      {/* 二级菜单 */}
      {hasSubmenu && submenuContent && (
        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} `}
        >
          <div className="mt-1 border-t border-gray-200 dark:border-gray-700">
            <div className="py-2 pl-8 pr-4">{submenuContent}</div>
          </div>
        </div>
      )}
    </li>
  )
}

NavigationMenuItem.displayName = 'NavigationMenuItem'

export default NavigationMenuItem
