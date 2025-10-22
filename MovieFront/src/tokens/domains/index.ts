/**
 * @fileoverview 业务领域组件变体配置统一导出
 * @description 业务领域组件变体配置的统一导出入口，按照业务领域划分提供分层导出
 *              包括电影管理领域和下载管理领域的组件变体配置，提供完整的类型定义
 *              和向后兼容性支持，注意部分组件已被内容渲染器系统替代
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 电影管理领域变体导出 - 导出影片详情、评分徽章、英雄区块等影片管理相关组件的变体配置
export * from './movie-variants'

// 下载管理领域变体导出 - 导出下载进度、进度条、下载按钮、下载列表、下载状态等下载管理相关组件的变体配置
export * from './download-variants'

// 电影管理领域类型重新导出 - 保持向后兼容性，导出影片管理相关的类型定义
// 注意：MovieCard、MovieGrid相关类型已被内容渲染器系统替代
export type {
  MovieDetailVariant, // 影片详情变体类型
  MovieDetailLayout, // 影片详情布局类型
  RatingVariant, // 评分徽章变体类型
  RatingSize, // 评分徽章尺寸类型
  RatingColorScheme, // 评分徽章颜色方案类型
  HeroVariant, // 英雄区块变体类型
  HeroSize, // 英雄区块尺寸类型
} from './movie-variants'

// 下载管理领域类型重新导出 - 保持向后兼容性，导出下载管理相关的类型定义
export type {
  DownloadProgressVariant, // 下载进度变体类型
  DownloadProgressSize, // 下载进度尺寸类型
  ProgressVariant, // 进度条变体类型
  ProgressSize, // 进度条尺寸类型
  DownloadButtonVariant, // 下载按钮变体类型
  DownloadButtonSize, // 下载按钮尺寸类型
  DownloadButtonState, // 下载按钮状态类型
  DownloadListVariant, // 下载列表变体类型
  DownloadListSize, // 下载列表尺寸类型
  DownloadStatusVariant, // 下载状态变体类型
  DownloadStatusSize, // 下载状态尺寸类型
} from './download-variants'
