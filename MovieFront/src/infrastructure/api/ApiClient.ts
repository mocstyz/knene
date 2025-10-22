/**
 * @fileoverview API客户端基础设施
 * @description 基础设施层的HTTP客户端实现，提供统一的API请求接口。
 *              包含请求拦截、响应处理、错误处理、重试机制、文件上传下载等完整功能。
 *              为整个应用提供可靠的数据通信基础，支持企业级的网络请求管理。
 * @author mosctz
 * @since 1.0.0
 * @version 1.2.0
 */

// API统一响应格式接口，定义所有API请求的标准返回结构
export interface ApiResponse<T = unknown> {
  data: T // 响应数据
  message: string // 响应消息
  code: number // 响应状态码
  success: boolean // 请求是否成功
  timestamp: string // 响应时间戳
}

// API错误响应接口，定义错误信息的标准格式
export interface ApiError {
  code: number // 错误状态码
  message: string // 错误消息
  details?: unknown // 错误详细信息
  timestamp: string // 错误发生时间戳
}

// 请求配置接口，定义API请求的可选配置参数
export interface RequestConfig {
  headers?: Record<string, string> // 自定义请求头
  timeout?: number // 请求超时时间（毫秒）
  retries?: number // 重试次数
  retryDelay?: number // 重试延迟时间（毫秒）
}

// 分页参数接口，定义分页查询的标准参数
export interface PaginationParams {
  page: number // 当前页码
  pageSize: number // 每页条数
  sortBy?: string // 排序字段
  sortOrder?: 'asc' | 'desc' // 排序方向
}

// 分页响应接口，定义分页数据的返回格式
export interface PaginatedResponse<T> {
  data: T[] // 数据列表
  pagination: {
    page: number // 当前页码
    pageSize: number // 每页条数
    total: number // 总条数
    totalPages: number // 总页数
    hasNext: boolean // 是否有下一页
    hasPrev: boolean // 是否有上一页
  }
}

// API客户端类，基于Fetch API实现，提供RESTful接口调用能力
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

  // 设置默认拦截器 - 包括认证、响应处理和错误记录
  private setupDefaultInterceptors(): void {
    // 请求拦截器 - 自动添加认证token
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

    // 响应拦截器 - 处理401未授权响应
    this.addResponseInterceptor(async response => {
      if (response.status === 401) {
        this.handleUnauthorized()
      }
      return response
    })

    // 错误拦截器 - 记录错误日志
    this.addErrorInterceptor(error => {
      console.error('API Error:', error)
      this.logError(error)
    })
  }

  // 添加请求拦截器 - 在请求发送前对配置进行处理
  addRequestInterceptor(
    interceptor: (config: RequestInit) => RequestInit | Promise<RequestInit>
  ): void {
    this.interceptors.request.push(interceptor)
  }

  // 添加响应拦截器 - 在响应返回后对结果进行处理
  addResponseInterceptor(
    interceptor: (response: Response) => Response | Promise<Response>
  ): void {
    this.interceptors.response.push(interceptor)
  }

  // 添加错误拦截器 - 统一处理API错误
  addErrorInterceptor(
    interceptor: (error: ApiError) => void | Promise<void>
  ): void {
    this.interceptors.error.push(interceptor)
  }

  // 执行HTTP请求 - 核心请求方法，支持拦截器、重试机制和超时控制
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const timeout = config.timeout || this.defaultTimeout
    const retries = config.retries || 0
    const retryDelay = config.retryDelay || 1000

    // 合并请求配置 - 优先级：用户配置 > 默认配置
    let requestConfig: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...config.headers,
        ...options.headers,
      },
    }

    // 应用请求拦截器 - 按顺序执行所有请求拦截器
    for (const interceptor of this.interceptors.request) {
      requestConfig = await interceptor(requestConfig)
    }

    // 执行请求（带重试机制） - 支持指数退避重试
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, {
          ...requestConfig,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        // 应用响应拦截器 - 按顺序执行所有响应拦截器
        let processedResponse = response
        for (const interceptor of this.interceptors.response) {
          processedResponse = await interceptor(processedResponse)
        }

        // 处理响应错误 - 统一处理HTTP错误状态
        if (!processedResponse.ok) {
          const errorData = await this.parseErrorResponse(processedResponse)
          const apiError: ApiError = {
            code: processedResponse.status,
            message: errorData.message || processedResponse.statusText,
            details: errorData,
            timestamp: new Date().toISOString(),
          }

          // 应用错误拦截器 - 按顺序执行所有错误拦截器
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

        // 等待后重试 - 使用指数退避算法
        await this.delay(retryDelay * Math.pow(2, attempt))
      }
    }

    throw new Error('请求失败')
  }

  // GET请求方法 - 支持查询参数和自定义配置
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

  // POST请求方法 - 支持请求体数据和自定义配置
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

  // PUT请求方法 - 支持完整资源更新和自定义配置
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

  // PATCH请求方法 - 支持部分资源更新和自定义配置
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

  // DELETE请求方法 - 支持资源删除和自定义配置
  async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, config)
  }

  // 分页查询方法 - 支持标准分页参数和自定义过滤条件
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

  // 文件上传方法 - 支持单文件上传和额外表单数据
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

    // 移除Content-Type头 - 让浏览器自动设置multipart/form-data边界
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

  // 文件下载方法 - 支持自定义文件名和浏览器下载
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

  // 设置认证token - 将token存储到本地存储中
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token)
  }

  // 获取认证token - 从本地存储中获取认证token
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  // 清除认证token - 从本地存储中移除认证token
  clearAuthToken(): void {
    localStorage.removeItem('auth_token')
  }

  // 处理未授权响应 - 清除token并触发重新认证事件
  private handleUnauthorized(): void {
    this.clearAuthToken()
    // 触发登录页面跳转事件
    window.dispatchEvent(new CustomEvent('auth:unauthorized'))
  }

  // 构建查询字符串 - 将对象转换为URL查询参数格式
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

  // 解析错误响应 - 尝试从响应中提取错误信息
  private async parseErrorResponse(
    response: Response
  ): Promise<{ message?: string; [key: string]: unknown }> {
    try {
      return await response.json()
    } catch {
      return { message: response.statusText }
    }
  }

  // 从响应头提取文件名 - 解析Content-Disposition头获取文件名
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

  // 延迟函数 - 创建指定延迟的Promise
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 记录错误日志 - 记录API错误信息用于调试和监控
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
