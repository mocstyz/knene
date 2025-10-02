import React from 'react'
import { useRouteError, Link } from 'react-router-dom'
import { Button, Icon } from '@/components/atoms'

interface RouteError {
  statusText?: string
  message?: string
  status?: number
}

const ErrorPage: React.FC = () => {
  const error = useRouteError() as RouteError
  
  const getErrorMessage = () => {
    if (error?.status === 404) {
      return {
        title: '页面未找到',
        message: '抱歉，您访问的页面不存在或已被移除。'
      }
    }
    
    if (error?.status === 500) {
      return {
        title: '服务器错误',
        message: '服务器遇到了一些问题，请稍后再试。'
      }
    }
    
    return {
      title: '出现了一些问题',
      message: error?.statusText || error?.message || '发生了未知错误，请稍后再试。'
    }
  }

  const { title, message } = getErrorMessage()

  const handleReload = () => {
    window.location.reload()
  }

  const handleReportError = () => {
    // TODO: 实现错误报告功能
    console.log('报告错误:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 错误图标 */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="alertTriangle" size="xl" className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 mb-8">{message}</p>
        </div>

        {/* 错误详情（开发环境显示） */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-8 p-4 bg-gray-100 rounded-lg text-left">
            <h3 className="font-semibold text-gray-900 mb-2">错误详情：</h3>
            <pre className="text-xs text-gray-600 overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleReload}
          >
            <Icon name="refresh" size="sm" className="mr-2" />
            重新加载
          </Button>
          
          <Link to="/">
            <Button variant="secondary" size="lg" className="w-full">
              <Icon name="home" size="sm" className="mr-2" />
              返回首页
            </Button>
          </Link>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => window.history.back()}
          >
            <Icon name="arrowLeft" size="sm" className="mr-2" />
            返回上一页
          </Button>
        </div>

        {/* 帮助和报告 */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            如果问题持续存在，请联系我们
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleReportError}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              报告问题
            </button>
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

export default ErrorPage