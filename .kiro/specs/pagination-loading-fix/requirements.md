# Requirements Document

## Introduction

当前专题合集页面（`/special/collections`）在切换页码时存在用户体验问题：用户点击页码后，页面会先显示上一页的图片，然后逐个卡片地替换为新页面的内容。这种行为让用户感到困惑，不符合标准的分页加载体验。

正确的分页加载流程应该是：
1. 用户点击页码
2. 立即显示骨架屏（Skeleton）加载状态
3. 清空或隐藏旧数据
4. 获取新页面数据
5. 数据返回后，一次性渲染所有新卡片

本需求旨在修复这个分页加载体验问题，确保用户在切换页面时能看到清晰的加载反馈，而不是看到旧数据的残留和逐个替换的过程。

## Requirements

### Requirement 1: 页面切换时立即清空数据

**User Story:** 作为用户，当我点击页码切换页面时，我希望旧的内容立即消失，这样我就能清楚地知道系统正在加载新内容

#### Acceptance Criteria

1. WHEN 用户点击任意页码按钮 THEN 系统 SHALL 立即将当前显示的合集数据清空
2. WHEN 用户点击上一页或下一页按钮 THEN 系统 SHALL 立即将当前显示的合集数据清空
3. WHEN 数据被清空后 THEN 系统 SHALL 确保不会出现旧数据残留在页面上的情况

### Requirement 2: 显示加载状态指示器

**User Story:** 作为用户，当我切换页面时，我希望看到明确的加载指示器（骨架屏），这样我就知道系统正在处理我的请求

#### Acceptance Criteria

1. WHEN 页面数据被清空后 THEN 系统 SHALL 立即显示骨架屏加载状态
2. WHEN 显示骨架屏时 THEN 系统 SHALL 显示与实际内容布局一致的占位符（12个卡片）
3. WHEN 新数据加载完成后 THEN 系统 SHALL 隐藏骨架屏并显示实际内容
4. WHEN 骨架屏显示时 THEN 系统 SHALL 使用动画效果（如脉冲动画）提供视觉反馈

### Requirement 3: 一次性渲染新数据

**User Story:** 作为用户，当新页面的数据加载完成后，我希望所有卡片同时出现，而不是逐个加载，这样页面看起来更加流畅和专业

#### Acceptance Criteria

1. WHEN 新页面数据从服务器返回后 THEN 系统 SHALL 等待所有数据准备完毕后再渲染
2. WHEN 渲染新数据时 THEN 系统 SHALL 一次性显示所有卡片，而不是逐个替换
3. WHEN 数据渲染完成后 THEN 系统 SHALL 确保所有卡片的图片和内容都是新页面的数据

### Requirement 4: 保持页面滚动位置

**User Story:** 作为用户，当我切换页面时，我希望页面能自动滚动到内容区域的顶部，这样我就不需要手动滚动来查看新内容

#### Acceptance Criteria

1. WHEN 用户点击页码切换页面时 THEN 系统 SHALL 自动将页面滚动到内容区域顶部
2. WHEN 页面滚动时 THEN 系统 SHALL 使用平滑滚动效果提升用户体验
3. WHEN 滚动完成后 THEN 系统 SHALL 确保用户能看到新页面的第一行内容

### Requirement 5: 防止重复请求

**User Story:** 作为用户，当我快速连续点击页码时，我希望系统能正确处理我的操作，不会发送多余的请求或显示错误的数据

#### Acceptance Criteria

1. WHEN 用户在数据加载过程中点击其他页码 THEN 系统 SHALL 取消当前请求并开始新的请求
2. WHEN 用户快速连续点击同一页码 THEN 系统 SHALL 忽略重复的点击
3. WHEN 页面正在加载时 THEN 系统 SHALL 禁用所有分页按钮，防止用户误操作
4. WHEN 数据加载完成后 THEN 系统 SHALL 重新启用分页按钮

### Requirement 6: 防止 Hook 死循环

**User Story:** 作为开发者，我需要确保 `useSpecialCollections` hook 的实现不会因为依赖关系导致无限循环，这样系统才能稳定运行

#### Acceptance Criteria

1. WHEN `updateOptions` 被调用时 THEN 系统 SHALL 确保不会触发不必要的 `useEffect` 重新执行
2. WHEN `queryOptions` 对象更新时 THEN 系统 SHALL 使用深度比较或稳定的引用，避免因对象引用变化导致循环
3. WHEN `fetchCollections` 执行时 THEN 系统 SHALL 确保不会意外修改导致 `useEffect` 重新触发的依赖项
4. WHEN 页面切换时 THEN 系统 SHALL 使用 `useRef` 或其他机制跟踪请求状态，避免竞态条件
5. WHEN `setCollections([])` 清空数据时 THEN 系统 SHALL 确保这个操作不会触发额外的数据加载
6. WHEN 组件挂载时 THEN 系统 SHALL 只触发一次初始数据加载，不应该有多次请求

### Requirement 7: 错误处理

**User Story:** 作为用户，当页面切换失败时，我希望看到清晰的错误提示，并能够重试操作

#### Acceptance Criteria

1. WHEN 数据加载失败时 THEN 系统 SHALL 显示友好的错误提示信息
2. WHEN 显示错误提示时 THEN 系统 SHALL 提供"重试"按钮让用户重新加载
3. WHEN 用户点击重试按钮时 THEN 系统 SHALL 重新发起数据请求
4. WHEN 加载失败时 THEN 系统 SHALL 保持当前页码不变，不影响用户的导航状态
