import { useState, useEffect, useCallback } from 'react'

/**
 * 移动端导航状态管理Hook
 *
 * 功能：
 * - 管理移动端导航菜单的开启/关闭状态
 * - 支持键盘导航（ESC键关闭）
 * - 支持点击外部区域关闭菜单
 * - 提供打开、关闭、切换三种操作方法
 * - 正确清理事件监听器避免内存泄漏
 */
export const useMobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  // 打开菜单
  const openMenu = useCallback(() => {
    setIsOpen(true)
    // 防止背景滚动
    document.body.style.overflow = 'hidden'
  }, [])

  // 关闭菜单
  const closeMenu = useCallback(() => {
    setIsOpen(false)
    // 恢复背景滚动
    document.body.style.overflow = ''
  }, [])

  // 切换菜单状态
  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu()
    } else {
      openMenu()
    }
  }, [isOpen, openMenu, closeMenu])

  // 键盘事件处理 - ESC键关闭菜单
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

  // 组件卸载时清理状态
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
