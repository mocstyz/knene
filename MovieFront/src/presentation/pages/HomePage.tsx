import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCurrentUser } from '@/application/hooks'
import { Button, Icon } from '@/components/atoms'
import { SearchBox, MovieCard } from '@/components/molecules'
import { MovieList } from '@/components/organisms'
import type { Movie } from '@/application/stores'

// 模拟数据
const mockMovies: Movie[] = [
  {
    id: '1',
    title: '阿凡达：水之道',
    description: '杰克·萨利一家在潘多拉星球上的新冒险',
    poster: 'https://via.placeholder.com/300x450/0066cc/ffffff?text=Avatar+2',
    genres: ['科幻', '冒险'],
    rating: 8.5,
    year: 2022,
    duration: 192,
    director: '詹姆斯·卡梅隆'
  },
  {
    id: '2',
    title: '流浪地球2',
    description: '人类为拯救地球而进行的壮烈斗争',
    poster: 'https://via.placeholder.com/300x450/cc6600/ffffff?text=Wandering+Earth+2',
    genres: ['科幻', '灾难'],
    rating: 8.3,
    year: 2023,
    duration: 173,
    director: '郭帆'
  },
  {
    id: '3',
    title: '蜘蛛侠：纵横宇宙',
    description: '迈尔斯·莫拉莱斯的多元宇宙冒险',
    poster: 'https://via.placeholder.com/300x450/cc0066/ffffff?text=Spider-Verse',
    genres: ['动画', '动作'],
    rating: 9.1,
    year: 2023,
    duration: 140,
    director: '华金·多斯·桑托斯'
  }
]

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useCurrentUser()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [searchSuggestions] = React.useState(['复仇者联盟', '星际穿越', '盗梦空间'])
  const [loading, setLoading] = React.useState(false)

  const handleSearch = (query: string) => {
    console.log('搜索:', query)
    setLoading(true)
    // 模拟搜索延迟
    setTimeout(() => setLoading(false), 1000)
  }

  const handleMovieAction = (action: string, movieId: string) => {
    if (!isAuthenticated) {
      // 未登录用户提示登录
      alert('请先登录后再进行此操作')
      return
    }
    console.log(`${action} 影片:`, movieId)
  }

  const handleLoadMore = () => {
    console.log('加载更多影片')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icon name="film" size="sm" className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">影视资源网</h1>
            </div>

            {/* 导航菜单 */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                首页
              </Link>
              <Link to="/movie/category/action" className="text-gray-700 hover:text-blue-600 transition-colors">
                动作片
              </Link>
              <Link to="/movie/category/comedy" className="text-gray-700 hover:text-blue-600 transition-colors">
                喜剧片
              </Link>
              <Link to="/movie/category/drama" className="text-gray-700 hover:text-blue-600 transition-colors">
                剧情片
              </Link>
            </nav>

            {/* 用户操作 */}
            <div className="flex items-center gap-3">
              {isAuthenticated && user ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="secondary" size="sm">
                      <Icon name="user" size="sm" className="mr-2" />
                      {user.username}
                    </Button>
                  </Link>
                  <Link to="/user/profile">
                    <Button variant="primary" size="sm">
                      仪表板
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth/login">
                    <Button variant="secondary" size="sm">
                      登录
                    </Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button variant="primary" size="sm">
                      注册
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索区域 */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              发现精彩影片
            </h2>
            <p className="text-gray-600">
              海量高清影片资源，随时随地畅享观影体验
            </p>
            {isAuthenticated && user && (
              <p className="text-sm text-blue-600 mt-2">
                欢迎回来，{user.username}！
              </p>
            )}
          </div>

          <div className="max-w-2xl mx-auto">
            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="搜索影片、演员、导演..."
              suggestions={searchSuggestions}
              loading={loading}
            />
          </div>
        </div>

        {/* 推荐影片 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">热门推荐</h3>
            <Link to="/movie/search">
              <Button variant="secondary" size="sm">
                查看更多
                <Icon name="chevronRight" size="xs" className="ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                variant="detailed"
                onPlay={(id) => handleMovieAction('播放', id)}
                onDownload={(id) => handleMovieAction('下载', id)}
                onFavorite={(id) => handleMovieAction('收藏', id)}
                onShare={(id) => handleMovieAction('分享', id)}
              />
            ))}
          </div>
        </section>

        {/* 最新上映 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">最新上映</h3>
            <Link to="/movie/latest">
              <Button variant="secondary" size="sm">
                查看更多
                <Icon name="chevronRight" size="xs" className="ml-1" />
              </Button>
            </Link>
          </div>

          <MovieList
            movies={mockMovies}
            loading={false}
            onMoviePlay={(movieId: string) => console.log('播放影片:', movieId)}
            onLoadMore={handleLoadMore}
            variant="default"
          />
        </section>

        {/* 分类浏览 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">热门分类</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: '动作片', icon: 'zap', color: 'bg-red-500', count: 1250 },
              { name: '喜剧片', icon: 'smile', color: 'bg-yellow-500', count: 890 },
              { name: '科幻片', icon: 'cpu', color: 'bg-blue-500', count: 670 },
              { name: '爱情片', icon: 'heart', color: 'bg-pink-500', count: 540 }
            ].map((category) => (
              <Link
                key={category.name}
                to={`/movie/category/${category.name.replace('片', '')}`}
                className="group"
              >
                <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
                      <Icon name={category.icon as any} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h4>
                      <p className="text-sm text-gray-600">{category.count}部影片</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 用户专属推荐 */}
        {isAuthenticated && user && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">为您推荐</h3>
                  <p className="text-blue-100 mb-4">
                    基于您的观看历史和偏好，我们为您精选了这些影片
                  </p>
                  <Link to="/dashboard">
                    <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                      查看个人推荐
                      <Icon name="arrowRight" size="sm" className="ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="hidden md:block">
                  <Icon name="star" size="xl" className="text-yellow-300" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 未登录用户的注册引导 */}
        {!isAuthenticated && (
          <section className="mb-12">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white text-center">
              <Icon name="film" size="xl" className="mx-auto mb-4 text-green-200" />
              <h3 className="text-2xl font-bold mb-2">加入我们，享受更多功能</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                注册账户后，您可以收藏喜欢的影片、下载离线观看、获得个性化推荐，还能与其他影迷交流互动
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link to="/auth/register">
                  <Button variant="secondary" size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                    <Icon name="userPlus" size="sm" className="mr-2" />
                    立即注册
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                    已有账户？登录
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon name="film" size="sm" className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">影视资源网</h3>
              </div>
              <p className="text-gray-600 text-sm">
                提供海量高清影片资源，为您带来极致的观影体验
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">影片分类</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/movie/category/action" className="hover:text-blue-600">动作片</Link></li>
                <li><Link to="/movie/category/comedy" className="hover:text-blue-600">喜剧片</Link></li>
                <li><Link to="/movie/category/drama" className="hover:text-blue-600">剧情片</Link></li>
                <li><Link to="/movie/category/sci-fi" className="hover:text-blue-600">科幻片</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">用户服务</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/help" className="hover:text-blue-600">帮助中心</Link></li>
                <li><Link to="/contact" className="hover:text-blue-600">联系我们</Link></li>
                <li><Link to="/feedback" className="hover:text-blue-600">意见反馈</Link></li>
                <li><Link to="/terms" className="hover:text-blue-600">服务条款</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">关注我们</h4>
              <div className="flex items-center gap-3">
                <a href="#" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <Icon name="github" size="sm" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <Icon name="twitter" size="sm" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <Icon name="facebook" size="sm" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 影视资源网. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage