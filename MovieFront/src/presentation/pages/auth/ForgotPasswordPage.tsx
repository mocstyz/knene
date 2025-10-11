import { useAuth } from '@application/hooks'
import { Button, Input, Icon } from '@components/atoms'
import { AuthTemplate } from '@components/templates'
import { AuthenticationService } from '@domain/services'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

interface FormData {
  email: string
}

interface FormErrors {
  email?: string
  general?: string
}

const ForgotPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { forgotPassword } = useAuth()

  const handleInputChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setFormData(prev => ({ ...prev, [field]: value }))

      // 清除对应字段的错误
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }))
      }
    }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // 验证邮箱
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址'
    } else if (!AuthenticationService.validateEmail(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      forgotPassword(formData.email, {
        onSuccess: () => {
          setIsSubmitted(true)
        },
        onError: (error: any) => {
          console.error('Forgot password error:', error)

          if (error.response?.status === 404) {
            setErrors({ email: '该邮箱地址未注册' })
          } else if (error.response?.status === 429) {
            setErrors({ general: '请求过于频繁，请稍后再试' })
          } else {
            setErrors({ general: '发送重置邮件失败，请稍后重试' })
          }
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const content = (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">忘记密码</h1>
        <p className="text-gray-600">
          输入您的邮箱地址，我们将发送重置密码的链接
        </p>
      </div>

      {isSubmitted ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <Icon
            name="check-circle"
            className="mx-auto mb-4 h-12 w-12 text-green-500"
          />
          <h2 className="mb-2 text-lg font-semibold text-green-800">
            邮件已发送
          </h2>
          <p className="mb-4 text-green-700">
            我们已向 <strong>{formData.email}</strong> 发送了重置密码的邮件。
            请检查您的邮箱并点击邮件中的链接来重置密码。
          </p>
          <p className="mb-6 text-sm text-green-600">
            如果您没有收到邮件，请检查垃圾邮件文件夹，或稍后重试。
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({ email: '' })
              }}
              variant="secondary"
              className="w-full"
            >
              重新发送
            </Button>
            <Link to="/auth/login">
              <Button variant="primary" className="w-full">
                返回登录
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center">
                <Icon
                  name="exclamation-triangle"
                  className="mr-2 h-5 w-5 text-red-500"
                />
                <span className="text-red-700">{errors.general}</span>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              邮箱地址
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon name="envelope" className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="请输入您的邮箱地址"
                className={`pl-10 ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Icon name="spinner" className="mr-2 h-4 w-4 animate-spin" />
                发送中...
              </div>
            ) : (
              '发送重置邮件'
            )}
          </Button>

          <div className="text-center">
            <Link
              to="/auth/login"
              className="text-sm text-blue-600 transition-colors hover:text-blue-500"
            >
              返回登录
            </Link>
          </div>
        </form>
      )}
    </div>
  )

  return <AuthTemplate>{content}</AuthTemplate>
}

export default ForgotPasswordPage
