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
│   │   └── domains/     # 业务领域组件 (新增)
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

**自包含组件设计原则：**

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

## 4. 首页复合架构规范 (强制执行)

### 4.1 首页架构概述

**⚠️ 强制要求：首页必须采用BaseSection + BaseList + MixedContentList的复合架构，确保统一性和可维护性。**

**架构组成：**

- **BaseSection**：页面区块容器，提供标题、描述、操作按钮等统一布局
- **BaseList**：列表容器，支持响应式网格、空状态、加载状态
- **MixedContentList**：混合内容列表，通过内容渲染器系统支持多种内容类型

### 4.2 BaseSection规范

**组件职责：**

- 提供统一的区块标题和描述样式
- 支持右侧操作按钮（查看更多、筛选等）
- 管理区块的展开/收起状态
- 提供一致的间距和布局

**使用示例：**

```typescript
<BaseSection
  title="最新更新"
  description="最新上传的影片资源"
  action={<Button variant="ghost">查看更多</Button>}
  className="mb-8"
>
  <LatestUpdateList />
</BaseSection>
```

### 4.3 BaseList规范

**组件职责：**

- 提供响应式网格布局配置
- 管理列表的加载、错误、空状态
- 支持分页和无限滚动
- 统一的列表项间距和对齐

**响应式配置：**

```typescript
const responsiveColumns = {
  xs: 2,    // 手机：2列
  sm: 3,    // 平板：3列  
  md: 4,    // 桌面：4列
  lg: 5,    // 大屏：5列
  xl: 6     // 超大屏：6列
}
```

### 4.4 MixedContentList规范

**组件职责：**

- 通过内容渲染器系统渲染不同类型的内容
- 支持内容类型过滤（`allowedContentTypes`）
- 提供统一的渲染配置（`defaultRendererConfig`）
- 支持特定内容类型的配置覆盖（`rendererConfigs`）

**使用示例：**

```typescript
<MixedContentList
  items={mixedItems}
  allowedContentTypes={['movie', 'photo', 'collection']}
  defaultRendererConfig={{
    hoverEffect: true,
    aspectRatio: '16/9',
    showBadge: true,
    size: 'medium'
  }}
  rendererConfigs={{
    movie: { aspectRatio: '2/3' },
    photo: { aspectRatio: '1/1' }
  }}
  onItemClick={handleItemClick}
  className="grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
/>
```

### 4.5 领域组件集成规范

**领域组件结构：**

```typescript
// HotSection.tsx - 热门内容区块
export const HotSection: React.FC = () => {
  return (
    <BaseSection
      title="热门推荐"
      description="最受欢迎的影片内容"
      action={<Button variant="ghost">查看更多</Button>}
    >
      <HotList />
    </BaseSection>
  )
}

// HotList.tsx - 热门内容列表
export const HotList: React.FC = () => {
  const { data: hotItems } = useHotContent()
  
  return (
    <BaseList
      columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
      loading={isLoading}
      error={error}
    >
      <MixedContentList
        items={hotItems}
        allowedContentTypes={['movie', 'collection']}
        defaultRendererConfig={{
          hoverEffect: true,
          aspectRatio: '2/3',
          showBadge: true
        }}
      />
    </BaseList>
  )
}
```

### 4.6 首页组装规范

**首页结构：**

```typescript
// HomePage.tsx
export const HomePage: React.FC = () => {
  return (
    <Container className="py-6 space-y-8">
      <HotSection />
      <LatestUpdateSection />
      <CollectionSection />
      <PhotoSection />
    </Container>
  )
}
```

**优势：**

- **统一性**：所有区块使用相同的布局和样式模式
- **可维护性**：修改BaseSection即可影响所有区块
- **灵活性**：通过配置支持不同的内容类型和样式
- **可扩展性**：新增区块只需创建对应的Section和List组件

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
// @types/renderer.types.ts
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

export interface RendererFactory {
  register: (renderer: ContentRenderer) => void
  unregister: (type: string) => void
  getRenderer: (item: any) => ContentRenderer | null
  getAllRenderers: () => ContentRenderer[]
}
```

### 5.3 渲染器实现规范

**基础渲染器示例：**

```typescript
// @components/domains/shared/content-renderers/MovieRenderer.tsx
export const MovieRenderer: ContentRenderer<MovieItem> = {
  type: 'movie',
  priority: 10,
  
  canRender: (item: any): item is MovieItem => {
    return item && typeof item === 'object' && 'type' in item && item.type === 'movie'
  },
  
  render: (item: MovieItem, config: RendererConfig = {}) => {
    const {
      size = 'medium',
      aspectRatio = '2/3',
      hoverEffect = true,
      showBadge = true,
      className = ''
    } = config
    
    return (
      <MovieCard
        movie={item}
        size={size}
        aspectRatio={aspectRatio}
        hoverEffect={hoverEffect}
        showBadge={showBadge}
        className={className}
      />
    )
  }
}
```

### 5.4 渲染器工厂规范

**工厂实现：**

```typescript
// @infrastructure/renderer/RendererFactory.ts
export class RendererFactory implements RendererFactory {
  private renderers = new Map<string, ContentRenderer>()
  
  register(renderer: ContentRenderer): void {
    this.renderers.set(renderer.type, renderer)
  }
  
  unregister(type: string): void {
    this.renderers.delete(type)
  }
  
  getRenderer(item: any): ContentRenderer | null {
    // 按优先级排序，找到第一个能渲染的渲染器
    const sortedRenderers = Array.from(this.renderers.values())
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    
    return sortedRenderers.find(renderer => renderer.canRender(item)) || null
  }
  
  getAllRenderers(): ContentRenderer[] {
    return Array.from(this.renderers.values())
  }
}

// 全局工厂实例
export const rendererFactory = new RendererFactory()
```

### 5.5 渲染器注册规范

**自动注册机制：**

```typescript
// @components/domains/shared/content-renderers/index.ts
import { rendererFactory } from '@infrastructure/renderer/RendererFactory'
import { MovieRenderer } from './MovieRenderer'
import { PhotoRenderer } from './PhotoRenderer'
import { CollectionRenderer } from './CollectionRenderer'

// 自动注册所有渲染器
const renderers = [
  MovieRenderer,
  PhotoRenderer,
  CollectionRenderer
]

renderers.forEach(renderer => {
  rendererFactory.register(renderer)
})

export { rendererFactory }
export * from './MovieRenderer'
export * from './PhotoRenderer'
export * from './CollectionRenderer'
```

### 5.6 MixedContentList集成规范

**集成使用：**

```typescript
// @components/domains/shared/MixedContentList.tsx
import { rendererFactory } from '@components/domains/shared/content-renderers'

export interface MixedContentListProps {
  items: any[]
  allowedContentTypes?: string[]
  defaultRendererConfig?: RendererConfig
  rendererConfigs?: Record<string, RendererConfig>
  onItemClick?: (item: any) => void
  className?: string
}

export const MixedContentList: React.FC<MixedContentListProps> = ({
  items,
  allowedContentTypes,
  defaultRendererConfig = {},
  rendererConfigs = {},
  onItemClick,
  className = ''
}) => {
  const renderItem = (item: any, index: number) => {
    const renderer = rendererFactory.getRenderer(item)
    
    if (!renderer) {
      console.warn('No renderer found for item:', item)
      return null
    }
    
    // 检查是否允许该内容类型
    if (allowedContentTypes && !allowedContentTypes.includes(renderer.type)) {
      return null
    }
    
    // 合并配置
    const config = {
      ...defaultRendererConfig,
      ...rendererConfigs[renderer.type]
    }
    
    return (
      <div
        key={index}
        onClick={() => onItemClick?.(item)}
        className="cursor-pointer"
      >
        {renderer.render(item, config)}
      </div>
    )
  }
  
  return (
    <div className={`grid gap-4 ${className}`}>
      {items.map(renderItem).filter(Boolean)}
    </div>
  )
}
```

### 5.7 扩展性规范

**新增渲染器步骤：**

1. **创建渲染器**：实现`ContentRenderer`接口
2. **注册渲染器**：在`content-renderers/index.ts`中注册
3. **配置支持**：在`RendererConfig`中添加特定配置项
4. **类型安全**：更新TypeScript类型定义

**示例：新增视频渲染器**

```typescript
// VideoRenderer.tsx
export const VideoRenderer: ContentRenderer<VideoItem> = {
  type: 'video',
  priority: 15,
  
  canRender: (item: any): item is VideoItem => {
    return item?.type === 'video'
  },
  
  render: (item: VideoItem, config: RendererConfig = {}) => {
    return <VideoCard video={item} {...config} />
  }
}
```

**优势：**

- **统一性**：所有内容使用相同的渲染机制
- **可扩展性**：轻松添加新的内容类型支持
- **配置灵活性**：支持细粒度的渲染配置
- **类型安全**：完整的TypeScript支持
- **性能优化**：按需渲染和优先级控制

## 6. 图片服务系统规范 (强制执行)

### 6.1 图片服务概述

**⚠️ 强制要求：所有图片URL处理必须通过统一的图片服务系统，确保性能优化和环境适配。**

**系统组成：**

- **图片服务Hook**：提供统一的图片URL处理接口
- **图片服务工厂**：根据环境和配置创建不同的服务实例
- **环境适配器**：处理开发、测试、生产环境的差异
- **优化配置**：支持懒加载、响应式、格式转换等优化选项

### 6.2 图片服务Hook规范

**核心Hook接口：**

```typescript
// @hooks/useImageService.ts
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

export const useImageService = (): ImageService => {
  const environment = useEnvironment()
  const imageService = useMemo(() => {
    return ImageServiceFactory.create(environment)
  }, [environment])
  
  return imageService
}
```

### 6.3 图片服务工厂规范

**工厂实现：**

```typescript
// @infrastructure/image/ImageServiceFactory.ts
export class ImageServiceFactory {
  static create(environment: Environment): ImageService {
    switch (environment.type) {
      case 'development':
        return new DevelopmentImageService(environment.config)
      case 'production':
        return new ProductionImageService(environment.config)
      case 'test':
        return new MockImageService(environment.config)
      default:
        return new DefaultImageService(environment.config)
    }
  }
}

// 生产环境图片服务
export class ProductionImageService implements ImageService {
  constructor(private config: ImageServiceConfig) {}
  
  getImageUrl(originalUrl: string, options: ImageServiceOptions = {}): string {
    const {
      width,
      height,
      quality = 80,
      format = 'webp',
      lazy = true
    } = options
    
    // CDN URL 转换
    const cdnUrl = this.transformToCDN(originalUrl)
    
    // 添加优化参数
    const params = new URLSearchParams()
    if (width) params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    params.set('q', quality.toString())
    params.set('f', format)
    
    return `${cdnUrl}?${params.toString()}`
  }
  
  private transformToCDN(url: string): string {
    // 将原始URL转换为CDN URL
    return url.replace(this.config.originalDomain, this.config.cdnDomain)
  }
  
  async preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = reject
      img.src = url
    })
  }
  
  generateSrcSet(baseUrl: string, widths: number[]): string {
    return widths
      .map(width => `${this.getImageUrl(baseUrl, { width })} ${width}w`)
      .join(', ')
  }
  
  isImageCached(url: string): boolean {
    // 检查图片是否已缓存
    return this.config.cache?.has(url) || false
  }
}
```

### 6.4 环境适配规范

**开发环境适配：**

```typescript
// @infrastructure/image/DevelopmentImageService.ts
export class DevelopmentImageService implements ImageService {
  getImageUrl(originalUrl: string, options: ImageServiceOptions = {}): string {
    // 开发环境直接返回原始URL，不进行优化
    if (originalUrl.startsWith('http')) {
      return originalUrl
    }
    
    // 本地图片添加开发服务器前缀
    return `${this.config.devServerUrl}${originalUrl}`
  }
  
  async preloadImage(url: string): Promise<void> {
    // 开发环境跳过预加载
    return Promise.resolve()
  }
  
  generateSrcSet(baseUrl: string, widths: number[]): string {
    // 开发环境返回单一源
    return this.getImageUrl(baseUrl)
  }
  
  isImageCached(): boolean {
    // 开发环境总是返回false
    return false
  }
}
```

### 6.5 组件集成规范

**图片组件使用：**

```typescript
// @components/atoms/OptimizedImage.tsx
export interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  lazy?: boolean
  responsive?: boolean
  aspectRatio?: string
  fallback?: string
  onLoad?: () => void
  onError?: () => void
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  lazy = true,
  responsive = true,
  aspectRatio,
  fallback,
  onLoad,
  onError
}) => {
  const imageService = useImageService()
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  
  const optimizedSrc = useMemo(() => {
    return imageService.getImageUrl(src, {
      width,
      height,
      lazy,
      format: 'webp'
    })
  }, [src, width, height, lazy, imageService])
  
  const srcSet = useMemo(() => {
    if (!responsive) return undefined
    
    const widths = [320, 640, 768, 1024, 1280, 1536]
    return imageService.generateSrcSet(src, widths)
  }, [src, responsive, imageService])
  
  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }
  
  const handleError = () => {
    setHasError(true)
    onError?.()
  }
  
  if (hasError && fallback) {
    return (
      <img
        src={fallback}
        alt={alt}
        className={className}
        onLoad={handleLoad}
      />
    )
  }
  
  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      loading={lazy ? 'lazy' : 'eager'}
      onLoad={handleLoad}
      onError={handleError}
    />
  )
}
```

### 6.6 渲染器集成规范

**在内容渲染器中使用：**

```typescript
// @components/domains/shared/content-renderers/MovieRenderer.tsx
export const MovieRenderer: ContentRenderer<MovieItem> = {
  type: 'movie',
  
  render: (item: MovieItem, config: RendererConfig = {}) => {
    return (
      <MovieCard
        movie={item}
        imageComponent={OptimizedImage}
        imageOptions={{
          width: config.size === 'large' ? 400 : 300,
          aspectRatio: config.aspectRatio || '2/3',
          lazy: true,
          responsive: true
        }}
        {...config}
      />
    )
  }
}
```

### 6.7 性能优化规范

**预加载策略：**

```typescript
// @hooks/useImagePreloader.ts
export const useImagePreloader = () => {
  const imageService = useImageService()
  
  const preloadImages = useCallback(async (urls: string[]) => {
    const preloadPromises = urls.map(url => {
      const optimizedUrl = imageService.getImageUrl(url, {
        width: 300,
        format: 'webp'
      })
      return imageService.preloadImage(optimizedUrl)
    })
    
    try {
      await Promise.all(preloadPromises)
    } catch (error) {
      console.warn('Some images failed to preload:', error)
    }
  }, [imageService])
  
  return { preloadImages }
}
```

**懒加载集成：**

```typescript
// @hooks/useIntersectionObserver.ts
export const useIntersectionObserver = (
  ref: RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [ref, options])
  
  return isIntersecting
}
```

### 6.8 配置管理规范

**环境配置：**

```typescript
// @infrastructure/config/imageConfig.ts
export interface ImageServiceConfig {
  originalDomain: string
  cdnDomain: string
  devServerUrl: string
  defaultQuality: number
  supportedFormats: string[]
  cache?: Map<string, any>
}

export const imageConfigs: Record<string, ImageServiceConfig> = {
  development: {
    originalDomain: 'localhost:3000',
    cdnDomain: 'localhost:3000',
    devServerUrl: 'http://localhost:3000',
    defaultQuality: 80,
    supportedFormats: ['webp', 'jpeg', 'png']
  },
  production: {
    originalDomain: 'api.example.com',
    cdnDomain: 'cdn.example.com',
    devServerUrl: '',
    defaultQuality: 85,
    supportedFormats: ['avif', 'webp', 'jpeg'],
    cache: new Map()
  }
}
```

**优势：**

- **统一管理**：所有图片处理通过统一接口
- **环境适配**：自动适配不同环境的需求
- **性能优化**：自动应用最佳实践优化
- **类型安全**：完整的TypeScript支持
- **可配置性**：支持细粒度的优化配置

## 7. HTML设计稿迁移策略 (强制执行)

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

## 8. @别名导入导出规范 (强制执行)

**⚠️ 强制要求：业务代码必须使用@别名导入，index.ts文件必须使用相对路径导出。**

### 8.1 别名配置规范

**Vite配置：**

```typescript
// vite.config.ts
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
      "@images": path.resolve(__dirname, "./src/assets/images"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@tokens": path.resolve(__dirname, "./src/tokens"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@application": path.resolve(__dirname, "./src/application"),
      "@presentation": path.resolve(__dirname, "./src/presentation"),
      "@types-movie": path.resolve(__dirname, "./src/types/movie.types"),
      "@types-unified": path.resolve(__dirname, "./src/types/unified.types")
    }
  }
})
```

**TypeScript配置：**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/presentation/components/*"],
      "@pages/*": ["./src/presentation/pages/*"],
      "@hooks/*": ["./src/presentation/hooks/*"],
      "@services/*": ["./src/application/services/*"],
      "@domain/*": ["./src/domain/*"],
      "@infrastructure/*": ["./src/infrastructure/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@assets/*": ["./src/assets/*"],
      "@images/*": ["./src/assets/images/*"],
      "@styles/*": ["./src/styles/*"],
      "@tokens/*": ["./src/tokens/*"],
      "@data/*": ["./src/data/*"],
      "@application/*": ["./src/application/*"],
      "@presentation/*": ["./src/presentation/*"],
      "@types-movie": ["./src/types/movie.types"],
      "@types-unified": ["./src/types/unified.types"]
    }
  }
}
```

### 8.2 业务代码导入规范

**✅ 正确方式：**

```typescript
// 组件导入
import { Button, Icon, Badge } from '@components/atoms'
import { MovieCard, SearchBox } from '@components/molecules'
import { NavigationHeader, HeroSection } from '@components/organisms'
import { AuthTemplate, UserTemplate } from '@components/templates'

// 页面导入
import { HomePage } from '@pages/home/HomePage'
import { LoginPage } from '@pages/auth/LoginPage'

// Hook导入
import { useAuth, useTheme } from '@application/hooks'
import { useImageService } from '@presentation/hooks/image'

// 服务导入
import { AuthenticationService } from '@domain/services'
import { MovieApplicationService } from '@application/services'

// 类型导入
import type { MovieItem, PhotoItem } from '@types-movie'
import type { UnifiedContentItem } from '@types-unified'

// 工具导入
import { cn } from '@utils/cn'
import { formatDate, formatNumber } from '@utils/formatters'

// 资源导入
import heroImage from '@images/heroes/hero-01.jpg'
import { buttonVariants } from '@tokens/design-system'
```

**❌ 禁止方式：**

```typescript
// 禁止相对路径
import { Button } from '../atoms/Button'
import { MovieCard } from '../../molecules/MovieCard'
import { useAuth } from '../../../hooks/useAuth'

// 禁止@/格式
import { Button } from '@/components/atoms/Button'
import { useAuth } from '@/hooks/useAuth'

// 禁止混合使用
import { Button } from '@components/atoms/Button'
import { Icon } from '../atoms/Icon'  // 错误：混合使用
```

### 8.3 index.ts导出规范 (强制执行)

**⚠️ 强制要求：所有index.ts文件必须使用相对路径导出，符合行业标准最佳实践。**

#### 8.3.1 index.ts导出原则

**相对路径导出原则：**

- index.ts文件作为模块导出入口，必须使用相对路径导出同级文件
- 符合npm包和开源项目的行业标准做法
- 提供语义清晰的文件结构关系
- 支持重构友好性，移动目录时自动保持正确路径

#### 8.3.2 导出规范要求

**✅ 正确的index.ts导出方式：**

```typescript
// @components/atoms/index.ts
export * from './Button'
export * from './Icon'
export * from './Badge'
export * from './Input'
export * from './Avatar'

// @components/molecules/index.ts
export * from './MovieCard'
export * from './SearchBox'
export * from './UserProfile'

// 跨层级导出使用@别名
export { MovieLayer } from '@components/layers/MovieLayer'
export { ImageLayer } from '@components/layers/ImageLayer'

// 类型导出遵循相同规则
export type { ButtonProps } from './Button'
export type { IconProps } from './Icon'
```

**❌ 错误的index.ts导出方式：**

```typescript
// 禁止在index.ts中使用@别名导出同级文件
export * from '@components/atoms/Button'  // 错误
export * from '@components/atoms/Icon'    // 错误

// 禁止使用@/格式
export * from '@/components/atoms/Button' // 错误
```

### 8.4 特殊场景与例外规则

#### 8.4.1 允许的例外场景

**动态导入：**

```typescript
// 路由懒加载
const HomePage = React.lazy(() => import('@pages/home/HomePage'))
const LoginPage = React.lazy(() => import('@pages/auth/LoginPage'))

// 条件导入
const { useMovieStore } = await import('@application/stores/movieStore')
```

**测试文件：**

```typescript
// 测试文件可以使用相对路径导入被测试文件
import { Button } from './Button'
import { render, screen } from '@testing-library/react'
```

**配置文件：**

```typescript
// Storybook配置等可以使用相对路径
import type { StorybookConfig } from '@storybook/react-vite'
```

#### 8.4.2 严格禁止的场景

**业务组件内部：**

```typescript
// 严格禁止在业务组件中使用相对路径
// ❌ 错误
import { Icon } from '../Icon'
import { useAuth } from '../../hooks/useAuth'

// ✅ 正确
import { Icon } from '@components/atoms'
import { useAuth } from '@application/hooks'
```

### 8.5 ESLint强制规则

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
    ],
    "import/no-relative-packages": "error",
    "import/no-relative-parent-imports": "error"
  }
}
```

### 8.6 导入导出最佳实践

#### 8.6.1 导入顺序规范

```typescript
// 1. 第三方库导入
import React, { useState, useEffect } from 'react'
import { QueryClient } from '@tanstack/react-query'

// 2. 内部模块导入（按层级顺序）
import { Button, Icon } from '@components/atoms'
import { MovieCard } from '@components/molecules'
import { NavigationHeader } from '@components/organisms'
import { AuthTemplate } from '@components/templates'
import { useAuth } from '@application/hooks'
import { AuthenticationService } from '@domain/services'
import { movieApi } from '@infrastructure/api'
import { cn } from '@utils/cn'

// 3. 类型导入
import type { MovieItem } from '@types-movie'
import type { ComponentProps } from 'react'

// 4. 资源导入
import heroImage from '@images/heroes/hero-01.jpg'
import '@styles/components.css'
```

#### 8.6.2 导出最佳实践

```typescript
// 优先使用命名导出
export const Button: React.FC<ButtonProps> = ({ ... }) => { ... }
export const Icon: React.FC<IconProps> = ({ ... }) => { ... }

// 类型导出
export type { ButtonProps, IconProps }

// 默认导出仅用于页面组件
export default HomePage
```

**优势：**

- **一致性**：统一的导入导出规范
- **可维护性**：清晰的模块依赖关系
- **重构友好**：支持IDE自动重构
- **团队协作**：减少代码审查中的争议
- **工具支持**：完整的ESLint和TypeScript支持

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

## 9. API调用规范

### 9.1 接口定义

- 使用OpenAPI规范，统一错误处理
- 统一错误码，用户友好提示，网络异常处理
- API调用逻辑应该在应用层服务中，不在组件或Store中

### 9.2 错误处理

- 统一错误码和用户友好提示
- 网络异常处理和重试机制

### 9.3 API端点组织与存储接口规范 (强制执行)

**⚠️ 强制要求：所有API端点和存储接口必须按DDD架构分层组织，确保清晰的职责分离和统一的访问模式。**

#### 9.3.1 API端点组织架构

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
│   ├── localStorage.ts       # 本地存储管理
│   ├── sessionStorage.ts     # 会话存储管理
│   └── indexedDB.ts         # IndexedDB管理
├── repositories/              # 仓储层
│   ├── index.ts              # 仓储统一导出入口
│   ├── UserRepository.ts     # 用户仓储实现
│   ├── MovieRepository.ts    # 影片仓储实现
│   └── DownloadRepository.ts # 下载仓储实现
└── cache/                     # 缓存管理
    ├── CacheManager.ts       # 缓存管理器
    └── index.ts              # 缓存统一导出
```

#### 9.3.2 API端点配置规范

**端点配置统一管理：**

```typescript
// @infrastructure/api/endpoints.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 按业务领域分组端点
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  PROFILE: '/auth/profile',
} as const

export const USER_ENDPOINTS = {
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  PREFERENCES: '/users/preferences',
  FAVORITES: '/users/favorites',
  WATCH_HISTORY: '/users/watch-history',
} as const

export const MOVIE_ENDPOINTS = {
  MOVIES: '/movies',
  MOVIE_BY_ID: (id: string) => `/movies/${id}`,
  SEARCH: '/movies/search',
  CATEGORIES: '/movies/categories',
  TRENDING: '/movies/trending',
} as const

export const DOWNLOAD_ENDPOINTS = {
  DOWNLOADS: '/downloads',
  DOWNLOAD_BY_ID: (id: string) => `/downloads/${id}`,
  START_DOWNLOAD: '/downloads/start',
  PAUSE_DOWNLOAD: (id: string) => `/downloads/${id}/pause`,
  CANCEL_DOWNLOAD: (id: string) => `/downloads/${id}/cancel`,
} as const
```

**端点工具函数：**

```typescript
// 构建完整API URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`
}

// 构建带参数的URL
export const buildUrlWithParams = (
  endpoint: string, 
  params: Record<string, any>
): string => {
  const url = new URL(buildApiUrl(endpoint))
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value))
    }
  })
  return url.toString()
}
```

#### 9.3.3 API客户端基础设施

**统一HTTP客户端：**

```typescript
// @infrastructure/api/ApiClient.ts
export interface ApiResponse<T = unknown> {
  data: T
  message: string
  code: number
  success: boolean
  timestamp: string
}

export interface ApiError {
  code: number
  message: string
  details?: unknown
  timestamp: string
}

export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  retries?: number
  retryDelay?: number
}

export class ApiClient {
  private baseURL: string
  private defaultTimeout: number
  private defaultRetries: number

  constructor(config: {
    baseURL: string
    timeout?: number
    retries?: number
  }) {
    this.baseURL = config.baseURL
    this.defaultTimeout = config.timeout || 10000
    this.defaultRetries = config.retries || 3
  }

  // 通用请求方法
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    config?: RequestConfig
  ): Promise<ApiResponse<T>>

  // HTTP方法封装
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>>
  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>
  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>>
  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>
}

// 全局API客户端实例
export const apiClient = new ApiClient({
  baseURL: API_BASE_URL,
  timeout: 10000,
  retries: 3,
})
```

#### 9.3.4 领域API服务规范

**按领域组织API服务：**

```typescript
// @infrastructure/api/authApi.ts
export class AuthApi {
  static async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials)
  }

  static async logout(): Promise<ApiResponse<void>> {
    return apiClient.post(AUTH_ENDPOINTS.LOGOUT)
  }

  static async refreshToken(): Promise<ApiResponse<TokenResponse>> {
    return apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN)
  }

  static async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get(AUTH_ENDPOINTS.PROFILE)
  }
}

// @infrastructure/api/movieApi.ts
export class MovieApi {
  static async getMovies(params?: MovieQueryParams): Promise<ApiResponse<PaginatedResponse<Movie>>> {
    const url = params ? buildUrlWithParams(MOVIE_ENDPOINTS.MOVIES, params) : MOVIE_ENDPOINTS.MOVIES
    return apiClient.get(url)
  }

  static async getMovieById(id: string): Promise<ApiResponse<MovieDetail>> {
    return apiClient.get(MOVIE_ENDPOINTS.MOVIE_BY_ID(id))
  }

  static async searchMovies(query: string, params?: SearchParams): Promise<ApiResponse<SearchResult>> {
    return apiClient.get(buildUrlWithParams(MOVIE_ENDPOINTS.SEARCH, { q: query, ...params }))
  }
}
```

#### 9.3.5 存储接口规范

**统一存储接口：**

```typescript
// @infrastructure/storage/index.ts
export interface IStorageManager {
  setItem<T>(key: string, value: T): void
  getItem<T>(key: string, defaultValue?: T): T | null
  removeItem(key: string): void
  clear(): void
  hasItem(key: string): boolean
  getAllKeys(): string[]
  getStorageSize(): number
  isAvailable(): boolean
}

export interface StorageItem<T = any> {
  data: T
  timestamp: number
  version: string
  expiry?: number
}

export interface StorageStats {
  totalItems: number
  totalSize: number
  largestItem: { key: string; size: number } | null
}
```

**存储服务实现：**

```typescript
// @infrastructure/storage/StorageService.ts
export class StorageManager {
  public localStorage: LocalStorageService
  public sessionStorage: SessionStorageService
  public indexedDB: IndexedDBService

  constructor(namespace = 'movie-app') {
    this.localStorage = new LocalStorageService(namespace)
    this.sessionStorage = new SessionStorageService(namespace)
    this.indexedDB = new IndexedDBService(defaultSchema)
  }

  async init(): Promise<void> {
    await this.indexedDB.init()
  }

  // 智能存储选择
  async setItem<T>(key: string, value: T, options?: StorageOptions): Promise<void> {
    const size = JSON.stringify(value).length
    
    if (size > 5 * 1024 * 1024) { // > 5MB
      return this.indexedDB.setItem(key, value, options)
    } else if (options?.ttl) {
      return this.sessionStorage.setItem(key, value, options)
    } else {
      return this.localStorage.setItem(key, value, options)
    }
  }
}

// 全局存储管理器实例
export const storageManager = new StorageManager()
```

#### 9.3.6 仓储层规范

**仓储接口定义：**

```typescript
// @infrastructure/repositories/index.ts
export interface Repository<T, ID = string> {
  findById(id: ID): Promise<T | null>
  findAll(): Promise<T[]>
  save(entity: T): Promise<T>
  delete(id: ID): Promise<void>
}

// 领域特定仓储接口
export interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>
  findByUsername(username: string): Promise<User | null>
}

export interface MovieRepository extends Repository<Movie> {
  findByGenre(genre: string): Promise<Movie[]>
  findByYear(year: number): Promise<Movie[]>
  search(query: string): Promise<Movie[]>
}

export interface DownloadRepository extends Repository<Download> {
  findByUserId(userId: string): Promise<Download[]>
  findActiveDownloads(): Promise<Download[]>
}
```

#### 6.3.7 缓存管理规范

**多级缓存策略：**

```typescript
// @infrastructure/cache/CacheManager.ts
export interface CacheOptions {
  ttl?: number // 生存时间（毫秒）
  maxSize?: number // 最大缓存大小
  strategy?: 'memory' | 'localStorage' | 'indexedDB' | 'multi-level'
  serialize?: boolean // 是否序列化
  compress?: boolean // 是否压缩
}

export class CacheManager {
  private memoryCache: Map<string, CacheItem>
  private storageCache: IStorageManager
  private indexedDBCache: IndexedDBService

  constructor() {
    this.memoryCache = new Map()
    this.storageCache = storageManager.localStorage
    this.indexedDBCache = storageManager.indexedDB
  }

  async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    // 多级缓存查找策略
    // 1. 内存缓存
    // 2. localStorage
    // 3. IndexedDB
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    // 根据策略选择缓存层级
  }
}

// 全局缓存管理器实例
export const cacheManager = new CacheManager()
```

#### 9.3.8 统一导出规范

**基础设施层统一导出：**

```typescript
// @infrastructure/index.ts
// API服务
export * from './api'

// 存储服务
export * from './storage'

// 仓储层
export * from './repositories'

// 缓存管理
export { CacheManager, cacheManager } from './cache/CacheManager'

// 基础设施配置
export interface InfrastructureConfig {
  apiBaseUrl: string
  apiTimeout: number
  retryAttempts: number
  cacheEnabled: boolean
  storagePrefix: string
}

// 基础设施初始化
export async function initializeInfrastructure(): Promise<void> {
  await storageManager.init()
  console.log('基础设施初始化完成')
}
```

#### 9.3.9 类型安全规范

**API响应类型定义：**

```typescript
// @types/api.types.ts
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// 领域特定类型
export interface MovieQueryParams extends PaginationParams {
  genre?: string
  year?: number
  rating?: number
  quality?: string[]
}

export interface SearchParams extends PaginationParams {
  category?: string
  dateRange?: [string, string]
}
```

#### 9.3.10 错误处理规范

**统一错误处理策略：**

```typescript
// @infrastructure/api/errorHandler.ts
export class ApiErrorHandler {
  static handle(error: ApiError): void {
    switch (error.code) {
      case 401:
        // 未授权，重定向到登录页
        break
      case 403:
        // 权限不足，显示权限错误
        break
      case 404:
        // 资源不存在
        break
      case 500:
        // 服务器错误
        break
      default:
        // 通用错误处理
    }
  }
}
```

#### 9.3.11 性能优化规范

**API性能优化策略：**

- **请求去重**: 相同请求在短时间内只发送一次
- **响应缓存**: 根据业务需求设置合理的缓存策略
- **分页加载**: 大数据集使用分页或虚拟滚动
- **预加载**: 预测用户行为，提前加载可能需要的数据

**存储性能优化：**

- **智能存储选择**: 根据数据大小和生命周期选择合适的存储方式
- **数据压缩**: 大数据使用压缩算法减少存储空间
- **过期清理**: 定期清理过期数据，避免存储空间浪费
- **批量操作**: 批量读写操作提高性能

#### 9.3.12 测试规范

**API测试要求：**

- **单元测试**: 所有API服务方法100%测试覆盖
- **集成测试**: API客户端与后端服务的集成测试
- **错误场景测试**: 网络异常、超时、错误响应等场景
- **性能测试**: 并发请求、大数据量传输等性能测试

**存储测试要求：**

- **功能测试**: 存储、读取、删除等基本功能测试
- **容量测试**: 存储容量限制和清理机制测试
- **兼容性测试**: 不同浏览器的存储API兼容性测试
- **数据完整性测试**: 数据序列化和反序列化的完整性测试

## 10. 配置化图片服务规范 (强制执行)

**⚠️ 强制要求：所有图片资源必须通过配置化图片服务管理，禁止硬编码图片URL。**

#### 10.1 图片服务抽象层

**设计原则**：

- 开发期使用稳定的Placeholder服务
- 生产期平滑切换到真实图片服务
- 统一的图片处理接口（裁剪、压缩、格式转换）
- 自动fallback机制

#### 10.2 配置化图片策略

**环境配置**：

- 开发环境：使用Picsum服务，支持seed一致性
- 生产环境：使用自定义CDN服务，支持格式优化
- 统一配置接口：provider、baseUrl、尺寸、质量、格式

#### 10.3 图片服务接口实现

**抽象接口**：

- ImageService：统一图片服务接口
- 核心方法：getUrl、getOptimizedUrl、getPlaceholder、generateSrcSet
- 配置选项：尺寸、质量、格式、裁剪模式

**实现策略**：

- Picsum服务：开发期使用，支持seed一致性
- 自定义服务：生产期使用，支持参数化URL
- Cloudinary服务：可选高级图片处理

#### 10.4 图片服务工厂

**服务工厂**：

- 单例模式：确保全局只有一个图片服务实例
- 环境自动切换：根据NODE_ENV选择对应服务
- 类型安全：TypeScript接口保证类型一致性

#### 10.5 React Hook封装

**使用Hook**：

- useImageService：提供便捷的图片操作方法
- 业务语义：getMoviePoster、getCollectionThumbnail等
- 错误处理：自动fallback到placeholder

#### 10.6 组件使用示例

**在组件中使用**：

- 通过useImageService Hook获取图片操作方法
- 使用getMoviePoster、getPlaceholder等方法
- 自动处理环境切换和错误回退

#### 10.7 迁移指南

**从硬编码URL迁移**：

- 旧方式：直接硬编码URL字符串
- 新方式：通过Hook获取配置化URL
- 优势：环境自动切换，统一错误处理

**环境切换**：

- 开发环境：Picsum服务
- 生产环境：自定义CDN服务
- 无需修改组件代码

**违反以上规范将导致代码审查不通过。**

## 11. 样式架构规范

### 11.1 技术栈

- **主要样式**: Tailwind CSS (utility-first)
- **UI组件库**: Radix UI Primitives + next-themes
- **组件变体**: 基于Token的变体配置
- **响应式**: Tailwind响应式前缀 (sm:, md:, lg:, xl:)
- **字体**: HarmonyOS Sans SC

### 11.2 样式规范

**允许的样式写法：**
1. Tailwind CSS classes
2. Radix UI 组件 + Tailwind
3. 条件样式使用clsx工具

**禁止使用：**
- CSS Modules
- CSS-in-JS
- 内联样式
- !important覆盖

### 11.3 Token系统

**目录结构：**
```
@tokens/
├── design-system/    # 基础变体
├── domains/         # 业务领域变体
└── index.ts        # 统一导出
```

#### 11.4.2 统一入口策略 (强制执行)

**⚠️ 强制要求：所有Token导入必须通过统一入口，禁止直接导入子模块。**

**正确的导入方式：**

```typescript
// ✅ 正确：通过统一入口导入
import { 
  ButtonVariant, 
  MovieDetailVariant, 
  DownloadProgressVariant 
} from '@tokens'

// ✅ 正确：按分类导入
import { ButtonVariant, InputVariant } from '@tokens/design-system'
import { MovieDetailVariant } from '@tokens/domains'
```

**❌ 严格禁止的导入方式：**

```typescript
// ❌ 错误：直接导入子模块
import { ButtonVariant } from '@tokens/design-system/base-variants'
import { MovieDetailVariant } from '@tokens/domains/movie-variants'
```

#### 11.4.3 混合组织策略

**设计系统变体 (Design System Variants)：**

- **定义**: 跨业务领域的通用UI组件变体
- **位置**: `@tokens/design-system/`
- **特点**: 业务无关、高复用性、标准化
- **组件**: Button, Input, Badge, Card, Select, Switch等

**业务领域变体 (Domain Variants)：**

- **定义**: 特定业务领域的专用组件变体
- **位置**: `@tokens/domains/`
- **特点**: 业务相关、领域专用、功能导向
- **组件**: MovieDetail, DownloadProgress, UserProfile等

#### 11.4.4 变体配置规范

**基础组件变体配置：**

- **Button**: primary, secondary, danger, ghost, outline, success, warning, info, link
- **Input**: default, filled, outlined, underlined
- **Badge**: default, primary, secondary, success, warning, danger, info, outline
- **Card**: default, elevated, outlined, ghost, featured
- **Select**: default, filled, outlined
- **Switch**: default, success, warning, danger

**业务领域变体配置：**

- **MovieDetail**: compact, detailed, hero, card
- **DownloadProgress**: linear, circular, mini, detailed
- **Rating**: stars, numeric, percentage, compact

#### 11.4.5 变体使用规范

**组件中的使用方式：**

```typescript
// ✅ 正确：使用cva创建变体配置
import { cva } from 'class-variance-authority'
import { ButtonVariant } from '@tokens'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: ButtonVariant,
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// ✅ 正确：在组件中使用
export const Button = ({ variant, size, className, ...props }) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

#### 11.4.6 变体扩展策略

**扩展现有变体：**

```typescript
// ✅ 正确：扩展基础变体
import { ButtonVariant } from '@tokens/design-system'

export const ExtendedButtonVariant = {
  ...ButtonVariant,
  variant: {
    ...ButtonVariant.variant,
    custom: 'bg-custom-500 text-white hover:bg-custom-600',
  }
}
```

**创建新的业务变体：**

```typescript
// ✅ 正确：创建业务专用变体
export const MovieCardVariant = {
  variant: {
    compact: 'p-2 space-y-1',
    detailed: 'p-4 space-y-3',
    hero: 'p-6 space-y-4',
  },
  size: {
    sm: 'w-32 h-48',
    md: 'w-40 h-60',
    lg: 'w-48 h-72',
  }
}
```

#### 11.4.7 类型安全保障

**严格类型定义：**

```typescript
// 变体类型必须严格定义
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

// 组件Props必须使用变体类型
interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}
```

#### 11.4.8 性能优化策略

**变体缓存优化：**

- 使用cva的内置缓存机制
- 避免在渲染函数中创建变体配置
- 合理使用useMemo缓存复杂变体计算

**按需导入：**

- 支持按分类导入减少bundle大小
- 使用Tree Shaking优化未使用的变体

#### 11.4.9 变体设计原则

**一致性原则：**

- 统一的命名规范和API设计
- 跨组件的变体名称保持一致
- 相同功能的变体使用相同的样式模式

**可扩展性原则：**

- 支持主题适配和响应式
- 预留扩展空间，避免破坏性变更
- 向后兼容，渐进式升级

**性能原则：**

- 配置驱动，避免硬编码样式
- 最小化CSS输出，避免冗余样式
- 支持条件样式和动态变体

### 11.5 响应式设计规范 (强制执行)

**⚠️ 强制要求：所有组件必须遵循以下响应式设计原则，确保跨设备一致性体验。**

#### 11.5.1 断点系统

**标准断点：**

- sm: 640px (小屏幕/大手机)
- md: 768px (平板竖屏)
- lg: 1024px (平板横屏/小笔记本)
- xl: 1280px (桌面/笔记本)
- 2xl: 1536px (大屏幕)

#### 11.5.2 通用响应式布局原则

**容器边距规范：**

- 所有主容器使用：`px-4 sm:px-6 lg:px-8`
- 确保内容在各种屏幕下不贴边
- 移动端16px，平板24px，桌面32px

**移动端优先原则：**

- 基础样式针对移动端设计
- 使用响应式前缀向上扩展
- 避免使用max-width媒体查询

#### 11.5.3 网格系统规范

**渐进式网格布局：**

- **卡片网格**：`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6`
- **专题网格**：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **列表网格**：`grid-cols-1 md:grid-cols-2`

**网格间距规范：**

- 统一使用：`gap-4 sm:gap-6 lg:gap-8`
- 移动端16px，平板24px，桌面32px

#### 11.5.4 文字响应式规范

**标题文字大小：**

- 主标题：`text-3xl sm:text-4xl md:text-5xl`
- 区块标题：`text-2xl sm:text-3xl`
- 卡片标题：`text-lg sm:text-xl`

**描述文字大小：**

- 主要描述：`text-sm sm:text-base`
- 次要描述：`text-xs sm:text-sm`

#### 11.5.5 组件尺寸规范

**按钮尺寸：**

- 大按钮：`px-6 py-3 sm:px-8 sm:py-4`
- 中按钮：`px-4 py-2 sm:px-6 sm:py-3`
- 小按钮：`px-3 py-1.5 sm:px-4 sm:py-2`

**图片响应式：**

- 封面图片：`w-full h-auto object-cover`
- 背景图片：`bg-cover bg-center`
- Hero区域：`min-h-[600px] h-[85vh]`

#### 11.5.6 导航响应式规范

**导航切换策略：**

- **< 1024px**：汉堡菜单模式
- **≥ 1024px**：水平导航模式
- 避免中间挤压状态，确保临界点切换清晰

#### 11.5.7 隐藏与显示规范

**响应式显示：**

- 搜索框：`hidden sm:block`（小屏隐藏，大屏显示）
- 侧边栏：`hidden lg:block`（平板以下隐藏）
- 详细信息：`hidden md:block`（移动端隐藏）

**响应式隐藏：**

- 装饰元素：`block sm:hidden lg:block xl:hidden`
- 冗余功能：`block md:hidden`

#### 11.5.8 Flexbox响应式规范

**方向切换：**

- 移动端垂直：`flex-col space-y-4`
- 桌面端水平：`flex-row space-x-4 sm:flex-row sm:space-x-6`

**对齐方式：**

- 移动端居中：`justify-center items-center`
- 桌面端左对齐：`justify-start items-center`

**违反以上规范将导致代码审查不通过。**

### 11.6 导航响应式设计规范 (强制执行)

**⚠️ 强制要求：所有导航组件必须采用汉堡菜单响应式设计方案，确保跨设备一致性体验。**

#### 11.6.1 导航响应式策略

**汉堡菜单模式 - 桌面端优先：**

- **移动端 (< 1024px)**：显示汉堡菜单按钮，隐藏主导航
- **桌面端 (≥ 1024px)**：显示完整主导航菜单 + 搜索功能

**断点应用要求：**

- 移动端显示汉堡菜单按钮，隐藏主导航
- 桌面端显示完整导航菜单
- 导航抽屉只在移动端显示

#### 11.6.2 移动端导航要求

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

#### 11.6.3 交互行为规范

**菜单开关逻辑要求：**

- 使用状态管理控制菜单开启/关闭
- 支持点击外部区域关闭菜单
- 支持ESC键关闭菜单
- 提供打开、关闭、切换三种操作方法
- 正确清理事件监听器避免内存泄漏

#### 11.6.4 样式规范

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

#### 11.6.5 性能优化要求

**懒加载实现要求：**

- 移动端导航组件使用React.lazy懒加载
- 提供合适的加载状态占位符
- 只在菜单打开时才加载导航组件

**渲染优化：**

- 使用React.memo包装移动端组件
- 避免不必要的重渲染
- 合理使用useCallback和useMemo

#### 11.6.7 测试要求

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

## 12. 状态管理规范 (强制执行)

**⚠️ 强制要求：严格按照DDD分层架构划分状态管理职责，禁止跨层直接访问状态。**

### 12.1 状态管理架构概述

#### 12.1.1 三层状态管理模式

**客户端状态 (Zustand)**

- **职责**: 管理UI状态、用户偏好、临时数据
- **位置**: `@application/stores`
- **特点**: 同步状态、快速响应、本地持久化

**服务端状态 (TanStack Query)**

- **职责**: 管理API数据、缓存、同步状态
- **位置**: `@application/hooks` 和 `@infrastructure/api`
- **特点**: 异步状态、自动缓存、后台更新

**领域状态 (Domain Events)**

- **职责**: 管理业务规则、领域事件、聚合状态
- **位置**: `@domain/events` 和 `@domain/aggregates`
- **特点**: 事件驱动、业务一致性、跨聚合通信

#### 8.1.2 状态流向规范

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │───▶│   Application   │───▶│     Domain      │
│   (Components)  │    │  (Hooks/Stores) │    │   (Services)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Events     │    │  State Updates  │    │ Domain Events   │
│   User Actions  │    │  Cache Updates  │    │ Business Rules  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 12.2 Zustand客户端状态管理

#### 8.2.1 Store组织规范

**按领域划分Store：**

```typescript
// @application/stores/userStore.ts
interface UserState {
  currentUser: User | null
  preferences: UserPreferences
  theme: 'light' | 'dark' | 'system'
  language: string
  isAuthenticated: boolean
}

interface UserActions {
  setCurrentUser: (user: User) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  setTheme: (theme: UserState['theme']) => void
  setLanguage: (language: string) => void
  logout: () => void
}

export const useUserStore = create<UserState & UserActions>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        currentUser: null,
        preferences: defaultPreferences,
        theme: 'system',
        language: 'zh-CN',
        isAuthenticated: false,
        
        // Actions
        setCurrentUser: (user) => set({ 
          currentUser: user, 
          isAuthenticated: true 
        }),
        
        updatePreferences: (preferences) => set((state) => ({
          preferences: { ...state.preferences, ...preferences }
        })),
        
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        
        logout: () => set({
          currentUser: null,
          isAuthenticated: false,
          preferences: defaultPreferences
        })
      }),
      {
        name: 'user-store',
        partialize: (state) => ({
          preferences: state.preferences,
          theme: state.theme,
          language: state.language
        })
      }
    ),
    { name: 'UserStore' }
  )
)
```

#### 8.2.2 Store使用规范

**✅ 正确的Store使用方式：**

```typescript
// 组件中使用Store
export const UserProfile: React.FC = () => {
  // 选择性订阅，避免不必要的重渲染
  const currentUser = useUserStore(state => state.currentUser)
  const updatePreferences = useUserStore(state => state.updatePreferences)
  
  // 使用shallow比较优化多字段订阅
  const { theme, language } = useUserStore(
    state => ({ theme: state.theme, language: state.language }),
    shallow
  )
  
  return (
    <div>
      <h1>{currentUser?.name}</h1>
      <ThemeSelector theme={theme} />
    </div>
  )
}
```

**❌ 错误的Store使用方式：**

```typescript
// 错误：订阅整个Store导致不必要的重渲染
const userStore = useUserStore()

// 错误：在组件外部直接调用Store
useUserStore.getState().setCurrentUser(user)

// 错误：在渲染过程中调用Actions
const Component = () => {
  useUserStore(state => state.setTheme('dark')) // 错误
  return <div>...</div>
}
```

### 12.3 TanStack Query服务端状态管理

#### 8.3.1 Query组织规范

**查询键工厂模式：**

```typescript
// @application/hooks/queries/movieQueries.ts
export const movieQueries = {
  all: ['movies'] as const,
  lists: () => [...movieQueries.all, 'list'] as const,
  list: (filters: MovieFilters) => [...movieQueries.lists(), filters] as const,
  details: () => [...movieQueries.all, 'detail'] as const,
  detail: (id: string) => [...movieQueries.details(), id] as const,
  search: (query: string) => [...movieQueries.all, 'search', query] as const,
  recommendations: (userId: string) => [...movieQueries.all, 'recommendations', userId] as const
}

// 查询Hook
export const useMovieList = (filters: MovieFilters) => {
  return useQuery({
    queryKey: movieQueries.list(filters),
    queryFn: () => movieApi.getMovieList(filters),
    staleTime: 5 * 60 * 1000, // 5分钟
    cacheTime: 10 * 60 * 1000, // 10分钟
    refetchOnWindowFocus: false
  })
}

export const useMovieDetail = (id: string) => {
  return useQuery({
    queryKey: movieQueries.detail(id),
    queryFn: () => movieApi.getMovieDetail(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000 // 10分钟
  })
}
```

#### 8.3.2 Mutation规范

**变更操作规范：**

```typescript
// @application/hooks/mutations/movieMutations.ts
export const useAddToFavorites = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (movieId: string) => movieApi.addToFavorites(movieId),
    
    onMutate: async (movieId) => {
      // 乐观更新
      await queryClient.cancelQueries({ queryKey: movieQueries.detail(movieId) })
      
      const previousMovie = queryClient.getQueryData(movieQueries.detail(movieId))
      
      queryClient.setQueryData(movieQueries.detail(movieId), (old: any) => ({
        ...old,
        isFavorite: true
      }))
      
      return { previousMovie }
    },
    
    onError: (err, movieId, context) => {
      // 回滚乐观更新
      if (context?.previousMovie) {
        queryClient.setQueryData(movieQueries.detail(movieId), context.previousMovie)
      }
    },
    
    onSettled: (data, error, movieId) => {
      // 重新获取相关数据
      queryClient.invalidateQueries({ queryKey: movieQueries.detail(movieId) })
      queryClient.invalidateQueries({ queryKey: movieQueries.lists() })
    }
  })
}
```

### 12.4 领域事件状态管理

#### 8.4.1 事件总线规范

**事件定义：**

```typescript
// @domain/events/movieEvents.ts
export interface MovieSelectedEvent extends DomainEvent {
  type: 'MOVIE_SELECTED'
  payload: {
    movieId: string
    movie: Movie
    timestamp: number
  }
}

export interface MovieFavoritedEvent extends DomainEvent {
  type: 'MOVIE_FAVORITED'
  payload: {
    movieId: string
    userId: string
    timestamp: number
  }
}

// 事件处理器
export class MovieEventHandler {
  constructor(
    private userStore: UserStore,
    private movieStore: MovieStore
  ) {}
  
  handle(event: DomainEvent): void {
    switch (event.type) {
      case 'MOVIE_SELECTED':
        this.handleMovieSelected(event as MovieSelectedEvent)
        break
      case 'MOVIE_FAVORITED':
        this.handleMovieFavorited(event as MovieFavoritedEvent)
        break
    }
  }
  
  private handleMovieSelected(event: MovieSelectedEvent): void {
    // 更新用户浏览历史
    this.userStore.getState().addToHistory(event.payload.movie)
    
    // 更新当前选中的电影
    this.movieStore.getState().setSelectedMovie(event.payload.movie)
  }
  
  private handleMovieFavorited(event: MovieFavoritedEvent): void {
    // 更新用户收藏列表
    this.userStore.getState().addToFavorites(event.payload.movieId)
  }
}
```

### 12.5 Hook职责边界规范

#### 8.5.1 Hook分类与职责

**数据获取Hook (Data Fetching Hooks)**

- **位置**: `@application/hooks/queries`
- **职责**: 封装TanStack Query，提供数据获取接口
- **命名**: `use[Entity][Action]` (如 `useMovieList`, `useUserProfile`)

```typescript
// @application/hooks/queries/useMovieData.ts
export const useMovieData = (movieId: string) => {
  const movieQuery = useMovieDetail(movieId)
  const recommendationsQuery = useMovieRecommendations(movieId)
  
  return {
    movie: movieQuery.data,
    recommendations: recommendationsQuery.data,
    isLoading: movieQuery.isLoading || recommendationsQuery.isLoading,
    error: movieQuery.error || recommendationsQuery.error,
    refetch: () => {
      movieQuery.refetch()
      recommendationsQuery.refetch()
    }
  }
}
```

**业务逻辑Hook (Business Logic Hooks)**

- **位置**: `@application/hooks/business`
- **职责**: 封装复杂业务逻辑，协调多个Store和API
- **命名**: `use[BusinessAction]` (如 `useMovieSelection`, `useDownloadManager`)

```typescript
// @application/hooks/business/useMovieSelection.ts
export const useMovieSelection = () => {
  const selectedMovie = useMovieStore(state => state.selectedMovie)
  const setSelectedMovie = useMovieStore(state => state.setSelectedMovie)
  const addToHistory = useUserStore(state => state.addToHistory)
  const eventBus = useEventBus()
  
  const selectMovie = useCallback((movie: Movie) => {
    // 更新Store状态
    setSelectedMovie(movie)
    addToHistory(movie)
    
    // 发布领域事件
    eventBus.publish({
      type: 'MOVIE_SELECTED',
      payload: {
        movieId: movie.id,
        movie,
        timestamp: Date.now()
      }
    })
  }, [setSelectedMovie, addToHistory, eventBus])
  
  return {
    selectedMovie,
    selectMovie
  }
}
```

**UI状态Hook (UI State Hooks)**

- **位置**: `@presentation/hooks`
- **职责**: 管理组件内部UI状态，不涉及业务逻辑
- **命名**: `use[UIState]` (如 `useModal`, `useToggle`, `useForm`)

```typescript
// @presentation/hooks/useModal.ts
export const useModal = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen)
  
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])
  
  return {
    isOpen,
    open,
    close,
    toggle
  }
}
```

### 12.6 状态同步与一致性

#### 8.6.1 跨Store状态同步

**事件驱动同步：**

```typescript
// @application/services/StateSyncService.ts
export class StateSyncService {
  constructor(
    private eventBus: EventBus,
    private userStore: UserStore,
    private movieStore: MovieStore,
    private downloadStore: DownloadStore
  ) {
    this.setupEventListeners()
  }
  
  private setupEventListeners(): void {
    this.eventBus.subscribe('USER_LOGGED_OUT', () => {
      // 用户登出时清理所有相关状态
      this.movieStore.getState().clearUserData()
      this.downloadStore.getState().clearUserData()
    })
    
    this.eventBus.subscribe('MOVIE_FAVORITED', (event) => {
      // 同步收藏状态到多个Store
      this.userStore.getState().addToFavorites(event.payload.movieId)
      this.movieStore.getState().updateMovieFavoriteStatus(
        event.payload.movieId, 
        true
      )
    })
  }
}
```

#### 8.6.2 缓存一致性管理

**Query缓存同步：**

```typescript
// @application/hooks/useCacheSync.ts
export const useCacheSync = () => {
  const queryClient = useQueryClient()
  const eventBus = useEventBus()
  
  useEffect(() => {
    const unsubscribe = eventBus.subscribe('MOVIE_UPDATED', (event) => {
      // 更新相关查询缓存
      queryClient.setQueryData(
        movieQueries.detail(event.payload.movieId),
        event.payload.movie
      )
      
      // 使相关列表查询失效
      queryClient.invalidateQueries({ 
        queryKey: movieQueries.lists() 
      })
    })
    
    return unsubscribe
  }, [queryClient, eventBus])
}
```

### 12.7 性能优化规范

#### 8.7.1 状态订阅优化

**选择性订阅：**

```typescript
// ✅ 正确：只订阅需要的字段
const userName = useUserStore(state => state.currentUser?.name)

// ❌ 错误：订阅整个用户对象
const user = useUserStore(state => state.currentUser)
```

**批量更新：**

```typescript
// ✅ 正确：批量更新状态
const updateUserProfile = useCallback((profile: UserProfile) => {
  useUserStore.setState(state => ({
    currentUser: { ...state.currentUser, ...profile },
    lastUpdated: Date.now()
  }))
}, [])

// ❌ 错误：多次单独更新
const updateUserProfileWrong = (profile: UserProfile) => {
  useUserStore.getState().setCurrentUser({ ...user, ...profile })
  useUserStore.getState().setLastUpdated(Date.now())
}
```

#### 8.7.2 Query优化

**预取策略：**

```typescript
// @application/hooks/usePrefetch.ts
export const usePrefetch = () => {
  const queryClient = useQueryClient()
  
  const prefetchMovieDetail = useCallback((movieId: string) => {
    queryClient.prefetchQuery({
      queryKey: movieQueries.detail(movieId),
      queryFn: () => movieApi.getMovieDetail(movieId),
      staleTime: 5 * 60 * 1000
    })
  }, [queryClient])
  
  return { prefetchMovieDetail }
}
```

### 12.8 错误处理与恢复

#### 8.8.1 状态错误处理

**Store错误边界：**

```typescript
// @application/stores/errorStore.ts
interface ErrorState {
  errors: Record<string, Error>
  isGlobalError: boolean
}

interface ErrorActions {
  setError: (key: string, error: Error) => void
  clearError: (key: string) => void
  clearAllErrors: () => void
}

export const useErrorStore = create<ErrorState & ErrorActions>((set) => ({
  errors: {},
  isGlobalError: false,
  
  setError: (key, error) => set((state) => ({
    errors: { ...state.errors, [key]: error },
    isGlobalError: key === 'global'
  })),
  
  clearError: (key) => set((state) => {
    const { [key]: removed, ...rest } = state.errors
    return { 
      errors: rest,
      isGlobalError: key === 'global' ? false : state.isGlobalError
    }
  }),
  
  clearAllErrors: () => set({ errors: {}, isGlobalError: false })
}))
```

**优势：**

- **清晰的职责分离**：每层状态管理有明确的职责边界
- **类型安全**：完整的TypeScript类型支持
- **性能优化**：选择性订阅和缓存策略
- **错误处理**：完善的错误边界和恢复机制
- **可测试性**：独立的状态逻辑便于单元测试

## 13. 组件性能优化规范

### 13.1 渲染优化 (强制执行)

**渲染优化技术**：

- **React.memo**：使用自定义比较函数避免不必要的重渲染
- **useCallback**：缓存函数引用，避免子组件重渲染
- **useMemo**：缓存计算结果，避免重复计算

### 13.2 状态订阅优化

**选择器优化**：

- **精确选择器**：只订阅需要的状态片段
- **批量选择器**：使用shallow避免不必要的重渲染
- **选择器函数**：复用选择逻辑，提高性能

### 13.3 组件懒加载

**懒加载策略**：

- **页面级懒加载**：使用React.lazy延迟加载页面组件
- **组件级懒加载**：延迟加载重型组件
- **代码分割**：按路由或功能分割代码包

## 14. 可访问性规范 (A11y)

### 14.1 ARIA属性使用

**ARIA属性使用**：

- **按钮**：使用aria-label描述按钮功能，aria-expanded指示状态
- **表单元素**：使用aria-invalid、aria-describedby关联错误信息
- **错误提示**：使用role="alert"和aria-live提供屏幕阅读器支持

### 14.2 键盘导航

**焦点管理**：

- **模态框焦点**：使用useRef和useEffect管理焦点陷阱
- **键盘导航**：支持Tab键导航和ESC键关闭
- **焦点恢复**：关闭组件时恢复之前的焦点

## 15. 测试规范

### 15.1 测试策略

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

### 15.2 测试编写规范

**测试编写规范**：

- **渲染测试**：验证组件正确渲染和显示内容
- **交互测试**：测试用户操作和组件响应
- **异步测试**：使用async/await处理异步操作
- **模拟数据**：使用createMockMovie等工具函数创建测试数据

## 16. 重构执行规范 (强制执行)

### 16.1 重构执行流程 (强制执行)

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

### 16.2 重构执行清单 (强制执行)

**⚠️ 强制要求：所有重构工作必须按照标准化清单执行，确保迁移过程的完整性和一致性。**

#### 12.2.1 从老组件到Renderer的迁移步骤

**阶段1：现状分析与规划**

- [ ] **组件依赖分析**
  - 识别需要重构的老组件及其依赖关系
  - 分析组件间的数据流和状态管理
  - 记录现有的Props接口和业务逻辑

- [ ] **内容类型识别**
  - 确定组件处理的内容类型（Movie、Photo、Collection等）
  - 分析内容类型间的共同特征和差异
  - 制定内容类型抽象策略

- [ ] **Renderer架构设计**
  - 设计BaseContentItem接口结构
  - 规划具体ContentRenderer实现
  - 制定RendererFactory注册策略

**阶段2：基础设施搭建**

- [ ] **核心接口定义**
  ```typescript
  // @components/domains/shared/content-renderers/interfaces.ts
  interface BaseContentItem {
    id: string
    type: ContentTypeId
    title: string
    // ... 其他通用字段
  }
  
  interface ContentRenderer {
    name: string
    supportedTypes: ContentTypeId[]
    canRender(item: BaseContentItem): boolean
    render(item: BaseContentItem, config?: RendererConfig): React.ReactElement
  }
  ```

- [ ] **抽象基类实现**
  ```typescript
  // @components/domains/shared/content-renderers/base-renderer.ts
  abstract class BaseContentRenderer implements ContentRenderer {
    abstract name: string
    abstract supportedTypes: ContentTypeId[]
    
    public canRender(item: BaseContentItem): boolean {
      return this.supportedTypes.includes(item.type)
    }
    
    protected abstract doRender(
      item: BaseContentItem, 
      config: RendererConfig
    ): React.ReactElement
  }
  ```

- [ ] **工厂模式实现**
  ```typescript
  // @components/domains/shared/content-renderers/renderer-factory.ts
  class DefaultContentRendererFactory implements ContentRendererFactory {
    private renderers: Map<ContentTypeId, RendererRegistration> = new Map()
    
    public register(contentType: ContentTypeId, renderer: ContentRenderer): void
    public getRenderer(contentType: ContentTypeId): ContentRenderer | null
    public createRenderer(item: BaseContentItem): React.ReactElement | null
  }
  ```

**阶段3：具体Renderer实现**

- [ ] **MovieContentRenderer实现**
  ```typescript
  // @components/domains/shared/content-renderers/movie-renderer.tsx
  class MovieContentRenderer extends BaseContentRenderer {
    name = 'MovieContentRenderer'
    supportedTypes: ContentTypeId[] = ['movie']
    
    protected doRender(item: MovieContentItem, config: RendererConfig): React.ReactElement {
      return (
        <MovieCard
          movie={item}
          variant={config.variant}
          showBadges={config.showBadges}
          onClick={config.onClick}
        />
      )
    }
  }
  ```

- [ ] **PhotoContentRenderer实现**
  ```typescript
  // @components/domains/shared/content-renderers/photo-renderer.tsx
  class PhotoContentRenderer extends BaseContentRenderer {
    name = 'PhotoContentRenderer'
    supportedTypes: ContentTypeId[] = ['photo']
    
    protected doRender(item: PhotoContentItem, config: RendererConfig): React.ReactElement {
      return (
        <PhotoCard
          photo={item}
          variant={config.variant}
          showBadges={config.showBadges}
          onClick={config.onClick}
        />
      )
    }
  }
  ```

- [ ] **CollectionContentRenderer实现**
  ```typescript
  // @components/domains/shared/content-renderers/collection-renderer.tsx
  class CollectionContentRenderer extends BaseContentRenderer {
    name = 'CollectionContentRenderer'
    supportedTypes: ContentTypeId[] = ['collection']
    
    protected doRender(item: CollectionContentItem, config: RendererConfig): React.ReactElement {
      return (
        <CollectionCard
          collection={item}
          variant={config.variant}
          showBadges={config.showBadges}
          onClick={config.onClick}
        />
      )
    }
  }
  ```

**阶段4：统一列表组件重构**

- [ ] **MixedContentList组件实现**
  ```typescript
  // @components/domains/shared/MixedContentList.tsx
  interface MixedContentListProps {
    items: BaseContentItem[]
    enableMixedContent?: boolean
    allowedContentTypes?: ContentTypeId[]
    rendererConfig?: RendererConfig
    onItemClick?: (item: BaseContentItem) => void
  }
  
  const MixedContentList: React.FC<MixedContentListProps> = ({
    items,
    enableMixedContent = false,
    allowedContentTypes,
    rendererConfig,
    onItemClick
  }) => {
    const filteredItems = useMemo(() => {
      if (!allowedContentTypes) return items
      return items.filter(item => allowedContentTypes.includes(item.type))
    }, [items, allowedContentTypes])
    
    return (
      <div className="mixed-content-list">
        {filteredItems.map(item => {
          const renderer = contentRendererFactory.getRenderer(item.type)
          if (!renderer) {
            console.warn(`No renderer found for content type: ${item.type}`)
            return null
          }
          
          return (
            <div key={item.id} className="content-item">
              {renderer.render(item, {
                ...rendererConfig,
                onClick: () => onItemClick?.(item)
              })}
            </div>
          )
        })}
      </div>
    )
  }
  ```

- [ ] **现有列表组件迁移**
  ```typescript
  // 重构LatestUpdateList使用MixedContentList
  const LatestUpdateList: React.FC<LatestUpdateListProps> = ({
    latestItems,
    enableMixedContent = false,
    onLatestClick
  }) => {
    // 数据转换逻辑
    const contentItems = useMemo(() => {
      return convertToContentItems(latestItems)
    }, [latestItems])
    
    if (enableMixedContent) {
      return (
        <MixedContentList
          items={contentItems}
          enableMixedContent={true}
          allowedContentTypes={['movie', 'photo', 'collection']}
          onItemClick={onLatestClick}
        />
      )
    }
    
    // 保持向后兼容的原有实现
    return (
      <div className="latest-update-list">
        {latestItems.map(item => (
          <LatestUpdateCard
            key={item.id}
            item={item}
            onClick={onLatestClick}
          />
        ))}
      </div>
    )
  }
  ```

**阶段5：数据转换与类型安全**

- [ ] **内容项转换函数**
  ```typescript
  // @utils/contentConverters.ts
  export function convertToContentItems(items: any[]): BaseContentItem[] {
    return items.map(item => {
      // 自动类型推断
      const contentType = inferContentType(item)
      
      switch (contentType) {
        case 'movie':
          return createMovieContentItem(item)
        case 'photo':
          return createPhotoContentItem(item)
        case 'collection':
          return createCollectionContentItem(item)
        default:
          throw new Error(`Unsupported content type: ${contentType}`)
      }
    })
  }
  
  function inferContentType(item: any): ContentTypeId {
    if (item.duration || item.director) return 'movie'
    if (item.photographer || item.photoCount) return 'photo'
    if (item.itemCount || item.collectionType) return 'collection'
    throw new Error('Cannot infer content type from item')
  }
  ```

- [ ] **类型守卫实现**
  ```typescript
  // @components/domains/shared/content-renderers/type-guards.ts
  export function isMovieContentItem(item: BaseContentItem): item is MovieContentItem {
    return item.type === 'movie' && 'duration' in item
  }
  
  export function isPhotoContentItem(item: BaseContentItem): item is PhotoContentItem {
    return item.type === 'photo' && 'photographer' in item
  }
  
  export function isCollectionContentItem(item: BaseContentItem): item is CollectionContentItem {
    return item.type === 'collection' && 'itemCount' in item
  }
  ```

**阶段6：性能优化与缓存**

- [ ] **Renderer缓存机制**
  ```typescript
  // @components/domains/shared/content-renderers/renderer-cache.ts
  class RendererCache {
    private cache: Map<string, React.ReactElement> = new Map()
    
    public get(key: string): React.ReactElement | null {
      return this.cache.get(key) || null
    }
    
    public set(key: string, element: React.ReactElement): void {
      this.cache.set(key, element)
    }
    
    public generateKey(item: BaseContentItem, config: RendererConfig): string {
      return `${item.type}-${item.id}-${JSON.stringify(config)}`
    }
  }
  ```

- [ ] **懒加载Renderer**
  ```typescript
  // @components/domains/shared/content-renderers/lazy-renderers.ts
  const LazyMovieRenderer = React.lazy(() => 
    import('./movie-renderer').then(module => ({ 
      default: module.default 
    }))
  )
  
  const LazyPhotoRenderer = React.lazy(() => 
    import('./photo-renderer').then(module => ({ 
      default: module.default 
    }))
  )
  ```

**阶段7：测试与验证**

- [ ] **单元测试**
  ```typescript
  // @components/domains/shared/content-renderers/__tests__/renderer-factory.test.ts
  describe('ContentRendererFactory', () => {
    it('should register and retrieve renderers correctly', () => {
      const factory = new DefaultContentRendererFactory()
      const movieRenderer = new MovieContentRenderer()
      
      factory.register('movie', movieRenderer)
      
      const retrieved = factory.getRenderer('movie')
      expect(retrieved).toBe(movieRenderer)
    })
    
    it('should render content items correctly', () => {
      const movieItem: MovieContentItem = {
        id: '1',
        type: 'movie',
        title: 'Test Movie',
        duration: 120
      }
      
      const element = factory.createRenderer(movieItem)
      expect(element).toBeTruthy()
    })
  })
  ```

- [ ] **集成测试**
  ```typescript
  // @components/domains/shared/__tests__/MixedContentList.test.tsx
  describe('MixedContentList', () => {
    it('should render mixed content correctly', () => {
      const mixedItems: BaseContentItem[] = [
        { id: '1', type: 'movie', title: 'Movie 1' },
        { id: '2', type: 'photo', title: 'Photo 1' },
        { id: '3', type: 'collection', title: 'Collection 1' }
      ]
      
      render(
        <MixedContentList
          items={mixedItems}
          enableMixedContent={true}
        />
      )
      
      expect(screen.getByText('Movie 1')).toBeInTheDocument()
      expect(screen.getByText('Photo 1')).toBeInTheDocument()
      expect(screen.getByText('Collection 1')).toBeInTheDocument()
    })
  })
  ```

**阶段8：文档与维护**

- [ ] **API文档编写**
  ```typescript
  /**
   * @fileoverview 内容渲染器系统
   * @description 提供统一的内容渲染抽象层，支持多种内容类型的混合展示
   * 
   * @example
   * ```tsx
   * // 注册自定义渲染器
   * contentRendererFactory.register('video', new VideoContentRenderer())
   * 
   * // 使用混合内容列表
   * <MixedContentList
   *   items={mixedItems}
   *   enableMixedContent={true}
   *   allowedContentTypes={['movie', 'photo', 'video']}
   * />
   * ```
   */
  ```

- [ ] **迁移指南文档**
  ```markdown
  # 内容渲染器迁移指南
  
  ## 从老组件迁移到Renderer系统
  
  ### 1. 识别内容类型
  - 分析现有组件处理的数据结构
  - 确定内容类型分类（movie/photo/collection）
  
  ### 2. 实现ContentRenderer
  - 继承BaseContentRenderer
  - 实现doRender方法
  - 注册到RendererFactory
  
  ### 3. 更新列表组件
  - 使用MixedContentList替换老的列表组件
  - 保持向后兼容的API接口
  ```

#### 12.2.2 重构验收清单

**代码质量验收：**

- [ ] 所有Renderer实现都继承BaseContentRenderer
- [ ] 所有内容类型都有对应的类型守卫
- [ ] 所有转换函数都有完整的错误处理
- [ ] 通过ESLint和TypeScript严格检查
- [ ] 单元测试覆盖率达到90%以上

**架构一致性验收：**

- [ ] 遵循DDD分层架构规范
- [ ] 使用@别名导入导出
- [ ] 符合组件自包含架构原则
- [ ] API接口向后兼容

**性能和可维护性验收：**

- [ ] Renderer注册和查找性能优化
- [ ] 支持懒加载和缓存机制
- [ ] 代码可读性和可维护性良好
- [ ] 完整的文档和示例

**业务功能验收：**

- [ ] 支持多种内容类型混合展示
- [ ] 保持原有的视觉效果和交互
- [ ] 支持动态内容类型扩展
- [ ] 错误处理和降级策略完善

**违反以上重构执行清单将导致代码审查不通过。**

## 17. 其他开发规范要点

### 17.1 TypeScript规范

- 所有组件Props必须定义接口，使用严格类型检查
- 避免使用any类型，优先使用联合类型而非枚举
- 使用类型守卫和类型断言确保类型安全

### 17.2 API调用

- 使用OpenAPI规范，统一错误处理
- 统一错误码，用户友好提示，网络异常处理
- API调用逻辑应该在应用层服务中，不在组件或Store中

### 17.3 路由鉴权与权限管理规范 (强制执行)

**⚠️ 强制要求：所有路由必须实现适当的权限控制，禁止未授权访问敏感页面。**

#### 13.3.1 路由守卫组件架构

**守卫组件层次结构：**

```typescript
// 基础守卫组件
ProtectedRoute    // 基础认证守卫
├── AdminRoute    // 管理员权限守卫
├── GuestRoute    // 访客专用守卫
└── PermissionGate // 细粒度权限控制
```

**守卫组件职责分离：**

- **ProtectedRoute**：验证用户登录状态，支持权限数组验证
- **AdminRoute**：验证管理员角色，继承ProtectedRoute功能
- **GuestRoute**：仅允许未登录用户访问，已登录用户重定向
- **PermissionGate**：组件级权限控制，支持权限和角色双重验证

#### 13.3.2 权限常量系统

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

  // 内容管理权限
  CONTENT_MODERATE: 'content:moderate',
  CONTENT_PUBLISH: 'content:publish',
  CONTENT_FEATURE: 'content:feature',
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

#### 13.3.3 权限验证工具函数

**权限检查函数：**

```typescript
// 权限验证（支持任一或全部权限）
export const hasPermission = (
  userPermissions: string[],
  requiredPermissions: string[],
  requireAll = false
): boolean => {
  if (requireAll) {
    return requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    )
  }
  return requiredPermissions.some(permission =>
    userPermissions.includes(permission)
  )
}

// 角色验证
export const hasRole = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole)
}

// 角色层级验证
export const hasRoleAccess = (
  userRole: keyof typeof ROLES,
  targetRole: keyof typeof ROLES
): boolean => {
  const roleHierarchy = {
    [ROLES.USER]: 0,
    [ROLES.VIP]: 1,
    [ROLES.MODERATOR]: 2,
    [ROLES.ADMIN]: 3,
    [ROLES.SUPER_ADMIN]: 4,
  }
  return roleHierarchy[userRole] >= roleHierarchy[targetRole]
}
```

#### 13.3.4 路由配置规范

**路由守卫使用规范：**

```typescript
// 公开路由（无需认证）
{
  path: '/',
  element: <HomePage />
}

// 访客专用路由（仅未登录用户）
{
  path: '/auth/login',
  element: (
    <GuestRoute>
      <LoginPage />
    </GuestRoute>
  )
}

// 受保护路由（需要登录）
{
  path: '/user',
  element: (
    <ProtectedRoute>
      <UserLayout />
    </ProtectedRoute>
  ),
  children: [...]
}

// 权限路由（需要特定权限）
{
  path: '/user/downloads',
  element: (
    <ProtectedRoute requiredPermissions={[PERMISSIONS.DOWNLOAD_VIEW]}>
      <UserDownloadsPage />
    </ProtectedRoute>
  )
}

// 管理员路由（需要管理员角色）
{
  path: '/admin',
  element: (
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  ),
  children: [...]
}
```

#### 13.3.5 组件级权限控制

**PermissionGate使用规范：**

```typescript
// 基于权限的组件显示
<PermissionGate permissions={[PERMISSIONS.MOVIE_CREATE]}>
  <Button>创建影片</Button>
</PermissionGate>

// 基于角色的组件显示
<PermissionGate roles={[ROLES.ADMIN, ROLES.MODERATOR]}>
  <AdminPanel />
</PermissionGate>

// 复合权限验证（需要所有权限）
<PermissionGate 
  permissions={[PERMISSIONS.USER_UPDATE, PERMISSIONS.USER_DELETE]}
  requireAll={true}
>
  <UserManagementPanel />
</PermissionGate>

// 权限不足时的降级显示
<PermissionGate 
  permissions={[PERMISSIONS.DOWNLOAD_UNLIMITED]}
  fallback={<VipUpgradePrompt />}
>
  <UnlimitedDownloadButton />
</PermissionGate>
```

#### 13.3.6 认证状态管理

**useAuth Hook规范：**

```typescript
interface AuthUser {
  id: string
  username: string
  email: string
  role: keyof typeof ROLES
  permissions: string[]
  isVip: boolean
  avatar?: string
}

interface UseAuthReturn {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}
```

#### 13.3.7 路由常量管理

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

#### 13.3.8 错误处理与重定向

**未授权访问处理：**

- **未登录用户**：重定向到登录页面，保存原始访问路径
- **权限不足**：显示403错误页面或权限提升提示
- **角色不匹配**：重定向到用户仪表板或首页

**重定向策略：**

```typescript
// 登录成功后重定向到原始页面
const location = useLocation()
const from = location.state?.from?.pathname || '/user/dashboard'

// 权限不足时的处理
if (!hasRequiredPermissions) {
  return <Navigate to="/unauthorized" state={{ requiredPermissions }} replace />
}
```

#### 13.3.9 性能优化

**路由懒加载：**

- 所有页面组件使用React.lazy懒加载
- 提供统一的加载状态组件
- 按权限级别分割代码包

**权限缓存：**

- 用户权限信息缓存5分钟
- 权限变更时主动刷新缓存
- 使用TanStack Query管理权限状态

#### 13.3.10 安全规范

**前端安全措施：**

- 所有敏感操作需要后端权限验证
- 前端权限控制仅用于UI展示优化
- 定期刷新用户权限信息
- 实现自动登出机制

**Token管理：**

- 使用HttpOnly Cookie存储刷新令牌
- 访问令牌存储在内存中
- 实现自动令牌刷新机制
- 登出时清理所有令牌

#### 13.3.11 测试要求

**权限测试场景：**

1. **路由访问测试**：验证不同角色用户的路由访问权限
2. **组件显示测试**：验证PermissionGate的权限控制效果
3. **重定向测试**：验证未授权访问的重定向逻辑
4. **权限更新测试**：验证权限变更后的UI更新
5. **边界情况测试**：网络异常、令牌过期等场景

**测试覆盖要求：**

- 所有守卫组件100%测试覆盖
- 权限验证函数100%测试覆盖
- 关键路由的权限控制测试
- 用户角色切换的端到端测试

**违反以上路由鉴权规范将导致代码审查不通过。**

### 17.4 Git提交规范

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

### 17.6 开发工具配置

- **ESLint + Prettier**：代码规范和格式化，强制@别名导入
- **Husky + lint-staged**：提交前代码检查和自动格式化
- **Storybook**：组件文档化和交互式开发
- **React Query DevTools**：状态管理调试工具
