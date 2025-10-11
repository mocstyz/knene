import { Icon } from '@components/atoms'
import { cn } from '@utils/cn'
import React from 'react'

export interface UserTemplateProps {
  /** 头部内容 */
  header: React.ReactNode
  /** 侧边栏内容 */
  sidebar?: React.ReactNode
  /** 主要内容区域 */
  main: React.ReactNode
  /** 底部内容 */
  footer?: React.ReactNode
  /** 是否显示侧边栏 */
  showSidebar?: boolean
  /** 侧边栏是否可折叠 */
  collapsibleSidebar?: boolean
  /** 侧边栏初始状态（展开/折叠） */
  sidebarCollapsed?: boolean
  /** 侧边栏折叠状态变化回调 */
  onSidebarToggle?: (collapsed: boolean) => void
  /** 自定义样式类名 */
  className?: string
  /** 主内容区域样式类名 */
  mainClassName?: string
  /** 侧边栏样式类名 */
  sidebarClassName?: string
}

export const UserTemplate: React.FC<UserTemplateProps> = ({
  header,
  sidebar,
  main,
  footer,
  showSidebar = true,
  collapsibleSidebar = true,
  sidebarCollapsed = false,
  onSidebarToggle,
  className,
  mainClassName,
  sidebarClassName,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(sidebarCollapsed)

  const handleToggleSidebar = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    onSidebarToggle?.(newCollapsed)
  }

  return (
    <div className={cn('flex min-h-screen flex-col bg-gray-50', className)}>
      {/* 头部 */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        {header}
      </header>

      {/* 主体内容区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 侧边栏 */}
        {showSidebar && (
          <aside
            className={cn(
              'flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out',
              isCollapsed ? 'w-16' : 'w-64',
              'hidden md:flex', // 移动端隐藏侧边栏
              sidebarClassName
            )}
          >
            {/* 侧边栏折叠按钮 */}
            {collapsibleSidebar && (
              <div className="border-b border-gray-200 p-4">
                <button
                  onClick={handleToggleSidebar}
                  className="flex w-full items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100"
                  title={isCollapsed ? '展开侧边栏' : '折叠侧边栏'}
                >
                  <Icon
                    name={isCollapsed ? 'chevronRight' : 'chevronLeft'}
                    size="sm"
                    className="text-gray-600"
                  />
                </button>
              </div>
            )}

            {/* 侧边栏内容 */}
            <div className="flex-1 overflow-y-auto">{sidebar}</div>
          </aside>
        )}

        {/* 主内容区域 */}
        <main
          className={cn(
            'flex-1 overflow-y-auto',
            'p-4 md:p-6 lg:p-8',
            mainClassName
          )}
        >
          {main}
        </main>
      </div>

      {/* 底部 */}
      {footer && (
        <footer className="mt-auto border-t border-gray-200 bg-white">
          {footer}
        </footer>
      )}

      {/* 移动端侧边栏遮罩 */}
      {showSidebar && !isCollapsed && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={handleToggleSidebar}
        />
      )}

      {/* 移动端侧边栏 */}
      {showSidebar && (
        <aside
          className={cn(
            'fixed left-0 top-0 z-40 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:hidden',
            isCollapsed ? '-translate-x-full' : 'translate-x-0',
            sidebarClassName
          )}
        >
          {/* 移动端关闭按钮 */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900">菜单</h3>
            <button
              onClick={handleToggleSidebar}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            >
              <Icon name="x" size="sm" className="text-gray-600" />
            </button>
          </div>

          {/* 移动端侧边栏内容 */}
          <div className="flex-1 overflow-y-auto">{sidebar}</div>
        </aside>
      )}
    </div>
  )
}
