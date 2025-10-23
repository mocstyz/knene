# Implementation Plan

- [x] 1. 修改 useSpecialCollections Hook 添加页面切换状态管理





  - 添加 `isPageChanging` 状态用于标识页面切换过程
  - 添加 `queryOptionsRef` 使用 useRef 存储稳定的查询参数引用
  - 添加 `abortControllerRef` 用于请求取消控制
  - 在返回值中导出 `isPageChanging` 状态
  - _Requirements: 1.1, 1.2, 6.4, 6.5_

- [x] 2. 重构 updateOptions 方法实现立即清空数据和防止死循环





  - 在方法开始时取消之前的请求（使用 abortControllerRef）
  - 检测是否是页面切换操作（page 参数变化）
  - 页面切换时立即设置 `isPageChanging=true` 并清空 collections
  - 筛选/排序变化时重置页码、设置 `isPageChanging=true` 并清空数据
  - 更新 `queryOptionsRef.current` 而不是触发 state 更新
  - 手动调用 `fetchCollectionsWithOptions` 触发数据加载
  - 移除 `queryOptions` 依赖，避免 useCallback 重新创建
  - _Requirements: 1.1, 1.2, 1.3, 5.1, 5.2, 6.1, 6.2, 6.5_

- [x] 3. 重构 fetchCollections 方法添加请求取消和状态管理





  - 重命名为 `fetchCollectionsWithOptions` 接收查询参数
  - 创建新的 AbortController 并存储到 ref
  - 在数据加载前设置 `loading=true` 和 `error=null`
  - 调用 applicationService 时传递 abort signal（如果支持）
  - 检查请求是否被取消，如果是则提前返回
  - 数据加载成功后更新 collections 和 currentPage
  - 在 finally 块中设置 `loading=false` 和 `isPageChanging=false`
  - 捕获 AbortError 并忽略，其他错误正常处理
  - 移除不必要的依赖，只保留必需的服务和工具函数
  - _Requirements: 1.3, 3.1, 3.2, 3.3, 5.1, 6.3, 6.4, 7.1_

- [x] 4. 简化 useEffect 避免死循环


  - 移除 `queryOptions` 依赖
  - 只在组件挂载时执行一次初始加载（空依赖数组）
  - 使用 `queryOptionsRef.current` 获取初始查询参数
  - _Requirements: 6.1, 6.2, 6.6_

- [x] 5. 更新 refresh 和 loadMore 方法


  - 修改 refresh 方法调用新的 `fetchCollectionsWithOptions`
  - 修改 loadMore 方法调用新的 `fetchCollectionsWithOptions`
  - 确保这些方法不会触发不必要的状态更新
  - _Requirements: 6.1, 7.3_

- [x] 6. 修改 CollectionList 组件接收和传递 isPageChanging 状态


  - 在 `CollectionListProps` 接口中添加 `isPageChanging?: boolean` 属性
  - 从 props 中解构 `isPageChanging` 参数
  - 将 `isPageChanging` 传递给 BaseList 组件
  - _Requirements: 2.1, 2.2_

- [x] 7. 修改 BaseList 组件优先显示骨架屏


  - 在 `BaseListProps` 接口中添加 `isPageChanging?: boolean` 属性
  - 修改骨架屏显示条件为 `isPageChanging || (loading && items.length === 0)`
  - 将骨架屏数量从 8 个改为 12 个，匹配实际每页显示数量
  - 确保骨架屏的宽高比与实际卡片一致（aspect-[3/4]）
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 8. 修改 SpecialCollectionsPage 组件处理页面切换


  - 从 useSpecialCollections 返回值中解构 `isPageChanging`
  - 将 `isPageChanging` 传递给 CollectionList 组件
  - 在 handlePageChange 中添加 `scrollToTop()` 调用
  - 实现 `scrollToTop` 函数使用平滑滚动到页面顶部
  - 修改错误处理的重试按钮调用 `refresh()` 而不是 `window.location.reload()`
  - _Requirements: 2.1, 4.1, 4.2, 4.3, 7.3_

- [x] 9. 添加分页按钮禁用状态



  - 在 CollectionList 组件中，当 `loading` 或 `isPageChanging` 为 true 时禁用所有分页按钮
  - 为禁用状态的按钮添加视觉反馈（降低透明度或改变光标样式）
  - 确保禁用状态不影响当前页码的高亮显示
  - _Requirements: 5.3, 5.4_

- [ ]* 10. 添加单元测试
  - 为 useSpecialCollections Hook 编写测试用例
  - 测试 isPageChanging 状态在页面切换时正确设置
  - 测试快速切换页面时请求取消机制
  - 测试不会触发无限循环
  - 为 BaseList 组件编写测试用例
  - 测试 isPageChanging 为 true 时显示骨架屏
  - 测试 loading 为 true 且无数据时显示骨架屏
  - 测试正常状态下显示数据
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ]* 11. 添加集成测试
  - 测试 SpecialCollectionsPage 页面切换流程
  - 测试点击页码后立即显示骨架屏
  - 测试数据加载完成后隐藏骨架屏并显示新数据
  - 测试页面切换时自动滚动到顶部
  - 测试快速连续点击页码的处理
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 5.1, 5.2_

- [ ]* 12. 性能测试和优化
  - 测试快速切换多个页面不会导致内存泄漏
  - 测试请求取消机制的有效性
  - 验证只有最新请求的数据会被应用
  - 测量页面切换的响应时间
  - _Requirements: 5.1, 6.3, 6.4_
