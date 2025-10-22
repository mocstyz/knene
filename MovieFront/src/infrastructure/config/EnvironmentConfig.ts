/**
 * @fileoverview 环境配置管理器
 * @description 提供统一的环境配置管理，支持开发、测试、生产环境的配置切换，确保配置的一致性和可维护性
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 环境类型枚举
export enum EnvironmentType {
  DEVELOPMENT = 'development',
  TESTING = 'testing',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

// 环境配置接口
export interface EnvironmentConfig {
  // 基础配置
  env: EnvironmentType
  isDevelopment: boolean
  isProduction: boolean
  isTesting: boolean
  
  // API配置
  apiBaseUrl: string
  apiTimeout: number
  enableMock: boolean
  mockDelay: number
  retryAttempts: number
  
  // 调试配置
  debugMode: boolean
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  enableDevtools: boolean
  
  // 功能开关
  enableHotReload: boolean
  enableAnalytics: boolean
  
  // 性能配置
  imageCdnUrl?: string
  imageQuality: number
}

// 环境配置管理器类
export class EnvironmentConfigManager {
  private static instance: EnvironmentConfigManager
  private config: EnvironmentConfig

  private constructor() {
    this.config = this.buildConfig()
  }

  // 获取单例实例
  public static getInstance(): EnvironmentConfigManager {
    if (!EnvironmentConfigManager.instance) {
      EnvironmentConfigManager.instance = new EnvironmentConfigManager()
    }
    return EnvironmentConfigManager.instance
  }

  // 构建配置对象
  private buildConfig(): EnvironmentConfig {
    const env = this.detectEnvironment()
    
    return {
      // 基础配置
      env,
      isDevelopment: env === EnvironmentType.DEVELOPMENT,
      isProduction: env === EnvironmentType.PRODUCTION,
      isTesting: env === EnvironmentType.TESTING,
      
      // API配置
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || this.getDefaultApiUrl(env),
      apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
      enableMock: import.meta.env.VITE_ENABLE_MOCK === 'true',
      mockDelay: parseInt(import.meta.env.VITE_MOCK_DELAY || '300'),
      retryAttempts: parseInt(import.meta.env.VITE_RETRY_ATTEMPTS || '3'),
      
      // 调试配置
      debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
      logLevel: (import.meta.env.VITE_LOG_LEVEL as any) || 'info',
      enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
      
      // 功能开关
      enableHotReload: import.meta.env.VITE_ENABLE_HOT_RELOAD === 'true',
      enableAnalytics: env === EnvironmentType.PRODUCTION,
      
      // 性能配置
      imageCdnUrl: import.meta.env.VITE_IMAGE_CDN_URL,
      imageQuality: parseInt(import.meta.env.VITE_IMAGE_QUALITY || '80'),
    }
  }

  // 检测当前环境
  private detectEnvironment(): EnvironmentType {
    const mode = import.meta.env.MODE || import.meta.env.NODE_ENV || 'development'
    const appEnv = import.meta.env.VITE_APP_ENV
    
    // 优先使用VITE_APP_ENV
    if (appEnv) {
      switch (appEnv) {
        case 'production':
          return EnvironmentType.PRODUCTION
        case 'staging':
          return EnvironmentType.STAGING
        case 'testing':
          return EnvironmentType.TESTING
        default:
          return EnvironmentType.DEVELOPMENT
      }
    }
    
    // 回退到MODE或NODE_ENV
    switch (mode) {
      case 'production':
        return EnvironmentType.PRODUCTION
      case 'staging':
        return EnvironmentType.STAGING
      case 'test':
      case 'testing':
        return EnvironmentType.TESTING
      default:
        return EnvironmentType.DEVELOPMENT
    }
  }

  // 获取默认API URL
  private getDefaultApiUrl(env: EnvironmentType): string {
    switch (env) {
      case EnvironmentType.PRODUCTION:
        return 'https://api.moviesite.com/v1'
      case EnvironmentType.STAGING:
        return 'https://staging-api.moviesite.com/v1'
      case EnvironmentType.TESTING:
        return 'http://test-api.moviesite.com/v1'
      default:
        return 'http://localhost:3000/api'
    }
  }

  // 获取完整配置
  public getConfig(): EnvironmentConfig {
    return { ...this.config }
  }

  // 获取环境类型
  public getEnvironment(): EnvironmentType {
    return this.config.env
  }

  // 是否为开发环境
  public isDevelopment(): boolean {
    return this.config.isDevelopment
  }

  // 是否为生产环境
  public isProduction(): boolean {
    return this.config.isProduction
  }

  // 是否为测试环境
  public isTesting(): boolean {
    return this.config.isTesting
  }

  // 是否启用Mock数据
  public isMockEnabled(): boolean {
    return this.config.enableMock
  }

  // 是否启用调试模式
  public isDebugMode(): boolean {
    return this.config.debugMode
  }

  // 获取API配置
  public getApiConfig(): {
    baseUrl: string
    timeout: number
    retryAttempts: number
  } {
    return {
      baseUrl: this.config.apiBaseUrl,
      timeout: this.config.apiTimeout,
      retryAttempts: this.config.retryAttempts
    }
  }

  // 获取Mock配置
  public getMockConfig(): {
    enabled: boolean
    delay: number
  } {
    return {
      enabled: this.config.enableMock,
      delay: this.config.mockDelay
    }
  }

  // 获取调试配置
  public getDebugConfig(): {
    debugMode: boolean
    logLevel: string
    enableDevtools: boolean
  } {
    return {
      debugMode: this.config.debugMode,
      logLevel: this.config.logLevel,
      enableDevtools: this.config.enableDevtools
    }
  }

  // 获取性能配置
  public getPerformanceConfig(): {
    imageCdnUrl?: string
    imageQuality: number
  } {
    return {
      imageCdnUrl: this.config.imageCdnUrl,
      imageQuality: this.config.imageQuality
    }
  }

  // 打印配置信息（仅开发环境）
  public printConfig(): void {
    if (this.config.isDevelopment && this.config.debugMode) {
      console.group('🔧 环境配置信息')
      console.log('环境:', this.config.env)
      console.log('API地址:', this.config.apiBaseUrl)
      console.log('Mock模式:', this.config.enableMock ? '启用' : '禁用')
      console.log('调试模式:', this.config.debugMode ? '启用' : '禁用')
      console.log('日志级别:', this.config.logLevel)
      console.groupEnd()
    }
  }
}

// 导出配置管理器实例
export const environmentConfig = EnvironmentConfigManager.getInstance()

// 导出便捷方法
export const isDevelopment = () => environmentConfig.isDevelopment()
export const isProduction = () => environmentConfig.isProduction()
export const isTesting = () => environmentConfig.isTesting()
export const isMockEnabled = () => environmentConfig.isMockEnabled()
export const isDebugMode = () => environmentConfig.isDebugMode()