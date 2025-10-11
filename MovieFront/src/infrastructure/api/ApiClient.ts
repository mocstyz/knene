/**
 * @fileoverview API客户端基础设施
 * @description 基础设施层的HTTP客户端实现，提供统一的API请求接口。
 * 包含请求拦截、响应处理、错误处理、重试机制、文件上传下载等完整功能，
 * 为整个应用提供可靠的数据通信基础。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.2.0
 */

export interface ApiResponse<T = unknown> {
  data: T
  message: string
  code: number
  success: boolean
  timestamp: string
}

export interface ApiError {
  code: number
  message: string
  details?: unknown
  timestamp: string
}

export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  retries?: number
  retryDelay?: number
}

export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

/**
 * API客户端类
 * 基于Fetch API实现，提供RESTful接口调用能力
 */
export class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private defaultTimeout: number
  private interceptors: {
    request: Array<(config: RequestInit) => RequestInit | Promise<RequestInit>>
    response: Array<(response: Response) => Response | Promise<Response>>
    error: Array<(error: ApiError) => void | Promise<void>>
  }

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL.replace(/\/$/, '')
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    this.defaultTimeout = 10000
    this.interceptors = {
      request: [],
      response: [],
      error: [],
    }

    this.setupDefaultInterceptors()
  }

  /**
   * 设置默认拦截器
   */
  private setupDefaultInterceptors(): void {
    // 请求拦截器：添加认证token
    this.addRequestInterceptor(config => {
      const token = this.getAuthToken()
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        }
      }
      return config
    })

    // 响应拦截器：处理401未授权
    this.addResponseInterceptor(async response => {
      if (response.status === 401) {
        this.handleUnauthorized()
      }
      return response
    })

    // 错误拦截器：记录错误日志
    this.addErrorInterceptor(error => {
      console.error('API Error:', error)
      this.logError(error)
    })
  }

  /**
   * 添加请求拦截器
   */
  addRequestInterceptor(
    interceptor: (config: RequestInit) => RequestInit | Promise<RequestInit>
  ): void {
    this.interceptors.request.push(interceptor)
  }

  /**
   * 添加响应拦截器
   */
  addResponseInterceptor(
    interceptor: (response: Response) => Response | Promise<Response>
  ): void {
    this.interceptors.response.push(interceptor)
  }

  /**
   * 添加错误拦截器
   */
  addErrorInterceptor(
    interceptor: (error: ApiError) => void | Promise<void>
  ): void {
    this.interceptors.error.push(interceptor)
  }

  /**
   * 执行HTTP请求
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const timeout = config.timeout || this.defaultTimeout
    const retries = config.retries || 0
    const retryDelay = config.retryDelay || 1000

    // 合并请求配置
    let requestConfig: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...config.headers,
        ...options.headers,
      },
    }

    // 应用请求拦截器
    for (const interceptor of this.interceptors.request) {
      requestConfig = await interceptor(requestConfig)
    }

    // 执行请求（带重试机制）
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
          ...requestConfig,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        // 应用响应拦截器
        let processedResponse = response
        for (const interceptor of this.interceptors.response) {
          processedResponse = await interceptor(processedResponse)
        }

        // 处理响应
        if (!processedResponse.ok) {
          const errorData = await this.parseErrorResponse(processedResponse)
          const apiError: ApiError = {
            code: processedResponse.status,
            message: errorData.message || processedResponse.statusText,
            details: errorData,
            timestamp: new Date().toISOString(),
          }

          // 应用错误拦截器
          for (const interceptor of this.interceptors.error) {
            await interceptor(apiError)
          }

          throw apiError
        }

        const result = await processedResponse.json()
        return result as ApiResponse<T>
      } catch (error) {
        if (attempt === retries) {
          // 最后一次重试失败，抛出错误
          if (error instanceof Error && error.name === 'AbortError') {
            const timeoutError: ApiError = {
              code: 408,
              message: '请求超时',
              timestamp: new Date().toISOString(),
            }
            throw timeoutError
          }
          throw error
        }

        // 等待后重试
        await this.delay(retryDelay * Math.pow(2, attempt))
      }
    }

    throw new Error('请求失败')
  }

  /**
   * GET请求
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const url = params
      ? `${endpoint}?${this.buildQueryString(params)}`
      : endpoint
    return this.request<T>(url, { method: 'GET' }, config)
  }

  /**
   * POST请求
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    )
  }

  /**
   * PUT请求
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    )
  }

  /**
   * PATCH请求
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    )
  }

  /**
   * DELETE请求
   */
  async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, config)
  }

  /**
   * 分页查询
   */
  async getPaginated<T>(
    endpoint: string,
    params: PaginationParams & Record<string, unknown> = {
      page: 1,
      pageSize: 20,
    },
    config?: RequestConfig
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    return this.get<PaginatedResponse<T>>(endpoint, params, config)
  }

  /**
   * 文件上传
   */
  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, unknown>,
    config?: RequestConfig & {
      onProgress?: (progress: number) => void
    }
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    // 移除Content-Type头，让浏览器自动设置
    const headers = { ...config?.headers }
    delete headers['Content-Type']

    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: formData,
      },
      {
        ...config,
        headers,
      }
    )
  }

  /**
   * 文件下载
   */
  async download(
    endpoint: string,
    filename?: string,
    _config?: RequestConfig
  ): Promise<void> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: this.defaultHeaders,
    })

    if (!response.ok) {
      throw new Error(`下载失败: ${response.statusText}`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || this.extractFilenameFromResponse(response)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  /**
   * 设置认证token
   */
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token)
  }

  /**
   * 获取认证token
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  /**
   * 清除认证token
   */
  clearAuthToken(): void {
    localStorage.removeItem('auth_token')
  }

  /**
   * 处理未授权响应
   */
  private handleUnauthorized(): void {
    this.clearAuthToken()
    // 触发登录页面跳转事件
    window.dispatchEvent(new CustomEvent('auth:unauthorized'))
  }

  /**
   * 构建查询字符串
   */
  private buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)))
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    return searchParams.toString()
  }

  /**
   * 解析错误响应
   */
  private async parseErrorResponse(
    response: Response
  ): Promise<{ message?: string; [key: string]: unknown }> {
    try {
      return await response.json()
    } catch {
      return { message: response.statusText }
    }
  }

  /**
   * 从响应头提取文件名
   */
  private extractFilenameFromResponse(response: Response): string {
    const contentDisposition = response.headers.get('Content-Disposition')
    if (contentDisposition) {
      const matches = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      )
      if (matches && matches[1]) {
        return matches[1].replace(/['"]/g, '')
      }
    }
    return 'download'
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 记录错误日志
   */
  private logError(error: ApiError): void {
    // 这里可以集成第三方日志服务
    console.error('API Error logged:', {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp,
      url: window.location.href,
      userAgent: navigator.userAgent,
    })
  }
}

// 创建默认API客户端实例
export const apiClient = new ApiClient()
