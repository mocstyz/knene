# 影视资源网站前端开发规范文档 (DDD架构)

## 0. 关键强制规则总览

**必须遵守的7条核心规则：**

1. **Chrome错误捕获**：每次写完代码后强制使用chrome devtools mcp工具查看页面内容或者捕获错误，如有错误立即修复。

2. **JSDoc中文注释**：
   - 文件头注释必须说明文件功能
   - 需要详细文档说明的类、函数、接口必须使用标准JSDoc注释
   - 命名优先于注释，简单逻辑不注释
   - 详细规范参见第13章：代码注释规范

3. **DRY原则**：所有重复必须通过抽象和复用消除，提交与审查需说明如何避免重复。

4. **组件最大化复用**：优先复用现有组件与样式，出现重复实现必须抽象为组件或Hook。

5. **@别名导入导出**：业务代码禁止相对路径，index.ts统一使用相对路径导出。

6. **样式架构统一**：统一使用Tailwind CSS + Radix UI Themes + next-themes + 组件变体Token系统，禁止其他样式方案。

7. **自包含组件架构**：领域组件必须采用自包含设计模式，提供完整的视觉效果，禁止依赖外部容器组件。

**违反以上规则将阻断代码合入。**

## 1. 项目概述与架构设计

### 1.1 项目信息

- **项目名称**：影视资源下载网站前端
- **架构模式**：领域驱动设计 (DDD)
- **技术栈**：React 18+ + TypeScript 5+
- **构建工具**：Vite + pnpm
- **样式方案**：Tailwind CSS + Radix UI Primitives + next-themes + 组件变体Token系统
- **状态管理**：Zustand + TanStack Query
- **路由**：React Router v6
- **测试框架**：Vitest + React Testing Library + Playwright
- **代码规范**：ESLint + Prettier + Husky + lint-staged

### 1.2 DDD架构概述

#### 1.2.1 分层架构

```
┌─────────────────────────────────────┐
│        表现层 (Presentation)         │ ← React组件、页面、UI交互
├─────────────────────────────────────┤
│        应用层 (Application)          │ ← 用例服务、应用逻辑协调
├─────────────────────────────────────┤
│        领域层 (Domain)               │ ← 业务实体、值对象、领域服务
├─────────────────────────────────────┤
│        基础设施层 (Infrastructure)   │ ← API调用、数据持久化、外部服务
└─────────────────────────────────────┘
```

#### 1.2.2 业务领域划分

- **用户管理领域**：用户注册验证、权限管理、账户状态
- **影片管理领域**：影片分类、评分计算、内容审核
- **下载管理领域**：下载权限、并发限制、存储管理
- **消息通知领域**：消息推送、已读状态、消息归档
- **管理后台领域**：权限控制、系统监控、内容审核

### 1.3 DDD项目结构

```
src/
├── presentation/          # 表现层：React组件、页面、UI交互
│   ├── components/       # UI组件
│   │   ├── atoms/       # 原子组件：Button、Input、Label等
│   │   ├── molecules/   # 分子组件：SearchBox、Card等
│   │   ├── organisms/   # 有机体组件：Header、Footer等
│   │   ├── templates/   # 模板组件：页面布局
│   │   ├── guards/      # 路由守卫组件
│   │   └── domains/     # 业务领域组件
│   │       ├── latestupdate/  # 最新更新领域
│   │       ├── hot/           # 热门内容领域
│   │       ├── collections/   # 专题合集领域
│   │       ├── photo/         # 图片内容领域
│   │       └── shared/        # 跨域共享组件
│   │           ├── BaseSection.tsx
│   │           ├── BaseList.tsx
│   │           ├── MixedContentList.tsx
│   │           └── content-renderers/  # 内容渲染器系统
│   ├── pages/           # 页面组件
│   └── hooks/           # 表现层Hooks
├── application/          # 应用层：用例服务、应用逻辑协调
│   ├── services/        # 应用服务
│   ├── stores/          # 客户端状态管理 (Zustand)
│   └── hooks/           # 应用层Hooks
├── domain/              # 领域层：业务实体、值对象、领域服务
│   ├── entities/        # 实体
│   ├── value-objects/   # 值对象
│   ├── services/        # 领域服务
│   └── events/          # 领域事件
├── infrastructure/      # 基础设施层：API调用、数据持久化、外部服务
│   ├── api/            # API调用
│   ├── storage/        # 存储
│   └── services/       # 外部服务 (如图片服务)
├── tokens/             # 设计令牌：组件变体、样式配置
│   ├── design-system/  # 基础设计系统变体
│   └── domains/        # 业务领域变体
├── types/              # 类型定义
└── utils/              # 工具函数
```

## 2. 代码风格规范

### 2.1 命名规范

**文件命名：**
- 组件文件：PascalCase (`MovieCard.tsx`)
- 工具函数：camelCase (`apiHelper.ts`)
- 常量文件：UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- 类型定义：camelCase + .types (`user.types.ts`)
- Hook文件：camelCase + use (`useAuth.ts`)

**变量和函数命名：**
- 变量：camelCase (`userName`)
- 常量：UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- 函数：camelCase (`handleLogin`)
- 类名/接口/类型：PascalCase (`MovieService`, `IUser`, `MovieType`)

### 2.2 代码格式化

**基础规范：**
- 2个空格缩进，单引号，行尾不加分号
- 对象和数组末尾元素后加逗号
- 优先使用箭头函数和解构赋值

**函数规范：**
- 使用函数式组件和Hooks
- 函数参数不超过3个，超过则使用对象参数
- TypeScript严格类型检查

## 3. DDD组件开发规范 (强制执行)

### 3.1 组件复用原则 (强制执行)

**⚠️ 强制要求：所有组件开发必须遵循最大化复用原则，违反者代码不予通过审查。**

**复用优先级原则：**
1. 复用现有组件 > 扩展现有组件 > 创建新组件
2. 抽象通用逻辑 > 重复实现
3. 组合模式 > 继承模式
4. 配置驱动 > 硬编码

**重复组件识别流程：**
- 相同UI结构和功能 → 抽取为通用组件
- 相似UI结构不同样式 → 通过变体/主题/配置解决
- 不同UI结构相同逻辑 → 抽象逻辑为Hook/服务

**强制检查规则：**
- 开发前：搜索相似组件，分析重复元素，制定复用计划
- 开发中：优先配置现有组件，提取可复用样式和逻辑
- 审查：无重复UI实现，API具备扩展性，遵循DDD分层

### 3.2 组件层次结构规范

**有机体组件 (Organisms)** - 复杂UI区块，DDD聚合概念
- 示例：Header、Navigation、MovieList、UserProfile
- 特点：管理多个分子组件，包含完整业务功能

**分子组件 (Molecules)** - 原子组件组合，DDD实体概念
- 示例：NavigationMenu、MovieCard、SearchBox、DownloadProgress
- 特点：特定功能，可复用，包含交互逻辑

**原子组件 (Atoms)** - 最基础UI元素，DDD值对象概念
- 示例：Button、Input、Icon、Avatar
- 特点：不可分割，纯展示，无业务逻辑

### 3.3 自包含组件架构规范 (强制执行)

**⚠️ 强制要求：领域组件必须采用自包含设计模式，提供完整的视觉效果。**

**自包含组件特征：**
- **完整视觉样式**：组件自带所有必要的CSS样式（阴影、圆角、布局）
- **业务功能完整**：包含完整的业务逻辑和交互行为
- **使用简单**：直接导入使用，无需额外的容器组件
- **配置驱动**：通过props控制功能开关和样式变体

**组件膨胀防护机制：**
- **原子组件**：≤ 100行
- **分子组件**：≤ 200行
- **有机体组件**：≤ 300行
- **超出限制**：必须拆分为组合架构

## 4. 首页复合架构规范 (强制执行)

### 4.1 首页架构概述

**⚠️ 强制要求：首页必须采用BaseSection + BaseList + MixedContentList的复合架构，确保统一性和可维护性。**

**架构组成：**
- **BaseSection**：页面区块容器，提供标题、描述、操作按钮等统一布局
- **BaseList**：列表容器，支持响应式网格、空状态、加载状态
- **MixedContentList**：混合内容列表，通过内容渲染器系统支持多种内容类型

### 4.2 响应式配置

**响应式网格配置：**
```typescript
const responsiveColumns = {
  xs: 2,    // 手机：2列
  sm: 3,    // 平板：3列  
  md: 4,    // 桌面：4列
  lg: 5,    // 大屏：5列
  xl: 6     // 超大屏：6列
}
```

## 5. 内容渲染器系统规范 (强制执行)

### 5.1 渲染器系统概述

**⚠️ 强制要求：所有内容展示必须通过统一的内容渲染器系统，确保一致性和可扩展性。**

**系统组成：**
- **渲染器接口**：定义统一的渲染器契约
- **渲染器工厂**：负责创建和管理渲染器实例
- **渲染器注册机制**：支持动态注册新的内容类型渲染器
- **配置系统**：支持渲染器的个性化配置

### 5.2 渲染器接口规范

**核心接口定义：**
```typescript
export interface ContentRenderer<T = any> {
  type: string
  render: (item: T, config?: RendererConfig) => React.ReactElement
  canRender: (item: any) => boolean
  priority?: number
}

export interface RendererConfig {
  size?: 'small' | 'medium' | 'large'
  aspectRatio?: string
  hoverEffect?: boolean
  showBadge?: boolean
  showTitle?: boolean
  showDescription?: boolean
  className?: string
  [key: string]: any
}
```

### 5.3 扩展性规范

**新增渲染器步骤：**
1. **创建渲染器**：实现`ContentRenderer`接口
2. **注册渲染器**：在`content-renderers/index.ts`中注册
3. **配置支持**：在`RendererConfig`中添加特定配置项
4. **类型安全**：更新TypeScript类型定义

## 6. 图片服务系统规范 (强制执行)

### 6.1 图片服务概述

**⚠️ 强制要求：所有图片URL处理必须通过统一的图片服务系统，确保性能优化和环境适配。**

**系统组成：**
- **图片服务Hook**：提供统一的图片URL处理接口
- **图片服务工厂**：根据环境和配置创建不同的服务实例
- **环境适配器**：处理开发、测试、生产环境的差异
- **优化配置**：支持懒加载、响应式、格式转换等优化选项

### 6.2 图片服务接口

**核心Hook接口：**
```typescript
export interface ImageServiceOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  lazy?: boolean
  placeholder?: string
  fallback?: string
  responsive?: boolean
}

export interface ImageService {
  getImageUrl: (originalUrl: string, options?: ImageServiceOptions) => string
  preloadImage: (url: string) => Promise<void>
  generateSrcSet: (baseUrl: string, widths: number[]) => string
  isImageCached: (url: string) => boolean
}
```

## 7. HTML设计稿迁移策略 (强制执行)

### 7.1 迁移策略

**⚠️ 强制要求：HTML设计稿迁移必须100%保持视觉效果，不允许任何UI变化。**

**实施步骤：**
1. **完整页面组件实现**：创建完整页面组件，确保100%视觉还原
2. **逐步提取可复用组件**：识别重复UI元素，提取为可复用组件
3. **整合到DDD架构**：将组件按业务领域分类，整合到DDD层级结构

**视觉保真度要求：**
- 100%像素级还原，所有UI元素与设计稿完全一致
- 保持所有hover、focus、active状态
- 正确的响应式布局和流畅的过渡动画

## 8. @别名导入导出规范 (强制执行)

**⚠️ 强制要求：业务代码必须使用@别名导入，index.ts文件必须使用相对路径导出。**

### 8.1 别名配置

**Vite配置：**
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),

      // DDD架构主要层级别名
      '@presentation': path.resolve(__dirname, './src/presentation'),
      '@components': path.resolve(__dirname, './src/presentation/components'),
      '@pages': path.resolve(__dirname, './src/presentation/pages'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@tokens': path.resolve(__dirname, './src/tokens'),
      '@data': path.resolve(__dirname, './src/data'),
      '@types': path.resolve(__dirname, './src/types'),
      '@types-movie': path.resolve(__dirname, './src/types/movie.types'),
      '@types-unified': path.resolve(
        __dirname,
        './src/types/unified-interfaces.types'
      ),

      // 高频使用的子目录别名（基于项目实际需求）
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@application/hooks': path.resolve(__dirname, './src/application/hooks'),
      '@application/stores': path.resolve(
        __dirname,
        './src/application/stores'
      ),
      '@application/services': path.resolve(
        __dirname,
        './src/application/services'
      ),
      '@domain/services': path.resolve(__dirname, './src/domain/services'),
      '@domain/entities': path.resolve(__dirname, './src/domain/entities'),
      '@domain/value-objects': path.resolve(
        __dirname,
        './src/domain/value-objects'
      ),
      '@domain/events': path.resolve(__dirname, './src/domain/events'),
      '@infrastructure/api': path.resolve(
        __dirname,
        './src/infrastructure/api'
      ),
      '@infrastructure/repositories': path.resolve(
        __dirname,
        './src/infrastructure/repositories'
      ),
      '@infrastructure/storage': path.resolve(
        __dirname,
        './src/infrastructure/storage'
      ),
      '@presentation/router': path.resolve(
        __dirname,
        './src/presentation/router'
      ),
    },
  },
})
```

### 8.2 导入导出规范

**✅ 正确方式：**
```typescript
// 组件导入
import { Button, Icon, Badge } from '@components/atoms'
import { MovieCard, SearchBox } from '@components/molecules'
import { NavigationHeader, HeroSection } from '@components/organisms'

// 服务导入
import { AuthenticationService } from '@domain/services'
import { MovieApplicationService } from '@application/services'

// 类型导入（更新：避免与第三方 @types 冲突）
import type { BaseMovieItem, PhotoItem } from '@types-movie'
import type { UnifiedContentItem } from '@types-unified'
```

**❌ 禁止方式：**
```typescript
// 禁止相对路径
import { Button } from '../atoms/Button'
import { MovieCard } from '../../molecules/MovieCard'

// 禁止@/格式
import { Button } from '@/components/atoms/Button'
```

### 8.3 index.ts导出规范

**⚠️ 强制要求：所有index.ts文件必须使用相对路径导出，符合行业标准最佳实践。**

**✅ 正确的index.ts导出方式：**
```typescript
// @components/atoms/index.ts
export * from './Button'
export * from './Icon'
export * from './Badge'
export * from './Input'
export * from './Avatar'

// 跨层级导出使用@别名
export { MovieLayer } from '@components/layers/MovieLayer'
```

### 8.4 ESLint强制规则

**配置规则：**
```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["../*", "./*"],
            "message": "禁止使用相对路径导入，请使用@别名"
          },
          {
            "group": ["@/*"],
            "message": "禁止使用@/格式，请使用具体的@别名"
          }
        ]
      }
    ]
  }
}
```

## 9. API调用规范

### 9.1 接口定义

- 使用OpenAPI规范，统一错误处理
- 统一错误码，用户友好提示，网络异常处理
- API调用逻辑应该在应用层服务中，不在组件或Store中

### 9.2 API端点组织架构

**分层架构设计：**
```
@infrastructure/
├── api/                       # API基础设施层
│   ├── index.ts              # API统一导出入口
│   ├── ApiClient.ts          # HTTP客户端基础设施
│   ├── endpoints.ts          # 端点配置管理
│   ├── authApi.ts           # 认证相关API
│   ├── userApi.ts           # 用户管理API
│   ├── movieApi.ts          # 影片管理API
│   ├── downloadApi.ts       # 下载管理API
│   └── adminApi.ts          # 管理后台API
├── storage/                   # 存储基础设施层
│   ├── index.ts              # 存储统一导出入口
│   ├── StorageService.ts     # 存储服务基础设施
│   └── localStorage.ts       # 本地存储管理
```

## 10. 路由鉴权与权限管理规范 (强制执行)

### 10.1 路由守卫组件架构

**⚠️ 强制要求：所有路由必须实现适当的权限控制，禁止未授权访问敏感页面。**

**守卫组件层次结构：**
```typescript
ProtectedRoute    // 基础认证守卫
├── AdminRoute    // 管理员权限守卫
├── GuestRoute    // 访客专用守卫
└── PermissionGate // 细粒度权限控制
```

### 10.2 权限常量系统

**权限常量定义：**
```typescript
export const PERMISSIONS = {
  // 用户管理权限
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create', 
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // 影片管理权限
  MOVIE_VIEW: 'movie:view',
  MOVIE_CREATE: 'movie:create',
  MOVIE_UPDATE: 'movie:update', 
  MOVIE_DELETE: 'movie:delete',
  MOVIE_MODERATE: 'movie:moderate',

  // 下载管理权限
  DOWNLOAD_VIEW: 'download:view',
  DOWNLOAD_CREATE: 'download:create',
  DOWNLOAD_MANAGE: 'download:manage',
  DOWNLOAD_UNLIMITED: 'download:unlimited',

  // 系统管理权限
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_MONITOR: 'system:monitor',
  SYSTEM_BACKUP: 'system:backup',
} as const
```

**角色常量定义：**
```typescript
export const ROLES = {
  USER: 'user',           // 普通用户
  VIP: 'vip',            // VIP用户
  MODERATOR: 'moderator', // 内容审核员
  ADMIN: 'admin',         // 管理员
  SUPER_ADMIN: 'super_admin', // 超级管理员
} as const
```

### 10.3 路由常量管理

**路由常量定义：**
```typescript
export const ROUTES = {
  HOME: '/',
  
  // 认证路由
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // 用户路由
  USER: {
    DASHBOARD: '/user/dashboard',
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    DOWNLOADS: '/user/downloads',
    FAVORITES: '/user/favorites',
    MESSAGES: '/user/messages',
  },
  
  // 影片路由
  MOVIE: {
    DETAIL: (id: string) => `/movie/${id}`,
    SEARCH: '/movie/search',
    CATEGORY: (category: string) => `/movie/category/${category}`,
  },
  
  // 管理员路由
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    MOVIES: '/admin/movies',
    SYSTEM: '/admin/system',
  },
  
  NOT_FOUND: '/404',
} as const
```

## 11. 不要重复你自己原则 (DRY，强制执行)

### 11.1 原则说明

- 同一业务知识、规则、样式或结构只存在一个权威来源
- 通过抽象与复用消除复制粘贴、并行实现和散落配置

### 11.2 实施策略

- **领域层**：将业务规则集中到 `@domain/services`，避免在组件内重复实现
- **应用层**：将用例流程放在 `@application/usecases`，组件仅调用用例
- **表现层**：把通用交互抽为 `@components` 和 `@hooks`
- **基础设施层**：API 客户端、缓存、存储统一在 `@infrastructure`
- **样式与设计系统**：使用设计令牌与 Tailwind 组合
- **类型与契约**：请求/响应、实体类型放在 `@types`
- **工具与逻辑**：通用函数集中在 `@utils`
- **别名导入**：强制使用 `@` 路径，避免相对路径导致"影子重复"

### 11.3 自动化保障

- **ESLint**：开启重复检测规则，阻止相对路径
- **代码扫描**：集成重复检测工具到 CI
- **测试复用**：用共享测试工具与固定数据工厂
- **文档与示例**：在 Storybook 记录可复用变体

## 12. 其他开发规范要点

### 12.1 TypeScript规范

- 所有组件Props必须定义接口，使用严格类型检查
- 避免使用any类型，优先使用联合类型而非枚举
- 使用类型守卫和类型断言确保类型安全

### 12.2 Git提交规范

```
<type>(<scope>): <subject>

feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建工具或辅助工具的变动
```

### 12.3 开发工具配置

- **ESLint + Prettier**：代码规范和格式化，强制@别名导入
- **Husky + lint-staged**：提交前代码检查和自动格式化
- **Storybook**：组件文档化和交互式开发
- **React Query DevTools**：状态管理调试工具

## 13. 代码注释规范 (强制执行)

### 13.1 注释规范原则
- 简洁美观，避免冗余，突出关键信息
- 参数、属性、字段不添加注释（含函数参数、接口字段、对象属性、常量键值）
- 内容为王，注释必须准确、有用，避免重复代码含义
- 统一格式，全项目统一使用单行注释 `//`
- 长度规则：函数、接口、组件、类型统一使用单行注释；文件头使用块注释 `/** */`
- 单行注释最多连续 3 行；超过 3 行不允许使用 `//`

### 13.2 文件头注释规范
- 标准文件头格式：
```typescript
/**
 * @fileoverview 文件功能简述
 * @description 详细描述文件作用与设计思路，可多行。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */
```
- 字段说明：`@fileoverview` 概述；`@description` 可多行详细说明；`@author` 作者；`@since` 首次版本；`@version` 当前版本
- index 文件不需要文件头注释：文件名为 `index.ts(x)|js(x)`，仅做导入导出聚合时禁止文件头注释
```typescript
// ✅ 正确：index文件直接开始导入导出
export * from './Button'
export * from './Input'
export { default as Card } from './Card'
```
- 例外：index 文件包含实际业务逻辑时需要文件头注释

### 13.3 接口和类型注释规范
- 接口与类型上方单行用途说明；字段不添加任何注释
```typescript
// 响应式列数配置接口，统一各模块列数配置
export interface ResponsiveColumnsConfig {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  xxl?: number
}
```

### 13.4 函数和方法注释规范
- 函数上方单行描述；参数不添加注释；简单自解释函数不强制注释
```typescript
// 合并Section Props配置，保证完整性与一致性
export function mergeSectionProps<T>(
  defaultProps: Partial<BaseSectionProps<T>>,
  userProps: Partial<BaseSectionProps<T>>
): BaseSectionProps<T> {
  // ...实现
}
```

### 13.5 组件与Hook注释规范
- React 组件统一使用单行注释，突出用途与关键行为
```typescript
// 影片卡片组件，支持多布局与交互
export const MovieCard: React.FC<MovieCardProps> = ({ movie, variant = 'grid' }) => {
  // ...组件实现
}
```
- Hook 统一使用单行注释，标注核心功能
```typescript
// 切换状态Hook
export const useToggle = (initialValue = false) => {
  // ...Hook实现
}
```

### 13.6 常量与枚举注释规范
- 常量对象上方单行注释，字段不添加注释
```typescript
// API接口地址配置
export const API_ENDPOINTS = {
  MOVIES: '/api/movies',
  MOVIE_DETAIL: '/api/movies/:id',
  SEARCH: '/api/search',
} as const
```
- 枚举上方单行注释，枚举项不添加注释
```typescript
// 影片状态枚举
export enum MovieStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}
```

### 13.7 注释禁用与参数注释规则
- 禁止在业务代码（函数、接口、组件、类型）中使用 JSDoc 块注释
- 单行注释最多连续 3 行；超过 3 行请精简说明，不允许使用 `//`
- 禁止参数/字段/常量键值的注释：函数参数、接口字段、对象属性、常量键值一律不添加注释

### 13.8 注释内容与格式要求
- 准确性与时效性：与代码功能一致，修改同步更新
- 简洁性与必要性：只为真正需要说明的内容添加注释，质量优先
- 语言规范：统一中文注释，专业术语准确，标点规范
- 统一格式：文件头使用 JSDoc；其余业务代码统一单行 `//`
- 长度处理：允许最多连续 3 行 `//` 描述；超过 3 行请改用精简说明
