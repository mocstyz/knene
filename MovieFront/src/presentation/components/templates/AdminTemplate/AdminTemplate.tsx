/**
 * @fileoverview 管理后台模板组件
 * @description 提供完整的管理后台页面布局模板，包含侧边栏导航、顶部工具栏、用户信息区域、
 *              通知系统、面包屑导航等功能，支持可折叠侧边栏和响应式设计
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Icon, Avatar, Badge } from '@components/atoms'
import { cn } from '@utils/cn'
import React from 'react'

// 管理员用户信息接口，定义管理员的基本信息和权限配置
export interface AdminUser {
  id: string // 用户唯一标识
  name: string // 用户姓名
  email: string // 用户邮箱
  avatar?: string // 用户头像URL
  role: 'admin' | 'super_admin' // 用户角色
  permissions: string[] // 用户权限列表
}

// 面包屑导航项接口，定义面包屑导航的显示和跳转行为
export interface BreadcrumbItem {
  label: string // 显示文本
  href?: string // 跳转链接
  active?: boolean // 是否为当前页面
}

// 管理后台模板属性接口，定义模板组件的配置选项和内容区域
export interface AdminTemplateProps {
  user: AdminUser // 当前管理员用户信息
  title: string // 页面标题
  breadcrumbs?: BreadcrumbItem[] // 面包屑导航
  navigation: React.ReactNode // 侧边栏导航菜单
  main: React.ReactNode // 主要内容区域
  actions?: React.ReactNode // 页面操作按钮区域
  showUserInfo?: boolean // 是否显示用户信息
  showNotifications?: boolean // 是否显示通知
  notificationCount?: number // 未读通知数量
  onUserMenuClick?: () => void // 用户菜单点击回调
  onNotificationClick?: () => void // 通知点击回调
  onLogout?: () => void // 退出登录回调
  className?: string // 自定义样式类名
}

// 管理后台模板组件，提供完整的管理后台页面布局模板，包含侧边栏导航、顶部工具栏、用户信息区域、通知系统、面包屑导航等功能
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
  className,
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
    <div className={cn('flex min-h-screen bg-gray-50', className)}>
      {/* 侧边栏 */}
      <aside
        className={cn(
          'flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo区域 */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
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
        <nav className="flex-1 overflow-y-auto p-4">{navigation}</nav>

        {/* 侧边栏折叠按钮 */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleToggleSidebar}
            className="flex w-full items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100"
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
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="border-b border-gray-200 bg-white px-6 py-4">
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
                        <Icon
                          name="chevronRight"
                          size="xs"
                          className="text-gray-400"
                        />
                      )}
                      {item.href && !item.active ? (
                        <a
                          href={item.href}
                          className="text-gray-500 transition-colors hover:text-gray-700"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span
                          className={cn(
                            item.active
                              ? 'font-medium text-blue-600'
                              : 'text-gray-500'
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
                <div className="flex items-center gap-2">{actions}</div>
              )}

              {/* 通知按钮 */}
              {showNotifications && (
                <button
                  onClick={onNotificationClick}
                  className="relative rounded-lg p-2 transition-colors hover:bg-gray-100"
                  title="通知"
                >
                  <Icon name="bell" size="sm" className="text-gray-600" />
                  {notificationCount > 0 && (
                    <Badge
                      variant="danger"
                      size="sm"
                      className="absolute -right-1 -top-1 h-[18px] min-w-[18px] text-xs"
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
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-100"
                  >
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      size="sm"
                      fallback={user.name.charAt(0).toUpperCase()}
                    />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
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
                    <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                      <div className="border-b border-gray-200 px-4 py-2">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>

                      <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        <Icon name="user" size="xs" />
                        个人资料
                      </button>

                      <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100">
                        <Icon name="settings" size="xs" />
                        系统设置
                      </button>

                      <div className="mt-2 border-t border-gray-200 pt-2">
                        <button
                          onClick={onLogout}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
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
        <main className="flex-1 overflow-y-auto p-6">{main}</main>
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
