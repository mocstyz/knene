/**
 * @fileoverview 内容渲染器注册机制
 * @description 自动注册所有内容渲染器到工厂中，提供统一的初始化入口。
 * 支持动态加载和延迟注册，便于模块化管理。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { contentRendererFactory } from './renderer-factory'
import MovieContentRenderer from './movie-renderer'
import PhotoContentRenderer from './photo-renderer'
import CollectionContentRenderer from './collection-renderer'

/**
 * 渲染器注册配置接口
 */
interface RendererRegistrationConfig {
  /** 渲染器类 */
  rendererClass: any
  /** 注册选项 */
  options?: {
    registrar?: string
    enabled?: boolean
    priority?: number
    override?: boolean
  }
  /** 是否延迟注册 */
  lazy?: boolean
}

/**
 * 内置渲染器注册配置列表
 */
const BUILTIN_RENDERER_CONFIGS: RendererRegistrationConfig[] = [
  {
    rendererClass: MovieContentRenderer,
    options: {
      registrar: 'system',
      enabled: true,
      priority: 100, // 高优先级，电影是最常见的内容类型
      override: false,
    },
    lazy: false,
  },
  {
    rendererClass: PhotoContentRenderer,
    options: {
      registrar: 'system',
      enabled: true,
      priority: 90, // 次高优先级，写真内容也很常见
      override: false,
    },
    lazy: false,
  },
  {
    rendererClass: CollectionContentRenderer,
    options: {
      registrar: 'system',
      enabled: true,
      priority: 80, // 中等优先级，合集内容相对较少
      override: false,
    },
    lazy: false,
  },
]

/**
 * 渲染器注册状态
 */
enum RegistrationStatus {
  UNINITIALIZED = 'uninitialized',
  REGISTERING = 'registering',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * 渲染器注册管理器
 */
class RendererRegistry {
  private status: RegistrationStatus = RegistrationStatus.UNINITIALIZED
  private registeredRenderers: string[] = []
  private failedRegistrations: Array<{ renderer: string; error: string }> = []

  /**
   * 初始化所有内置渲染器
   * @returns 初始化结果
   */
  public async initialize(): Promise<{
    success: boolean
    registered: number
    failed: number
    errors: string[]
  }> {
    if (this.status === RegistrationStatus.COMPLETED) {
      console.log('Renderer registry already initialized')
      return {
        success: true,
        registered: this.registeredRenderers.length,
        failed: this.failedRegistrations.length,
        errors: this.failedRegistrations.map(r => r.error),
      }
    }

    this.status = RegistrationStatus.REGISTERING
    console.log('Initializing content renderer registry...')

    let registeredCount = 0
    let failedCount = 0
    const errors: string[] = []

    try {
      // 注册非延迟的渲染器
      for (const config of BUILTIN_RENDERER_CONFIGS) {
        if (!config.lazy) {
          try {
            await this.registerRenderer(config)
            registeredCount++
          } catch (error) {
            failedCount++
            const errorMessage = `Failed to register ${config.rendererClass.name}: ${error}`
            errors.push(errorMessage)
            this.failedRegistrations.push({
              renderer: config.rendererClass.name,
              error: String(error),
            })
            console.error(errorMessage)
          }
        }
      }

      this.status = RegistrationStatus.COMPLETED
      console.log(`Renderer registry initialization completed: ${registeredCount} registered, ${failedCount} failed`)

      // 输出工厂状态用于调试
      if (process.env.NODE_ENV === 'development') {
        contentRendererFactory.logStatus()
      }

      return {
        success: failedCount === 0,
        registered: registeredCount,
        failed: failedCount,
        errors,
      }
    } catch (error) {
      this.status = RegistrationStatus.FAILED
      const errorMessage = `Renderer registry initialization failed: ${error}`
      console.error(errorMessage)
      return {
        success: false,
        registered: registeredCount,
        failed: failedCount + 1,
        errors: [errorMessage],
      }
    }
  }

  /**
   * 注册单个渲染器
   * @param config 渲染器注册配置
   */
  private async registerRenderer(config: RendererRegistrationConfig): Promise<void> {
    const { rendererClass, options = {} } = config

    console.log(`Registering renderer: ${rendererClass.name}`)

    // 创建渲染器实例
    const rendererInstance = new rendererClass()

    // 验证渲染器实例
    this.validateRenderer(rendererInstance, rendererClass.name)

    // 注册到工厂
    contentRendererFactory.register(rendererInstance, options)

    // 记录成功注册
    this.registeredRenderers.push(rendererClass.name)

    console.log(`Successfully registered renderer: ${rendererClass.name}`)
  }

  /**
   * 验证渲染器实例
   * @param renderer 渲染器实例
   * @param name 渲染器名称
   */
  private validateRenderer(renderer: any, name: string): void {
    if (!renderer) {
      throw new Error(`Renderer instance is null: ${name}`)
    }

    if (typeof renderer.contentType !== 'string') {
      throw new Error(`Invalid contentType in renderer: ${name}`)
    }

    if (typeof renderer.canRender !== 'function') {
      throw new Error(`Missing canRender method in renderer: ${name}`)
    }

    if (typeof renderer.render !== 'function') {
      throw new Error(`Missing render method in renderer: ${name}`)
    }

    if (typeof renderer.validateItem !== 'function') {
      throw new Error(`Missing validateItem method in renderer: ${name}`)
    }
  }

  /**
   * 获取注册状态
   * @returns 当前注册状态
   */
  public getStatus(): RegistrationStatus {
    return this.status
  }

  /**
   * 获取已注册的渲染器列表
   * @returns 已注册的渲染器名称列表
   */
  public getRegisteredRenderers(): string[] {
    return [...this.registeredRenderers]
  }

  /**
   * 获取失败的注册信息
   * @returns 失败的注册信息列表
   */
  public getFailedRegistrations(): Array<{ renderer: string; error: string }> {
    return [...this.failedRegistrations]
  }

  /**
   * 重新初始化注册器
   * 清空当前状态并重新注册所有渲染器
   */
  public async reinitialize(): Promise<{
    success: boolean
    registered: number
    failed: number
    errors: string[]
  }> {
    console.log('Reinitializing renderer registry...')

    // 重置状态
    this.status = RegistrationStatus.UNINITIALIZED
    this.registeredRenderers = []
    this.failedRegistrations = []

    // 清空工厂
    contentRendererFactory.clear()

    // 重新初始化
    return this.initialize()
  }

  /**
   * 手动注册外部渲染器
   * @param rendererClass 渲染器类
   * @param options 注册选项
   */
  public async registerExternalRenderer(
    rendererClass: any,
    options?: {
      registrar?: string
      enabled?: boolean
      priority?: number
      override?: boolean
    }
  ): Promise<void> {
    const config: RendererRegistrationConfig = {
      rendererClass,
      options: {
        registrar: options?.registrar || 'external',
        enabled: options?.enabled ?? true,
        priority: options?.priority ?? 0,
        override: options?.override ?? false,
      },
      lazy: false,
    }

    await this.registerRenderer(config)
  }

  /**
   * 注销渲染器
   * @param contentType 内容类型
   */
  public unregisterRenderer(contentType: string): void {
    contentRendererFactory.unregister(contentType as any)

    // 从已注册列表中移除
    const index = this.registeredRenderers.findIndex(name => name === contentType)
    if (index !== -1) {
      this.registeredRenderers.splice(index, 1)
    }

    console.log(`Unregistered renderer: ${contentType}`)
  }
}

// ============================================================================
// 导出单例实例
// ============================================================================

/**
 * 渲染器注册管理器单例
 */
export const rendererRegistry = new RendererRegistry()

// ============================================================================
// 自动初始化
// ============================================================================

/**
 * 自动初始化渲染器注册器
 * 在模块加载时自动执行
 */
let initializationPromise: Promise<{
  success: boolean
  registered: number
  failed: number
  errors: string[]
}> | null = null

export function ensureRenderersInitialized(): Promise<{
  success: boolean
  registered: number
  failed: number
  errors: string[]
}> {
  if (!initializationPromise) {
    initializationPromise = rendererRegistry.initialize()
  }
  return initializationPromise
}

// 在非测试环境下自动初始化
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'test') {
  // 延迟初始化，确保所有模块都已加载
  setTimeout(() => {
    ensureRenderersInitialized().catch(error => {
      console.error('Failed to initialize renderers:', error)
    })
  }, 0)
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 检查渲染器是否已初始化
 * @returns 是否已初始化
 */
export function isRenderersInitialized(): boolean {
  return rendererRegistry.getStatus() === RegistrationStatus.COMPLETED
}

/**
 * 等待渲染器初始化完成
 * @param timeout 超时时间（毫秒）
 * @returns 初始化结果
 */
export async function waitForRenderersInitialized(
  timeout: number = 5000
): Promise<{
  success: boolean
  registered: number
  failed: number
  errors: string[]
}> {
  const startTime = Date.now()

  while (!isRenderersInitialized() && (Date.now() - startTime) < timeout) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  if (!isRenderersInitialized()) {
    throw new Error(`Renderer initialization timeout after ${timeout}ms`)
  }

  return ensureRenderersInitialized()
}

// ============================================================================
// 默认导出
// ============================================================================

export default rendererRegistry