import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Icon } from '../../components/atoms'

const UnauthorizedPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const message = location.state?.message || '您没有权限访问此页面'
  const requiredPermissions = location.state?.requiredPermissions || []

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Icon 
            name="shield-exclamation" 
            className="w-24 h-24 text-red-500 mx-auto mb-6" 
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            403
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            访问被拒绝
          </h2>
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          {requiredPermissions.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                需要以下权限：
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                {requiredPermissions.map((permission: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <Icon name="key" className="w-4 h-4 mr-2" />
                    {permission}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGoBack}
            variant="primary"
            className="w-full"
          >
            <Icon name="arrow-left" className="w-4 h-4 mr-2" />
            返回上一页
          </Button>
          
          <Link to="/">
            <Button variant="secondary" className="w-full">
              <Icon name="home" className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </Link>
          
          <Link to="/auth/login">
            <Button variant="outline" className="w-full">
              <Icon name="login" className="w-4 h-4 mr-2" />
              重新登录
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            如果您认为这是一个错误，请联系
            <a 
              href="mailto:support@moviesite.com" 
              className="text-blue-600 hover:text-blue-500 ml-1"
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