/**
 * @fileoverview 基础应用服务类
 * @description 提供统一的API调用和Mock数据回退机制，支持环境配置切换，确保前后端分离开发的无缝对接
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { mockDataService } from '@application/services/MockDataService'

// 环境配置接口，定义API调用和Mock数据的配置选项
export interface ServiceConfig {
  useMockData: boolean // 是否使用Mock数据
  apiTimeout: number // API超时时间（毫秒）
  retryAttempts: number // 重试次数
  enableFallback: boolean // 是否启用Mock数据回退
}

// 基础应用服务类，提供统一的API调用模式和错误处理机制
export abstract class BaseApplicationService {
  protected config: ServiceConfig
  protected mockDataService = mockDataService

  constructor(config: Partial<ServiceConfig> = {}) {
    // 默认配置合并 - 提供合理的默认值，支持环境变量配置
    this.config = {
      useMockData: import.meta.env.VITE_ENABLE_MOCK === 'true', // 使用环境变量控制Mock数据
      apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'), // 环境变量配置超时时间
      retryAttempts: parseInt(import.meta.env.VITE_RETRY_ATTEMPTS || '3'), // 环境变量配置重试次数
      enableFallback: true, // 启用回退机制
      ...config
    }
  }

  // 带回退机制的数据获取方法，优先调用真实API，失败时回退到Mock数据
  protected async fetchWithFallback<T>(
    apiCall: () => Promise<T>,
    mockDataProvider: () => T,
    operationName: string = 'API调用'
  ): Promise<T> {
    // 强制使用Mock数据模式 - 开发环境或配置指定时直接返回Mock数据
    if (this.config.useMockData) {
      console.log(`[${operationName}] 使用Mock数据模式`)
      return mockDataProvider()
    }

    try {
      // API调用重试机制 - 支持配置的重试次数
      let lastError: Error | null = null
      
      for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
        try {
          console.log(`[${operationName}] 尝试API调用 (第${attempt}次)`)
          
          // 超时控制 - 使用Promise.race实现超时机制
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('API调用超时')), this.config.apiTimeout)
          })
          
          const result = await Promise.race([apiCall(), timeoutPromise])
          console.log(`[${operationName}] API调用成功`)
          return result
        } catch (error) {
          lastError = error as Error
          console.warn(`[${operationName}] 第${attempt}次调用失败:`, error)
          
          // 最后一次尝试失败时不等待
          if (attempt < this.config.retryAttempts) {
            // 指数退避策略 - 每次重试间隔递增
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
            await new Promise(resolve => setTimeout(resolve, delay))
          }
        }
      }

      // API调用失败处理 - 根据配置决定是否回退到Mock数据
      if (this.config.enableFallback) {
        console.warn(`[${operationName}] API调用失败，回退到Mock数据:`, lastError?.message)
        return mockDataProvider()
      } else {
        console.error(`[${operationName}] API调用失败，未启用回退机制:`, lastError?.message)
        throw lastError || new Error('API调用失败')
      }
    } catch (error) {
      // 异常处理 - 确保在任何情况下都有合理的错误处理
      if (this.config.enableFallback) {
        console.warn(`[${operationName}] 发生异常，回退到Mock数据:`, error)
        return mockDataProvider()
      } else {
        console.error(`[${operationName}] 发生异常，未启用回退机制:`, error)
        throw error
      }
    }
  }

  // 更新服务配置，支持运行时配置修改
  public updateConfig(newConfig: Partial<ServiceConfig>): void {
    this.config = { ...this.config, ...newConfig }
    console.log('服务配置已更新:', this.config)
  }

  // 获取当前服务配置，用于调试和监控
  public getConfig(): ServiceConfig {
    return { ...this.config }
  }

  // 检查服务健康状态，返回当前服务的运行状态信息
  public getHealthStatus(): {
    isHealthy: boolean
    mode: 'mock' | 'api' | 'hybrid'
    config: ServiceConfig
    cacheStats?: any
  } {
    return {
      isHealthy: true,
      mode: this.config.useMockData ? 'mock' : (this.config.enableFallback ? 'hybrid' : 'api'),
      config: this.config,
      cacheStats: this.mockDataService.getCacheStats()
    }
  }
}
