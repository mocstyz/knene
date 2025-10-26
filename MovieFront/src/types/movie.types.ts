/**
 * @fileoverview Movie相关类型定义
 * @description 定义Movie相关的基础类型和接口，遵循DDD架构的类型设计原则，将复杂的接口拆分为多个基础接口组合，提高可维护性和扩展性，包含基础接口、组合接口、详情页面类型、内容渲染器类型、混合内容类型、配置接口和类型守卫函数
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 基础媒体项目接口，所有媒体类型的通用属性
export interface BaseMediaItem {
  id: string // 唯一标识符
  title: string // 标题
  type: 'Movie' | 'TV Show' | 'Collection' | 'Photo' // 媒体类型，添加Photo支持
  description?: string // 描述信息
}

// 媒体图片接口，处理图片相关的属性
export interface MediaImageItem {
  imageUrl: string // 图片URL
  alt?: string // 图片alt文本
}

// 媒体评分接口，处理评分相关的属性
export interface MediaRatingItem {
  rating: string // Douban评分值（字符串格式，如 "7.5"）
  doubanRating?: string // Douban评分（明确命名，与rating保持兼容）
  ratingColor?: 'purple' | 'red' | 'white' | 'default' // 评分颜色
}

// 媒体质量接口，处理质量相关的属性
export interface MediaQualityItem {
  quality?: string // 质量标识
}

// 媒体状态接口，处理状态相关的属性
export interface MediaStatusItem {
  isNew?: boolean // 是否为新内容（24小时内发布）
  isVip?: boolean // 是否为VIP专享内容
  newType?: 'hot' | 'latest' | null // NEW标签类型
  tags?: string[] // 标签列表
  isHot?: boolean // 是否为热门内容
  isFeatured?: boolean // 是否为精选内容
  movieCount?: number // 影片数量（用于合集类型）
}

// 媒体统计接口，处理统计相关的属性
export interface MediaStatsItem {
  viewCount?: number // 观看次数
  downloadCount?: number // 下载次数
  likeCount?: number // 点赞数
  favoriteCount?: number // 收藏数
}

// 媒体格式接口，处理格式相关的属性（如写真模块的图片格式）
export interface MediaFormatItem {
  formatType?: 'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP' // 图片格式类型
}

// 媒体排名接口，处理排名相关的属性
export interface MediaRankItem {
  rank?: number // 排名
}

// 基础电影项目接口，组合了基础媒体、图片、评分、质量接口
export interface BaseMovieItem
  extends BaseMediaItem,
  MediaImageItem,
  MediaRatingItem,
  MediaQualityItem,
  MediaStatsItem {
  genres?: string[] // 电影类型/分类
  year?: number // 年份
  duration?: number // 时长（分钟）
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
}

// 完整电影项目接口，包含所有电影相关属性
export interface FullMovieItem
  extends BaseMovieItem,
  MediaStatusItem,
  MediaFormatItem { }

// 写真项目接口，写真专用的接口组合
export interface PhotoItem
  extends BaseMovieItem,
  MediaStatusItem,
  MediaFormatItem,
  MediaStatsItem {
  contentType?: 'movie' | 'photo' | 'collection' // 内容类型标识符，用于内容渲染器系统
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
}

// 最新更新项目接口，最新更新专用的接口组合
export interface LatestItem extends BaseMovieItem, MediaStatusItem, MediaStatsItem {
  contentType?: 'movie' | 'photo' | 'collection' // 内容类型标识符，用于内容渲染器系统
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
}

// TOP项目接口，TOP排名专用的接口组合
export interface TopItem extends BaseMovieItem, MediaRankItem { }

// 热门项目接口，继承基础电影项目和状态属性
export interface HotItem extends BaseMovieItem, MediaStatusItem, MediaStatsItem {
  hotScore?: number // 热度分数
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
}

// 合集项目接口，合集专用的接口组合，包含合集的完整信息
export interface CollectionItem extends BaseMediaItem, MediaImageItem, MediaStatusItem, MediaRatingItem, MediaStatsItem {
  type: 'Collection' // 合集类型固定为Collection
  contentType: 'collection' // 内容类型标识符，用于内容渲染器系统
  description?: string // 合集描述
  alt?: string // 图片alt文本
  isNew?: boolean // 是否为新内容
  newType?: 'hot' | 'latest' | null // NEW标签类型
  isVip?: boolean // 是否为VIP专享内容
  tags?: string[] // 标签列表
  isHot?: boolean // 是否为热门内容
  isFeatured?: boolean // 是否为精选内容
  movieIds?: string[] // 合集包含的影片ID列表
  category?: string // 合集分类
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
  publishDate?: string // 发布日期
}

// 电影详情接口，电影详情页面专用的完整信息接口
export interface MovieDetail extends FullMovieItem {
  director?: string
  cast?: string[]
  country?: string
  language?: string
  duration?: number
  year?: number
  plot?: string
  downloadLinks?: DownloadLink[]
  recommendations?: BaseMovieItem[]
  viewCount?: number
  downloadCount?: number
  favoriteCount?: number
  commentCount?: number
  votes?: number
  // 多平台评分系统
  // rating 字段继承自 MediaRatingItem，实际上是 Douban 评分（字符串格式）
  doubanRating?: string // Douban评分（明确命名，字符串格式如 "7.5"）
  imdbRating?: number // IMDb评分 (0-10，数字格式)
  tmdbRating?: number // TMDb评分 (0-10，数字格式)
  resource?: ResourceInfo
  fileInfo?: FileInfo
  screenshots?: Screenshot[]
  thankYouCount?: number
  isFavorited?: boolean
  isThankYouActive?: boolean
  // isVip 字段已经从 FullMovieItem -> MediaStatusItem 继承
}

// 下载链接接口
export interface DownloadLink {
  id: string
  name: string
  url: string
  size?: string
  format?: string
  quality?: string
  isVip?: boolean // 统一使用isVip命名，与其他接口保持一致
}

// 资源信息接口
export interface ResourceInfo {
  title: string
  tags: ResourceTag[]
  stats: ResourceStats
  uploader: UploaderInfo
}

// 资源标签接口
export interface ResourceTag {
  label: string
  color: 'green' | 'blue' | 'yellow' | 'purple' | 'red' | 'indigo'
}

// 资源统计接口
export interface ResourceStats {
  viewCount: number // 统一使用xxxCount格式
  downloadCount: number // 统一使用xxxCount格式
  likeCount: number // 统一使用xxxCount格式
  dislikeCount: number // 统一使用xxxCount格式
}

// 上传者信息接口
export interface UploaderInfo {
  name: string
  uploadTime: string
}

// 文件信息接口
export interface FileInfo {
  format: string
  size: string
  duration: string
  video: VideoInfo
  audio: AudioInfo
  subtitles: SubtitleInfo[]
  rawInfo?: string // 原始完整技术信息文本（BDInfo 或 MediaInfo）
  rawInfoType?: 'bdinfo' | 'mediainfo' // 原始数据类型
}

// 视频信息接口
export interface VideoInfo {
  codec: string
  resolution: string
  fps: string
}

// 音频信息接口
export interface AudioInfo {
  codec: string
  channels: string
  sampleRate: string
}

// 字幕信息接口
export interface SubtitleInfo {
  language: string
  isHighlighted: boolean
}

// 截图接口
export interface Screenshot {
  url: string
  alt: string
}

// 评论接口
export interface Comment {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: string
  likes: number
  dislikes: number
  replies?: Comment[]
}

// 字幕下载源接口
export interface SubtitleSource {
  name: string
  description: string
  url: string
}

// 合集详情接口，合集详情页面专用的完整信息接口
export interface CollectionDetail extends CollectionItem {
  coverImage?: string // 封面图片
  movieIds?: string[] // 合集中的电影ID列表
  genre?: string // 合集类型/分类
  publishDate?: string // 发布日期
  creator?: string // 创建者
  collectionDescription?: string // 合集描述
  itemCount?: number // 项目数量
  totalDuration?: number // 总时长
  updateFrequency?: string // 更新频率
  lastUpdated?: string // 最后更新时间
  subscriptionCount?: number // 订阅数量
  movies?: BaseMovieItem[] // 合集中的电影列表
}

// 统一内容项接口，定义所有内容类型的统一数据结构，包含完整的业务状态字段
export interface UnifiedContentItem {
  id: string // 内容唯一标识
  title: string // 内容标题
  contentType: 'movie' | 'photo' | 'collection' | 'video' | 'article' | 'live' // 内容类型
  description?: string // 内容描述
  imageUrl: string // 图片URL
  alt?: string // 图片alt文本
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
  tags?: string[] // 标签列表
  isVip?: boolean // 是否为VIP专享内容
  isNew?: boolean // 是否为新内容（24小时内发布）
  newType?: 'hot' | 'latest' | null // NEW标签类型
  rating?: number // 评分
  ratingColor?: string // 评分颜色
  quality?: string // 质量标识
  isHot?: boolean // 是否为热门内容
  isFeatured?: boolean // 是否为精选内容
  viewCount?: number // 浏览次数
  downloadCount?: number // 下载次数
  likeCount?: number // 点赞数
  favoriteCount?: number // 收藏数
  publishDate?: string // 发布日期
  metadata?: Record<string, any> // 内容元数据
}

// 混合内容项目接口，支持在最新更新和热门模块中混合展示不同类型的内容
export interface MixedContentItem extends BaseMovieItem, MediaStatusItem {
  contentType?: 'movie' | 'photo' | 'collection' // 内容类型，用于内容渲染器选择
  updatedAt?: string // 更新时间
  updateType?: 'new' | 'update' | 'episode' | 'version' // 更新类型
  rank?: number // 热度排名
  hotScore?: number // 热度分数
  viewCount24h?: number // 24小时内访问次数
  rankChange?: number // 上升排名
}

// 内容类型推断函数，基于数据特征自动推断内容类型
export function inferContentType(item: any): 'movie' | 'photo' | 'collection' {
  // 优先检查显式的contentType字段
  if (item.contentType) {
    return item.contentType
  }

  // 检查type字段（Mock数据中的标识）
  if (item.type === 'Collection') {
    return 'collection'
  }

  // 检查写真特征
  if (item.formatType || item.resolution || item.model || item.photographer) {
    return 'photo'
  }

  // 检查合集特征
  if (item.itemCount || item.collectionDescription || item.creator) {
    return 'collection'
  }

  // 默认为电影
  return 'movie'
}

// 检查是否为混合内容项
export function isMixedContentItem(item: any): item is MixedContentItem {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.title === 'string'
  )
}

// 转换为统一内容项格式
export function toUnifiedContentItem(item: any): UnifiedContentItem & { contentType: 'movie' | 'photo' | 'collection' | 'video' | 'article' | 'live' } {
  const contentType = item.contentType || inferContentType(item)

  return {
    id: item.id,
    title: item.title,
    contentType,
    description: item.description,
    imageUrl: item.imageUrl,
    alt: item.alt,
    createdAt: item.createdAt || item.updatedAt,
    updatedAt: item.updatedAt,
    tags: item.tags,
    isVip: item.isVip ?? false,
    isNew: item.isNew,
    newType: item.newType || 'new',
    rating: item.rating ? parseFloat(item.rating) : undefined,
    ratingColor: item.ratingColor,
    quality: item.quality,
    metadata: {
      ...item.metadata,
      originalType: contentType,
      sourceData: item,
    },
  }
}

// 响应式列数配置接口，统一各模块的列数配置格式
export interface ResponsiveColumnsConfig {
  xs?: number // 超小屏幕断点配置
  sm?: number // 小屏幕断点配置
  md?: number // 中等屏幕断点配置
  lg?: number // 大屏幕断点配置
  xl?: number // 超大屏幕断点配置
}

// 卡片配置接口，定义卡片组件的显示配置选项，支持多种布局变体和显示选项
export interface CardConfig {
  showRatingBadge?: boolean // 是否显示评分徽章
  showQualityBadge?: boolean // 是否显示质量徽章
  showVipBadge?: boolean // 是否显示VIP徽章
  showNewBadge?: boolean // 是否显示NEW徽章
  showHotBadge?: boolean // 是否显示热门徽章
  showFeaturedBadge?: boolean // 是否显示精选徽章
  qualityText?: string // 质量文本
  newBadgeType?: 'hot' | 'latest' // NEW徽章类型
}

// 检查是否为合集项目
export function isCollectionItem(item: any): item is CollectionItem {
  return item && typeof item === 'object' && item.type === 'Collection' && item.contentType === 'collection'
}

// 检查是否为写真项目
export function isPhotoItem(item: any): item is PhotoItem {
  return item && 'formatType' in item
}

// 检查是否为最新项目
export function isLatestItem(item: any): item is LatestItem {
  return item && ('isNew' in item || 'newType' in item)
}

// 检查是否为TOP项目
export function isTopItem(item: any): item is TopItem {
  return item && 'rank' in item
}

// 验证CollectionItem的完整性
export function isValidCollectionItem(item: any): item is CollectionItem {
  if (!item || typeof item !== 'object') {
    return false
  }
  
  // 检查必需字段
  if (!item.id || typeof item.id !== 'string') {
    console.warn('CollectionItem validation failed: missing or invalid id')
    return false
  }
  
  if (!item.title || typeof item.title !== 'string') {
    console.warn('CollectionItem validation failed: missing or invalid title')
    return false
  }
  
  if (item.type !== 'Collection') {
    console.warn('CollectionItem validation failed: type must be "Collection"')
    return false
  }
  
  if (item.contentType !== 'collection') {
    console.warn('CollectionItem validation failed: contentType must be "collection"')
    return false
  }
  
  // 检查VIP字段（必需）
  if (typeof item.isVip !== 'boolean') {
    console.warn('CollectionItem validation failed: isVip must be boolean')
    return false
  }
  
  // 检查可选字段的类型
  if (item.isNew !== undefined && typeof item.isNew !== 'boolean') {
    console.warn('CollectionItem validation failed: isNew must be boolean if present')
    return false
  }
  
  if (item.quality !== undefined && typeof item.quality !== 'string') {
    console.warn('CollectionItem validation failed: quality must be string if present')
    return false
  }
  
  return true
}

// 验证PhotoItem的完整性
export function isValidPhotoItem(item: any): item is PhotoItem {
  if (!item || typeof item !== 'object') {
    return false
  }
  
  // 检查必需字段
  if (!item.id || typeof item.id !== 'string') {
    console.warn('PhotoItem validation failed: missing or invalid id')
    return false
  }
  
  if (!item.title || typeof item.title !== 'string') {
    console.warn('PhotoItem validation failed: missing or invalid title')
    return false
  }
  
  if (item.type !== 'Photo') {
    console.warn('PhotoItem validation failed: type must be "Photo"')
    return false
  }
  
  if (item.contentType !== 'photo') {
    console.warn('PhotoItem validation failed: contentType must be "photo"')
    return false
  }
  
  // 检查VIP字段（必需）
  if (typeof item.isVip !== 'boolean') {
    console.warn('PhotoItem validation failed: isVip must be boolean')
    return false
  }
  
  // 检查可选字段的类型
  if (item.isNew !== undefined && typeof item.isNew !== 'boolean') {
    console.warn('PhotoItem validation failed: isNew must be boolean if present')
    return false
  }
  
  if (item.quality !== undefined && typeof item.quality !== 'string') {
    console.warn('PhotoItem validation failed: quality must be string if present')
    return false
  }
  
  if (item.formatType !== undefined && !['JPEG高', 'PNG', 'WebP', 'GIF', 'BMP'].includes(item.formatType)) {
    console.warn('PhotoItem validation failed: invalid formatType')
    return false
  }
  
  return true
}

// 验证MovieItem的完整性
export function isValidMovieItem(item: any): item is BaseMovieItem {
  if (!item || typeof item !== 'object') {
    return false
  }
  
  // 检查必需字段
  if (!item.id || typeof item.id !== 'string') {
    console.warn('MovieItem validation failed: missing or invalid id')
    return false
  }
  
  if (!item.title || typeof item.title !== 'string') {
    console.warn('MovieItem validation failed: missing or invalid title')
    return false
  }
  
  if (item.type !== 'Movie') {
    console.warn('MovieItem validation failed: type must be "Movie"')
    return false
  }
  
  // 检查VIP字段（可选但如果存在必须是boolean）
  if (item.isVip !== undefined && typeof item.isVip !== 'boolean') {
    console.warn('MovieItem validation failed: isVip must be boolean if present')
    return false
  }
  
  // 检查可选字段的类型
  if (item.isNew !== undefined && typeof item.isNew !== 'boolean') {
    console.warn('MovieItem validation failed: isNew must be boolean if present')
    return false
  }
  
  if (item.quality !== undefined && typeof item.quality !== 'string') {
    console.warn('MovieItem validation failed: quality must be string if present')
    return false
  }
  
  if (item.rating !== undefined && typeof item.rating !== 'string' && typeof item.rating !== 'number') {
    console.warn('MovieItem validation failed: rating must be string or number if present')
    return false
  }
  
  return true
}
