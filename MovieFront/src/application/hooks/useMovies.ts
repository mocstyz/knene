import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_KEYS, createQueryOptions } from '../services/queryClient'
import { useMovieStore, type Movie, type MovieFilters } from '../stores'

// 影片API服务
const movieApi = {
  // 获取影片列表
  getMovies: async (page = 1, filters?: MovieFilters): Promise<{ movies: Movie[]; totalPages: number }> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockMovies = useMovieStore.getState().movies
    const filteredMovies = mockMovies.filter(movie => {
      if (filters?.genre && !movie.genres.includes(filters.genre)) return false
      if (filters?.year && movie.year !== filters.year) return false
      if (filters?.rating && movie.rating < filters.rating) return false
      return true
    })
    
    const pageSize = 12
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    
    return {
      movies: filteredMovies.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredMovies.length / pageSize)
    }
  },

  // 获取推荐影片
  getFeaturedMovies: async (): Promise<Movie[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return useMovieStore.getState().movies.slice(0, 6)
  },

  // 获取影片详情
  getMovieDetail: async (id: string): Promise<Movie> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    const movie = useMovieStore.getState().movies.find(m => m.id === id)
    if (!movie) {
      throw new Error('影片不存在')
    }
    return movie
  },

  // 搜索影片
  searchMovies: async (query: string, _filters?: MovieFilters): Promise<Movie[]> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    const movies = useMovieStore.getState().movies
    return movies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.description.toLowerCase().includes(query.toLowerCase())
    )
  },

  // 获取影片分类
  getCategories: async (): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return ['动作', '喜剧', '剧情', '科幻', '恐怖', '爱情', '悬疑', '动画']
  },

  // 获取推荐影片（基于用户）
  getRecommendations: async (_userId?: string): Promise<Movie[]> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    const movies = useMovieStore.getState().movies
    // 简单的推荐逻辑：返回评分最高的影片
    return movies.sort((a, b) => b.rating - a.rating).slice(0, 8)
  }
}

// 获取影片列表
export const useMovies = (page = 1, filters?: MovieFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.MOVIES.LIST(page, filters),
    queryFn: () => movieApi.getMovies(page, filters),
    ...createQueryOptions.user
  })
}

// 获取推荐影片
export const useFeaturedMovies = () => {
  return useQuery({
    queryKey: QUERY_KEYS.MOVIES.FEATURED,
    queryFn: movieApi.getFeaturedMovies,
    ...createQueryOptions.user
  })
}

// 获取影片详情
export const useMovieDetail = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MOVIES.DETAIL(id),
    queryFn: () => movieApi.getMovieDetail(id),
    enabled: !!id,
    ...createQueryOptions.user
  })
}

// 搜索影片
export const useMovieSearch = (query: string, filters?: MovieFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.MOVIES.SEARCH(query, filters),
    queryFn: () => movieApi.searchMovies(query, filters),
    enabled: query.length > 0,
    ...createQueryOptions.user
  })
}

// 获取影片分类
export const useMovieCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.MOVIES.CATEGORIES,
    queryFn: movieApi.getCategories,
    ...createQueryOptions.static
  })
}

// 获取推荐影片
export const useMovieRecommendations = (userId?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MOVIES.RECOMMENDATIONS(userId),
    queryFn: () => movieApi.getRecommendations(userId),
    enabled: !!userId,
    ...createQueryOptions.user
  })
}

// 收藏/取消收藏影片
export const useFavoriteMovie = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ movieId, isFavorite }: { movieId: string; isFavorite: boolean }) => {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (isFavorite) {
        useMovieStore.getState().addToFavorites(movieId)
      } else {
        useMovieStore.getState().removeFromFavorites(movieId)
      }
      
      return { movieId, isFavorite }
    },
    onSuccess: () => {
      // 更新收藏列表缓存
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES.LIST })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MOVIES.LIST() })
    }
  })
}

// 添加到最近观看
export const useAddToRecentlyViewed = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (movieId: string) => {
      await new Promise(resolve => setTimeout(resolve, 200))
      useMovieStore.getState().addToRecentlyViewed(movieId)
      return movieId
    },
    onSuccess: () => {
      // 更新最近观看缓存
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RECENTLY_VIEWED.LIST })
    }
  })
}

// 预取影片详情
export const usePrefetchMovieDetail = () => {
  const queryClient = useQueryClient()
  
  return (movieId: string) => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.MOVIES.DETAIL(movieId),
      queryFn: () => movieApi.getMovieDetail(movieId),
      ...createQueryOptions.user
    })
  }
}

// 无限滚动影片列表
export const useInfiniteMovies = (filters?: MovieFilters) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.MOVIES.INFINITE(filters),
    queryFn: ({ pageParam = 1 }) => movieApi.getMovies(pageParam, filters),
    getNextPageParam: (lastPage: any, pages: any) => {
      return pages.length < lastPage.totalPages ? pages.length + 1 : undefined
    },
    initialPageParam: 1,
    ...createQueryOptions.user
  })
}