/**
 * @fileoverview 移动端导航抽屉组件
 * @description 提供完整的移动端导航功能，支持侧滑抽屉式导航菜单，包含VIP、最近更新、普通分类等导航项，以及搜索、认证、主题切换等底部功能
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Button } from '@components/atoms/Button'
import { Icon } from '@components/atoms/Icon'
import { SimpleThemeToggle } from '@components/molecules'
import {
  NavigationMenuItem,
  MobileSubmenuContent,
} from '@components/molecules/NavigationMenuItem'
import React, { useEffect, useRef, useState } from 'react'

// 移动端导航抽屉组件属性接口，定义抽屉的显示状态和功能配置
export interface MobileNavigationDrawerProps {
  isOpen: boolean // 抽屉开启状态
  onClose: () => void // 关闭抽屉回调函数
  showSearch?: boolean // 是否显示搜索框
  showAuth?: boolean // 是否显示认证区域
  searchPlaceholder?: string // 搜索框占位符文本
  loginText?: string // 登录按钮文本
  registerText?: string // 注册按钮文本
  currentPage?: string // 当前页面标识符
  className?: string // 自定义CSS类名
}

// 移动端导航抽屉组件，支持侧滑式导航菜单和完整的功能区域
export const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  isOpen, // 抽屉开启状态
  onClose, // 关闭抽屉回调函数
  showSearch = true, // 是否显示搜索框，默认显示
  showAuth = true, // 是否显示认证区域，默认显示
  searchPlaceholder = 'Search...', // 搜索框占位符，默认英文
  loginText = 'Log In', // 登录按钮文本，默认英文
  registerText = 'Register', // 注册按钮文本，默认英文
  currentPage = 'home', // 当前页面标识，默认主页
  className = '', // 自定义CSS类名，默认空字符串
}) => {
  const drawerRef = useRef<HTMLDivElement>(null) // 抽屉容器引用
  const backdropRef = useRef<HTMLDivElement>(null) // 背景遮罩引用
  const [expandedItem, setExpandedItem] = useState<string | null>(null) // 当前展开的菜单项

  // VIP子菜单配置 - 包含特效字幕、原盘DIY、原盘压制、专题等VIP专享内容
  const vipSubmenuItems = [
    {
      title: '特效字幕',
      description: '最精致的特效字幕',
      href: '#movies',
    },
    {
      title: '原盘DIY',
      description: '生肉变熟肉更享受',
      href: '#tvshows',
    },
    {
      title: '原盘压制',
      description: '小体积收藏最佳实践',
      href: '#genres',
    },
    {
      title: '专题',
      description: '精心整理不用费心全网搜',
      href: '#special',
    },
  ]

  // 普通子菜单配置 - 包含最新剧集、热门系列、回归剧集、剧集类型等普通内容
  const normalSubmenuItems = [
    {
      title: 'New Episodes',
      description: 'Latest episodes this week',
      href: '#new-episodes',
    },
    {
      title: 'Top Rated Series',
      description: 'Highest rated shows',
      href: '#top-rated-series',
    },
    {
      title: 'Returning Soon',
      description: 'Shows coming back',
      href: '#returning-soon',
    },
    {
      title: 'Drama Series',
      description: 'Compelling dramas',
      href: '#drama-series',
    },
    {
      title: 'Comedy Series',
      description: 'Funny shows',
      href: '#comedy-series',
    },
    {
      title: 'Documentaries',
      description: 'Real stories',
      href: '#documentaries',
    },
  ]

  // 导航菜单项配置 - 与桌面端主导航保持一致的完整导航结构
  const navigationItems = [
    {
      title: 'VIP',
      href: '#vip',
      icon: 'vip',
      description: '专属特权，高清下载',
      hasSubmenu: true,
      submenuContent: (
        <MobileSubmenuContent items={vipSubmenuItems} onClose={onClose} />
      ),
    },
    {
      title: '最近更新',
      href: '#recent',
      icon: 'update',
      description: '最新影视资源',
      hasSubmenu: false,
    },
    {
      title: '普通',
      href: '#normal',
      description: '普通影视资源',
      hasSubmenu: true,
      submenuContent: (
        <MobileSubmenuContent items={normalSubmenuItems} onClose={onClose} />
      ),
    },
    {
      title: '求片',
      href: '#request',
      icon: 'request',
      description: '发布求片需求',
      hasSubmenu: false,
    },
    {
      title: '公告',
      href: '#announcement',
      icon: 'announcement',
      description: '最新公告动态',
      hasSubmenu: false,
    },
    {
      title: '帮助',
      href: '#help',
      icon: 'help',
      description: '使用帮助指南',
      hasSubmenu: false,
    },
    {
      title: 'APP',
      href: '#app',
      icon: 'app',
      description: '移动端APP下载',
      hasSubmenu: false,
    },
  ]

  // 处理菜单项展开/收起 - 切换指定菜单项的展开状态
  const handleMenuItemToggle = (href: string) => {
    setExpandedItem(expandedItem === href ? null : href)
  }

  // 处理背景点击关闭 - 点击背景遮罩时关闭抽屉并重置展开状态
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      setExpandedItem(null)
      onClose()
    }
  }

  // ESC键关闭处理 - 监听键盘事件，按下ESC键时关闭抽屉
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setExpandedItem(null)
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // 焦点管理：菜单打开时聚焦到抽屉容器而不是第一个导航项，避免自动选中第一个菜单项导致的绿色边框
      drawerRef.current?.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // 阻止背景滚动 - 抽屉打开时禁用body滚动，关闭时恢复
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* 背景遮罩层 - 只在移动端显示，支持点击关闭 */}
      <div
        ref={backdropRef}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'} lg:hidden`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* 导航抽屉主体 - 只在移动端显示，从右侧滑出 */}
      <div
        ref={drawerRef}
        id="mobile-navigation-menu"
        className={`fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] transform bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-gray-900 ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${className} lg:hidden`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-nav-title"
        tabIndex={-1}
      >
        {/* 抽屉头部区域 - 包含标题和关闭按钮 */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <h2
            id="mobile-nav-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            导航菜单
          </h2>
          <button
            type="button"
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            onClick={onClose}
            aria-label="关闭菜单"
          >
            <Icon name="close" size="md" />
          </button>
        </div>

        {/* 导航列表区域 - 包含所有导航菜单项 */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1" role="menu">
            {navigationItems.map(item => (
              <NavigationMenuItem
                key={item.href}
                title={item.title}
                href={item.href}
                description={item.description}
                icon={item.icon}
                hasSubmenu={item.hasSubmenu}
                submenuContent={item.submenuContent}
                currentPage={currentPage}
                isExpanded={
                  item.hasSubmenu ? expandedItem === item.href : false
                }
                onItemClick={() => {
                  if (!item.hasSubmenu) {
                    onClose()
                  } else {
                    handleMenuItemToggle(item.href)
                  }
                }}
              />
            ))}
          </ul>
        </nav>

        {/* 底部功能区 - 包含搜索、认证、主题切换等功能 */}
        <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-700">
          {/* 搜索功能区域 - 提供全局搜索输入框 */}
          {showSearch && (
            <div className="relative">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300"
                size="sm"
              />
              <input
                className="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                placeholder={searchPlaceholder}
                type="text"
                aria-label="搜索"
              />
            </div>
          )}

          {/* 用户认证区域 - 提供登录和注册按钮 */}
          {showAuth && (
            <div className="space-y-3">
              <a
                className="flex h-10 w-full items-center justify-center rounded-lg border border-gray-300 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                href="#login"
              >
                {loginText}
              </a>
              <Button variant="primary" size="sm" className="h-10 w-full">
                {registerText}
              </Button>
            </div>
          )}

          {/* 主题切换区域 - 提供明暗主题切换功能 */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              主题模式
            </span>
            <SimpleThemeToggle
              showText={false}
              size="1"
              variant="ghost"
              className="h-9 w-9 rounded-full bg-white/20 p-0 backdrop-blur-sm hover:bg-white/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 [&_svg]:stroke-gray-700 dark:[&_svg]:stroke-green-400"
            />
          </div>
        </div>
      </div>
    </>
  )
}

MobileNavigationDrawer.displayName = 'MobileNavigationDrawer'

export default MobileNavigationDrawer
