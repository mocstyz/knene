/**
 * @fileoverview Tailwind CSS配置文件
 * @description 基于Radix UI Themes + 组件变体Token系统的样式配置。
 * 主要颜色由Radix UI Themes提供，此处仅保留业务特定的扩展配置。
 * 支持暗色模式、响应式设计和自定义工具类。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 2.0.0 - 完全迁移到Radix UI Themes架构
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  safelist: [
    // 强制生成xxl断点的网格类
    'xxl:grid-cols-6',
    // 强制生成group hover效果类
    'group-hover:text-red-500',
    'group-hover:text-primary',
    'group-hover:text-blue-500',
    'group-hover:text-green-500',
    'group-hover:scale-105',
    'group-hover:scale-110',
    'group-hover:scale-102',
    'group',
    'duration-[200ms]',
    'duration-[300ms]',
    'duration-[150ms]',
    'duration-200',
    'duration-300',
    'duration-500',
    'transition-transform',
  ],
  theme: {
    extend: {
      // 自定义断点 - 添加1920px断点
      screens: {
        xxl: '1920px',
      },
      // 注意：主要颜色由Radix UI Themes提供 (accent-1 to accent-12, gray-1 to gray-12)
      // 此处仅保留必要的业务特定扩展
      colors: {
        // 品牌主色 - #6ee7b7
        primary: '#6ee7b7',
        // 业务特定的背景色
        background: {
          light: '#ffffff', // 亮色模式：纯白背景
          dark: '#111827', // 暗色模式：深灰背景
          DEFAULT: '#ffffff',
        },
        // 语义化状态颜色 - 使用Tailwind标准颜色
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      // 文本颜色使用标准Tailwind颜色
      textColor: {
        secondary: '#6b7280',
        muted: '#9ca3af',
      },
      // 字体系统 - HarmonyOS Sans SC（设计令牌驱动）
      fontFamily: {
        // 默认字体族 - 全项目统一使用HarmonyOS Sans SC
        sans: [
          'HarmonyOS Sans SC',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        // 等宽字体 - 保持原有配置
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'Monaco',
          'monospace',
        ],
        // 显示字体 - 用于特殊场景
        display: ['HarmonyOS Sans SC', 'system-ui', 'sans-serif'],
      },
      // 字体大小
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      // 间距系统 - 基于4px网格
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
        4.5: '1.125rem',
        22: '5.5rem',
        30: '7.5rem',
        36: '9rem',
        44: '11rem',
        52: '13rem',
        60: '15rem',
        72: '18rem',
        84: '21rem',
        96: '24rem',
      },
      // 圆角系统
      borderRadius: {
        '4xl': '2rem',
        DEFAULT: '0.5rem',
        '3xl': '1.5rem',
      },
      // 阴影系统 - 基于设计令牌
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        medium:
          '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        strong:
          '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)',
        primary: '0 4px 14px 0 rgba(34, 197, 94, 0.15)',
        secondary: '0 4px 14px 0 rgba(59, 130, 246, 0.15)',
        danger: '0 4px 14px 0 rgba(239, 68, 68, 0.15)',
        warning: '0 4px 14px 0 rgba(245, 158, 11, 0.15)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      // 动画系统
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-in',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      // 关键帧动画
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      // 边框宽度
      borderWidth: {
        3: '3px',
      },
      // Z-Index层级
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
        200: '200',
        300: '300',
        400: '400',
        500: '500',
        9999: '9999',
      },
      // 伪元素
      content: {
        empty: '""',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // 自定义插件
    function ({ addUtilities, theme }) {
      const newUtilities = {
        // 滚动条隐藏
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        // 滚动条细样式
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8',
          },
        },
        // 文本截断
        '.line-clamp-1': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        // 玻璃效果
        '.glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        },
        '.glass-dark': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        // Group hover效果 - 使用!important强制应用
        '.group:hover .group-hover\\:text-red-500': {
          color: '#ef4444 !important',
          'transition-property': 'color',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '200ms',
        },
        // 更高优先级的hover规则 - 使用更具体的选择器
        '.group.cursor-pointer:hover .group-hover\\:text-red-500': {
          color: '#ef4444 !important',
          'transition-property': 'color',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '200ms',
        },
        '.group.space-y-2:hover .group-hover\\:text-red-500': {
          color: '#ef4444 !important',
          'transition-property': 'color',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '200ms',
        },
        '.group:hover .group-hover\\:text-primary': {
          color: '#6ee7b7 !important',
          'transition-property': 'color',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '200ms',
        },
        '.group:hover .group-hover\\:text-blue-500': {
          color: '#3b82f6 !important',
          'transition-property': 'color',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '200ms',
        },
        '.group:hover .group-hover\\:text-green-500': {
          color: '#22c55e !important',
          'transition-property': 'color',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '200ms',
        },
        // Group hover scale效果
        '.group:hover .group-hover\\:scale-105': {
          transform: 'scale(1.05) !important',
          'transition-property': 'transform',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '200ms',
        },
        // More specific rule to ensure it works
        '.group .transition-transform.group-hover\\:scale-105:hover': {
          transform: 'scale(1.05) !important',
        },
        // Direct hover rule as fallback
        '.transition-transform.group-hover\\:scale-105:hover': {
          transform: 'scale(1.05) !important',
        },
        '.group:hover .group-hover\\:scale-110': {
          transform: 'scale(1.10) !important',
          'transition-property': 'transform',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '200ms',
        },
        '.group:hover .group-hover\\:scale-102': {
          transform: 'scale(1.02) !important',
          'transition-property': 'transform',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '200ms',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
