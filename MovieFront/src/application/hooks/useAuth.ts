import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUserStore, type User } from '@/application/stores/userStore'

// 查询键常量
const QUERY_KEYS = {
  USER: {
    PROFILE: ['user', 'profile'],
    PREFERENCES: ['user', 'preferences']
  },
  FAVORITES: {
    LIST: ['favorites', 'list']
  }
}

// 认证API服务
const authApi = {
  // 登录
  login: async (email: string, password: string): Promise<User> => {
    await useUserStore.getState().login(email, password)
    const user = useUserStore.getState().user
    if (!user) {
      throw new Error('登录失败')
    }
    return user
  },

  // 注册
  register: async (userData: {
    email: string
    username: string
    password: string
    confirmPassword: string
  }): Promise<User> => {
    await useUserStore.getState().register(userData)
    const user = useUserStore.getState().user
    if (!user) {
      throw new Error('注册失败')
    }
    return user
  },

  // 登出
  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    useUserStore.getState().logout()
  },

  // 获取用户资料
  getProfile: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const user = useUserStore.getState().user
    if (!user) {
      throw new Error('用户未登录')
    }
    return user
  },

  // 更新用户资料
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    await useUserStore.getState().updateProfile(updates)
    const user = useUserStore.getState().user
    if (!user) {
      throw new Error('更新失败')
    }
    return user
  },

  // 更新用户偏好设置
  updatePreferences: async (preferences: Partial<User['preferences']>): Promise<User> => {
    await useUserStore.getState().updatePreferences(preferences)
    const user = useUserStore.getState().user
    if (!user) {
      throw new Error('更新偏好设置失败')
    }
    return user
  },

  // 修改密码
  changePassword: async (_currentPassword: string, _newPassword: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    // 模拟密码验证和更新
    console.log('密码修改成功')
  },

  // 忘记密码
  forgotPassword: async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('重置密码邮件已发送到:', email)
  },

  // 重置密码
  resetPassword: async (_token: string, _newPassword: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    console.log('密码重置成功')
  },

  // 验证邮箱
  verifyEmail: async (_token: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('邮箱验证成功')
  },

  // 检查认证状态
  checkAuth: async (): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    return useUserStore.getState().user
  }
}

// 获取用户资料
export const useProfile = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  
  return useQuery({
    queryKey: QUERY_KEYS.USER.PROFILE,
    queryFn: authApi.getProfile,
    enabled: isAuthenticated
  })
}

// 登录
export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (user) => {
      // 更新用户相关查询缓存
      queryClient.setQueryData(QUERY_KEYS.USER.PROFILE, user)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.PREFERENCES })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAVORITES.LIST })
      
      console.log('登录成功:', user.username)
    }
  })
}

// 注册
export const useRegister = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userData: {
      email: string
      username: string
      password: string
      confirmPassword: string
    }) => authApi.register(userData),
    onSuccess: (user) => {
      // 更新用户相关查询缓存
      queryClient.setQueryData(QUERY_KEYS.USER.PROFILE, user)
      
      console.log('注册成功:', user.username)
    }
  })
}

// 登出
export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // 清除所有查询缓存
      queryClient.clear()
      
      console.log('登出成功')
    }
  })
}

// 更新用户资料
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: Partial<User>) => authApi.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.PROFILE })
    }
  })
}

// 更新用户偏好设置
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (preferences: Partial<User['preferences']>) => authApi.updatePreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.PROFILE })
    }
  })
}

// 修改密码
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { 
      currentPassword: string; 
      newPassword: string 
    }) => authApi.changePassword(currentPassword, newPassword)
  })
}

// 忘记密码
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email)
  })
}

// 重置密码
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.resetPassword(token, newPassword)
  })
}

// 验证邮箱
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token)
  })
}

// 检查认证状态
export const useAuthCheck = () => {
  return useQuery({
    queryKey: ['auth', 'check'],
    queryFn: authApi.checkAuth,
    retry: false
  })
}

// 获取用户偏好设置
export const useUserPreferences = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  
  return useQuery({
    queryKey: QUERY_KEYS.USER.PREFERENCES,
    queryFn: async () => {
      const user = await authApi.getProfile()
      return user.preferences
    },
    enabled: isAuthenticated
  })
}

// 自定义hook：获取当前用户状态
export const useCurrentUser = () => {
  const user = useUserStore((state) => state.user)
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const isLoading = useUserStore((state) => state.isLoading)
  const error = useUserStore((state) => state.error)
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin: user?.role === 'admin',
    isPremium: user?.subscription?.type === 'premium' || user?.subscription?.type === 'vip'
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
  const clearError = useUserStore((state) => state.clearError)

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
    clearError,
    
    // 加载状态
    isLoading: loginMutation.isPending || 
               registerMutation.isPending || 
               logoutMutation.isPending ||
               forgotPasswordMutation.isPending ||
               resetPasswordMutation.isPending ||
               verifyEmailMutation.isPending ||
               currentUser.isLoading,
    
    // 错误状态
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    verifyEmailError: verifyEmailMutation.error
  }
}