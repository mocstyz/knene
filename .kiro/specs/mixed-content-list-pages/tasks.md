# Implementation Plan

- [x] 1. 创建应用层数据管理Hooks


  - 创建useLatestUpdateList和useHotList两个Hook，负责数据获取、状态管理和分页逻辑
  - 参考usePhotoList的实现模式，使用TanStack Query进行数据缓存
  - 返回BaseContentItem[]格式的统一数据，支持loading、error、refresh等状态
  - _Requirements: 1.4, 2.4, 5.7_



- [x] 1.1 实现useLatestUpdateList Hook

  - 在MovieFront/src/application/hooks/目录下创建useLatestUpdateList.ts文件
  - 实现分页、排序、自动加载等配置选项
  - 使用TanStack Query管理数据获取和缓存
  - 提供updateOptions方法支持动态更新配置
  - 返回BaseContentItem[]格式的数据，包含id、title、imageUrl、contentType等字段
  - _Requirements: 1.4, 5.7_

- [x] 1.2 实现useHotList Hook


  - 在MovieFront/src/application/hooks/目录下创建useHotList.ts文件
  - 实现分页、时间周期筛选（7days）、自动加载等配置
  - 使用TanStack Query管理数据获取和缓存
  - 提供updateOptions方法支持动态更新配置
  - 返回BaseContentItem[]格式的数据
  - _Requirements: 2.4, 5.7_

- [x] 1.3 在application/hooks/index.ts中导出新Hook


  - 使用相对路径导出useLatestUpdateList和useHotList
  - 确保符合index.ts导出规范
  - _Requirements: 5.5_

- [x] 2. 创建最新更新列表页面组件


  - 创建LatestUpdateListPage组件，展示所有最新更新的混合内容
  - 复用PhotoListPage的布局结构，包括导航栏、标题区域、内容列表和分页器
  - 使用MixedContentList组件支持混合内容类型渲染
  - 实现分页切换和平滑滚动功能
  - _Requirements: 1.1, 1.2, 1.3, 3.1, 5.1, 5.2, 5.3, 5.4, 5.6_

- [x] 2.1 创建LatestUpdateListPage.tsx文件


  - 在MovieFront/src/presentation/pages/目录下创建latestupdate文件夹
  - 创建LatestUpdateListPage.tsx文件，添加标准文件头注释
  - 实现页面基础结构：导航栏、主容器、标题区域
  - _Requirements: 1.2, 5.2, 5.6_

- [x] 2.2 实现数据获取和状态管理

  - 使用useLatestUpdateList Hook获取数据
  - 管理currentPage状态和分页逻辑
  - 实现handlePageChange处理分页切换
  - 实现scrollToTop平滑滚动功能
  - _Requirements: 1.4, 1.6_

- [x] 2.3 实现内容列表渲染

  - 使用MixedContentList组件渲染混合内容
  - 配置响应式列数（使用RESPONSIVE_CONFIGS.latestUpdate）
  - 配置卡片样式（hoverEffect、aspectRatio、各种badge显示）
  - 实现handleContentClick处理内容点击，使用navigateToContentDetail进行导航
  - _Requirements: 1.3, 1.5, 3.2, 3.3, 3.4, 5.5_

- [x] 2.4 实现分页器和错误处理

  - 添加Pagination组件，配置mode、variant、size等属性
  - 实现错误状态UI，显示错误信息和重新加载按钮
  - 实现加载状态处理
  - _Requirements: 1.6, 1.7_

- [x] 3. 创建7天最热门列表页面组件


  - 创建HotListPage组件，展示7天内最热门的混合内容
  - 与LatestUpdateListPage结构相同，仅数据源和标题不同
  - 使用MixedContentList组件支持混合内容类型渲染
  - 实现分页切换和平滑滚动功能
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 5.1, 5.2, 5.3, 5.4, 5.6_

- [x] 3.1 创建HotListPage.tsx文件


  - 在MovieFront/src/presentation/pages/目录下创建hot文件夹
  - 创建HotListPage.tsx文件，添加标准文件头注释
  - 实现页面基础结构：导航栏、主容器、标题区域（标题为"7天最热门"）
  - _Requirements: 2.2, 5.2, 5.6_

- [x] 3.2 实现数据获取和状态管理

  - 使用useHotList Hook获取数据（period设置为'7days'）
  - 管理currentPage状态和分页逻辑
  - 实现handlePageChange处理分页切换
  - 实现scrollToTop平滑滚动功能
  - _Requirements: 2.4, 2.6_

- [x] 3.3 实现内容列表渲染

  - 使用MixedContentList组件渲染混合内容
  - 配置响应式列数（使用RESPONSIVE_CONFIGS.hot）
  - 配置卡片样式（与最新更新页面相同的配置）
  - 实现handleContentClick处理内容点击，使用navigateToContentDetail进行导航
  - _Requirements: 2.3, 2.5, 3.2, 3.3, 3.4, 5.5_

- [x] 3.4 实现分页器和错误处理

  - 添加Pagination组件，配置与最新更新页面相同
  - 实现错误状态UI，显示错误信息和重新加载按钮
  - 实现加载状态处理
  - _Requirements: 2.6, 2.7_

- [x] 4. 配置路由和导航


  - 在路由配置中添加两个新页面的路由
  - 更新ROUTES常量添加新路由路径
  - 更新首页模块的"更多"链接指向新页面
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.5_

- [x] 4.1 更新路由配置文件


  - 在MovieFront/src/presentation/router/routes.tsx中添加路由配置
  - 使用React.lazy懒加载LatestUpdateListPage和HotListPage
  - 添加路由路径：/latest-updates 和 /hot-weekly
  - 使用SuspenseWrapper包裹页面组件
  - _Requirements: 4.1, 4.2_

- [x] 4.2 更新ROUTES常量


  - 在routes.tsx的ROUTES对象中添加LATEST_UPDATE和HOT路由常量
  - 格式：LATEST_UPDATE: { LIST: '/latest-updates' }
  - 格式：HOT: { LIST: '/hot-weekly' }
  - _Requirements: 4.1, 4.2_

- [x] 4.3 更新首页最新更新模块链接


  - 在HomePage.tsx中更新LatestUpdateSection的moreLinkUrl属性
  - 使用ROUTES.LATEST_UPDATE.LIST作为链接地址
  - _Requirements: 4.3, 5.5_

- [x] 4.4 更新首页热门模块链接


  - 在HomePage.tsx中更新HotSection组件
  - 添加moreLinkUrl属性，使用ROUTES.HOT.LIST作为链接地址
  - 确保showViewMore属性为true
  - _Requirements: 4.4, 5.5_

- [x] 5. 代码质量检查和优化



  - 检查所有代码是否符合CLAUDE.md规范
  - 验证注释格式和内容
  - 检查导入路径是否使用@别名
  - 测试页面功能和交互
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 5.1 代码规范检查


  - 检查所有文件头注释是否符合JSDoc格式
  - 检查函数和组件注释是否使用单行注释
  - 确认没有对参数、字段、属性添加注释
  - 验证所有导入使用@别名而非相对路径
  - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [x] 5.2 功能测试


  - 测试从首页点击"更多"按钮跳转到列表页面
  - 测试列表页面的数据加载和渲染
  - 测试分页切换功能和平滑滚动
  - 测试点击内容卡片跳转到详情页面
  - 测试错误状态和重新加载功能
  - _Requirements: 1.1, 1.5, 1.6, 1.7, 2.1, 2.5, 2.6, 2.7_

- [x] 5.3 样式一致性检查

  - 验证页面布局与PhotoListPage一致
  - 验证卡片样式与首页模块一致
  - 测试响应式布局在不同屏幕尺寸下的表现
  - 测试亮色/暗色主题切换
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 5.4 使用Chrome DevTools检查错误


  - 使用chrome devtools mcp工具查看页面内容
  - 检查控制台是否有错误或警告
  - 验证网络请求是否正常
  - 检查页面性能和加载速度
  - 如有错误立即修复
  - _Requirements: 5.1_
