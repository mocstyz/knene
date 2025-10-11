/**
 * @fileoverview 影片相关Hooks - 基于TanStack Query的服务端状态管理
 * @description 处理影片列表、详情、搜索等服务端状态
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

// 查询键常量
export const MOVIE_QUERY_KEYS = {
  LIST: (page = 1, filters?: MovieFilters) =>
    ['movies', 'list', page, filters] as const,
  DETAIL: (id: string) => ['movies', 'detail', id] as const,
  SEARCH: (query: string, filters?: MovieFilters) =>
    ['movies', 'search', query, filters] as const,
  FEATURED: () => ['movies', 'featured'] as const,
  CATEGORIES: () => ['movies', 'categories'] as const,
  RECOMMENDATIONS: (userId?: string) =>
    ['movies', 'recommendations', userId] as const,
  RELATED: (movieId: string) => ['movies', 'related', movieId] as const,
  POPULAR: (period: string) => ['movies', 'popular', period] as const,
  LATEST: () => ['movies', 'latest'] as const,
  INFINITE: (filters?: MovieFilters) =>
    ['movies', 'infinite', filters] as const,
  FAVORITES: () => ['user', 'favorites'] as const,
  RECENTLY_VIEWED: () => ['user', 'recently-viewed'] as const,
} as const

// 获取影片列表
export const useMovies = (page = 1, filters?: MovieFilters) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.LIST(page, filters),
    queryFn: () => MovieApiService.getMovies(page, filters),
    staleTime: 2 * 60 * 1000, // 2分钟
    gcTime: 5 * 60 * 1000, // 5分钟
  })
}

// 获取推荐影片
export const useFeaturedMovies = () => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.FEATURED(),
    queryFn: () => MovieApiService.getFeaturedMovies(),
    staleTime: 10 * 60 * 1000, // 10分钟
    gcTime: 30 * 60 * 1000, // 30分钟
  })
}

// 获取影片详情
export const useMovieDetail = (id: string) => {
  const addToRecentlyViewed = useMovieClientStore(
    state => state.addToRecentlyViewed
  )

  const query = useQuery({
    queryKey: MOVIE_QUERY_KEYS.DETAIL(id),
    queryFn: () => MovieApiService.getMovieDetail(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 10 * 60 * 1000, // 10分钟
  })

  // 使用effect处理副作用
  useEffect(() => {
    if (query.data) {
      addToRecentlyViewed(query.data.id)
    }
  }, [query.data, addToRecentlyViewed])

  return query
}

// 搜索影片
export const useMovieSearch = (query: string, filters?: MovieFilters) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.SEARCH(query, filters),
    queryFn: () => MovieApiService.searchMovies({ query, filters }),
    enabled: query.length > 0,
    staleTime: 1 * 60 * 1000, // 1分钟
    gcTime: 5 * 60 * 1000, // 5分钟
  })
}

// 获取影片分类
export const useMovieCategories = () => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.CATEGORIES(),
    queryFn: () => MovieApiService.getCategories(),
    staleTime: 60 * 60 * 1000, // 1小时
    gcTime: 24 * 60 * 60 * 1000, // 24小时
  })
}

// 获取推荐影片
export const useMovieRecommendations = (userId?: string) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.RECOMMENDATIONS(userId),
    queryFn: () => MovieApiService.getRecommendations(userId),
    enabled: !!userId,
    staleTime: 15 * 60 * 1000, // 15分钟
    gcTime: 30 * 60 * 1000, // 30分钟
  })
}

// 获取相关影片
export const useRelatedMovies = (movieId: string) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.RELATED(movieId),
    queryFn: () => MovieApiService.getRelatedMovies(movieId),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000, // 10分钟
    gcTime: 30 * 60 * 1000, // 30分钟
  })
}

// 获取热门影片
export const usePopularMovies = (period: 'day' | 'week' | 'month' = 'week') => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.POPULAR(period),
    queryFn: () => MovieApiService.getPopularMovies(period),
    staleTime: 30 * 60 * 1000, // 30分钟
    gcTime: 2 * 60 * 60 * 1000, // 2小时
  })
}

// 获取最新影片
export const useLatestMovies = () => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.LATEST(),
    queryFn: () => MovieApiService.getLatestMovies(),
    staleTime: 20 * 60 * 1000, // 20分钟
    gcTime: 60 * 60 * 1000, // 1小时
  })
}

// 收藏/取消收藏影片
export const useFavoriteMovie = () => {
  const queryClient = useQueryClient()
  const { addToFavorites, removeFromFavorites } = useMovieClientStore()

  return useMutation({
    mutationFn: async ({
      movieId,
      isFavorite,
    }: {
      movieId: string
      isFavorite: boolean
    }) => {
      await new Promise(resolve => setTimeout(resolve, 500))

      // 更新客户端状态
      if (isFavorite) {
        addToFavorites(movieId)
      } else {
        removeFromFavorites(movieId)
      }

      return { movieId, isFavorite }
    },
    onSuccess: () => {
      // 更新相关查询缓存
      queryClient.invalidateQueries({ queryKey: MOVIE_QUERY_KEYS.FAVORITES() })
    },
  })
}

// 添加到最近观看
export const useAddToRecentlyViewed = () => {
  const queryClient = useQueryClient()
  const addToRecentlyViewed = useMovieClientStore(
    state => state.addToRecentlyViewed
  )

  return useMutation({
    mutationFn: async (movieId: string) => {
      await new Promise(resolve => setTimeout(resolve, 200))

      // 更新客户端状态
      addToRecentlyViewed(movieId)

      return movieId
    },
    onSuccess: () => {
      // 更新最近观看缓存
      queryClient.invalidateQueries({
        queryKey: MOVIE_QUERY_KEYS.RECENTLY_VIEWED(),
      })
    },
  })
}

// 评分影片
export const useRateMovie = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      movieId,
      rating,
    }: {
      movieId: string
      rating: number
    }) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      // 在实际应用中，这里会调用MovieApi.rateMovie
      console.log(`影片 ${movieId} 评分: ${rating}`)
      return { movieId, rating }
    },
    onSuccess: () => {
      // 更新相关查询缓存
      queryClient.invalidateQueries({ queryKey: ['movies'] })
    },
  })
}

// 预取影片详情
export const usePrefetchMovieDetail = () => {
  const queryClient = useQueryClient()

  return (movieId: string) => {
    queryClient.prefetchQuery({
      queryKey: MOVIE_QUERY_KEYS.DETAIL(movieId),
      queryFn: () => MovieApiService.getMovieDetail(movieId),
      staleTime: 5 * 60 * 1000,
    })
  }
}

// 无限滚动影片列表
export const useInfiniteMovies = (filters?: MovieFilters) => {
  return useInfiniteQuery({
    queryKey: MOVIE_QUERY_KEYS.INFINITE(filters),
    queryFn: ({ pageParam = 1 }) =>
      MovieApiService.getMovies(pageParam, filters),
    getNextPageParam: (
      lastPage: PaginatedResponse<Movie>,
      allPages: Array<PaginatedResponse<Movie>>
    ) => {
      return allPages.length < lastPage.totalPages
        ? allPages.length + 1
        : undefined
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2分钟
    gcTime: 5 * 60 * 1000, // 5分钟
  })
}

// 获取用户收藏列表
export const useFavoriteMovies = () => {
  const favoriteMovieIds = useMovieClientStore(state => state.favoriteMovieIds)

  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.FAVORITES(),
    queryFn: async () => {
      // 在实际应用中，这里会调用API获取收藏列表
      // 现在基于客户端收藏ID列表获取详细信息
      const movies = await Promise.all(
        favoriteMovieIds.map(id => MovieApiService.getMovieDetail(id))
      )
      return movies
    },
    enabled: favoriteMovieIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 10 * 60 * 1000, // 10分钟
  })
}

// 获取最近观看列表
export const useRecentlyViewedMovies = () => {
  const getRecentlyViewedIds = useMovieClientStore(
    state => state.getRecentlyViewedIds
  )

  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.RECENTLY_VIEWED(),
    queryFn: async () => {
      // 基于客户端最近观看ID列表获取详细信息
      const recentIds = getRecentlyViewedIds(10) // 最多获取10个
      const movies = await Promise.all(
        recentIds.map(id => MovieApiService.getMovieDetail(id))
      )
      return movies
    },
    enabled: getRecentlyViewedIds(10).length > 0,
    staleTime: 1 * 60 * 1000, // 1分钟
    gcTime: 5 * 60 * 1000, // 5分钟
  })
}
