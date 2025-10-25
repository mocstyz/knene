/**
 * @fileoverview 用户仪表板页面组件
 * @description 用户仪表板主组件，提供个人中心的全功能展示，包括用户统计信息、
 *              最近观看记录、下载管理、收藏管理等核心功能，支持标签页切换和
 *              响应式布局，为用户提供完整的个人数据管理体验
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useCurrentUser } from '@application/hooks'
import { Button, Icon } from '@components/atoms'
import { UserTemplate } from '@components/templates'
import {
  formatDateShort,
  getStatusColor,
  getStatusText,
} from '@utils/formatters'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

// 模拟数据 - 用于开发和演示的用户仪表板数据
const mockRecentMovies = [
  {
    id: '1',
    title: '复仇者联盟：终局之战',
    poster: 'https://via.placeholder.com/200x300/1e40af/ffffff?text=Avengers',
    progress: 85,
    lastWatched: '2024-01-15',
  },
  {
    id: '2',
    title: '星际穿越',
    poster:
      'https://via.placeholder.com/200x300/059669/ffffff?text=Interstellar',
    progress: 45,
    lastWatched: '2024-01-14',
  },
  {
    id: '3',
    title: '盗梦空间',
    poster: 'https://via.placeholder.com/200x300/dc2626/ffffff?text=Inception',
    progress: 100,
    lastWatched: '2024-01-13',
  },
]

// 模拟下载数据 - 展示不同下载状态的影片列表
const mockDownloads = [
  {
    id: '1',
    title: '蜘蛛侠：英雄无归',
    progress: 75,
    speed: '2.5 MB/s',
    status: 'downloading' as const,
  },
  {
    id: '2',
    title: '沙丘',
    progress: 100,
    speed: '0 MB/s',
    status: 'completed' as const,
  },
  {
    id: '3',
    title: '黑客帝国：矩阵重启',
    progress: 30,
    speed: '1.8 MB/s',
    status: 'paused' as const,
  },
]

// 用户仪表板页面组件 - 提供个人中心的全功能展示和管理
const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useCurrentUser()
  const [activeTab, setActiveTab] = useState<
    'overview' | 'recent' | 'downloads' | 'favorites'
  >('overview')

  // 认证状态检查 - 未登录用户显示登录引导界面
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Icon name="user" size="xl" className="mx-auto mb-4 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">请先登录</h2>
          <p className="mb-4 text-gray-600">您需要登录才能访问仪表板</p>
          <Link to="/auth/login">
            <Button variant="primary">立即登录</Button>
          </Link>
        </div>
      </div>
    )
  }

  // 页面头部内容 - 包含用户信息展示和快捷操作按钮
  const headerContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
          <Icon name="user" className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            欢迎回来，{user.username}
          </h1>
          <p className="text-gray-600">
            {user.subscription?.type === 'premium' ? '高级会员' : '普通用户'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="sm">
          <Icon name="settings" size="sm" className="mr-2" />
          设置
        </Button>
        <Link to="/user/profile">
          <Button variant="primary" size="sm">
            <Icon name="user" size="sm" className="mr-2" />
            个人资料
          </Button>
        </Link>
      </div>
    </div>
  )

  // 侧边栏导航内容 - 提供功能模块的快速切换
  const sidebarContent = (
    <nav className="space-y-2">
      <button
        onClick={() => setActiveTab('overview')}
        className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors ${
          activeTab === 'overview'
            ? 'border-r-2 border-blue-700 bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Icon name="home" size="sm" />
        概览
      </button>
      <button
        onClick={() => setActiveTab('recent')}
        className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors ${
          activeTab === 'recent'
            ? 'border-r-2 border-blue-700 bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Icon name="clock" size="sm" />
        最近观看
      </button>
      <button
        onClick={() => setActiveTab('downloads')}
        className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors ${
          activeTab === 'downloads'
            ? 'border-r-2 border-blue-700 bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Icon name="download" size="sm" />
        下载管理
      </button>
      <button
        onClick={() => setActiveTab('favorites')}
        className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left transition-colors ${
          activeTab === 'favorites'
            ? 'border-r-2 border-blue-700 bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Icon name="heart" size="sm" />
        我的收藏
      </button>
    </nav>
  )

  // 概览页面渲染函数 - 展示用户统计信息和快速操作
  const renderOverview = () => (
    <div className="space-y-6">
      {/* 统计卡片 - 展示观看时长、收藏数量、下载数量、会员等级 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">观看时长</p>
              <p className="text-2xl font-bold text-gray-900">128小时</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Icon name="clock" className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">收藏影片</p>
              <p className="text-2xl font-bold text-gray-900">42部</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <Icon name="heart" className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">下载数量</p>
              <p className="text-2xl font-bold text-gray-900">15部</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Icon name="download" className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">会员等级</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.subscription?.type === 'premium' ? 'VIP' : '普通'}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
              <Icon name="star" className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作区域 - 提供常用功能的快捷入口 */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">快速操作</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Link to="/movie/search">
            <Button variant="outline" className="w-full">
              <Icon name="search" size="sm" className="mr-2" />
              搜索影片
            </Button>
          </Link>
          <Link to="/user/downloads">
            <Button variant="outline" className="w-full">
              <Icon name="download" size="sm" className="mr-2" />
              下载管理
            </Button>
          </Link>
          <Link to="/user/favorites">
            <Button variant="outline" className="w-full">
              <Icon name="heart" size="sm" className="mr-2" />
              我的收藏
            </Button>
          </Link>
          <Link to="/user/settings">
            <Button variant="outline" className="w-full">
              <Icon name="settings" size="sm" className="mr-2" />
              账户设置
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )

  // 最近观看页面渲染函数 - 展示用户最近观看的影片列表和观看进度
  const renderRecentMovies = () => (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b p-6">
        <h3 className="text-lg font-semibold text-gray-900">最近观看</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockRecentMovies.map(movie => (
            <div key={movie.id} className="cursor-pointer group">
              <div className="relative mb-3 aspect-[2/3] overflow-hidden rounded-lg">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-200 group-hover:bg-opacity-20" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="rounded bg-black bg-opacity-75 px-2 py-1">
                    <div className="flex items-center justify-between text-xs text-white">
                      <span>{movie.progress}%</span>
                      <span>{formatDateShort(movie.lastWatched)}</span>
                    </div>
                    <div className="mt-1 h-1 w-full rounded-full bg-gray-600">
                      <div
                        className="h-1 rounded-full bg-blue-500"
                        style={{ width: `${movie.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                {movie.title}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // 下载管理页面渲染函数 - 展示下载任务列表和控制操作
  const renderDownloads = () => (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">下载管理</h3>
          <Button variant="primary" size="sm">
            <Icon name="plus" size="sm" className="mr-2" />
            新建下载
          </Button>
        </div>
      </div>
      <div className="divide-y">
        {mockDownloads.map(download => (
          <div key={download.id} className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-medium text-gray-900">{download.title}</h4>
              <span
                className={`text-sm font-medium ${getStatusColor(download.status)}`}
              >
                {getStatusText(download.status)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full ${
                      download.status === 'completed'
                        ? 'bg-green-500'
                        : download.status === 'downloading'
                          ? 'bg-blue-500'
                          : 'bg-yellow-500'
                    }`}
                    style={{ width: `${download.progress}%` }}
                  />
                </div>
              </div>
              <span className="min-w-0 text-sm text-gray-600">
                {download.progress}%
              </span>
              <span className="min-w-0 text-sm text-gray-600">
                {download.speed}
              </span>
              <div className="flex items-center gap-2">
                {download.status === 'downloading' && (
                  <Button variant="outline" size="xs">
                    <Icon name="pause" size="xs" />
                  </Button>
                )}
                {download.status === 'paused' && (
                  <Button variant="outline" size="xs">
                    <Icon name="play" size="xs" />
                  </Button>
                )}
                <Button variant="outline" size="xs">
                  <Icon name="trash" size="xs" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // 我的收藏页面渲染函数 - 展示用户收藏的影片列表
  const renderFavorites = () => (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b p-6">
        <h3 className="text-lg font-semibold text-gray-900">我的收藏</h3>
      </div>
      <div className="p-6">
        <div className="py-12 text-center">
          <Icon name="heart" size="xl" className="mx-auto mb-4 text-gray-400" />
          <h4 className="mb-2 text-lg font-medium text-gray-900">暂无收藏</h4>
          <p className="mb-4 text-gray-600">开始收藏您喜欢的影片吧</p>
          <Link to="/movie/search">
            <Button variant="primary">
              <Icon name="search" size="sm" className="mr-2" />
              发现影片
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )

  // 内容渲染控制函数 - 根据当前选中的标签页渲染对应内容
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'recent':
        return renderRecentMovies()
      case 'downloads':
        return renderDownloads()
      case 'favorites':
        return renderFavorites()
      default:
        return renderOverview()
    }
  }

  return (
    <UserTemplate
      header={headerContent}
      sidebar={sidebarContent}
      main={renderContent()}
    />
  )
}

export default DashboardPage
