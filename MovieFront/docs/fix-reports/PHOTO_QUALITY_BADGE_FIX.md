# 写真质量标签显示问题修复

## 问题描述
在7天最热门模块中，写真卡片（如"精美图片 39"）没有显示质量标签（JPEG高/PNG等）。

## 根本原因

### 数据流程分析
```
ContentTransformationService.transformPhotoToUnified()
  ↓ 设置 quality: 'JPEG高'
  ↓ 设置 metadata.formatType: 'JPEG高'
toUnifiedContentItem()
  ↓ 保留 quality 字段
  ↓ 保留 metadata 对象
MixedContentList
  ↓ 传递 BaseContentItem 给渲染器
PhotoContentRenderer.doRender()
  ↓ 尝试访问 photoItem.formatType ❌
  ↓ 但 BaseContentItem 中没有 formatType 字段
PhotoLayer
  ↓ 收到 formatType: undefined
  ↓ 不显示质量标签 ❌
```

### 问题根源
1. **数据结构不匹配：**
   - `BaseContentItem` 接口有 `quality` 字段（通用字段）
   - `PhotoContentItem` 接口有 `formatType` 字段（写真专用字段）
   - 但是 `BaseContentItem` **没有** `formatType` 字段

2. **字段映射缺失：**
   - `PhotoContentRenderer` 直接访问 `photoItem.formatType`
   - 但这个字段在 `BaseContentItem` 中不存在
   - 需要在 `preprocessItem` 中进行字段映射

## 修复方案

### 文件：`src/presentation/components/domains/photo/renderers/photo-renderer.tsx`
**在 `preprocessItem` 方法中添加字段映射逻辑**

```typescript
// 修复前：
protected preprocessItem(
  item: BaseContentItem,
  config: RendererConfig
): BaseContentItem {
  const photoItem = { ...item } as PhotoContentItem

  // 设置默认值
  if (!photoItem.tags) {
    photoItem.tags = []
  }

  return photoItem
}

// 修复后：
protected preprocessItem(
  item: BaseContentItem,
  config: RendererConfig
): BaseContentItem {
  const photoItem = { ...item } as PhotoContentItem

  // 设置默认值
  if (!photoItem.tags) {
    photoItem.tags = []
  }

  // 将quality字段映射到formatType字段（用于显示质量标签）
  // 如果formatType不存在，尝试从quality或metadata.formatType获取
  if (!photoItem.formatType) {
    // 优先使用metadata.formatType
    if ((item as any).metadata?.formatType) {
      photoItem.formatType = (item as any).metadata.formatType as 'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP'
    }
    // 其次使用quality字段
    else if ((item as any).quality) {
      photoItem.formatType = (item as any).quality as 'JPEG高' | 'PNG' | 'WebP' | 'GIF' | 'BMP'
    }
    // 最后使用默认值
    else {
      photoItem.formatType = 'JPEG高'
    }
  }

  return photoItem
}
```

## 修复逻辑

### 字段映射优先级
1. **优先使用 `metadata.formatType`**
   - 这是 `transformPhotoToUnified` 明确设置的字段
   - 最准确的数据来源

2. **其次使用 `quality` 字段**
   - 通用字段，所有内容类型都有
   - 对于写真，`quality` 就是图片格式

3. **最后使用默认值 `'JPEG高'`**
   - 确保总是有值显示
   - 避免质量标签不显示

## 修复后的数据流程

```
ContentTransformationService.transformPhotoToUnified()
  ↓ 设置 quality: 'JPEG高'
  ↓ 设置 metadata.formatType: 'JPEG高'
toUnifiedContentItem()
  ↓ 保留 quality 字段
  ↓ 保留 metadata 对象
MixedContentList
  ↓ 传递 BaseContentItem 给渲染器
PhotoContentRenderer.preprocessItem() ✅
  ↓ 从 metadata.formatType 或 quality 映射到 formatType
  ↓ photoItem.formatType = 'JPEG高'
PhotoContentRenderer.doRender()
  ↓ 访问 photoItem.formatType ✅
  ↓ 传递给 PhotoLayer
PhotoLayer
  ↓ 收到 formatType: 'JPEG高' ✅
  ↓ 显示质量标签 ✅
```

## 验证步骤
1. 重新运行应用：`npm run dev`
2. 打开首页
3. 查看"7天最热门"模块中的写真卡片（如"精美图片 39"）
4. 确认质量标签显示：
   - ✅ 右上角显示质量标签（JPEG高/PNG/WebP等）
   - ✅ 标签样式正确
   - ✅ 与电影的质量标签（HD/4K等）位置一致

## 影响范围
- ✅ 7天最热门模块的写真卡片
- ✅ 最新更新模块的写真卡片
- ✅ 写真专题页面的写真卡片
- ✅ 所有使用 `PhotoContentRenderer` 的地方

## 技术要点

### 1. 字段映射的必要性
在内容渲染器架构中，不同的内容类型有不同的专用字段：
- 电影：`quality` = 'HD' | '4K' | '1080P'
- 写真：`formatType` = 'JPEG高' | 'PNG' | 'WebP'
- 合集：不需要质量标签

但是 `BaseContentItem` 只有通用的 `quality` 字段，所以需要在渲染器的 `preprocessItem` 中进行字段映射。

### 2. 为什么不修改 BaseContentItem？
- `BaseContentItem` 是所有内容类型的基础接口
- 添加 `formatType` 会污染接口，因为只有写真需要这个字段
- 更好的做法是在具体的渲染器中进行字段映射

### 3. 为什么使用 metadata？
- `metadata` 是一个灵活的对象，可以存储任意额外信息
- 不同的内容类型可以在 `metadata` 中存储专用字段
- 渲染器可以从 `metadata` 中提取需要的字段

## 相关文件
- `src/presentation/components/domains/photo/renderers/photo-renderer.tsx` - 写真渲染器
- `src/application/services/ContentTransformationService.ts` - 数据转换服务
- `src/types/movie.types.ts` - 类型定义
- `src/presentation/components/domains/photo/components/PhotoLayer.tsx` - 写真卡片组件

## 总结
通过在 `PhotoContentRenderer` 的 `preprocessItem` 方法中添加字段映射逻辑，成功解决了写真质量标签不显示的问题。这个修复确保了：
1. ✅ 写真卡片正确显示质量标签（JPEG高/PNG等）
2. ✅ 数据从 `quality` 或 `metadata.formatType` 正确映射到 `formatType`
3. ✅ 即使数据缺失，也有默认值保证标签显示
4. ✅ 不影响其他内容类型的渲染
