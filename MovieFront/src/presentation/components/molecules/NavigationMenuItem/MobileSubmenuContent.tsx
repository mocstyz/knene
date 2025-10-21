/**
 * @fileoverview 移动端子菜单内容组件
 * @description 移动端二级菜单内容渲染组件，提供统一的子菜单样式和交互处理，支持点击关闭菜单功能
 * @created 2025-10-21 10:28:14
 * @updated 2025-10-21 11:12:43
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'

// 移动端子菜单项接口，定义单个子菜单项的基本信息
export interface MobileSubmenuItem {
  title: string // 菜单项标题
  description: string // 菜单项描述
  href: string // 菜单项链接地址
}

// 移动端子菜单内容组件属性接口，定义组件的完整配置参数
export interface MobileSubmenuContentProps {
  items: MobileSubmenuItem[] // 子菜单项列表
  onClose?: () => void // 子菜单关闭回调函数
  className?: string // 自定义CSS类名
}

// 移动端子菜单内容组件，渲染二级菜单内容并处理点击事件
export const MobileSubmenuContent: React.FC<MobileSubmenuContentProps> = ({
  items, // 子菜单项列表
  onClose, // 子菜单关闭回调函数
  className = '', // 自定义CSS类名，默认空字符串
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {items.map((item, index) => (
        <a
          key={`submenu-${index}`}
          href={item.href}
          className={`flex items-center rounded-md px-3 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-green-50 hover:text-green-600 dark:text-gray-400 dark:hover:bg-green-900/10 dark:hover:text-green-400`}
          // 处理菜单项点击事件 - 点击后自动关闭子菜单
          onClick={() => {
            onClose?.()
          }}
        >
          <div className="flex-1">
            <div className="font-medium">{item.title}</div>
            <div className="text-xs opacity-75">{item.description}</div>
          </div>
        </a>
      ))}
    </div>
  )
}

MobileSubmenuContent.displayName = 'MobileSubmenuContent'

export default MobileSubmenuContent
