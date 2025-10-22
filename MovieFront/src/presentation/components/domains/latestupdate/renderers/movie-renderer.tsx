/**
 * @fileoverview 电影内容渲染器实现
 * @description 基于内容渲染器抽象层的电影内容渲染器。
 *              使用现有的MovieLayer组件进行渲染，保持与现有系统的兼容性。
 *              提供电影内容的完整渲染逻辑，包括数据验证、预处理、错误处理等功能。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */


import { MovieLayer } from '@components/domains/latestupdate/components'
import {
  BaseContentRenderer,
  BaseContentItem,
  ContentRenderer,
  RendererConfig,
  ValidationResult,
} from '@components/domains/shared/content-renderers'
import { cn } from '@utils/cn'
import React from 'react'

// 电影内容项接口，扩展基础内容项，添加电影特有属性
export interface MovieContentItem extends BaseContentItem {
  contentType: 'movie' // 内容类型固定为 'movie'
  year?: number // 电影年份
  duration?: number // 电影时长（分钟）
  genres?: string[] // 电影类型/分类
  director?: string // 导演
  actors?: string[] // 主演
  quality?: string // 电影质量
  size?: string // 文件大小
  downloadCount?: number // 下载次数
  rating?: number // 评分
  ratingColor?: 'purple' | 'red' | 'white' | 'default' // 评分颜色
  isNew?: boolean // 是否为新片
  newType?: 'hot' | 'latest' | null // 新项目类型标识，对齐统一类型系统
  isVip?: boolean // 是否为VIP内容
}

// 电影内容渲染器，使用MovieLayer组件渲染电影内容
export class MovieContentRenderer extends BaseContentRenderer {
  public readonly contentType = 'movie' as const
  public readonly name: string = 'MovieContentRenderer'
  public readonly version: string = '1.0.0'

  // 具体的渲染实现方法，使用MovieLayer组件渲染电影内容
  protected doRender(
    item: BaseContentItem,
    config: RendererConfig
  ): React.ReactElement {
    const movieItem = item as MovieContentItem

    return (
      <div
        className={this.getClassName(config)}
        style={this.getStyle(config)}
        onClick={this.createClickHandler(movieItem, config)}
      >
        <MovieLayer
          movie={{
            id: movieItem.id,
            title: movieItem.title,
            poster: movieItem.imageUrl,
            alt: movieItem.alt,
            year: movieItem.year,
            duration: movieItem.duration,
            genres: movieItem.genres,
            description: movieItem.description,
            director: movieItem.director,
            actors: movieItem.actors,
            quality: movieItem.quality,
            size: movieItem.size,
            downloadCount: movieItem.downloadCount,
            rating: movieItem.rating,
          }}
          variant="default"
          onPlay={() => config.onClick?.(movieItem)}
          showHover={config.hoverEffect}
          showVipBadge={config.showVipBadge}
          showQualityBadge={config.showQualityBadge}
          showRatingBadge={config.showRatingBadge}
          showNewBadge={config.showNewBadge}
          newBadgeType={movieItem.newType}
          ratingColor={movieItem.ratingColor}
          qualityText={movieItem.quality}
        />
      </div>
    )
  }

  // 验证电影特定字段，检查电影数据的合理性和完整性
  protected validateSpecificFields(item: BaseContentItem): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    // 电影特定验证
    if (item.contentType !== 'movie') {
      errors.push(
        `Invalid content type: expected 'movie', got '${item.contentType}'`
      )
    }

    // 检查年份是否合理
    const movieItem = item as MovieContentItem
    if (movieItem.year) {
      const currentYear = new Date().getFullYear()
      if (movieItem.year < 1900 || movieItem.year > currentYear + 5) {
        warnings.push(`Suspicious year: ${movieItem.year}`)
      }
    }

    // 检查时长是否合理
    if (movieItem.duration) {
      if (movieItem.duration <= 0 || movieItem.duration > 1000) {
        warnings.push(`Suspicious duration: ${movieItem.duration} minutes`)
      }
    }

    // 检查评分范围
    if (movieItem.rating !== undefined) {
      if (movieItem.rating < 0 || movieItem.rating > 10) {
        errors.push(`Invalid rating: ${movieItem.rating} (must be 0-10)`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  // 预处理电影内容项，进行数据标准化和默认值设置
  protected preprocessItem(
    item: BaseContentItem,
    config: RendererConfig
  ): BaseContentItem {
    const movieItem = item as MovieContentItem

    // 数据标准化和默认值设置 - 只设置BaseContentItem中存在的属性
    return {
      ...movieItem,
    }
  }

  // 获取电影渲染器的默认配置，返回电影专用的默认设置
  public getDefaultConfig(): Partial<RendererConfig> {
    return {
      ...super.getDefaultConfig(),
      aspectRatio: 'portrait',
      showVipBadge: true,
      showNewBadge: true,
      showQualityBadge: true,
      showRatingBadge: true,
      hoverEffect: true,
    }
  }

  // 获取电影渲染器支持的配置选项，返回所有支持的配置项列表
  public getSupportedConfigOptions(): string[] {
    return [
      ...super.getSupportedConfigOptions(),
      'showYear',
      'showDuration',
      'showGenres',
      'showDirector',
      'showActors',
      'showFileSize',
      'showDownloadCount',
      'ratingColor',
      'qualityText',
      'newBadgeType',
    ]
  }

  // 创建错误状态的电影组件，当渲染出错时显示错误信息
  protected renderErrorItem(
    item: BaseContentItem,
    config?: RendererConfig,
    errors: string[] = []
  ): React.ReactElement {
    const movieItem = item as MovieContentItem
    const finalConfig = this.mergeConfig(config)

    return (
      <div
        className={this.getClassName(finalConfig)}
        style={this.getStyle(finalConfig)}
        onClick={this.createClickHandler(movieItem, finalConfig)}
      >
        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 p-4 text-center dark:bg-gray-800">
          {/* 错误图标 */}
          <div className="mb-3 text-red-500">
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
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4"
              />
            </svg>
          </div>

          {/* 电影标题 */}
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            {movieItem.title || 'Unknown Movie'}
          </h3>

          {/* 年份信息 */}
          {movieItem.year && (
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              {movieItem.year}
            </p>
          )}

          {/* 错误信息 */}
          {errors.length > 0 && (
            <div className="mt-3 rounded bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}

          {/* 操作按钮 */}
          {finalConfig.onClick && (
            <button
              onClick={e => {
                e.stopPropagation()
                finalConfig.onClick?.(movieItem)
              }}
              className="mt-4 rounded bg-blue-500 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-600"
            >
              查看详情
            </button>
          )}
        </div>
      </div>
    )
  }

  // 获取电影专用的CSS类名，返回合并后的CSS类名
  public getClassName(config: RendererConfig): string {
    return cn(
      super.getClassName(config),
      'movie-content-renderer'
    )
  }
}

// 检查内容项是否为电影内容项，类型守卫函数
export function isMovieContentItem(item: any): item is MovieContentItem {
  return (
    item &&
    typeof item === 'object' &&
    item.contentType === 'movie' &&
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.imageUrl === 'string'
  )
}

// 创建电影内容项，工厂函数用于创建新的电影内容项
export function createMovieContentItem(
  data: Partial<MovieContentItem>
): MovieContentItem {
  return {
    id: '',
    title: '',
    contentType: 'movie',
    imageUrl: '',
    ...data,
  }
}

export default MovieContentRenderer
