# Requirements Document

## Introduction

本需求文档定义了影片详情页面的功能需求。该页面是用户从合集详情页面点击影片卡片后跳转的目标页面，展示影片的完整信息，包括海报、基本信息、评分、剧情简介、演员阵容、下载链接、文件信息、影片截图和用户评论等内容。页面需要100%还原HTML设计稿的视觉效果，并严格遵循项目的DDD架构和开发规范。

## Requirements

### Requirement 1: 页面路由和参数处理

**User Story:** 作为用户，我希望通过URL访问特定影片的详情页面，以便查看该影片的完整信息。

#### Acceptance Criteria

1. WHEN 用户访问 `/movie/:movieId` 路径 THEN 系统应该加载对应ID的影片详情页面
2. WHEN URL中的movieId参数无效或不存在 THEN 系统应该显示404错误页面
3. WHEN 页面加载时 THEN 系统应该从URL参数中提取movieId并获取影片数据
4. WHEN 影片数据加载失败 THEN 系统应该显示友好的错误提示信息

### Requirement 2: Hero区域展示

**User Story:** 作为用户，我希望在页面顶部看到影片的主要信息和视觉效果，以便快速了解影片概况。

#### Acceptance Criteria

1. WHEN 页面加载完成 THEN 系统应该在Hero区域显示模糊背景图（使用影片海报）
2. WHEN Hero区域渲染 THEN 系统应该显示影片海报（2:3宽高比，响应式尺寸）
3. WHEN Hero区域渲染 THEN 系统应该显示影片标题、年份、评分、星级、投票数
4. WHEN Hero区域渲染 THEN 系统应该显示剧情简介和主演信息
5. WHEN Hero区域渲染 THEN 系统应该显示三个操作按钮：下载、下载字幕、谢谢你
6. WHEN 用户点击"下载"按钮 THEN 系统应该触发下载功能
7. WHEN 用户点击"下载字幕"按钮 THEN 系统应该打开字幕下载源选择弹窗
8. WHEN 用户点击"谢谢你"按钮 THEN 系统应该增加感谢计数并更新UI显示

### Requirement 3: 资源信息卡片展示

**User Story:** 作为用户，我希望看到详细的资源信息，以便了解下载文件的具体内容和质量。

#### Acceptance Criteria

1. WHEN 页面加载完成 THEN 系统应该在资源信息区域显示资源标题
2. WHEN 资源信息渲染 THEN 系统应该显示所有相关标签（特效字幕、DIY、首发、中字、国配、高码、合集等）
3. WHEN 资源信息渲染 THEN 系统应该显示统计数据（浏览量、下载量、点赞数、点踩数）
4. WHEN 资源信息渲染 THEN 系统应该显示上传者信息和上传时间
5. WHEN 资源信息渲染 THEN 系统应该显示收藏和举报按钮
6. WHEN 用户点击收藏按钮 THEN 系统应该切换收藏状态并更新图标
7. WHEN 用户点击举报按钮 THEN 系统应该打开举报对话框

### Requirement 4: 文件信息展示

**User Story:** 作为用户，我希望看到文件的技术规格信息，以便判断文件是否符合我的需求。

#### Acceptance Criteria

1. WHEN 页面加载完成 THEN 系统应该显示文件格式、大小、时长信息
2. WHEN 文件信息渲染 THEN 系统应该显示视频编码、分辨率、帧率信息
3. WHEN 文件信息渲染 THEN 系统应该显示音频编码、声道、采样率信息
4. WHEN 文件信息渲染 THEN 系统应该显示所有可用字幕语言列表
5. WHEN 字幕列表渲染 THEN 系统应该高亮显示中文字幕（红色背景）
6. WHEN 文件信息渲染 THEN 系统应该使用响应式网格布局（移动端1列，平板2列，桌面3列）

### Requirement 5: 影片截图展示

**User Story:** 作为用户，我希望看到影片的截图预览，以便了解影片的画质和内容。

#### Acceptance Criteria

1. WHEN 页面加载完成 THEN 系统应该显示影片截图网格
2. WHEN 截图网格渲染 THEN 系统应该使用响应式布局（移动端1列，平板2列，桌面3列）
3. WHEN 截图加载 THEN 系统应该显示加载占位符
4. WHEN 截图加载失败 THEN 系统应该显示默认占位图
5. WHEN 用户点击截图 THEN 系统应该打开大图预览（可选功能）

### Requirement 6: 评论系统

**User Story:** 作为用户，我希望能够查看和发表评论，以便与其他用户交流观影体验。

#### Acceptance Criteria

1. WHEN 页面加载完成 THEN 系统应该显示评论输入框和发表按钮
2. WHEN 用户输入评论内容 THEN 系统应该实时更新字符计数
3. WHEN 用户点击"发表评论"按钮 AND 评论内容不为空 THEN 系统应该提交评论
4. WHEN 评论提交成功 THEN 系统应该清空输入框并刷新评论列表
5. WHEN 页面加载完成 THEN 系统应该显示现有评论列表（按时间倒序）
6. WHEN 评论列表渲染 THEN 系统应该显示每条评论的用户头像、用户名、发表时间、内容
7. WHEN 评论列表渲染 THEN 系统应该显示点赞、点踩、回复按钮
8. WHEN 评论有回复 THEN 系统应该以嵌套形式显示回复内容（支持多级嵌套）
9. WHEN 用户点击回复按钮 THEN 系统应该展开回复输入框
10. WHEN 用户提交回复 THEN 系统应该将回复添加到对应评论下方

### Requirement 7: 字幕下载弹窗

**User Story:** 作为用户，我希望能够选择不同的字幕下载源，以便获取所需的字幕文件。

#### Acceptance Criteria

1. WHEN 用户点击"下载字幕"按钮 THEN 系统应该打开字幕下载源选择弹窗
2. WHEN 弹窗打开 THEN 系统应该显示多个字幕下载源选项（SubHD、字幕库、OpenSubtitles、字幕天堂）
3. WHEN 弹窗打开 THEN 系统应该显示每个下载源的名称和简短描述
4. WHEN 用户点击某个下载源 THEN 系统应该在新标签页打开对应的字幕网站
5. WHEN 用户点击关闭按钮或弹窗外部区域 THEN 系统应该关闭弹窗
6. WHEN 弹窗关闭 THEN 系统应该恢复页面滚动功能

### Requirement 8: 响应式设计

**User Story:** 作为用户，我希望在不同设备上都能获得良好的浏览体验，以便随时随地查看影片信息。

#### Acceptance Criteria

1. WHEN 用户在移动设备访问 THEN Hero区域应该使用单列布局（海报和信息垂直排列）
2. WHEN 用户在平板设备访问 THEN Hero区域应该使用双列布局（海报和信息水平排列）
3. WHEN 用户在桌面设备访问 THEN Hero区域应该使用优化的宽屏布局
4. WHEN 屏幕宽度变化 THEN 文件信息网格应该自动调整列数（1-3列）
5. WHEN 屏幕宽度变化 THEN 截图网格应该自动调整列数（1-3列）
6. WHEN 用户在移动设备访问 THEN 操作按钮应该堆叠显示或使用更小的尺寸

### Requirement 9: 主题支持

**User Story:** 作为用户，我希望页面支持深色和浅色主题，以便在不同环境下获得舒适的阅读体验。

#### Acceptance Criteria

1. WHEN 系统主题为浅色模式 THEN 页面应该使用浅色背景和深色文字
2. WHEN 系统主题为深色模式 THEN 页面应该使用深色背景和浅色文字
3. WHEN 主题切换 THEN 所有UI元素应该平滑过渡到新主题
4. WHEN 主题切换 THEN Hero区域的渐变遮罩应该适配当前主题
5. WHEN 主题切换 THEN 卡片背景应该使用半透明效果和背景模糊

### Requirement 10: 性能优化

**User Story:** 作为用户，我希望页面加载速度快且流畅，以便快速获取所需信息。

#### Acceptance Criteria

1. WHEN 页面首次加载 THEN 系统应该显示骨架屏加载状态
2. WHEN 图片加载 THEN 系统应该使用懒加载技术
3. WHEN 大图加载 THEN 系统应该先显示模糊占位图
4. WHEN 用户滚动页面 THEN 系统应该按需加载可视区域的内容
5. WHEN 数据获取失败 THEN 系统应该使用缓存数据（如果可用）

### Requirement 11: 代码规范遵循

**User Story:** 作为开发者，我希望代码严格遵循项目规范，以便保持代码质量和可维护性。

#### Acceptance Criteria

1. WHEN 编写代码 THEN 必须使用@别名导入，禁止相对路径
2. WHEN 编写代码 THEN 必须遵循DDD架构分层（表现层、应用层、领域层、基础设施层）
3. WHEN 编写代码 THEN 必须使用JSDoc中文注释（文件头、组件、函数）
4. WHEN 编写代码 THEN 必须遵循命名优先于注释原则，简单逻辑不注释
5. WHEN 编写代码 THEN 必须使用Tailwind CSS + Radix UI，禁止其他样式方案
6. WHEN 编写代码 THEN 必须最大化复用现有组件和样式
7. WHEN 编写代码 THEN 必须使用TypeScript严格类型检查
8. WHEN 代码完成 THEN 必须使用Chrome DevTools MCP工具检查页面错误
