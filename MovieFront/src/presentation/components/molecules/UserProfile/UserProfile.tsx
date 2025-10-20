import { Avatar, Button, Icon, Badge } from '@components/atoms'
import { cn } from '@utils/cn'
import { formatDate, formatNumber } from '@utils/formatters'
import React, { useState } from 'react'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: 'user' | 'vip' | 'admin'
  joinDate: string
  downloadCount: number
  favoriteCount: number
  isOnline?: boolean
}

export interface UserProfileProps {
  user: User
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
  showStats?: boolean
  onEdit?: () => void
  onMessage?: () => void
  onFollow?: () => void
  onBlock?: () => void
  className?: string
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  variant = 'default',
  showActions = true,
  showStats = true,
  onEdit,
  onMessage,
  onFollow,
  onBlock,
  className,
}) => {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    onFollow?.()
  }

  // 角色徽章配置
  const getRoleBadge = (role: User['role']) => {
    const roleConfig = {
      user: { label: '普通用户', variant: 'secondary' as const },
      vip: { label: 'VIP会员', variant: 'warning' as const },
      admin: { label: '管理员', variant: 'primary' as const },
    }
    return roleConfig[role]
  }

  // 紧凑模式
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

  // 详细模式
  if (variant === 'detailed') {
    return (
      <div
        className={cn('rounded-xl border bg-white p-6 shadow-sm', className)}
      >
        {/* 头部信息 */}
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

        {/* 统计信息 */}
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

        {/* 操作按钮 */}
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

  // 默认模式
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
