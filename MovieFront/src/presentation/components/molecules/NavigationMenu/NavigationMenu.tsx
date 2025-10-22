/**
 * @fileoverview 主导航菜单复合组件
 * @description 整合所有子菜单组件的主导航菜单，提供VIP、最近更新、普通分类等完整导航功能，支持hover触发和复合组件模式
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Icon } from '@components/atoms/Icon'
import {
  HomeMenuItem,
  FeaturedContent,
  MediaMenuConfig,
} from '@components/molecules/NavigationMenu'
import {
  pageConfigs,
  NavigationTheme,
  NavigationSize,
} from '@components/molecules/NavigationMenu/designTokens'
import featuredImage from '@images/heroes/0049.jpg'
import React from 'react'

// 延迟导入避免循环依赖 - 使用React.lazy进行代码分割
const HomeMenu = React.lazy(() => import('./HomeMenu'))
const MediaMenu = React.lazy(() => import('./MediaMenu'))
const MoreMenu = React.lazy(() => import('./MoreMenu'))

// 主导航菜单组件属性接口，定义主题、尺寸和页面配置
export interface NavigationMenuProps {
  theme?: NavigationTheme // 主题配置，默认auto
  size?: NavigationSize // 尺寸配置，默认lg
  currentPage?: keyof typeof pageConfigs // 当前页面配置
  className?: string // 自定义CSS类名
}

// 主导航菜单复合组件，整合所有子菜单组件并提供完整的导航功能
export const NavigationMenu: React.FC<NavigationMenuProps> & {
  Home: typeof HomeMenu // 首页菜单子组件
  Media: typeof MediaMenu // 媒体菜单子组件
  More: typeof MoreMenu // 更多菜单子组件
} = ({
  theme = 'auto', // 主题配置，默认自动主题
  size = 'lg', // 尺寸配置，默认大尺寸
  className = '' // 自定义CSS类名，默认空字符串
}) => {
  // 预定义的首页菜单配置 - 包含特色内容和菜单项列表
  const homeMenuConfig: {
    featuredContent: FeaturedContent
    menuItems: HomeMenuItem[]
  } = {
    featuredContent: {
      title: '写真',
      description: '全网最全写真集',
      imageUrl: featuredImage,
      href: '#featured',
    },
    menuItems: [
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
    ],
  }

  // 预定义的媒体菜单配置 - 左右两列布局的菜单项
  const tvShowsMenuConfig: MediaMenuConfig = {
    leftColumn: [
      {
        title: 'New Episodes',
        description: 'Latest episodes this week',
        href: '#new-episodes',
      },
      {
        title: 'Popular Series',
        description: 'Most watched shows',
        href: '#popular-series',
      },
      {
        title: 'Returning Soon',
        description: 'Shows coming back',
        href: '#returning-soon',
      },
    ],
    rightColumn: [
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
    ],
  }

  return (
    <nav
      className={`hidden items-center space-x-6 text-sm font-medium lg:flex ${className}`}
    >
      {/* VIP下拉菜单 - 1024px及以上显示 */}
      <div className="relative group">
        <a
          className="flex h-9 items-center space-x-1 text-gray-700 transition-colors duration-200 group-hover:text-[#6EE7B7] dark:text-gray-300"
          href="#vip"
        >
          VIP
          <Icon
            name="expand_more"
            className="inline-block h-4 w-4 align-middle transition-transform duration-200 group-hover:rotate-180"
          />
        </a>
        <div className="invisible absolute left-0 z-50 mt-1 w-[30rem] rounded-lg border border-primary/30 bg-white/70 opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-primary/50 dark:bg-gray-900/70">
          <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent"></div>
          <React.Suspense
            fallback={<div className="h-64 w-[30rem] animate-pulse" />}
          >
            <HomeMenu
              featuredContent={homeMenuConfig.featuredContent}
              menuItems={homeMenuConfig.menuItems}
              theme={theme}
              size="xl"
            />
          </React.Suspense>
        </div>
      </div>

      {/* 最近更新 - 1024px及以上显示 */}
      <a
        className="hidden h-9 items-center text-gray-700 transition-colors duration-200 dark:text-gray-300 lg:flex"
        style={{ '--hover-color': '#6ee7b7' } as React.CSSProperties}
        href="#recent"
        onMouseEnter={e => ((e.target as HTMLElement).style.color = '#6ee7b7')}
        onMouseLeave={e => ((e.target as HTMLElement).style.color = '')}
      >
        最近更新
      </a>

          {/* 普通分类下拉菜单 - 1024px及以上显示 */}
      <div className="relative group">
        <a
          className="flex h-9 items-center space-x-1 text-gray-700 transition-colors duration-200 group-hover:text-[#6EE7B7] dark:text-gray-300"
          href="#normal"
        >
          普通
          <Icon
            name="expand_more"
            className="inline-block h-4 w-4 align-middle transition-transform duration-200 group-hover:rotate-180"
          />
        </a>
        <div className="invisible absolute left-0 z-50 mt-1 w-80 rounded-lg border border-primary/30 bg-white/70 opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 group-hover:visible group-hover:opacity-100 dark:border-primary/50 dark:bg-gray-900/70">
          <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent"></div>
          <React.Suspense
            fallback={<div className="h-48 w-80 animate-pulse" />}
          >
            <MediaMenu config={tvShowsMenuConfig} theme={theme} size={size} />
          </React.Suspense>
        </div>
      </div>

      {/* 求片 - 1024px及以上显示 */}
      <a
        className="hidden h-9 items-center text-gray-700 transition-colors duration-200 dark:text-gray-300 lg:flex"
        style={{ '--hover-color': '#6ee7b7' } as React.CSSProperties}
        href="#request"
        onMouseEnter={e => ((e.target as HTMLElement).style.color = '#6ee7b7')}
        onMouseLeave={e => ((e.target as HTMLElement).style.color = '')}
      >
        求片
      </a>

      {/* 公告 - 1280px及以上显示 */}
      <a
        className="hidden h-9 items-center text-gray-700 transition-colors duration-200 dark:text-gray-300 xl:flex"
        style={{ '--hover-color': '#6ee7b7' } as React.CSSProperties}
        href="#announcement"
        onMouseEnter={e => ((e.target as HTMLElement).style.color = '#6ee7b7')}
        onMouseLeave={e => ((e.target as HTMLElement).style.color = '')}
      >
        公告
      </a>

      {/* 帮助 - 1280px及以上显示 */}
      <a
        className="hidden h-9 items-center text-gray-700 transition-colors duration-200 dark:text-gray-300 xl:flex"
        style={{ '--hover-color': '#6ee7b7' } as React.CSSProperties}
        href="#help"
        onMouseEnter={e => ((e.target as HTMLElement).style.color = '#6ee7b7')}
        onMouseLeave={e => ((e.target as HTMLElement).style.color = '')}
      >
        帮助
      </a>

      {/* APP - 1280px及以上显示 */}
      <a
        className="hidden h-9 items-center text-gray-700 transition-colors duration-200 dark:text-gray-300 xl:flex"
        style={{ '--hover-color': '#6ee7b7' } as React.CSSProperties}
        href="#app"
        onMouseEnter={e => ((e.target as HTMLElement).style.color = '#6ee7b7')}
        onMouseLeave={e => ((e.target as HTMLElement).style.color = '')}
      >
        APP
      </a>
    </nav>
  )
}

// 复合组件模式 - 允许单独使用子组件，提供更好的组件复用性
NavigationMenu.Home = React.lazy(() => import('./HomeMenu'))
NavigationMenu.Media = React.lazy(() => import('./MediaMenu'))
NavigationMenu.More = React.lazy(() => import('./MoreMenu'))

export default NavigationMenu
