/**
 * @fileoverview 悬停交互层组件
 * @description 提供统一的悬停状态管理逻辑，遵循DRY原则，作为hover效果的控制器和状态管理器，可配合其他hover层使用。
 *              支持延迟触发、状态回调、点击外部关闭等高级交互功能，提供灵活的悬停行为控制。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { cn } from '@utils/cn'
import React, { useState, useCallback, useRef, useEffect } from 'react'

// 悬停交互层组件属性接口，定义悬停状态管理的配置选项
export interface HoverInteractionLayerProps {
  className?: string // 自定义CSS类名
  children?: React.ReactNode // 子元素内容
  enabled?: boolean // 是否启用hover状态管理，默认true
  delay?: number // hover延迟时间（毫秒），默认0
  onHoverEnter?: () => void // hover进入回调函数
  onHoverLeave?: () => void // hover离开回调函数
  clickOutsideToClose?: boolean // 是否启用点击外部关闭功能，默认false
  containerClassName?: string // 容器自定义样式类名
}

// 悬停交互层组件，提供统一的hover状态管理功能，支持延迟、回调等高级特性
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

  // 定时器清理函数 - 清除悬停延迟定时器
  const clearHoverTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // 鼠标进入处理 - 管理hover进入事件和延迟逻辑
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

  // 鼠标离开处理 - 清理状态并触发离开回调
  const handleMouseLeave = useCallback(() => {
    if (!enabled) return

    clearHoverTimeout()
    setIsHovered(false)
    onHoverLeave?.()
  }, [enabled, onHoverLeave, clearHoverTimeout])

  // 点击外部关闭功能 - 监听全局点击事件，点击组件外部时关闭hover状态
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

  // 组件卸载时清理定时器 - 防止内存泄漏
  useEffect(() => {
    return () => {
      clearHoverTimeout()
    }
  }, [clearHoverTimeout])

  // 样式类名组合 - 构建容器和包装器的CSS类名
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
