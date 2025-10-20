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
import { Movie } from '@domain/entities/Movie'
import { Title } from '@domain/value-objects/Title'
import { Genre } from '@domain/value-objects/Genre'
import { Duration } from '@domain/value-objects/Duration'
import { ReleaseDate } from '@domain/value-objects/ReleaseDate'
import { MovieQuality } from '@domain/value-objects/MovieQuality'


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
        return await this.getMockHomeData()
      }

      // 图片URL处理 - 统一处理图片链接确保使用配置化图片服务
      return this.processImageUrls(apiData)
    } catch (error) {
      // 异常处理 - API调用失败时自动降级到mock数据保证用户体验
      console.error('获取首页数据失败，使用mock数据:', error)
      return await this.getMockHomeData()
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
        return await this.getMockHotDaily()
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
  private async getMockHomeData(): Promise<HomeDataResponse> {
    return {
      topics: await this.getMockTopics(),
      photos: await this.getMockPhotos(),
      latestUpdates: await this.getMockLatestUpdates(),
      hotDaily: await this.getMockHotDaily(),
    }
  }

  /**
   * 获取Mock专题数据 - 使用新的领域模型和转换服务
   */
  private async getMockTopics(): Promise<TopicItem[]> {
    // 导入领域实体和转换服务
    const { Collection } = await import('@domain/entities/Collection')
    const { Title } = await import('@domain/value-objects/Title')
    const { ReleaseDate } = await import('@domain/value-objects/ReleaseDate')
    const { ContentTransformationService } = await import('@application/services/ContentTransformationService')

    // 创建Mock合集实体
    const mockCollections = [
      Collection.create(
        '1',
        new Title('经典动作电影合集'),
        '汇集了最经典的动作电影，包括成龙、李连杰等功夫巨星的代表作品',
        'https://picsum.photos/400/600?random=1',
        '动作',
        new ReleaseDate(new Date(Date.now() - 12 * 60 * 60 * 1000)), // 12小时前
        false,
        true
      ),
      Collection.create(
        '2',
        new Title('科幻电影精选'),
        '精选科幻电影合集，探索未来世界的无限可能',
        'https://picsum.photos/400/600?random=2',
        '科幻',
        new ReleaseDate(new Date(Date.now() - 6 * 60 * 60 * 1000)), // 6小时前
        true,
        false
      ),
      Collection.create(
        '3',
        new Title('浪漫爱情电影'),
        '温馨浪漫的爱情电影合集，感受爱情的美好',
        'https://picsum.photos/400/600?random=3',
        '爱情',
        new ReleaseDate(new Date(Date.now() - 18 * 60 * 60 * 1000)), // 18小时前
        false,
        false
      )
    ]

    // 转换为统一内容项，然后转换为TopicItem
    const unifiedItems = ContentTransformationService.transformCollectionListToUnified(mockCollections)
    return ContentTransformationService.transformUnifiedListToTopics(unifiedItems)
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
        newType: 'latest' as const,
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

  /**
   * 获取Mock图片数据 - 使用新的领域模型和转换服务
   */
  private async getMockPhotos(): Promise<PhotoItem[]> {
    // 导入领域实体和转换服务
    const { Photo } = await import('@domain/entities/Photo')
    const { Title } = await import('@domain/value-objects/Title')
    const { ReleaseDate } = await import('@domain/value-objects/ReleaseDate')
    const { ContentTransformationService } = await import('@application/services/ContentTransformationService')

    // 创建Mock图片实体 - 扩展到6个项目
    const mockPhotos = [
      Photo.create(
        '1',
        new Title('阿凡达2：水之道'),
        '詹姆斯·卡梅隆执导的科幻史诗续作',
        'https://picsum.photos/400/600?random=11',
        ['https://picsum.photos/800/1200?random=11-1', 'https://picsum.photos/800/1200?random=11-2'],
        '萨姆·沃辛顿',
        new ReleaseDate(new Date(Date.now() - 8 * 60 * 60 * 1000)), // 8小时前
        true
      ),
      Photo.create(
        '2',
        new Title('黑豹2：瓦坎达万岁'),
        '漫威超级英雄电影续作',
        'https://picsum.photos/400/600?random=12',
        ['https://picsum.photos/800/1200?random=12-1', 'https://picsum.photos/800/1200?random=12-2'],
        '查德维克·博斯曼',
        new ReleaseDate(new Date(Date.now() - 15 * 60 * 60 * 1000)), // 15小时前
        false
      ),
      Photo.create(
        '3',
        new Title('壮志凌云2：独行侠'),
        '汤姆·克鲁斯主演的动作大片',
        'https://picsum.photos/400/600?random=13',
        ['https://picsum.photos/800/1200?random=13-1', 'https://picsum.photos/800/1200?random=13-2'],
        '汤姆·克鲁斯',
        new ReleaseDate(new Date(Date.now() - 20 * 60 * 60 * 1000)), // 20小时前
        false
      ),
      Photo.create(
        '4',
        new Title('奇异博士2：疯狂多元宇宙'),
        '漫威多元宇宙的奇幻冒险',
        'https://picsum.photos/400/600?random=14',
        ['https://picsum.photos/800/1200?random=14-1', 'https://picsum.photos/800/1200?random=14-2'],
        '本尼迪克特·康伯巴奇',
        new ReleaseDate(new Date(Date.now() - 12 * 60 * 60 * 1000)), // 12小时前
        true
      ),
      Photo.create(
        '5',
        new Title('雷神4：爱与雷电'),
        '雷神的浪漫冒险之旅',
        'https://picsum.photos/400/600?random=15',
        ['https://picsum.photos/800/1200?random=15-1', 'https://picsum.photos/800/1200?random=15-2'],
        '克里斯·海姆斯沃斯',
        new ReleaseDate(new Date(Date.now() - 18 * 60 * 60 * 1000)), // 18小时前
        false
      ),
      Photo.create(
        '6',
        new Title('侏罗纪世界3：统治'),
        '恐龙与人类的终极对决',
        'https://picsum.photos/400/600?random=16',
        ['https://picsum.photos/800/1200?random=16-1', 'https://picsum.photos/800/1200?random=16-2'],
        '克里斯·帕拉特',
        new ReleaseDate(new Date(Date.now() - 22 * 60 * 60 * 1000)), // 22小时前
        false
      )
    ]

    // 转换为统一内容项，然后转换为PhotoItem
    const unifiedItems = ContentTransformationService.transformPhotoListToUnified(mockPhotos)
    return ContentTransformationService.transformUnifiedListToPhotos(unifiedItems)
  }

  /**
   * 获取Mock最新更新数据 - 使用新的领域模型和转换服务
   */
  private async getMockLatestUpdates(): Promise<LatestItem[]> {
    // 导入领域实体和转换服务
    const { Movie } = await import('@domain/entities/Movie')
    const { Title } = await import('@domain/value-objects/Title')
    const { ReleaseDate } = await import('@domain/value-objects/ReleaseDate')
    const { ContentTransformationService } = await import('@application/services/ContentTransformationService')

    // 创建Mock电影实体
    const mockMovies = [
      Movie.create(
        '1',
        new Title('复仇者联盟：终局之战'),
        '漫威电影宇宙的史诗终章',
        'https://picsum.photos/400/600?random=21',
        [new Genre('动作'), new Genre('科幻'), new Genre('冒险')],
        new Duration(181),
        new ReleaseDate(new Date(Date.now() - 5 * 60 * 60 * 1000)), // 5小时前
        '安东尼·罗素',
        ['小罗伯特·唐尼', '克里斯·埃文斯', '马克·鲁法洛'],
        [MovieQuality.create4K('MP4', 15.2 * 1024 * 1024 * 1024, 'https://example.com/download/1')]
      ),
      Movie.create(
        '2',
        new Title('蜘蛛侠：英雄无归'),
        '三代蜘蛛侠同框的史诗之作',
        'https://picsum.photos/400/600?random=22',
        [new Genre('动作'), new Genre('科幻'), new Genre('冒险')],
        new Duration(148),
        new ReleaseDate(new Date(Date.now() - 10 * 60 * 60 * 1000)), // 10小时前
        '乔·沃茨',
        ['汤姆·赫兰德', '托比·马奎尔', '安德鲁·加菲尔德'],
        [MovieQuality.create1080p('MP4', 8.5 * 1024 * 1024 * 1024, 'https://example.com/download/2')]
      ),
      Movie.create(
        '3',
        new Title('奇异博士2：疯狂多元宇宙'),
        '探索多元宇宙的奇幻冒险',
        'https://picsum.photos/400/600?random=23',
        [new Genre('动作'), new Genre('科幻'), new Genre('奇幻')],
        new Duration(126),
        new ReleaseDate(new Date(Date.now() - 16 * 60 * 60 * 1000)), // 16小时前
        '山姆·雷米',
        ['本尼迪克特·康伯巴奇', '伊丽莎白·奥尔森'],
        [MovieQuality.create4K('MP4', 12.8 * 1024 * 1024 * 1024, 'https://example.com/download/3')]
      ),
      Movie.create(
        '4',
        new Title('雷神4：爱与雷电'),
        '雷神的浪漫冒险之旅',
        'https://picsum.photos/400/600?random=24',
        [new Genre('动作'), new Genre('科幻'), new Genre('喜剧')],
        new Duration(119),
        new ReleaseDate(new Date(Date.now() - 20 * 60 * 60 * 1000)), // 20小时前
        '塔伊加·维迪提',
        ['克里斯·海姆斯沃斯', '娜塔莉·波特曼'],
        [MovieQuality.create1080p('MP4', 9.8 * 1024 * 1024 * 1024, 'https://example.com/download/4')]
      ),
      Movie.create(
        '5',
        new Title('黑豹2：瓦坎达万岁'),
        '瓦坎达的新篇章',
        'https://picsum.photos/400/600?random=25',
        [new Genre('动作'), new Genre('科幻'), new Genre('剧情')],
        new Duration(161),
        new ReleaseDate(new Date(Date.now() - 24 * 60 * 60 * 1000)), // 24小时前
        '瑞恩·库格勒',
        ['安吉拉·贝塞特', '莱蒂蒂娅·赖特'],
        [MovieQuality.create4K('MP4', 18.5 * 1024 * 1024 * 1024, 'https://example.com/download/5')]
      ),
      Movie.create(
        '6',
        new Title('银河护卫队3'),
        '银河护卫队的最终章',
        'https://picsum.photos/400/600?random=26',
        [new Genre('动作'), new Genre('科幻'), new Genre('冒险')],
        new Duration(150),
        new ReleaseDate(new Date(Date.now() - 28 * 60 * 60 * 1000)), // 28小时前
        '詹姆斯·古恩',
        ['克里斯·帕拉特', '佐伊·索尔达娜'],
        [MovieQuality.create1080p('MP4', 11.2 * 1024 * 1024 * 1024, 'https://example.com/download/6')]
      )
    ]

    // 转换为统一内容项，然后转换为LatestItem
    const unifiedItems = ContentTransformationService.transformMovieListToUnified(mockMovies)
    return ContentTransformationService.transformUnifiedListToLatest(unifiedItems)
  }

  /**
   * 获取Mock 24小时热门数据 - 使用新的领域模型和转换服务
   */
  private async getMockHotDaily(): Promise<HotItem[]> {
    // 导入领域实体和转换服务
    const { Movie } = await import('@domain/entities/Movie')
    const { Title } = await import('@domain/value-objects/Title')
    const { ReleaseDate } = await import('@domain/value-objects/ReleaseDate')
    const { Duration } = await import('@domain/value-objects/Duration')
    const { Genre } = await import('@domain/value-objects/Genre')
    const { MovieQuality } = await import('@domain/value-objects/MovieQuality')
    const { ContentTransformationService } = await import('@application/services/ContentTransformationService')

    // 创建基础电影数据
    const baseMovies = [
      Movie.create(
        'hot-1',
        new Title('Crimson Tide'),
        '紧张刺激的潜艇惊悚片',
        'https://picsum.photos/400/600?random=41',
        [new Genre('动作'), new Genre('惊悚'), new Genre('战争')],
        new Duration(116),
        new ReleaseDate(new Date(Date.now() - 2 * 60 * 60 * 1000)), // 2小时前
        '托尼·斯科特',
        ['丹泽尔·华盛顿', '吉恩·哈克曼'],
        [MovieQuality.create720p('MP4', 4.2 * 1024 * 1024 * 1024, 'https://example.com/download/hot-1')]
      ),
      Movie.create(
        'hot-2',
        new Title('Celestial Dance'),
        '宇宙中的神秘舞蹈',
        'https://picsum.photos/400/600?random=42',
        [new Genre('科幻'), new Genre('剧情'), new Genre('奇幻')],
        new Duration(128),
        new ReleaseDate(new Date(Date.now() - 4 * 60 * 60 * 1000)), // 4小时前
        '克里斯托弗·诺兰',
        ['马修·麦康纳', '安妮·海瑟薇'],
        [MovieQuality.create4K('MKV', 22.5 * 1024 * 1024 * 1024, 'https://example.com/download/hot-2')]
      ),
      Movie.create(
        'hot-3',
        new Title('Eternal Horizon'),
        '永恒地平线的史诗故事',
        'https://picsum.photos/400/600?random=43',
        [new Genre('科幻'), new Genre('冒险'), new Genre('剧情')],
        new Duration(145),
        new ReleaseDate(new Date(Date.now() - 6 * 60 * 60 * 1000)), // 6小时前
        '丹尼斯·维伦纽瓦',
        ['瑞恩·高斯林', '哈里森·福特'],
        [MovieQuality.create1080p('MP4', 19.8 * 1024 * 1024 * 1024, 'https://example.com/download/hot-3')]
      ),
      Movie.create(
        'hot-4',
        new Title('Echoes of the Past'),
        '过往回声的神秘故事',
        'https://picsum.photos/400/600?random=44',
        [new Genre('悬疑'), new Genre('剧情'), new Genre('惊悚')],
        new Duration(112),
        new ReleaseDate(new Date(Date.now() - 9 * 60 * 60 * 1000)), // 9小时前
        '大卫·芬奇',
        ['杰克·吉伦哈尔', '杰克·吉伦哈尔'],
        [MovieQuality.create1080p('MP4', 8.9 * 1024 * 1024 * 1024, 'https://example.com/download/hot-4')]
      ),
      Movie.create(
        'hot-5',
        new Title('Starlight Symphony'),
        '星光交响曲的浪漫故事',
        'https://picsum.photos/400/600?random=45',
        [new Genre('爱情'), new Genre('剧情'), new Genre('音乐')],
        new Duration(134),
        new ReleaseDate(new Date(Date.now() - 11 * 60 * 60 * 1000)), // 11小时前
        '达米安·查泽雷',
        ['瑞恩·高斯林', '艾玛·斯通'],
        [MovieQuality.create1080p('MP4', 16.2 * 1024 * 1024 * 1024, 'https://example.com/download/hot-5')]
      ),
      Movie.create(
        'hot-6',
        new Title('The Midnight Bloom'),
        '午夜绽放的神秘花朵',
        'https://picsum.photos/400/600?random=46',
        [new Genre('奇幻'), new Genre('剧情'), new Genre('悬疑')],
        new Duration(118),
        new ReleaseDate(new Date(Date.now() - 13 * 60 * 60 * 1000)), // 13小时前
        '吉尔莫·德尔·托罗',
        ['莎莉·霍金斯', '道格·琼斯'],
        [MovieQuality.create1080p('MP4', 9.7 * 1024 * 1024 * 1024, 'https://example.com/download/hot-6')]
      )
    ]

    // 为每部电影设置热门数据（高下载量和评分），使其满足isHot()条件
    const mockMovies = baseMovies.map((movie, index) => {
      // 创建一个新的MovieDetail，设置高下载量和评分
      const hotDetail = {
        ...movie.detail,
        downloadCount: 1500 + index * 200, // 设置高下载量 (1500-2500)
        rating: 8.2 + index * 0.1, // 设置高评分 (8.2-8.7)
        ratingCount: 150 + index * 50, // 设置评分人数
        updatedAt: new Date()
      }

      // 返回新的Movie实例
      return new Movie(hotDetail, movie.categories, movie.ratings, movie.isActive, movie.isFeatured)
    })

    // 转换为统一内容项，然后转换为HotItem，并添加排名
    const unifiedItems = ContentTransformationService.transformMovieListToUnified(mockMovies)
    const hotItems = ContentTransformationService.transformUnifiedListToHot(unifiedItems)
    
    // 添加排名信息
    return hotItems.map((item, index) => ({
      ...item,
      rank: index + 1
    }))
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
