/**
 * @fileoverview 合集详情页面组件
 * @description 展示特定合集包含的影片列表页面，基于HTML设计稿实现，采用DDD架构和自包含组件设计原则。
 *              使用BaseSection + BaseList + 内容渲染器系统提供统一的列表展示，支持分页导航和响应式布局。
 *              严格遵循前后端分离开发规范，使用Mock数据模拟后端响应。
 * @created 2025-01-21 15:30:00
 * @updated 2025-01-21 15:30:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { CollectionApplicationService } from '@application/services/CollectionApplicationService'
import { Button } from '@components/atoms'
import { CollectionMovieList } from '@components/domains/collection'
import type { PaginationConfig } from '@components/domains/collection'
import { BaseSection } from '@components/domains/shared'
import { NavigationHeader } from '@components/organisms'
import type { CollectionItem } from '@types-movie'
import type { BaseMovieItem } from '@types-movie'
import { cn } from '@utils/cn'
import React, { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

// 合集详情页面组件属性接口，定义页面组件的配置选项
interface CollectionDetailPageProps {
  className?: string // 自定义CSS类名
}

// 合集详情页面组件，展示特定合集包含的影片列表，提供完整的浏览和导航功能
const CollectionDetailPage: React.FC<CollectionDetailPageProps> = ({
  className,
}) => {
  const { collectionId } = useParams<{ collectionId: string }>()
  const navigate = useNavigate()
  
  // 应用服务实例 - 使用CollectionApplicationService获取数据
  const collectionService = useMemo(() => new CollectionApplicationService(), [])
  
  // 状态管理
  const [currentPage, setCurrentPage] = useState(1)
  const [collectionDetail, setCollectionDetail] = useState<CollectionItem | null>(null)
  const [movies, setMovies] = useState<BaseMovieItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const pageSize = 24 // 每页显示24部影片，符合设计稿的6x4网格布局

  // 获取合集详情数据
  useEffect(() => {
    const fetchCollectionDetail = async () => {
      if (!collectionId) return
      
      try {
        setLoading(true)
        setError(null)
        const detail = await collectionService.getCollectionDetail(collectionId)
        setCollectionDetail(detail)
      } catch (err) {
        console.error('获取合集详情失败:', err)
        setError('获取合集详情失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    fetchCollectionDetail()
  }, [collectionId, collectionService])

  // 获取合集影片列表数据
  useEffect(() => {
    const fetchMovies = async () => {
      if (!collectionId) return
      
      try {
        setLoading(true)
        setError(null)
        const response = await collectionService.getCollectionMovies(collectionId, {
          page: currentPage,
          pageSize,
          sortBy: 'year',
          sortOrder: 'desc',
        })
        setMovies(response.items)
      } catch (err) {
        console.error('获取影片列表失败:', err)
        setError('获取影片列表失败，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [collectionId, currentPage, pageSize, collectionService])

  // 分页配置 - 基于真实数据的分页功能
  const paginationConfig: PaginationConfig = useMemo(() => {
    if (!collectionDetail) {
      return {
        currentPage: 1,
        totalPages: 1,
        pageSize,
        total: 0,
        onPageChange: () => {},
      }
    }

    return {
      currentPage,
      totalPages: Math.ceil((collectionDetail.movieIds?.length || 0) / pageSize),
      pageSize,
      total: collectionDetail.movieIds?.length || 0,
      onPageChange: (page: number) => {
        setCurrentPage(page)
        // 滚动到页面顶部，提供更好的用户体验
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
    }
  }, [collectionDetail, currentPage, pageSize])

  // 影片点击处理 - 导航到影片详情页面
  const handleMovieClick = (movie: BaseMovieItem) => {
    navigate(`/movie/${movie.id}`)
  }

  // 返回按钮点击处理 - 导航回合集列表页面
  const handleGoBack = () => {
    navigate(-1) // 返回上一页
  }

  // 页面容器样式类 - 统一的页面布局样式
  const pageClasses = cn('min-h-screen bg-gray-50', className)

  // 渲染加载状态
  if (loading) {
    return (
      <div className={cn('min-h-screen bg-gray-50', className)}>
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">正在加载合集详情...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 渲染错误状态
  if (error || !collectionDetail) {
    return (
      <div className={cn('min-h-screen bg-gray-50', className)}>
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">加载失败</h2>
              <p className="text-gray-600 mb-4">{error || '合集不存在或已被删除'}</p>
              <Button 
                onClick={() => navigate(-1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                返回上一页
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* 导航头部 */}
      <NavigationHeader />
      
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮和面包屑导航 */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg">←</span>
            返回
          </Button>
          <nav className="text-sm text-gray-600">
            <span>首页</span>
            <span className="mx-2">/</span>
            <span>专题合集</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{collectionDetail.title}</span>
          </nav>
        </div>

        {/* 合集信息区域 */}
        <BaseSection
          title="合集信息"
          className="mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* 合集封面 */}
              <div className="flex-shrink-0">
                <img
                  src={collectionDetail.imageUrl}
                  alt={collectionDetail.alt || collectionDetail.title}
                  className="w-48 h-72 object-cover rounded-lg shadow-md"
                />
              </div>
              
              {/* 合集详情 */}
              <div className="flex-1">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    <span className="text-gray-900 font-medium">{collectionDetail.title}</span>
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>合集ID: {collectionDetail.id}</span>
                    <span>•</span>
                    <span className="text-blue-600 font-medium">
                      {collectionDetail.title}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {collectionDetail.description || '暂无描述'}
                  </p>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span>
                    共 {movies.length} 部影片
                  </span>
                  <span>•</span>
                  <span>
                    浏览量: {Math.floor(Math.random() * 10000)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BaseSection>

        {/* 影片列表区域 */}
        <BaseSection
          title="影片列表"
          className="mb-8"
        >
          <CollectionMovieList
            movies={movies}
            pagination={paginationConfig}
            onMovieClick={handleMovieClick}
            showPagination={true}
            loading={loading}
            className="mt-6"
          />
        </BaseSection>
      </div>
    </div>
  )
}

export default CollectionDetailPage