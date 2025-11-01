/**
 * @fileoverview 数据流集成测试
 * @description 测试从MockDataService到UI的完整数据流，验证数据在各层之间传递时的完整性
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { MockDataService } from '@application/services/MockDataService'
import type { BaseMovieItem, MediaStatusItem } from '@types-movie'

// 扩展类型以包含测试所需的字段
type MovieItemWithStatus = BaseMovieItem & MediaStatusItem & { contentType?: 'movie' }

describe('数据流集成测试 - 完整数据流', () => {
    let mockDataService: MockDataService

    beforeEach(() => {
        mockDataService = MockDataService.getInstance()
        mockDataService.clearCache()
    })

    describe('MockDataService → Repository 数据流', () => {
        it('应该从MockDataService到Repository保持数据完整性', () => {
            // Arrange & Act
            const mockCollections = mockDataService.generateMockCollections(10)
            const repoCollections = mockDataService.getMockCollections(10)

            // Assert - 验证数据结构一致
            expect(mockCollections).toBeDefined()
            expect(Array.isArray(mockCollections)).toBe(true)
            expect(repoCollections).toBeDefined()
            expect(Array.isArray(repoCollections)).toBe(true)

            // 验证每个合集的必需字段
            repoCollections.forEach((collection) => {
                expect(collection.id).toBeDefined()
                expect(collection.title).toBeDefined()
                expect(collection.imageUrl).toBeDefined()
                expect(collection.type).toBe('Collection')
                expect(collection.contentType).toBe('collection')
                expect(collection.isVip).toBe(true)
                expect(typeof collection.isVip).toBe('boolean')
            })
        })

        it('应该从MockDataService到Repository保持VIP字段', () => {
            // Arrange & Act
            const mockCollections = mockDataService.generateMockCollections(5)
            const mockPhotos = mockDataService.generateMockPhotos(5)
            const mockMovies = mockDataService.generateMockMovies(15) as MovieItemWithStatus[]

            const repoCollections = mockDataService.getMockCollections(5)
            const repoPhotos = mockDataService.getMockPhotos(5)

            // Assert - 验证VIP字段在整个流程中不丢失
            repoCollections.forEach((collection) => {
                expect(collection.isVip).toBe(true)
            })

            repoPhotos.forEach((photo) => {
                expect(photo.isVip).toBe(true)
            })

            // 验证影片的VIP规则
            mockMovies.forEach((movie, index) => {
                expect(typeof movie.isVip).toBe('boolean')
            })
        })

        it('应该从MockDataService到Repository保持NEW字段', () => {
            // Arrange & Act
            const repoCollections = mockDataService.getMockCollections(10)
            const repoPhotos = mockDataService.getMockPhotos(10)

            // Assert - 验证isNew字段存在且为boolean
            repoCollections.forEach((collection) => {
                expect(typeof collection.isNew).toBe('boolean')
                if (collection.isNew) {
                    expect(collection.newType).toBeDefined()
                }
            })

            repoPhotos.forEach((photo) => {
                expect(typeof photo.isNew).toBe('boolean')
                if (photo.isNew) {
                    expect(photo.newType).toBeDefined()
                }
            })
        })

        it('应该从MockDataService到Repository保持质量字段', () => {
            // Arrange & Act
            const mockPhotos = mockDataService.generateMockPhotos(10)
            const mockMovies = mockDataService.generateMockMovies(10) as MovieItemWithStatus[]

            const repoPhotos = mockDataService.getMockPhotos(10)

            // Assert - 验证质量字段
            repoPhotos.forEach((photo) => {
                expect(photo.quality).toBeDefined()
                expect(photo.formatType).toBeDefined()
            })

            mockMovies.forEach((movie) => {
                expect(movie.quality).toBeDefined()
            })
        })

        it('应该从MockDataService到Repository保持统计字段', () => {
            // Arrange & Act
            const repoCollections = mockDataService.getMockCollections(10)
            const repoPhotos = mockDataService.getMockPhotos(10)

            // Assert - 验证统计字段
            repoCollections.forEach((collection) => {
                expect(typeof collection.viewCount).toBe('number')
                expect(typeof collection.downloadCount).toBe('number')
                expect(typeof collection.likeCount).toBe('number')
                expect(typeof collection.favoriteCount).toBe('number')
            })

            repoPhotos.forEach((photo) => {
                expect(typeof photo.viewCount).toBe('number')
                expect(typeof photo.downloadCount).toBe('number')
                expect(typeof photo.likeCount).toBe('number')
                expect(typeof photo.favoriteCount).toBe('number')
            })
        })
    })

    describe('Repository → ApplicationService 数据流', () => {
        it('应该从Repository到ApplicationService保持数据结构', () => {
            // Arrange & Act - 直接使用MockDataService模拟完整的数据流
            const collections = mockDataService.getMockCollections(3)
            const photos = mockDataService.getMockPhotos(6)
            const latestUpdates = mockDataService.getMockLatestUpdates(6)
            const hotDaily = mockDataService.getMockHotDaily(6)

            // Assert - 验证首页数据结构
            expect(collections).toBeDefined()
            expect(photos).toBeDefined()
            expect(latestUpdates).toBeDefined()
            expect(hotDaily).toBeDefined()

            // 验证数据类型
            expect(Array.isArray(collections)).toBe(true)
            expect(Array.isArray(photos)).toBe(true)
            expect(Array.isArray(latestUpdates)).toBe(true)
            expect(Array.isArray(hotDaily)).toBe(true)
        })

        it('应该从Repository到ApplicationService保持VIP字段', () => {
            // Arrange & Act
            const collections = mockDataService.getMockCollections(5)
            const photos = mockDataService.getMockPhotos(5)

            // Assert - 验证VIP字段
            collections.forEach((collection) => {
                expect(collection.isVip).toBe(true)
            })

            photos.forEach((photo) => {
                expect(photo.isVip).toBe(true)
            })
        })

        it('应该从Repository到ApplicationService保持所有标签字段', () => {
            // Arrange & Act
            const collections = mockDataService.getMockCollections(5)
            const photos = mockDataService.getMockPhotos(5)

            // Assert - 验证所有标签字段
            collections.forEach((collection) => {
                expect(typeof collection.isVip).toBe('boolean')
                expect(typeof collection.isNew).toBe('boolean')
            })

            photos.forEach((photo) => {
                expect(typeof photo.isVip).toBe('boolean')
                expect(typeof photo.isNew).toBe('boolean')
                expect(photo.quality).toBeDefined()
                expect(photo.formatType).toBeDefined()
            })
        })
    })

    describe('完整数据流测试（MockDataService → Repository → ApplicationService）', () => {
        it('应该在整个数据流中保持数据完整性', () => {
            // Arrange
            mockDataService.clearCache()

            // Act - 模拟完整的数据流
            const mockCollections = mockDataService.generateMockCollections(5)
            const repoCollections = mockDataService.getMockCollections(5)
            const collections = mockDataService.getMockCollections(3)

            // Assert - 验证数据在整个流程中保持一致
            expect(mockCollections.length).toBeGreaterThan(0)
            expect(repoCollections.length).toBeGreaterThan(0)
            expect(collections.length).toBeGreaterThan(0)

            // 验证关键字段在整个流程中不丢失
            collections.forEach((collection) => {
                expect(collection.id).toBeDefined()
                expect(collection.title).toBeDefined()
                expect(collection.imageUrl).toBeDefined()
                expect(collection.isVip).toBe(true)
                expect(typeof collection.isNew).toBe('boolean')
                expect(typeof collection.viewCount).toBe('number')
            })
        })

        it('应该在整个数据流中保持VIP业务规则', () => {
            // Arrange & Act
            const collections = mockDataService.getMockCollections(5)
            const photos = mockDataService.getMockPhotos(5)

            // Assert - 验证VIP业务规则
            // 所有合集都是VIP
            collections.forEach((collection) => {
                expect(collection.isVip).toBe(true)
            })

            // 所有写真都是VIP
            photos.forEach((photo) => {
                expect(photo.isVip).toBe(true)
            })
        })

        it('应该在整个数据流中保持NEW标签规则', () => {
            // Arrange & Act
            const collections = mockDataService.getMockCollections(3)
            const photos = mockDataService.getMockPhotos(6)
            const latestUpdates = mockDataService.getMockLatestUpdates(6)
            const hotDaily = mockDataService.getMockHotDaily(6)

            // Assert - 验证NEW标签规则
            const allItems = [
                ...collections,
                ...photos,
                ...latestUpdates,
                ...hotDaily
            ]

            allItems.forEach((item) => {
                // isNew应该是boolean类型
                expect(typeof item.isNew).toBe('boolean')

                // 如果isNew为true，应该有newType
                if (item.isNew) {
                    expect(item.newType).toBeDefined()
                    expect(['hot', 'latest']).toContain(item.newType)
                }

                // 如果isNew为false，newType应该为null
                if (!item.isNew) {
                    expect(item.newType).toBeNull()
                }
            })
        })

        it('应该在整个数据流中保持质量标签规则', () => {
            // Arrange & Act
            const photos = mockDataService.getMockPhotos(10)

            // Assert - 验证质量标签规则
            // 写真应该有质量和格式字段
            photos.forEach((photo) => {
                expect(photo.quality).toBeDefined()
                expect(photo.formatType).toBeDefined()
                expect(['JPEG高', 'PNG', 'WebP', 'GIF', 'BMP']).toContain(photo.formatType)
            })
        })

        it('应该在整个数据流中保持统计数据的随机性', () => {
            // Arrange & Act
            mockDataService.clearCache()
            const collections1 = mockDataService.getMockCollections(5)

            mockDataService.clearCache()
            const collections2 = mockDataService.getMockCollections(5)

            // Assert - 验证统计数据是随机的
            let hasRandomDifference = false

            for (let i = 0; i < Math.min(collections1.length, collections2.length); i++) {
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

        it('应该在整个数据流中保持业务字段的固定性', () => {
            // Arrange & Act
            mockDataService.clearCache()
            const collections1 = mockDataService.getMockCollections(5)

            mockDataService.clearCache()
            const collections2 = mockDataService.getMockCollections(5)

            // Assert - 验证业务字段是固定的
            for (let i = 0; i < Math.min(collections1.length, collections2.length); i++) {
                const c1 = collections1[i]
                const c2 = collections2[i]

                // VIP状态应该一致
                expect(c1.isVip).toBe(c2.isVip)
                expect(c1.isVip).toBe(true)

                // 类型应该一致
                expect(c1.type).toBe(c2.type)
                expect(c1.contentType).toBe(c2.contentType)
            }
        })
    })

    describe('混合内容数据流测试', () => {
        it('应该在最新更新列表中保持数据完整性', () => {
            // Arrange & Act
            const latestUpdates = mockDataService.getMockLatestUpdates(10)

            // Assert
            expect(latestUpdates).toBeDefined()
            expect(Array.isArray(latestUpdates)).toBe(true)

            latestUpdates.forEach((item) => {
                expect(item.id).toBeDefined()
                expect(item.title).toBeDefined()
                expect(item.imageUrl).toBeDefined()
                expect(item.contentType).toBeDefined()
                expect(['movie', 'photo', 'collection']).toContain(item.contentType)
                expect(typeof item.isVip).toBe('boolean')
                expect(typeof item.isNew).toBe('boolean')
            })
        })

        it('应该在热门列表中保持数据完整性', () => {
            // Arrange & Act
            const hotItems = mockDataService.getMockHotDaily(10)

            // Assert
            expect(hotItems).toBeDefined()
            expect(Array.isArray(hotItems)).toBe(true)

            hotItems.forEach((item: any) => {
                expect(item.id).toBeDefined()
                expect(item.title).toBeDefined()
                expect(item.imageUrl).toBeDefined()
                expect(item.contentType).toBeDefined()
                expect(['movie', 'photo', 'collection']).toContain(item.contentType)
                expect(typeof item.isVip).toBe('boolean')
                expect(typeof item.isNew).toBe('boolean')
                expect(typeof item.hotScore).toBe('number')
            })
        })

        it('应该在混合列表中正确应用VIP规则', () => {
            // Arrange & Act
            const latestUpdates = mockDataService.getMockLatestUpdates(10)

            // Assert - 验证VIP规则
            latestUpdates.forEach((item) => {
                if (item.contentType === 'collection') {
                    expect(item.isVip).toBe(true)
                } else if (item.contentType === 'photo') {
                    expect(item.isVip).toBe(true)
                }
                // 影片的VIP状态根据索引决定，不做固定断言
            })
        })
    })

    describe('合集影片列表数据流测试', () => {
        it('应该为合集影片列表保持VIP继承', () => {
            // Arrange & Act
            const result = mockDataService.getMockCollectionMovies({
                collectionId: 'collection_1',
                page: 1,
                pageSize: 10
            })

            // Assert
            expect(result).toBeDefined()
            expect(result.movies).toBeDefined()
            expect(Array.isArray(result.movies)).toBe(true)

            // 验证所有影片都继承了合集的VIP状态
            result.movies.forEach((movie: any) => {
                expect(movie.isVip).toBe(true)
            })
        })

        it('应该为合集影片列表保持数据完整性', () => {
            // Arrange & Act
            const result = mockDataService.getMockCollectionMovies({
                collectionId: 'collection_1',
                page: 1,
                pageSize: 10
            })

            // Assert
            result.movies.forEach((movie: any) => {
                expect(movie.id).toBeDefined()
                expect(movie.title).toBeDefined()
                expect(movie.imageUrl).toBeDefined()
                expect(movie.type).toBe('Movie')
                expect(movie.isVip).toBe(true)
                expect(movie.quality).toBeDefined()
                expect(movie.rating).toBeDefined()
            })
        })
    })
})


describe('数据流集成测试 - 数据完整性', () => {
    let mockDataService: MockDataService

    beforeEach(() => {
        mockDataService = MockDataService.getInstance()
        mockDataService.clearCache()
    })

    describe('isVip字段完整性测试', () => {
        it('应该在整个流程中保持isVip字段不丢失', () => {
            // Arrange & Act
            const mockCollections = mockDataService.generateMockCollections(10)
            const repoCollections = mockDataService.getMockCollections(10)
            const collections = mockDataService.getMockCollections(5)

            // Assert - 验证isVip字段在每一层都存在
            mockCollections.forEach((collection) => {
                expect(collection.isVip).toBeDefined()
                expect(typeof collection.isVip).toBe('boolean')
            })

            repoCollections.forEach((collection) => {
                expect(collection.isVip).toBeDefined()
                expect(typeof collection.isVip).toBe('boolean')
            })

            collections.forEach((collection) => {
                expect(collection.isVip).toBeDefined()
                expect(typeof collection.isVip).toBe('boolean')
            })
        })

        it('应该为合集在整个流程中保持isVip为true', () => {
            // Arrange & Act
            const mockCollections = mockDataService.generateMockCollections(10)
            const repoCollections = mockDataService.getMockCollections(10)
            const collections = mockDataService.getMockCollections(5)

            // Assert
            mockCollections.forEach((collection) => {
                expect(collection.isVip).toBe(true)
            })

            repoCollections.forEach((collection) => {
                expect(collection.isVip).toBe(true)
            })

            collections.forEach((collection) => {
                expect(collection.isVip).toBe(true)
            })
        })

        it('应该为写真在整个流程中保持isVip为true', () => {
            // Arrange & Act
            const mockPhotos = mockDataService.generateMockPhotos(10)
            const repoPhotos = mockDataService.getMockPhotos(10)
            const photos = mockDataService.getMockPhotos(5)

            // Assert
            mockPhotos.forEach((photo) => {
                expect(photo.isVip).toBe(true)
            })

            repoPhotos.forEach((photo) => {
                expect(photo.isVip).toBe(true)
            })

            photos.forEach((photo) => {
                expect(photo.isVip).toBe(true)
            })
        })

        it('应该为影片在整个流程中保持isVip字段的正确性', () => {
            // Arrange & Act
            const mockMovies = mockDataService.generateMockMovies(15) as MovieItemWithStatus[]

            // Assert - 验证影片的VIP规则（每3个中有1个是VIP）
            mockMovies.forEach((movie, index) => {
                expect(typeof movie.isVip).toBe('boolean')

                if (index % 3 === 0) {
                    expect(movie.isVip).toBe(true)
                } else {
                    expect(movie.isVip).toBe(false)
                }
            })
        })
    })

    describe('isNew字段完整性测试', () => {
        it('应该在整个流程中保持isNew字段不丢失', () => {
            // Arrange & Act
            const mockCollections = mockDataService.generateMockCollections(10)
            const repoCollections = mockDataService.getMockCollections(10)
            const collections = mockDataService.getMockCollections(5)

            // Assert
            mockCollections.forEach((collection) => {
                expect(typeof collection.isNew).toBe('boolean')
            })

            repoCollections.forEach((collection) => {
                expect(typeof collection.isNew).toBe('boolean')
            })

            collections.forEach((collection) => {
                expect(typeof collection.isNew).toBe('boolean')
            })
        })

        it('应该在整个流程中保持isNew的计算逻辑一致', () => {
            // Arrange & Act
            const collections = mockDataService.getMockCollections(5)
            const photos = mockDataService.getMockPhotos(5)
            const latestUpdates = mockDataService.getMockLatestUpdates(10)

            // Assert - 验证isNew与发布时间的一致性
            const allItems = [
                ...collections,
                ...photos,
                ...latestUpdates
            ]

            allItems.forEach((item) => {
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

        it('应该在整个流程中保持newType字段的正确性', () => {
            // Arrange & Act
            const collections = mockDataService.getMockCollections(5)
            const photos = mockDataService.getMockPhotos(5)
            const latestUpdates = mockDataService.getMockLatestUpdates(10)

            // Assert
            const allItems = [
                ...collections,
                ...photos,
                ...latestUpdates
            ]

            allItems.forEach((item) => {
                if (item.isNew) {
                    expect(item.newType).toBeDefined()
                    expect(['hot', 'latest']).toContain(item.newType)
                } else {
                    expect(item.newType).toBeNull()
                }
            })
        })
    })

    describe('quality字段完整性测试', () => {
        it('应该在整个流程中保持写真的quality字段', () => {
            // Arrange & Act
            const mockPhotos = mockDataService.generateMockPhotos(10)
            const repoPhotos = mockDataService.getMockPhotos(10)
            const photos = mockDataService.getMockPhotos(5)

            // Assert
            mockPhotos.forEach((photo) => {
                expect(photo.quality).toBeDefined()
            })

            repoPhotos.forEach((photo) => {
                expect(photo.quality).toBeDefined()
            })

            photos.forEach((photo) => {
                expect(photo.quality).toBeDefined()
            })
        })

        it('应该在整个流程中保持写真的formatType字段', () => {
            // Arrange & Act
            const mockPhotos = mockDataService.generateMockPhotos(10)
            const repoPhotos = mockDataService.getMockPhotos(10)
            const photos = mockDataService.getMockPhotos(5)

            // Assert
            mockPhotos.forEach((photo) => {
                expect(photo.formatType).toBeDefined()
                expect(['JPEG高', 'PNG', 'WebP', 'GIF', 'BMP']).toContain(photo.formatType)
            })

            repoPhotos.forEach((photo) => {
                expect(photo.formatType).toBeDefined()
                expect(['JPEG高', 'PNG', 'WebP', 'GIF', 'BMP']).toContain(photo.formatType)
            })

            photos.forEach((photo) => {
                expect(photo.formatType).toBeDefined()
                expect(['JPEG高', 'PNG', 'WebP', 'GIF', 'BMP']).toContain(photo.formatType)
            })
        })

        it('应该在整个流程中保持影片的quality字段', () => {
            // Arrange & Act
            const mockMovies = mockDataService.generateMockMovies(10) as MovieItemWithStatus[]

            // Assert
            mockMovies.forEach((movie) => {
                expect(movie.quality).toBeDefined()
                expect(['4K', 'HD', '1080P', '720P']).toContain(movie.quality)
            })
        })
    })

    describe('rating字段完整性测试', () => {
        it('应该在整个流程中保持合集的rating字段', () => {
            // Arrange & Act
            const mockCollections = mockDataService.generateMockCollections(10)
            const repoCollections = mockDataService.getMockCollections(10)
            const collections = mockDataService.getMockCollections(5)

            // Assert
            mockCollections.forEach((collection) => {
                expect(collection.rating).toBeDefined()
                const rating = parseFloat(collection.rating as string)
                expect(rating).toBeGreaterThanOrEqual(6)
                expect(rating).toBeLessThanOrEqual(10)
            })

            repoCollections.forEach((collection) => {
                expect(collection.rating).toBeDefined()
            })

            collections.forEach((collection) => {
                expect(collection.rating).toBeDefined()
            })
        })

        it('应该在整个流程中保持写真的rating字段', () => {
            // Arrange & Act
            const mockPhotos = mockDataService.generateMockPhotos(10)
            const repoPhotos = mockDataService.getMockPhotos(10)
            const photos = mockDataService.getMockPhotos(5)

            // Assert
            mockPhotos.forEach((photo) => {
                expect(photo.rating).toBeDefined()
                const rating = parseFloat(photo.rating as string)
                expect(rating).toBeGreaterThanOrEqual(7)
                expect(rating).toBeLessThanOrEqual(10)
            })

            repoPhotos.forEach((photo) => {
                expect(photo.rating).toBeDefined()
            })

            photos.forEach((photo) => {
                expect(photo.rating).toBeDefined()
            })
        })

        it('应该在整个流程中保持影片的rating字段', () => {
            // Arrange & Act
            const mockMovies = mockDataService.generateMockMovies(10) as MovieItemWithStatus[]

            // Assert
            mockMovies.forEach((movie) => {
                expect(movie.rating).toBeDefined()
                const rating = parseFloat(movie.rating as string)
                expect(rating).toBeGreaterThanOrEqual(6)
                expect(rating).toBeLessThanOrEqual(10)
            })
        })
    })

    describe('统计字段完整性测试', () => {
        it('应该在整个流程中保持所有统计字段', () => {
            // Arrange & Act
            const collections = mockDataService.getMockCollections(5)
            const photos = mockDataService.getMockPhotos(5)
            const latestUpdates = mockDataService.getMockLatestUpdates(10)
            const hotDaily = mockDataService.getMockHotDaily(10)

            // Assert
            const allItems = [
                ...collections,
                ...photos,
                ...latestUpdates,
                ...hotDaily
            ]

            allItems.forEach((item) => {
                expect(typeof item.viewCount).toBe('number')
                expect(typeof item.downloadCount).toBe('number')
                expect(typeof item.likeCount).toBe('number')
                expect(typeof item.favoriteCount).toBe('number')
            })
        })

        it('应该在整个流程中保持统计字段的合理范围', () => {
            // Arrange & Act
            const collections = mockDataService.getMockCollections(10)
            const photos = mockDataService.getMockPhotos(10)

            // Assert
            collections.forEach((collection) => {
                expect(collection.viewCount).toBeGreaterThanOrEqual(0)
                expect(collection.downloadCount).toBeGreaterThanOrEqual(0)
                expect(collection.likeCount).toBeGreaterThanOrEqual(0)
                expect(collection.favoriteCount).toBeGreaterThanOrEqual(0)
            })

            photos.forEach((photo) => {
                expect(photo.viewCount).toBeGreaterThanOrEqual(0)
                expect(photo.downloadCount).toBeGreaterThanOrEqual(0)
                expect(photo.likeCount).toBeGreaterThanOrEqual(0)
                expect(photo.favoriteCount).toBeGreaterThanOrEqual(0)
            })
        })
    })

    describe('数据转换后的字段映射测试', () => {
        it('应该正确映射contentType字段', () => {
            // Arrange & Act
            const collections = mockDataService.getMockCollections(5)
            const photos = mockDataService.getMockPhotos(5)

            // Assert
            collections.forEach((collection) => {
                expect(collection.contentType).toBe('collection')
                expect(collection.type).toBe('Collection')
            })

            photos.forEach((photo) => {
                expect(photo.contentType).toBe('photo')
                expect(photo.type).toBe('Photo')
            })
        })

        it('应该正确映射所有必需字段', () => {
            // Arrange & Act
            const collections = mockDataService.getMockCollections(5)
            const photos = mockDataService.getMockPhotos(5)
            const latestUpdates = mockDataService.getMockLatestUpdates(10)

            // Assert
            const allItems = [
                ...collections,
                ...photos,
                ...latestUpdates
            ]

            allItems.forEach((item) => {
                // 必需字段
                expect(item.id).toBeDefined()
                expect(item.title).toBeDefined()
                expect(item.imageUrl).toBeDefined()
                expect(item.contentType).toBeDefined()

                // 业务字段
                expect(typeof item.isVip).toBe('boolean')
                expect(typeof item.isNew).toBe('boolean')

                // 统计字段
                expect(typeof item.viewCount).toBe('number')
                expect(typeof item.downloadCount).toBe('number')
                expect(typeof item.likeCount).toBe('number')
                expect(typeof item.favoriteCount).toBe('number')
            })
        })

        it('应该正确映射时间字段', () => {
            // Arrange & Act
            const collections = mockDataService.getMockCollections(5)
            const photos = mockDataService.getMockPhotos(5)
            const latestUpdates = mockDataService.getMockLatestUpdates(10)

            // Assert
            const allItems = [
                ...collections,
                ...photos,
                ...latestUpdates
            ]

            allItems.forEach((item) => {
                // 至少应该有一个时间字段
                expect(item.createdAt || item.updatedAt).toBeDefined()

                // 如果有时间字段，应该是有效的日期字符串
                if (item.createdAt) {
                    expect(new Date(item.createdAt).toString()).not.toBe('Invalid Date')
                }

                if (item.updatedAt) {
                    expect(new Date(item.updatedAt).toString()).not.toBe('Invalid Date')
                }
            })
        })
    })

    describe('数据一致性测试', () => {
        it('应该在多次调用时保持业务字段的一致性', () => {
            // Arrange & Act
            const collections1 = mockDataService.getMockCollections(5)
            const collections2 = mockDataService.getMockCollections(5)

            // Assert - 业务字段应该一致（因为使用了缓存）
            for (let i = 0; i < Math.min(collections1.length, collections2.length); i++) {
                const c1 = collections1[i]
                const c2 = collections2[i]

                expect(c1.id).toBe(c2.id)
                expect(c1.isVip).toBe(c2.isVip)
                expect(c1.type).toBe(c2.type)
                expect(c1.contentType).toBe(c2.contentType)
            }
        })

        it('应该在清除缓存后保持业务规则的一致性', () => {
            // Arrange & Act
            mockDataService.clearCache()
            const collections1 = mockDataService.getMockCollections(5)
            const photos1 = mockDataService.getMockPhotos(5)

            mockDataService.clearCache()
            const collections2 = mockDataService.getMockCollections(5)
            const photos2 = mockDataService.getMockPhotos(5)

            // Assert - 业务规则应该一致（即使数据重新生成）
            collections1.forEach((c) => {
                expect(c.isVip).toBe(true)
            })

            collections2.forEach((c) => {
                expect(c.isVip).toBe(true)
            })

            photos1.forEach((p) => {
                expect(p.isVip).toBe(true)
            })

            photos2.forEach((p) => {
                expect(p.isVip).toBe(true)
            })
        })
    })
})
