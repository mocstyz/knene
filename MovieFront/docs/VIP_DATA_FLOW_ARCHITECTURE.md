# VIP数据流架构文档

## 概述

本文档描述了VIP数据流和标签系统的架构设计，包括数据流向、业务规则、配置系统和扩展指南。

## 架构原则

1. **数据驱动**：所有UI展示都基于数据源，不在组件中硬编码业务逻辑
2. **单一数据源**：使用统一的MockDataService作为唯一的数据生成源
3. **类型安全**：通过TypeScript类型系统确保数据完整性
4. **分层清晰**：遵循DDD架构，数据在各层之间流动时保持完整性
5. **配置灵活**：通过配置系统控制标签显示，但数据源规则优先

## 数据流架构

### 简化后的数据流

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

### 移除的层

- ❌ ContentTransformationService（不再需要）
- ❌ Domain Entity层的复杂转换逻辑

### 新的设计原则

- MockDataService直接生成CollectionItem、PhotoItem、MovieItem等最终格式
- Repository层只负责数据获取，不做转换
- 数据格式在Mock层就已经是UI需要的格式

## VIP业务规则

### 内容类型规则

#### 1. 合集（Collection）

**VIP状态：** 固定为VIP（`isVip: true`）

**标签显示规则：**
- ✅ VIP标签：强制显示
- ✅ NEW标签：根据isNew字段显示
- ❌ 质量标签：不显示
- ❌ 评分标签：不显示

**数据生成：**
```typescript
// MockDataService.generateMockCollections
{
  isVip: true, // 所有合集都是VIP
  isNew: isWithin24Hours(publishDate),
  newType: isNew ? 'latest' : null
}
```

**渲染逻辑：**
```typescript
// CollectionContentRenderer
<CollectionLayer
  showVipBadge={true} // 强制显示，忽略配置
  showNewBadge={config.showNewBadge && collectionItem.isNew}
  isVip={true}
  isNew={collectionItem.isNew || false}
/>
```

#### 2. 写真（Photo）

**VIP状态：** 固定为VIP（`isVip: true`）

**标签显示规则：**
- ✅ VIP标签：强制显示
- ✅ NEW标签：根据isNew字段显示
- ✅ 质量标签：根据quality字段显示
- ❌ 评分标签：不显示

**数据生成：**
```typescript
// MockDataService.generateMockPhotos
{
  isVip: true, // 所有写真都是VIP
  isNew: isWithin24Hours(publishDate),
  newType: isNew ? 'latest' : null,
  quality: ['4K', 'HD', '高清'][index % 3]
}
```

**渲染逻辑：**
```typescript
// PhotoContentRenderer
<PhotoLayer
  showVipBadge={true} // 强制显示，忽略配置
  showNewBadge={config.showNewBadge && photoItem.isNew}
  showQualityBadge={config.showQualityBadge && !!photoItem.formatType}
  isVip={true}
  isNew={photoItem.isNew || false}
/>
```

#### 3. 影片（Movie）

**VIP状态：** 根据索引决定（每3个中有1个是VIP）

**标签显示规则：**
- ✅ VIP标签：根据isVip字段和配置决定
- ✅ NEW标签：根据isNew字段显示
- ✅ 质量标签：根据quality字段显示
- ✅ 评分标签：根据rating字段显示

**数据生成：**
```typescript
// MockDataService.generateMockMovies
{
  isVip: index % 3 === 0, // 每3个中有1个是VIP
  isNew: isWithin24Hours(publishDate),
  newType: isNew ? 'latest' : null,
  quality: ['4K', 'HD', '1080P', '720P'][index % 4],
  rating: (Math.random() * 4 + 6).toFixed(1)
}
```

**渲染逻辑：**
```typescript
// MovieContentRenderer
<MovieLayer
  showVipBadge={config.showVipBadge} // 受配置控制
  showNewBadge={config.showNewBadge}
  showQualityBadge={config.showQualityBadge}
  showRatingBadge={config.showRatingBadge}
  isVip={movieItem.isVip}
  isNew={movieItem.isNew}
/>
```

### VIP链路完整性

#### 合集VIP链路

```
首页合集卡片（VIP标签）
    ↓
合集影片列表页（所有影片显示VIP标签）
    ↓
影片详情页（VIP专属样式）
```

**关键实现：**
1. 合集数据：`isVip: true`
2. 合集影片列表：`getMockCollectionMovies` 为所有影片设置 `isVip: true`
3. 影片详情页：根据 `movie.isVip` 显示金色渐变下载按钮和VIP标签

#### 写真VIP链路

```
首页写真卡片（VIP标签）
    ↓
写真列表页（所有卡片显示VIP标签）
    ↓
写真详情页（VIP专属样式）
```

**关键实现：**
1. 写真数据：`isVip: true`
2. 写真详情页：固定传递 `isVip={true}`

#### 普通影片链路

```
首页普通影片卡片（无VIP标签）
    ↓
影片详情页（普通样式）
```

**关键实现：**
1. 影片数据：`isVip: false`（非VIP影片）
2. 影片详情页：根据 `movie.isVip` 显示绿色下载按钮，无VIP标签

## 配置系统

### RendererConfig接口

```typescript
export interface RendererConfig {
  // 标签显示配置 - 独立控制每个标签的显示
  showVipBadge?: boolean      // 是否显示VIP徽章
  showNewBadge?: boolean      // 是否显示新内容徽章
  showQualityBadge?: boolean  // 是否显示质量徽章
  showRatingBadge?: boolean   // 是否显示评分徽章
  
  // 其他配置
  hoverEffect?: boolean
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape'
  showMetadata?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: (item: BaseContentItem) => void
}
```

### 配置优先级规则

1. **合集和写真：数据源规则优先**
   - VIP标签强制显示，忽略 `config.showVipBadge`
   - 其他标签根据配置和数据源共同决定

2. **影片：配置与数据源共同决定**
   - VIP标签：`config.showVipBadge && item.isVip`
   - 其他标签：`config.showXxxBadge && item.xxx`

### 默认配置

```typescript
export function createDefaultRendererConfig(
  overrides?: Partial<RendererConfig>
): RendererConfig {
  return {
    hoverEffect: true,
    aspectRatio: 'portrait',
    showVipBadge: true,      // 默认显示VIP标签
    showNewBadge: true,      // 默认显示NEW标签
    showQualityBadge: true,  // 默认显示质量标签
    showRatingBadge: true,   // 默认显示评分标签
    showMetadata: false,
    showTitle: true,
    showDescription: false,
    size: 'md',
    className: '',
    ...overrides,
  }
}
```

## 数据验证和回退

### Repository层验证

```typescript
// HomeRepository.validateAndFixData
private validateAndFixData<T>(items: T[], type: string): T[] {
  return items.map(item => {
    // 验证数据
    this.validateContentItem(item, type)
    
    // 回退逻辑：确保isVip字段存在
    if (item.isVip === undefined || item.isVip === null) {
      console.warn(`⚠️ [HomeRepository] ${type}数据缺失isVip字段，使用回退值false:`, item.id)
      return { ...item, isVip: false as any }
    }
    
    return item
  })
}
```

### Content Renderer验证

```typescript
// CollectionContentRenderer.doRender
protected doRender(item: BaseContentItem, config: RendererConfig): React.ReactElement {
  const collectionItem = item as CollectionContentItem

  // 数据验证：检查关键字段
  if (!collectionItem.id || !collectionItem.title || !collectionItem.imageUrl) {
    console.warn('⚠️ [CollectionRenderer] 数据不完整:', {
      id: collectionItem.id,
      title: collectionItem.title,
      hasImage: !!collectionItem.imageUrl
    })
  }

  // 数据验证：检查isVip字段
  if (collectionItem.isVip === undefined || collectionItem.isVip === null) {
    console.warn('⚠️ [CollectionRenderer] 缺失isVip字段，使用回退值true:', collectionItem.id)
    collectionItem.isVip = true // 回退逻辑：合集默认为VIP
  }

  // ... 渲染逻辑
}
```

## 类型系统

### 基础类型

```typescript
// BaseContentItem - 所有内容类型的基础接口
export interface BaseContentItem {
  id: string
  title: string
  contentType: 'movie' | 'photo' | 'collection'
  imageUrl: string
  alt?: string
  isVip: boolean // 必填，不再是可选
  isNew?: boolean
  newType?: 'hot' | 'latest' | null
  quality?: string
  rating?: string | number
  // ... 其他字段
}
```

### 内容类型特定接口

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
  quality?: string
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

## 扩展指南

### 添加新的内容类型

1. **定义类型接口**
```typescript
export interface NewContentItem extends BaseContentItem {
  contentType: 'newtype'
  isVip: boolean // 根据业务规则决定是否强制为true
  // ... 其他特定字段
}
```

2. **创建Content Renderer**
```typescript
export class NewContentRenderer extends BaseContentRenderer {
  public readonly contentType = 'newtype' as const
  
  protected doRender(item: BaseContentItem, config: RendererConfig): React.ReactElement {
    // 实现渲染逻辑
    // 根据业务规则决定标签显示
  }
}
```

3. **在MockDataService中生成数据**
```typescript
public generateMockNewContent(count: number): NewContentItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `newcontent_${index + 1}`,
    title: `新内容 ${index + 1}`,
    contentType: 'newtype',
    imageUrl: `...`,
    isVip: /* 根据业务规则 */,
    // ... 其他字段
  }))
}
```

4. **注册Renderer**
```typescript
// 在renderer-factory中注册
contentRendererFactory.register(new NewContentRenderer())
```

### 修改VIP业务规则

如果需要修改VIP业务规则（例如，某些影片也强制为VIP），只需要：

1. **更新MockDataService**
```typescript
// 修改数据生成逻辑
public generateMockMovies(count: number): MovieItem[] {
  return Array.from({ length: count }, (_, index) => ({
    // ...
    isVip: /* 新的业务规则 */,
  }))
}
```

2. **更新Content Renderer（如果需要）**
```typescript
// 如果需要强制显示VIP标签
<MovieLayer
  showVipBadge={true} // 改为强制显示
  isVip={movieItem.isVip}
/>
```

## 测试策略

### 单元测试

1. **MockDataService测试**
   - 测试VIP状态生成逻辑
   - 测试NEW标签生成逻辑
   - 测试随机数据和固定数据的区分

2. **Content Renderer测试**
   - 测试标签显示规则
   - 测试数据验证逻辑
   - 测试回退逻辑

3. **类型守卫测试**
   - 测试类型守卫函数的正确性

### 集成测试

1. **数据流测试**
   - 测试从MockDataService到UI的完整数据流
   - 验证数据在各层之间传递时的完整性

2. **数据完整性测试**
   - 验证isVip字段在整个流程中不丢失
   - 验证其他标签字段的完整性

### E2E测试

1. **VIP链路测试**
   - 测试合集完整链路（首页→合集影片列表→详情页）
   - 测试写真完整链路（首页→写真列表→详情页）
   - 测试普通影片链路（首页→详情页）

2. **混合内容测试**
   - 测试最新更新页面的标签显示
   - 测试热门页面的标签显示

## 参考资料

- [属性命名规范](./PROPERTY_NAMING_CONVENTIONS.md)
- [代码审查报告](./VIP_DATA_FLOW_REFACTOR_REVIEW.md)
- [TypeScript类型系统](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [DDD架构模式](https://martinfowler.com/bliki/DomainDrivenDesign.html)
