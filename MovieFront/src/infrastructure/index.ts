/**
 * 基础设施层统一导出
 * 提供API客户端、事件总线、存储服务、缓存管理等基础设施的统一入口
 */

// API服务
export * from './api'

// 存储服务
export * from './storage'

// 仓储层
export * from './repositories'

// 基础设施层类型定义
export interface InfrastructureConfig {
  apiBaseUrl: string
  apiTimeout: number
  retryAttempts: number
  cacheEnabled: boolean
  storagePrefix: string
}

// 默认配置
export const defaultInfrastructureConfig: InfrastructureConfig = {
  apiBaseUrl: process.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  apiTimeout: 10000,
  retryAttempts: 3,
  cacheEnabled: true,
  storagePrefix: 'movie_app_'
}

// API相关
export { ApiClient, apiClient } from './api/ApiClient'
export { ENDPOINTS, buildApiUrl, buildUrlWithParams } from './api/endpoints'
export type {
  ApiResponse,
  ApiError,
  RequestConfig,
  PaginationParams,
  PaginatedResponse
} from './api/ApiClient'

export type { EndpointFunction, EndpointConfig } from './api/endpoints'

// 事件总线类型定义
export type {
  DomainEvent,
  EventHandler,
  EventSubscription,
  EventBusOptions
} from './events/EventBus'

// 存储服务
export {
  LocalStorageManager,
  SessionStorageManager,
  StorageAdapterFactory,
  StorageManager,
  type IStorageManager,
  type StorageItem,
  type StorageStats,
  storageManager
} from './storage'

// 缓存管理
export { CacheManager, cacheManager } from './cache/CacheManager'
export type {
  CacheOptions,
  CacheItem,
  CacheStats
} from './cache/CacheManager'

/**
 * 基础设施初始化函数
 * 在应用启动时调用，初始化所有基础设施服务
 */
export async function initializeInfrastructure(): Promise<void> {
  try {
    // 初始化存储管理器
    const { storageManager } = await import('./storage/StorageService')
    await storageManager.init()
    
    console.log('基础设施初始化完成')
  } catch (error) {
    console.error('基础设施初始化失败:', error)
    throw error
  }
}

/**
 * 基础设施清理函数
 * 在应用关闭时调用，清理资源
 */
export async function cleanupInfrastructure(): Promise<void> {
  try {
    // 动态导入并销毁事件总线
    const { eventBus } = await import('./events/EventBus')
    eventBus.destroy()
    
    // 动态导入并关闭IndexedDB连接
    const { storageManager } = await import('./storage/StorageService')
    storageManager.indexedDB.close()
    
    console.log('基础设施清理完成')
  } catch (error) {
    console.error('基础设施清理失败:', error)
  }
}