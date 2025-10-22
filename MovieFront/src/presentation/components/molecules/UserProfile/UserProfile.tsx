/**
 * @fileoverview 用户资料组件
 * @description 提供用户资料展示功能，支持紧凑、默认、详细三种显示模式，包含头像、基本信息、统计数据和操作按钮
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { Avatar, Button, Icon, Badge } from '@components/atoms'
import { cn } from '@utils/cn'
import { formatDate, formatNumber } from '@utils/formatters'
import React, { useState } from 'react'

// 用户数据接口，定义用户的基本信息和统计数据
export interface User {
  id: string // 用户唯一标识
  username: string // 用户名
  email: string // 邮箱地址
  avatar?: string // 头像URL
  role: 'user' | 'vip' | 'admin' // 用户角色
  joinDate: string // 加入日期
  downloadCount: number // 下载次数
  favoriteCount: number // 收藏数量
  isOnline?: boolean // 在线状态
}

// 用户资料组件属性接口，定义组件的完整配置参数
export interface UserProfileProps {
  user: User // 用户数据
  variant?: 'default' | 'compact' | 'detailed' // 显示变体
  showActions?: boolean // 是否显示操作按钮
  showStats?: boolean // 是否显示统计信息
  onEdit?: () => void // 编辑资料回调函数
  onMessage?: () => void // 发送消息回调函数
  onFollow?: () => void // 关注用户回调函数
  onBlock?: () => void // 屏蔽用户回调函数
  className?: string // 自定义CSS类名
}

// 用户资料组件，提供完整的用户资料展示和交互功能
const UserProfile: React.FC<UserProfileProps> = ({
  user, // 用户数据
  variant = 'default', // 显示变体，默认default
  showActions = true, // 是否显示操作按钮，默认显示
  showStats = true, // 是否显示统计信息，默认显示
  onEdit, // 编辑资料回调函数
  onMessage, // 发送消息回调函数
  onFollow, // 关注用户回调函数
  onBlock, // 屏蔽用户回调函数
  className, // 自定义CSS类名
}) => {
  const [isFollowing, setIsFollowing] = useState(false) // 关注状态

  // 处理关注按钮点击
  const handleFollow = () => {
    setIsFollowing(!isFollowing) // 切换关注状态
    onFollow?.() // 执行关注回调
  }

  // 获取角色徽章配置 - 根据用户角色返回对应的标签和样式
  const getRoleBadge = (role: User['role']) => {
    const roleConfig = {
      user: { label: '普通用户', variant: 'secondary' as const },
      vip: { label: 'VIP会员', variant: 'warning' as const },
      admin: { label: '管理员', variant: 'primary' as const },
    }
    return roleConfig[role]
  }

  // 紧凑模式渲染 - 显示最小化的用户信息
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border bg-white p-3',
          className
        )}
      >
        <div className="relative">
          <Avatar
            src={user.avatar}
            alt={user.username}
            size="md"
            fallback={user.username.charAt(0).toUpperCase()}
          />
          {/* 在线状态指示器 */}
          {user.isOnline && (
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium text-gray-900">
              {user.username}
            </h3>
            <Badge {...getRoleBadge(user.role)} size="sm">
              {getRoleBadge(user.role).label}
            </Badge>
          </div>
          <p className="truncate text-sm text-gray-500">{user.email}</p>
        </div>

        {showActions && (
          <div className="flex gap-1">
            {onMessage && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Icon name="message" />}
              />
            )}
            {onEdit && (
              <Button variant="ghost" size="sm" icon={<Icon name="edit" />} />
            )}
          </div>
        )}
      </div>
    )
  }

  // 详细模式渲染 - 显示完整的用户信息和统计数据
  if (variant === 'detailed') {
    return (
      <div
        className={cn('rounded-xl border bg-white p-6 shadow-sm', className)}
      >
        {/* 头部信息区域 - 包含头像、用户名、角色徽章和基本信息 */}
        <div className="mb-6 flex items-start gap-4">
          <div className="relative">
            <Avatar
              src={user.avatar}
              alt={user.username}
              size="xl"
              fallback={user.username.charAt(0).toUpperCase()}
            />
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
            )}
          </div>

          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.username}
              </h2>
              <Badge {...getRoleBadge(user.role)}>
                {getRoleBadge(user.role).label}
              </Badge>
            </div>

            <p className="mb-2 text-gray-600">{user.email}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Icon name="calendar" size="sm" />
                加入于 {formatDate(user.joinDate)}
              </span>
              {user.isOnline && (
                <span className="flex items-center gap-1 text-green-600">
                  <Icon name="check" size="sm" />
                  在线
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 统计信息区域 - 显示下载次数和收藏数量 */}
        {showStats && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <div className="mb-1 text-2xl font-bold text-gray-900">
                {formatNumber(user.downloadCount)}
              </div>
              <div className="text-sm text-gray-500">下载次数</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <div className="mb-1 text-2xl font-bold text-gray-900">
                {formatNumber(user.favoriteCount)}
              </div>
              <div className="text-sm text-gray-500">收藏影片</div>
            </div>
          </div>
        )}

        {/* 操作按钮区域 - 根据功能显示相应的操作按钮 */}
        {showActions && (
          <div className="flex gap-3">
            {onMessage && (
              <Button
                variant="primary"
                icon={<Icon name="message" />}
                onClick={onMessage}
              >
                发消息
              </Button>
            )}
            {onFollow && (
              <Button
                variant={isFollowing ? 'outline' : 'secondary'}
                icon={<Icon name={isFollowing ? 'check' : 'plus'} />}
                onClick={handleFollow}
              >
                {isFollowing ? '已关注' : '关注'}
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                icon={<Icon name="edit" />}
                onClick={onEdit}
              >
                编辑资料
              </Button>
            )}
            {onBlock && (
              <Button
                variant="ghost"
                icon={<Icon name="x" />}
                onClick={onBlock}
              >
                屏蔽
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  // 默认模式渲染 - 显示标准的用户资料信息布局
  return (
    <div className={cn('rounded-lg border bg-white p-4 shadow-sm', className)}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar
            src={user.avatar}
            alt={user.username}
            size="lg"
            fallback={user.username.charAt(0).toUpperCase()}
          />
          {/* 在线状态指示器 */}
          {user.isOnline && (
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>

        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{user.username}</h3>
            <Badge {...getRoleBadge(user.role)} size="sm">
              {getRoleBadge(user.role).label}
            </Badge>
          </div>

          <p className="mb-2 text-sm text-gray-600">{user.email}</p>

          {showStats && (
            <div className="flex gap-4 text-sm text-gray-500">
              <span>下载 {user.downloadCount}</span>
              <span>收藏 {user.favoriteCount}</span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2">
            {onMessage && (
              <Button
                variant="outline"
                size="sm"
                icon={<Icon name="message" />}
              />
            )}
            {onEdit && (
              <Button variant="outline" size="sm" icon={<Icon name="edit" />} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export { UserProfile }
