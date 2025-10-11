/**
 * Z-Index设计令牌 - 定义层级系统
 * 确保元素层级的正确性和一致性
 */

// Z-Index层级系统
export const zIndices = {
  // 基础层级
  hide: -1, // 隐藏元素
  auto: 'auto', // 自动层级
  base: 0, // 基础层级
  docked: 10, // 固定元素 (如固定导航栏)

  // 交互层级
  dropdown: 1000, // 下拉菜单
  sticky: 1100, // 粘性元素
  banner: 1200, // 横幅/通知
  overlay: 1300, // 覆盖层

  // 模态层级
  modal: 1400, // 模态框
  popover: 1500, // 弹出框
  skipLink: 1600, // 跳转链接
  toast: 1700, // 消息提示
  tooltip: 1800, // 工具提示

  // 功能层级
  menu: 1900, // 菜单
  contextMenu: 2000, // 右键菜单
  fullscreen: 2100, // 全屏元素

  // 开发工具层级
  devTools: 9999, // 开发工具
} as const

// 组件层级映射
export const componentZIndices = {
  // 导航组件
  navbar: zIndices.docked,
  sidebar: zIndices.docked,
  header: zIndices.base,
  footer: zIndices.base,

  // 交互组件
  button: zIndices.base,
  input: zIndices.base,
  select: zIndices.base,
  dropdown: zIndices.dropdown,
  menu: zIndices.menu,
  contextMenu: zIndices.contextMenu,

  // 布局组件
  card: zIndices.base,
  panel: zIndices.base,
  sidebarPanel: zIndices.docked,
  stickyHeader: zIndices.sticky,
  stickyFooter: zIndices.sticky,

  // 覆盖层组件
  overlay: zIndices.overlay,
  modal: zIndices.modal,
  dialog: zIndices.modal,
  drawer: zIndices.modal,
  popover: zIndices.popover,
  tooltip: zIndices.tooltip,
  dropdownMenu: zIndices.dropdown,

  // 通知组件
  toast: zIndices.toast,
  notification: zIndices.toast,
  alert: zIndices.banner,
  banner: zIndices.banner,

  // 加载组件
  loadingOverlay: zIndices.overlay,
  spinner: zIndices.modal,
  progressBar: zIndices.base,

  // 特殊组件
  skipLink: zIndices.skipLink,
  fullscreen: zIndices.fullscreen,
  devTools: zIndices.devTools,

  // 隐藏元素
  hidden: zIndices.hide,
} as const

// 主题层级
export const themeZIndices = {
  light: componentZIndices,
  dark: componentZIndices,
} as const

// 层级组
export const zIndexGroups = {
  // 背景组
  background: {
    min: zIndices.hide,
    max: zIndices.base,
    elements: ['hide', 'base'],
  },

  // 内容组
  content: {
    min: zIndices.base,
    max: zIndices.sticky,
    elements: ['base', 'docked', 'sticky'],
  },

  // 交互组
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

  // 系统组
  system: {
    min: zIndices.menu,
    max: zIndices.devTools,
    elements: ['menu', 'contextMenu', 'fullscreen', 'devTools'],
  },
} as const

// Z-Index工具函数
export const getZIndex = (
  component: keyof typeof componentZIndices
): number | string => componentZIndices[component]

export const getZIndexRange = (
  group: keyof typeof zIndexGroups
): { min: number; max: number } => {
  const groupConfig = zIndexGroups[group]
  return {
    min: groupConfig.min as number,
    max: groupConfig.max as number,
  }
}

export const isValidZIndex = (
  zIndex: number,
  group?: keyof typeof zIndexGroups
): boolean => {
  if (group) {
    const range = getZIndexRange(group)
    return zIndex >= range.min && zIndex <= range.max
  }
  return zIndex >= zIndices.hide && zIndex <= zIndices.devTools
}

// 层级比较函数
export const compareZIndex = (
  component1: keyof typeof componentZIndices,
  component2: keyof typeof componentZIndices
): number => {
  const z1 = getZIndex(component1)
  const z2 = getZIndex(component2)

  if (typeof z1 === 'string' || typeof z2 === 'string') return 0
  return z1 - z2
}

// 动态Z-Index生成器
export const createDynamicZIndex = (
  base: keyof typeof componentZIndices,
  offset: number
): number => {
  const baseZIndex = getZIndex(base)
  return typeof baseZIndex === 'number' ? baseZIndex + offset : 0
}

// Z-Index验证函数
export const validateZIndex = (zIndex: number | string): boolean => {
  if (typeof zIndex === 'string') return zIndex === 'auto'
  return Number.isInteger(zIndex) && zIndex >= -1 && zIndex <= 9999
}

// 层级常量
export const Z_INDEX_CONSTANTS = {
  MIN_Z_INDEX: -1,
  MAX_Z_INDEX: 9999,
  MODAL_BASE_Z_INDEX: 1400,
  OVERLAY_BASE_Z_INDEX: 1300,
  DROPDOWN_BASE_Z_INDEX: 1000,
} as const

export type ZIndexType = keyof typeof zIndices
export type ComponentZIndexType = keyof typeof componentZIndices
export type ZIndexGroup = keyof typeof zIndexGroups
