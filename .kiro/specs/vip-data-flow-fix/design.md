# Design Document

## Overview

本设计文档详细描述了VIP数据流和标签系统的重构方案。该方案旨在建立一个清晰、可维护的数据驱动架构，确保从Mock数据源到UI展示的整个链路中，所有标签（NEW、质量、评分、VIP）的显示都由数据源决定，消除硬编码和不必要的随机数据生成。

### 核心设计原则

1. **数据驱动**: 所有UI展示都基于数据源，不在组件中硬编码业务逻辑
2. **单一数据源**: 使用统一的MockDataService作为唯一的数据生成源
3. **类型安全**: 通过TypeScript类型系统确保数据完整性
4. **分层清晰**: 遵循DDD架构，数据在各层之间流动时保持完整性
5. **配置灵活**: 通过配置系统控制标签显示，但数据源规则优先
6. **保持UI不变**: 只重构数据流和标签逻辑，不改变现有的UI布局和样式

### 重要约束：保持现有UI布局和样式

**本次重构的范围：**
- ✅ 数据流架构（移除不必要的转换）
- ✅ 标签显示逻辑（基于数据源而不是硬编码）
- ✅ 属性命名统一
- ✅ VIP链路完整性

**不在重构范围内：**
- ❌ 卡片布局（保持现有的正方形、竖版等布局）
- ❌ 标签位置（保持现有的标签位置）
- ❌ 标签样式（保持现有的颜色、大小、字体）
- ❌ 详情页布局（保持现有的布局结构）
- ❌ 按钮样式（使用现有的金色渐变和绿色样式）

**现有UI布局规范：**

1. **合集卡片**：
   - 正方形布局
   - 卡片上显示：标题、描述
   - 标签：NEW（根据数据源）、VIP（固定显示）

2. **写真卡片**：
   - 竖版布局
   - 卡片上显示：NEW标签（根据数据源）、写真专属质量标签、VIP标签（固定显示）
   - 卡片下方显示：标题 + 分类

3. **影片卡片**：
   - 竖版布局
   - 卡片上显示：NEW标签（根据数据源）、VIP标签（根据数据源）、评分标签（根据数据源）、影片专属质量标签（如HD/SD）
   - 卡片下方显示：标题 + 分类

4. **详情页样式**：
   - VIP样式：金色渐变下载按钮 + 资源信息标题后的金色渐变VIP标签（已存在）
   - 普通样式：绿色下载按钮 + 资源信息标题后无VIP标签（已存在）

## Architecture

### 数据流架构

**重要改进：消除不必要的数据转换**

当前系统存在数据二次转换的问题：Domain Entity → UnifiedContentItem → CollectionItem/PhotoItem。这是不必要的复杂性。

**主流开发标准做法**：
- 后端API应该直接返回前端需要的数据格式
- 前端不应该做复杂的数据结构转换
- Mock数据应该模拟真实的API响应格式

**改进后的数据流**（简化版）：

```
MockDataService (直接生成最终格式)
    ↓
Repository (数据访问，无需转换)
    ↓
ApplicationService (业务逻辑)
    ↓
Hooks (数据获取)
    ↓
Content Renderer (内容渲染)
    ↓
Layer Components (层组件)
    ↓
UI (用户界面)
```

**移除的层**：
- ContentTransformationService（不再需要）
- Domain Entity层的复杂转换逻辑

**新的设计原则**：
- MockDataService直接生成CollectionItem、PhotoItem、MovieItem等最终格式
- Repository层只负责数据获取，不做转换
- 数据格式在Mock层就已经是UI需要的格式

## Components and Interfaces

### 1. MockDataService 重构

MockDataService是整个系统的数据源，需要重构以：
1. **直接生成最终格式的数据**（CollectionItem、PhotoItem、MovieItem）
2. **支持固定的业务数据**（不使用随机的isVip、isNew、quality）
3. **保留必要的随机数据**（viewCount、downloadCount等统计数据）

#### 关键修改点

```typescript
// 修改前：生成Domain Entity，然后多次转换
generateMockMovies() → Movie[] → UnifiedContentItem[] → MovieItem[]

// 修改后：直接生成最终格式
generateMockMovies() → MovieItem[] // 直接返回UI需要的格式

// 修改前：大量随机数据
const isVip = Math.random() > 0.7
const isNew = Math.random() > 0.8
const quality = getRandomQuality()

// 修改后：基于业务规则的固定数据
const isVip = determineVipStatus(contentType, index)
const isNew = isWithin24Hours(publishDate)
const quality = getQualityByIndex(index)
```

#### 新的Mock数据生成方法

```typescript
// 直接生成CollectionItem格式
public generateMockCollections(count: number = 12): CollectionItem[] {
  return Array.from({ length: count }, (_, index) => {
    const publishDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    const isNew = isWithin24Hours(publishDate)
    
    return {
      id: `collection_${index + 1}`,
      title: `精选合集 ${index + 1}`,
      type: 'Collection' as const,
      contentType: 'collection' as const,
      imageUrl: `https://picsum.photos/400/600?random=${index + 1}`,
      alt: `精选合集 ${index + 1} 封面`,
      description: `这是第${index + 1}个精选合集的描述`,
      
      // 业务字段 - 固定规则
      isVip: true, // 所有合集都是VIP
      isNew: isNew,
      newType: isNew ? 'latest' : null,
      
      // 统计字段 - 随机数
      viewCount: Math.floor(Math.random() * 50000) + 1000,
      downloadCount: Math.floor(Math.random() * 5000) + 50,
      likeCount: Math.floor(Math.random() * 5000) + 100,
      favoriteCount: Math.floor(Math.random() * 2000) + 50,
      
      // 其他字段
      movieCount: Math.floor(Math.random() * 50) + 10,
      category: ['动作', '科幻', '剧情'][index % 3],
      tags: ['热门', '推荐', '精选'],
      createdAt: new Date(publishDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: publishDate.toISOString()
    }
  })
}

// 直接生成MovieItem格式
public generateMockMovies(count: number = 20): MovieItem[] {
  return Array.from({ length: count }, (_, index) => {
    const publishDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    const isNew = isWithin24Hours(publishDate)
    const isVip = index % 3 === 0 // 每3个中有1个是VIP
    
    return {
      id: `movie_${index + 1}`,
      title: `热门影片 ${index + 1}`,
      type: 'Movie' as const,
      contentType: 'movie' as const,
      imageUrl: `https://picsum.photos/300/450?random=${index + 100}`,
      alt: `热门影片 ${index + 1} 海报`,
      description: `这是第${index + 1}部热门影片的描述`,
      
      // 业务字段 - 固定规则
      isVip: isVip,
      isNew: isNew,
      newType: isNew ? 'latest' : null,
      quality: ['4K', 'HD', '1080P', '720P'][index % 4],
      rating: (Math.random() * 4 + 6).toFixed(1),
      ratingColor: 'white' as const,
      
      // 统计字段 - 随机数
      viewCount: Math.floor(Math.random() * 50000) + 1000,
      downloadCount: Math.floor(Math.random() * 10000),
      likeCount: Math.floor(Math.random() * 5000) + 100,
      favoriteCount: Math.floor(Math.random() * 2000) + 50,
      
      // 其他字段
      genres: [['动作', '喜剧', '剧情', '科幻', '恐怖'][index % 5]],
      duration: 90 + Math.floor(Math.random() * 60),
      year: 2024 - Math.floor(Math.random() * 5),
      createdAt: publishDate.toISOString(),
      updatedAt: publishDate.toISOString()
    }
  })
}

// 直接生成PhotoItem格式
public generateMockPhotos(count: number = 15): PhotoItem[] {
  return Array.from({ length: count }, (_, index) => {
    const publishDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    const isNew = isWithin24Hours(publishDate)
    
    return {
      id: `photo_${index + 1}`,
      title: `精美图片 ${index + 1}`,
      type: 'Photo' as const,
      contentType: 'photo' as const,
      imageUrl: `https://picsum.photos/600/400?random=${index + 200}`,
      alt: `精美图片 ${index + 1}`,
      description: `这是第${index + 1}张精美图片的描述`,
      
      // 业务字段 - 固定规则
      isVip: true, // 所有写真都是VIP
      isNew: isNew,
      newType: isNew ? 'latest' : null,
      quality: ['4K', 'HD', '高清'][index % 3],
      formatType: ['JPEG高', 'PNG', 'WebP', 'GIF', 'BMP'][index % 5] as any,
      
      // 统计字段 - 随机数
      viewCount: Math.floor(Math.random() * 50000) + 1000,
      downloadCount: Math.floor(Math.random() * 5000) + 100,
      likeCount: Math.floor(Math.random() * 5000) + 100,
      favoriteCount: Math.floor(Math.random() * 2000) + 50,
      
      // 其他字段
      genres: [['风景', '人物', '建筑', '动物', '艺术'][index % 5]],
      createdAt: publishDate.toISOString(),
      updatedAt: publishDate.toISOString()
    }
  })
}
```

#### 业务规则定义

```typescript
// VIP状态规则
function determineVipStatus(contentType: 'movie' | 'photo' | 'collection', index: number): boolean {
  switch (contentType) {
    case 'collection':
      return true // 所有合集都是VIP
    case 'photo':
      return true // 所有写真都是VIP
    case 'movie':
      // 影片根据索引决定：每3个中有1个是VIP
      return index % 3 === 0
  }
}

// NEW标签规则
function isWithin24Hours(publishDate: Date): boolean {
  const now = Date.now()
  const diff = now - publishDate.getTime()
  return diff <= 24 * 60 * 60 * 1000
}

// 质量标签规则
function getQualityByIndex(index: number): string {
  const qualities = ['4K', 'HD', '1080P', '720P']
  return qualities[index % qualities.length]
}
```

#### 保留的随机数据

只有以下字段使用随机数生成：

```typescript
{
  viewCount: Math.floor(Math.random() * 50000) + 1000,
  downloadCount: Math.floor(Math.random() * 5000) + 50,
  likeCount: Math.floor(Math.random() * 5000) + 100,
  favoriteCount: Math.floor(Math.random() * 2000) + 50
}
```

### 2. 类型系统增强

#### BaseContentItem 接口增强

```typescript
export interface BaseContentItem {
  id: string
  title: string
  contentType: 'movie' | 'photo' | 'collection'
  imageUrl: string
  alt?: string
  
  // 标签相关字段 - 明确定义
  isVip: boolean // 必填，不再是可选
  isNew?: boolean // 可选，由发布时间计算
  newType?: 'hot' | 'latest' | null
  quality?: string // 可选，影片和写真有，合集没有
  rating?: string | number // 可选，只有影片有
  
  // 统计字段 - 使用随机数
  viewCount?: number
  downloadCount?: number
  likeCount?: number
  favoriteCount?: number
  
  // 其他字段
  description?: string
  publishDate?: string
  createdAt?: string
  updatedAt?: string
}
```

#### 内容类型特定接口

```typescript
// 合集接口 - 强制VIP
export interface CollectionItem extends BaseContentItem {
  contentType: 'collection'
  isVip: true // 类型级别强制为true
  movieCount?: number
  category?: string
}

// 写真接口 - 强制VIP
export interface PhotoItem extends BaseContentItem {
  contentType: 'photo'
  isVip: true // 类型级别强制为true
  formatType?: 'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP'
  quality?: string // 写真有质量标签
}

// 影片接口 - VIP可选
export interface MovieItem extends BaseContentItem {
  contentType: 'movie'
  isVip: boolean // 根据数据源决定
  quality?: string
  rating?: string | number
  genres?: string[]
  duration?: number
}
```

### 3. Content Renderer 系统

Content Renderer系统负责根据内容类型选择正确的渲染器，并应用标签显示规则。

#### 渲染器配置接口

```typescript
export interface RendererConfig {
  // 标签显示配置
  showVipBadge?: boolean
  showNewBadge?: boolean
  showQualityBadge?: boolean
  showRatingBadge?: boolean
  
  // 其他配置
  hoverEffect?: boolean
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: (item: BaseContentItem) => void
}
```

#### 渲染器实现策略

每个渲染器需要实现标签显示的业务规则。

### 4. MovieLayer 组件重构

MovieLayer组件需要移除所有硬编码逻辑，完全依赖传入的props。

### 5. 详情页VIP样式系统

详情页需要根据数据源的isVip字段显示VIP专属样式。

## Data Models

数据实体模型定义了系统中所有内容类型的数据结构。

## Error Handling

### 数据完整性验证

在数据流的关键节点添加验证，确保数据的完整性和正确性。

### 回退策略

当数据缺失时，系统应该有合理的回退逻辑。

## Testing Strategy

### 单元测试

测试MockDataService、Content Renderer等核心组件。

### 集成测试

测试从Mock数据到UI的完整数据流。

### E2E测试

测试用户可见的标签显示行为。

## Implementation Notes

### 实施顺序

1. **Phase 1: MockDataService重构**
   - 移除Domain Entity生成逻辑
   - 直接生成CollectionItem、PhotoItem、MovieItem格式
   - 实现业务规则（VIP、NEW、质量标签）
   - 保留统计字段的随机生成

2. **Phase 2: 移除ContentTransformationService**
   - 删除不必要的转换逻辑
   - 更新Repository层，移除转换调用
   - 更新ApplicationService层

3. **Phase 3: 类型系统增强**
   - 确保CollectionItem、PhotoItem强制isVip为true
   - 更新MovieItem的isVip为可选boolean
   - 添加类型守卫函数

4. **Phase 4: Content Renderer更新**
   - 实现标签显示业务规则
   - 更新每个渲染器的render方法
   - 添加数据验证逻辑

5. **Phase 5: MovieLayer重构**
   - 移除硬编码逻辑
   - 完全依赖props
   - 更新所有Layer组件

6. **Phase 6: 详情页VIP样式**
   - 创建DetailPageVipStyle组件
   - 更新所有详情页
   - 确保样式一致性

7. **Phase 7: 测试和验证**
   - 编写单元测试
   - 编写集成测试
   - 执行E2E测试

### 统一属性命名规范

**重要问题：属性命名不一致**

当前系统存在属性命名不一致的问题，例如：
- 列表页使用 `isVip`
- 详情页使用 `isVip`
- 下载链接使用 `requiresVip`（不一致！）

**统一命名规范**：

**1. VIP相关属性 - 统一使用 `isVip`：**
```typescript
// 列表页
export interface CollectionItem {
  isVip: boolean // 统一使用isVip
}

// 详情页
export interface MovieDetail {
  isVip: boolean // 统一使用isVip
}

// 下载链接
export interface DownloadLink {
  isVip: boolean // 修改：从requiresVip改为isVip
}

// Domain实体
export class Collection {
  constructor(
    public readonly isVip: boolean // 修改：从isVipRequired改为isVip
  ) {}
}

export class Movie {
  constructor(
    public readonly isVip: boolean // 修改：从isVipRequired改为isVip
  ) {}
}

export class Photo {
  constructor(
    public readonly isVip: boolean // 修改：从isVipRequired改为isVip
  ) {}
}
```

**2. 统计相关属性 - 统一使用 `xxxCount` 格式：**
```typescript
// 所有接口统一使用
export interface MediaStats {
  viewCount: number      // 统一使用viewCount
  downloadCount: number  // 统一使用downloadCount
  likeCount: number      // 统一使用likeCount
  dislikeCount: number   // 统一使用dislikeCount
  favoriteCount: number  // 统一使用favoriteCount
}

// ResourceStats接口需要修改
export interface ResourceStats {
  viewCount: number      // 修改：从views改为viewCount
  downloadCount: number  // 修改：从downloads改为downloadCount
  likeCount: number      // 修改：从likes改为likeCount
  dislikeCount: number   // 修改：从dislikes改为dislikeCount
}
```

**3. 其他属性命名规范：**
- NEW标签：统一使用 `isNew` 和 `newType`
- 质量标签：统一使用 `quality`
- 评分：统一使用 `rating`
- 热门：统一使用 `isHot`
- 精选：统一使用 `isFeatured`
- 合集描述：统一使用 `description`（不使用`collectionDescription`）

**命名检查清单**：
1. 搜索所有 `requiresVip`、`isVipRequired`、`vipRequired` 并替换为 `isVip`
2. 搜索所有 `views`、`downloads`、`likes`、`dislikes` 并替换为 `viewCount`、`downloadCount`、`likeCount`、`dislikeCount`
3. 搜索所有 `isNewContent`、`newContent` 并替换为 `isNew`
4. 搜索所有 `videoQuality`、`imageQuality` 并统一为 `quality`
5. 搜索所有 `collectionDescription` 并替换为 `description`
6. 确保Domain实体（Collection.ts、Movie.ts、Photo.ts）中的VIP属性统一为`isVip`
7. 确保所有模块使用相同的属性名

### 向后兼容性

为了确保平滑过渡，需要保留旧的API接口并添加废弃警告。

### 性能考虑

1. **缓存策略**: MockDataService使用Map缓存生成的数据
2. **懒加载**: 大量数据时使用虚拟滚动
3. **批量处理**: 数据转换使用批量操作

### 监控和日志

添加关键节点的日志记录，便于调试和问题追踪。
