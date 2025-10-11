/**
 * 认证相关类型定义
 */

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    username: string
    avatar?: string
    role: string
    isActive: boolean
    createdAt: string
    updatedAt: string
  }
  token: string
  refreshToken: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface EmailVerification {
  token: string
}
