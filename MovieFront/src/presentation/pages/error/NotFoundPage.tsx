/**
 * @fileoverview 404页面未找到页面
 * @description 用户访问不存在页面时显示的404错误页面，提供友好的错误提示和导航选项，
 *              包含返回首页、返回上一页、帮助中心链接等功能，改善用户体验
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Button, Icon } from '@components/atoms'
import React from 'react'
import { Link } from 'react-router-dom'

// 404页面未找到组件，用户访问不存在页面时显示的错误页面，提供友好的错误提示和导航选项
const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        {/* 404图标 */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
            <Icon name="alertCircle" size="xl" className="text-gray-400" />
          </div>
          <h1 className="mb-2 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            页面未找到
          </h2>
          <p className="mb-8 text-gray-600">
            抱歉，您访问的页面不存在或已被移除。
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-4">
          <Link to="/">
            <Button variant="primary" size="lg" className="w-full">
              <Icon name="home" size="sm" className="mr-2" />
              返回首页
            </Button>
          </Link>

          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => window.history.back()}
          >
            <Icon name="arrowLeft" size="sm" className="mr-2" />
            返回上一页
          </Button>
        </div>

        {/* 帮助链接 */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="mb-4 text-sm text-gray-500">需要帮助？</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/help"
              className="text-sm text-blue-600 transition-colors hover:text-blue-700"
            >
              帮助中心
            </Link>
            <Link
              to="/contact"
              className="text-sm text-blue-600 transition-colors hover:text-blue-700"
            >
              联系我们
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
