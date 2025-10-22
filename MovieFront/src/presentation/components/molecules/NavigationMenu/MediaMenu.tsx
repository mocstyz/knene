/**
 * @fileoverview 媒体导航菜单组件
 * @description Movies和TV Shows通用的双列布局二级菜单组件，支持高度可复用的配置化菜单项内容，适用于各种媒体分类导航
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  createNavigationStyles,
  NavigationTheme,
  NavigationSize,
} from '@components/molecules/NavigationMenu/designTokens'
import React from 'react'

// 媒体菜单项接口，定义单个菜单项的基本信息
export interface MediaMenuItem {
  title: string // 菜单项标题
  description: string // 菜单项描述
  href: string // 菜单项链接地址
}

// 媒体菜单配置接口，定义左右两列的菜单项配置
export interface MediaMenuConfig {
  leftColumn: MediaMenuItem[] // 左列菜单项列表
  rightColumn: MediaMenuItem[] // 右列菜单项列表
}

// 媒体菜单组件属性接口，定义组件的完整配置参数
export interface MediaMenuProps {
  config: MediaMenuConfig // 菜单配置数据
  theme?: NavigationTheme // 主题配置，默认auto
  size?: NavigationSize // 尺寸配置，默认lg
  className?: string // 自定义CSS类名
}

// 媒体导航菜单组件，提供Movies和TV Shows通用的双列布局菜单
export const MediaMenu: React.FC<MediaMenuProps> = ({
  config, // 菜单配置数据
  theme = 'auto', // 主题配置，默认自动主题
  size = 'lg', // 尺寸配置，默认大尺寸
  className = '', // 自定义CSS类名，默认空字符串
}) => {
  // 根据主题和尺寸生成导航样式
  const styles = createNavigationStyles('default', theme, size)

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="grid grid-cols-2 gap-x-6">
        {/* 左列菜单区域 */}
        <div className={styles.spacing}>
          {config.leftColumn.map((item, index) => (
            <a
              key={`left-${index}`}
              href={item.href}
              className={`block px-3 py-2 ${styles.hoverEffect} rounded-md transition-colors`}
            >
              <div className={`${styles.text} transition-colors duration-200`}>
                {item.title}
              </div>
              <div className={styles.textSecondary}>{item.description}</div>
            </a>
          ))}
        </div>

        {/* 右列菜单区域 */}
        <div className={styles.spacing}>
          {config.rightColumn.map((item, index) => (
            <a
              key={`right-${index}`}
              href={item.href}
              className={`block px-3 py-2 ${styles.hoverEffect} rounded-md transition-colors`}
            >
              <div className={`${styles.text} transition-colors duration-200`}>
                {item.title}
              </div>
              <div className={styles.textSecondary}>{item.description}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MediaMenu
