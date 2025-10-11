import {
  createNavigationStyles,
  NavigationTheme,
  NavigationSize,
} from '@components/molecules/NavigationMenu/designTokens'
import React from 'react'

// 菜单项接口定义
export interface MediaMenuItem {
  title: string
  description: string
  href: string
}

// 媒体菜单配置接口
export interface MediaMenuConfig {
  leftColumn: MediaMenuItem[]
  rightColumn: MediaMenuItem[]
}

// MediaMenu组件属性
export interface MediaMenuProps {
  config: MediaMenuConfig
  theme?: NavigationTheme
  size?: NavigationSize
  className?: string
}

/**
 * MediaMenu组件 - Movies和TV Shows通用的二级菜单
 *
 * 特点：
 * - 支持双列布局
 * - 可配置菜单项内容
 * - 支持主题和尺寸变体
 * - 高度可复用性
 */
export const MediaMenu: React.FC<MediaMenuProps> = ({
  config,
  theme = 'auto',
  size = 'lg',
  className = '',
}) => {
  const styles = createNavigationStyles('default', theme, size)

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="grid grid-cols-2 gap-x-6">
        {/* 左列 */}
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

        {/* 右列 */}
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
