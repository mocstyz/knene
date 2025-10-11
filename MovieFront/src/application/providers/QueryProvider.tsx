import { queryClient } from '@application/services/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'

interface QueryProviderProps {
  children: React.ReactNode
}

/**
 * React Query提供者组件
 * 为整个应用提供数据获取和缓存功能
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 开发环境下显示React Query开发工具 */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}
