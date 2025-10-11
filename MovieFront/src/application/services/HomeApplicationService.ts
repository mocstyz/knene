/**
 * @fileoverview 首页应用服务
 * @description 首页业务逻辑的协调层，负责整合多个数据源，处理业务规则，
 * 并为UI层提供统一的数据接口。遵循DDD应用层架构规范。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  HomeRepository,
  type HomeDataResponse,
  type HomeDataParams,
} from '@infrastructure/repositories/HomeRepository'

/**
 * 首页应用服务类
 *
 * 负责协调首页数据的获取和处理，包含以下业务逻辑：
 * 1. 数据获取和缓存策略
 * 2. 图片URL的统一处理
 * 3. 数据格式转换和业务规则应用
 * 4. 错误处理和降级策略
 */
export class HomeApplicationService {
  private homeRepository: HomeRepository

  constructor() {
    this.homeRepository = new HomeRepository()
  }

  /**
   * 获取完整的首页数据
   * @param params 获取参数
   * @returns 首页数据响应
   */
  async getHomeData(params?: HomeDataParams): Promise<HomeDataResponse> {
    try {
      // 从后端API获取数据
      const apiData = await this.homeRepository.getHomeData(params)

      // 如果后端没有数据，使用mock数据作为降级方案
      if (this.hasNoData(apiData)) {
        console.log('API返回空数据，使用mock数据作为降级方案')
        return this.getMockHomeData()
      }

      // 处理图片URL，确保使用配置化图片服务
      return this.processImageUrls(apiData)
    } catch (error) {
      console.error('获取首页数据失败，使用mock数据:', error)
      return this.getMockHomeData()
    }
  }

  /**
   * 获取专题数据
   */
  async getTopics(limit = 3) {
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

  /**
   * 获取写真数据
   */
  async getPhotos(limit = 6) {
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

  /**
   * 获取最新更新数据
   */
  async getLatestUpdates(limit = 6) {
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

  /**
   * 获取24小时TOP数据
   */
  async getTopDaily(limit = 6) {
    try {
      const topDaily = await this.homeRepository.getTopDaily(limit)

      // 如果没有数据，返回mock TOP数据
      if (topDaily.length === 0) {
        return this.getMockTopDaily()
      }

      return this.processMoviesImageUrls(topDaily)
    } catch (error) {
      console.error('获取24小时TOP数据失败，使用mock数据:', error)
      return this.getMockTopDaily()
    }
  }

  /**
   * 检查数据是否为空
   */
  private hasNoData(data: HomeDataResponse): boolean {
    return (
      data.topics.length === 0 &&
      data.photos.length === 0 &&
      data.latestUpdates.length === 0 &&
      data.topDaily.length === 0
    )
  }

  /**
   * 处理图片URL
   */
  private processImageUrls(data: HomeDataResponse): HomeDataResponse {
    // 直接返回数据，图片URL处理在Hook中进行
    return data
  }

  /**
   * 处理专题图片URL
   */
  private processTopicsImageUrls(topics: any[]) {
    // 直接返回数据，图片URL处理在Hook中进行
    return topics
  }

  /**
   * 处理电影图片URL
   */
  private processMoviesImageUrls(movies: any[]) {
    // 直接返回数据，图片URL处理在Hook中进行
    return movies
  }

  /**
   * 获取Mock首页数据
   */
  private getMockHomeData(): HomeDataResponse {
    return {
      topics: this.getMockTopics(),
      photos: this.getMockPhotos(),
      latestUpdates: this.getMockLatestUpdates(),
      topDaily: this.getMockTopDaily(),
    }
  }

  /**
   * 获取Mock专题数据
   */
  private getMockTopics() {
    return [
      {
        id: 'topic-1',
        title:
          '超长的科幻宇宙世界探索之旅无尽的星际冒险与未知的文明奥秘等待你的发现',
        type: 'Collection' as const,
        rating: '',
        imageUrl: 'topic-1',
        description:
          '这是一个超级超级超级超级超级超级超级超级超级超级超级超级超级超级超级超级超级长的描述文本，用来测试省略效果的边界情况到底在哪里发生',
        alt: 'A robot looking out over a mountainous landscape on an alien planet',
      },
      {
        id: 'topic-2',
        title: 'Mind-Bending Thrillers',
        type: 'Collection' as const,
        rating: '',
        imageUrl: 'topic-2',
        description: "Twists you won't see coming.",
        alt: 'Two silhouetted figures stand on a hill against a dramatic sky',
      },
      {
        id: 'topic-3',
        title: 'Award Winners',
        type: 'Collection' as const,
        rating: '',
        imageUrl: 'topic-3',
        description: 'Critically acclaimed masterpieces.',
        alt: 'An abstract image of a mountainous landscape with a faint circle in the sky',
      },
    ]
  }

  /**
   * 获取Mock写真数据
   */
  private getMockPhotos() {
    return [
      {
        id: 'photo-1',
        title: 'The Midnight Bloom',
        type: 'Movie' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'photo-1',
        ratingColor: this.generateRandomRatingColor(),
        quality: '4K HDR',
        formatType: 'JPEG高',
        alt: 'The Midnight Bloom poster',
      },
      {
        id: 'photo-2',
        title: 'Echoes of the Past',
        type: 'Movie' as const,
        rating: this.generateRandomRating(),
        imageUrl: '/src/assets/images/heroes/0034.jpg',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'HD',
        formatType: 'PNG',
        alt: 'Echoes of the Past poster',
      },
      {
        id: 'photo-3',
        title: 'Starlight Symphony',
        type: 'TV Show' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'photo-3',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'Dolby Vision',
        formatType: 'WebP',
        alt: 'Starlight Symphony poster',
      },
      {
        id: 'photo-4',
        title: 'Crimson Tide',
        type: 'Movie' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'photo-4',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'SD',
        formatType: 'GIF',
        alt: 'Crimson Tide poster',
      },
      {
        id: 'photo-5',
        title: 'Whispers of the Wind',
        type: 'Movie' as const,
        rating: this.generateRandomRating(),
        imageUrl: '/src/assets/images/heroes/0056.png',
        ratingColor: this.generateRandomRatingColor(),
        quality: '4K',
        formatType: 'JPEG高',
        alt: 'Whispers of the Wind poster',
      },
      {
        id: 'photo-6',
        title: 'Eternal Horizon',
        type: 'TV Show' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'photo-6',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'IMAX',
        formatType: 'PNG',
        alt: 'Eternal Horizon poster',
      },
    ]
  }

  /**
   * 获取Mock最新更新数据
   */
  private getMockLatestUpdates() {
    return [
      {
        id: 'latest-1',
        title: 'Shadows of Destiny',
        type: 'Movie' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'latest-1',
        ratingColor: this.generateRandomRatingColor(),
        quality: '4K HDR',
        alt: 'Shadows of Destiny poster',
        isNew: true,
        newType: 'update',
      },
      {
        id: 'latest-2',
        title: 'Celestial Dance',
        type: 'Movie' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'latest-2',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'HD',
        alt: 'Celestial Dance poster',
        isNew: true,
        newType: 'new',
      },
      {
        id: 'latest-3',
        title: 'Lost in Translation',
        type: 'TV Show' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'latest-3',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'Dolby Vision',
        alt: 'Lost in Translation poster',
        isNew: true,
        newType: 'today',
      },
      {
        id: 'latest-4',
        title: 'The Silent Witness',
        type: 'Movie' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'latest-4',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'HD',
        alt: 'The Silent Witness poster',
        isNew: true,
        newType: 'latest',
      },
      {
        id: 'latest-5',
        title: 'Beneath the Surface',
        type: 'Movie' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'latest-5',
        ratingColor: this.generateRandomRatingColor(),
        quality: '4K',
        alt: 'Beneath the Surface poster',
        isNew: true,
        newType: 'update',
      },
      {
        id: 'latest-6',
        title: 'Echo Chamber',
        type: 'TV Show' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'latest-6',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'IMAX',
        alt: 'Echo Chamber poster',
        isNew: true,
        newType: 'new',
      },
    ]
  }

  /**
   * 获取Mock 24小时TOP数据
   */
  private getMockTopDaily() {
    return [
      {
        id: 'top-1',
        title: 'Crimson Tide',
        type: 'Movie' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'top-1',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'SD',
        alt: 'Crimson Tide poster',
        rank: 1,
        newType: 'new',
      },
      {
        id: 'top-2',
        title: 'Celestial Dance',
        type: 'Movie' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'top-2',
        ratingColor: this.generateRandomRatingColor(),
        quality: '4K HDR',
        alt: 'Celestial Dance poster',
        rank: 2,
        newType: 'latest',
      },
      {
        id: 'top-3',
        title: 'Eternal Horizon',
        type: 'TV Show' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'top-3',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'Dolby Vision',
        alt: 'Eternal Horizon poster',
        rank: 3,
        newType: 'today',
      },
      {
        id: 'top-4',
        title: 'Echoes of the Past',
        type: 'Movie' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'top-4',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'HD',
        alt: 'Echoes of the Past poster',
        rank: 4,
        newType: 'update',
      },
      {
        id: 'top-5',
        title: 'Starlight Symphony',
        type: 'TV Show' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'top-5',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'Dolby Vision',
        alt: 'Starlight Symphony poster',
        rank: 5,
        newType: 'new',
      },
      {
        id: 'top-6',
        title: 'The Midnight Bloom',
        type: 'Movie' as const,
        rating: this.generateRandomRating(),
        imageUrl: 'top-6',
        ratingColor: this.generateRandomRatingColor(),
        quality: 'HD',
        alt: 'The Midnight Bloom poster',
        rank: 6,
        newType: 'latest',
      },
    ]
  }

  /**
   * 生成随机评分
   */
  private generateRandomRating(): string {
    return (Math.random() * 5 + 5).toFixed(1)
  }

  /**
   * 生成随机评分颜色
   */
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
