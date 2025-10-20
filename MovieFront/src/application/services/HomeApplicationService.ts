/**
 * @fileoverview 首页应用服务
 * @description 首页业务逻辑的协调层，整合数据源与业务规则，为UI层提供统一数据接口
 * @created 2025-10-17 10:08:41
 * @updated 2025-10-19 12:55:27
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  HomeRepository,
  type HomeDataResponse,
  type HomeDataParams,
  type HotItem,
} from '@infrastructure/repositories/HomeRepository'
import type { TopicItem, PhotoItem, LatestItem } from '@types-movie'
import { generateRandomRating } from '@utils/formatters'


// 首页应用服务类，协调首页数据获取与处理，包含缓存策略、图片URL处理、数据转换和降级策略
export class HomeApplicationService {
  private homeRepository: HomeRepository

  constructor() {
    this.homeRepository = new HomeRepository()
  }

  // 获取完整首页数据，包含空数据降级与图片URL处理
  async getHomeData(params?: HomeDataParams): Promise<HomeDataResponse> {
    try {
      // 数据获取 - 从后端API获取首页完整数据
      const apiData = await this.homeRepository.getHomeData(params)

      // 降级策略检查 - 如果后端返回空数据，启用mock数据降级方案
      if (this.hasNoData(apiData)) {
        console.log('API返回空数据，使用mock数据作为降级方案')
        return this.getMockHomeData()
      }

      // 图片URL处理 - 统一处理图片链接确保使用配置化图片服务
      return this.processImageUrls(apiData)
    } catch (error) {
      // 异常处理 - API调用失败时自动降级到mock数据保证用户体验
      console.error('获取首页数据失败，使用mock数据:', error)
      return this.getMockHomeData()
    }
  }

  // 获取影片合集数据，若无数据返回mock专题数据
  async getCollections(limit = 3) { // 返回合集数量限制，默认3个
    try {
      const topics = await this.homeRepository.getTopics(limit)

      // 如果没有数据，返回mock专题数据
      if (topics.length === 0) {
        return this.getMockTopics()
      }

      return this.processTopicsImageUrls(topics)
    } catch (error) {
      console.error('获取影片合集数据失败，使用mock数据:', error)
      return this.getMockTopics()
    }
  }

  // 获取专题数据，若无数据返回mock专题数据
  async getTopics(limit = 3) { // 返回专题数量限制，默认3个
    try {
      const topics = await this.homeRepository.getTopics(limit)

      // 如果没有数据，返回mock专题数据
      if (topics.length === 0) {
        return this.getMockTopics()
      }

      return this.processTopicsImageUrls(topics)
    } catch (error) {
      console.error('获取专题数据失败，使用mock数据:', error)
      return this.getMockTopics()
    }
  }

  // 获取写真数据，若无数据返回mock写真数据
  async getPhotos(limit = 6) { // 返回写真数量限制，默认6张
    try {
      const photos = await this.homeRepository.getPhotos(limit)

      // 如果没有数据，返回mock写真数据
      if (photos.length === 0) {
        return this.getMockPhotos()
      }

      return this.processMoviesImageUrls(photos)
    } catch (error) {
      console.error('获取写真数据失败，使用mock数据:', error)
      return this.getMockPhotos()
    }
  }

  // 获取最新更新数据，若无数据返回mock最新更新
  async getLatestUpdates(limit = 6) { // 返回最新更新数量限制，默认6部
    try {
      const latestUpdates = await this.homeRepository.getLatestUpdates(limit)

      // 如果没有数据，返回mock最新更新数据
      if (latestUpdates.length === 0) {
        return this.getMockLatestUpdates()
      }

      return this.processMoviesImageUrls(latestUpdates)
    } catch (error) {
      console.error('获取最新更新数据失败，使用mock数据:', error)
      return this.getMockLatestUpdates()
    }
  }

  // 获取24小时热门数据，若无数据返回mock热门数据
  async getHotDaily(limit = 6) { // 返回热门内容数量限制，默认6部
    try {
      const hotDaily = await this.homeRepository.getHotDaily(limit)

      // 如果没有数据，返回mock热门数据
      if (hotDaily.length === 0) {
        return this.getMockHotDaily()
      }

      return this.processMoviesImageUrls(hotDaily)
    } catch (error) {
      console.error('获取24小时热门数据失败，使用mock数据:', error)
      return this.getMockHotDaily()
    }
  }

  // 数据完整性检查 - 验证首页各模块数据是否均为空，触发降级策略
  private hasNoData(data: HomeDataResponse): boolean {
    return (
      data.topics.length === 0 && // 专题合集为空
      data.photos.length === 0 && // 写真图片为空
      data.latestUpdates.length === 0 && // 最新更新为空
      data.hotDaily.length === 0 // 24小时热门为空
    )
  }

  // 图片URL处理占位，当前直接返回数据，实际在Hook中处理
  private processImageUrls(data: HomeDataResponse): HomeDataResponse {
    // 直接返回数据，图片URL处理在Hook中进行
    return data
  }

  // 处理专题图片URL占位，当前直接返回数据，实际在Hook中处理
  private processTopicsImageUrls(topics: any[]) {
    // 直接返回数据，图片URL处理在Hook中进行
    return topics
  }

  // 处理电影图片URL占位，当前直接返回数据，实际在Hook中处理
  private processMoviesImageUrls(movies: any[]) {
    // 直接返回数据，图片URL处理在Hook中进行
    return movies
  }

  // 首页数据Mock：topics/photos/latest/hot均提供示例数据
  private getMockHomeData(): HomeDataResponse {
    return {
      topics: this.getMockTopics(),
      photos: this.getMockPhotos(),
      latestUpdates: this.getMockLatestUpdates(),
      hotDaily: this.getMockHotDaily(),
    }
  }

  // Mock专题数据：包含图片、描述、创建者、点赞数等字段，模拟真实后端返回的VIP状态
  private getMockTopics(): TopicItem[] {
    return [
      {
        id: 'topic-1',
        title:
          '超长的科幻宇宙世界探索之旅无尽的星际冒险与未知的文明奥秘等待你的发现',
        type: 'Collection' as const,
        imageUrl: 'topic-1',
        description:
          '这是一个超级超级超级超级超级超级超级超级超级超级超级超级超级超级超级超级超级长的描述文本，用来测试省略效果的边界情况到底在哪里发生',
        alt: 'A robot looking out over a mountainous landscape on an alien planet',
        isNew: true,
        newType: 'new' as const,
        isVip: true, // VIP专题
      },
      {
        id: 'topic-2',
        title: 'Mind-Bending Thrillers',
        type: 'Collection' as const,
        imageUrl: 'topic-2',
        description: "Twists you won't see coming.",
        alt: 'Two silhouetted figures stand on a hill against a dramatic sky',
        isNew: true,
        newType: 'update' as const,
        isVip: false, // 普通专题
      },
      {
        id: 'topic-3',
        title: 'Award Winners',
        type: 'Collection' as const,
        imageUrl: 'topic-3',
        description: 'Critically acclaimed masterpieces.',
        alt: 'An abstract image of a mountainous landscape with a faint circle in the sky',
        isNew: true,
        newType: 'latest' as const,
        isVip: true, // VIP专题
      },
    ]
  }

  // 获取扩展的专题列表数据，用于专题列表页面
  getMockTopicsExtended(count = 120): TopicItem[] {
    const categories = [
      'Modern Architecture',
      'Abstract Art', 
      'Nature Photography',
      'Urban Landscapes',
      'Portrait Photography',
      'Still Life',
      'Wildlife Safari',
      'Street Photography',
      'Fine Art Nudes',
      'Landscape Masters',
      'Black & White',
      'Digital Art',
      'Cinematic Masterpieces',
      'Nature Documentary',
      'Travel Photography',
      'Food Photography',
      'Fashion Photography',
      'Sports Photography',
      'Architecture Photography',
      'Night Photography',
      'Macro Photography',
      'Aerial Photography',
    ]

    const descriptions = [
      '探索当代建筑的简约美学',
      '色彩与形状的视觉交响曲',
      '大自然的壮美瞬间定格',
      '城市风光的现代诠释',
      '人物情感的艺术捕捉',
      '静物的诗意美学',
      '野生动物的自然栖息地',
      '城市街头的人文故事',
      '人体艺术的美学探索',
      '风景摄影的经典之作',
      '黑白摄影的艺术魅力',
      '数字艺术的无限可能',
      '电影史上的经典之作',
      '自然世界的精彩记录',
      '旅行摄影的精彩世界',
      '美食摄影的诱人魅力',
      '时尚摄影的潮流趋势',
      '体育摄影的动感瞬间',
      '建筑摄影的空间美学',
      '夜景摄影的神秘魅力',
      '微距摄影的细节世界',
      '航拍摄影的壮丽视角',
    ]

    const topicsArray: TopicItem[] = []

    // 生成指定数量的专题数据，模拟真实后端返回的VIP状态分布
    for (let i = 0; i < count; i++) {
      const categoryIndex = i % categories.length
      const pageNum = Math.floor(i / 12) + 1

      topicsArray.push({
        id: `topic-${i + 1}`,
        title: `${categories[categoryIndex]} - 第${pageNum}页-${(i % 12) + 1}`,
        type: 'Collection' as const,
        imageUrl: `collection${i}`,
        description: descriptions[categoryIndex],
        alt: `${categories[categoryIndex]} collection poster`,
        isNew: true,
        newType: 'new' as const,
        // 模拟真实的VIP分布：约30%的专题为VIP，基于业务规则
        isVip: this.shouldBeVipTopic(i, categories[categoryIndex]),
      })
    }

    return topicsArray
  }

  // 模拟真实的VIP专题判断逻辑，基于业务规则
  private shouldBeVipTopic(index: number, category: string): boolean {
    // 模拟后端的VIP判断逻辑：
    // 1. 某些特定分类更容易是VIP（如电影、艺术类）
    const vipCategories = [
      'Cinematic Masterpieces',
      'Fine Art Nudes', 
      'Digital Art',
      'Portrait Photography',
      'Architecture Photography'
    ]
    
    // 2. 特定分类的专题有更高VIP概率
    if (vipCategories.includes(category)) {
      return index % 2 === 0 // 50%概率
    }
    
    // 3. 其他分类较低VIP概率
    return index % 5 === 0 // 20%概率
  }

  // Mock照片数据：包含图片URL、描述、上传者和评分颜色
  private getMockPhotos(): PhotoItem[] {
    return [
      {
        id: 'photo-1',
        title: 'The Midnight Bloom',
        type: 'Movie' as const,
        rating: generateRandomRating(),
        imageUrl: 'photo-1',
        ratingColor: this.generateRandomRatingColor(),
        quality: '4K HDR',
        formatType: 'JPEG高' as const,
        alt: 'The Midnight Bloom poster',
        isNew: true,
        newType: 'new' as const,
      },
      {
        id: 'photo-2',
        title: 'Echoes of the Past',
        type: 'Movie' as const,
        rating: generateRandomRating(),
        imageUrl: '/src/assets/images/heroes/0034.jpg',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'HD',
        formatType: 'PNG' as const,
        alt: 'Echoes of the Past poster',
        isNew: true,
        newType: 'today' as const,
      },
      {
        id: 'photo-3',
        title: 'Starlight Symphony',
        type: 'TV Show' as const,
        rating: generateRandomRating(),
        imageUrl: 'photo-3',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'Dolby Vision',
        formatType: 'WebP' as const,
        alt: 'Starlight Symphony poster',
        isNew: true,
        newType: 'latest' as const,
      },
      {
        id: 'photo-4',
        title: 'Crimson Tide',
        type: 'Movie' as const,
        rating: generateRandomRating(),
        imageUrl: 'photo-4',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'SD',
        formatType: 'GIF' as const,
        alt: 'Crimson Tide poster',
        isNew: true,
        newType: 'new' as const,
      },
      {
        id: 'photo-5',
        title: 'Whispers of the Wind',
        type: 'Movie' as const,
        rating: generateRandomRating(),
        imageUrl: '/src/assets/images/heroes/0056.png',
        ratingColor: this.generateRandomRatingColor(),
        quality: '4K',
        formatType: 'JPEG高' as const,
        alt: 'Whispers of the Wind poster',
        isNew: true,
        newType: 'update' as const,
      },
      {
        id: 'photo-6',
        title: 'Eternal Horizon',
        type: 'TV Show' as const,
        rating: generateRandomRating(),
        imageUrl: 'photo-6',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'IMAX',
        formatType: 'PNG' as const,
        alt: 'Eternal Horizon poster',
        isNew: true,
        newType: 'new' as const,
      },
    ]
  }

  // 获取Mock最新更新数据，包含6部最新电影的示例数据
  private getMockLatestUpdates(): LatestItem[] {
    return [
      {
        id: 'latest-1',
        title: 'Shadows of Destiny',
        type: 'Movie' as const,
        rating: generateRandomRating(),
        imageUrl: 'latest-1',
        ratingColor: this.generateRandomRatingColor(),
        quality: '4K HDR',
        alt: 'Shadows of Destiny poster',
        isNew: true,
      },
      {
        id: 'latest-2',
        title: 'Celestial Dance',
        type: 'Movie' as const,
        rating: generateRandomRating(),
        imageUrl: 'latest-2',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'HD',
        alt: 'Celestial Dance poster',
        isNew: true,
      },
      {
        id: 'latest-3',
        title: 'Lost in Translation',
        type: 'TV Show' as const,
        rating: generateRandomRating(),
        imageUrl: 'latest-3',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'Dolby Vision',
        alt: 'Lost in Translation poster',
        isNew: true,
      },
      {
        id: 'latest-4',
        title: 'The Silent Witness',
        type: 'Movie' as const,
        rating: generateRandomRating(),
        imageUrl: 'latest-4',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'HD',
        alt: 'The Silent Witness poster',
        isNew: true,
      },
      {
        id: 'latest-5',
        title: 'Beneath the Surface',
        type: 'Movie' as const,
        rating: generateRandomRating(),
        imageUrl: 'latest-5',
        ratingColor: this.generateRandomRatingColor(),
        quality: '4K',
        alt: 'Beneath the Surface poster',
        isNew: true,
      },
      {
        id: 'latest-6',
        title: 'Echo Chamber',
        type: 'TV Show' as const,
        rating: generateRandomRating(),
        imageUrl: 'latest-6',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'IMAX',
        alt: 'Echo Chamber poster',
        isNew: true,
      },
    ]
  }

  // 获取Mock 24小时热门数据，包含6部热门电影的排名示例数据
  private getMockHotDaily(): HotItem[] {
    return [
      {
        id: 'hot-1',
        title: 'Crimson Tide',
        type: 'Movie' as const,
        rating: generateRandomRating(),
        imageUrl: 'hot-1',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'SD',
        alt: 'Crimson Tide poster',
        rank: 1,
      },
      {
        id: 'hot-2',
        title: 'Celestial Dance',
        type: 'Movie' as const,
        rating: generateRandomRating(),
        imageUrl: 'hot-2',
        ratingColor: this.generateRandomRatingColor(),
        quality: '4K HDR',
        alt: 'Celestial Dance poster',
        rank: 2,
      },
      {
        id: 'hot-3',
        title: 'Eternal Horizon',
        type: 'TV Show' as const,
        rating: generateRandomRating(),
        imageUrl: 'hot-3',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'Dolby Vision',
        alt: 'Eternal Horizon poster',
        rank: 3,
      },
      {
        id: 'hot-4',
        title: 'Echoes of the Past',
        type: 'Movie' as const,
        rating: generateRandomRating(),
        imageUrl: 'hot-4',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'HD',
        alt: 'Echoes of the Past poster',
        rank: 4,
      },
      {
        id: 'hot-5',
        title: 'Starlight Symphony',
        type: 'TV Show' as const,
        rating: generateRandomRating(),
        imageUrl: 'hot-5',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'Dolby Vision',
        alt: 'Starlight Symphony poster',
        rank: 5,
      },
      {
        id: 'hot-6',
        title: 'The Midnight Bloom',
        type: 'Movie' as const,
        rating: generateRandomRating(),
        imageUrl: 'hot-6',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'HD',
        alt: 'The Midnight Bloom poster',
        rank: 6,
      },
    ]
  }

  // 生成随机评分颜色，用于UI展示的视觉效果多样化
  private generateRandomRatingColor(): 'purple' | 'red' | 'white' | 'default' {
    const colors: ('purple' | 'red' | 'white' | 'default')[] = [
      'purple',
      'red',
      'white',
      'default',
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
}

// 创建单例实例
export const homeApplicationService = new HomeApplicationService()
