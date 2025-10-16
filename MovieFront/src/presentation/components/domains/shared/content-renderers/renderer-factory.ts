/**
 * @fileoverview 内容渲染器工厂实现
 * @description 提供内容渲染器的注册、管理和创建功能。
 * 使用单例模式确保全局只有一个工厂实例。
 * 支持优先级排序、动态注册和注销、智能选择最佳渲染器。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import CollectionContentRenderer from '@components/domains/shared/content-renderers/collection-renderer'
import type {
  ContentRenderer,
  ContentRendererFactory,
  BaseContentItem,
  ContentTypeId,
  RendererRegistration,
  RegistrationOptions,
} from '@components/domains/shared/content-renderers/interfaces'
import MovieContentRenderer from '@components/domains/shared/content-renderers/movie-renderer'
import PhotoContentRenderer from '@components/domains/shared/content-renderers/photo-renderer'

/**
 * 内容渲染器工厂实现
 * 单例模式，全局唯一的渲染器管理器
 */
export class DefaultContentRendererFactory implements ContentRendererFactory {
  private static instance: DefaultContentRendererFactory | null = null

  /**
   * 已注册的渲染器映射表
   * Key: ContentTypeId, Value: RendererRegistration
   */
  private renderers: Map<ContentTypeId, RendererRegistration> = new Map()

  /**
   * 渲染器优先级缓存
   * 用于快速查找最佳渲染器
   */
  private priorityCache: ContentTypeId[] = []

  /**
   * 私有构造函数，实现单例模式
   */
  private constructor() {
    this.initializeBuiltinRenderers()
  }

  /**
   * 获取工厂实例
   * @returns 工厂单例实例
   */
  public static getInstance(): DefaultContentRendererFactory {
    if (!DefaultContentRendererFactory.instance) {
      DefaultContentRendererFactory.instance =
        new DefaultContentRendererFactory()
    }
    return DefaultContentRendererFactory.instance
  }

  /**
   * 注册新的内容渲染器
   * @param renderer 渲染器实例
   * @param options 注册选项
   */
  public register(
    renderer: ContentRenderer,
    options: RegistrationOptions = {}
  ): void {
    const {
      registrar = 'anonymous',
      enabled = true,
      priority = 0,
      override = false,
    } = options

    const contentType = renderer.contentType

    // 检查是否已存在同类型的渲染器
    if (this.renderers.has(contentType) && !override) {
      throw new Error(
        `Renderer for content type '${contentType}' is already registered. ` +
          `Use override option to replace it.`
      )
    }

    // 创建注册信息
    const registration: RendererRegistration = {
      contentType,
      renderer,
      registeredAt: new Date(),
      registrar,
      enabled,
      priority,
    }

    // 注册渲染器
    this.renderers.set(contentType, registration)

    // 更新优先级缓存
    this.updatePriorityCache()

    console.log(
      `Content renderer '${renderer.name}' for type '${contentType}' ` +
        `registered by ${registrar} (priority: ${priority})`
    )
  }

  /**
   * 注销内容渲染器
   * @param contentType 内容类型ID
   */
  public unregister(contentType: ContentTypeId): void {
    const registration = this.renderers.get(contentType)

    if (registration) {
      this.renderers.delete(contentType)
      this.updatePriorityCache()

      console.log(
        `Content renderer '${registration.renderer.name}' ` +
          `for type '${contentType}' unregistered`
      )
    } else {
      console.warn(
        `No renderer found for content type '${contentType}' to unregister`
      )
    }
  }

  /**
   * 根据内容类型获取渲染器
   * @param contentType 内容类型ID
   * @returns 渲染器实例或null
   */
  public getRenderer(contentType: ContentTypeId): ContentRenderer | null {
    const registration = this.renderers.get(contentType)

    if (registration && registration.enabled) {
      return registration.renderer
    }

    return null
  }

  /**
   * 根据内容项自动选择最佳渲染器
   * @param item 内容项
   * @returns 最佳渲染器或null
   */
  public getBestRenderer(item: BaseContentItem): ContentRenderer | null {
    // 首先尝试直接匹配内容类型
    const renderer = this.getRenderer(item.contentType)

    if (renderer && renderer.canRender(item)) {
      return renderer
    }

    // 如果直接匹配失败，遍历所有启用的渲染器寻找最佳匹配
    const enabledRenderers = Array.from(this.renderers.values())
      .filter(reg => reg.enabled)
      .sort((a, b) => b.priority - a.priority) // 按优先级排序

    for (const registration of enabledRenderers) {
      if (registration.renderer.canRender(item)) {
        console.warn(
          `Using fallback renderer '${registration.renderer.name}' ` +
            `for content type '${item.contentType}' (priority: ${registration.priority})`
        )
        return registration.renderer
      }
    }

    // 没有找到合适的渲染器
    console.error(
      `No suitable renderer found for content type '${item.contentType}'`
    )
    return null
  }

  /**
   * 获取所有已注册的渲染器
   * @returns 渲染器列表
   */
  public getAllRenderers(): ContentRenderer[] {
    return Array.from(this.renderers.values())
      .filter(reg => reg.enabled)
      .map(reg => reg.renderer)
  }

  /**
   * 获取已注册的内容类型列表
   * @returns 内容类型ID列表
   */
  public getRegisteredContentTypes(): ContentTypeId[] {
    return Array.from(this.renderers.keys())
  }

  /**
   * 检查指定内容类型是否已注册
   * @param contentType 内容类型ID
   * @returns 是否已注册
   */
  public isRegistered(contentType: ContentTypeId): boolean {
    return this.renderers.has(contentType)
  }

  /**
   * 启用或禁用渲染器
   * @param contentType 内容类型ID
   * @param enabled 是否启用
   */
  public setRendererEnabled(
    contentType: ContentTypeId,
    enabled: boolean
  ): void {
    const registration = this.renderers.get(contentType)

    if (registration) {
      registration.enabled = enabled
      console.log(
        `Renderer '${registration.renderer.name}' for type '${contentType}' ` +
          `${enabled ? 'enabled' : 'disabled'}`
      )
    } else {
      console.warn(`No renderer found for content type '${contentType}'`)
    }
  }

  /**
   * 获取渲染器注册信息
   * @param contentType 内容类型ID
   * @returns 注册信息或null
   */
  public getRegistrationInfo(
    contentType: ContentTypeId
  ): RendererRegistration | null {
    return this.renderers.get(contentType) || null
  }

  /**
   * 获取所有渲染器的注册信息
   * @returns 注册信息列表
   */
  public getAllRegistrationInfo(): RendererRegistration[] {
    return Array.from(this.renderers.values())
  }

  /**
   * 清空所有已注册的渲染器
   * 主要用于测试场景
   */
  public clear(): void {
    this.renderers.clear()
    this.priorityCache = []
    console.log('All content renderers cleared')
  }

  /**
   * 重置工厂到初始状态
   * 清空所有渲染器并重新初始化内置渲染器
   */
  public reset(): void {
    this.clear()
    this.initializeBuiltinRenderers()
  }

  // ============================================================================
  // 私有方法
  // ============================================================================

  /**
   * 更新优先级缓存
   * 按优先级排序内容类型列表
   */
  private updatePriorityCache(): void {
    this.priorityCache = Array.from(this.renderers.entries())
      .sort(([, a], [, b]) => b.priority - a.priority)
      .map(([contentType]) => contentType)
  }

  /**
   * 初始化内置渲染器
   * 注册系统默认提供的基础渲染器
   */
  private initializeBuiltinRenderers(): void {
    console.log('Initializing built-in content renderers...')

    // 注册内置渲染器
    this.register(new MovieContentRenderer(), {
      registrar: 'system',
      enabled: true,
      priority: 100,
      override: false,
    })

    this.register(new PhotoContentRenderer(), {
      registrar: 'system',
      enabled: true,
      priority: 90,
      override: false,
    })

    this.register(new CollectionContentRenderer(), {
      registrar: 'system',
      enabled: true,
      priority: 80,
      override: false,
    })
  }

  // ============================================================================
  // 调试和监控方法
  // ============================================================================

  /**
   * 获取工厂统计信息
   * @returns 统计信息对象
   */
  public getStats(): {
    totalRenderers: number
    enabledRenderers: number
    disabledRenderers: number
    contentTypes: ContentTypeId[]
  } {
    const allRegistrations = Array.from(this.renderers.values())
    const enabledRegistrations = allRegistrations.filter(reg => reg.enabled)
    const disabledRegistrations = allRegistrations.filter(reg => !reg.enabled)

    return {
      totalRenderers: allRegistrations.length,
      enabledRenderers: enabledRegistrations.length,
      disabledRenderers: disabledRegistrations.length,
      contentTypes: Array.from(this.renderers.keys()),
    }
  }

  /**
   * 输出工厂状态到控制台
   * 用于调试和监控
   */
  public logStatus(): void {
    const stats = this.getStats()
    console.group('Content Renderer Factory Status')
    console.log('Total Renderers:', stats.totalRenderers)
    console.log('Enabled Renderers:', stats.enabledRenderers)
    console.log('Disabled Renderers:', stats.disabledRenderers)
    console.log('Content Types:', stats.contentTypes)

    console.group('Renderer Details')
    Array.from(this.renderers.entries()).forEach(
      ([contentType, registration]) => {
        console.log(`${contentType}:`, {
          name: registration.renderer.name,
          version: registration.renderer.version,
          enabled: registration.enabled,
          priority: registration.priority,
          registrar: registration.registrar,
          registeredAt: registration.registeredAt,
        })
      }
    )
    console.groupEnd()

    console.groupEnd()
  }

  /**
   * 验证工厂状态
   * 检查是否存在配置问题
   * @returns 验证结果
   */
  public validateFactory(): {
    isValid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []

    // 检查是否有启用的渲染器
    const enabledRenderers = this.getAllRenderers()
    if (enabledRenderers.length === 0) {
      errors.push('No enabled renderers found')
    }

    // 检查内容类型重复
    const contentTypes = this.getRegisteredContentTypes()
    const duplicateTypes = contentTypes.filter(
      (type, index) => contentTypes.indexOf(type) !== index
    )
    if (duplicateTypes.length > 0) {
      errors.push(`Duplicate content types: ${duplicateTypes.join(', ')}`)
    }

    // 检查渲染器完整性
    Array.from(this.renderers.entries()).forEach(
      ([contentType, registration]) => {
        const renderer = registration.renderer

        if (!renderer.contentType) {
          errors.push(
            `Renderer for ${contentType} missing contentType property`
          )
        }

        if (!renderer.name) {
          warnings.push(`Renderer for ${contentType} missing name property`)
        }

        if (!renderer.version) {
          warnings.push(`Renderer for ${contentType} missing version property`)
        }

        if (typeof renderer.canRender !== 'function') {
          errors.push(`Renderer for ${contentType} missing canRender method`)
        }

        if (typeof renderer.render !== 'function') {
          errors.push(`Renderer for ${contentType} missing render method`)
        }
      }
    )

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }
}

/**
 * 导出工厂单例实例
 * 使用此实例进行所有渲染器操作
 */
export const contentRendererFactory =
  DefaultContentRendererFactory.getInstance()

/**
 * 导出工厂类（用于测试或特殊场景）
 * 重命名以避免重复导出错误
 */
export { DefaultContentRendererFactory as ContentRendererFactoryClass }
