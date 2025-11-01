/**
 * @fileoverview VIP标签组件
 * @description 显示VIP标识的标签组件，具有金色渐变背景和深棕色文字
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'

// VIP标签组件Props接口
interface VipBadgeProps {
    className?: string
}

// VIP标签组件，显示金色渐变背景的VIP标识
export const VipBadge: React.FC<VipBadgeProps> = ({ className = '' }) => {
    return (
        <span
            className={`inline-flex items-center justify-center rounded-lg font-bold whitespace-nowrap ${className}`}
            style={{
                background: 'linear-gradient(90deg, #F5E6C8 0%, #F4D03F 100%)',
                color: '#5D4E37',
                fontSize: '0.55em',
                verticalAlign: 'baseline',
                padding: '0.3em 0.4em',
                lineHeight: '1',
                transform: 'translateY(-0.25em)',
                borderRadius: '0.4em',
            }}
        >
            VIP
        </span>
    )
}
