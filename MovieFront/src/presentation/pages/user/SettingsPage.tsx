/**
 * @fileoverview 账户设置页面组件
 * @description 账户设置页面主组件，提供完整的账户管理功能，包括个人资料编辑、
 *              偏好设置配置、安全设置管理、通知设置等功能模块，支持多标签页
 *              切换和实时保存，为用户提供全面的账户个性化配置体验
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import {
  useCurrentUser,
  useUpdateProfile,
  useUpdatePreferences,
  useChangePassword,
} from '@application/hooks'
import {
  Button,
  Input,
  Select,
  Switch,
  LoadingSpinner,
} from '@components/atoms'
import { UserTemplate } from '@components/templates'
import React, { useState } from 'react'

// 密码表单数据接口 - 定义密码修改所需的字段
interface PasswordFormData {
  currentPassword: string // 当前密码
  newPassword: string // 新密码
  confirmPassword: string // 确认新密码
}

// 个人资料表单数据接口 - 定义个人资料编辑所需的字段
interface ProfileFormData {
  username: string // 用户名
  email: string // 邮箱地址
  avatar?: string // 头像URL
}

// 偏好设置表单数据接口 - 定义用户偏好配置选项
interface PreferencesFormData {
  language: 'zh-CN' | 'en-US' // 界面语言设置
  theme: 'light' | 'dark' | 'system' // 主题模式设置
  emailNotifications: boolean // 邮件通知开关
  pushNotifications: boolean // 推送通知开关
  downloadQuality: 'low' | 'medium' | 'high' | 'ultra' // 默认下载质量
  autoDownload: boolean // 自动下载开关
  downloadPath: string // 下载路径设置
}

// 账户设置页面组件 - 提供完整的账户管理功能，支持多个设置模块
const SettingsPage: React.FC = () => {
  const { user, isLoading: userLoading } = useCurrentUser()
  const updateProfile = useUpdateProfile()
  const updatePreferences = useUpdatePreferences()
  const changePassword = useChangePassword()

  // 当前激活的标签页状态 - 控制显示哪个设置模块
  const [activeTab, setActiveTab] = useState<
    'profile' | 'preferences' | 'security' | 'notifications'
  >('profile')
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  })
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [preferencesForm, setPreferencesForm] = useState<PreferencesFormData>({
    language: user?.preferences?.language || 'zh-CN',
    theme: user?.preferences?.theme || 'system',
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    pushNotifications: user?.preferences?.pushNotifications ?? true,
    downloadQuality: user?.preferences?.downloadQuality || 'high',
    autoDownload: user?.preferences?.autoDownload ?? false,
    downloadPath: user?.preferences?.downloadPath || '',
  })

  // 同步用户数据到表单 - 当用户数据加载完成时自动填充表单
  React.useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username,
        email: user.email,
        avatar: user.avatar || '',
      })
      setPreferencesForm({
        language: user.preferences?.language || 'zh-CN',
        theme: user.preferences?.theme || 'system',
        emailNotifications: user.preferences?.emailNotifications ?? true,
        pushNotifications: user.preferences?.pushNotifications ?? true,
        downloadQuality: user.preferences?.downloadQuality || 'high',
        autoDownload: user.preferences?.autoDownload ?? false,
        downloadPath: user.preferences?.downloadPath || '',
      })
    }
  }, [user])

  // 个人资料提交处理 - 处理个人资料表单的提交和更新
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile.mutateAsync(profileForm)
      console.log('个人资料更新成功')
    } catch (error) {
      console.error('更新失败，请重试')
    }
  }

  // 密码修改提交处理 - 处理密码修改表单的提交和验证
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      console.error('新密码和确认密码不匹配')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      console.error('新密码长度至少为8位')
      return
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      console.log('密码修改成功')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('密码修改失败，请检查当前密码是否正确')
    }
  }

  // 偏好设置提交处理 - 处理偏好设置表单的提交和更新
  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updatePreferences.mutateAsync(preferencesForm)
      console.log('偏好设置更新成功')
    } catch (error) {
      console.error('更新失败，请重试')
    }
  }

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">未登录</h2>
          <p className="text-gray-600">请先登录后访问设置页面</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'profile', name: '个人资料', icon: 'user' },
    { id: 'preferences', name: '偏好设置', icon: 'settings' },
    { id: 'security', name: '安全设置', icon: 'shield' },
    { id: 'notifications', name: '通知设置', icon: 'bell' },
  ]

  // 标签页内容渲染函数 - 根据当前激活的标签页渲染对应的设置内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              个人资料
            </h3>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                  {profileForm.avatar ? (
                    <img
                      src={profileForm.avatar}
                      alt="头像"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-gray-500">
                      {profileForm.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <Button type="button" variant="secondary" size="sm">
                    更换头像
                  </Button>
                  <p className="mt-1 text-sm text-gray-500">
                    支持 JPG、PNG 格式，文件大小不超过 2MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    用户名
                  </label>
                  <Input
                    type="text"
                    value={profileForm.username}
                    onChange={e =>
                      setProfileForm(prev => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    placeholder="请输入用户名"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    邮箱地址
                  </label>
                  <Input
                    type="email"
                    value={profileForm.email}
                    onChange={e =>
                      setProfileForm(prev => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="请输入邮箱地址"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  loading={updateProfile.isPending}
                >
                  保存更改
                </Button>
              </div>
            </form>
          </div>
        )

      case 'preferences':
        return (
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              偏好设置
            </h3>
            <form onSubmit={handlePreferencesSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    界面语言
                  </label>
                  <Select
                    value={preferencesForm.language}
                    onChange={value =>
                      setPreferencesForm(prev => ({
                        ...prev,
                        language: value as 'zh-CN' | 'en-US',
                      }))
                    }
                    options={[
                      { value: 'zh-CN', label: '简体中文' },
                      { value: 'zh-TW', label: '繁體中文' },
                      { value: 'en-US', label: 'English' },
                    ]}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    主题模式
                  </label>
                  <Select
                    value={preferencesForm.theme}
                    onChange={value =>
                      setPreferencesForm(prev => ({
                        ...prev,
                        theme: value as any,
                      }))
                    }
                    options={[
                      { value: 'light', label: '浅色模式' },
                      { value: 'dark', label: '深色模式' },
                      { value: 'system', label: '跟随系统' },
                    ]}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    默认下载质量
                  </label>
                  <Select
                    value={preferencesForm.downloadQuality}
                    onChange={value =>
                      setPreferencesForm(prev => ({
                        ...prev,
                        downloadQuality: value as any,
                      }))
                    }
                    options={[
                      { value: 'low', label: '标清 (480p)' },
                      { value: 'medium', label: '高清 (720p)' },
                      { value: 'high', label: '超清 (1080p)' },
                      { value: 'ultra', label: '4K (2160p)' },
                    ]}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    下载路径
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={preferencesForm.downloadPath}
                      onChange={e =>
                        setPreferencesForm(prev => ({
                          ...prev,
                          downloadPath: e.target.value,
                        }))
                      }
                      placeholder="选择下载文件夹"
                      readOnly
                    />
                    <Button type="button" variant="secondary">
                      浏览
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      自动下载
                    </h4>
                    <p className="text-sm text-gray-500">
                      收藏的影片有新资源时自动下载
                    </p>
                  </div>
                  <Switch
                    checked={preferencesForm.autoDownload}
                    onChange={checked =>
                      setPreferencesForm(prev => ({
                        ...prev,
                        autoDownload: checked,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  loading={updatePreferences.isPending}
                >
                  保存设置
                </Button>
              </div>
            </form>
          </div>
        )

      case 'security':
        return (
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              安全设置
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  当前密码
                </label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={e =>
                    setPasswordForm(prev => ({
                      ...prev,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="请输入当前密码"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  新密码
                </label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={e =>
                    setPasswordForm(prev => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="请输入新密码（至少8位）"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  确认新密码
                </label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={e =>
                    setPasswordForm(prev => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="请再次输入新密码"
                  required
                />
              </div>

              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <h4 className="mb-2 text-sm font-medium text-yellow-800">
                  密码安全提示
                </h4>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• 密码长度至少8位</li>
                  <li>• 建议包含大小写字母、数字和特殊字符</li>
                  <li>• 不要使用常见密码或个人信息</li>
                  <li>• 定期更换密码以保证账户安全</li>
                </ul>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  loading={changePassword.isPending}
                >
                  修改密码
                </Button>
              </div>
            </form>
          </div>
        )

      case 'notifications':
        return (
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              通知设置
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    邮件通知
                  </h4>
                  <p className="text-sm text-gray-500">
                    接收重要更新和活动通知邮件
                  </p>
                </div>
                <Switch
                  checked={preferencesForm.emailNotifications}
                  onChange={checked =>
                    setPreferencesForm(prev => ({
                      ...prev,
                      emailNotifications: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    推送通知
                  </h4>
                  <p className="text-sm text-gray-500">接收浏览器推送通知</p>
                </div>
                <Switch
                  checked={preferencesForm.pushNotifications}
                  onChange={checked =>
                    setPreferencesForm(prev => ({
                      ...prev,
                      pushNotifications: checked,
                    }))
                  }
                />
              </div>

              <div className="border-t pt-6">
                <h4 className="mb-4 text-sm font-medium text-gray-900">
                  通知类型
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      key: 'download',
                      label: '下载完成通知',
                      description: '影片下载完成时通知',
                    },
                    {
                      key: 'favorite',
                      label: '收藏更新通知',
                      description: '收藏的影片有新资源时通知',
                    },
                    {
                      key: 'system',
                      label: '系统通知',
                      description: '系统维护和重要公告',
                    },
                    {
                      key: 'promotion',
                      label: '活动推广',
                      description: '优惠活动和新功能介绍',
                    },
                  ].map(item => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          {item.label}
                        </h5>
                        <p className="text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        checked={true} // 这里应该从用户偏好中获取
                        onChange={checked => {
                          // 处理具体通知类型的开关
                          console.log(`${item.key} notification:`, checked)
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={handlePreferencesSubmit}
                  loading={updatePreferences.isPending}
                >
                  保存通知设置
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const header = (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">账户设置</h1>
        <p className="mt-1 text-gray-600">管理您的账户信息和偏好设置</p>
      </div>
    </div>
  )

  const sidebar = (
    <div className="space-y-1">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
            activeTab === tab.id
              ? 'border-r-2 border-blue-700 bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="text-lg">
            {tab.icon === 'user' && '👤'}
            {tab.icon === 'settings' && '⚙️'}
            {tab.icon === 'shield' && '🛡️'}
            {tab.icon === 'bell' && '🔔'}
          </span>
          {tab.name}
        </button>
      ))}
    </div>
  )

  const main = <div className="space-y-6">{renderTabContent()}</div>

  return <UserTemplate header={header} sidebar={sidebar} main={main} />
}

export default SettingsPage
