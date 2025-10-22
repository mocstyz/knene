/**
 * @fileoverview 首页导航菜单组件
 * @description 首页专用的带图片展示的二级菜单组件，左侧展示特色内容图片，右侧显示文本链接列表，支持主题和尺寸变体
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  createNavigationStyles,
  NavigationTheme,
  NavigationSize,
} from '@components/molecules/NavigationMenu/designTokens'
import { getOverlayGradient } from '@tokens/design-system'
import { cn } from '@utils/cn'
import React from 'react'

// 特色内容数据接口，定义左侧展示的特色内容信息
export interface FeaturedContent {
  title: string // 特色内容标题
  description: string // 特色内容描述
  imageUrl: string // 特色内容图片地址
  href: string // 特色内容链接地址
}

// 首页菜单项接口，定义右侧文本链接的菜单项信息
export interface HomeMenuItem {
  title: string // 菜单项标题
  description: string // 菜单项描述
  href: string // 菜单项链接地址
}

// 首页菜单组件属性接口，定义组件的完整配置参数
export interface HomeMenuProps {
  featuredContent: FeaturedContent // 特色内容数据
  menuItems: HomeMenuItem[] // 菜单项列表
  theme?: NavigationTheme // 主题配置，默认auto
  size?: NavigationSize // 尺寸配置，默认lg
  className?: string // 自定义CSS类名
}

// 首页导航菜单组件，提供左侧特色内容图片和右侧文本链接列表的布局
export const HomeMenu: React.FC<HomeMenuProps> = ({
  featuredContent, // 特色内容数据
  menuItems, // 菜单项列表
  theme = 'auto', // 主题配置，默认自动主题
  size = 'lg', // 尺寸配置，默认大尺寸
  className = '', // 自定义CSS类名，默认空字符串
}) => {
  // 根据主题和尺寸生成导航样式
  const styles = createNavigationStyles('default', theme, size)

  return (
    <div className={`${styles.container} ${className}`}>
      <div className="grid grid-cols-2 gap-6">
        {/* 左列 - 特色内容图片展示区域 */}
        <div className="space-y-3">
          <div className="group/image relative aspect-[2/3] w-52 overflow-hidden rounded-lg">
            <a href={featuredContent.href} className="block h-full">
              <img
                src={featuredContent.imageUrl}
                alt={featuredContent.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover/image:scale-105"
              />
              <div
                className={cn(
                  'absolute inset-0',
                  getOverlayGradient('intense')
                )}
              ></div>
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

        {/* 右列 - 文本链接列表区域 */}
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
