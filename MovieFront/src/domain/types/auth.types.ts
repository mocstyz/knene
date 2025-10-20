/**
 * @fileoverview 认证领域类型定义
 * @description 定义用户认证相关的类型接口，包括登录凭证、注册数据、认证响应、密码重置和邮箱验证等核心类型
 * @created 2025-10-02 20:57:29
 * @updated 2025-10-19 13:56:30
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 用户登录凭证接口，包含邮箱和密码验证信息
export interface LoginCredentials {
  email: string
  password: string
}

// 用户注册数据接口，包含基本信息和密码确认
export interface RegisterData {
  email: string
  username: string
  password: string
  confirmPassword: string // 确认密码，用于验证密码输入一致性
}

// 认证响应接口，包含用户信息和访问令牌
export interface AuthResponse {
  user: {
    id: string
    email: string
    username: string
    avatar?: string // 用户头像URL，可选
    role: string // 用户角色，如 'admin' | 'user' | 'vip'
    isActive: boolean // 账户激活状态
    createdAt: string
    updatedAt: string
  }
  token: string // JWT访问令牌
  refreshToken: string // 刷新令牌，用于获取新的访问令牌
}

// 密码重置请求接口，用于发起密码重置流程
export interface PasswordResetRequest {
  email: string // 用户邮箱，用于发送重置链接
}

// 密码重置确认接口，用于设置新密码
export interface PasswordResetConfirm {
  token: string // 重置令牌，验证用户身份
  newPassword: string // 新密码
  confirmPassword: string // 确认新密码
}

// 邮箱验证接口，用于邮箱地址验证
export interface EmailVerification {
  token: string // 邮箱验证令牌
}
