import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/application/hooks'
import { AuthTemplate } from '@/components/templates'
import { Button, Input, Icon } from '@/components/atoms'
import { AuthenticationService } from '@/domain/services'

interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

interface RegisterFormErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { register, isLoading } = useAuth()

  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    feedback: string[]
  }>({ score: 0, feedback: [] })

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {}

    // 用户名验证
    if (!formData.username) {
      newErrors.username = '请输入用户名'
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少需要3个字符'
    } else if (formData.username.length > 20) {
      newErrors.username = '用户名不能超过20个字符'
    } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(formData.username)) {
      newErrors.username = '用户名只能包含字母、数字、下划线和中文'
    }

    // 邮箱验证
    if (!formData.email) {
      newErrors.email = '请输入邮箱地址'
    } else if (!AuthenticationService.validateEmail(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else {
      const strength = AuthenticationService.checkPasswordStrength(formData.password)
      if (strength.score < 3) {
        newErrors.password = '密码强度不够，请参考提示'
      }
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }

    // 同意条款验证
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '请阅读并同意用户协议和隐私政策'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'agreeToTerms' ? e.target.checked : e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))

    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    // 实时检查密码强度
    if (field === 'password' && typeof value === 'string') {
      const strength = AuthenticationService.checkPasswordStrength(value)
      setPasswordStrength(strength)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      })

      // 注册成功，跳转到邮箱验证页面
      navigate('/auth/verify-email', {
        state: { email: formData.email }
      })
    } catch (error: any) {
      // 显示错误信息
      if (error.message.includes('email')) {
        setErrors({ email: '该邮箱已被注册' })
      } else if (error.message.includes('username')) {
        setErrors({ username: '该用户名已被使用' })
      } else {
        setErrors({ email: '注册失败，请稍后重试' })
      }
    }
  }

  const getPasswordStrengthColor = (score: number): string => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-red-500'
      case 2:
        return 'bg-yellow-500'
      case 3:
        return 'bg-blue-500'
      case 4:
        return 'bg-green-500'
      default:
        return 'bg-gray-300'
    }
  }

  const getPasswordStrengthText = (score: number): string => {
    switch (score) {
      case 0:
      case 1:
        return '弱'
      case 2:
        return '一般'
      case 3:
        return '强'
      case 4:
        return '很强'
      default:
        return ''
    }
  }

  return (
    <AuthTemplate>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Icon name="film" className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              创建新账户
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              已有账户？{' '}
              <Link
                to="/auth/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                立即登录
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  用户名
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange('username')}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.username ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="请输入用户名"
                  />
                  <Icon 
                    name="user" 
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  邮箱地址
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="请输入邮箱地址"
                  />
                  <Icon 
                    name="mail" 
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密码
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="请输入密码"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Icon 
                      name={showPassword ? 'eye-slash' : 'eye'} 
                      className="h-5 w-5 text-gray-400 hover:text-gray-600" 
                    />
                  </button>
                </div>
                
                {/* 密码强度指示器 */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {getPasswordStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <ul className="mt-1 text-xs text-gray-600 space-y-1">
                        {passwordStrength.feedback.map((feedback, index) => (
                          <li key={index} className="flex items-center">
                            <Icon name="info" className="h-3 w-3 mr-1" />
                            {feedback}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  确认密码
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    className={`appearance-none relative block w-full px-3 py-2 pr-10 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="请再次输入密码"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon 
                      name={showConfirmPassword ? 'eye-slash' : 'eye'} 
                      className="h-5 w-5 text-gray-400 hover:text-gray-600" 
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange('agreeToTerms')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agree-terms" className="text-gray-700">
                  我已阅读并同意{' '}
                  <Link
                    to="/terms"
                    className="text-indigo-600 hover:text-indigo-500"
                    target="_blank"
                  >
                    用户协议
                  </Link>
                  {' '}和{' '}
                  <Link
                    to="/privacy"
                    className="text-indigo-600 hover:text-indigo-500"
                    target="_blank"
                  >
                    隐私政策
                  </Link>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Icon name="spinner" className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    注册中...
                  </>
                ) : (
                  '创建账户'
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                已有账户？{' '}
                <Link
                  to="/auth/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  立即登录
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AuthTemplate>
  )
}

export default RegisterPage