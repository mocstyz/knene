import React from 'react'
import { Link } from 'react-router-dom'
import { Search, Play, Download, Star } from 'lucide-react'

// 模拟数据
const featuredMovies = [
  {
    id: '1',
    title: '阿凡达：水之道',
    poster: 'https://via.placeholder.com/300x450/0066cc/ffffff?text=Avatar+2',
    rating: 8.5,
    year: 2022,
    genre: '科幻/动作'
  },
  {
    id: '2',
    title: '流浪地球2',
    poster: 'https://via.placeholder.com/300x450/cc6600/ffffff?text=Wandering+Earth+2',
    rating: 8.2,
    year: 2023,
    genre: '科幻/灾难'
  },
  {
    id: '3',
    title: '蜘蛛侠：纵横宇宙',
    poster: 'https://via.placeholder.com/300x450/cc0066/ffffff?text=Spider-Verse',
    rating: 9.1,
    year: 2023,
    genre: '动画/动作'
  },
  {
    id: '4',
    title: '速度与激情10',
    poster: 'https://via.placeholder.com/300x450/66cc00/ffffff?text=Fast+X',
    rating: 7.8,
    year: 2023,
    genre: '动作/犯罪'
  }
]

const categories = [
  { name: '动作片', slug: 'action', count: 1250 },
  { name: '科幻片', slug: 'sci-fi', count: 890 },
  { name: '喜剧片', slug: 'comedy', count: 1100 },
  { name: '恐怖片', slug: 'horror', count: 650 },
  { name: '爱情片', slug: 'romance', count: 780 },
  { name: '动画片', slug: 'animation', count: 420 }
]

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // 跳转到搜索页面
      window.location.href = `/movie/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">影视资源网站</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                首页
              </Link>
              <Link to="/movie/search" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                搜索
              </Link>
              <Link to="/auth/login" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                登录
              </Link>
              <Link to="/auth/register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                注册
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main>
        {/* 英雄区域 */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              发现精彩影视世界
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              海量高清影片资源，随时随地畅享观影体验
            </p>
            
            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索影片、演员、导演..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 text-lg text-gray-900 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* 分类导航 */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">热门分类</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/movie/category/${category.slug}`}
                  className="bg-gray-50 hover:bg-blue-50 rounded-lg p-6 text-center transition-colors group"
                >
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                    {category.name}
                  </h4>
                  <p className="text-sm text-gray-500">{category.count} 部影片</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 推荐影片 */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">热门推荐</h3>
              <Link
                to="/movie/search"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                查看更多 →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="relative">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                        <Link
                          to={`/movie/${movie.id}`}
                          className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
                        >
                          <Play className="w-5 h-5" />
                        </Link>
                        <button className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 truncate">
                      {movie.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{movie.year} · {movie.genre}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{movie.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 功能特色 */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">为什么选择我们</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">高清画质</h4>
                <p className="text-gray-600">提供1080P、4K等多种画质选择，带来极致观影体验</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">快速下载</h4>
                <p className="text-gray-600">多线程下载技术，支持断点续传，下载速度更快更稳定</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">精选内容</h4>
                <p className="text-gray-600">专业团队精心挑选，只为您推荐最优质的影视作品</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">影视资源网站</h4>
            <p className="text-gray-400 mb-4">
              致力于为用户提供最优质的影视资源和观影体验
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <Link to="/about" className="hover:text-white">关于我们</Link>
              <Link to="/contact" className="hover:text-white">联系我们</Link>
              <Link to="/privacy" className="hover:text-white">隐私政策</Link>
              <Link to="/terms" className="hover:text-white">服务条款</Link>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
              © 2024 影视资源网站. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage