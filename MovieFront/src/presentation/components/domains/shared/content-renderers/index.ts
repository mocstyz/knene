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
// 接口和类型定义
// ============================================================================

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

export {
  isContentItem,
  isExtendedContentItem,
  isValidContentType,
} from './interfaces'

// ============================================================================
// 基础实现类
// ============================================================================

export { BaseContentRenderer } from './base-renderer'

// ============================================================================
// 工厂实现
// ============================================================================

export {
  ContentRendererFactoryClass,
  contentRendererFactory,
} from './renderer-factory'

// ============================================================================
// 具体渲染器实现
// ============================================================================

export {
  default as MovieContentRenderer,
  isMovieContentItem,
  createMovieContentItem,
} from './movie-renderer'
export type { MovieContentItem } from './movie-renderer'

export {
  default as PhotoContentRenderer,
  isPhotoContentItem,
  createPhotoContentItem,
} from './photo-renderer'
export type { PhotoContentItem } from './photo-renderer'

export {
  default as CollectionContentRenderer,
  isCollectionContentItem,
  createCollectionContentItem,
} from './collection-renderer'
export type { CollectionContentItem } from './collection-renderer'

// ============================================================================
// 注册机制
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
 * 创建内容渲染器配置
 * @param overrides 覆盖的配置项
 * @returns 完整的渲染器配置
 */
export const createRendererConfig = (
  overrides: Partial<RendererConfig> = {}
): RendererConfig => {
  return {
    hoverEffect: true,
    aspectRatio: 'portrait',
    showVipBadge: true,
    showNewBadge: true,
    showQualityBadge: true,
    showRatingBadge: true,
    size: 'md',
    className: '',
    extraOptions: {},
    ...overrides,
  }
}

/**
 * 创建内容项对象
 * @param data 基础数据
 * @returns 内容项对象
 */
export const createContentItem = (
  data: Partial<BaseContentItem>
): BaseContentItem => {
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
 * @param contentType 内容类型
 * @returns 是否可用
 */
export const isRendererAvailable = (contentType: ContentTypeId): boolean => {
  return contentRendererFactory.isRegistered(contentType)
}

/**
 * 获取可用的内容类型列表
 * @returns 内容类型列表
 */
export const getAvailableContentTypes = (): ContentTypeId[] => {
  return contentRendererFactory.getRegisteredContentTypes()
}

/**
 * 渲染内容项（便捷方法）
 * @param item 内容项
 * @param config 渲染配置
 * @returns React组件或null
 */
export const renderContentItem = (
  item: BaseContentItem,
  config?: RendererConfig
) => {
  const renderer = contentRendererFactory.getBestRenderer(item)
  return renderer ? renderer.render(item, config) : null
}

// ============================================================================
// 默认导出
// ============================================================================

/**
 * 默认导出工厂实例，便于直接使用
 */
export default contentRendererFactory