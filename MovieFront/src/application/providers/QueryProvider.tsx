/**
 * @fileoverview React Query提供者组件
 * @description 为整个应用提供数据获取和缓存功能，集成React Query客户端和开发工具。
 *              该组件符合DDD架构应用层设计，负责协调数据层和表现层之间的数据流。
 *              提供了统一的数据缓存策略、错误处理机制和开发调试工具支持。
 *              确保应用中所有异步数据请求都能享受到缓存、重试、后台更新等优化特性。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { queryClient } from '@application/services/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'

// Query提供者组件属性接口
interface QueryProviderProps {
  children: React.ReactNode
}

// React Query提供者组件，为整个应用提供数据获取和缓存功能
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 开发环境下显示React Query开发工具 - 提供查询状态监控和调试功能 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
