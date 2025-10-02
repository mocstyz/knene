import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon } from '../../components/atoms'

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404图标 */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="alertCircle" size="xl" className="text-gray-400" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">页面未找到</h2>
          <p className="text-gray-600 mb-8">
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
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">需要帮助？</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/help"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              帮助中心
            </Link>
            <Link
              to="/contact"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
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