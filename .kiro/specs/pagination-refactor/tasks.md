# 分页器通用化重构任务列表

## 任务概述

本任务列表将指导完成分页器通用化重构的完整实现，包括类型定义、工具函数、组件开发、现有代码重构和测试验证。

## 任务列表

- [x] 1. 创建分页类型定义系统



  - 创建 `MovieFront/src/types/pagination.ts` 文件
  - 定义 `PaginationConfig` 接口（currentPage, totalPages, pageSize, total, onPageChange）
  - 定义 `PaginationMode` 类型（simple, full, compact）
  - 定义 `PaginationVariant` 类型（default, primary, ghost）
  - 定义 `PaginationSize` 类型（sm, md, lg）
  - 定义 `PaginatedResponse<T>` 接口（data, pagination 元信息）
  - 添加完整的 JSDoc 注释


  - _需求: 1.1, 1.2, 1.3, 1.4_



- [ ] 2. 创建分页工具函数库
  - 创建 `MovieFront/src/utils/pagination.ts` 文件
  - 实现 `calculateTotalPages(total, pageSize)` 函数
  - 实现 `getPageSlice(data, page, pageSize)` 函数
  - 实现 `generatePageNumbers(current, total, maxVisible)` 函数（智能省略算法）


  - 实现 `isValidPage(page, totalPages)` 函数
  - 实现 `getPaginationMeta(page, pageSize, total)` 函数
  - 实现 `formatPaginationInfo(template, data)` 函数
  - 为每个函数添加单元测试
  - _需求: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 3. 创建分页设计令牌


  - 创建 `MovieFront/src/tokens/design-system/pagination-variants.ts` 文件
  - 定义 `paginationVariants` 对象（base, variant, size, container, info）
  - 定义 variant 样式（default 绿色主题, primary 蓝色主题, ghost 透明主题）
  - 定义 size 样式（sm, md, lg 的按钮尺寸和间距）
  - 定义响应式样式类
  - 导出到 `MovieFront/src/tokens/design-system/index.ts`
  - _需求: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_



- [ ] 4. 创建 PaginationButton 子组件
  - 创建 `MovieFront/src/presentation/components/atoms/Pagination/PaginationButton.tsx` 文件
  - 定义 `PaginationButtonProps` 接口
  - 实现按钮组件（支持 page, active, disabled, onClick, variant, size）
  - 应用设计令牌样式


  - 处理点击事件
  - 处理禁用状态样式
  - 处理激活状态样式
  - _需求: 2.2, 2.5, 2.6, 2.7, 5.1, 5.2, 5.3_

- [ ] 5. 创建 PaginationEllipsis 子组件
  - 创建 `MovieFront/src/presentation/components/atoms/Pagination/PaginationEllipsis.tsx` 文件


  - 定义 `PaginationEllipsisProps` 接口
  - 实现省略号组件（显示 "..."）
  - 应用尺寸样式
  - _需求: 2.3_

- [ ] 6. 创建 PaginationInfo 子组件
  - 创建 `MovieFront/src/presentation/components/atoms/Pagination/PaginationInfo.tsx` 文件
  - 定义 `PaginationInfoProps` 接口
  - 实现分页信息组件（显示"第 X 页，共 Y 页，总计 Z 条"）
  - 支持自定义模板
  - 使用 `formatPaginationInfo` 工具函数
  - 应用信息文本样式
  - _需求: 3.4_

- [ ] 7. 创建 Pagination 主组件
  - 创建 `MovieFront/src/presentation/components/atoms/Pagination/Pagination.tsx` 文件
  - 定义 `PaginationProps` 接口（包含所有配置选项）


  - 实现组件基础结构（容器、按钮组、信息区）
  - 实现 simple 模式（仅上一页/下一页 + 页码信息）
  - 实现 full 模式（显示所有页码按钮）
  - 实现 compact 模式（智能省略，使用 generatePageNumbers）
  - 实现上一页/下一页按钮（使用 PaginationButton）
  - 实现页码按钮列表（使用 PaginationButton）

  - 实现省略号显示（使用 PaginationEllipsis）
  - 实现分页信息显示（使用 PaginationInfo，可选）
  - 处理加载状态（禁用所有按钮）
  - 处理禁用状态
  - 处理边界情况（totalPages <= 1 不显示）
  - 添加 Props 验证
  - 使用 useMemo 优化页码列表计算
  - 使用 useCallback 优化事件处理


  - _需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 3.1, 3.2, 3.3, 3.4_

- [ ] 8. 创建 Pagination 组件导出文件
  - 创建 `MovieFront/src/presentation/components/atoms/Pagination/index.ts` 文件
  - 导出 Pagination 主组件
  - 导出 PaginationProps 类型
  - 导出子组件（可选）


  - 更新 `MovieFront/src/presentation/components/atoms/index.ts` 添加 Pagination 导出
  - _需求: 2.1_

- [ ] 9. 实现响应式行为
  - 在 Pagination 组件中添加响应式逻辑
  - 使用 `useMediaQuery` 或 `window.matchMedia` 检测屏幕尺寸
  - 在移动端（< 640px）自动切换为 simple 模式（如果 responsiveMode 为 true）
  - 在移动端使用小尺寸按钮（sm）
  - 在桌面端使用标准尺寸按钮（md）


  - 调整按钮间距（移动端 space-x-1，桌面端 space-x-2）
  - _需求: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 10. 移除 CollectionList 组件中的旧分页代码
  - 打开 `MovieFront/src/presentation/components/domains/collections/CollectionList.tsx`

  - 删除第 170-234 行的分页 UI 代码
  - 删除组件内部的 `PaginationConfig` 接口定义
  - 从 props 中移除 `pagination` 配置
  - 移除分页相关的 JSX 渲染逻辑
  - 保留其他功能不变
  - _需求: 6.1, 6.4_

- [ ] 11. 在 SpecialCollectionsPage 中使用新的 Pagination 组件
  - 打开 `MovieFront/src/presentation/pages/special/SpecialCollectionsPage.tsx`


  - 导入新的 Pagination 组件：`import { Pagination } from '@components/atoms'`
  - 在 CollectionList 组件下方添加 Pagination 组件
  - 配置 Pagination：mode="full", variant="default", showPageInfo=true
  - 传递 currentPage, totalPages, onPageChange
  - 传递 pageInfo（total, pageSize）
  - 传递 loading 和 disabled 状态
  - 验证分页功能正常工作
  - _需求: 6.4, 6.6, 8.2_



- [ ] 12. 移除 CollectionDetailPage 中的旧分页代码
  - 打开 `MovieFront/src/presentation/pages/collection/CollectionDetailPage.tsx`
  - 删除第 137-159 行的简单分页按钮代码
  - 移除相关的 JSX 渲染逻辑
  - 保留其他功能不变

  - _需求: 6.2_


- [ ] 13. 在 CollectionDetailPage 中使用新的 Pagination 组件
  - 在 `MovieFront/src/presentation/pages/collection/CollectionDetailPage.tsx` 中
  - 导入新的 Pagination 组件：`import { Pagination } from '@components/atoms'`
  - 在 BaseSection 组件下方添加 Pagination 组件
  - 配置 Pagination：mode="simple" 或 "full", variant="default", showPageInfo=true
  - 传递 currentPage, totalPages, onPageChange
  - 传递 pageInfo（total, pageSize）
  - 验证分页功能正常工作


  - _需求: 6.4, 6.7, 8.2_

- [ ] 14. 移除 CollectionMovieList 组件中的旧分页代码
  - 打开 `MovieFront/src/presentation/components/domains/collection/CollectionMovieList.tsx`
  - 删除第 129-183 行的分页 UI 代码
  - 删除组件内部的 `PaginationConfig` 接口定义
  - 删除 `renderPaginationButtons` 函数
  - 从 props 中移除 `pagination` 和 `showPagination` 配置
  - 移除分页相关的 JSX 渲染逻辑
  - 保留其他功能不变
  - _需求: 6.3, 6.4_




- [ ] 15. 统一分页类型定义
  - 搜索项目中所有使用 `PaginationConfig` 的地方
  - 将所有本地定义的 `PaginationConfig` 替换为导入 `@types/pagination` 中的统一类型
  - 更新 `MovieFront/src/infrastructure/api/interfaces/ICollectionApi.ts` 中的类型导入
  - 更新 `MovieFront/src/application/services/CollectionApplicationService.ts` 中的类型导入
  - 确保所有分页相关的类型定义统一
  - _需求: 1.3, 6.4_

- [ ] 16. 创建 Pagination 组件使用文档
  - 创建 `MovieFront/src/presentation/components/atoms/Pagination/README.md` 文件
  - 编写组件概述和功能说明
  - 提供基础用法示例
  - 提供完整配置示例
  - 提供服务端分页示例
  - 提供三种模式的使用示例（simple, full, compact）
  - 提供三种变体的使用示例（default, primary, ghost）
  - 说明 Props 接口的所有字段
  - 提供迁移指南（从旧实现迁移到新组件）
  - _需求: 9.1, 9.2, 9.5_

- [ ] 17. 验证和测试
  - 在浏览器中访问 `/special/collections` 页面
  - 验证分页器正常显示和工作
  - 测试页码点击功能
  - 测试上一页/下一页按钮
  - 测试第一页和最后一页的禁用状态
  - 在浏览器中访问 `/collection/:id` 页面
  - 验证分页器正常显示和工作
  - 测试不同屏幕尺寸下的响应式行为
  - 测试加载状态下的禁用效果
  - 验证分页信息显示正确
  - 验证样式与设计一致
  - _需求: 6.3, 6.6, 6.8_

- [ ] 18. 代码清理和优化
  - 移除项目中未使用的旧分页类型定义
  - 检查并移除未使用的导入
  - 优化组件性能（确保使用了 useMemo 和 useCallback）
  - 运行 ESLint 检查并修复问题
  - 运行 TypeScript 类型检查
  - 格式化代码（Prettier）
  - _需求: 6.4_

## 任务执行说明

1. **按顺序执行** - 任务按依赖关系排序，建议按顺序执行
2. **增量开发** - 每完成一个任务，确保代码可编译和运行
3. **测试驱动** - 工具函数应先编写测试，再实现功能
4. **代码审查** - 每个任务完成后进行代码审查
5. **文档同步** - 及时更新文档和注释

## 验收标准

- ✅ 所有任务完成并通过测试
- ✅ 旧的分页代码已完全移除
- ✅ 新的 Pagination 组件在所有使用场景中正常工作
- ✅ 类型定义统一且类型检查通过
- ✅ 代码符合项目规范（ESLint, Prettier）
- ✅ 文档完整且示例清晰
- ✅ 响应式行为在不同设备上表现良好
