// API配置管理，支持环境切换和Mock数据配置
export interface ApiConfig {
  baseUrl: string
  timeout: number
  enableMock: boolean
  mockDelay: number
  retryAttempts: number
  retryDelay: number
}

// 环境配置枚举
export enum Environment {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

// 默认API配置
const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
  mockDelay: parseInt(import.meta.env.VITE_MOCK_DELAY || '500'),
  retryAttempts: parseInt(import.meta.env.VITE_RETRY_ATTEMPTS || '3'),
  retryDelay: 1000
}

// 环境特定配置
const ENVIRONMENT_CONFIGS: Record<Environment, Partial<ApiConfig>> = {
  [Environment.DEVELOPMENT]: {
    enableMock: true,
    mockDelay: 300,
    timeout: 15000
  },
  [Environment.TESTING]: {
    enableMock: true,
    mockDelay: 100,
    timeout: 5000
  },
  [Environment.STAGING]: {
    enableMock: false,
    timeout: 8000
  },
  [Environment.PRODUCTION]: {
    enableMock: false,
    timeout: 5000,
    retryAttempts: 2
  }
}

// API配置管理器
export class ApiConfigManager {
  private static instance: ApiConfigManager
  private config: ApiConfig
  private environment: Environment

  private constructor() {
    this.environment = this.detectEnvironment()
    this.config = this.buildConfig()
  }

  // 获取单例实例
  static getInstance(): ApiConfigManager {
    if (!ApiConfigManager.instance) {
      ApiConfigManager.instance = new ApiConfigManager()
    }
    return ApiConfigManager.instance
  }

  // 检测当前环境
  private detectEnvironment(): Environment {
    const env = import.meta.env.MODE || import.meta.env.NODE_ENV || 'development'
    
    switch (env) {
      case 'production':
        return Environment.PRODUCTION
      case 'staging':
        return Environment.STAGING
      case 'test':
      case 'testing':
        return Environment.TESTING
      default:
        return Environment.DEVELOPMENT
    }
  }

  // 构建配置
  private buildConfig(): ApiConfig {
    const envConfig = ENVIRONMENT_CONFIGS[this.environment] || {}
    return {
      ...DEFAULT_CONFIG,
      ...envConfig
    }
  }

  // 获取当前配置
  getConfig(): ApiConfig {
    return { ...this.config }
  }

  // 获取当前环境
  getEnvironment(): Environment {
    return this.environment
  }

  // 是否启用Mock数据
  isMockEnabled(): boolean {
    return this.config.enableMock
  }

  // 获取API基础URL
  getBaseUrl(): string {
    return this.config.baseUrl
  }

  // 获取超时时间
  getTimeout(): number {
    return this.config.timeout
  }

  // 获取Mock延迟时间
  getMockDelay(): number {
    return this.config.mockDelay
  }

  // 获取重试配置
  getRetryConfig(): { attempts: number; delay: number } {
    return {
      attempts: this.config.retryAttempts,
      delay: this.config.retryDelay
    }
  }

  // 更新配置（仅用于测试或特殊场景）
  updateConfig(updates: Partial<ApiConfig>): void {
    this.config = {
      ...this.config,
      ...updates
    }
  }

  // 重置为默认配置
  resetConfig(): void {
    this.config = this.buildConfig()
  }

  // 切换Mock模式
  toggleMock(enabled?: boolean): void {
    this.config.enableMock = enabled !== undefined ? enabled : !this.config.enableMock
  }
}

// 导出配置管理器实例
export const apiConfig = ApiConfigManager.getInstance()

// 导出便捷方法
export const isProduction = () => apiConfig.getEnvironment() === Environment.PRODUCTION
export const isDevelopment = () => apiConfig.getEnvironment() === Environment.DEVELOPMENT
export const isMockEnabled = () => apiConfig.isMockEnabled()
