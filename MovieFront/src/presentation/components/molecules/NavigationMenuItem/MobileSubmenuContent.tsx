import React from 'react'

/**
 * 移动端子菜单项属性
 */
export interface MobileSubmenuItem {
  /** 菜单项标题 */
  title: string
  /** 菜单项描述 */
  description: string
  /** 菜单项链接 */
  href: string
}

/**
 * 移动端子菜单内容属性
 */
export interface MobileSubmenuContentProps {
  /** 子菜单项列表 */
  items: MobileSubmenuItem[]
  /** 子菜单关闭回调 */
  onClose?: () => void
  /** 自定义类名 */
  className?: string
}

/**
 * MobileSubmenuContent组件
 *
 * 功能：
 * - 渲染移动端二级菜单内容
 * - 提供统一的子菜单样式
 * - 处理子菜单项点击事件
 */
export const MobileSubmenuContent: React.FC<MobileSubmenuContentProps> = ({
  items,
  onClose,
  className = '',
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {items.map((item, index) => (
        <a
          key={`submenu-${index}`}
          href={item.href}
          className={`flex items-center rounded-md px-3 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-green-50 hover:text-green-600 dark:text-gray-400 dark:hover:bg-green-900/10 dark:hover:text-green-400`}
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
