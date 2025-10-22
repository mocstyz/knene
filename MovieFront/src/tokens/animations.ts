/**
 * @fileoverview 动画设计令牌配置
 * @description 动画设计令牌系统定义，包括缓动函数、持续时间、延迟时间、关键帧动画等
 *              完整的动画系统配置，提供预设动画组合、组件动画和工具函数，确保
 *              整个应用的动画效果一致性和可维护性
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 缓动函数配置 - 定义各种CSS缓动函数，用于控制动画的时间曲线
export const easings = {
  // 线性
  linear: 'linear',

  // 标准缓动
  ease: 'ease',

  // 缓入
  easeIn: 'ease-in',

  // 缓出
  easeOut: 'ease-out',

  // 缓入缓出
  easeInOut: 'ease-in-out',

  // 自定义缓动
  easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  easeInSine: 'cubic-bezier(0.47, 0, 0.745, 0.715)',
  easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',

  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
  easeOutSine: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
  easeOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

  easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
  easeInOutSine: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
  easeInOutExpo: 'cubic-bezier(1, 0, 0, 1)',
  easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
  easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const

// 动画持续时间配置 - 定义动画的持续时间选项
export const durations = {
  instant: '0ms', // 瞬间
  fast: '150ms', // 快速
  normal: '200ms', // 正常
  slow: '300ms', // 慢速
  slower: '500ms', // 更慢
  slowest: '1000ms', // 最慢
} as const

// 延迟时间配置 - 定义动画的延迟时间选项
export const delays = {
  none: '0ms', // 无延迟
  short: '100ms', // 短延迟
  normal: '200ms', // 正常延迟
  long: '500ms', // 长延迟
  longer: '1000ms', // 更长延迟
} as const

// 关键帧动画定义 - 定义常用的关键帧动画效果
export const keyframes = {
  // 淡入淡出
  fadeIn: {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  fadeOut: {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },
  fadeInUp: {
    from: { opacity: '0', transform: 'translateY(20px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  fadeInDown: {
    from: { opacity: '0', transform: 'translateY(-20px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  fadeInLeft: {
    from: { opacity: '0', transform: 'translateX(-20px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  fadeInRight: {
    from: { opacity: '0', transform: 'translateX(20px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },

  // 滑动动画
  slideUp: {
    from: { transform: 'translateY(100%)' },
    to: { transform: 'translateY(0)' },
  },
  slideDown: {
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0)' },
  },
  slideLeft: {
    from: { transform: 'translateX(100%)' },
    to: { transform: 'translateX(0)' },
  },
  slideRight: {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0)' },
  },

  // 缩放动画
  scaleIn: {
    from: { transform: 'scale(0.8)', opacity: '0' },
    to: { transform: 'scale(1)', opacity: '1' },
  },
  scaleOut: {
    from: { transform: 'scale(1)', opacity: '1' },
    to: { transform: 'scale(0.8)', opacity: '0' },
  },
  scaleUp: {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.05)' },
  },
  scaleDown: {
    from: { transform: 'scale(1.05)' },
    to: { transform: 'scale(1)' },
  },

  // 旋转动画
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  spinReverse: {
    from: { transform: 'rotate(360deg)' },
    to: { transform: 'rotate(0deg)' },
  },

  // 弹跳动画
  bounce: {
    '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
    '40%, 43%': { transform: 'translateY(-30px)' },
    '70%': { transform: 'translateY(-15px)' },
    '90%': { transform: 'translateY(-4px)' },
  },
  bounceIn: {
    '0%': { opacity: '0', transform: 'scale(0.3)' },
    '50%': { opacity: '1', transform: 'scale(1.05)' },
    '70%': { transform: 'scale(0.9)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },

  // 脉冲动画
  pulse: {
    '0%': { opacity: '1' },
    '50%': { opacity: '0.5' },
    '100%': { opacity: '1' },
  },
  ping: {
    '75%, 100%': {
      transform: 'scale(2)',
      opacity: '0',
    },
  },

  // 摇摆动画
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
  },
  wobble: {
    '0%': { transform: 'translateX(0%)' },
    '15%': { transform: 'translateX(-25%)' },
    '30%': { transform: 'translateX(20%)' },
    '45%': { transform: 'translateX(-15%)' },
    '60%': { transform: 'translateX(10%)' },
    '75%': { transform: 'translateX(-5%)' },
    '100%': { transform: 'translateX(0%)' },
  },

  // 微妙动画
  bounceSubtle: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-5px)' },
  },
  heartbeat: {
    '0%': { transform: 'scale(1)' },
    '14%': { transform: 'scale(1.3)' },
    '28%': { transform: 'scale(1)' },
    '42%': { transform: 'scale(1.3)' },
    '70%': { transform: 'scale(1)' },
  },
} as const

// 预设动画组合配置 - 定义常用的动画时间函数组合
export const animationPresets = {
  // 入场动画
  entrance: {
    fadeIn: `${durations.normal} ${easings.easeOut} ${delays.none}`,
    fadeInUp: `${durations.slow} ${easings.easeOut} ${delays.none}`,
    fadeInDown: `${durations.slow} ${easings.easeOut} ${delays.none}`,
    fadeInLeft: `${durations.slow} ${easings.easeOut} ${delays.none}`,
    fadeInRight: `${durations.slow} ${easings.easeOut} ${delays.none}`,
    slideInUp: `${durations.slow} ${easings.easeOut} ${delays.none}`,
    slideInDown: `${durations.slow} ${easings.easeOut} ${delays.none}`,
    slideInLeft: `${durations.slow} ${easings.easeOut} ${delays.none}`,
    slideInRight: `${durations.slow} ${easings.easeOut} ${delays.none}`,
    scaleIn: `${durations.normal} ${easings.easeOut} ${delays.none}`,
    bounceIn: `${durations.slow} ${easings.easeOut} ${delays.none}`,
  },

  // 退场动画
  exit: {
    fadeOut: `${durations.fast} ${easings.easeIn} ${delays.none}`,
    fadeOutUp: `${durations.normal} ${easings.easeIn} ${delays.none}`,
    fadeOutDown: `${durations.normal} ${easings.easeIn} ${delays.none}`,
    fadeOutLeft: `${durations.normal} ${easings.easeIn} ${delays.none}`,
    fadeOutRight: `${durations.normal} ${easings.easeIn} ${delays.none}`,
    slideOutUp: `${durations.normal} ${easings.easeIn} ${delays.none}`,
    slideOutDown: `${durations.normal} ${easings.easeIn} ${delays.none}`,
    slideOutLeft: `${durations.normal} ${easings.easeIn} ${delays.none}`,
    slideOutRight: `${durations.normal} ${easings.easeIn} ${delays.none}`,
    scaleOut: `${durations.fast} ${easings.easeIn} ${delays.none}`,
  },

  // 交互动画
  interaction: {
    hover: `${durations.fast} ${easings.easeOut}`,
    focus: `${durations.fast} ${easings.easeOut}`,
    active: `${durations.instant} ${easings.easeOut}`,
    loading: `${durations.slowest} ${easings.linear} infinite`,
    pulse: `${durations.slow} ${easings.easeInOut} infinite`,
    bounce: `${durations.slow} ${easings.easeInOut}`,
    shake: `${durations.normal} ${easings.easeInOut}`,
  },

  // 循环动画
  looping: {
    spin: `${durations.slow} ${easings.linear} infinite`,
    ping: `${durations.slow} ${easings.easeOut} infinite`,
    pulse: `${durations.slow} ${easings.easeInOut} infinite`,
    bounce: `${durations.slow} ${easings.easeInOut} infinite`,
  },
} as const

// 组件动画配置 - 定义特定组件的动画效果
export const componentAnimations = {
  // 按钮动画
  button: {
    hover: `${durations.fast} ${easings.easeOut}`,
    active: `${durations.instant} ${easings.easeOut}`,
    loading: `${durations.slowest} ${easings.linear} infinite`,
  },

  // 卡片动画
  card: {
    hover: `${durations.fast} ${easings.easeOut}`,
    enter: `${durations.slow} ${easings.easeOut}`,
    exit: `${durations.normal} ${easings.easeIn}`,
  },

  // 模态框动画
  modal: {
    enter: `${durations.slow} ${easings.easeOut}`,
    exit: `${durations.normal} ${easings.easeIn}`,
    backdrop: `${durations.slow} ${easings.easeOut}`,
  },

  // 下拉菜单动画
  dropdown: {
    enter: `${durations.fast} ${easings.easeOut}`,
    exit: `${durations.fast} ${easings.easeIn}`,
  },

  // 工具提示动画
  tooltip: {
    enter: `${durations.fast} ${easings.easeOut}`,
    exit: `${durations.fast} ${easings.easeIn}`,
  },

  // 标签动画
  badge: {
    enter: `${durations.normal} ${easings.easeOut}`,
    exit: `${durations.fast} ${easings.easeIn}`,
  },

  // 加载动画
  loading: {
    spinner: `${durations.slowest} ${easings.linear} infinite`,
    dots: `${durations.slow} ${easings.easeInOut} infinite`,
    pulse: `${durations.slow} ${easings.easeInOut} infinite`,
  },
} as const

// 动画工具函数 - 提供动画相关的工具函数

// 解析动画预设函数 - 将预设字符串解析为动画属性
export const getAnimation = (preset: string): string => {
  const [duration, easing, delay = ''] = preset.split(' ')
  return `${duration} ${easing} ${delay}`.trim()
}

// 获取关键帧动画函数 - 根据名称返回对应的关键帧动画
export const getKeyframe = (
  name: keyof typeof keyframes
): (typeof keyframes)[keyof typeof keyframes] => keyframes[name]

// 获取组件动画函数 - 根据组件和状态返回对应的动画效果
export const getComponentAnimation = (
  component: keyof typeof componentAnimations,
  state: string
): string =>
  componentAnimations[component][
    state as keyof (typeof componentAnimations)[typeof component]
  ] || animationPresets.interaction.hover

// 动态关键帧生成器 - 根据配置动态生成关键帧动画
export const createKeyframe = (
  name: string,
  frames: Record<string, Record<string, string>>
): string => {
  const keyframeSteps = Object.entries(frames)
    .map(([step, styles]) => {
      const styleDeclarations = Object.entries(styles)
        .map(([property, value]) => `${property}: ${value}`)
        .join('; ')
      return `${step} { ${styleDeclarations} }`
    })
    .join('\n')

  return `@keyframes ${name} {\n${keyframeSteps}\n}`
}

// 动画相关类型定义 - 定义动画系统的TypeScript类型

// 缓动函数类型 - 定义可用的缓动函数选项
export type EasingType = keyof typeof easings

// 持续时间类型 - 定义动画持续时间选项
export type DurationType = keyof typeof durations

// 延迟时间类型 - 定义动画延迟时间选项
export type DelayType = keyof typeof delays

// 关键帧名称类型 - 定义可用的关键帧动画名称
export type KeyframeName = keyof typeof keyframes

// 动画预设类型 - 定义可用的动画预设组合
export type AnimationPreset = keyof typeof animationPresets

// 组件动画类型 - 定义可用的组件动画类型
export type ComponentAnimationType = keyof typeof componentAnimations
