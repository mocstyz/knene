/**
 * @fileoverview 应用程序主入口文件
 * @description 这是影视资源网站前端应用的入口点，负责将App组件渲染到DOM的root元素中。
 * 使用React.StrictMode启用开发时的额外检查和警告，帮助捕获潜在问题。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.2.0
 */

import React from 'react'
import ReactDOM from 'react-dom/client'

import '@styles/index.css'

// eslint-disable-next-line no-restricted-imports
import App from '@/App'

/**
 * 将React应用程序渲染到DOM中
 * 使用React.StrictMode进行额外的开发时检查和警告
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
