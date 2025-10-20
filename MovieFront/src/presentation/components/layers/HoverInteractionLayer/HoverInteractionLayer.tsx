/**
 * @fileoverview 悬停交互层组件
 * @description 提供统一的悬停状态管理逻辑，遵循DRY原则。
 * 作为hover效果的控制器和状态管理器，可配合其他hover层使用。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React, { useState, useCallback, useRef, useEffect } from 'react'

/**
 * 悬停交互层组件属性接口
 */
export interface HoverInteractionLayerProps {
  /** 自定义CSS类名 */
  className?: string
  /** 子元素 */
  children?: React.ReactNode
  /** 是否启用hover状态管理 */
  enabled?: boolean
  /** hover延迟时间（毫秒） */
  delay?: number
  /** hover进入回调 */
  onHoverEnter?: () => void
  /** hover离开回调 */
  onHoverLeave?: () => void
  /** 是否启用点击外部关闭 */
  clickOutsideToClose?: boolean
  /** 容器样式 */
  containerClassName?: string
}

/**
 * 悬停交互层组件
 *
 * 提供统一的hover状态管理功能，支持延迟、回调等高级特性。
 */
const HoverInteractionLayer: React.FC<HoverInteractionLayerProps> = ({
  className,
  children,
  enabled = true,
  delay = 0,
  onHoverEnter,
  onHoverLeave,
  clickOutsideToClose = false,
  containerClassName,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 清除延迟定时器
  const clearHoverTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // 处理hover进入
  const handleMouseEnter = useCallback(() => {
    if (!enabled) return

    clearHoverTimeout()

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsHovered(true)
        onHoverEnter?.()
      }, delay)
    } else {
      setIsHovered(true)
      onHoverEnter?.()
    }
  }, [enabled, delay, onHoverEnter, clearHoverTimeout])

  // 处理hover离开
  const handleMouseLeave = useCallback(() => {
    if (!enabled) return

    clearHoverTimeout()
    setIsHovered(false)
    onHoverLeave?.()
  }, [enabled, onHoverLeave, clearHoverTimeout])

  // 处理点击外部关闭
  useEffect(() => {
    if (!clickOutsideToClose || !enabled) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsHovered(false)
        onHoverLeave?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [clickOutsideToClose, enabled, onHoverLeave])

  // 清理定时器
  useEffect(() => {
    return () => {
      clearHoverTimeout()
    }
  }, [clearHoverTimeout])

  // 组合CSS类名
  const containerClasses = cn('relative', containerClassName)

  const wrapperClasses = cn(
    'hover-interaction-layer',
    isHovered && 'is-hovered',
    className
  )

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={wrapperClasses}>{children}</div>
    </div>
  )
}

export default HoverInteractionLayer
