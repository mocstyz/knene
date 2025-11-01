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

// 主应用组件
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

  // 移除初始加载状态，让渲染器在后台初始化
  // 这样可以避免双重 spinner 显示，直接进入路由加载流程

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
