/**
 * @fileoverview 客户端用户状态管理 - 仅管理客户端用户交互状态
 * @description 管理本地认证状态、临时数据，不涉及API调用
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// 用户类型定义（由TanStack Query管理的数据）
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

// 客户端用户状态管理接口
interface ClientUserState {
  // 客户端状态
  isAuthenticated: boolean
  currentUserId: string | null
  sessionExpiry: number | null // 时间戳

  // UI相关状态
  isProfileMenuOpen: boolean
  showPasswordReset: boolean
  showEmailVerification: boolean

  // 临时表单数据
  tempFormData: {
    email?: string
    username?: string
    rememberMe?: boolean
  }

  // 客户端操作（不涉及API）
  setAuthenticated: (isAuthenticated: boolean, userId?: string) => void
  setSessionExpiry: (expiry: number) => void
  setProfileMenuOpen: (open: boolean) => void
  setShowPasswordReset: (show: boolean) => void
  setShowEmailVerification: (show: boolean) => void
  setTempFormData: (data: Partial<ClientUserState['tempFormData']>) => void
  clearTempFormData: () => void
  checkSessionExpiry: () => boolean
  logoutClient: () => void
}

// 创建客户端用户状态管理store
export const useUserClientStore = create<ClientUserState>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        isAuthenticated: false,
        currentUserId: null,
        sessionExpiry: null,

        isProfileMenuOpen: false,
        showPasswordReset: false,
        showEmailVerification: false,

        tempFormData: {},

        // 设置认证状态
        setAuthenticated: (isAuthenticated, userId) =>
          set({
            isAuthenticated,
            currentUserId: userId || null,
          }),

        // 设置会话过期时间
        setSessionExpiry: expiry => set({ sessionExpiry: expiry }),

        // 设置个人资料菜单状态
        setProfileMenuOpen: open => set({ isProfileMenuOpen: open }),

        // 设置密码重置显示状态
        setShowPasswordReset: show => set({ showPasswordReset: show }),

        // 设置邮箱验证显示状态
        setShowEmailVerification: show => set({ showEmailVerification: show }),

        // 设置临时表单数据
        setTempFormData: data =>
          set(state => ({
            tempFormData: { ...state.tempFormData, ...data },
          })),

        // 清除临时表单数据
        clearTempFormData: () => set({ tempFormData: {} }),

        // 检查会话是否过期
        checkSessionExpiry: () => {
          const { sessionExpiry } = get()
          if (!sessionExpiry) return false

          const isExpired = Date.now() > sessionExpiry
          if (isExpired) {
            // 会话过期，清除认证状态
            get().logoutClient()
          }
          return !isExpired
        },

        // 客户端登出（仅清除本地状态，不调用API）
        logoutClient: () =>
          set({
            isAuthenticated: false,
            currentUserId: null,
            sessionExpiry: null,
            isProfileMenuOpen: false,
            showPasswordReset: false,
            showEmailVerification: false,
            tempFormData: {},
          }),
      }),
      {
        name: 'user-client-storage',
        partialize: state => ({
          isAuthenticated: state.isAuthenticated,
          currentUserId: state.currentUserId,
          sessionExpiry: state.sessionExpiry,
        }),
      }
    ),
    {
      name: 'user-client-store',
    }
  )
)

// 选择器函数
export const selectIsAuthenticated = (state: ClientUserState) =>
  state.isAuthenticated
export const selectCurrentUserId = (state: ClientUserState) =>
  state.currentUserId
export const selectSessionExpiry = (state: ClientUserState) =>
  state.sessionExpiry
export const selectIsProfileMenuOpen = (state: ClientUserState) =>
  state.isProfileMenuOpen
export const selectTempFormData = (state: ClientUserState) => state.tempFormData

// 兼容性导出（保持向后兼容）
export const useUserStore = useUserClientStore
