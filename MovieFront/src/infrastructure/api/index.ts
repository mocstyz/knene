// API基础设施层统一导出
export { MovieApiService } from './movieApi'
export { apiClient } from './ApiClient'
export { AuthApi } from './authApi'
export { DownloadApi } from './downloadApi'
export { ENDPOINTS, buildApiUrl, buildUrlWithParams } from './endpoints'

// 导出类型
export type { ApiResponse, ApiError } from './ApiClient'
export type { EndpointFunction, EndpointConfig } from './endpoints'
