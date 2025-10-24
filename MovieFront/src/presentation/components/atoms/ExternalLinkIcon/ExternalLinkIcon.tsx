/**
 * @fileoverview 外部链接图标组件
 * @description 提供Douban、IMDb、TMDb等外部影片网站的图标链接组件
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import React from 'react'
import { cn } from '@utils/cn'

// 外部链接图标组件属性接口
export interface ExternalLinkIconProps {
    type: 'douban' | 'imdb' | 'tmdb' // 图标类型
    url: string // 链接地址
    size?: 'sm' | 'md' | 'lg' // 图标尺寸
    className?: string // 自定义样式类名
}

// 外部链接图标组件，展示外部影片网站的图标并提供跳转链接
export const ExternalLinkIcon: React.FC<ExternalLinkIconProps> = ({
    type,
    url,
    size = 'md',
    className,
}) => {
    // 尺寸映射
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
    }

    // 渲染Douban图标
    const renderDoubanIcon = () => (
        <svg
            fill="#3dc78b"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="-9.4 -9.4 112.80 112.80"
            xmlSpace="preserve"
            className={cn(sizeClasses[size], className)}
            aria-label="Douban"
        >
            <g>
                <polygon points="19.283,62.614 28.369,62.614 31.236,52.816 16.233,52.816" />
                <polygon points="53.229,42.223 55.486,42.223 56.045,33.148 52.67,33.148" />
                <rect x="13.754" y="40.06" width="20.619" height="8.211" />
                <path d="M89,0H5C2.238,0,0,2.239,0,5v84c0,2.761,2.238,5,5,5h84c2.762,0,5-2.239,5-5V5C94,2.239,91.762,0,89,0z M44.241,66.507 H3.45v-3.893h10.066l-3.05-9.798H6.873V35.637h34.166v17.181h-4.036l-2.866,9.797h10.104V66.507z M44.426,31.318H3.641V26.81 h40.785V31.318z M53.174,67.803l-3.92-1.72c0.027-0.063,2.528-5.815,2.922-10.065l-3.865,0.698v-4.174l3.918-0.646v-5.393h-4.638 v-4.281h2.181l-0.56-9.075h-0.703v-3.451h4.116v-3.391h3.451v3.391h4.152v3.451h-0.728l-0.558,9.075h1.642v4.281h-4.077v4.78 l3-0.587v4.051l-3.005,0.466C56.406,60.376,53.309,67.496,53.174,67.803z M75.665,67.41c-3.541-5.622-3.333-14.434-3.308-15.182 V30.435l-2.213,0.492V62.23l2.379-0.006v3.69l-8.729,0.964l-0.037-0.327v-4.305l2.718-0.006v-30.5l-1.966,0.437v22.787 c0,4.616-3.427,12.391-3.571,12.721l-3.354-1.486c0.905-2.045,3.257-8.047,3.257-11.234V29.234l13.364-3.038l2.821,3.389l-1,0.239 L76.023,52.33c-0.004,0.086-0.279,8.814,2.99,13.498l0.506,0.613C78.23,66.74,76.947,67.061,75.665,67.41z M90.55,46.504h-4.587 v5.197h3.898v4.283h-3.898v11.313h-4.279V55.984h-3.898v-4.283h3.898v-5.197h-4.588v-4.281H79.2l-0.837-8.804h-1.053v-3.914h4.662 v-3.2h3.67v3.2h4.664v3.914h-1.17l-0.593,8.804h2.006V46.504z" />
                <polygon points="82.893,42.223 84.852,42.223 85.441,33.419 82.057,33.419" />
            </g>
        </svg>
    )

    // 渲染IMDb图标
    const renderImdbIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className={cn(sizeClasses[size], className)}
            aria-label="IMDb"
        >
            <rect width="512" height="512" rx="15%" fill="#f5c518" />
            <path d="M104 328V184H64v144zM189 184l-9 67-5-36-5-31h-50v144h34v-95l14 95h25l13-97v97h34V184zM256 328V184h62c15 0 26 11 26 25v94c0 14-11 25-26 25zm47-118l-9-1v94c5 0 9-1 10-3 2-2 2-8 2-18v-56-12l-3-4zM419 220h3c14 0 26 11 26 25v58c0 14-12 25-26 25h-3c-8 0-16-4-21-11l-2 9h-36V184h38v46c5-6 13-10 21-10zm-8 70v-34l-1-11c-1-2-4-3-6-3s-5 1-6 3v57c1 2 4 3 6 3s6-1 6-3l1-12z" />
        </svg>
    )

    // 渲染TMDb图标
    const renderTmdbIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className={cn(sizeClasses[size], className)}
            aria-label="TMDb"
        >
            <path
                fill="currentColor"
                d="M25.99 29.198c2.807 0 4.708-1.896 4.708-4.708v-19.781c0-2.807-1.901-4.708-4.708-4.708h-19.979c-2.807 0-4.708 1.901-4.708 4.708v27.292l2.411-2.802v-24.49c0.005-1.266 1.031-2.292 2.297-2.292h19.974c1.266 0 2.292 1.026 2.292 2.292v19.781c0 1.266-1.026 2.292-2.292 2.292h-16.755l-2.417 2.417-0.016-0.016zM11.714 15.286h-2.26v7.599h2.26c5.057 0 5.057-7.599 0-7.599zM11.714 21.365h-0.734v-4.557h0.734c2.958 0 2.958 4.557 0 4.557zM11.276 13.854h1.516v-6.083h1.891v-1.505h-5.302v1.505h1.896zM18.75 9.599l-2.625-3.333h-0.49v7.714h1.542v-4.24l1.573 2.042 1.578-2.042-0.010 4.24h1.542v-7.714h-0.479zM21.313 19.089c0.474-0.333 0.677-0.922 0.698-1.5 0.031-1.339-0.807-2.307-2.156-2.307h-3.005v7.609h3.005c1.24-0.010 2.245-1.021 2.245-2.26v-0.036c0-0.62-0.307-1.172-0.781-1.5zM18.37 16.802h1.354c0.432 0 0.698 0.339 0.698 0.766 0.031 0.406-0.286 0.76-0.698 0.76h-1.354zM19.724 21.37h-1.354v-1.516h1.37c0.411 0 0.745 0.333 0.745 0.745v0.016c0 0.417-0.333 0.755-0.75 0.755z"
            />
        </svg>
    )

    // 根据类型渲染对应的图标
    const renderIcon = () => {
        switch (type) {
            case 'douban':
                return renderDoubanIcon()
            case 'imdb':
                return renderImdbIcon()
            case 'tmdb':
                return renderTmdbIcon()
            default:
                return null
        }
    }

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label={`View on ${type.toUpperCase()}`}
        >
            {renderIcon()}
        </a>
    )
}

export default ExternalLinkIcon
