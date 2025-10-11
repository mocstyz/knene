/**
 * @fileoverview 用户认证相关Hooks - 基于TanStack Query的服务端状态管理
 * @description 处理用户登录、注册、资料管理等服务端状态
 */

import { User } from '@application/stores/userStore'
import { useUserClientStore } from '@application/stores/userStore'
import {
  UserApiService,
  type LoginRequest,
  type RegisterRequest,
  type UpdateProfileRequest,
} from '@infrastructure/api/userApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// 查询键常量
export const USER_QUERY_KEYS = {
  PROFILE: ['user', 'profile'] as const,
  PREFERENCES: ['user', 'preferences'] as const,
  AUTH_CHECK: ['auth', 'check'] as const,
  FAVORITES: ['favorites', 'list'] as const,
} as const

// 获取用户资料
export const useProfile = (userId?: string) => {
  const isAuthenticated = useUserClientStore(state => state.isAuthenticated)

  return useQuery({
    queryKey: USER_QUERY_KEYS.PROFILE,
    queryFn: () => UserApiService.getProfile(userId || ''),
    enabled: isAuthenticated && !!userId,
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 10 * 60 * 1000, // 10分钟
  })
}

// 登录
export const useLogin = () => {
  const queryClient = useQueryClient()
  const setAuthenticated = useUserClientStore(state => state.setAuthenticated)

  return useMutation({
    mutationFn: (data: LoginRequest) => UserApiService.login(data),
    onSuccess: user => {
      // 更新客户端认证状态
      setAuthenticated(true, user.id)

      // 设置查询缓存
      queryClient.setQueryData(USER_QUERY_KEYS.PROFILE, user)

      // 预取相关数据
      queryClient.prefetchQuery({
        queryKey: USER_QUERY_KEYS.PREFERENCES,
        queryFn: () => Promise.resolve(user.preferences),
      })

      console.log('登录成功:', user.username)
    },
    onError: error => {
      console.error('登录失败:', error.message)
    },
  })
}

// 注册
export const useRegister = () => {
  const queryClient = useQueryClient()
  const setAuthenticated = useUserClientStore(state => state.setAuthenticated)

  return useMutation({
    mutationFn: (data: RegisterRequest) => UserApiService.register(data),
    onSuccess: user => {
      // 更新客户端认证状态
      setAuthenticated(true, user.id)

      // 设置查询缓存
      queryClient.setQueryData(USER_QUERY_KEYS.PROFILE, user)

      console.log('注册成功:', user.username)
    },
    onError: error => {
      console.error('注册失败:', error.message)
    },
  })
}

// 登出
export const useLogout = () => {
  const queryClient = useQueryClient()
  const logoutClient = useUserClientStore(state => state.logoutClient)

  return useMutation({
    mutationFn: () => UserApiService.logout(),
    onSuccess: () => {
      // 清除客户端状态
      logoutClient()

      // 清除所有查询缓存
      queryClient.clear()

      console.log('登出成功')
    },
  })
}

// 更新用户资料
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const currentUserId = useUserClientStore(state => state.currentUserId)

  return useMutation({
    mutationFn: (updates: UpdateProfileRequest) =>
      UserApiService.updateProfile(currentUserId || '', updates),
    onSuccess: updatedUser => {
      // 更新查询缓存
      queryClient.setQueryData(USER_QUERY_KEYS.PROFILE, updatedUser)
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.PREFERENCES })
    },
    onError: error => {
      console.error('更新资料失败:', error.message)
    },
  })
}

// 更新用户偏好设置
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient()
  const currentUserId = useUserClientStore(state => state.currentUserId)

  return useMutation({
    mutationFn: (preferences: Partial<User['preferences']>) =>
      UserApiService.updatePreferences(currentUserId || '', preferences),
    onSuccess: updatedUser => {
      // 更新查询缓存
      queryClient.setQueryData(USER_QUERY_KEYS.PROFILE, updatedUser)
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.PREFERENCES })
    },
    onError: error => {
      console.error('更新偏好设置失败:', error.message)
    },
  })
}

// 修改密码
export const useChangePassword = () => {
  const currentUserId = useUserClientStore(state => state.currentUserId)

  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string
      newPassword: string
    }) =>
      UserApiService.changePassword(
        currentUserId || '',
        currentPassword,
        newPassword
      ),
    onError: error => {
      console.error('修改密码失败:', error.message)
    },
  })
}

// 忘记密码
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => UserApiService.forgotPassword(email),
    onSuccess: () => {
      console.log('重置密码邮件已发送')
    },
    onError: error => {
      console.error('发送重置密码邮件失败:', error.message)
    },
  })
}

// 重置密码
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string
      newPassword: string
    }) => UserApiService.resetPassword(token, newPassword),
    onSuccess: () => {
      console.log('密码重置成功')
    },
    onError: error => {
      console.error('重置密码失败:', error.message)
    },
  })
}

// 验证邮箱
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => UserApiService.verifyEmail(token),
    onSuccess: () => {
      console.log('邮箱验证成功')
    },
    onError: error => {
      console.error('邮箱验证失败:', error.message)
    },
  })
}

// 检查认证状态
export const useAuthCheck = () => {
  const currentUserId = useUserClientStore(state => state.currentUserId)

  return useQuery({
    queryKey: USER_QUERY_KEYS.AUTH_CHECK,
    queryFn: () =>
      UserApiService.checkAuth(localStorage.getItem('auth_token') || undefined),
    enabled: !!currentUserId,
    retry: false,
    staleTime: 0,
    gcTime: 60 * 1000, // 1分钟
  })
}

// 获取用户偏好设置
export const useUserPreferences = () => {
  const isAuthenticated = useUserClientStore(state => state.isAuthenticated)

  return useQuery({
    queryKey: USER_QUERY_KEYS.PREFERENCES,
    queryFn: async () => {
      const user = await UserApiService.getProfile(
        useUserClientStore.getState().currentUserId || ''
      )
      return user.preferences
    },
    enabled: isAuthenticated,
    staleTime: 30 * 60 * 1000, // 30分钟
    gcTime: 60 * 60 * 1000, // 1小时
  })
}

// 自定义hook：获取当前用户状态
export const useCurrentUser = () => {
  const isAuthenticated = useUserClientStore(state => state.isAuthenticated)
  const currentUserId = useUserClientStore(state => state.currentUserId)

  const {
    data: user,
    isLoading,
    error,
  } = useProfile(currentUserId || undefined)

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin: user?.role === 'admin',
    isPremium:
      user?.subscription?.type === 'premium' ||
      user?.subscription?.type === 'vip',
    isVip: user?.role === 'vip',
  }
}

// 主要的认证Hook - 整合所有认证功能
export const useAuth = () => {
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const logoutMutation = useLogout()
  const forgotPasswordMutation = useForgotPassword()
  const resetPasswordMutation = useResetPassword()
  const verifyEmailMutation = useVerifyEmail()
  const currentUser = useCurrentUser()

  return {
    // 用户状态
    ...currentUser,

    // 认证操作
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    verifyEmail: verifyEmailMutation.mutate,

    // 加载状态
    isLoading:
      currentUser.isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,

    // 错误状态
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    verifyEmailError: verifyEmailMutation.error,
  }
}
