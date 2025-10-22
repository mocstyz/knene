/**
 * @fileoverview 用户认证相关Hooks - 基于TanStack Query的服务端状态管理
 * @description 提供完整的用户认证功能，包括登录、注册、资料管理等服务端状态管理。
 * 遵循DDD架构原则，作为应用层Hook协调用户领域的业务逻辑。
 * 集成TanStack Query实现缓存、重试、乐观更新等高级功能。
 * 
 * @author mosctz
 * @version 1.3.0
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

// 用户查询键常量配置，统一管理所有用户相关的查询键
export const USER_QUERY_KEYS = {
  PROFILE: ['user', 'profile'] as const, // 用户资料查询键
  PREFERENCES: ['user', 'preferences'] as const, // 用户偏好设置查询键
  AUTH_CHECK: ['auth', 'check'] as const, // 认证状态检查查询键
  FAVORITES: ['favorites', 'list'] as const, // 用户收藏列表查询键
} as const

// 获取用户资料Hook - 提供用户资料的查询功能，支持缓存和自动重新验证
export const useProfile = (userId?: string) => {
  // 获取认证状态 - 用于控制查询启用条件
  const isAuthenticated = useUserClientStore(state => state.isAuthenticated)

  return useQuery({
    queryKey: USER_QUERY_KEYS.PROFILE,
    queryFn: () => UserApiService.getProfile(userId || ''),
    enabled: isAuthenticated && !!userId, // 防御性检查 - 仅在认证且有用户ID时查询
    staleTime: 5 * 60 * 1000, // 缓存策略 - 5分钟内数据视为新鲜
    gcTime: 10 * 60 * 1000, // 垃圾回收 - 10分钟后清理未使用缓存
  })
}

// 用户登录Hook - 处理用户登录逻辑，成功后更新客户端状态和查询缓存
export const useLogin = () => {
  const queryClient = useQueryClient()
  const setAuthenticated = useUserClientStore(state => state.setAuthenticated)

  return useMutation({
    mutationFn: (data: LoginRequest) => UserApiService.login(data),
    onSuccess: user => {
      // 状态同步 - 更新客户端认证状态
      setAuthenticated(true, user.id)

      // 缓存更新 - 设置用户资料查询缓存
      queryClient.setQueryData(USER_QUERY_KEYS.PROFILE, user)

      // 性能优化 - 预取用户偏好设置数据
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

// 用户注册Hook - 处理用户注册逻辑，成功后自动登录并设置相关状态
export const useRegister = () => {
  const queryClient = useQueryClient()
  const setAuthenticated = useUserClientStore(state => state.setAuthenticated)

  return useMutation({
    mutationFn: (data: RegisterRequest) => UserApiService.register(data),
    onSuccess: user => {
      // 状态同步 - 注册成功后自动设置认证状态
      setAuthenticated(true, user.id)

      // 缓存初始化 - 设置新用户的资料缓存
      queryClient.setQueryData(USER_QUERY_KEYS.PROFILE, user)

      console.log('注册成功:', user.username)
    },
    onError: error => {
      console.error('注册失败:', error.message)
    },
  })
}

// 用户登出Hook - 处理用户登出逻辑，清除所有客户端状态和查询缓存
export const useLogout = () => {
  const queryClient = useQueryClient()
  const logoutClient = useUserClientStore(state => state.logoutClient)

  return useMutation({
    mutationFn: () => UserApiService.logout(),
    onSuccess: () => {
      // 状态清理 - 清除客户端认证状态
      logoutClient()

      // 缓存清理 - 清除所有查询缓存，保护用户隐私
      queryClient.clear()

      console.log('登出成功')
    },
  })
}

// 更新用户资料Hook - 提供用户资料更新功能，支持乐观更新和缓存同步
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const currentUserId = useUserClientStore(state => state.currentUserId)

  return useMutation({
    mutationFn: (updates: UpdateProfileRequest) =>
      UserApiService.updateProfile(currentUserId || '', updates),
    onSuccess: updatedUser => {
      // 缓存同步 - 更新用户资料缓存
      queryClient.setQueryData(USER_QUERY_KEYS.PROFILE, updatedUser)
      // 缓存失效 - 触发偏好设置重新查询
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.PREFERENCES })
    },
    onError: error => {
      console.error('更新资料失败:', error.message)
    },
  })
}

// 更新用户偏好设置Hook - 管理用户个性化偏好设置，包括主题、语言、通知等配置
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient()
  const currentUserId = useUserClientStore(state => state.currentUserId)

  return useMutation({
    mutationFn: (preferences: Partial<User['preferences']>) =>
      UserApiService.updatePreferences(currentUserId || '', preferences),
    onSuccess: updatedUser => {
      // 缓存同步 - 更新用户资料和偏好设置缓存
      queryClient.setQueryData(USER_QUERY_KEYS.PROFILE, updatedUser)
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.PREFERENCES })
    },
    onError: error => {
      console.error('更新偏好设置失败:', error.message)
    },
  })
}

// 修改密码Hook - 提供安全的密码修改功能，需要验证当前密码
export const useChangePassword = () => {
  const currentUserId = useUserClientStore(state => state.currentUserId)

  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string // 当前密码，用于身份验证
      newPassword: string // 新密码，需符合安全策略
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

// 忘记密码Hook - 发送密码重置邮件
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

// 重置密码Hook - 通过邮件令牌重置用户密码，用于忘记密码流程
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({
      token,
      newPassword,
    }: {
      token: string // 邮件中的重置令牌
      newPassword: string // 新密码
    }) => UserApiService.resetPassword(token, newPassword),
    onSuccess: () => {
      console.log('密码重置成功')
    },
    onError: error => {
      console.error('重置密码失败:', error.message)
    },
  })
}

// 验证邮箱Hook - 通过邮件令牌验证用户邮箱
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

// 认证状态检查Hook - 定期检查用户认证状态的有效性，防止令牌过期
export const useAuthCheck = () => {
  const currentUserId = useUserClientStore(state => state.currentUserId)

  return useQuery({
    queryKey: USER_QUERY_KEYS.AUTH_CHECK,
    queryFn: () =>
      UserApiService.checkAuth(localStorage.getItem('auth_token') || undefined),
    enabled: !!currentUserId, // 防御性检查 - 仅在有用户ID时检查认证状态
    retry: false, // 认证检查失败不重试，避免频繁请求
    staleTime: 0, // 认证状态实时检查，不使用缓存
    gcTime: 60 * 1000, // 1分钟后清理缓存
  })
}

// 获取用户偏好设置Hook - 查询当前用户的个性化偏好设置，支持长时间缓存
export const useUserPreferences = () => {
  const isAuthenticated = useUserClientStore(state => state.isAuthenticated)

  return useQuery({
    queryKey: USER_QUERY_KEYS.PREFERENCES,
    queryFn: async () => {
      // 数据转换 - 从用户资料中提取偏好设置
      const user = await UserApiService.getProfile(
        useUserClientStore.getState().currentUserId || ''
      )
      return user.preferences
    },
    enabled: isAuthenticated, // 防御性检查 - 仅在认证时查询
    staleTime: 30 * 60 * 1000, // 缓存策略 - 30分钟内数据视为新鲜
    gcTime: 60 * 60 * 1000, // 垃圾回收 - 1小时后清理未使用缓存
  })
}

// 获取当前用户状态Hook - 整合用户基本信息和认证状态，提供便捷的用户状态访问
export const useCurrentUser = () => {
  const isAuthenticated = useUserClientStore(state => state.isAuthenticated)
  const currentUserId = useUserClientStore(state => state.currentUserId)

  // 获取用户资料数据
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
    // 权限计算 - 基于用户角色判断管理员权限
    isAdmin: user?.role === 'admin',
    // 会员状态计算 - 判断是否为付费会员
    isPremium:
      user?.subscription?.type === 'premium' ||
      user?.subscription?.type === 'vip',
    // VIP状态计算 - 判断是否为VIP用户
    isVip: user?.role === 'vip',
  }
}

// 主要认证Hook - 整合所有认证功能，提供完整的认证功能集合
export const useAuth = () => {
  // 初始化所有认证相关的变更操作
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const logoutMutation = useLogout()
  const forgotPasswordMutation = useForgotPassword()
  const resetPasswordMutation = useResetPassword()
  const verifyEmailMutation = useVerifyEmail()
  const currentUser = useCurrentUser()

  return {
    // 用户状态 - 展开当前用户的所有状态
    ...currentUser,

    // 认证操作 - 提供所有认证相关的操作函数
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    verifyEmail: verifyEmailMutation.mutate,

    // 加载状态聚合 - 统一管理所有操作的加载状态
    isLoading:
      currentUser.isLoading ||
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,

    // 错误状态聚合 - 分别提供各操作的错误信息
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    verifyEmailError: verifyEmailMutation.error,
  }
}
