/**
 * @fileoverview 路由加载器组件
 * @description 统一的路由懒加载 fallback 组件，支持延迟显示以避免快速加载时的闪烁
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import LoadingSpinner from '@components/atoms/LoadingSpinner'
import React, { useEffect, useState } from 'react'

// 路由加载器组件属性接口
interface RouteLoaderProps {
  delay?: number
  text?: string
}

// 路由加载器组件
const RouteLoader: React.FC<RouteLoaderProps> = ({
  delay = 200,
  text = '页面加载中...',
}) => {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    // 延迟显示，避免快速加载时的闪烁
    const timer = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  
  // 延迟时间内不显示任何内容
  if (!show) return null
  
  return (
    <LoadingSpinner
      size="lg"
      fullscreen
      text={text}
    />
  )
}

export default RouteLoader
