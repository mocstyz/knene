/**
 * @fileoverview 用户仓储接口定义
 * @description 定义用户相关的数据访问接口，包含用户的创建、查询、更新、删除、认证等操作规范
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { User } from '@domain/entities/User'

// 用户仓储接口，定义用户数据访问规范
export interface UserRepository {
  // 创建新用户
  create(user: User): Promise<User>
  // 根据ID查找用户
  findById(id: string): Promise<User | null>
  // 根据邮箱查找用户
  findByEmail(email: string): Promise<User | null>
  // 根据条件查找用户列表
  findAll(filters?: {
    role?: string // 用户角色
    status?: string // 用户状态
    search?: string // 搜索关键词
  }): Promise<User[]>
  // 更新用户信息
  update(user: User): Promise<User>
  // 删除用户
  delete(id: string): Promise<boolean>
  // 更新用户资料
  updateProfile(userId: string, profile: Partial<User>): Promise<User>
  // 更新用户偏好设置
  updatePreferences(
    userId: string,
    preferences: Record<string, any>
  ): Promise<User>
  // 获取用户统计信息
  getUserStats(userId: string): Promise<{
    downloadsCount: number // 下载数量
    favoritesCount: number // 收藏数量
    messagesCount: number // 消息数量
  }>
}
