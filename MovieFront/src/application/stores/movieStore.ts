import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// 影片接口
export interface Movie {
  id: string
  title: string
  description: string
  poster: string
  backdrop?: string
  genres: string[]
  rating: number
  year: number
  duration: number
  director?: string
  actors?: string[]
  qualities?: string[] // 支持的画质列表
  views?: number // 观看次数
  quality?: 'HD' | '4K' | 'BluRay' | 'WebRip'
  size?: string
  downloadCount?: number
  releaseDate?: Date
  country?: string
  language?: string
  subtitles?: string[]
  trailerUrl?: string
  imdbId?: string
  tmdbId?: string
}

// 搜索过滤器
export interface MovieFilters {
  genre?: string
  year?: number
  rating?: number
  quality?: string
  language?: string
  sortBy?: 'title' | 'year' | 'rating' | 'downloadCount' | 'releaseDate'
  sortOrder?: 'asc' | 'desc'
}

// 影片状态管理接口
interface MovieState {
  // 状态
  movies: Movie[]
  featuredMovies: Movie[]
  searchResults: Movie[]
  favoriteMovies: Movie[]
  recentlyViewed: Movie[]
  categories: string[]
  
  // 分页和加载状态
  currentPage: number
  totalPages: number
  isLoading: boolean
  isSearching: boolean
  error: string | null
  
  // 搜索和过滤
  searchQuery: string
  filters: MovieFilters
  
  // 操作
  fetchMovies: (page?: number) => Promise<void>
  fetchFeaturedMovies: () => Promise<void>
  searchMovies: (query: string, filters?: MovieFilters) => Promise<void>
  getMovieById: (id: string) => Movie | undefined
  addToFavorites: (movieId: string) => void
  removeFromFavorites: (movieId: string) => void
  addToRecentlyViewed: (movieId: string) => void
  setFilters: (filters: Partial<MovieFilters>) => void
  clearSearch: () => void
  clearError: () => void
}

// 模拟影片数据
const mockMovies: Movie[] = [
  {
    id: '1',
    title: '阿凡达：水之道',
    description: '杰克·萨利一家在潘多拉星球上的新冒险，面临新的威胁和挑战。',
    poster: 'https://via.placeholder.com/300x450/0066cc/ffffff?text=Avatar+2',
    backdrop: 'https://via.placeholder.com/1920x1080/0066cc/ffffff?text=Avatar+2+Backdrop',
    genres: ['科幻', '冒险', '动作'],
    rating: 8.5,
    year: 2022,
    duration: 192,
    director: '詹姆斯·卡梅隆',
    actors: ['萨姆·沃辛顿', '佐伊·索尔达娜', '西格妮·韦弗'],
    quality: '4K',
    size: '15.2GB',
    downloadCount: 125000,
    country: '美国',
    language: '英语',
    subtitles: ['中文', '英文']
  },
  {
    id: '2',
    title: '流浪地球2',
    description: '人类为拯救地球而进行的壮烈斗争，展现了中国科幻电影的新高度。',
    poster: 'https://via.placeholder.com/300x450/cc6600/ffffff?text=Wandering+Earth+2',
    backdrop: 'https://via.placeholder.com/1920x1080/cc6600/ffffff?text=Wandering+Earth+2+Backdrop',
    genres: ['科幻', '灾难', '动作'],
    rating: 8.3,
    year: 2023,
    duration: 173,
    director: '郭帆',
    actors: ['吴京', '刘德华', '李雪健'],
    quality: 'BluRay',
    size: '12.8GB',
    downloadCount: 98000,
    country: '中国',
    language: '中文',
    subtitles: ['中文', '英文']
  },
  {
    id: '3',
    title: '蜘蛛侠：纵横宇宙',
    description: '迈尔斯·莫拉莱斯的多元宇宙冒险，视觉效果令人惊叹的动画杰作。',
    poster: 'https://via.placeholder.com/300x450/cc0066/ffffff?text=Spider-Verse',
    backdrop: 'https://via.placeholder.com/1920x1080/cc0066/ffffff?text=Spider-Verse+Backdrop',
    genres: ['动画', '动作', '冒险'],
    rating: 9.1,
    year: 2023,
    duration: 140,
    director: '华金·多斯·桑托斯',
    actors: ['沙梅克·摩尔', '海莉·斯坦菲尔德', '布莱恩·泰里·亨利'],
    quality: 'HD',
    size: '8.5GB',
    downloadCount: 156000,
    country: '美国',
    language: '英语',
    subtitles: ['中文', '英文', '西班牙文']
  }
]

// 创建影片状态管理store
export const useMovieStore = create<MovieState>()(
  devtools(
    (set, get) => ({
      // 初始状态
      movies: [],
      featuredMovies: [],
      searchResults: [],
      favoriteMovies: [],
      recentlyViewed: [],
      categories: ['动作', '科幻', '喜剧', '剧情', '恐怖', '动画', '冒险', '犯罪', '纪录片', '家庭'],
      
      currentPage: 1,
      totalPages: 1,
      isLoading: false,
      isSearching: false,
      error: null,
      
      searchQuery: '',
      filters: {},

      // 获取影片列表
      fetchMovies: async (page = 1) => {
        set({ isLoading: true, error: null })
        
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 800))
          
          // 模拟分页数据
          const pageSize = 12
          const startIndex = (page - 1) * pageSize
          const endIndex = startIndex + pageSize
          const paginatedMovies = mockMovies.slice(startIndex, endIndex)
          
          set({
            movies: page === 1 ? paginatedMovies : [...get().movies, ...paginatedMovies],
            currentPage: page,
            totalPages: Math.ceil(mockMovies.length / pageSize),
            isLoading: false
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '获取影片失败'
          })
        }
      },

      // 获取推荐影片
      fetchFeaturedMovies: async () => {
        set({ isLoading: true, error: null })
        
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 600))
          
          // 获取评分最高的影片作为推荐
          const featured = [...mockMovies]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6)
          
          set({
            featuredMovies: featured,
            isLoading: false
          })
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : '获取推荐影片失败'
          })
        }
      },

      // 搜索影片
      searchMovies: async (query: string, filters?: MovieFilters) => {
        set({ isSearching: true, error: null, searchQuery: query })
        
        try {
          // 模拟API调用
          await new Promise(resolve => setTimeout(resolve, 500))
          
          let results = mockMovies.filter(movie =>
            movie.title.toLowerCase().includes(query.toLowerCase()) ||
            movie.description.toLowerCase().includes(query.toLowerCase()) ||
            movie.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
          )

          // 应用过滤器
          if (filters) {
            if (filters.genre) {
              results = results.filter(movie => movie.genres.includes(filters.genre!))
            }
            if (filters.year) {
              results = results.filter(movie => movie.year === filters.year)
            }
            if (filters.rating) {
              results = results.filter(movie => movie.rating >= filters.rating!)
            }
            if (filters.quality) {
              results = results.filter(movie => movie.quality === filters.quality)
            }

            // 排序
            if (filters.sortBy) {
              results.sort((a, b) => {
                const aValue = a[filters.sortBy!]
                const bValue = b[filters.sortBy!]
                const order = filters.sortOrder === 'desc' ? -1 : 1
                
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                  return aValue.localeCompare(bValue) * order
                }
                return ((aValue as number) - (bValue as number)) * order
              })
            }
          }
          
          set({
            searchResults: results,
            isSearching: false,
            filters: filters || {}
          })
        } catch (error) {
          set({
            isSearching: false,
            error: error instanceof Error ? error.message : '搜索失败'
          })
        }
      },

      // 根据ID获取影片
      getMovieById: (id: string) => {
        const { movies, featuredMovies, searchResults } = get()
        return [...movies, ...featuredMovies, ...searchResults].find(movie => movie.id === id)
      },

      // 添加到收藏
      addToFavorites: (movieId: string) => {
        const movie = get().getMovieById(movieId)
        if (movie && !get().favoriteMovies.find(fav => fav.id === movieId)) {
          set(state => ({
            favoriteMovies: [...state.favoriteMovies, movie]
          }))
        }
      },

      // 从收藏中移除
      removeFromFavorites: (movieId: string) => {
        set(state => ({
          favoriteMovies: state.favoriteMovies.filter(movie => movie.id !== movieId)
        }))
      },

      // 添加到最近观看
      addToRecentlyViewed: (movieId: string) => {
        const movie = get().getMovieById(movieId)
        if (movie) {
          set(state => {
            const filtered = state.recentlyViewed.filter(item => item.id !== movieId)
            return {
              recentlyViewed: [movie, ...filtered].slice(0, 20) // 最多保存20个
            }
          })
        }
      },

      // 设置过滤器
      setFilters: (filters: Partial<MovieFilters>) => {
        set(state => ({
          filters: { ...state.filters, ...filters }
        }))
      },

      // 清除搜索
      clearSearch: () => {
        set({
          searchQuery: '',
          searchResults: [],
          filters: {}
        })
      },

      // 清除错误
      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'movie-store'
    }
  )
)

// 选择器函数
export const selectMovies = (state: MovieState) => state.movies
export const selectFeaturedMovies = (state: MovieState) => state.featuredMovies
export const selectSearchResults = (state: MovieState) => state.searchResults
export const selectFavoriteMovies = (state: MovieState) => state.favoriteMovies
export const selectIsLoading = (state: MovieState) => state.isLoading
export const selectSearchQuery = (state: MovieState) => state.searchQuery