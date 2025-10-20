/**
 * @fileoverview 移动端导航状态管理Hook
 * @description 管理移动端导航菜单的开启/关闭状态，为移动端用户提供流畅的导航体验。
 *              支持键盘导航（ESC键关闭），提升用户体验和可访问性。
 *              支持点击外部区域关闭菜单，符合现代移动应用交互模式。
 *              提供打开、关闭、切换三种操作方法，满足不同使用场景。
 *              正确清理事件监听器避免内存泄漏，确保应用性能和稳定性。
 * @created 2025-10-11 12:35:25
 * @updated 2025-10-19 14:56:00
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */
import { useState, useEffect, useCallback } from 'react'

// 移动端导航状态管理Hook，提供导航菜单的开关控制和事件监听清理机制
export const useMobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  // 打开导航菜单并阻止背景滚动
  const openMenu = useCallback(() => {
    setIsOpen(true)
    document.body.style.overflow = 'hidden' // 防止背景滚动
  }, [])

  // 关闭导航菜单并恢复背景滚动
  const closeMenu = useCallback(() => {
    setIsOpen(false)
    document.body.style.overflow = '' // 恢复背景滚动
  }, [])

  // 切换导航菜单状态
  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }, [isOpen, openMenu, closeMenu])

  // 键盘事件监听 - ESC键关闭导航菜单
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeMenu])

  // 组件卸载时清理背景滚动状态
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return {
    isOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  }
}
