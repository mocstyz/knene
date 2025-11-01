# Implementation Plan

## Task List

- [x] 1. 重构 LoadingSpinner 组件


  - 更新 LoadingSpinner 组件接口，添加新的 props（text、color、fullscreen、overlay、speed、disableAnimation）
  - 优化尺寸系统，支持 xs/sm/md/lg/xl 五种尺寸
  - 实现全屏模式（fullscreen）和遮罩模式（overlay）
  - 添加主题支持（明暗模式自动切换）
  - 添加可访问性 ARIA 属性（role、aria-busy、aria-label）
  - 添加减少动画偏好检测（prefers-reduced-motion）
  - 实现带文本的 spinner 显示
  - 优化动画性能（使用 CSS transform）
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]* 1.1 编写 LoadingSpinner 组件单元测试
  - 测试默认 props 渲染
  - 测试所有尺寸变体
  - 测试 fullscreen 模式
  - 测试 overlay 模式
  - 测试带文本显示
  - 测试自定义颜色
  - 测试动画速度
  - 测试减少动画偏好
  - 测试 ARIA 属性
  - _Requirements: 9.3, 9.4, 10.1_



- [ ] 2. 创建 RouteLoader 组件
  - 创建 RouteLoader 组件文件
  - 实现延迟显示逻辑（默认 200ms）
  - 使用 LoadingSpinner 组件
  - 支持自定义延迟时间和文本
  - 添加可访问性支持
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ]* 2.1 编写 RouteLoader 组件单元测试
  - 测试延迟显示逻辑
  - 测试自定义延迟时间


  - 测试自定义文本
  - _Requirements: 10.3_

- [ ] 3. 更新 routes.tsx 使用 RouteLoader
  - 移除 routes.tsx 中的旧 LoadingSpinner 实现


  - 导入新的 RouteLoader 组件
  - 更新 SuspenseWrapper 使用 RouteLoader
  - 确保所有懒加载路由正常工作
  - _Requirements: 2.1, 4.1, 4.2, 4.3_

- [ ] 4. 更新 Button 组件使用统一 LoadingSpinner
  - 移除 Button 组件中的内联 SVG spinner 实现
  - 导入 LoadingSpinner 组件
  - 实现按钮尺寸到 spinner 尺寸的映射逻辑
  - 确保 spinner 颜色与按钮文本颜色一致
  - 确保 loading 状态下按钮被禁用
  - 优化 spinner 在按钮中的显示位置
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_



- [ ]* 4.1 更新 Button 组件测试
  - 测试 loading 状态显示 spinner
  - 测试 loading 状态按钮被禁用
  - 测试不同尺寸按钮的 spinner 尺寸
  - 测试 loading 优先于 icon 显示
  - _Requirements: 10.2_


- [ ] 5. 更新 ProtectedRoute 组件
  - 导入 LoadingSpinner 组件
  - 移除旧的 loading 实现
  - 使用 LoadingSpinner fullscreen 模式
  - 添加"正在验证身份..."文本
  - 确保验证失败时正确重定向

  - _Requirements: 5.1, 5.4, 5.5, 5.6_

- [ ] 6. 更新 GuestRoute 组件
  - 导入 LoadingSpinner 组件
  - 移除旧的 loading 实现
  - 使用 LoadingSpinner fullscreen 模式
  - 添加"正在检查登录状态..."文本
  - 确保已登录时正确重定向
  - _Requirements: 5.2, 5.4, 5.5, 5.6_

- [ ] 7. 更新 AdminRoute 组件
  - 导入 LoadingSpinner 组件
  - 移除旧的 loading 实现
  - 使用 LoadingSpinner fullscreen 模式


  - 添加"正在验证管理员权限..."文本
  - 确保非管理员时正确重定向
  - _Requirements: 5.3, 5.4, 5.5, 5.6_



- [ ]* 7.1 编写权限验证组件集成测试
  - 测试 ProtectedRoute 的 loading 状态
  - 测试 GuestRoute 的 loading 状态
  - 测试 AdminRoute 的 loading 状态


  - 测试验证完成后的重定向
  - _Requirements: 10.4_

- [ ] 8. 更新 SettingsPage 使用统一 LoadingSpinner
  - 导入 LoadingSpinner 组件

  - 更新用户加载状态使用 LoadingSpinner fullscreen 模式

  - 添加"加载用户设置..."文本
  - _Requirements: 6.4_

- [x] 9. 更新 DashboardPage 使用统一 LoadingSpinner

  - 检查 DashboardPage 中的 loading 状态实现

  - 移除使用 Icon 的 loading 动画
  - 使用统一的 LoadingSpinner 组件
  - _Requirements: 2.3, 6.4_

- [ ] 10. 检查并更新其他使用 spinner 的地方
  - 使用 grep 搜索项目中所有的 spinner 相关代码
  - 识别所有需要更新的文件
  - 逐个更新为使用统一的 LoadingSpinner
  - 确保没有遗漏的重复实现
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 11. 清理重复的 spinner 样式定义
  - 检查 styles.ts 中的 spinner 相关样式
  - 保留必要的样式类（如 animate-spin）
  - 移除重复的 spinner 样式定义
  - 确保不影响现有功能


  - _Requirements: 2.4_


- [ ] 12. 创建加载状态使用文档
  - 创建 LOADING_STATES.md 文档
  - 编写使用场景决策树
  - 编写骨架屏 vs spinner 的对比说明
  - 编写 LoadingSpinner API 文档
  - 编写 RouteLoader API 文档
  - 提供最佳实践和示例代码
  - 添加常见问题解答
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 8.1, 8.2, 8.3, 8.4, 8.5_


- [ ]* 13. 更新 Storybook 文档
  - 创建 LoadingSpinner 的 Storybook stories
  - 创建 RouteLoader 的 Storybook stories
  - 展示所有尺寸变体
  - 展示 fullscreen 和 overlay 模式
  - 展示带文本的示例
  - 展示在不同主题下的效果
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 14. 验证和测试
  - 在开发环境中测试所有更新的页面
  - 验证路由切换的 loading 状态
  - 验证权限验证的 loading 状态
  - 验证按钮的 loading 状态
  - 测试明暗主题切换
  - 测试响应式布局
  - 测试可访问性（屏幕阅读器）
  - 测试减少动画偏好
  - 检查性能（动画流畅度）
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 15. 代码审查和优化
  - 审查所有修改的代码
  - 确保代码风格一致
  - 优化性能瓶颈
  - 确保没有遗留的旧代码
  - 更新相关注释和文档
  - _Requirements: 所有需求_
