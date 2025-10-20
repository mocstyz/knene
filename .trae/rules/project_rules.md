# 影视资源网站前端开发规范文档 (DDD架构)

## 0. 关键强制规则总览

**必须遵守的7条核心规则：**

1. **Chrome错误捕获**：每次写完代码后强制使用chrome mcp捕获错误，如有错误立即修复。

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

## 8. 前后端分离开发规范 (强制执行)

**⚠️ 强制要求：所有前端开发必须基于Mock数据模拟后端响应，确保前后端完全解耦。**

### 8.1 核心原则

- **数据驱动**：所有业务数据来源于应用层服务，前端组件只负责展示
- **接口先行**：先定义数据接口，再实现Mock数据，最后对接真实API
- **无缝切换**：Mock数据与真实API具有相同的数据结构和接口
- **分层清晰**：严格遵循DDD分层架构，数据流向清晰

### 8.2 强制规则

1. **禁止组件内生成业务数据**：所有业务数据必须通过应用层服务获取
2. **Mock数据服务化**：Mock数据必须在 `@application/services` 中实现
3. **类型定义完整**：所有数据接口必须有完整的TypeScript类型定义
4. **业务逻辑真实化**：Mock数据的业务规则要模拟真实后端逻辑
5. **环境配置切换**：通过环境变量控制Mock数据与真实API的切换

### 8.3 详细规范

详细的前后端分离开发规范请参考：[Frontend-Backend-Separation-Development-Guide.md](../docs/Frontend-Backend-Separation-Development-Guide.md)

## 9. @别名导入导出规范 (强制执行)

**⚠️ 强制要求：业务代码必须使用@别名导入，index.ts文件必须使用相对路径导出。**

### 8.1 别名配置

**Vite配置：**
```typescript
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/presentation/components"),
      "@pages": path.resolve(__dirname, "./src/presentation/pages"),
      "@hooks": path.resolve(__dirname, "./src/presentation/hooks"),
      "@services": path.resolve(__dirname, "./src/application/services"),
      "@domain": path.resolve(__dirname, "./src/domain"),
      "@infrastructure": path.resolve(__dirname, "./src/infrastructure"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@tokens": path.resolve(__dirname, "./src/tokens"),
      "@data": path.resolve(__dirname, "./src/data")
    }
  }
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

// 类型导入
import type { MovieItem, PhotoItem } from '@types/movie.types'
import type { UnifiedContentItem } from '@types/unified.types'
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

**⚠️ 强制要求：所有代码文件必须遵循统一的注释规范，提高代码可读性和维护性。**

#### 13.1.1 注释风格原则

- **简洁美观**：避免冗余的装饰性注释，追求简洁清晰
- **行内优先**：参数、属性等使用行内注释，避免块注释
- **内容为王**：注释内容要准确、有用，避免无意义的重复
- **统一格式**：全项目使用统一的注释格式和风格

#### 13.1.2 注释长度规则

**⚠️ 强制要求：**
- **3行以下描述**：使用单行注释 `//`，必须将所有内容写在一行内
- **3行以上描述**：使用块注释 `/** */`
- **禁止多行单行注释**：不允许出现连续的 `//` 注释行

**JSDoc优先级说明：**
- 对于复杂的关键业务逻辑，即使描述简短也必须使用JSDoc格式
- 简单的工具函数和明显的逻辑可以使用单行注释
- 当不确定时，优先选择JSDoc格式

**✅ 正确的单行注释格式：**
```typescript
// 响应式列数配置接口，统一各模块的列数配置格式
export interface ResponsiveColumnsConfig {
  // 处理用户登录逻辑，验证凭据并返回认证状态
  handleLogin(credentials: LoginCredentials): Promise<AuthResult>
}
```

**❌ 错误的单行注释格式：**
```typescript
// 响应式列数配置接口
// 统一各模块的列数配置格式
export interface ResponsiveColumnsConfig {
  // 处理用户登录逻辑
  // 验证凭据并返回认证状态
  handleLogin(credentials: LoginCredentials): Promise<AuthResult>
}
```

### 13.2 文件头注释规范

#### 13.2.1 标准文件头格式

```typescript
/**
 * @fileoverview 文件功能简述
 * @description 详细描述文件的作用和主要功能，解释设计思路
 * @created 2025-10-17 10:00:53
 * @updated 2025-10-17 16:21:08
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */
```

#### 13.2.2 文件头字段说明

- **@fileoverview**：文件功能的简短概述（必填）
- **@description**：详细描述文件作用、设计思路（必填）
- **@created**：文件系统创建时间，格式：YYYY-MM-DD HH:mm:ss（必填）
  - 使用文件系统的实际创建时间，而非Git提交时间
  - PowerShell获取命令：`(Get-Item "文件路径").CreationTime.ToString("yyyy-MM-dd HH:mm:ss")`
- **@updated**：当前修改时间，格式：YYYY-MM-DD HH:mm:ss（必填）
  - 每次修改文件时更新为当前时间，而非历史修改时间
  - PowerShell获取当前时间：`Get-Date -Format "yyyy-MM-dd HH:mm:ss"`
- **@author**：文件作者（必填）
- **@since**：首次引入的版本号（必填）
- **@version**：当前版本号（必填）

#### 13.2.3 文件头示例

```typescript
/**
 * @fileoverview 统一接口类型定义
 * @description 定义统一的Section Props和Card Config接口，消除重复代码，提高一致性
 * @created 2025-10-17 10:00:53
 * @updated 2025-10-17 16:21:08
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */
```

**时间戳说明：**
- `@created` 使用文件系统实际创建时间
- `@updated` 使用当前修改时间，每次修改文件时都应更新此字段

### 13.3 接口和类型注释规范

#### 13.3.1 接口注释格式

**⚠️ 强制要求：**
- **简单接口**：使用单行注释 `//`，不使用块注释
- **复杂接口**：超过3行描述的使用块注释 `/** */`

**简单接口示例：**

```typescript
// 响应式列数配置接口，统一各模块的列数配置格式
export interface ResponsiveColumnsConfig {
  xs?: number // 超小屏幕断点配置
  sm?: number // 小屏幕断点配置
  md?: number // 中等屏幕断点配置
  lg?: number // 大屏幕断点配置
  xl?: number // 超大屏幕断点配置
  xxl?: number // 超超大屏幕断点配置
}
```

#### 13.3.2 复杂接口注释格式

**复杂接口示例（超过3行描述）：**

```typescript
/**
 * 统一卡片配置接口
 * 
 * 定义所有卡片组件的通用配置选项，支持多种布局变体和显示选项。
 * 提供完整的卡片自定义能力，包括布局、标签、宽高比等配置。
 * 遵循响应式设计原则，支持不同屏幕尺寸的适配。
 */
export interface UnifiedCardConfig {
  variant?: 'grid' | 'list' | 'carousel' // 布局变体
  columns?: ResponsiveColumnsConfig // 响应式列数配置
  showVipBadge?: boolean // 是否显示VIP标签
  showNewBadge?: boolean // 是否显示新片标签
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' // 卡片宽高比
  hoverEffect?: boolean // 悬停效果开关
}
  className?: string // 自定义CSS类名
}
```

### 13.4 函数和方法注释规范

#### 13.4.1 简单函数注释

**简单函数使用单行注释：**

```typescript
// 检查是否为有效的响应式列数配置
export function isValidColumnsConfig(config: any): config is ResponsiveColumnsConfig {
  return (
    config &&
    typeof config === 'object' &&
    Object.keys(config).every(key => 
      ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(key) &&
      typeof config[key] === 'number' &&
      config[key] > 0
    )
  )
}
```

#### 13.4.2 复杂函数注释

**复杂函数（超过3行描述）使用块注释：**

```typescript
/**
 * 合并Section Props配置
 * 
 * 将默认配置和用户配置进行深度合并，确保配置的完整性和一致性。
 * 支持嵌套对象的深度合并，避免配置丢失。
 * 优先级：用户配置 > 默认配置
 */
export function mergeSectionProps<T>(
  defaultProps: Partial<BaseSectionProps<T>>, // 默认配置
  userProps: Partial<BaseSectionProps<T>> // 用户自定义配置
): BaseSectionProps<T> {
  return {
    ...defaultProps,
    ...userProps,
    cardConfig: {
      ...createDefaultCardConfig(),
      ...defaultProps.cardConfig,
      ...userProps.cardConfig,
    },
    columns: {
      ...createDefaultColumnsConfig(),
      ...defaultProps.columns,
      ...userProps.columns,
    },
  } as BaseSectionProps<T>
}

// ✅ 简单函数参数示例 - 参数含义明确，无需注释
export function calculateDiscount(price: number, percentage: number): number {
  return price * (percentage / 100)
}

// ✅ 复杂参数需要注释说明
export function processPayment(
  amount: number, // 支付金额，单位：分
  currency: string, // 货币代码，如 'CNY', 'USD'
  options?: PaymentOptions // 支付选项配置
): Promise<PaymentResult> {
  // 实现...
}
```

### 13.5 组件注释规范

#### 13.5.1 React组件注释

**⚠️ 强制要求：**
- **简单组件**：使用单行注释 `//`
- **复杂组件**：超过3行描述的使用块注释 `/** */`

**简单组件示例：**

```typescript
// 影片卡片组件，支持多种布局变体和交互效果
export const MovieCard: React.FC<MovieCardProps> = ({
  movie, // 影片数据
  variant = 'grid', // 布局变体，默认网格布局
  showRating = true, // 是否显示评分
  onClick, // 点击事件处理器
  className // 自定义样式类名
}) => {
  // 组件实现...
}

// ✅ 简单组件参数示例 - 参数含义明确，无需注释
export const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  disabled = false,
  onClick
}) => {
  // 组件实现...
}
```

**复杂组件示例（超过3行描述）：**

```typescript
/**
 * 影片合集列表组件
 * 
 * 提供影片合集的完整列表功能，使用内容渲染器系统：
 * - 使用BaseList提供统一布局
 * - 使用CollectionContentRenderer提供影片合集卡片渲染
 * - 支持响应式列数配置
 * - 自包含的交互和视觉效果
 * - 使用统一的内容渲染器架构，支持扩展和定制
 */
const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  pagination,
  onCollectionClick,
  className,
  // 其他props...
}) => {
  // 组件实现...
}
```

#### 13.5.2 Hook注释

**简单Hook使用单行注释：**

```typescript
// 影片数据管理Hook，提供影片列表的获取、搜索、筛选功能
export const useMovies = (
  category?: string, // 影片分类
  searchTerm?: string // 搜索关键词
) => {
  // Hook实现...
}

// ✅ 简单Hook参数示例 - 参数含义明确，无需注释
export const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback(() => setValue(prev => !prev), [])
  return [value, toggle] as const
}
```

**复杂Hook使用块注释：**

```typescript
/**
 * 统一内容管理Hook
 * 
 * 提供统一的内容数据管理功能，支持多种内容类型。
 * 集成缓存、分页、搜索、筛选等功能。
 * 支持实时数据更新和错误处理。
 */
export const useUnifiedContent = <T>(
  contentType: ContentType, // 内容类型
  options?: ContentOptions // 配置选项
) => {
  // Hook实现...
}
```

### 13.6 常量和变量注释规范

#### 13.6.1 常量注释

```typescript
// API接口地址配置
export const API_ENDPOINTS = {
  MOVIES: '/api/movies', // 影片列表接口
  MOVIE_DETAIL: '/api/movies/:id', // 影片详情接口
  SEARCH: '/api/search', // 搜索接口
  USER_PROFILE: '/api/user/profile' // 用户资料接口
} as const

// 默认分页配置
export const DEFAULT_PAGINATION = {
  page: 1, // 当前页码
  pageSize: 20, // 每页条数
  total: 0 // 总条数
}
```

#### 13.6.2 枚举注释

```typescript
// 影片状态枚举
export enum MovieStatus {
  DRAFT = 'draft', // 草稿状态
  PUBLISHED = 'published', // 已发布
  ARCHIVED = 'archived', // 已归档
  DELETED = 'deleted' // 已删除
}
```

### 13.7 注释禁用规则

#### 13.7.1 禁止使用的注释格式

**❌ 禁止：简单接口、类型、函数、组件使用块注释**

```typescript
// ❌ 错误示例 - 简单接口不应使用块注释
/**
 * 响应式列数配置接口
 */
export interface ResponsiveColumnsConfig {
  xs?: number
}

// ✅ 正确示例 - 简单接口使用单行注释
// 响应式列数配置接口
export interface ResponsiveColumnsConfig {
  xs?: number // 超小屏幕 (< 640px)
}
```

**❌ 禁止：复杂接口、函数、组件使用多行单行注释**

```typescript
// ❌ 错误示例 - 复杂组件不应使用多行单行注释
// 影片合集列表组件
// 提供影片合集的完整列表功能，使用内容渲染器系统
// 使用BaseList提供统一布局
// 使用CollectionContentRenderer提供影片合集卡片渲染
const CollectionList: React.FC<CollectionListProps> = ({ ... }) => { ... }

// ✅ 正确示例 - 复杂组件使用块注释
/**
 * 影片合集列表组件
 * 
 * 提供影片合集的完整列表功能，使用内容渲染器系统：
 * - 使用BaseList提供统一布局
 * - 使用CollectionContentRenderer提供影片合集卡片渲染
 */
const CollectionList: React.FC<CollectionListProps> = ({ ... }) => { ... }
```

#### 13.7.2 参数注释规则

**⚠️ 强制要求：参数、属性、字段的注释遵循以下规则：**

**注释原则：**
1. **简单明了的参数**：一看就懂的参数不需要添加注释
2. **重要和关键参数**：必须使用行内注释格式说明
3. **避免过度注释**：不要为每个参数都添加注释，只注释真正需要说明的

**需要注释的参数类型：**
- **业务逻辑相关**：涉及特定业务规则或约束的参数
- **可选参数**：需要说明默认行为或使用场景的可选参数
- **复杂类型**：自定义类型或复杂配置对象
- **有歧义的参数**：参数名称可能引起误解的
- **重要回调函数**：关键的事件处理函数
- **配置选项**：影响组件行为的重要配置

**不需要注释的参数类型：**
- **基础类型**：如 `title: string`、`id: number` 等显而易见的参数
- **标准属性**：如 `className`、`style` 等通用属性
- **简单布尔值**：如 `disabled: boolean`、`visible: boolean` 等

```typescript
// ✅ 正确的参数注释格式 - 只注释重要和关键参数
export interface UserProfile {
  id: string
  username: string
  email: string
  avatar?: string // 头像URL，可选
  role: 'admin' | 'user' | 'vip' // 用户角色，影响权限控制
  createdAt: Date
  updatedAt: Date
  preferences?: UserPreferences // 用户偏好设置，可选
}

// ✅ 组件Props注释示例 - 只注释关键配置
export interface MovieCardProps {
  title: string
  year: number
  rating: number
  poster: string
  isVip?: boolean // VIP专享内容标识
  onPlay?: (movieId: string) => void // 播放按钮点击回调
  variant?: 'compact' | 'detailed' // 卡片显示变体
  downloadUrl?: string // 下载链接，仅VIP用户可见
}

// ✅ 函数参数注释示例 - 只注释复杂参数
export function formatRating(
  rating: number,
  precision = 1 // 小数位数，默认1位
): string {
  return rating.toFixed(precision)
}

// ✅ 简单函数参数不需要注释
export function calculateTotal(price: number, quantity: number): number {
  return price * quantity
}
```

**判断标准：**
- **需要注释**：参数含义不明确、有特殊格式要求、有默认值说明、可选参数的用途
- **不需要注释**：参数名称已经清楚表达含义，如 `title`、`name`、`id`、`url` 等

### 13.8 注释内容规范

#### 13.8.1 注释内容要求

- **准确性**：注释内容必须与代码实际功能一致
- **完整性**：重要的参数、返回值、副作用都要说明
- **简洁性**：避免冗余描述，突出关键信息，显而易见的内容不需要注释
- **时效性**：代码修改时同步更新注释
- **3行规则**：描述超过3行的接口、函数、组件必须使用块注释 `/** */`，3行及以下使用单行注释 `//`
- **必要性原则**：只对真正需要说明的内容添加注释，避免过度注释

#### 13.8.2 注释语言规范

- **统一语言**：项目内统一使用中文注释
- **专业术语**：使用准确的技术术语
- **标点符号**：注释结尾不加句号，除非是完整句子

#### 13.8.3 3行规则详细说明

**判断标准：**
- 计算注释的实际描述行数（不包括空行和装饰性符号）
- 3行及以下：使用单行注释 `//`
- 超过3行：使用块注释 `/** */`

**示例对比：**

```typescript
// ✅ 3行以下 - 使用单行注释
// 用户配置接口，包含基本的用户偏好设置
export interface UserConfig {
  theme: 'light' | 'dark' // 主题模式
}

// ✅ 超过3行 - 使用块注释
/**
 * 复杂的影片搜索配置接口
 * 
 * 支持多维度搜索条件，包括分类、年份、评分等筛选。
 * 提供高级搜索功能，支持模糊匹配和精确匹配。
 * 集成缓存机制，提升搜索性能。
 * 支持搜索历史记录和热门搜索推荐。
 */
export interface MovieSearchConfig {
  // 接口定义...
}
```

### 13.9 功能性注释规范

#### 13.9.1 功能性注释定义

**功能性注释**是对代码块、逻辑段落或关键操作的目的和作用进行说明的注释，采用"功能描述 - 具体说明"的格式。

**格式规范：**
```typescript
// [功能描述] - [具体说明/条件/结果]
```

#### 13.9.2 功能性注释使用场景

**⚠️ 强制要求：以下场景必须添加功能性注释**

1. **防御性检查**：数据验证、边界条件处理
2. **数据转换**：格式转换、结构映射、标准化处理
3. **配置构建**：复杂配置对象的创建和合并
4. **业务逻辑段落**：关键业务流程的各个步骤
5. **性能优化**：缓存、懒加载、批处理等优化操作
6. **状态管理**：状态更新、副作用处理
7. **条件分支**：复杂的条件判断逻辑

#### 13.9.3 功能性注释示例

**防御性检查：**
```typescript
// 防御性检查 - 如果collections是undefined或空数组，显示空状态
if (!collections || !Array.isArray(collections) || collections.length === 0) {
  return <EmptyState message="暂无数据" />
}

// 参数验证 - 确保必需的配置项存在
if (!config.apiUrl || !config.apiKey) {
  throw new Error('缺少必需的API配置')
}
```

**数据转换：**
```typescript
// 数据标准化和默认值设置 - 只设置BaseContentItem中存在的属性
const standardizedData = movies.map(movie => ({
  id: movie.id,
  title: movie.title || '未知标题',
  imageUrl: movie.poster || '/default-poster.jpg'
}))

// 转换最新更新数据为统一内容项格式 - 使用useMemo缓存
const contentItems = useMemo(() => 
  latestUpdates.map(item => createMovieContentItem(item)),
  [latestUpdates]
)
```

**配置构建：**
```typescript
// 根据配置创建渲染器配置
const rendererConfig = createRendererConfig({
  hoverEffect: cardConfig?.hoverEffect ?? true,
  showVipBadge: cardConfig?.showVipBadge ?? true,
  aspectRatio: cardConfig?.aspectRatio ?? 'square'
})

// 构建渲染器配置 - 使用useMemo缓存
const config = useMemo(() => ({
  layout: getLayoutConfig(variant),
  theme: getThemeConfig(mode),
  responsive: getResponsiveConfig(breakpoint)
}), [variant, mode, breakpoint])
```

**业务逻辑段落：**
```typescript
// 获取当前页显示的数据（如果有分页）
const getCurrentPageCollections = () => {
  if (!pagination) return collections
  
  const { currentPage, itemsPerPage = 12 } = pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return collections.slice(startIndex, endIndex)
}

// 键盘事件处理 - ESC键关闭菜单
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }
  // ...
}, [])
```

**性能优化：**
```typescript
// 懒加载图片 - 使用Intersection Observer优化性能
const [isVisible, setIsVisible] = useState(false)
const imgRef = useRef<HTMLImageElement>(null)

useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      setIsVisible(true)
      observer.disconnect()
    }
  })
  // ...
}, [])

// 缓存计算结果 - 避免重复计算
const expensiveValue = useMemo(() => {
  return complexCalculation(data)
}, [data])
```

#### 13.9.4 功能性注释最佳实践

**✅ 推荐做法：**
- 使用动词开头，描述具体动作：`获取`、`转换`、`验证`、`构建`
- 说明处理的条件和预期结果
- 对复杂逻辑进行分段注释
- 使用统一的术语和表达方式

**❌ 避免的做法：**
- 过于简单的描述：`// 设置变量`
- 重复代码内容：`// 调用fetchData函数`
- 模糊不清的描述：`// 处理数据`
- 过时或错误的描述

#### 13.9.5 功能性注释检查清单

**代码审查时检查：**
- [ ] 关键业务逻辑是否有功能性注释？
- [ ] 防御性检查是否说明了处理条件？
- [ ] 数据转换是否说明了转换目的？
- [ ] 复杂配置是否说明了构建逻辑？
- [ ] 注释格式是否符合"功能描述 - 具体说明"规范？

### 13.10 特殊注释标记

#### 13.10.1 标记类型

```typescript
// TODO: 待实现的功能
// FIXME: 需要修复的问题
// HACK: 临时解决方案
// NOTE: 重要说明
// WARNING: 警告信息
// DEPRECATED: 已废弃的代码
```

#### 13.10.2 标记使用示例

```typescript
// TODO: 添加缓存机制提升性能
export const fetchMovies = async (params: MovieParams) => {
  // FIXME: 错误处理需要优化
  try {
    const response = await api.get('/movies', { params })
    return response.data
  } catch (error) {
    // WARNING: 临时使用console.error，后续需要接入日志系统
    console.error('获取影片列表失败:', error)
    throw error
  }
}

// DEPRECATED: 使用新的 useMoviesQuery Hook 替代
export const useMoviesList = () => {
  // 已废弃的实现...
}
```

### 13.11 注释检查和维护

#### 13.11.1 自动化检查

- **ESLint规则**：配置注释相关的ESLint规则
- **代码审查**：PR审查时检查注释质量
- **文档生成**：使用工具自动生成API文档

#### 13.11.2 注释维护原则

- **同步更新**：代码修改时必须同步更新注释
- **定期清理**：定期清理过时和无用的注释
- **质量保证**：确保注释的准确性和有用性
