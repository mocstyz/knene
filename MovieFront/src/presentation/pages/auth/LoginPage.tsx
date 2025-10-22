/**
 * @fileoverview 用户登录页面
 * @description 用户认证的主要登录页面，提供邮箱密码登录、社交登录、忘记密码等功能，
 *              包含表单验证、登录失败限制、账户安全锁定等完整的用户认证流程
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { useAuth } from '@application/hooks'
import { Button, Input, Icon } from '@components/atoms'
import { AuthTemplate } from '@components/templates'
import { AuthenticationService } from '@domain/services'
import { formatTime } from '@utils/formatters'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

// 登录表单数据接口，定义用户登录表单的数据结构
interface LoginFormData {
  email: string // 用户邮箱地址
  password: string // 用户密码
  rememberMe: boolean // 是否记住登录状态
}

// 用户登录页面组件，提供邮箱密码登录、社交登录、忘记密码等完整的用户认证功能
const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading } = useAuth()

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0)

  // 从URL参数或location state获取重定向路径
  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    // 检查是否被临时锁定
    const lastAttempt = localStorage.getItem('lastLoginAttempt')
    const attempts = parseInt(localStorage.getItem('loginAttempts') || '0')

    if (lastAttempt && attempts >= 5) {
      const timeDiff = Date.now() - parseInt(lastAttempt)
      const lockDuration = 15 * 60 * 1000 // 15分钟

      if (timeDiff < lockDuration) {
        setIsBlocked(true)
        setBlockTimeRemaining(Math.ceil((lockDuration - timeDiff) / 1000))

        const timer = setInterval(() => {
          setBlockTimeRemaining(prev => {
            if (prev <= 1) {
              setIsBlocked(false)
              localStorage.removeItem('loginAttempts')
              localStorage.removeItem('lastLoginAttempt')
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } else {
        // 锁定时间已过，重置计数
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('lastLoginAttempt')
      }
    }
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {}

    // 邮箱验证
    if (!formData.email) {
      newErrors.email = '请输入邮箱地址'
    } else if (!AuthenticationService.validateEmail(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = field === 'rememberMe' ? e.target.checked : e.target.value
      setFormData(prev => ({ ...prev, [field]: value }))

      // 清除对应字段的错误
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }))
      }
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isBlocked) {
      return
    }

    if (!validateForm()) {
      return
    }

    try {
      login({
        email: formData.email,
        password: formData.password,
      })

      // 登录成功，清除失败计数
      localStorage.removeItem('loginAttempts')
      localStorage.removeItem('lastLoginAttempt')

      // 重定向到目标页面
      navigate(from, { replace: true })
    } catch (error: any) {
      // 记录登录失败
      const attempts =
        parseInt(localStorage.getItem('loginAttempts') || '0') + 1
      localStorage.setItem('loginAttempts', attempts.toString())
      localStorage.setItem('lastLoginAttempt', Date.now().toString())
      setLoginAttempts(attempts)

      // 检查是否需要锁定
      if (attempts >= 5) {
        setIsBlocked(true)
        setBlockTimeRemaining(15 * 60) // 15分钟
      }

      // 显示错误信息
      if (error.message.includes('email')) {
        setErrors({ email: '邮箱地址不存在' })
      } else if (error.message.includes('password')) {
        setErrors({ password: '密码错误' })
      } else {
        setErrors({ email: '登录失败，请检查邮箱和密码' })
      }
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`使用 ${provider} 登录`)
    // TODO: 实现社交登录
  }

  const formContent = (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">欢迎回来</h1>
        <p className="text-gray-600">登录您的账户以继续使用</p>
      </div>

      {/* 社交登录 */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('Google')}
            disabled={isBlocked}
          >
            <Icon name="globe" size="sm" className="mr-2" />
            Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin('GitHub')}
            disabled={isBlocked}
          >
            <Icon name="github" size="sm" className="mr-2" />
            GitHub
          </Button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">或使用邮箱登录</span>
          </div>
        </div>
      </div>

      {/* 登录表单 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {isBlocked && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="flex items-center">
              <Icon
                name="exclamation-triangle"
                size="sm"
                className="mr-2 text-red-500"
              />
              <div>
                <p className="text-sm font-medium text-red-800">账户暂时锁定</p>
                <p className="text-sm text-red-600">
                  由于多次登录失败，您的账户已被暂时锁定。请在{' '}
                  {formatTime(blockTimeRemaining)} 后重试。
                </p>
              </div>
            </div>
          </div>
        )}

        {loginAttempts > 0 && loginAttempts < 5 && !isBlocked && (
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <div className="flex items-center">
              <Icon
                name="exclamation-triangle"
                size="sm"
                className="mr-2 text-yellow-500"
              />
              <p className="text-sm text-yellow-700">
                登录失败 {loginAttempts} 次，还有 {5 - loginAttempts}{' '}
                次机会。5次失败后账户将被锁定15分钟。
              </p>
            </div>
          </div>
        )}

        <Input
          label="邮箱地址"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={!!errors.email}
          helperText={errors.email}
          placeholder="请输入您的邮箱地址"
          leftIcon="mail"
          fullWidth
          disabled={isBlocked}
        />

        <div className="relative">
          <Input
            label="密码"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange('password')}
            error={!!errors.password}
            helperText={errors.password}
            placeholder="请输入您的密码"
            leftIcon="lock"
            fullWidth
            disabled={isBlocked}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isBlocked}
          >
            <Icon name={showPassword ? 'eye-slash' : 'eye'} size="sm" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange('rememberMe')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={isBlocked}
            />
            <span className="ml-2 text-sm text-gray-600">记住我</span>
          </label>

          <Link
            to="/auth/forgot-password"
            className="text-sm text-blue-600 transition-colors hover:text-blue-700"
          >
            忘记密码？
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isLoading || isBlocked}
        >
          {isLoading ? (
            <>
              <Icon name="loading" size="sm" className="mr-2" />
              登录中...
            </>
          ) : (
            '登录'
          )}
        </Button>
      </form>

      {/* 注册链接 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          还没有账户？{' '}
          <Link
            to="/auth/register"
            className="font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            立即注册
          </Link>
        </p>
      </div>
    </div>
  )

  return (
    <AuthTemplate
      title="登录"
      subtitle="访问您的个人影片库"
      features={[
        '海量高清影片资源',
        '个性化推荐系统',
        '多设备同步观看',
        '离线下载功能',
      ]}
      backgroundImage="https://via.placeholder.com/800x600/1e40af/ffffff?text=Movie+Background"
    >
      {formContent}
    </AuthTemplate>
  )
}

export default LoginPage
