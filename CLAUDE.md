# 影视资源网站前端开发规范文档 (DDD架构)

## 0. 关键强制规则总览

**必须遵守的7条核心规则：**

1. **Chrome错误捕获**：每次写完代码后强制使用chrome mcp捕获错误，如有错误立即修复。

2. **JSDoc中文注释**：
   - 文件头注释必须说明文件功能
   - 关键类、函数、接口必须使用标准JSDoc注释
   - 命名优先于注释，简单逻辑不注释

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

**组件API设计原则：**

- 向后兼容：新增props不影响现有使用
- 渐进增强：简单场景简单使用，复杂场景支持配置
- 样式灵活性：通过className支持Tailwind classes扩展

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

### 3.3 灵活性设计原则

**组件设计模式：**

- **组件变体模式**：支持variant、size等属性配置
- **复合组件模式**：组件嵌套和扩展
- **插槽模式**：支持header、content、footer等插槽配置

### 3.4 样式处理策略

**样式处理策略：**

- **Tailwind CSS + Radix UI集成**：优先使用Tailwind classes，结合Radix UI组件
- **条件样式**：使用clsx工具处理动态样式
- **样式架构**：统一使用Tailwind CSS + Radix UI Primitives + 组件变体Token系统

### 3.5 组件复用实施规范

**重复组件识别流程：**

- 相同UI结构和功能 → 抽取为通用组件
- 相似UI结构不同样式 → 通过变体/主题/配置解决
- 不同UI结构相同逻辑 → 抽取逻辑为Hook/服务

**组件API设计原则：**

- 向后兼容：新增props不影响现有使用
- 渐进增强：简单场景简单使用，复杂场景支持配置
- 样式灵活性：通过className支持Tailwind classes扩展

### 3.6 组合式组件架构规范 (强制执行)

**⚠️ 强制要求：复杂组件必须采用组合式架构，禁止单体组件过度膨胀。**

#### 3.6.1 自包含组件 + 特化层模式

**组合式架构原则**：

- 领域组件自包含完整的视觉效果和业务逻辑
- 示例：MovieLayer (自带样式) + 交互容器 = MovieCard

**架构分层**：

- **领域组件层**：自包含完整的业务功能，提供统一的视觉效果
- **特化层**：业务逻辑、数据处理、交互行为
- **简单容器层**：仅负责布局和交互事件，不提供样式

#### 3.6.2 领域分离 + 组合模式

**组件目录结构**：

```
@components/
├── atoms/                  # 原子组件层 - 最基础UI元素
│   ├── Button/             # 按钮组件
│   ├── Input/              # 输入框组件
│   ├── Icon/               # 图标组件
│   └── Badge/              # 标签组件
├── domains/                # 领域组件层 - 自包含业务功能
│   ├── movie/
│   │   ├── MovieCard/      # 电影卡片组件
│   │   ├── SimpleMovieCard/ # 简化电影卡片
│   │   └── MovieList/      # 电影列表
│   ├── topic/
│   │   ├── TopicCard/      # 专题卡片
│   │   └── TopicList/      # 专题列表
│   └── search/
│       ├── SearchResultCard/ # 搜索结果卡片
│       └── SearchFilters/    # 搜索过滤器
└── layers/                 # 特化层 - 业务逻辑和内容展示
    ├── MovieLayer/         # 电影内容层(自包含样式)
    ├── SimpleMovieLayer/   # 简化电影内容层(自包含样式)
    ├── TopicLayer/         # 专题内容层(自包含样式)
    ├── ImageLayer/         # 图片显示层
    ├── TitleLayer/         # 标题显示层
    └── BadgeLayer/         # 标签显示层
```

#### 3.6.3 自包含组件设计原则

**⚠️ 强制要求：领域组件必须采用自包含设计模式，提供完整的视觉效果。**

**自包含组件特征：**

- **完整视觉样式**：组件自带所有必要的CSS样式（阴影、圆角、布局）
- **业务功能完整**：包含完整的业务逻辑和交互行为
- **使用简单**：直接导入使用，无需额外的容器组件
- **配置驱动**：通过props控制功能开关和样式变体

**设计优势：**

- **开发效率高**：开发者只需要记住一个组件
- **学习成本低**：API简洁，使用直观
- **维护成本低**：只需要维护一套组件
- **架构一致性好**：所有组件遵循统一的设计模式

**实现模式：**

```typescript
// ✅ 正确：自包含组件
<MovieCard movie={movie} onPlay={handlePlay} />

// ❌ 错误：依赖外部容器的组件
<ExternalContainer>
  <MovieLayer movie={movie} />
</ExternalContainer>
```

#### 3.6.4 组件膨胀防护机制

**组件大小限制**：

- **原子组件**：≤ 100行
- **分子组件**：≤ 200行
- **有机体组件**：≤ 300行
- **超出限制**：必须拆分为组合架构

**拆分判断标准**：

- 组件超过300行
- 包含3个以上不相关的业务逻辑
- Props接口超过10个属性
- 存在多个独立的变体实现

#### 3.6.5 组合模式最佳实践

**组合模式实现**：

- **自包含组件模式**：组件自带完整样式和功能，直接使用
- **配置驱动模式**：通过props控制功能开关和样式变体
- **简单容器模式**：外层容器只负责布局和交互事件

**推荐实践**：

```typescript
// ✅ 推荐：自包含组件
<MovieCard
  movie={movie}
  variant="default"
  showVipBadge={true}
  onPlay={handlePlay}
/>

// ✅ 可选：简单容器 + 自包含组件
<div className="grid grid-cols-3">
  <MovieCard movie={movie1} />
  <MovieCard movie={movie2} />
  <MovieCard movie={movie3} />
</div>
```

**避免模式**：

```typescript
// ❌ 避免：依赖外部容器的组件
<ExternalCard shadow="md" rounded="lg">
  <MovieLayer movie={movie} />
</ExternalCard>
```

### 3.7 DDD领域组件规范

**实体组件 (Entity Components)**

- 代表业务实体，具有唯一标识
- 示例：`UserProfile`, `MovieDetail`

**聚合组件 (Aggregate Components)**

- 管理相关实体和值对象，确保业务规则
- 示例：`UserAggregate`, `MovieAggregate`

**组件通信规范**

- 使用领域事件实现松耦合通信
- 事件命名采用过去式：`MovieSelected`, `DownloadCompleted`

## 4. HTML设计稿迁移策略 (强制执行)

### 4.1 迁移策略：组件化 + 渐进式迁移

**⚠️ 强制要求：HTML设计稿迁移必须100%保持视觉效果，不允许任何UI变化。**

**实施步骤：**

1. **完整页面组件实现**：创建完整页面组件，确保100%视觉还原，保持原有CSS样式和交互效果
2. **逐步提取可复用组件**：识别重复UI元素，提取为可复用的原子、分子组件
3. **整合到DDD架构**：将组件按业务领域分类，整合到DDD层级结构

**视觉保真度要求：**

- 100%像素级还原，所有UI元素与设计稿完全一致
- 保持所有hover、focus、active状态
- 正确的响应式布局和流畅的过渡动画

## 5. @别名导入导出规范 (强制执行)

**⚠️ 强制要求：业务代码必须使用@别名导入，index.ts文件必须使用相对路径导出。**

### 5.1 配置示例

**Vite配置：**

- 在vite.config.ts中配置resolve.alias
- 设置@components、@pages、@hooks、@domain、@infrastructure等别名

### 5.2 导入规范

**✅ 正确方式：**

```typescript
import { Button } from "@components/atoms/Button";
import { MovieCard } from "@components/molecules/MovieCard";
import { useAuth } from "@hooks/useAuth";
import { MovieService } from "@domain/services/MovieService";
```

**❌ 禁止方式：**

- 相对路径：`import { Button } from "../atoms/Button"`
- @/格式：`import { Button } from "@/components/atoms/Button"`

**允许的别名格式：**

- `@components/*` - 组件导入
- `@pages/*` - 页面导入
- `@hooks/*` - 通用hooks
- `@application/hooks/*` - 应用层hooks
- `@domain/*` - 领域层
- `@infrastructure/*` - 基础设施层
- `@types/*` - 类型定义
- `@utils/*` - 工具函数
- `@assets/*` - 静态资源

### 5.3 index.ts导出规范 (强制执行)

**⚠️ 强制要求：所有index.ts文件必须使用相对路径导出，符合行业标准最佳实践。**

#### 5.3.1 index.ts导出原则

**相对路径导出原则**：

- index.ts文件作为模块导出入口，必须使用相对路径导出同级文件
- 符合npm包和开源项目的行业标准做法
- 提供语义清晰的文件结构关系
- 支持重构友好性，移动目录时自动保持正确路径

#### 5.3.2 导出规范要求

**正确的index.ts导出方式**：

- 同级目录导出必须使用相对路径：`export * from './Button'`
- 跨层级导出使用@别名：`export { MovieLayer } from '@components/layers/MovieLayer'`
- 类型导出遵循相同的相对路径规则

**错误的index.ts导出方式**：

- 同级目录避免使用@别名：`export * from '@components/atoms/Button'`
- 严格禁止@/格式导入：`export * from '@/components/atoms/Button'`

#### 5.3.3 特殊情况处理

**跨层级导出**：当需要导出其他层级的组件时，使用@别名导入。

**类型导出**：类型导出也遵循相同的相对路径规则，同级使用相对路径，跨层级使用@别名。

#### 5.3.4 市场最佳实践依据

**行业标准**：

- **React、Vite、Next.js**等主流项目都在index.ts中使用相对路径
- **Meta、Google、Microsoft**的开源项目都采用此模式
- **npm包标准**：包的导出入口文件使用相对路径是标准做法

**技术优势**：

1. **语义清晰**：`./Button`明确表示Button在当前目录下
2. **重构友好**：移动整个目录时，相对路径自动保持正确
3. **IDE支持好**：VSCode等编辑器对相对路径的智能提示更好
4. **构建工具兼容**：Webpack、Rollup、Vite都对相对路径优化很好
5. **循环依赖检测**：更容易发现循环依赖问题

#### 5.3.5 ESLint规则配置

**规则说明**：

- 业务代码文件（.tsx, .ts）强制使用@别名
- index.ts文件允许使用相对路径导出
- 严格禁止@/格式导入
- 提供清晰的错误提示信息

### 5.4 ESLint强制规则配置

**⚠️ 强制要求：必须配置ESLint规则强制使用@别名导入。**

**ESLint配置 (.eslintrc.cjs)**：

- 配置no-restricted-imports规则
- 禁止相对路径和@/格式导入（业务代码）
- 允许index.ts文件使用相对路径导出
- 提供明确的错误提示信息

**违规处理**：

- ESLint会在开发时实时提示违规导入
- 提交前的lint检查会拦截违规导入
- 必须修复所有违规导入后方可提交代码

**注意**：ESLint规则应该区分业务代码和index.ts文件，允许index.ts使用相对路径导出。

## 6. API调用规范

### 6.1 接口定义

- 使用OpenAPI规范，统一错误处理
- 统一错误码，用户友好提示，网络异常处理
- API调用逻辑应该在应用层服务中，不在组件或Store中

### 6.2 错误处理

- 统一错误码和用户友好提示
- 网络异常处理和重试机制

## 6.3 配置化图片服务规范 (强制执行)

**⚠️ 强制要求：所有图片资源必须通过配置化图片服务管理，禁止硬编码图片URL。**

#### 6.3.1 图片服务抽象层

**设计原则**：

- 开发期使用稳定的Placeholder服务
- 生产期平滑切换到真实图片服务
- 统一的图片处理接口（裁剪、压缩、格式转换）
- 自动fallback机制

#### 6.3.2 配置化图片策略

**环境配置**：

- 开发环境：使用Picsum服务，支持seed一致性
- 生产环境：使用自定义CDN服务，支持格式优化
- 统一配置接口：provider、baseUrl、尺寸、质量、格式

#### 6.3.3 图片服务接口实现

**抽象接口**：

- ImageService：统一图片服务接口
- 核心方法：getUrl、getOptimizedUrl、getPlaceholder、generateSrcSet
- 配置选项：尺寸、质量、格式、裁剪模式

**实现策略**：

- Picsum服务：开发期使用，支持seed一致性
- 自定义服务：生产期使用，支持参数化URL
- Cloudinary服务：可选高级图片处理

#### 6.3.4 图片服务工厂

**服务工厂**：

- 单例模式：确保全局只有一个图片服务实例
- 环境自动切换：根据NODE_ENV选择对应服务
- 类型安全：TypeScript接口保证类型一致性

#### 6.3.5 React Hook封装

**使用Hook**：

- useImageService：提供便捷的图片操作方法
- 业务语义：getMoviePoster、getCollectionThumbnail等
- 错误处理：自动fallback到placeholder

#### 6.3.6 组件使用示例

**在组件中使用**：

- 通过useImageService Hook获取图片操作方法
- 使用getMoviePoster、getPlaceholder等方法
- 自动处理环境切换和错误回退

#### 6.3.7 迁移指南

**从硬编码URL迁移**：

- 旧方式：直接硬编码URL字符串
- 新方式：通过Hook获取配置化URL
- 优势：环境自动切换，统一错误处理

**环境切换**：

- 开发环境：Picsum服务
- 生产环境：自定义CDN服务
- 无需修改组件代码

**违反以上规范将导致代码审查不通过。**

## 7. 样式架构规范 (Tailwind CSS + Radix UI Primitives + 组件变体Token系统)

### 7.1 统一样式架构 (强制执行)

**⚠️ 强制要求：项目统一使用Tailwind CSS + Radix UI Primitives + 组件变体Token系统架构，禁止其他样式方案。**

**样式技术栈：**

- **主要样式**: Tailwind CSS (utility-first)
- **UI组件库**: Radix UI Primitives (无样式组件) + next-themes (主题切换)
- **组件变体系统**: 基于Token的变体配置 (`@tokens/design-system/base-variants.ts`)
- **响应式设计**: Tailwind 响应式前缀 (sm:, md:, lg:, xl:)
- **字体系统**: HarmonyOS Sans SC (项目统一字体)

**❌ 严格禁止：**

- CSS Modules (.module.css 文件)
- CSS-in-JS (styled-components, Emotion等)
- 内联样式 style 属性
- !important 强制覆盖
- @apply 指令过度使用

### 7.2 样式写法规范

**允许的样式写法：**

1. **Tailwind CSS classes**：主要样式方式，使用utility classes
2. **Radix UI 组件 + Tailwind**：结合无样式组件和Tailwind classes
3. **条件样式**：使用clsx工具处理动态样式

### 7.3 设计令牌系统

**颜色系统配置：**

- 在tailwind.config.js中配置颜色主题
- 支持primary等多级颜色变量
- 基于4px网格系统的间距配置

**间距和字体：**

- 基于4px网格系统，使用Tailwind预设间距
- **统一字体系统**: HarmonyOS Sans SC (全项目统一使用)
- 代码字体: JetBrains Mono，显示字体: HarmonyOS Sans SC

### 7.4 组件变体Token系统 (强制执行)

**⚠️ 强制要求：所有基础组件必须使用统一的变体Token系统，禁止重复定义样式。**

**变体配置文件：** `@tokens/design-system/base-variants.ts`

**支持变体的组件：**

- **Button**: primary, secondary, danger, ghost, outline, success, warning, info, link
- **Input**: default, filled, outlined, underlined
- **Badge**: default, primary, secondary, success, warning, danger, info, outline
- **Card**: default, elevated, outlined, ghost, featured
- **Select**: default, filled, outlined
- **Switch**: default, success, warning, danger

**使用方式：**

- 从@tokens/design-system/base-variants导入变体配置
- 在组件中使用cn函数组合变体类
- 支持variant、size等多维度配置

**变体设计原则：**

- 配置驱动，避免硬编码样式
- 统一的命名规范和API设计
- 支持主题适配和响应式

### 7.5 响应式设计规范 (强制执行)

**⚠️ 强制要求：所有组件必须遵循以下响应式设计原则，确保跨设备一致性体验。**

#### 7.5.1 断点系统

**标准断点：**

- sm: 640px (小屏幕/大手机)
- md: 768px (平板竖屏)
- lg: 1024px (平板横屏/小笔记本)
- xl: 1280px (桌面/笔记本)
- 2xl: 1536px (大屏幕)

#### 7.5.2 通用响应式布局原则

**容器边距规范：**

- 所有主容器使用：`px-4 sm:px-6 lg:px-8`
- 确保内容在各种屏幕下不贴边
- 移动端16px，平板24px，桌面32px

**移动端优先原则：**

- 基础样式针对移动端设计
- 使用响应式前缀向上扩展
- 避免使用max-width媒体查询

#### 7.5.3 网格系统规范

**渐进式网格布局：**

- **卡片网格**：`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6`
- **专题网格**：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **列表网格**：`grid-cols-1 md:grid-cols-2`

**网格间距规范：**

- 统一使用：`gap-4 sm:gap-6 lg:gap-8`
- 移动端16px，平板24px，桌面32px

#### 7.5.4 文字响应式规范

**标题文字大小：**

- 主标题：`text-3xl sm:text-4xl md:text-5xl`
- 区块标题：`text-2xl sm:text-3xl`
- 卡片标题：`text-lg sm:text-xl`

**描述文字大小：**

- 主要描述：`text-sm sm:text-base`
- 次要描述：`text-xs sm:text-sm`

#### 7.5.5 组件尺寸规范

**按钮尺寸：**

- 大按钮：`px-6 py-3 sm:px-8 sm:py-4`
- 中按钮：`px-4 py-2 sm:px-6 sm:py-3`
- 小按钮：`px-3 py-1.5 sm:px-4 sm:py-2`

**图片响应式：**

- 封面图片：`w-full h-auto object-cover`
- 背景图片：`bg-cover bg-center`
- Hero区域：`min-h-[600px] h-[85vh]`

#### 7.5.6 导航响应式规范

**导航切换策略：**

- **< 1024px**：汉堡菜单模式
- **≥ 1024px**：水平导航模式
- 避免中间挤压状态，确保临界点切换清晰

#### 7.5.7 隐藏与显示规范

**响应式显示：**

- 搜索框：`hidden sm:block`（小屏隐藏，大屏显示）
- 侧边栏：`hidden lg:block`（平板以下隐藏）
- 详细信息：`hidden md:block`（移动端隐藏）

**响应式隐藏：**

- 装饰元素：`block sm:hidden lg:block xl:hidden`
- 冗余功能：`block md:hidden`

#### 7.5.8 Flexbox响应式规范

**方向切换：**

- 移动端垂直：`flex-col space-y-4`
- 桌面端水平：`flex-row space-x-4 sm:flex-row sm:space-x-6`

**对齐方式：**

- 移动端居中：`justify-center items-center`
- 桌面端左对齐：`justify-start items-center`

**违反以上规范将导致代码审查不通过。**

### 7.6 导航响应式设计规范 (强制执行)

**⚠️ 强制要求：所有导航组件必须采用汉堡菜单响应式设计方案，确保跨设备一致性体验。**

#### 7.6.1 导航响应式策略

**汉堡菜单模式 - 桌面端优先：**

- **移动端 (< 1024px)**：显示汉堡菜单按钮，隐藏主导航
- **桌面端 (≥ 1024px)**：显示完整主导航菜单 + 搜索功能

**断点应用要求：**

- 移动端显示汉堡菜单按钮，隐藏主导航
- 桌面端显示完整导航菜单
- 导航抽屉只在移动端显示

#### 7.6.2 移动端导航要求

**汉堡菜单按钮规范：**

- 位置：头部右侧
- 图标：三条横线（menu）/ 关闭图标（close）
- 尺寸：24px × 24px
- 交互：点击切换菜单状态
- 状态：支持键盘导航（ESC关闭）

**移动端导航抽屉规范：**

- 使用固定定位覆盖整个屏幕
- 右侧滑出式抽屉，宽度320px
- 包含完整导航列表：VIP、最近更新、普通、求片、公告、帮助、APP
- 底部功能区包含搜索、认证、主题切换
- 支持点击背景关闭菜单

#### 7.6.3 交互行为规范

**菜单开关逻辑要求：**

- 使用状态管理控制菜单开启/关闭
- 支持点击外部区域关闭菜单
- 支持ESC键关闭菜单
- 提供打开、关闭、切换三种操作方法
- 正确清理事件监听器避免内存泄漏

#### 7.6.4 样式规范

**移动端导航项样式要求：**

- 块级显示，内边距16px 12px
- 基础字体大小16px，中等字重
- 深色文字，悬停时变为主色调
- 悬停背景色变化，过渡动画200ms
- 底部边框分隔

**动画效果要求：**

- 菜单打开：slide-in from right，300ms ease-out
- 菜单关闭：slide-out to right，300ms ease-in
- 背景遮罩：fade-in/out，200ms ease-in-out

#### 7.6.5 性能优化要求

**懒加载实现要求：**

- 移动端导航组件使用React.lazy懒加载
- 提供合适的加载状态占位符
- 只在菜单打开时才加载导航组件

**渲染优化：**

- 使用React.memo包装移动端组件
- 避免不必要的重渲染
- 合理使用useCallback和useMemo

#### 7.6.7 测试要求

**必须测试的场景：**

1. **响应式断点**：1024px、1280px、1536px
2. **交互功能**：打开/关闭菜单、点击外部关闭、ESC关闭
3. **性能测试**：菜单打开/关闭动画流畅性
4. **兼容性测试**：iOS Safari、Android Chrome、桌面浏览器
5. **过渡测试**：1024px临界点的切换流畅性

**验收标准：**

- 移动端导航完全功能化
- 用户体验流畅无卡顿
- 通过所有响应式断点测试

**违反以上规范将导致代码审查不通过。**

## 8. 状态管理规范 (强制执行)

### 8.1 状态分离原则 (强制执行)

**⚠️ 强制要求：严格分离客户端状态和服务端状态，禁止混合管理。**

**客户端状态 (Zustand)**：

- UI状态：loading, error, 表单状态
- 用户交互状态：选中、展开、模态框
- 临时状态：搜索输入、过滤条件
- 本地配置：主题、偏好设置

**服务端状态 (TanStack Query)**：

- 用户数据：profile, permissions
- 影片数据：列表、详情、搜索结果
- 下载任务状态：进度、历史记录
- 系统配置数据

### 8.2 Store设计规范

**状态结构设计**：

- ✅ **正确**：扁平化状态结构，避免深度嵌套
- ❌ **错误**：深度嵌套结构，难以维护和访问

**状态更新规范**：

- 使用action函数更新状态，禁止直接修改
- 状态更新必须通过Immer或不可变方式
- 批量更新减少重渲染

### 8.3 TanStack Query使用规范

**查询键设计**：

- 使用常量定义查询键，确保一致性
- 支持静态和动态查询键
- 便于缓存管理和查询失效

**缓存策略**：

- 用户数据：5min staleTime, 10min gcTime
- 影片数据：2min staleTime, 5min gcTime
- 实时数据：0 staleTime, 1min gcTime

## 9. 组件性能优化规范

### 9.1 渲染优化 (强制执行)

**渲染优化技术**：

- **React.memo**：使用自定义比较函数避免不必要的重渲染
- **useCallback**：缓存函数引用，避免子组件重渲染
- **useMemo**：缓存计算结果，避免重复计算

### 9.2 状态订阅优化

**选择器优化**：

- **精确选择器**：只订阅需要的状态片段
- **批量选择器**：使用shallow避免不必要的重渲染
- **选择器函数**：复用选择逻辑，提高性能

### 9.3 组件懒加载

**懒加载策略**：

- **页面级懒加载**：使用React.lazy延迟加载页面组件
- **组件级懒加载**：延迟加载重型组件
- **代码分割**：按路由或功能分割代码包

## 10. 可访问性规范 (A11y)

### 10.1 ARIA属性使用

**ARIA属性使用**：

- **按钮**：使用aria-label描述按钮功能，aria-expanded指示状态
- **表单元素**：使用aria-invalid、aria-describedby关联错误信息
- **错误提示**：使用role="alert"和aria-live提供屏幕阅读器支持

### 10.2 键盘导航

**焦点管理**：

- **模态框焦点**：使用useRef和useEffect管理焦点陷阱
- **键盘导航**：支持Tab键导航和ESC键关闭
- **焦点恢复**：关闭组件时恢复之前的焦点

## 11. 测试规范

### 11.1 测试策略

**单元测试**：Vitest + React Testing Library

- 组件渲染测试
- 用户交互测试
- 状态管理测试
- 工具函数测试

**集成测试**：Playwright

- 关键用户流程测试
- 跨页面交互测试
- API集成测试

**测试覆盖率要求**：

- 领域层：100%
- 应用层：90%+
- 组件层：80%+

### 11.2 测试编写规范

**测试编写规范**：

- **渲染测试**：验证组件正确渲染和显示内容
- **交互测试**：测试用户操作和组件响应
- **异步测试**：使用async/await处理异步操作
- **模拟数据**：使用createMockMovie等工具函数创建测试数据

## 12. 重构执行规范 (强制执行)

### 12.1 重构执行流程 (强制执行)

**⚠️ 强制要求：所有重构工作必须遵循标准化执行流程，确保代码质量和架构一致性。**

#### 12.1.1 重构优先级规则

**重构优先级排序：**

1. **识别重复逻辑，制定抽象计划**
   - 分析重复代码模式
   - 识别可复用的组件和逻辑
   - 制定具体的抽象策略

2. **创建自包含组件和可复用层**
   - 按照自包含组件架构原则创建组件
   - 抽象可复用的特化层（VipBadgeLayer、RatingBadgeLayer等）
   - 确保组件自带完整的视觉效果

3. **重构现有组件使用自包含架构**
   - 拆分违反自包含架构的单体组件
   - 应用自包含组件+配置驱动模式
   - 确保组件大小符合限制要求

4. **统一样式实现和配置化服务**
   - 消除硬编码样式和图片URL
   - 统一使用组件变体Token系统
   - 应用配置化图片服务规范

#### 12.1.2 重构检查清单

**重构前必须检查：**

- [ ] 是否违反自包含组件架构原则
- [ ] 是否存在重复的UI实现
- [ ] 是否有硬编码的图片URL或样式
- [ ] 组件是否超过大小限制（原子≤100行，分子≤200行，有机体≤300行）
- [ ] 是否包含3个以上不相关的业务逻辑
- [ ] Props接口是否超过10个属性

**重构后必须验证：**

- [ ] 无重复UI实现
- [ ] 无硬编码图片URL
- [ ] 组件API具备扩展性
- [ ] 遵循DDD分层架构
- [ ] 通过Chrome错误捕获检查
- [ ] 组件大小符合限制要求

#### 12.1.3 可复用层抽象标准

**必须抽象的重复逻辑：**

1. **VIP标签逻辑** → VipBadgeLayer
   - 统一VIP标识显示
   - 支持不同变体和样式
   - 集中权限控制逻辑

2. **评分显示逻辑** → RatingBadgeLayer
   - 统一评分格式和样式
   - 支持不同评分类型
   - 处理空值和异常情况

3. **质量标签逻辑** → QualityBadgeLayer
   - 统一影片质量标识
   - 支持多种质量等级
   - 标准化颜色和图标

4. **悬停交互逻辑** → HoverInteractionLayer
   - 统一悬停效果和动画
   - 支持不同交互模式
   - 性能优化的状态管理

5. **图片显示逻辑** → ImageLayer
   - 统一图片加载和错误处理
   - 集成配置化图片服务
   - 支持懒加载和占位符

#### 12.1.4 重构验收标准

**代码质量标准：**

- 遵循自包含组件架构设计原则
- 无重复代码和硬编码内容
- 通过所有ESLint和TypeScript检查
- 组件测试覆盖率达标

**架构一致性标准：**

- 符合DDD分层架构规范
- 正确使用@别名导入导出
- 遵循样式架构统一规范
- 组件API设计向后兼容

**性能和维护性标准：**

- 组件大小符合限制要求
- 正确使用React性能优化技巧
- 代码可读性和可维护性良好
- 文档注释完整准确

**违反以上重构规范将导致代码审查不通过。**

## 13. 其他开发规范要点

### 13.1 TypeScript规范

- 所有组件Props必须定义接口，使用严格类型检查
- 避免使用any类型，优先使用联合类型而非枚举
- 使用类型守卫和类型断言确保类型安全

### 13.2 API调用

- 使用OpenAPI规范，统一错误处理
- 统一错误码，用户友好提示，网络异常处理
- API调用逻辑应该在应用层服务中，不在组件或Store中

### 13.3 路由规范

- 嵌套路由设计，路由守卫实现，懒加载优化
- 基于角色的访问控制

### 13.4 Git提交规范

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

### 13.5 DDD项目结构

```
src/
├── presentation/     # 表现层：React组件、页面、UI交互
├── application/      # 应用层：用例服务、应用逻辑协调
├── domain/          # 领域层：业务实体、值对象、领域服务
├── infrastructure/  # 基础设施层：API调用、数据持久化、外部服务
├── tokens/          # 设计令牌：组件变体、样式配置
├── types/           # 类型定义
└── utils/           # 工具函数
```

### 13.6 开发工具配置

- **ESLint + Prettier**：代码规范和格式化，强制@别名导入
- **Husky + lint-staged**：提交前代码检查和自动格式化
- **Storybook**：组件文档化和交互式开发
- **React Query DevTools**：状态管理调试工具
