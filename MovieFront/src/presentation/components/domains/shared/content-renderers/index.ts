/**
 * @fileoverview 内容渲染器模块入口文件
 * @description 导出内容渲染器系统的所有公共接口和实现。
 * 提供统一的访问入口，简化模块导入。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// ============================================================================
// 渲染器导出
// ============================================================================

export { BaseContentRenderer } from './base'

// 导出类型
export type {
  BaseContentItem,
  ExtendedContentItem,
  ContentTypeId,
  RendererConfig,
  ContentRenderer,
  ValidationResult,
  RendererRegistration,
  ContentRendererFactory,
  RegistrationOptions,
} from './interfaces'

// 导入内部类型
import type {
  BaseContentItem as InternalBaseContentItem,
  ContentTypeId as InternalContentTypeId,
  RendererConfig as InternalRendererConfig,
} from './interfaces'
import { contentRendererFactory } from './renderer-factory'

export {
  isContentItem,
  isExtendedContentItem,
  isValidContentType,
} from './interfaces'

// ============================================================================
// 工厂实现
// ============================================================================

export {
  ContentRendererFactoryClass,
  contentRendererFactory,
} from './renderer-factory'

// ============================================================================
// 注册表实现
// ============================================================================

export {
  rendererRegistry,
  ensureRenderersInitialized,
  isRenderersInitialized,
  waitForRenderersInitialized,
} from './registry'

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 创建渲染器配置对象
 */
export const createRendererConfig = (
  overrides: Partial<InternalRendererConfig> = {}
): InternalRendererConfig => {
  return {
    aspectRatio: 'square',
    hoverEffect: false,
    showTitle: true,
    showDescription: false,
    className: '',
    ...overrides,
  }
}

/**
 * 创建内容项对象
 */
export const createContentItem = (
  data: Partial<InternalBaseContentItem>
): InternalBaseContentItem => {
  return {
    id: '',
    title: '',
    contentType: 'movie',
    imageUrl: '',
    ...data,
  }
}

/**
 * 检查渲染器是否可用
 */
export const isRendererAvailable = (
  contentType: InternalContentTypeId
): boolean => {
  return contentRendererFactory.hasRenderer(contentType)
}

/**
 * 获取可用的内容类型
 */
export const getAvailableContentTypes = (): InternalContentTypeId[] => {
  return contentRendererFactory.getAvailableContentTypes()
}

// ============================================================================
// 渲染函数
// ============================================================================

/**
 * 渲染内容项
 */
export const renderContentItem = (
  item: InternalBaseContentItem,
  config?: InternalRendererConfig
) => {
  return contentRendererFactory.render(item, config)
}

// ============================================================================
// 导出默认工厂
// ============================================================================

export default contentRendererFactory

// ============================================================================
// 重新导出渲染器类型
// ============================================================================

export type { CollectionContentItem } from '@components/domains/collections/renderers/collection-renderer'
