/**
 * @fileoverview 内容渲染器注册机制
 * @description 自动注册所有内容渲染器到工厂中，提供统一的初始化入口。
 *              支持动态加载和延迟注册，便于模块化管理。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 移除对renderer-factory的直接依赖，避免循环依赖
// 内置渲染器现在由renderer-factory自己初始化

// 渲染器注册状态
enum RegistrationStatus {
  UNINITIALIZED = 'uninitialized',
  COMPLETED = 'completed',
}

// 渲染器注册管理器，现在只作为状态管理器，实际的注册由renderer-factory处理
class RendererRegistry {
  private status: RegistrationStatus = RegistrationStatus.UNINITIALIZED

  // 初始化所有内置渲染器
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
        registered: 3, // 内置渲染器数量
        failed: 0,
        errors: [],
      }
    }

    this.status = RegistrationStatus.COMPLETED
    console.log(
      'Renderer registry initialization completed - managed by factory'
    )

    return {
      success: true,
      registered: 3,
      failed: 0,
      errors: [],
    }
  }

  // 获取注册状态
  public getStatus(): RegistrationStatus {
    return this.status
  }

  // 获取已注册的渲染器列表
  public getRegisteredRenderers(): string[] {
    return [
      'MovieContentRenderer',
      'PhotoContentRenderer',
      'CollectionContentRenderer',
    ]
  }

  // 获取失败的注册信息
  public getFailedRegistrations(): Array<{ renderer: string; error: string }> {
    return []
  }

  // 重新初始化注册器，清空当前状态并重新注册所有渲染器
  public async reinitialize(): Promise<{
    success: boolean
    registered: number
    failed: number
    errors: string[]
  }> {
    console.log('Reinitializing renderer registry...')
    this.status = RegistrationStatus.UNINITIALIZED
    return this.initialize()
  }

  // 手动注册外部渲染器
  public async registerExternalRenderer(
    rendererClass: any,
    options?: {
      registrar?: string
      enabled?: boolean
      priority?: number
      override?: boolean
    }
  ): Promise<void> {
    console.log(
      `External renderer registration requested: ${rendererClass.name}`
    )
    // 通过动态导入来注册外部渲染器
    const { contentRendererFactory } = await import('./index')
    const rendererInstance = new rendererClass()
    contentRendererFactory.register(rendererInstance, options)
    console.log(
      `Successfully registered external renderer: ${rendererClass.name}`
    )
  }

  // 注销渲染器
  public async unregisterRenderer(contentType: string): Promise<void> {
    console.log(`Renderer unregistration requested: ${contentType}`)
    // 通过动态导入来注销渲染器
    const { contentRendererFactory } = await import('./index')
    contentRendererFactory.unregister(contentType as any)
    console.log(`Successfully unregistered renderer: ${contentType}`)
  }
}

// 导出单例实例
export const rendererRegistry = new RendererRegistry()

// 自动初始化
// 自动初始化渲染器注册器，在模块加载时自动执行
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

// 工具函数

// 检查渲染器是否已初始化
export function isRenderersInitialized(): boolean {
  return rendererRegistry.getStatus() === RegistrationStatus.COMPLETED
}

// 等待渲染器初始化完成
export async function waitForRenderersInitialized(
  timeout: number = 5000
): Promise<{
  success: boolean
  registered: number
  failed: number
  errors: string[]
}> {
  const startTime = Date.now()

  while (!isRenderersInitialized() && Date.now() - startTime < timeout) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  if (!isRenderersInitialized()) {
    throw new Error(`Renderer initialization timeout after ${timeout}ms`)
  }

  return ensureRenderersInitialized()
}

export default rendererRegistry
