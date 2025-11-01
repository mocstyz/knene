/**
 * @fileoverview Z-Index层级设计令牌系统
 * @description 定义完整的Z-Index层级系统，确保UI元素层级的正确性和一致性，包含基础层级定义、组件层级映射、层级分组管理、层级工具函数和验证机制
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// Z-Index基础层级系统常量，定义UI元素的层级标准，确保层级有序和可预测
export const zIndices = {
  hide: -1, // 隐藏元素，用于需要隐藏在正常内容之下的元素
  auto: 'auto', // 自动层级，使用浏览器的默认层级行为
  base: 0, // 基础层级，普通内容元素的默认层级
  docked: 10, // 固定元素层级，用于固定导航栏、侧边栏等固定定位元素

  // 交互相关层级，处理用户交互时的元素显示优先级
  dropdown: 1000, // 下拉菜单层级，确保下拉菜单显示在内容之上
  sticky: 1100, // 粘性元素层级，用于sticky定位的元素
  banner: 1200, // 横幅通知层级，用于通知、警告等横幅元素
  overlay: 1300, // 覆盖层层级，用于遮罩层、背景遮罩等

  // 模态相关层级，处理模态框、弹出框等覆盖式交互元素
  modal: 1400, // 模态框层级，用于对话框、确认框等模态组件
  popover: 1500, // 弹出框层级，用于弹出式内容展示
  skipLink: 1600, // 跳转链接层级，用于无障碍跳转链接
  toast: 1700, // 消息提示层级，用于临时通知消息
  tooltip: 1800, // 工具提示层级，用于悬停提示信息

  // 功能相关层级，处理特殊功能组件的显示优先级
  menu: 1900, // 菜单层级，用于导航菜单、下拉菜单等
  contextMenu: 2000, // 右键菜单层级，确保右键菜单显示在最上层
  fullscreen: 2100, // 全屏元素层级，用于全屏模式下的元素

  // 开发工具层级，预留最高层级给开发工具使用
  devTools: 9999, // 开发工具层级，用于调试工具、开发者界面等
} as const

// 组件层级映射常量，将具体组件映射到相应的Z-Index层级，确保组件层级的统一管理
export const componentZIndices = {
  // 导航相关组件层级映射
  navbar: zIndices.docked, // 导航栏，固定在顶部
  sidebar: zIndices.docked, // 侧边栏，固定在侧面
  header: zIndices.base, // 页头，普通内容层级
  footer: zIndices.base, // 页脚，普通内容层级

  // 交互相关组件层级映射
  button: zIndices.base, // 按钮，普通内容层级
  input: zIndices.base, // 输入框，普通内容层级
  select: zIndices.base, // 选择器，普通内容层级
  dropdown: zIndices.dropdown, // 下拉框，交互层级
  menu: zIndices.menu, // 菜单，功能层级
  contextMenu: zIndices.contextMenu, // 右键菜单，功能层级

  // 布局相关组件层级映射
  card: zIndices.base, // 卡片，普通内容层级
  panel: zIndices.base, // 面板，普通内容层级
  sidebarPanel: zIndices.docked, // 侧边栏面板，固定元素层级
  stickyHeader: zIndices.sticky, // 粘性页头，粘性层级
  stickyFooter: zIndices.sticky, // 粘性页脚，粘性层级

  // 覆盖层相关组件层级映射
  overlay: zIndices.overlay, // 遮罩层，覆盖层级
  modal: zIndices.modal, // 模态框，模态层级
  dialog: zIndices.modal, // 对话框，模态层级
  drawer: zIndices.modal, // 抽屉，模态层级
  popover: zIndices.popover, // 弹出框，模态层级
  tooltip: zIndices.tooltip, // 工具提示，模态层级
  dropdownMenu: zIndices.dropdown, // 下拉菜单，交互层级

  // 通知相关组件层级映射
  toast: zIndices.toast, // 消息提示，模态层级
  notification: zIndices.toast, // 通知消息，模态层级
  alert: zIndices.banner, // 警告提示，横幅层级
  banner: zIndices.banner, // 横幅，横幅层级

  // 特殊功能组件层级映射
  skipLink: zIndices.skipLink, // 跳转链接，模态层级
  fullscreen: zIndices.fullscreen, // 全屏组件，功能层级
  devTools: zIndices.devTools, // 开发工具，开发工具层级

  // 隐藏元素层级映射
  hidden: zIndices.hide, // 隐藏元素，隐藏层级
} as const

// 主题层级常量，为不同主题提供层级配置，目前浅色和深色主题使用相同的层级设置
export const themeZIndices = {
  light: componentZIndices, // 浅色主题层级配置
  dark: componentZIndices, // 深色主题层级配置
} as const

// 层级分组常量，将Z-Index按功能分组，便于层级范围管理和验证
export const zIndexGroups = {
  // 背景层级组，包含背景和隐藏元素
  background: {
    min: zIndices.hide,
    max: zIndices.base,
    elements: ['hide', 'base'],
  },

  // 内容层级组，包含普通内容和固定元素
  content: {
    min: zIndices.base,
    max: zIndices.sticky,
    elements: ['base', 'docked', 'sticky'],
  },

  // 交互层级组，包含用户交互相关的覆盖元素
  interactive: {
    min: zIndices.dropdown,
    max: zIndices.tooltip,
    elements: [
      'dropdown',
      'sticky',
      'banner',
      'overlay',
      'modal',
      'popover',
      'skipLink',
      'toast',
      'tooltip',
    ],
  },

  // 系统层级组，包含系统级和功能级元素
  system: {
    min: zIndices.menu,
    max: zIndices.devTools,
    elements: ['menu', 'contextMenu', 'fullscreen', 'devTools'],
  },
} as const

// Z-Index工具函数，提供层级获取、范围检查、验证等功能
// 获取指定组件的Z-Index值
export const getZIndex = (
  component: keyof typeof componentZIndices // 组件名称
): number | string => componentZIndices[component]

// 获取指定层级组的Z-Index范围
export const getZIndexRange = (
  group: keyof typeof zIndexGroups // 层级组名称
): { min: number; max: number } => {
  const groupConfig = zIndexGroups[group]
  return {
    min: groupConfig.min as number,
    max: groupConfig.max as number,
  }
}

// 验证Z-Index值是否在有效范围内，支持层级组范围验证
export const isValidZIndex = (
  zIndex: number, // 要验证的Z-Index值
  group?: keyof typeof zIndexGroups // 可选的层级组名称
): boolean => {
  if (group) {
    const range = getZIndexRange(group)
    return zIndex >= range.min && zIndex <= range.max
  }
  return zIndex >= zIndices.hide && zIndex <= zIndices.devTools
}

// 比较两个组件的Z-Index值，返回差值
export const compareZIndex = (
  component1: keyof typeof componentZIndices, // 第一个组件名称
  component2: keyof typeof componentZIndices // 第二个组件名称
): number => {
  const z1 = getZIndex(component1)
  const z2 = getZIndex(component2)

  if (typeof z1 === 'string' || typeof z2 === 'string') return 0
  return z1 - z2
}

// 基于基础组件创建动态Z-Index值
export const createDynamicZIndex = (
  base: keyof typeof componentZIndices, // 基础组件名称
  offset: number // 偏移量
): number => {
  const baseZIndex = getZIndex(base)
  return typeof baseZIndex === 'number' ? baseZIndex + offset : 0
}

// 验证Z-Index值的有效性，支持数字和特殊值验证
export const validateZIndex = (zIndex: number | string): boolean => {
  if (typeof zIndex === 'string') return zIndex === 'auto'
  return Number.isInteger(zIndex) && zIndex >= -1 && zIndex <= 9999
}

// Z-Index系统常量，定义关键的层级边界值
export const Z_INDEX_CONSTANTS = {
  MIN_Z_INDEX: -1, // 最小Z-Index值
  MAX_Z_INDEX: 9999, // 最大Z-Index值
  MODAL_BASE_Z_INDEX: 1400, // 模态框基础层级
  OVERLAY_BASE_Z_INDEX: 1300, // 覆盖层基础层级
  DROPDOWN_BASE_Z_INDEX: 1000, // 下拉菜单基础层级
} as const

// Z-Index基础层级类型，确保类型安全
export type ZIndexType = keyof typeof zIndices
// 组件Z-Index类型，确保类型安全
export type ComponentZIndexType = keyof typeof componentZIndices
// Z-Index层级组类型，确保类型安全
export type ZIndexGroup = keyof typeof zIndexGroups
