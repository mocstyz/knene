import { Icon } from '@components/atoms/Icon'
import {
  createNavigationStyles,
  NavigationTheme,
  NavigationSize,
} from '@components/molecules/NavigationMenu/designTokens'
import React from 'react'

// 菜单项接口
export interface MoreMenuItem {
  title: string
  href: string
  icon?: string
}

// MoreMenu组件属性
export interface MoreMenuProps {
  menuItems: MoreMenuItem[]
  theme?: NavigationTheme
  size?: NavigationSize
  className?: string
}

/**
 * MoreMenu组件 - More选项专用二级菜单
 *
 * 特点：
 * - 简洁的列表样式
 * - 支持图标显示
 * - 紧凑布局
 * - 支持主题和尺寸变体
 */
export const MoreMenu: React.FC<MoreMenuProps> = ({
  menuItems,
  theme = 'auto',
  size = 'md',
  className = '',
}) => {
  const styles = createNavigationStyles('default', theme, size)

  return (
    <div
      className={`${styles.container} border border-green-200 dark:border-green-800 ${className}`}
    >
      <div className={styles.spacing}>
        {menuItems.map((item, index) => (
          <a
            key={`more-${index}`}
            href={item.href}
            className={`dropdown-item block rounded-md px-4 py-2 transition-colors`}
          >
            <div className="flex items-center space-x-2">
              {item.icon && <Icon name={item.icon} size="sm" />}
              <span className={`${styles.text} transition-colors duration-200`}>
                {item.title}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default MoreMenu
