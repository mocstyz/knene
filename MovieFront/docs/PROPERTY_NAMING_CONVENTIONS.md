# 属性命名规范

本文档定义了整个应用中使用的统一属性命名规范，确保代码的一致性和可维护性。

## 核心原则

1. **一致性优先**：同一概念在所有模块中使用相同的属性名
2. **语义清晰**：属性名应该清楚地表达其含义
3. **类型安全**：使用TypeScript类型系统确保属性使用正确

## VIP相关属性

### 统一使用 `isVip`

**✅ 正确：**
```typescript
interface ContentItem {
  isVip: boolean  // 是否为VIP内容
}

interface MovieDetail {
  isVip: boolean  // 是否为VIP影片
}

interface DownloadLink {
  isVip: boolean  // 是否需要VIP权限
}
```

**❌ 错误：**
```typescript
// 不要使用这些变体
requiresVip: boolean
isVipRequired: boolean
vipRequired: boolean
needsVip: boolean
```

### 使用场景

- **列表页数据**：`CollectionItem.isVip`, `PhotoItem.isVip`, `MovieItem.isVip`
- **详情页数据**：`MovieDetail.isVip`, `PhotoDetail.isVip`
- **下载链接**：`DownloadLink.isVip`
- **UI组件**：`showVipBadge` (配置项), `isVip` (数据项)

## 统计相关属性

### 统一使用 `xxxCount` 格式

**✅ 正确：**
```typescript
interface MediaStats {
  viewCount: number       // 观看次数
  downloadCount: number   // 下载次数
  likeCount: number       // 点赞数
  dislikeCount: number    // 踩数
  favoriteCount: number   // 收藏数
}
```

**❌ 错误：**
```typescript
// 不要使用这些变体
views: number
downloads: number
likes: number
dislikes: number
```

### 使用场景

- **内容项统计**：`BaseContentItem.viewCount`, `BaseContentItem.downloadCount`
- **资源统计**：`ResourceInfo.stats.viewCount`
- **用户统计**：`UserProfile.uploadCount`, `UserProfile.commentCount`

## NEW标签相关属性

### 统一使用 `isNew` 和 `newType`

**✅ 正确：**
```typescript
interface ContentItem {
  isNew?: boolean                    // 是否为新内容
  newType?: 'hot' | 'latest' | null  // 新内容类型
}
```

**❌ 错误：**
```typescript
// 不要使用这些变体
isNewContent: boolean
newContent: boolean
isLatest: boolean
```

### 使用场景

- **数据源**：`MockDataService` 生成数据时设置 `isNew` 和 `newType`
- **UI渲染**：`showNewBadge` (配置项), `isNew` (数据项), `newBadgeType` (显示类型)

## 质量相关属性

### 统一使用 `quality`

**✅ 正确：**
```typescript
interface MovieItem {
  quality?: string  // 影片质量：'4K', 'HD', '1080P', '720P'
}

interface PhotoItem {
  quality?: string  // 写真质量：'4K', 'HD', '高清'
}
```

**❌ 错误：**
```typescript
// 不要使用这些变体
videoQuality: string
imageQuality: string
resolution: string  // 除非特指分辨率
```

### 使用场景

- **影片质量**：`MovieItem.quality`
- **写真质量**：`PhotoItem.quality`
- **UI显示**：`showQualityBadge` (配置项), `qualityText` (显示文本)

## 评分相关属性

### 统一使用 `rating` 和 `ratingColor`

**✅ 正确：**
```typescript
interface MovieItem {
  rating?: string | number  // 评分值
  ratingColor?: 'white' | 'green' | 'yellow' | 'red'  // 评分颜色
}
```

**❌ 错误：**
```typescript
// 不要使用这些变体
score: number
rate: number
```

### 使用场景

- **影片评分**：`MovieItem.rating`, `MovieItem.ratingColor`
- **UI显示**：`showRatingBadge` (配置项)

## 描述相关属性

### 统一使用 `description`

**✅ 正确：**
```typescript
interface CollectionItem {
  description?: string  // 合集描述
}

interface MovieDetail {
  description?: string  // 影片描述
}
```

**❌ 错误：**
```typescript
// 不要使用这些变体
collectionDescription: string
movieDescription: string
summary: string  // 除非特指摘要
```

### 使用场景

- **所有内容类型**：统一使用 `description` 字段
- **特殊情况**：如果需要区分简介和详细描述，使用 `summary` 和 `description`

## 其他常用属性

### 布尔类型属性

使用 `is` 或 `has` 前缀：

```typescript
interface ContentItem {
  isVip: boolean        // 是否为VIP
  isNew: boolean        // 是否为新内容
  isFeatured: boolean   // 是否为精选
  isHot: boolean        // 是否为热门
  hasSubtitle: boolean  // 是否有字幕
}
```

### 配置类属性

使用 `show` 前缀：

```typescript
interface RendererConfig {
  showVipBadge?: boolean      // 是否显示VIP标签
  showNewBadge?: boolean      // 是否显示NEW标签
  showQualityBadge?: boolean  // 是否显示质量标签
  showRatingBadge?: boolean   // 是否显示评分标签
}
```

## 命名检查清单

在添加新属性或修改现有属性时，请检查：

- [ ] VIP相关：使用 `isVip`
- [ ] 统计相关：使用 `xxxCount` 格式
- [ ] NEW标签：使用 `isNew` 和 `newType`
- [ ] 质量相关：使用 `quality`
- [ ] 评分相关：使用 `rating` 和 `ratingColor`
- [ ] 描述相关：使用 `description`
- [ ] 布尔类型：使用 `is` 或 `has` 前缀
- [ ] 配置类型：使用 `show` 前缀

## 迁移指南

如果发现使用了旧的属性名，请按以下步骤迁移：

1. **搜索旧属性名**：使用全局搜索找到所有使用旧属性名的地方
2. **更新类型定义**：首先更新接口定义
3. **更新实现代码**：更新所有使用该属性的代码
4. **更新测试代码**：确保测试也使用新的属性名
5. **验证功能**：运行测试确保功能正常

## 参考资料

- [TypeScript命名约定](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [JavaScript命名最佳实践](https://github.com/airbnb/javascript#naming-conventions)
