import React, { useState } from 'react'
import { Avatar, Button, Icon, Badge } from '@/components/atoms'
import { cn } from '@/utils/cn'

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
  className
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
      admin: { label: '管理员', variant: 'primary' as const }
    }
    return roleConfig[role]
  }

  // 紧凑模式
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3 p-3 bg-white rounded-lg border', className)}>
        <div className="relative">
          <Avatar
            src={user.avatar}
            alt={user.username}
            size="md"
            fallback={user.username.charAt(0).toUpperCase()}
          />
          {user.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 truncate">
              {user.username}
            </h3>
            <Badge {...getRoleBadge(user.role)} size="sm">
              {getRoleBadge(user.role).label}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 truncate">
            {user.email}
          </p>
        </div>

        {showActions && (
          <div className="flex gap-1">
            {onMessage && (
              <Button variant="ghost" size="sm" icon={<Icon name="message" />} />
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
      <div className={cn('bg-white rounded-xl shadow-sm border p-6', className)}>
        {/* 头部信息 */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <Avatar
              src={user.avatar}
              alt={user.username}
              size="xl"
              fallback={user.username.charAt(0).toUpperCase()}
            />
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.username}
              </h2>
              <Badge {...getRoleBadge(user.role)}>
                {getRoleBadge(user.role).label}
              </Badge>
            </div>
            
            <p className="text-gray-600 mb-2">{user.email}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Icon name="calendar" size="sm" />
                加入于 {new Date(user.joinDate).toLocaleDateString()}
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
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {user.downloadCount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">下载次数</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {user.favoriteCount.toLocaleString()}
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
                variant={isFollowing ? "outline" : "secondary"}
                icon={<Icon name={isFollowing ? "check" : "plus"} />}
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
    <div className={cn('bg-white rounded-lg shadow-sm border p-4', className)}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar
            src={user.avatar}
            alt={user.username}
            size="lg"
            fallback={user.username.charAt(0).toUpperCase()}
          />
          {user.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">
              {user.username}
            </h3>
            <Badge {...getRoleBadge(user.role)} size="sm">
              {getRoleBadge(user.role).label}
            </Badge>
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{user.email}</p>
          
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
              <Button variant="outline" size="sm" icon={<Icon name="message" />} />
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