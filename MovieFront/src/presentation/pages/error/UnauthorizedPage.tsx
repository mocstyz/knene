/**
 * @fileoverview 403权限不足页面
 * @description 用户访问无权限页面时显示的403错误页面，提供权限不足的详细信息和解决建议，
 *              包含所需权限说明、返回导航、重新登录等功能，指导用户解决权限问题
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Button, Icon } from '@components/atoms'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

// 403权限不足组件，用户访问无权限页面时显示的错误页面，提供权限不足的详细信息和解决建议
const UnauthorizedPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const message = location.state?.message || '您没有权限访问此页面'
  const requiredPermissions = location.state?.requiredPermissions || []

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <Icon
            name="shield-exclamation"
            className="mx-auto mb-6 h-24 w-24 text-red-500"
          />
          <h1 className="mb-4 text-4xl font-bold text-gray-900">403</h1>
          <h2 className="mb-4 text-2xl font-semibold text-gray-700">
            访问被拒绝
          </h2>
          <p className="mb-6 text-gray-600">{message}</p>

          {requiredPermissions.length > 0 && (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <h3 className="mb-2 text-sm font-medium text-yellow-800">
                需要以下权限：
              </h3>
              <ul className="space-y-1 text-sm text-yellow-700">
                {requiredPermissions.map(
                  (permission: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <Icon name="key" className="mr-2 h-4 w-4" />
                      {permission}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Button onClick={handleGoBack} variant="primary" className="w-full">
            <Icon name="arrow-left" className="mr-2 h-4 w-4" />
            返回上一页
          </Button>

          <Link to="/">
            <Button variant="secondary" className="w-full">
              <Icon name="home" className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </Link>

          <Link to="/auth/login">
            <Button variant="outline" className="w-full">
              <Icon name="login" className="mr-2 h-4 w-4" />
              重新登录
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            如果您认为这是一个错误，请联系
            <a
              href="mailto:support@moviesite.com"
              className="ml-1 text-blue-600 hover:text-blue-500"
            >
              技术支持
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage
