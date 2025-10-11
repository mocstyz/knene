import {
  createNavigationStyles,
  NavigationTheme,
  NavigationSize,
} from '@components/molecules/NavigationMenu/designTokens'
import React from 'react'

// 特色内容接口
export interface FeaturedContent {
  title: string
  description: string
  imageUrl: string
  href: string
}

// 菜单项接口
export interface HomeMenuItem {
  title: string
  description: string
  href: string
}

// HomeMenu组件属性
export interface HomeMenuProps {
  featuredContent: FeaturedContent
  menuItems: HomeMenuItem[]
  theme?: NavigationTheme
  size?: NavigationSize
  className?: string
}

/**
 * HomeMenu组件 - 首页专用带图片的二级菜单
 *
 * 特点：
 * - 左侧展示特色内容图片
 * - 右侧显示文本链接列表
 * - 支持主题和尺寸变体
 * - 独特的视觉设计
 */
export const HomeMenu: React.FC<HomeMenuProps> = ({
  featuredContent,
  menuItems,
  theme = 'auto',
  size = 'lg',
  className = '',
}) => {
  const styles = createNavigationStyles('default', theme, size)

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="grid grid-cols-2 gap-6">
        {/* 左列 - 特色内容图片 */}
        <div className="space-y-3">
          <div className="group/image relative aspect-[2/3] w-52 overflow-hidden rounded-lg">
            <a href={featuredContent.href} className="block h-full">
              <img
                src={featuredContent.imageUrl}
                alt={featuredContent.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover/image:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 z-10">
                <div
                  className={`${styles.text} text-red-500 transition-colors duration-200`}
                >
                  {featuredContent.title}
                </div>
                <div className={`mt-1 ${styles.textSecondary} text-red-500`}>
                  {featuredContent.description}
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* 右列 - 文本链接 */}
        <div className="flex h-full flex-col justify-between">
          {menuItems.map((item, index) => (
            <a
              key={`menu-${index}`}
              href={item.href}
              className={`block px-3 py-2 ${styles.hoverEffect} flex flex-1 items-center rounded-md transition-colors`}
            >
              <div className="w-full">
                <div
                  className={`${styles.text} transition-colors duration-200`}
                >
                  {item.title}
                </div>
                <div className={`mt-1 ${styles.textSecondary}`}>
                  {item.description}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeMenu
