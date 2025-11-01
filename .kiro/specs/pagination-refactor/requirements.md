# 分页器通用化重构需求文档

## 简介

本文档定义了对现有分页器实现进行完全重构的需求。当前项目中存在3处分页器实现，代码重复且样式不统一，需要**完全移除**这些实现，从零开始构建一个全新的通用分页组件系统。

**需要移除的现有分页实现：**
1. **CollectionList 组件** (`MovieFront/src/presentation/components/domains/collections/CollectionList.tsx` 第170-234行) - 完整页码分页器
2. **CollectionDetailPage 页面** (`MovieFront/src/presentation/pages/collection/CollectionDetailPage.tsx` 第137-159行) - 简单上一页/下一页按钮
3. **CollectionMovieList 组件** (`MovieFront/src/presentation/components/domains/collection/CollectionMovieList.tsx` 第129-183行) - 完整页码分页器

**重构策略：**
- 先创建全新的通用 `Pagination` 组件
- 删除所有现有的分页UI代码
- 在原位置导入并使用新的通用组件
- 统一类型定义和配置接口

**未来需要分页的页面：**
- MovieSearchPage（影片搜索结果）
- MovieCategoryPage（影片分类列表）
- FavoritesPage（我的收藏列表）

通过这次重构，将建立统一的分页标准，提供开箱即用的分页能力，确保代码库的一致性和可维护性。

## 需求列表

### 需求 1：统一分页数据类型定义

**用户故事：** 作为开发者，我希望项目中所有分页相关的类型定义统一，以便在不同场景下使用一致的数据结构。

#### 验收标准

1. WHEN 定义分页配置类型 THEN 系统应提供统一的 `PaginationConfig` 接口，包含当前页码、总页数、每页条数、总条数等核心字段
2. WHEN 定义分页响应类型 THEN 系统应提供统一的 `PaginatedResponse<T>` 接口，包含数据列表和分页元信息
3. WHEN 使用分页类型 THEN 所有组件和服务应使用统一的类型定义，避免重复声明
4. IF 需要扩展分页配置 THEN 应通过可选字段扩展，保持向后兼容

### 需求 2：创建通用分页UI组件

**用户故事：** 作为开发者，我希望有一个独立的分页UI组件，可以在不同页面中复用，避免重复编写分页UI代码。

#### 验收标准

1. WHEN 创建分页组件 THEN 组件应命名为 `Pagination`，放置在 `@components/atoms` 目录下
2. WHEN 渲染分页组件 THEN 应显示上一页按钮、页码按钮列表、下一页按钮
3. WHEN 页码数量较多 THEN 应支持智能省略显示（如：1 ... 5 6 7 ... 20）
4. WHEN 用户点击页码 THEN 应触发 `onPageChange` 回调，传递目标页码
5. WHEN 当前页为第一页 THEN 上一页按钮应禁用
6. WHEN 当前页为最后一页 THEN 下一页按钮应禁用
7. WHEN 组件处于加载状态 THEN 所有按钮应禁用并显示加载样式
8. WHEN 总页数为1或0 THEN 分页组件应不显示或显示禁用状态

### 需求 3：支持多种分页显示模式

**用户故事：** 作为开发者，我希望分页组件支持不同的显示模式，以适应不同的UI设计需求。

#### 验收标准

1. WHEN 配置显示模式为 `simple` THEN 应只显示上一页/下一页按钮和当前页信息
2. WHEN 配置显示模式为 `full` THEN 应显示完整的页码列表和导航按钮
3. WHEN 配置显示模式为 `compact` THEN 应显示紧凑的页码列表（最多显示5个页码）
4. WHEN 配置 `showPageInfo` 为 true THEN 应在分页器下方显示"第 X 页，共 Y 页，总计 Z 条"信息
5. WHEN 配置 `showQuickJumper` 为 true THEN 应显示快速跳转输入框

### 需求 4：支持响应式布局

**用户故事：** 作为用户，我希望在不同设备上都能获得良好的分页器使用体验。

#### 验收标准

1. WHEN 在移动设备上显示 THEN 分页按钮应使用较小尺寸（h-8 w-8）
2. WHEN 在桌面设备上显示 THEN 分页按钮应使用标准尺寸（h-10 w-10）
3. WHEN 在小屏幕上显示 THEN 页码按钮间距应减小（space-x-1）
4. WHEN 在大屏幕上显示 THEN 页码按钮间距应增大（space-x-2）
5. WHEN 屏幕宽度不足 THEN 应自动切换到简化模式，隐藏部分页码

### 需求 5：提供可定制的样式配置

**用户故事：** 作为开发者，我希望能够自定义分页器的样式，以匹配不同页面的设计风格。

#### 验收标准

1. WHEN 配置 `variant` 为 `default` THEN 应使用默认的绿色主题样式
2. WHEN 配置 `variant` 为 `primary` THEN 应使用蓝色主题样式
3. WHEN 配置 `variant` 为 `ghost` THEN 应使用透明背景样式
4. WHEN 配置 `size` 为 `sm` THEN 按钮尺寸应为小号
5. WHEN 配置 `size` 为 `md` THEN 按钮尺寸应为中号
6. WHEN 配置 `size` 为 `lg` THEN 按钮尺寸应为大号
7. WHEN 传入 `className` THEN 应支持自定义CSS类名扩展

### 需求 6：移除现有分页实现并使用通用分页器

**用户故事：** 作为开发者，我希望完全移除现有的分页实现代码，使用全新的通用分页组件替代，确保代码库的一致性和可维护性。

#### 验收标准

1. WHEN 移除旧代码 THEN 应删除 `CollectionList` 组件中的内联分页UI代码（第170-234行）
2. WHEN 移除旧代码 THEN 应删除 `CollectionDetailPage` 页面中的简单分页按钮代码（第137-159行）
3. WHEN 移除旧代码 THEN 应删除 `CollectionMovieList` 组件中的分页UI代码（第129-183行）
4. WHEN 使用新组件 THEN `CollectionList` 应导入并使用新的 `Pagination` 组件，配置为完整页码显示模式
5. WHEN 使用新组件 THEN `CollectionDetailPage` 应导入并使用新的 `Pagination` 组件，可配置为简单或完整模式
6. WHEN 重构完成后 THEN 所有分页功能应保持原有行为不变（页码切换、禁用状态、加载状态）
7. WHEN 重构完成后 THEN 应删除重复的 `PaginationConfig` 类型定义，统一使用新的类型系统
8. WHEN 重构完成后 THEN 应确保样式和交互体验与原有实现一致或更优

### 需求 8：提供分页工具函数

**用户故事：** 作为开发者，我希望有一套工具函数来处理常见的分页计算逻辑。

#### 验收标准

1. WHEN 需要计算总页数 THEN 应提供 `calculateTotalPages(total: number, pageSize: number)` 函数
2. WHEN 需要计算数据切片范围 THEN 应提供 `getPageSlice(data: T[], page: number, pageSize: number)` 函数
3. WHEN 需要生成页码列表 THEN 应提供 `generatePageNumbers(current: number, total: number, maxVisible: number)` 函数
4. WHEN 需要验证页码有效性 THEN 应提供 `isValidPage(page: number, totalPages: number)` 函数
5. WHEN 需要获取分页元信息 THEN 应提供 `getPaginationMeta(page: number, pageSize: number, total: number)` 函数

### 需求 9：支持客户端和服务端分页模式

**用户故事：** 作为开发者，我希望分页组件能够同时支持客户端分页和服务端分页两种模式。

#### 验收标准

1. WHEN 使用客户端分页模式 THEN 组件应在本地对数据进行切片处理
2. WHEN 使用服务端分页模式 THEN 组件应直接显示传入的数据，不进行切片
3. WHEN 切换页码 THEN 客户端模式应立即显示新页数据，服务端模式应触发数据加载
4. WHEN 配置 `serverPaginated` 为 true THEN 应使用服务端分页模式
5. WHEN 配置 `serverPaginated` 为 false THEN 应使用客户端分页模式

### 需求 10：提供完善的文档和示例

**用户故事：** 作为开发者，我希望有清晰的文档和示例代码，帮助我快速理解和使用分页组件。

#### 验收标准

1. WHEN 查看组件文档 THEN 应包含完整的 Props 接口说明
2. WHEN 查看组件文档 THEN 应包含至少3个使用示例（基础用法、服务端分页、自定义样式）
3. WHEN 查看类型定义 THEN 应包含详细的 JSDoc 注释
4. WHEN 查看工具函数文档 THEN 应包含参数说明、返回值说明和使用示例
5. WHEN 迁移现有代码 THEN 应提供迁移指南，说明如何从旧实现迁移到新组件
