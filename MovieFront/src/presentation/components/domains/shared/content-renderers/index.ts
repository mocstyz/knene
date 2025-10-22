// 渲染器导出
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

// 工厂实现
export {
  ContentRendererFactoryClass,
  contentRendererFactory,
} from './renderer-factory'

// 注册表实现
export {
  rendererRegistry,
  ensureRenderersInitialized,
  isRenderersInitialized,
  waitForRenderersInitialized,
} from './registry'

// 工具函数
// 创建渲染器配置对象，提供默认配置和自定义选项合并
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

// 创建内容项对象，提供默认内容项创建功能
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

// 检查渲染器是否可用，返回指定内容类型的渲染器状态
export const isRendererAvailable = (
  contentType: InternalContentTypeId
): boolean => {
  return contentRendererFactory.hasRenderer(contentType)
}

// 获取可用的内容类型，返回所有已注册的内容类型列表
export const getAvailableContentTypes = (): InternalContentTypeId[] => {
  return contentRendererFactory.getAvailableContentTypes()
}

// 渲染内容项，使用最佳渲染器渲染指定内容项
export const renderContentItem = (
  item: InternalBaseContentItem,
  config?: InternalRendererConfig
) => {
  return contentRendererFactory.render(item, config)
}

// 导出默认工厂实例
export default contentRendererFactory

// 重新导出渲染器类型，用于类型引用
export type { CollectionContentItem } from '@components/domains/collections/renderers/collection-renderer'