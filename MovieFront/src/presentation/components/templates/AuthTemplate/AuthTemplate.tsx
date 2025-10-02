import React from 'react'
import { Icon } from '@/components/atoms'
import { cn } from '@/utils/cn'

export interface AuthTemplateProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  showLogo?: boolean
  backgroundImage?: string
  className?: string
  features?: string[]
}

const AuthTemplate: React.FC<AuthTemplateProps> = ({
  children,
  title = "影视资源网站",
  subtitle = "发现精彩影视内容",
  showLogo = true,
  backgroundImage,
  className,
  features
}) => {
  return (
    <div className={cn('min-h-screen flex', className)}>
      {/* 左侧背景区域 */}
      <div className="hidden lg:flex lg:flex-1 relative">
        {backgroundImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800" />
        )}
        
        {/* 遮罩层 */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* 内容 */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            {showLogo && (
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Icon name="film" size="xl" className="text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                <p className="text-lg text-white text-opacity-90">{subtitle}</p>
              </div>
            )}
            
            <div className="space-y-6">
              {features ? (
                features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <Icon name={index === 0 ? "play" : index === 1 ? "star" : index === 2 ? "download" : "film"} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{feature}</h3>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <Icon name="play" className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">海量影视资源</h3>
                      <p className="text-sm text-white text-opacity-80">
                        最新电影、热门剧集应有尽有
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <Icon name="download" className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">高速下载</h3>
                      <p className="text-sm text-white text-opacity-80">
                        多线程下载，极速体验
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <Icon name="star" className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">精品推荐</h3>
                      <p className="text-sm text-white text-opacity-80">
                        智能推荐，发现更多精彩
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 右侧表单区域 */}
      <div className="flex-1 lg:flex-none lg:w-96 xl:w-[480px] flex flex-col">
        <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
          {/* 移动端Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
              <Icon name="film" className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {/* 表单内容 */}
          <div className="w-full max-w-sm mx-auto">
            {children}
          </div>
        </div>

        {/* 底部信息 */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700 transition-colors">
              隐私政策
            </a>
            <a href="#" className="hover:text-gray-700 transition-colors">
              服务条款
            </a>
            <a href="#" className="hover:text-gray-700 transition-colors">
              帮助中心
            </a>
          </div>
          <div className="text-center text-xs text-gray-400 mt-2">
            © 2024 影视资源网站. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export { AuthTemplate }