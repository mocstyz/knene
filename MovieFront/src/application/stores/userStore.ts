import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// 用户状态接口
export interface User {
  id: string
  email: string
  username: string
  avatar?: string
  role: 'user' | 'admin' | 'super_admin' | 'moderator' | 'vip'
  status: 'active' | 'suspended' | 'pending_verification' | 'inactive'
  permissions?: string[]
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: 'zh-CN' | 'en-US'
    autoPlay: boolean
    downloadQuality: 'low' | 'medium' | 'high' | 'ultra'
    autoDownload: boolean
    downloadPath: string
    emailNotifications: boolean
    pushNotifications: boolean
  }
  subscription?: {
    type: 'free' | 'premium' | 'vip'
    expiresAt?: Date
  }
}

// 用户状态管理接口
interface UserState {
  // 状态
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // 操作
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: RegisterData) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  updatePreferences: (preferences: Partial<User['preferences']>) => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

// 注册数据接口
interface RegisterData {
  email: string
  username: string
  password: string
  confirmPassword: string
}

// 创建用户状态管理store
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // 登录操作
        login: async (email: string, _password: string) => {
          set({ isLoading: true, error: null })
          
          try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // 模拟登录成功
            const mockUser: User = {
              id: '1',
              email,
              username: email.split('@')[0],
              avatar: 'https://via.placeholder.com/100x100/0066cc/ffffff?text=U',
              role: 'user',
              status: 'active',
              permissions: ['read', 'download'],
              preferences: {
                theme: 'system',
                language: 'zh-CN',
                autoPlay: true,
                downloadQuality: 'high',
                autoDownload: false,
                downloadPath: '/downloads',
                emailNotifications: true,
                pushNotifications: true
              },
              subscription: {
                type: 'free'
              }
            }

            set({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '登录失败'
            })
          }
        },

        // 登出操作
        logout: () => {
          set({
            user: null,
            isAuthenticated: false,
            error: null
          })
        },

        // 注册操作
        register: async (userData: RegisterData) => {
          set({ isLoading: true, error: null })
          
          try {
            // 验证密码匹配
            if (userData.password !== userData.confirmPassword) {
              throw new Error('密码不匹配')
            }

            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // 模拟注册成功后自动登录
            const mockUser: User = {
              id: Date.now().toString(),
              email: userData.email,
              username: userData.username,
              role: 'user',
              status: 'active',
              permissions: ['read', 'download'],
              preferences: {
                theme: 'system',
                language: 'zh-CN',
                autoPlay: true,
                downloadQuality: 'high',
                autoDownload: false,
                downloadPath: '/downloads',
                emailNotifications: true,
                pushNotifications: true
              },
              subscription: {
                type: 'free'
              }
            }

            set({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '注册失败'
            })
          }
        },

        // 更新用户资料
        updateProfile: async (updates: Partial<User>) => {
          const { user } = get()
          if (!user) return

          set({ isLoading: true, error: null })
          
          try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 800))
            
            const updatedUser = { ...user, ...updates }
            set({
              user: updatedUser,
              isLoading: false,
              error: null
            })
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '更新失败'
            })
          }
        },

        // 更新用户偏好设置
        updatePreferences: async (preferences: Partial<User['preferences']>) => {
          const { user } = get()
          if (!user) return

          set({ isLoading: true, error: null })
          
          try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const updatedUser = {
              ...user,
              preferences: { ...user.preferences, ...preferences }
            }
            
            set({
              user: updatedUser,
              isLoading: false,
              error: null
            })
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '更新偏好设置失败'
            })
          }
        },

        // 清除错误
        clearError: () => {
          set({ error: null })
        },

        // 设置加载状态
        setLoading: (loading: boolean) => {
          set({ isLoading: loading })
        }
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated
        })
      }
    ),
    {
      name: 'user-store'
    }
  )
)

// 选择器函数
export const selectUser = (state: UserState) => state.user
export const selectIsAuthenticated = (state: UserState) => state.isAuthenticated
export const selectIsLoading = (state: UserState) => state.isLoading
export const selectError = (state: UserState) => state.error