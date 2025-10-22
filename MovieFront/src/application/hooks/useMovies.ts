/**
 * @fileoverview 影片管理相关Hooks - 基于TanStack Query的影片数据状态管理
 * @description 提供完整的影片功能，包括列表查询、详情获取、搜索、分类、推荐等服务端状态管理。
 * 遵循DDD架构原则，作为应用层Hook协调影片领域的业务逻辑。
 * 集成TanStack Query实现数据缓存、预取、无限滚动等高级功能。
 * 
 * @author mosctz
 * @version 1.4.0
 */

import { type Movie, type MovieFilters } from '@application/stores/movieStore'
import { useMovieClientStore } from '@application/stores/movieStore'
import {
  MovieApiService,
  type PaginatedResponse,
} from '@infrastructure/api/movieApi'
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { useEffect } from 'react'

// 影片查询键常量配置 - 定义所有影片相关查询的键值，确保缓存一致性和查询唯一性
export const MOVIE_QUERY_KEYS = {
  // 影片列表查询键
  LIST: (page = 1, filters?: MovieFilters) =>
    ['movies', 'list', page, filters] as const,
  // 影片详情查询键
  DETAIL: (id: string) => ['movies', 'detail', id] as const,
  // 影片搜索查询键
  SEARCH: (query: string, filters?: MovieFilters) =>
    ['movies', 'search', query, filters] as const,
  // 推荐影片查询键
  FEATURED: () => ['movies', 'featured'] as const,
  // 影片分类查询键
  CATEGORIES: () => ['movies', 'categories'] as const,
  // 个性化推荐查询键
  RECOMMENDATIONS: (userId?: string) =>
    ['movies', 'recommendations', userId] as const,
  // 相关影片查询键
  RELATED: (movieId: string) => ['movies', 'related', movieId] as const,
  // 热门影片查询键
  POPULAR: (period: string) => ['movies', 'popular', period] as const,
  // 最新影片查询键
  LATEST: () => ['movies', 'latest'] as const,
  // 无限滚动查询键
  INFINITE: (filters?: MovieFilters) =>
    ['movies', 'infinite', filters] as const,
  // 用户收藏查询键
  FAVORITES: () => ['user', 'favorites'] as const,
  // 最近观看查询键
  RECENTLY_VIEWED: () => ['user', 'recently-viewed'] as const,
} as const

// 获取影片列表Hook - 提供分页的影片列表数据，支持筛选条件和缓存管理
export const useMovies = (page = 1, filters?: MovieFilters) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.LIST(page, filters),
    queryFn: () => MovieApiService.getMovies(page, filters),
    staleTime: 2 * 60 * 1000, // 缓存策略 - 2分钟内数据保持新鲜
    gcTime: 5 * 60 * 1000, // 垃圾回收 - 5分钟后清理未使用缓存
  })
}

// 获取推荐影片Hook - 提供首页推荐的精选影片列表，使用较长的缓存时间
export const useFeaturedMovies = () => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.FEATURED(),
    queryFn: () => MovieApiService.getFeaturedMovies(),
    staleTime: 10 * 60 * 1000, // 缓存策略 - 10分钟内数据保持新鲜
    gcTime: 30 * 60 * 1000, // 垃圾回收 - 30分钟后清理未使用缓存
  })
}

// 获取影片详情Hook - 提供单个影片的详细信息，包含自动添加到最近观看的副作用
export const useMovieDetail = (id: string) => {
  const addToRecentlyViewed = useMovieClientStore(
    state => state.addToRecentlyViewed
  )

  const query = useQuery({
    queryKey: MOVIE_QUERY_KEYS.DETAIL(id),
    queryFn: () => MovieApiService.getMovieDetail(id),
    enabled: !!id, // 防御性检查 - 仅在有影片ID时启用查询
    staleTime: 5 * 60 * 1000, // 缓存策略 - 5分钟内数据保持新鲜
    gcTime: 10 * 60 * 1000, // 垃圾回收 - 10分钟后清理未使用缓存
  })

  // 副作用处理 - 自动添加到最近观看历史
  useEffect(() => {
    if (query.data) {
      addToRecentlyViewed(query.data.id)
    }
  }, [query.data, addToRecentlyViewed])

  return query
}

// 搜索影片Hook - 提供影片搜索功能，支持关键词和筛选条件
export const useMovieSearch = (query: string, filters?: MovieFilters) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.SEARCH(query, filters),
    queryFn: () => MovieApiService.searchMovies({ query, filters }),
    enabled: query.length > 0, // 条件启用 - 仅在有搜索关键词时执行
    staleTime: 1 * 60 * 1000, // 缓存策略 - 1分钟内数据保持新鲜
    gcTime: 5 * 60 * 1000, // 垃圾回收 - 5分钟后清理未使用缓存
  })
}

// 获取影片分类Hook - 提供影片分类列表，分类数据变更频率极低，使用长时间缓存
export const useMovieCategories = () => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.CATEGORIES(),
    queryFn: () => MovieApiService.getCategories(),
    staleTime: 60 * 60 * 1000, // 缓存策略 - 1小时内数据保持新鲜
    gcTime: 24 * 60 * 60 * 1000, // 垃圾回收 - 24小时后清理未使用缓存
  })
}

// 获取个性化推荐影片Hook - 基于用户偏好提供个性化推荐，需要用户ID才能启用
export const useMovieRecommendations = (userId?: string) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.RECOMMENDATIONS(userId),
    queryFn: () => MovieApiService.getRecommendations(userId),
    enabled: !!userId, // 条件启用 - 仅在有用户ID时执行
    staleTime: 15 * 60 * 1000, // 缓存策略 - 15分钟内数据保持新鲜
    gcTime: 30 * 60 * 1000, // 垃圾回收 - 30分钟后清理未使用缓存
  })
}

// 获取相关影片Hook - 基于指定影片提供相关推荐，用于影片详情页的推荐区域
export const useRelatedMovies = (movieId: string) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.RELATED(movieId),
    queryFn: () => MovieApiService.getRelatedMovies(movieId),
    enabled: !!movieId, // 条件启用 - 仅在有影片ID时执行
    staleTime: 10 * 60 * 1000, // 缓存策略 - 10分钟内数据保持新鲜
    gcTime: 30 * 60 * 1000, // 垃圾回收 - 30分钟后清理未使用缓存
  })
}

// 获取热门影片Hook - 提供指定时间段的热门影片排行，支持日、周、月三种统计周期
export const usePopularMovies = (period: 'day' | 'week' | 'month' = 'week') => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.POPULAR(period),
    queryFn: () => MovieApiService.getTopRatedMovies(period),
    staleTime: 30 * 60 * 1000, // 缓存策略 - 30分钟内数据保持新鲜
    gcTime: 2 * 60 * 60 * 1000, // 垃圾回收 - 2小时后清理未使用缓存
  })
}

// 获取最新影片Hook - 提供最新上映或上线的影片列表，更新频率适中
export const useLatestMovies = () => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.LATEST(),
    queryFn: () => MovieApiService.getLatestMovies(),
    staleTime: 20 * 60 * 1000, // 缓存策略 - 20分钟内数据保持新鲜
    gcTime: 60 * 60 * 1000, // 垃圾回收 - 1小时后清理未使用缓存
  })
}

// 收藏/取消收藏影片Hook - 处理用户收藏操作，支持添加和移除收藏
export const useFavoriteMovie = () => {
  const queryClient = useQueryClient()
  const { addToFavorites, removeFromFavorites } = useMovieClientStore()

  return useMutation({
    mutationFn: async ({
      movieId,
      isFavorite,
    }: {
      movieId: string // 影片ID
      isFavorite: boolean // 是否收藏
    }) => {
      // 模拟网络延迟 - 实际项目中应替换为真实API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      // 客户端状态更新 - 立即更新本地收藏状态
      if (isFavorite) {
        addToFavorites(movieId)
      } else {
        removeFromFavorites(movieId)
      }

      return { movieId, isFavorite }
    },
    onSuccess: () => {
      // 缓存更新 - 刷新收藏列表查询缓存
      queryClient.invalidateQueries({ queryKey: MOVIE_QUERY_KEYS.FAVORITES() })
    },
  })
}

// 添加到最近观看Hook - 手动添加影片到最近观看历史，用于特殊场景的观看记录
export const useAddToRecentlyViewed = () => {
  const queryClient = useQueryClient()
  const addToRecentlyViewed = useMovieClientStore(
    state => state.addToRecentlyViewed
  )

  return useMutation({
    mutationFn: async (movieId: string) => {
      // 模拟网络延迟 - 实际项目中可能需要同步到服务端
      await new Promise(resolve => setTimeout(resolve, 200))

      // 客户端状态更新 - 添加到最近观看历史
      addToRecentlyViewed(movieId)

      return movieId
    },
    onSuccess: () => {
      // 缓存更新 - 刷新最近观看列表缓存
      queryClient.invalidateQueries({
        queryKey: MOVIE_QUERY_KEYS.RECENTLY_VIEWED(),
      })
    },
  })
}

// 评分影片Hook - 处理用户对影片的评分操作，支持1-10分评分
export const useRateMovie = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      movieId,
      rating,
    }: {
      movieId: string // 影片ID
      rating: number // 评分值（1-10）
    }) => {
      // 模拟网络延迟 - 实际项目中应替换为真实API调用
      await new Promise(resolve => setTimeout(resolve, 300))
      // TODO: 实际项目中调用 MovieApiService.rateMovie(movieId, rating)
      console.log(`影片 ${movieId} 评分: ${rating}`)
      return { movieId, rating }
    },
    onSuccess: () => {
      // 缓存更新 - 刷新所有影片相关查询缓存
      queryClient.invalidateQueries({ queryKey: ['movies'] })
    },
  })
}

// 预取影片详情Hook - 提供影片详情的预取功能，用于优化用户体验
export const usePrefetchMovieDetail = () => {
  const queryClient = useQueryClient()

  return (movieId: string) => {
    queryClient.prefetchQuery({
      queryKey: MOVIE_QUERY_KEYS.DETAIL(movieId),
      queryFn: () => MovieApiService.getMovieDetail(movieId),
      staleTime: 5 * 60 * 1000, // 预取数据保持5分钟新鲜
    })
  }
}

// 无限滚动影片列表Hook - 提供无限滚动的影片列表，支持筛选条件
export const useInfiniteMovies = (filters?: MovieFilters) => {
  return useInfiniteQuery({
    queryKey: MOVIE_QUERY_KEYS.INFINITE(filters),
    queryFn: ({ pageParam = 1 }) =>
      MovieApiService.getMovies(pageParam, filters),
    getNextPageParam: (
      lastPage: PaginatedResponse<Movie>,
      allPages: Array<PaginatedResponse<Movie>>
    ) => {
      // 分页逻辑 - 判断是否还有下一页数据
      return allPages.length < lastPage.totalPages
        ? allPages.length + 1
        : undefined
    },
    initialPageParam: 1, // 初始页码参数
    staleTime: 2 * 60 * 1000, // 缓存策略 - 2分钟内数据保持新鲜
    gcTime: 5 * 60 * 1000, // 垃圾回收 - 5分钟后清理未使用缓存
  })
}

// 获取用户收藏列表Hook - 基于客户端收藏ID列表获取完整的收藏影片信息
export const useFavoriteMovies = () => {
  const favoriteMovieIds = useMovieClientStore(state => state.favoriteMovieIds)

  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.FAVORITES(),
    queryFn: async () => {
      // 批量获取收藏影片详情 - 基于客户端收藏ID列表
      // TODO: 实际项目中应调用专门的收藏列表API
      const movies = await Promise.all(
        favoriteMovieIds.map(id => MovieApiService.getMovieDetail(id))
      )
      return movies
    },
    enabled: favoriteMovieIds.length > 0, // 条件启用 - 仅在有收藏时执行
    staleTime: 5 * 60 * 1000, // 缓存策略 - 5分钟内数据保持新鲜
    gcTime: 10 * 60 * 1000, // 垃圾回收 - 10分钟后清理未使用缓存
  })
}

// 获取最近观看列表Hook - 基于客户端最近观看ID列表获取完整的影片信息
export const useRecentlyViewedMovies = () => {
  const getRecentlyViewedIds = useMovieClientStore(
    state => state.getRecentlyViewedIds
  )

  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.RECENTLY_VIEWED(),
    queryFn: async () => {
      // 批量获取最近观看影片详情 - 基于客户端观看历史ID列表
      const recentIds = getRecentlyViewedIds(10) // 性能优化 - 最多获取10个最近观看
      const movies = await Promise.all(
        recentIds.map(id => MovieApiService.getMovieDetail(id))
      )
      return movies
    },
    enabled: getRecentlyViewedIds(10).length > 0, // 条件启用 - 仅在有观看历史时执行
    staleTime: 1 * 60 * 1000, // 缓存策略 - 1分钟内数据保持新鲜
    gcTime: 5 * 60 * 1000, // 垃圾回收 - 5分钟后清理未使用缓存
  })
}
