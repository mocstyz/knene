/**
 * @fileoverview 统一的混合内容列表组件
 * @description 基于内容渲染器抽象层的统一列表组件，支持多种内容类型的混合展示。
 * 使用内容渲染器工厂自动选择最佳渲染器，实现真正的内容类型无关渲染。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */


import { BaseList, EmptyState } from '@components/domains/shared'
import {
  BaseContentItem,
  RendererConfig,
  ensureRenderersInitialized,
  isContentItem,
} from '@components/domains/shared/content-renderers'
import { contentRendererFactory } from '@components/domains/shared/content-renderers/renderer-factory'
import { RESPONSIVE_CONFIGS } from '@tokens/responsive-configs'
import { cn } from '@utils/cn'
import React, { useEffect, useState, useMemo } from 'react'


// ============================================================================
// 接口定义
// ============================================================================

/**
 * 混合内容列表组件属性接口
 */
export interface MixedContentListProps {
  /** 混合内容数据列表 */
  items: BaseContentItem[]
  /** 内容项点击事件 */
  onItemClick?: (item: BaseContentItem) => void
  /** 自定义CSS类名 */
  className?: string
  /** 布局变体 */
  variant?: 'grid' | 'list'
  /** 响应式列数配置 */
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    xxl?: number
  }
  /** 默认渲染器配置 */
  defaultRendererConfig?: Partial<RendererConfig>
  /** 内容类型特定的渲染器配置 */
  rendererConfigs?: Record<string, Partial<RendererConfig>>
  /** 是否启用内容类型过滤 */
  enableFilter?: boolean
  /** 允许的内容类型列表（空表示允许所有类型） */
  allowedContentTypes?: string[]
  /** 是否显示内容类型标签 */
  showContentTypeLabels?: boolean
  /** 是否启用虚拟滚动 */
  enableVirtualScroll?: boolean
  /** 虚拟滚动项目高度 */
  itemHeight?: number
  /** 加载状态 */
  loading?: boolean
  /** 错误状态 */
  error?: string | null
  /** 重试加载回调 */
  onRetry?: () => void
  /** 空状态配置 */
  emptyState?: {
    message?: string
    description?: string
  }
  /** 调试模式 */
  debug?: boolean
}

/**
 * 渲染状态接口
 */
interface RenderState {
  /** 是否已初始化 */
  initialized: boolean
  /** 初始化错误 */
  initError: string | null
  /** 渲染器统计信息 */
  rendererStats: {
    total: number
    successful: number
    failed: number
    byContentType: Record<string, number>
  }
  /** 缺失渲染器的内容类型 */
  missingRenderers: string[]
}

// ============================================================================
// 组件实现
// ============================================================================

/**
 * 混合内容列表组件
 * 支持多种内容类型的统一渲染和展示
 */
const MixedContentList: React.FC<MixedContentListProps> = ({
  items,
  onItemClick,
  className,
  variant = 'grid',
  columns = RESPONSIVE_CONFIGS.mixedContent,
  defaultRendererConfig = {},
  rendererConfigs = {},
  enableFilter = false,
  allowedContentTypes = [],
  showContentTypeLabels = false,
  enableVirtualScroll = false,
  itemHeight = 300,
  loading = false,
  error = null,
  onRetry,
  emptyState,
  debug = false,
}) => {
  // 渲染状态管理
  const [renderState, setRenderState] = useState<RenderState>({
    initialized: false,
    initError: null,
    rendererStats: {
      total: 0,
      successful: 0,
      failed: 0,
      byContentType: {},
    },
    missingRenderers: [],
  })

  // 初始化渲染器
  useEffect(() => {
    const initializeRenderers = async () => {
      try {
        if (debug) {
          console.log('MixedContentList: Initializing renderers...')
        }

        const result = await ensureRenderersInitialized()

        if (debug) {
          console.log('MixedContentList: Renderers initialized:', result)
        }

        setRenderState(prev => ({
          ...prev,
          initialized: true,
          initError: result.success ? null : result.errors.join(', '),
        }))
      } catch (err) {
        const errorMessage = `Failed to initialize renderers: ${err}`
        console.error('MixedContentList:', errorMessage)

        setRenderState(prev => ({
          ...prev,
          initialized: true,
          initError: errorMessage,
        }))
      }
    }

    initializeRenderers()
  }, [debug])

  // 过滤和处理内容项
  const processedItems = useMemo(() => {
    if (!Array.isArray(items)) {
      return []
    }

    const filteredItems = items.filter(item => {
      // 验证内容项
      if (!isContentItem(item)) {
        console.warn('MixedContentList: Invalid content item:', item)
        return false
      }

      // 内容类型过滤
      if (enableFilter && allowedContentTypes.length > 0) {
        return allowedContentTypes.includes(item.contentType)
      }

      return true
    })

    if (debug) {
      console.log('MixedContentList: Processed items:', {
        original: items.length,
        filtered: filteredItems.length,
        byContentType: filteredItems.reduce(
          (acc, item) => {
            acc[item.contentType] = (acc[item.contentType] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        ),
      })
    }

    return filteredItems
  }, [items, enableFilter, allowedContentTypes, debug])

  // 检查缺失的渲染器
  useEffect(() => {
    if (!renderState.initialized) return

    const missingTypes = new Set<string>()
    const stats = { ...renderState.rendererStats }

    processedItems.forEach(item => {
      const hasRenderer = contentRendererFactory.isRegistered(
        item.contentType as any
      )

      if (!hasRenderer) {
        missingTypes.add(item.contentType)
      } else {
        stats.successful++
      }

      stats.total++
      stats.byContentType[item.contentType] =
        (stats.byContentType[item.contentType] || 0) + 1
    })

    stats.failed = missingTypes.size

    setRenderState(prev => ({
      ...prev,
      rendererStats: stats,
      missingRenderers: Array.from(missingTypes),
    }))
  }, [processedItems, renderState.initialized])

  // 获取渲染器配置
  const getRendererConfig = (item: BaseContentItem): RendererConfig => {
    const baseConfig: RendererConfig = {
      hoverEffect: true,
      aspectRatio: 'portrait',
      showVipBadge: true,
      showNewBadge: true,
      showQualityBadge: true,
      showRatingBadge: true,
      size: 'md',
      className: '',
      onClick: onItemClick,
      extraOptions: {},
      ...defaultRendererConfig,
    }

    // 合并内容类型特定的配置
    const typeSpecificConfig = rendererConfigs[item.contentType] || {}
    return { ...baseConfig, ...typeSpecificConfig }
  }

  // 渲染单个内容项
  const renderContentItem = (item: BaseContentItem): React.ReactNode => {
    const renderer = contentRendererFactory.getBestRenderer(item)

    if (!renderer) {
      if (debug) {
        console.warn(
          `MixedContentList: No renderer found for content type: ${item.contentType}`
        )
      }

      return (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-800">
          <div>
            <div className="mb-2 text-gray-500">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.title}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              不支持的内容类型: {item.contentType}
            </p>
          </div>
        </div>
      )
    }

    try {
      const config = getRendererConfig(item)
      return renderer.render(item, config)
    } catch (error) {
      console.error(`MixedContentList: Error rendering item ${item.id}:`, error)

      return (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
          <div>
            <div className="mb-2 text-red-500">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-red-900 dark:text-red-100">
              渲染错误
            </h3>
            <p className="mt-1 text-xs text-red-500">{item.title}</p>
          </div>
        </div>
      )
    }
  }

  // 渲染内容类型标签
  const renderContentTypeLabel = (item: BaseContentItem) => {
    if (!showContentTypeLabels) return null

    const typeLabels: Record<string, string> = {
      movie: '电影',
      photo: '写真',
      collection: '合集',
      video: '视频',
      article: '文章',
      live: '直播',
    }

    const label = typeLabels[item.contentType] || item.contentType

    return (
      <div className="absolute left-2 top-2 z-20">
        <span className="rounded bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {label}
        </span>
      </div>
    )
  }

  // 渲染加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  // 渲染错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            加载失败
          </h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {error}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
            >
              重试
            </button>
          )}
        </div>
      </div>
    )
  }

  // 渲染初始化错误
  if (renderState.initError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mb-4 text-orange-500">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            渲染器初始化失败
          </h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {renderState.initError}
          </p>
        </div>
      </div>
    )
  }

  // 渲染空状态
  if (processedItems.length === 0) {
    return (
      <EmptyState
        message={emptyState?.message || '暂无内容'}
        description={emptyState?.description}
        className={className}
        size="lg"
        variant="center"
      />
    )
  }

  // 主渲染
  return (
    <div className={cn('mixed-content-list', className)}>
      {/* 调试信息 */}
      {debug && (
        <div className="mb-4 rounded bg-gray-100 p-3 text-xs dark:bg-gray-800">
          <h4 className="mb-2 font-medium">调试信息:</h4>
          <div>总项目数: {renderState.rendererStats.total}</div>
          <div>成功渲染: {renderState.rendererStats.successful}</div>
          <div>失败渲染: {renderState.rendererStats.failed}</div>
          <div>缺失渲染器: {renderState.missingRenderers.join(', ')}</div>
          <div>按内容类型统计:</div>
          {Object.entries(renderState.rendererStats.byContentType).map(
            ([type, count]) => (
              <div key={type} className="ml-2">
                - {type}: {count}
              </div>
            )
          )}
        </div>
      )}

      {/* 内容列表 */}
      <BaseList 
        items={processedItems}
        variant={variant} 
        columns={columns}
        renderItem={(item) => (
          <div className="relative">
            {renderContentTypeLabel(item)}
            {renderContentItem(item)}
          </div>
        )}
      />
    </div>
  )
}

export { MixedContentList }
export default MixedContentList
