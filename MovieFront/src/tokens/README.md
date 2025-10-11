# 组件变体配置系统

按照Claude.md规范，采用混合方案组织组件变体配置，实现良好的代码组织和可维护性。

## 目录结构

```
@tokens/
├── README.md                           # 本文档
├── index.ts                           # 统一导出入口
├── design-system/                     # 设计系统基础变体
│   ├── base-variants.ts              # 基础组件变体（Button、Input等）
│   ├── layout-variants.ts            # 布局组件变体（Grid、Navigation等）
│   └── index.ts                      # 设计系统统一导出
├── domains/                           # 业务领域变体
│   ├── movie-variants.ts             # 电影管理领域变体
│   ├── download-variants.ts          # 下载管理领域变体
│   ├── user-variants.ts              # 用户管理领域变体（待扩展）
│   ├── notification-variants.ts      # 通知管理领域变体（待扩展）
│   └── index.ts                      # 业务领域统一导出
├── colors.ts                         # 颜色设计令牌
├── spacing.ts                        # 间距设计令牌
├── borders.ts                        # 边框设计令牌
├── animations.ts                     # 动画设计令牌
├── z-index.ts                        # 层级设计令牌
├── themes.ts                         # 主题配置
├── typography.ts                     # 字体排版令牌
├── breakpoints.ts                    # 响应式断点
└── shadows.ts                        # 阴影设计令牌
```

## 使用方式

### 1. 按需导入（推荐）

```typescript
// 只导入需要的基础组件变体
import { buttonVariants, type ButtonVariant } from '@tokens/design-system/base-variants'

// 只导入需要的业务组件变体
import { movieCardVariants, type MovieCardVariant } from '@tokens/domains/movie-variants'
```

### 2. 便捷导入

```typescript
// 从统一入口导入常用变体
import { buttonVariants, movieCardVariants } from '@tokens'
```

### 3. 类型导入

```typescript
// 只导入类型定义
import type { ButtonVariant, MovieCardVariant } from '@tokens'
```

## 新增变体指南

### 1. 基础组件变体

在 `design-system/base-variants.ts` 中添加：

```typescript
export const newComponentVariants = {
  base: 'base-classes',
  variant: {
    primary: 'primary-classes',
    secondary: 'secondary-classes'
  },
  size: {
    sm: 'small-classes',
    md: 'medium-classes'
  }
} as const

export type NewComponentVariant = 'primary' | 'secondary'
export type NewComponentSize = 'sm' | 'md'
```

### 2. 业务组件变体

在对应的 `domains/` 文件中添加：

```typescript
// 例如：在 movie-variants.ts 中
export const newMovieComponentVariants = {
  base: 'base-classes',
  variant: {
    default: 'default-classes',
    featured: 'featured-classes'
  }
} as const

export type NewMovieComponentVariant = 'default' | 'featured'
```

### 3. 更新导出

在相应目录的 `index.ts` 中添加导出：

```typescript
export * from './new-component-variants'
```

## 设计原则

1. **单一职责**：每个文件只负责一类组件的变体
2. **按域分离**：基础组件和业务组件分离
3. **向后兼容**：保持API的稳定性和扩展性
4. **类型安全**：提供完整的TypeScript类型定义
5. **按需加载**：支持组件变体的按需导入

## 符合Claude.md规范

- ✅ **第3.2.4节**：通过配置驱动实现组件复用
- ✅ **第18章**：符合DDD项目结构规范
- ✅ **第20章**：遵循DRY原则，避免重复定义
- ✅ **第4.2章**：使用@别名导入导出