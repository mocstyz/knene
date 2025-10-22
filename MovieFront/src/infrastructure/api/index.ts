/**
 * @fileoverview API基础设施层统一导出入口
 * @description 统一导出所有API服务类、工具函数和类型定义，提供清晰的模块化接口
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// API服务类统一导出
export { MovieApiService } from './movieApi'
export { apiClient } from './ApiClient'
export { AuthApi } from './authApi'
export { DownloadApi } from './downloadApi'
export { ENDPOINTS, buildApiUrl, buildUrlWithParams } from './endpoints'

// 类型定义统一导出
export type { ApiResponse, ApiError } from './ApiClient'
export type { EndpointFunction, EndpointConfig } from './endpoints'
