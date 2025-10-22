/**
 * @fileoverview 更多选项导航菜单组件
 * @description More选项专用的简洁列表样式二级菜单组件，支持图标显示和紧凑布局，适用于网站更多功能的导航展示
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Icon } from '@components/atoms/Icon'
import {
  createNavigationStyles,
  NavigationTheme,
  NavigationSize,
} from '@components/molecules/NavigationMenu/designTokens'
import React from 'react'

// 更多菜单项接口，定义菜单项的基本信息和可选图标
export interface MoreMenuItem {
  title: string // 菜单项标题
  href: string // 菜单项链接地址
  icon?: string // 可选的菜单项图标名称
}

// 更多菜单组件属性接口，定义组件的完整配置参数
export interface MoreMenuProps {
  menuItems: MoreMenuItem[] // 菜单项列表
  theme?: NavigationTheme // 主题配置，默认auto
  size?: NavigationSize // 尺寸配置，默认md
  className?: string // 自定义CSS类名
}

// 更多选项导航菜单组件，提供简洁的列表样式菜单布局
export const MoreMenu: React.FC<MoreMenuProps> = ({
  menuItems, // 菜单项列表
  theme = 'auto', // 主题配置，默认自动主题
  size = 'md', // 尺寸配置，默认中等尺寸
  className = '', // 自定义CSS类名，默认空字符串
}) => {
  // 根据主题和尺寸生成导航样式
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
