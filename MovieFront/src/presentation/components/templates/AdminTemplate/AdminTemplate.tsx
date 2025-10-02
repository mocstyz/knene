import React from 'react'
import { cn } from '@/utils/cn'
import { Icon, Avatar, Badge } from '@/components/atoms'

export interface AdminUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'super_admin'
  permissions: string[]
}

export interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

export interface AdminTemplateProps {
  /** 当前管理员用户信息 */
  user: AdminUser
  /** 页面标题 */
  title: string
  /** 面包屑导航 */
  breadcrumbs?: BreadcrumbItem[]
  /** 侧边栏导航菜单 */
  navigation: React.ReactNode
  /** 主要内容区域 */
  main: React.ReactNode
  /** 页面操作按钮区域 */
  actions?: React.ReactNode
  /** 是否显示用户信息 */
  showUserInfo?: boolean
  /** 是否显示通知 */
  showNotifications?: boolean
  /** 未读通知数量 */
  notificationCount?: number
  /** 用户菜单点击回调 */
  onUserMenuClick?: () => void
  /** 通知点击回调 */
  onNotificationClick?: () => void
  /** 退出登录回调 */
  onLogout?: () => void
  /** 自定义样式类名 */
  className?: string
}

export const AdminTemplate: React.FC<AdminTemplateProps> = ({
  user,
  title,
  breadcrumbs,
  navigation,
  main,
  actions,
  showUserInfo = true,
  showNotifications = true,
  notificationCount = 0,
  onUserMenuClick,
  onNotificationClick,
  onLogout,
  className
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handleUserMenuToggle = () => {
    setUserMenuOpen(!userMenuOpen)
    onUserMenuClick?.()
  }

  return (
    <div className={cn('min-h-screen bg-gray-50 flex', className)}>
      {/* 侧边栏 */}
      <aside
        className={cn(
          'bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo区域 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="film" size="sm" className="text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-bold text-gray-900">影视管理</h1>
                <p className="text-xs text-gray-500">后台管理系统</p>
              </div>
            )}
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 overflow-y-auto p-4">
          {navigation}
        </nav>

        {/* 侧边栏折叠按钮 */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleToggleSidebar}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'}
          >
            <Icon
              name={sidebarCollapsed ? 'chevronRight' : 'chevronLeft'}
              size="sm"
              className="text-gray-600"
            />
          </button>
        </div>
      </aside>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* 页面标题 */}
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

              {/* 面包屑导航 */}
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-2 text-sm">
                  {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && (
                        <Icon name="chevronRight" size="xs" className="text-gray-400" />
                      )}
                      {item.href && !item.active ? (
                        <a
                          href={item.href}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span
                          className={cn(
                            item.active ? 'text-blue-600 font-medium' : 'text-gray-500'
                          )}
                        >
                          {item.label}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* 页面操作按钮 */}
              {actions && (
                <div className="flex items-center gap-2">
                  {actions}
                </div>
              )}

              {/* 通知按钮 */}
              {showNotifications && (
                <button
                  onClick={onNotificationClick}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="通知"
                >
                  <Icon name="bell" size="sm" className="text-gray-600" />
                  {notificationCount > 0 && (
                    <Badge
                      variant="danger"
                      size="sm"
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-xs"
                    >
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </Badge>
                  )}
                </button>
              )}

              {/* 用户信息 */}
              {showUserInfo && (
                <div className="relative">
                  <button
                    onClick={handleUserMenuToggle}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      size="sm"
                      fallback={user.name.charAt(0).toUpperCase()}
                    />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.role === 'super_admin' ? '超级管理员' : '管理员'}
                      </p>
                    </div>
                    <Icon
                      name={userMenuOpen ? 'chevronUp' : 'chevronDown'}
                      size="xs"
                      className="text-gray-400"
                    />
                  </button>

                  {/* 用户下拉菜单 */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <Icon name="user" size="xs" />
                        个人资料
                      </button>
                      
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <Icon name="settings" size="xs" />
                        系统设置
                      </button>
                      
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button
                          onClick={onLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Icon name="logout" size="xs" />
                          退出登录
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 主内容区域 */}
        <main className="flex-1 overflow-y-auto p-6">
          {main}
        </main>
      </div>

      {/* 点击外部关闭用户菜单 */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  )
}