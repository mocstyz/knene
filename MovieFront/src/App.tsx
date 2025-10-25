/**
 * @fileoverview 主应用组件
 * @description 影视资源网站的根组件，配置并提供全局上下文提供者，包括路由、数据获取和主题设置。
 * 该组件建立应用级结构和样式基础，采用新的统一主题系统。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.3.0
 */

import { QueryProvider, AppThemeProvider } from '@application/providers'
import { router } from '@presentation/router/routes'
import { RouterProvider } from 'react-router-dom'
import { contentRendererFactory } from '@components/domains/shared/content-renderers'
import { useEffect, useState } from 'react'
import '@styles/App.css'

/**
 * 主应用组件
 *
 * 配置并包装整个应用程序的必要上下文提供者：
 * - QueryProvider: 使用TanStack Query管理服务器状态和数据获取
 * - AppThemeProvider: 基于 next-themes 和 Radix UI Themes 的统一主题系统
 * - RouterProvider: 处理客户端路由和导航
 *
 * 新的主题系统特性：
 * - 支持明暗模式自动切换
 * - 跟随系统主题偏好
 * - 本地存储主题选择
 * - SSR 友好的主题切换
 *
 * @returns {JSX.Element} 完全配置的应用程序组件树
 */
function App(): JSX.Element {
  const [renderersReady, setRenderersReady] = useState(false)

  useEffect(() => {
    // 等待渲染器初始化完成
    contentRendererFactory.waitForInitialization().then(() => {
      console.log('✅ Content renderers ready')
      setRenderersReady(true)
    }).catch((error) => {
      console.error('❌ Failed to initialize content renderers:', error)
      // 即使失败也继续渲染，避免白屏
      setRenderersReady(true)
    })
  }, [])

  // 在渲染器准备好之前显示加载状态
  if (!renderersReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <QueryProvider>
      <AppThemeProvider
        themeConfig={{
          accentColor: 'green',
          grayColor: 'slate',
          radius: 'medium',
          scaling: '100%',
        }}
        themesProviderConfig={{
          attribute: 'class',
          defaultTheme: 'system',
          enableSystem: true,
          disableTransitionOnChange: true,
          storageKey: 'movie-theme',
        }}
      >
        <div className="min-h-screen bg-white text-gray-900 transition-colors duration-200 dark:bg-gray-900 dark:text-gray-100">
          <RouterProvider router={router} />
        </div>
      </AppThemeProvider>
    </QueryProvider>
  )
}

export default App
