/**
 * @fileoverview 认证页面模板组件
 * @description 提供认证页面的完整布局模板，包含左侧背景展示区域和右侧表单区域，
 *              支持自定义背景图片、Logo、功能特性展示和响应式设计
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Icon } from '@components/atoms'
import { cn } from '@utils/cn'
import React from 'react'

// 认证模板属性接口，定义认证页面模板的配置选项和内容设置
export interface AuthTemplateProps {
  children: React.ReactNode // 表单内容子组件
  title?: string // 页面标题
  subtitle?: string // 页面副标题
  showLogo?: boolean // 是否显示Logo
  backgroundImage?: string // 背景图片URL
  className?: string // 自定义CSS类名
  features?: string[] // 功能特性列表
}

// 认证页面模板组件，提供认证页面的完整布局模板，包含左侧背景展示区域和右侧表单区域，支持自定义背景图片和响应式设计
const AuthTemplate: React.FC<AuthTemplateProps> = ({
  children,
  title = '影视资源网站',
  subtitle = '发现精彩影视内容',
  showLogo = true,
  backgroundImage,
  className,
  features,
}) => {
  return (
    <div className={cn('flex min-h-screen', className)}>
      {/* 左侧背景区域 */}
      <div className="relative hidden lg:flex lg:flex-1">
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
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            {showLogo && (
              <div className="mb-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20">
                  <Icon name="film" size="xl" className="text-white" />
                </div>
                <h1 className="mb-2 text-3xl font-bold">{title}</h1>
                <p className="text-lg text-white text-opacity-90">{subtitle}</p>
              </div>
            )}

            <div className="space-y-6">
              {features ? (
                features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white bg-opacity-20">
                      <Icon
                        name={
                          index === 0
                            ? 'play'
                            : index === 1
                              ? 'star'
                              : index === 2
                                ? 'download'
                                : 'film'
                        }
                        className="text-white"
                      />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{feature}</h3>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white bg-opacity-20">
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white bg-opacity-20">
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white bg-opacity-20">
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
      <div className="flex flex-1 flex-col lg:w-96 lg:flex-none xl:w-[480px]">
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          {/* 移动端Logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
              <Icon name="film" className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
          </div>

          {/* 表单内容 */}
          <div className="mx-auto w-full max-w-sm">{children}</div>
        </div>

        {/* 底部信息 */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="transition-colors hover:text-gray-700">
              隐私政策
            </a>
            <a href="#" className="transition-colors hover:text-gray-700">
              服务条款
            </a>
            <a href="#" className="transition-colors hover:text-gray-700">
              帮助中心
            </a>
          </div>
          <div className="mt-2 text-center text-xs text-gray-400">
            © 2024 影视资源网站. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export { AuthTemplate }
