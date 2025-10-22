/**
 * @fileoverview 导航菜单项组件
 * @description 处理单个导航项的展开/收起逻辑，支持二级菜单的显示/隐藏，提供展开/收起的视觉反馈，确保同时只有一个二级菜单展开
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Icon } from '@components/atoms/Icon'
import React from 'react'

// 导航菜单项属性接口，定义单个导航项的完整配置参数
export interface NavigationMenuItemProps {
  title: string // 菜单标题
  href: string // 菜单链接地址
  description: string // 菜单描述文本
  icon?: string // 可选的图标名称
  hasSubmenu?: boolean // 是否包含子菜单，默认false
  submenuContent?: React.ReactNode // 子菜单内容组件
  currentPage?: string // 当前页面标识符
  isExpanded?: boolean // 是否展开状态，默认false
  onItemClick?: () => void // 菜单项点击回调函数
  className?: string // 自定义CSS类名
}

// 导航菜单项组件，处理单个导航项的展开/收起逻辑和二级菜单显示
export const NavigationMenuItem: React.FC<NavigationMenuItemProps> = ({
  title, // 菜单标题
  href, // 菜单链接地址
  description, // 菜单描述文本
  icon, // 可选的图标名称
  hasSubmenu = false, // 是否包含子菜单，默认false
  submenuContent, // 子菜单内容组件
  currentPage, // 当前页面标识符
  isExpanded = false, // 是否展开状态，默认false
  onItemClick, // 菜单项点击回调函数
  className = '', // 自定义CSS类名，默认空字符串
}) => {
  // 处理菜单项点击事件 - 有子菜单时阻止默认跳转行为
  const handleClick = (e: React.MouseEvent) => {
    if (hasSubmenu) {
      e.preventDefault() // 阻止链接默认跳转
    }
    onItemClick?.() // 执行点击回调
  }

  // 根据展开状态获取对应的展开图标
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

        {/* 二级菜单展开区域 - 根据展开状态显示/隐藏子菜单内容 */}
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
