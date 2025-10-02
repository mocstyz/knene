import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCurrentUser } from '@/application/hooks'
import { Button, Icon } from '@/components/atoms'
import { UserTemplate } from '@/components/templates'

// 模拟数据
const mockRecentMovies = [
  {
    id: '1',
    title: '复仇者联盟：终局之战',
    poster: 'https://via.placeholder.com/200x300/1e40af/ffffff?text=Avengers',
    progress: 85,
    lastWatched: '2024-01-15'
  },
  {
    id: '2',
    title: '星际穿越',
    poster: 'https://via.placeholder.com/200x300/059669/ffffff?text=Interstellar',
    progress: 45,
    lastWatched: '2024-01-14'
  },
  {
    id: '3',
    title: '盗梦空间',
    poster: 'https://via.placeholder.com/200x300/dc2626/ffffff?text=Inception',
    progress: 100,
    lastWatched: '2024-01-13'
  }
]

const mockDownloads = [
  {
    id: '1',
    title: '蜘蛛侠：英雄无归',
    progress: 75,
    speed: '2.5 MB/s',
    status: 'downloading' as const
  },
  {
    id: '2',
    title: '沙丘',
    progress: 100,
    speed: '0 MB/s',
    status: 'completed' as const
  },
  {
    id: '3',
    title: '黑客帝国：矩阵重启',
    progress: 30,
    speed: '1.8 MB/s',
    status: 'paused' as const
  }
]

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useCurrentUser()
  const [activeTab, setActiveTab] = useState<'overview' | 'recent' | 'downloads' | 'favorites'>('overview')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Icon name="loading" className="animate-spin" />
          <span>加载中...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon name="user" size="xl" className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">请先登录</h2>
          <p className="text-gray-600 mb-4">您需要登录才能访问仪表板</p>
          <Link to="/auth/login">
            <Button variant="primary">立即登录</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'downloading':
        return 'text-blue-600'
      case 'completed':
        return 'text-green-600'
      case 'paused':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'downloading':
        return '下载中'
      case 'completed':
        return '已完成'
      case 'paused':
        return '已暂停'
      default:
        return '未知'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    })
  }

  const headerContent = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
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

  const sidebarContent = (
    <nav className="space-y-2">
      <button
        onClick={() => setActiveTab('overview')}
        className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
          activeTab === 'overview'
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Icon name="home" size="sm" />
        概览
      </button>
      <button
        onClick={() => setActiveTab('recent')}
        className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
          activeTab === 'recent'
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Icon name="clock" size="sm" />
        最近观看
      </button>
      <button
        onClick={() => setActiveTab('downloads')}
        className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
          activeTab === 'downloads'
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Icon name="download" size="sm" />
        下载管理
      </button>
      <button
        onClick={() => setActiveTab('favorites')}
        className={`w-full flex items-center gap-3 px-4 py-2 text-left rounded-lg transition-colors ${
          activeTab === 'favorites'
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Icon name="heart" size="sm" />
        我的收藏
      </button>
    </nav>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">观看时长</p>
              <p className="text-2xl font-bold text-gray-900">128小时</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="clock" className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">收藏影片</p>
              <p className="text-2xl font-bold text-gray-900">42部</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Icon name="heart" className="text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">下载数量</p>
              <p className="text-2xl font-bold text-gray-900">15部</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="download" className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">会员等级</p>
              <p className="text-2xl font-bold text-gray-900">
                {user.subscription?.type === 'premium' ? 'VIP' : '普通'}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Icon name="star" className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

  const renderRecentMovies = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">最近观看</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRecentMovies.map((movie) => (
            <div key={movie.id} className="group cursor-pointer">
              <div className="relative aspect-[2/3] mb-3 rounded-lg overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black bg-opacity-75 rounded px-2 py-1">
                    <div className="flex items-center justify-between text-white text-xs">
                      <span>{movie.progress}%</span>
                      <span>{formatDate(movie.lastWatched)}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-1 mt-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: `${movie.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {movie.title}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDownloads = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">下载管理</h3>
          <Button variant="primary" size="sm">
            <Icon name="plus" size="sm" className="mr-2" />
            新建下载
          </Button>
        </div>
      </div>
      <div className="divide-y">
        {mockDownloads.map((download) => (
          <div key={download.id} className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{download.title}</h4>
              <span className={`text-sm font-medium ${getStatusColor(download.status)}`}>
                {getStatusText(download.status)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
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
              <span className="text-sm text-gray-600 min-w-0">
                {download.progress}%
              </span>
              <span className="text-sm text-gray-600 min-w-0">
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

  const renderFavorites = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">我的收藏</h3>
      </div>
      <div className="p-6">
        <div className="text-center py-12">
          <Icon name="heart" size="xl" className="mx-auto mb-4 text-gray-400" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">暂无收藏</h4>
          <p className="text-gray-600 mb-4">开始收藏您喜欢的影片吧</p>
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