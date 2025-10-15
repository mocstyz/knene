/**
 * 业务领域组件变体配置统一导出
 * 按照Claude.md第1.3章业务领域划分提供分层导出
 */

// 电影管理领域变体
export * from './movie-variants'

// 下载管理领域变体
export * from './download-variants'

// 类型重新导出，保持向后兼容
export type {
  MovieCardVariant,
  MovieCardSize,
  MovieCardItemVariant,
  MovieCardItemSize,
  MovieGridVariant,
  MovieDetailVariant,
  MovieDetailLayout,
  RatingVariant,
  RatingSize,
  RatingColorScheme,
  HeroVariant,
  HeroSize,
} from './movie-variants'

export type {
  DownloadProgressVariant,
  DownloadProgressSize,
  ProgressVariant,
  ProgressSize,
  DownloadButtonVariant,
  DownloadButtonSize,
  DownloadButtonState,
  DownloadListVariant,
  DownloadListSize,
  DownloadStatusVariant,
  DownloadStatusSize,
} from './download-variants'
