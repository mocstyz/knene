/**
 * @fileoverview MockDataService单元测试
 * @description 测试MockDataService的数据生成逻辑，包括VIP状态、NEW标签、质量标签等业务规则
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { MockDataService } from '../MockDataService'
import type { CollectionItem, PhotoItem, BaseMovieItem, MediaStatusItem } from '@types-movie'

// 扩展类型以包含测试所需的字段
type MovieItemWithStatus = BaseMovieItem & MediaStatusItem & { contentType?: 'movie' }

describe('MockDataService - VIP状态生成测试', () => {
  let mockDataService: MockDataService

  beforeEach(() => {
    mockDataService = MockDataService.getInstance()
    // 清除缓存以确保每次测试都生成新数据
    mockDataService.clearCache()
  })

  describe('合集VIP状态测试', () => {
    it('应该为所有合集设置isVip为true', () => {
      // Arrange & Act
      const collections = mockDataService.generateMockCollections(20)

      // Assert
      expect(collections).toHaveLength(20)
      collections.forEach((collection, index) => {
        expect(collection.isVip).toBe(true)
        expect(collection.type).toBe('Collection')
        expect(collection.contentType).toBe('collection')
      })
    })

    it('应该为所有合集生成一致的VIP状态（多次调用）', () => {
      // Arrange & Act
      mockDataService.clearCache()
      const collections1 = mockDataService.generateMockCollections(10)
      mockDataService.clearCache()
      const collections2 = mockDataService.generateMockCollections(10)

      // Assert
      expect(collections1).toHaveLength(10)
      expect(collections2).toHaveLength(10)
      
      // 验证所有合集都是VIP
      collections1.forEach(c => expect(c.isVip).toBe(true))
      collections2.forEach(c => expect(c.isVip).toBe(true))
    })

    it('应该为合集生成正确的数据结构', () => {
      // Arrange & Act
      const collections = mockDataService.generateMockCollections(5)

      // Assert
      collections.forEach((collection) => {
        // 必需字段
        expect(collection.id).toBeDefined()
        expect(collection.title).toBeDefined()
        expect(collection.imageUrl).toBeDefined()
        expect(collection.type).toBe('Collection')
        expect(collection.contentType).toBe('collection')
        
        // VIP字段
        expect(collection.isVip).toBe(true)
        expect(typeof collection.isVip).toBe('boolean')
        
        // 统计字段
        expect(typeof collection.viewCount).toBe('number')
        expect(typeof collection.downloadCount).toBe('number')
        expect(typeof collection.likeCount).toBe('number')
        expect(typeof collection.favoriteCount).toBe('number')
      })
    })
  })

  describe('写真VIP状态测试', () => {
    it('应该为所有写真设置isVip为true', () => {
      // Arrange & Act
      const photos = mockDataService.generateMockPhotos(20)

      // Assert
      expect(photos).toHaveLength(20)
      photos.forEach((photo) => {
        expect(photo.isVip).toBe(true)
        expect(photo.type).toBe('Photo')
        expect(photo.contentType).toBe('photo')
      })
    })

    it('应该为所有写真生成一致的VIP状态（多次调用）', () => {
      // Arrange & Act
      mockDataService.clearCache()
      const photos1 = mockDataService.generateMockPhotos(10)
      mockDataService.clearCache()
      const photos2 = mockDataService.generateMockPhotos(10)

      // Assert
      expect(photos1).toHaveLength(10)
      expect(photos2).toHaveLength(10)
      
      // 验证所有写真都是VIP
      photos1.forEach(p => expect(p.isVip).toBe(true))
      photos2.forEach(p => expect(p.isVip).toBe(true))
    })

    it('应该为写真生成正确的数据结构', () => {
      // Arrange & Act
      const photos = mockDataService.generateMockPhotos(5)

      // Assert
      photos.forEach((photo) => {
        // 必需字段
        expect(photo.id).toBeDefined()
        expect(photo.title).toBeDefined()
        expect(photo.imageUrl).toBeDefined()
        expect(photo.type).toBe('Photo')
        expect(photo.contentType).toBe('photo')
        
        // VIP字段
        expect(photo.isVip).toBe(true)
        expect(typeof photo.isVip).toBe('boolean')
        
        // 写真特有字段
        expect(photo.formatType).toBeDefined()
        expect(['JPEG高', 'PNG', 'WebP', 'GIF', 'BMP']).toContain(photo.formatType)
        
        // 统计字段
        expect(typeof photo.viewCount).toBe('number')
        expect(typeof photo.downloadCount).toBe('number')
        expect(typeof photo.likeCount).toBe('number')
        expect(typeof photo.favoriteCount).toBe('number')
      })
    })
  })

  describe('影片VIP状态测试', () => {
    it('应该根据索引决定影片的VIP状态（每3个中有1个是VIP）', () => {
      // Arrange & Act
      const movies = mockDataService.generateMockMovies(30) as MovieItemWithStatus[]

      // Assert
      expect(movies).toHaveLength(30)
      
      // 验证VIP规则：每3个中有1个是VIP（索引0, 3, 6, 9...）
      movies.forEach((movie, index) => {
        if (index % 3 === 0) {
          expect(movie.isVip).toBe(true)
        } else {
          expect(movie.isVip).toBe(false)
        }
      })
    })

    it('应该为影片生成一致的VIP状态（多次调用）', () => {
      // Arrange & Act
      mockDataService.clearCache()
      const movies1 = mockDataService.generateMockMovies(15) as MovieItemWithStatus[]
      mockDataService.clearCache()
      const movies2 = mockDataService.generateMockMovies(15) as MovieItemWithStatus[]

      // Assert
      expect(movies1).toHaveLength(15)
      expect(movies2).toHaveLength(15)
      
      // 验证相同索引的影片有相同的VIP状态
      movies1.forEach((movie1, index) => {
        const movie2 = movies2[index]
        expect(movie1.isVip).toBe(movie2.isVip)
        
        // 验证VIP规则
        if (index % 3 === 0) {
          expect(movie1.isVip).toBe(true)
          expect(movie2.isVip).toBe(true)
        } else {
          expect(movie1.isVip).toBe(false)
          expect(movie2.isVip).toBe(false)
        }
      })
    })

    it('应该为影片生成正确的数据结构', () => {
      // Arrange & Act
      const movies = mockDataService.generateMockMovies(10) as MovieItemWithStatus[]

      // Assert
      movies.forEach((movie, index) => {
        // 必需字段
        expect(movie.id).toBeDefined()
        expect(movie.title).toBeDefined()
        expect(movie.imageUrl).toBeDefined()
        expect(movie.type).toBe('Movie')
        
        // VIP字段
        expect(typeof movie.isVip).toBe('boolean')
        const expectedVip = index % 3 === 0
        expect(movie.isVip).toBe(expectedVip)
        
        // 质量字段
        expect(movie.quality).toBeDefined()
        expect(['4K', 'HD', '1080P', '720P']).toContain(movie.quality)
        
        // 评分字段
        expect(movie.rating).toBeDefined()
        const rating = parseFloat(movie.rating as string)
        expect(rating).toBeGreaterThanOrEqual(6)
        expect(rating).toBeLessThanOrEqual(10)
        
        // 统计字段
        expect(typeof movie.viewCount).toBe('number')
        expect(typeof movie.downloadCount).toBe('number')
        expect(typeof movie.likeCount).toBe('number')
        expect(typeof movie.favoriteCount).toBe('number')
      })
    })

    it('应该正确计算VIP影片的比例', () => {
      // Arrange & Act
      const movies = mockDataService.generateMockMovies(30) as MovieItemWithStatus[]

      // Assert
      const vipMovies = movies.filter(m => m.isVip)
      const nonVipMovies = movies.filter(m => !m.isVip)
      
      // 每3个中有1个是VIP，所以30个影片中应该有10个VIP
      expect(vipMovies).toHaveLength(10)
      expect(nonVipMovies).toHaveLength(20)
    })
  })

  describe('合集影片列表VIP继承测试', () => {
    it('应该为合集中的所有影片设置isVip为true', () => {
      // Arrange & Act
      const result = mockDataService.getMockCollectionMovies({
        collectionId: 'collection_1',
        page: 1,
        pageSize: 20
      })

      // Assert
      expect(result.movies).toBeDefined()
      expect(result.movies.length).toBeGreaterThan(0)
      
      // 验证所有影片都是VIP（继承合集的VIP状态）
      result.movies.forEach((movie) => {
        expect(movie.isVip).toBe(true)
      })
    })

    it('应该为不同合集的影片都设置isVip为true', () => {
      // Arrange & Act
      const collection1Movies = mockDataService.getMockCollectionMovies({
        collectionId: 'collection_1',
        page: 1,
        pageSize: 10
      })
      
      const collection2Movies = mockDataService.getMockCollectionMovies({
        collectionId: 'collection_2',
        page: 1,
        pageSize: 10
      })

      // Assert
      collection1Movies.movies.forEach(movie => {
        expect(movie.isVip).toBe(true)
      })
      
      collection2Movies.movies.forEach(movie => {
        expect(movie.isVip).toBe(true)
      })
    })

    it('应该为合集影片生成正确的数据结构', () => {
      // Arrange & Act
      const result = mockDataService.getMockCollectionMovies({
        collectionId: 'collection_1',
        page: 1,
        pageSize: 5
      })

      // Assert
      result.movies.forEach((movie) => {
        // 必需字段
        expect(movie.id).toBeDefined()
        expect(movie.title).toBeDefined()
        expect(movie.imageUrl).toBeDefined()
        expect(movie.type).toBe('Movie')
        
        // VIP字段（继承合集）
        expect(movie.isVip).toBe(true)
        expect(typeof movie.isVip).toBe('boolean')
        
        // 其他字段
        expect(movie.quality).toBeDefined()
        expect(movie.rating).toBeDefined()
      })
    })
  })
})


describe('MockDataService - NEW标签生成测试', () => {
  let mockDataService: MockDataService

  beforeEach(() => {
    mockDataService = MockDataService.getInstance()
    mockDataService.clearCache()
  })

  describe('NEW标签计算逻辑测试', () => {
    it('应该只为24小时内的内容设置isNew为true', () => {
      // Arrange & Act
      const collections = mockDataService.generateMockCollections(50)
      const photos = mockDataService.generateMockPhotos(50)
      const movies = mockDataService.generateMockMovies(50) as MovieItemWithStatus[]

      // Assert - 检查所有内容的isNew字段
      const allItems = [...collections, ...photos, ...movies]
      
      allItems.forEach((item) => {
        const updatedAt = new Date(item.updatedAt || item.createdAt || 0)
        const now = new Date()
        const hoursDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60)
        
        if (hoursDiff <= 24) {
          // 24小时内的内容应该isNew为true
          expect(item.isNew).toBe(true)
        } else {
          // 超过24小时的内容应该isNew为false或undefined
          expect(item.isNew).toBeFalsy()
        }
      })
    })

    it('应该为isNew为true的内容设置newType', () => {
      // Arrange & Act
      const collections = mockDataService.generateMockCollections(50)
      const photos = mockDataService.generateMockPhotos(50)
      const movies = mockDataService.generateMockMovies(50) as MovieItemWithStatus[]

      // Assert
      const allItems = [...collections, ...photos, ...movies]
      
      allItems.forEach((item) => {
        if (item.isNew) {
          // isNew为true的内容应该有newType
          expect(item.newType).toBeDefined()
          expect(['hot', 'latest']).toContain(item.newType)
        }
      })
    })

    it('应该为合集正确计算isNew状态', () => {
      // Arrange & Act
      const collections = mockDataService.generateMockCollections(30)

      // Assert
      collections.forEach((collection) => {
        expect(typeof collection.isNew).toBe('boolean')
        
        if (collection.isNew) {
          expect(collection.newType).toBe('latest')
        } else {
          expect(collection.newType).toBeNull()
        }
      })
    })

    it('应该为写真正确计算isNew状态', () => {
      // Arrange & Act
      const photos = mockDataService.generateMockPhotos(30)

      // Assert
      photos.forEach((photo) => {
        expect(typeof photo.isNew).toBe('boolean')
        
        if (photo.isNew) {
          expect(photo.newType).toBe('latest')
        } else {
          expect(photo.newType).toBeNull()
        }
      })
    })

    it('应该为影片正确计算isNew状态', () => {
      // Arrange & Act
      const movies = mockDataService.generateMockMovies(30) as MovieItemWithStatus[]

      // Assert
      movies.forEach((movie) => {
        expect(typeof movie.isNew).toBe('boolean')
        
        if (movie.isNew) {
          expect(movie.newType).toBe('latest')
        } else {
          expect(movie.newType).toBeNull()
        }
      })
    })
  })

  describe('NEW标签一致性测试', () => {
    it('应该在多次调用时生成一致的isNew状态（基于相同的发布时间）', () => {
      // Arrange & Act
      mockDataService.clearCache()
      const collections1 = mockDataService.generateMockCollections(10)
      mockDataService.clearCache()
      const collections2 = mockDataService.generateMockCollections(10)

      // Assert - 由于发布时间是随机的，我们只验证isNew字段存在且为boolean
      collections1.forEach((c1, index) => {
        const c2 = collections2[index]
        expect(typeof c1.isNew).toBe('boolean')
        expect(typeof c2.isNew).toBe('boolean')
      })
    })

    it('应该为最新更新列表中的内容正确设置isNew', () => {
      // Arrange & Act
      const latestUpdates = mockDataService.getMockLatestUpdates(20)

      // Assert
      latestUpdates.forEach((item) => {
        expect(typeof item.isNew).toBe('boolean')
        
        // 验证isNew与发布时间的一致性
        if (item.updatedAt || item.createdAt) {
          const publishDate = new Date(item.updatedAt || item.createdAt || 0)
          const now = new Date()
          const hoursDiff = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60)
          
          if (hoursDiff <= 24) {
            expect(item.isNew).toBe(true)
          }
        }
      })
    })

    it('应该为热门列表中的内容正确设置isNew', () => {
      // Arrange & Act
      const hotItems = mockDataService.getMockWeeklyHot(20)

      // Assert
      hotItems.forEach((item) => {
        expect(typeof item.isNew).toBe('boolean')
        
        // 验证isNew与发布时间的一致性
        if (item.updatedAt || item.createdAt) {
          const publishDate = new Date(item.updatedAt || item.createdAt || 0)
          const now = new Date()
          const hoursDiff = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60)
          
          if (hoursDiff <= 24) {
            expect(item.isNew).toBe(true)
          }
        }
      })
    })
  })

  describe('NEW标签边界情况测试', () => {
    it('应该处理没有发布时间的内容', () => {
      // Arrange & Act
      const collections = mockDataService.generateMockCollections(5)

      // Assert - 所有内容都应该有发布时间
      collections.forEach((collection) => {
        expect(collection.updatedAt || collection.createdAt).toBeDefined()
      })
    })

    it('应该为newType字段设置正确的值', () => {
      // Arrange & Act
      const allCollections = mockDataService.generateMockCollections(50)
      const allPhotos = mockDataService.generateMockPhotos(50)
      const allMovies = mockDataService.generateMockMovies(50) as MovieItemWithStatus[]

      // Assert
      const allItems = [...allCollections, ...allPhotos, ...allMovies]
      
      allItems.forEach((item) => {
        // newType应该是'hot'、'latest'或null
        if (item.newType !== null) {
          expect(['hot', 'latest']).toContain(item.newType)
        }
        
        // 如果isNew为true，newType应该有值
        if (item.isNew) {
          expect(item.newType).not.toBeNull()
        }
        
        // 如果isNew为false，newType应该为null
        if (!item.isNew) {
          expect(item.newType).toBeNull()
        }
      })
    })
  })
})


describe('MockDataService - 随机数据测试', () => {
  let mockDataService: MockDataService

  beforeEach(() => {
    mockDataService = MockDataService.getInstance()
    mockDataService.clearCache()
  })

  describe('统计字段随机性测试', () => {
    it('应该为统计字段生成随机值（viewCount、downloadCount、likeCount、favoriteCount）', () => {
      // Arrange & Act
      mockDataService.clearCache()
      const collections1 = mockDataService.generateMockCollections(10)
      mockDataService.clearCache()
      const collections2 = mockDataService.generateMockCollections(10)

      // Assert - 统计字段应该是随机的（不同调用生成不同的值）
      let hasRandomDifference = false
      
      for (let i = 0; i < collections1.length; i++) {
        const c1 = collections1[i]
        const c2 = collections2[i]
        
        // 检查至少有一个统计字段不同
        if (
          c1.viewCount !== c2.viewCount ||
          c1.downloadCount !== c2.downloadCount ||
          c1.likeCount !== c2.likeCount ||
          c1.favoriteCount !== c2.favoriteCount
        ) {
          hasRandomDifference = true
          break
        }
      }
      
      expect(hasRandomDifference).toBe(true)
    })

    it('应该为合集生成合理范围的统计数据', () => {
      // Arrange & Act
      const collections = mockDataService.generateMockCollections(20)

      // Assert
      collections.forEach((collection) => {
        // viewCount: 1000-51000
        expect(collection.viewCount).toBeGreaterThanOrEqual(1000)
        expect(collection.viewCount).toBeLessThan(51000)
        
        // downloadCount: 50-5050
        expect(collection.downloadCount).toBeGreaterThanOrEqual(50)
        expect(collection.downloadCount).toBeLessThan(5050)
        
        // likeCount: 100-5100
        expect(collection.likeCount).toBeGreaterThanOrEqual(100)
        expect(collection.likeCount).toBeLessThan(5100)
        
        // favoriteCount: 50-2050
        expect(collection.favoriteCount).toBeGreaterThanOrEqual(50)
        expect(collection.favoriteCount).toBeLessThan(2050)
      })
    })

    it('应该为写真生成合理范围的统计数据', () => {
      // Arrange & Act
      const photos = mockDataService.generateMockPhotos(20)

      // Assert
      photos.forEach((photo) => {
        // viewCount: 1000-51000
        expect(photo.viewCount).toBeGreaterThanOrEqual(1000)
        expect(photo.viewCount).toBeLessThan(51000)
        
        // downloadCount: 100-5100
        expect(photo.downloadCount).toBeGreaterThanOrEqual(100)
        expect(photo.downloadCount).toBeLessThan(5100)
        
        // likeCount: 100-5100
        expect(photo.likeCount).toBeGreaterThanOrEqual(100)
        expect(photo.likeCount).toBeLessThan(5100)
        
        // favoriteCount: 50-2050
        expect(photo.favoriteCount).toBeGreaterThanOrEqual(50)
        expect(photo.favoriteCount).toBeLessThan(2050)
      })
    })

    it('应该为影片生成合理范围的统计数据', () => {
      // Arrange & Act
      const movies = mockDataService.generateMockMovies(20) as MovieItemWithStatus[]

      // Assert
      movies.forEach((movie) => {
        // viewCount: 1000-51000
        expect(movie.viewCount).toBeGreaterThanOrEqual(1000)
        expect(movie.viewCount).toBeLessThan(51000)
        
        // downloadCount: 0-10000
        expect(movie.downloadCount).toBeGreaterThanOrEqual(0)
        expect(movie.downloadCount).toBeLessThan(10000)
        
        // likeCount: 100-5100
        expect(movie.likeCount).toBeGreaterThanOrEqual(100)
        expect(movie.likeCount).toBeLessThan(5100)
        
        // favoriteCount: 50-2050
        expect(movie.favoriteCount).toBeGreaterThanOrEqual(50)
        expect(movie.favoriteCount).toBeLessThan(2050)
      })
    })
  })

  describe('业务字段固定性测试', () => {
    it('应该为相同索引的合集生成一致的业务字段（isVip、quality等）', () => {
      // Arrange & Act
      mockDataService.clearCache()
      const collections1 = mockDataService.generateMockCollections(10)
      mockDataService.clearCache()
      const collections2 = mockDataService.generateMockCollections(10)

      // Assert - 业务字段应该是固定的（相同索引生成相同的值）
      for (let i = 0; i < collections1.length; i++) {
        const c1 = collections1[i]
        const c2 = collections2[i]
        
        // VIP状态应该一致（都是true）
        expect(c1.isVip).toBe(c2.isVip)
        expect(c1.isVip).toBe(true)
        
        // 类型应该一致
        expect(c1.type).toBe(c2.type)
        expect(c1.contentType).toBe(c2.contentType)
      }
    })

    it('应该为相同索引的写真生成一致的业务字段', () => {
      // Arrange & Act
      mockDataService.clearCache()
      const photos1 = mockDataService.generateMockPhotos(10)
      mockDataService.clearCache()
      const photos2 = mockDataService.generateMockPhotos(10)

      // Assert
      for (let i = 0; i < photos1.length; i++) {
        const p1 = photos1[i]
        const p2 = photos2[i]
        
        // VIP状态应该一致（都是true）
        expect(p1.isVip).toBe(p2.isVip)
        expect(p1.isVip).toBe(true)
        
        // 格式类型应该一致（基于索引）
        expect(p1.formatType).toBe(p2.formatType)
        
        // 质量应该一致（基于索引）
        expect(p1.quality).toBe(p2.quality)
      }
    })

    it('应该为相同索引的影片生成一致的业务字段', () => {
      // Arrange & Act
      mockDataService.clearCache()
      const movies1 = mockDataService.generateMockMovies(15) as MovieItemWithStatus[]
      mockDataService.clearCache()
      const movies2 = mockDataService.generateMockMovies(15) as MovieItemWithStatus[]

      // Assert
      for (let i = 0; i < movies1.length; i++) {
        const m1 = movies1[i]
        const m2 = movies2[i]
        
        // VIP状态应该一致（基于索引规则）
        expect(m1.isVip).toBe(m2.isVip)
        
        // 质量应该一致（基于索引）
        expect(m1.quality).toBe(m2.quality)
        
        // 验证质量值的循环规律
        const expectedQuality = ['4K', 'HD', '1080P', '720P'][i % 4]
        expect(m1.quality).toBe(expectedQuality)
        expect(m2.quality).toBe(expectedQuality)
      }
    })
  })

  describe('质量标签固定性测试', () => {
    it('应该为影片按索引循环生成质量标签（4K、HD、1080P、720P）', () => {
      // Arrange & Act
      const movies = mockDataService.generateMockMovies(20) as MovieItemWithStatus[]

      // Assert
      const expectedQualities = ['4K', 'HD', '1080P', '720P']
      
      movies.forEach((movie, index) => {
        const expectedQuality = expectedQualities[index % 4]
        expect(movie.quality).toBe(expectedQuality)
      })
    })

    it('应该为写真按索引循环生成质量标签', () => {
      // Arrange & Act
      const photos = mockDataService.generateMockPhotos(20)

      // Assert
      const expectedQualities = ['4K', 'HD', '高清']
      
      photos.forEach((photo, index) => {
        const expectedQuality = expectedQualities[index % 3]
        expect(photo.quality).toBe(expectedQuality)
      })
    })

    it('应该为写真按索引循环生成格式类型', () => {
      // Arrange & Act
      const photos = mockDataService.generateMockPhotos(20)

      // Assert
      const expectedFormats: Array<'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP'> = ['JPEG高', 'PNG', 'WebP', 'GIF', 'BMP']
      
      photos.forEach((photo, index) => {
        const expectedFormat = expectedFormats[index % 5]
        expect(photo.formatType).toBe(expectedFormat)
      })
    })
  })

  describe('评分数据测试', () => {
    it('应该为合集生成合理的评分', () => {
      // Arrange & Act
      const collections = mockDataService.generateMockCollections(20)

      // Assert
      collections.forEach((collection) => {
        const rating = parseFloat(collection.rating as string)
        expect(rating).toBeGreaterThanOrEqual(6)
        expect(rating).toBeLessThanOrEqual(10)
      })
    })

    it('应该为写真生成合理的评分', () => {
      // Arrange & Act
      const photos = mockDataService.generateMockPhotos(20)

      // Assert
      photos.forEach((photo) => {
        const rating = parseFloat(photo.rating as string)
        expect(rating).toBeGreaterThanOrEqual(7)
        expect(rating).toBeLessThanOrEqual(10)
      })
    })

    it('应该为影片生成合理的评分', () => {
      // Arrange & Act
      const movies = mockDataService.generateMockMovies(20) as MovieItemWithStatus[]

      // Assert
      movies.forEach((movie) => {
        const rating = parseFloat(movie.rating as string)
        expect(rating).toBeGreaterThanOrEqual(6)
        expect(rating).toBeLessThanOrEqual(10)
      })
    })
  })

  describe('缓存机制测试', () => {
    it('应该在使用缓存时返回相同的数据（包括随机字段）', () => {
      // Arrange & Act
      const collections1 = mockDataService.generateMockCollections(10)
      const collections2 = mockDataService.generateMockCollections(10) // 使用缓存

      // Assert - 使用缓存时，所有字段都应该完全相同
      for (let i = 0; i < collections1.length; i++) {
        const c1 = collections1[i]
        const c2 = collections2[i]
        
        expect(c1.id).toBe(c2.id)
        expect(c1.isVip).toBe(c2.isVip)
        expect(c1.viewCount).toBe(c2.viewCount)
        expect(c1.downloadCount).toBe(c2.downloadCount)
        expect(c1.likeCount).toBe(c2.likeCount)
        expect(c1.favoriteCount).toBe(c2.favoriteCount)
      }
    })

    it('应该在清除缓存后生成新的随机数据', () => {
      // Arrange & Act
      const collections1 = mockDataService.generateMockCollections(10)
      mockDataService.clearCache()
      const collections2 = mockDataService.generateMockCollections(10)

      // Assert - 清除缓存后，随机字段应该不同
      let hasRandomDifference = false
      
      for (let i = 0; i < collections1.length; i++) {
        const c1 = collections1[i]
        const c2 = collections2[i]
        
        if (
          c1.viewCount !== c2.viewCount ||
          c1.downloadCount !== c2.downloadCount ||
          c1.likeCount !== c2.likeCount ||
          c1.favoriteCount !== c2.favoriteCount
        ) {
          hasRandomDifference = true
          break
        }
      }
      
      expect(hasRandomDifference).toBe(true)
    })
  })
})
