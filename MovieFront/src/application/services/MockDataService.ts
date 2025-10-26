/**
 * @fileoverview 统一Mock数据管理服务
 * @description 提供统一的Mock数据生成和管理功能，支持多种内容类型的Mock数据生成，确保前后端分离开发的数据一致性
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import type { CollectionItem, PhotoItem, LatestItem, BaseMovieItem, FullMovieItem, HotItem, MovieDetail } from '@types-movie'

// Mock数据管理服务，提供统一的Mock数据生成和缓存机制，支持环境配置切换
export class MockDataService {
  private static instance: MockDataService
  private mockDataCache = new Map<string, any>()

  private constructor() {
    // 初始化
  }

  // 获取单例实例
  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService()
    }
    return MockDataService.instance
  }

  // 生成Mock合集数据，直接生成CollectionItem格式用于前端展示
  public generateMockCollections(count: number = 12): CollectionItem[] {
    const cacheKey = `collections_${count}`
    
    // 缓存检查 - 避免重复生成相同数据
    if (this.mockDataCache.has(cacheKey)) {
      return this.mockDataCache.get(cacheKey)
    }

    const collections = Array.from({ length: count }, (_, index) => {
      const id = `collection_${index + 1}`
      
      // 生成最近30天内的随机发布时间
      const daysAgo = Math.random() * 30 // 0-30天前
      const publishDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      
      // 业务规则：计算是否为新内容（24小时内）
      const isNew = daysAgo <= 1
      
      // 直接构造CollectionItem对象
      const collectionItem: CollectionItem = {
        id,
        title: `精选合集 ${index + 1}`,
        type: 'Collection' as const,
        contentType: 'collection' as const,
        imageUrl: `https://picsum.photos/400/600?random=${index + 1}`,
        alt: `精选合集 ${index + 1} 封面`,
        description: `这是第${index + 1}个精选合集的描述`,
        
        // 业务字段 - 固定规则
        isVip: true, // 所有合集都是VIP
        isNew: isNew,
        newType: isNew ? 'latest' : null,
        
        // 统计字段 - 随机数
        viewCount: Math.floor(Math.random() * 50000) + 1000,
        downloadCount: Math.floor(Math.random() * 5000) + 50,
        likeCount: Math.floor(Math.random() * 5000) + 100,
        favoriteCount: Math.floor(Math.random() * 2000) + 50,
        
        // 其他字段
        movieCount: Math.floor(Math.random() * 50) + 10,
        category: ['动作', '科幻', '剧情'][index % 3],
        tags: ['热门', '推荐', '精选'],
        rating: (Math.random() * 4 + 6).toFixed(1),
        ratingColor: 'white' as const,
        createdAt: new Date(publishDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: publishDate.toISOString(),
        publishDate: publishDate.toISOString()
      }
      
      return collectionItem
    })

    // 缓存生成的数据 - 提升性能
    this.mockDataCache.set(cacheKey, collections)
    return collections
  }

  // 生成Mock影片数据，直接生成FullMovieItem格式用于前端展示
  public generateMockMovies(count: number = 20): FullMovieItem[] {
    const cacheKey = `movies_${count}`
    
    if (this.mockDataCache.has(cacheKey)) {
      return this.mockDataCache.get(cacheKey)
    }

    const movies = Array.from({ length: count }, (_, index) => {
      const id = `movie_${index + 1}`
      const genres = ['动作', '喜剧', '剧情', '科幻', '恐怖'][index % 5]
      const releaseYear = 2024 - Math.floor(Math.random() * 5)
      
      // 生成最近30天内的随机发布时间
      const daysAgo = Math.random() * 30 // 0-30天前
      const publishDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      
      // 业务规则：计算是否为新内容（24小时内）
      const isNew = daysAgo <= 1
      
      // 业务规则：每3个中有1个是VIP
      const isVip = index % 3 === 0
      
      // 业务规则：质量标签基于索引的固定值
      const qualities = ['4K', 'HD', '1080P', '720P']
      const quality = qualities[index % qualities.length]
      
      // 直接构造BaseMovieItem对象
      const movieItem: BaseMovieItem & { 
        contentType?: 'movie'
        isVip?: boolean
        isNew?: boolean
        newType?: 'hot' | 'latest' | null
        viewCount?: number
        downloadCount?: number
        likeCount?: number
        favoriteCount?: number
        year?: number
        duration?: number
        createdAt?: string
        updatedAt?: string
      } = {
        id,
        title: `热门影片 ${index + 1}`,
        type: 'Movie' as const,
        contentType: 'movie' as const,
        imageUrl: `https://picsum.photos/300/450?random=${index + 100}`,
        alt: `热门影片 ${index + 1} 海报`,
        description: `这是第${index + 1}部热门影片的描述`,
        
        // 业务字段 - 固定规则
        isVip: isVip,
        isNew: isNew,
        newType: isNew ? 'latest' : null,
        quality: quality,
        rating: (Math.random() * 4 + 6).toFixed(1),
        ratingColor: 'white' as const,
        
        // 统计字段 - 随机数
        viewCount: Math.floor(Math.random() * 50000) + 1000,
        downloadCount: Math.floor(Math.random() * 10000),
        likeCount: Math.floor(Math.random() * 5000) + 100,
        favoriteCount: Math.floor(Math.random() * 2000) + 50,
        
        // 其他字段
        genres: [genres],
        duration: 90 + Math.floor(Math.random() * 60),
        year: releaseYear,
        createdAt: publishDate.toISOString(),
        updatedAt: publishDate.toISOString()
      }
      
      return movieItem
    })

    this.mockDataCache.set(cacheKey, movies)
    return movies
  }

  // 生成Mock图片数据，直接生成PhotoItem格式用于前端展示
  public generateMockPhotos(count: number = 15): PhotoItem[] {
    const cacheKey = `photos_${count}`
    
    if (this.mockDataCache.has(cacheKey)) {
      return this.mockDataCache.get(cacheKey)
    }

    const photos = Array.from({ length: count }, (_, index) => {
      const id = `photo_${index + 1}`
      const category = ['风景', '人物', '建筑', '动物', '艺术'][index % 5]
      
      // 生成最近30天内的随机发布时间
      const daysAgo = Math.random() * 30 // 0-30天前
      const publishDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      
      // 业务规则：计算是否为新内容（24小时内）
      const isNew = daysAgo <= 1
      
      // 业务规则：质量和格式基于索引的固定值
      const qualities = ['4K', 'HD', '高清']
      const quality = qualities[index % qualities.length]
      
      const formatTypes: Array<'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP'> = ['JPEG高', 'PNG', 'WebP', 'GIF', 'BMP']
      const formatType = formatTypes[index % formatTypes.length]
      
      // 直接构造PhotoItem对象
      const photoItem: PhotoItem = {
        id,
        title: `精美图片 ${index + 1}`,
        type: 'Photo' as const,
        contentType: 'photo' as const,
        imageUrl: `https://picsum.photos/600/400?random=${index + 200}`,
        alt: `精美图片 ${index + 1}`,
        description: `这是第${index + 1}张精美图片的描述`,
        
        // 业务字段 - 固定规则
        isVip: true, // 所有写真都是VIP
        isNew: isNew,
        newType: isNew ? 'latest' : null,
        quality: quality,
        formatType: formatType,
        rating: (Math.random() * 3 + 7).toFixed(1),
        ratingColor: 'white' as const,
        
        // 统计字段 - 随机数
        viewCount: Math.floor(Math.random() * 50000) + 1000,
        downloadCount: Math.floor(Math.random() * 5000) + 100,
        likeCount: Math.floor(Math.random() * 5000) + 100,
        favoriteCount: Math.floor(Math.random() * 2000) + 50,
        
        // 其他字段
        genres: [category],
        tags: [category, '高清', '精选'],
        createdAt: publishDate.toISOString(),
        updatedAt: publishDate.toISOString()
      }
      
      return photoItem
    })

    this.mockDataCache.set(cacheKey, photos)
    return photos
  }

  // 获取Mock合集数据，直接返回CollectionItem格式用于前端展示
  public getMockCollections(count: number = 12): CollectionItem[] {
    return this.generateMockCollections(count)
  }

  // 获取Mock写真数据，直接返回PhotoItem格式用于前端展示
  public getMockPhotos(count: number = 16): PhotoItem[] {
    return this.generateMockPhotos(count)
  }

  // 获取Mock最新更新数据，直接返回LatestItem格式用于前端展示（混合类型：影片、写真、合集）
  public getMockLatestUpdates(count: number = 6): LatestItem[] {
    // 生成大量数据用于分页测试（各100个，总共300个）
    const movies = this.generateMockMovies(100)
    const photos = this.generateMockPhotos(100)
    const collections = this.generateMockCollections(100)
    
    // 直接合并所有数据（已经是最终格式）
    const allItems: LatestItem[] = [
      ...movies.map(m => ({ ...m, contentType: 'movie' as const })),
      ...photos.map(p => ({ ...p, contentType: 'photo' as const })),
      ...collections.map(c => ({ ...c, contentType: 'collection' as const }))
    ]
    
    // 按发布时间排序（最新的在前）
    const sorted = allItems.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
      return dateB - dateA
    })
    
    // 取最新的N个
    return sorted.slice(0, count)
  }

  // 获取Mock 7天最热门数据，直接返回HotItem格式用于前端展示（混合类型：影片、写真、合集）
  public getMockWeeklyHot(count: number = 6): HotItem[] {
    // 生成大量数据用于分页测试（各100个，总共300个）
    const movies = this.generateMockMovies(100)
    const photos = this.generateMockPhotos(100)
    const collections = this.generateMockCollections(100)
    
    // 直接合并所有数据（已经是最终格式）
    const allItems: HotItem[] = [
      ...movies.map(m => ({ ...m, contentType: 'movie' as const })),
      ...photos.map(p => ({ ...p, contentType: 'photo' as const })),
      ...collections.map(c => ({ ...c, contentType: 'collection' as const }))
    ]
    
    // 过滤：只保留7天内的内容
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const withinSevenDays = allItems.filter(item => {
      const publishTime = new Date(item.updatedAt || item.createdAt || 0).getTime()
      return publishTime >= sevenDaysAgo
    })
    
    // 计算热度分数：观看次数 * 1 + 点赞数 * 5 + 收藏数 * 10
    const withHotScore = withinSevenDays.map(item => ({
      ...item,
      hotScore: (item.viewCount || 0) * 1 + (item.likeCount || 0) * 5 + (item.favoriteCount || 0) * 10
    }))
    
    // 按热度排序（最热的在前）
    const sorted = withHotScore.sort((a, b) => (b.hotScore || 0) - (a.hotScore || 0))
    
    // 取最热的N个（如果不足N个，返回实际数量）
    return sorted.slice(0, count)
  }
  
  // 保留旧方法名以兼容现有代码
  public getMockHotDaily(count: number = 6): HotItem[] {
    return this.getMockWeeklyHot(count)
  }

  // 获取扩展的Mock专题数据，支持更多配置选项和筛选条件
  public getExtendedMockCollections(options: {
    count?: number
    category?: string
    includeVipOnly?: boolean
  } = {}): CollectionItem[] {
    const { count = 12, category, includeVipOnly = false } = options
    let collections = this.generateMockCollections(count * 2) // 生成更多数据用于筛选

    // 分类筛选 - 根据指定分类过滤合集
    if (category) {
      collections = collections.filter(collection => collection.category === category)
    }

    // VIP筛选 - 所有合集都是VIP，所以这个筛选实际上不会过滤任何数据
    if (includeVipOnly) {
      collections = collections.filter(collection => collection.isVip)
    }

    return collections.slice(0, count)
  }

  // 获取扩展的Mock写真数据，支持更多配置选项和筛选条件
  public getExtendedMockPhotos(options: {
    count?: number
    category?: string
    includeVipOnly?: boolean
  } = {}): PhotoItem[] {
    const { count = 12, category, includeVipOnly = false } = options
    let photos = this.generateMockPhotos(count * 2) // 生成更多数据用于筛选

    // 分类筛选 - 根据指定分类过滤写真
    if (category) {
      photos = photos.filter(photo => photo.genres && photo.genres.includes(category))
    }

    // VIP筛选 - 所有写真都是VIP，所以这个筛选实际上不会过滤任何数据
    if (includeVipOnly) {
      photos = photos.filter(photo => photo.isVip)
    }

    return photos.slice(0, count)
  }

  // 生成Mock首页完整数据，返回HomeDataResponse格式用于首页展示
  public generateMockHomeData(): { collections: CollectionItem[], photos: PhotoItem[], latestUpdates: LatestItem[], hotDaily: HotItem[] } {
    const cacheKey = 'home_data'
    
    if (this.mockDataCache.has(cacheKey)) {
      return this.mockDataCache.get(cacheKey)
    }

    const homeData = {
      collections: this.getMockCollections(12),
      photos: this.getMockPhotos(15),
      latestUpdates: this.getMockLatestUpdates(20),
      hotDaily: this.getMockHotDaily(18)
    }

    this.mockDataCache.set(cacheKey, homeData)
    return homeData
  }

  // 获取单个合集详情，根据ID返回对应的合集信息
  public getMockCollectionDetail(collectionId: string): CollectionItem | null {
    const collections = this.generateMockCollections(50)
    return collections.find(c => c.id === collectionId) || null
  }

  // 获取单个影片详情，模拟后端API返回MovieDetail格式
  public getMockMovieDetail(movieId: string): MovieDetail {
    const cacheKey = `movie_detail_${movieId}`

    // 缓存检查
    if (this.mockDataCache.has(cacheKey)) {
      return this.mockDataCache.get(cacheKey)
    }

    // 解析影片索引，用于判断是否为合集影片
    const movieIndex = parseInt(movieId.replace('movie_', '')) || 1

    // 判断是否为合集影片（索引较大）
    const isCollectionMovie = movieIndex > 1000

    if (isCollectionMovie) {
      // 合集影片：模拟后端返回的完整MovieDetail数据
      const collectionIndex = Math.floor(movieIndex / 100)
      const movieInCollectionIndex = (movieIndex % 100) - 1

      const collectionMovieData: MovieDetail = {
        id: movieId,
        title: `合集${collectionIndex}-影片${movieInCollectionIndex + 1}`,
        type: 'Movie',
        year: 2019,
        imageUrl: `https://picsum.photos/400/600?random=${movieIndex}`,
        alt: `合集${collectionIndex}-影片${movieInCollectionIndex + 1} 海报`,
        description: `这是合集${collectionIndex}中的第${movieInCollectionIndex + 1}部影片`,
        director: `导演${movieInCollectionIndex + 1}`,
        cast: [`演员${movieInCollectionIndex + 1}`, `演员${movieInCollectionIndex + 2}`],
        country: '中国',
        language: '中文',
        duration: 135,
        genres: ['动作', '剧情', '科幻'][movieInCollectionIndex % 3],

        // 合集影片的VIP状态：固定为true
        isVip: true,

        // 多平台评分
        rating: '9.2',
        doubanRating: '9.2',
        ratingColor: 'purple',
        votes: 1500000,
        imdbRating: 8.7,
        tmdbRating: 8.1,
        quality: '1080p',

        thankYouCount: 1200,
        isFavorited: false,
        isThankYouActive: false,

        // 资源信息
        resource: {
          title: `合集${collectionIndex}-影片${movieInCollectionIndex + 1} (2019) Criterion 1080p BluRay x265 10bit DDP Atmos 7.1 English VIP`,
          tags: [
            { label: '特效字幕', color: 'green' },
            { label: '首发', color: 'blue' },
            { label: '中字', color: 'yellow' },
            { label: '国配', color: 'purple' },
            { label: '高码', color: 'red' },
            { label: '合集', color: 'indigo' },
          ],
          stats: {
            viewCount: 8700000,
            downloadCount: 200,
            likeCount: 24,
            dislikeCount: 0,
          },
          uploader: {
            name: 'mosctz',
            uploadTime: '18 hours ago',
          },
        },

        // 文件信息
        fileInfo: {
          format: 'MKV',
          size: '8.71 GiB',
          duration: '2h 15m',
          video: {
            codec: 'H.265',
            resolution: '1920x804',
            bitrate: '8000 kbps',
            frameRate: '23.976 fps',
          },
          audio: {
            codec: 'DTS',
            channels: '6',
            bitrate: '768 kbps',
            sampleRate: '48.0 kHz',
          },
          subtitles: [
            {
              language: 'Chinese',
              label: '中字',
              format: 'Danish',
            },
            {
              language: 'English',
              label: 'English',
              format: 'Finnish',
            },
            {
              language: 'French',
              label: 'French',
              format: 'French',
            },
            {
              language: 'German',
              label: 'German',
              format: 'German',
            },
            {
              layer: 'Norwegian',
              label: 'Norwegian',
              format: 'Norwegian',
            },
            {
              language: 'Portuguese',
              label: 'Portuguese',
              format: 'Portuguese',
            },
            {
              language: 'Spanish',
              label: 'Spanish',
              format: 'Spanish',
            },
            {
              language: 'Swedish',
              label: 'Swedish',
              format: 'Swedish',
            },
            {
              language: 'Thai',
              label: 'Thai',
              format: 'Thai',
            },
          ],
        },

        // 截图
        screenshots: [
          {
            url: 'https://picsum.photos/1920/1080?random=801',
            alt: 'Screenshot from movie Uncut Gems',
            timestamp: '1h 23m 45s',
          },
          {
            url: 'https://picsum.photos/1920/1080?random=802',
            alt: 'Screenshot from movie Uncut Gems',
            timestamp: '1h 24m 12s',
          },
          {
            url: 'https://picsum.photos/1920/1080?random=803',
            alt: 'Screenshot from movie Uncut Gems',
            timestamp: '1h 28m 30s',
          },
          {
            url: 'https://picsum.photos/1920/1080?random=804',
            isPrimary: true,
            alt: 'Primary screenshot from movie Uncut Gems',
            timestamp: '1h 32m 15s',
          },
        ],
      }

      // 缓存并返回
      this.mockDataCache.set(cacheKey, collectionMovieData)
      return collectionMovieData
    } else {
      // 普通影片：使用原有的生成逻辑
      const collectionIndex = Math.floor(movieIndex / 100) || 1
      const regularMovieIndex = movieIndex - (collectionIndex * 100) + 1

      return {
        id: movieId,
        title: `热门影片 ${regularMovieIndex}`,
        type: 'Movie',
        year: 2024 - Math.floor(Math.random() * 5),
        imageUrl: `https://picsum.photos/300/450?random=${movieIndex}`,
        alt: `热门影片 ${regularMovieIndex} 海报`,
        description: `这是第${regularMovieIndex}部热门影片的描述`,
        director: `导演${regularMovieIndex}`,
        cast: ['演员1', '演员2'],
        country: '美国',
        language: 'English',
        duration: 90 + Math.floor(Math.random() * 60),
        genres: ['剧情', '动作', '喜剧', '科幻', '恐怖'][regularMovieIndex % 5],

        // 普通影片的VIP规则：每3个中有1个是VIP
        isVip: (regularMovieIndex - 1) % 3 === 0,

        // 其他字段保持不变
        rating: parseFloat((Math.random() * 4 + 6).toFixed(1)),
        doubanRating: '6.3',
        ratingColor: 'purple',
        votes: 1500000,
        imdbRating: 9.2,
        tmdbRating: 8.5,
        quality: ['4K', 'HD', '1080P', '720P'][regularMovieIndex % 4],
        thankYouCount: Math.floor(Math.random() * 2000) + 100,
        isFavorited: false,
        isThankYouActive: false,

        // 资源信息（普通影片样式）
        resource: {
          title: `热门影片 ${regularMovieIndex} (2019) 1080p BluRay`,
          tags: [
            { label: '高清', color: 'blue' },
            { label: '中字', color: 'yellow' },
            { label: '5.1声道', color: 'green' },
          ],
          stats: {
            viewCount: 8700000,
            downloadCount: 200,
            likeCount: 24,
            dislikeCount: 0,
          },
          uploader: {
            name: 'mosctz',
            uploadTime: '18 hours ago',
          },
        },

        fileInfo: {
          format: 'MP4',
          size: '3.8 GiB',
          duration: '2h 5m',
          video: {
            codec: 'H.264',
            resolution: '1920x804',
            bitrate: '5000 kbps',
            frameRate: '23.976 fps',
          },
          audio: {
            codec: 'AAC',
            channels: '2',
            bitrate: '192 kbps',
            sampleRate: '48.0 kHz',
          },
          subtitles: [
            {
              language: 'Chinese',
              label: '中字',
              format: 'SRT',
            },
          ],
        },

        screenshots: [
          {
            url: 'https://picsum.photos/1920/1080?random=901',
            alt: `Screenshot from movie ${regularMovieIndex}`,
            timestamp: '1h 23m 45s',
          },
          {
            url: 'https://picsum.photos/1920/1080?random=902',
            alt: `Screenshot from movie ${regularMovieIndex}`,
            timestamp: '1h 24m 12s',
          },
        ],
      }
    }
  }

  // 获取合集中的影片列表，支持分页
  // 重要：合集中的所有影片都继承合集的VIP状态，因此isVip固定为true
  public getMockCollectionMovies(options: {
    collectionId: string
    page?: number
    pageSize?: number
  }): { movies: FullMovieItem[]; total: number } {
    const { collectionId, page = 1, pageSize = 20 } = options
    const movieIndex = parseInt(collectionId.replace('collection_', '')) || 1
    const totalMovies = 50 // 模拟每个合集有50部电影

    // 生成合集电影的Mock数据
    const allMovies: FullMovieItem[] = []
    for (let i = 0; i < totalMovies; i++) {
      const movieNum = movieIndex * 1000 + i + 1 // collection_xxxx -> movie_xxxx0001, movie_xxxx0002...
      const movieItem: FullMovieItem = {
        id: `movie_${movieNum}`,
        title: `合集影片 ${movieNum}`,
        type: 'Movie' as const,
        imageUrl: `https://picsum.photos/300/450?random=${movieNum + 100}`,
        alt: `合集影片 ${movieNum} 海报`,
        description: `这是合集影片 ${movieNum} 的描述`,

        // 业务规则：合集电影都是VIP
        isVip: true,

        // 其他业务字段
        genres: ['动作', '喜剧', '剧情', '科幻', '恐怖'][i % 5],
        year: 2024 - Math.floor(Math.random() * 5),
        duration: 120 + Math.floor(Math.random() * 60),
        rating: (6.0 + Math.random() * 4).toFixed(1),
        quality: ['4K', 'HD', '1080P', '720P'][i % 4],
        viewCount: Math.floor(Math.random() * 1000000),
        downloadCount: Math.floor(Math.random() * 50000),
        likeCount: Math.floor(Math.random() * 5000),
        favoriteCount: Math.floor(Math.random() * 1000),
      }
      allMovies.push(movieItem)
    }

    // 分页逻辑
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedMovies = allMovies.slice(startIndex, endIndex)

    return {
      movies: paginatedMovies,
      total: totalMovies
    }
  }

  // 清除缓存，用于开发环境数据刷新或内存管理
  public clearCache(): void {
    this.mockDataCache.clear()
  }

  // 获取缓存统计信息，用于调试和性能监控
  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.mockDataCache.size,
      keys: Array.from(this.mockDataCache.keys())
    }
  }
}

// 导出单例实例，确保全局唯一的Mock数据管理器
export const mockDataService = MockDataService.getInstance()
