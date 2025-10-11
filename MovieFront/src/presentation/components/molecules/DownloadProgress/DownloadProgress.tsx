import { Button, Icon, Badge } from '@components/atoms'
import { cn } from '@utils/cn'
import {
  formatFileSize,
  formatDownloadSpeed,
  formatTime,
} from '@utils/formatters'
import React from 'react'

export interface DownloadItem {
  id: string
  movieTitle: string
  fileName: string
  fileSize: number
  downloadedSize: number
  progress: number
  speed: number
  status:
    | 'pending'
    | 'downloading'
    | 'paused'
    | 'completed'
    | 'error'
    | 'cancelled'
  estimatedTime?: number
  error?: string
}

export interface DownloadProgressProps {
  download: DownloadItem
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
  onPause?: (downloadId: string) => void
  onResume?: (downloadId: string) => void
  onCancel?: (downloadId: string) => void
  onRetry?: (downloadId: string) => void
  onRemove?: (downloadId: string) => void
  className?: string
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({
  download,
  variant = 'default',
  showActions = true,
  onPause,
  onResume,
  onCancel,
  onRetry,
  onRemove,
  className,
}) => {
  // 获取状态配置
  const getStatusConfig = (status: DownloadItem['status']) => {
    const configs = {
      pending: {
        label: '等待中',
        variant: 'secondary' as const,
        icon: 'clock' as const,
        color: 'text-gray-500',
      },
      downloading: {
        label: '下载中',
        variant: 'primary' as const,
        icon: 'download' as const,
        color: 'text-blue-600',
      },
      paused: {
        label: '已暂停',
        variant: 'warning' as const,
        icon: 'pause' as const,
        color: 'text-yellow-600',
      },
      completed: {
        label: '已完成',
        variant: 'success' as const,
        icon: 'check' as const,
        color: 'text-green-600',
      },
      error: {
        label: '下载失败',
        variant: 'danger' as const,
        icon: 'x' as const,
        color: 'text-red-600',
      },
      cancelled: {
        label: '已取消',
        variant: 'secondary' as const,
        icon: 'x' as const,
        color: 'text-gray-500',
      },
    }
    return configs[status]
  }

  const statusConfig = getStatusConfig(download.status)

  // 紧凑模式
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg border bg-white p-3',
          className
        )}
      >
        <Icon name={statusConfig.icon} className={statusConfig.color} />

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between">
            <h4 className="truncate text-sm font-medium text-gray-900">
              {download.movieTitle}
            </h4>
            <span className="text-xs text-gray-500">{download.progress}%</span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-gray-200">
            <div
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                download.status === 'error'
                  ? 'bg-red-500'
                  : download.status === 'completed'
                    ? 'bg-green-500'
                    : 'bg-blue-500'
              )}
              style={{ width: `${download.progress}%` }}
            />
          </div>
        </div>

        {showActions && (
          <div className="flex gap-1">
            {download.status === 'downloading' && onPause && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Icon name="pause" />}
                onClick={() => onPause(download.id)}
              />
            )}
            {download.status === 'paused' && onResume && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Icon name="play" />}
                onClick={() => onResume(download.id)}
              />
            )}
            {download.status === 'error' && onRetry && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Icon name="refresh" />}
                onClick={() => onRetry(download.id)}
              />
            )}
            {onCancel &&
              ['pending', 'downloading', 'paused'].includes(
                download.status
              ) && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Icon name="x" />}
                  onClick={() => onCancel(download.id)}
                />
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
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-1 font-semibold text-gray-900">
              {download.movieTitle}
            </h3>
            <p className="mb-2 text-sm text-gray-600">{download.fileName}</p>
            <Badge variant={statusConfig.variant} size="sm">
              <Icon name={statusConfig.icon} size="sm" className="mr-1" />
              {statusConfig.label}
            </Badge>
          </div>

          <div className="text-right">
            <div className="mb-1 text-2xl font-bold text-gray-900">
              {download.progress}%
            </div>
            <div className="text-sm text-gray-500">
              {formatFileSize(download.downloadedSize)} /{' '}
              {formatFileSize(download.fileSize)}
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-4">
          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className={cn(
                'h-3 rounded-full transition-all duration-300',
                download.status === 'error'
                  ? 'bg-red-500'
                  : download.status === 'completed'
                    ? 'bg-green-500'
                    : 'bg-blue-500'
              )}
              style={{ width: `${download.progress}%` }}
            />
          </div>
        </div>

        {/* 详细信息 */}
        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">下载速度:</span>
            <span className="ml-2 font-medium">
              {download.status === 'downloading'
                ? formatDownloadSpeed(download.speed)
                : '--'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">剩余时间:</span>
            <span className="ml-2 font-medium">
              {download.estimatedTime && download.status === 'downloading'
                ? formatTime(download.estimatedTime)
                : '--'}
            </span>
          </div>
        </div>

        {/* 错误信息 */}
        {download.status === 'error' && download.error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="flex items-center gap-2 text-red-700">
              <Icon name="x" size="sm" />
              <span className="text-sm font-medium">下载失败</span>
            </div>
            <p className="mt-1 text-sm text-red-600">{download.error}</p>
          </div>
        )}

        {/* 操作按钮 */}
        {showActions && (
          <div className="flex gap-3">
            {download.status === 'downloading' && onPause && (
              <Button
                variant="outline"
                icon={<Icon name="pause" />}
                onClick={() => onPause(download.id)}
              >
                暂停
              </Button>
            )}
            {download.status === 'paused' && onResume && (
              <Button
                variant="primary"
                icon={<Icon name="play" />}
                onClick={() => onResume(download.id)}
              >
                继续
              </Button>
            )}
            {download.status === 'error' && onRetry && (
              <Button
                variant="primary"
                icon={<Icon name="refresh" />}
                onClick={() => onRetry(download.id)}
              >
                重试
              </Button>
            )}
            {onCancel &&
              ['pending', 'downloading', 'paused'].includes(
                download.status
              ) && (
                <Button
                  variant="outline"
                  icon={<Icon name="x" />}
                  onClick={() => onCancel(download.id)}
                >
                  取消
                </Button>
              )}
            {onRemove &&
              ['completed', 'error', 'cancelled'].includes(download.status) && (
                <Button
                  variant="ghost"
                  icon={<Icon name="trash" />}
                  onClick={() => onRemove(download.id)}
                >
                  移除
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
        <Icon
          name={statusConfig.icon}
          className={statusConfig.color}
          size="lg"
        />

        <div className="flex-1">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-medium text-gray-900">{download.movieTitle}</h4>
            <Badge variant={statusConfig.variant} size="sm">
              {statusConfig.label}
            </Badge>
          </div>

          <div className="mb-2">
            <div className="mb-1 flex justify-between text-sm text-gray-600">
              <span>{download.progress}%</span>
              <span>
                {formatFileSize(download.downloadedSize)} /{' '}
                {formatFileSize(download.fileSize)}
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  download.status === 'error'
                    ? 'bg-red-500'
                    : download.status === 'completed'
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                )}
                style={{ width: `${download.progress}%` }}
              />
            </div>
          </div>

          {download.status === 'downloading' && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatDownloadSpeed(download.speed)}</span>
              {download.estimatedTime && (
                <span>剩余 {formatTime(download.estimatedTime)}</span>
              )}
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2">
            {download.status === 'downloading' && onPause && (
              <Button
                variant="outline"
                size="sm"
                icon={<Icon name="pause" />}
                onClick={() => onPause(download.id)}
              />
            )}
            {download.status === 'paused' && onResume && (
              <Button
                variant="outline"
                size="sm"
                icon={<Icon name="play" />}
                onClick={() => onResume(download.id)}
              />
            )}
            {download.status === 'error' && onRetry && (
              <Button
                variant="outline"
                size="sm"
                icon={<Icon name="refresh" />}
                onClick={() => onRetry(download.id)}
              />
            )}
            {onCancel &&
              ['pending', 'downloading', 'paused'].includes(
                download.status
              ) && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Icon name="x" />}
                  onClick={() => onCancel(download.id)}
                />
              )}
          </div>
        )}
      </div>
    </div>
  )
}

export { DownloadProgress }
