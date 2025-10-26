# Implementation Plan

本实施计划将需求和设计转化为具体的编码任务，按照从数据源到UI的顺序逐步实现VIP数据流和标签系统的重构。每个任务都是可执行的、可测试的，并且引用了相关的需求。

## 任务列表

- [x] 1. 重构MockDataService以直接生成最终格式数据






  - 移除Domain Entity生成逻辑，直接生成CollectionItem、PhotoItem、MovieItem格式
  - 实现基于业务规则的固定数据生成（VIP、NEW、质量标签）
  - 保留统计字段的随机生成
  - _Requirements: 1.2, 1.3, 3.1, 3.2_



- [x] 1.1 更新generateMockCollections方法


  - 修改方法签名，返回类型改为CollectionItem[]
  - 移除Collection实体创建逻辑
  - 直接构造CollectionItem对象，包含所有必需字段
  - 实现isVip固定为true的业务规则
  - 实现isNew基于24小时内发布时间的计算
  - 保留viewCount、downloadCount、likeCount、favoriteCount的随机生成
  - _Requirements: 1.2, 3.1, 3.2, 4.1_


- [x] 1.2 更新generateMockMovies方法

  - 修改方法签名，返回类型改为MovieItem[]
  - 移除Movie实体创建逻辑
  - 直接构造MovieItem对象，包含所有必需字段
  - 实现isVip基于索引的业务规则（每3个中有1个是VIP）
  - 实现isNew基于24小时内发布时间的计算
  - 实现quality基于索引的固定值（4K、HD、1080P、720P循环）
  - 保留统计字段的随机生成
  - _Requirements: 1.2, 3.1, 3.2, 6.1, 6.3_


- [x] 1.3 更新generateMockPhotos方法

  - 修改方法签名，返回类型改为PhotoItem[]
  - 移除Photo实体创建逻辑
  - 直接构造PhotoItem对象，包含所有必需字段
  - 实现isVip固定为true的业务规则
  - 实现isNew基于24小时内发布时间的计算
  - 实现quality和formatType基于索引的固定值
  - 保留统计字段的随机生成
  - _Requirements: 1.2, 3.1, 3.2, 5.1_


- [x] 1.4 更新getMockLatestUpdates方法

  - 修改方法直接使用generateMockMovies、generateMockPhotos、generateMockCollections
  - 移除ContentTransformationService的转换调用
  - 直接合并三种类型的数据并按发布时间排序
  - 确保返回的LatestItem[]包含正确的contentType字段
  - _Requirements: 1.3, 7.1, 7.2, 7.3_


- [x] 1.5 更新getMockWeeklyHot方法

  - 修改方法直接使用generateMockMovies、generateMockPhotos、generateMockCollections
  - 移除ContentTransformationService的转换调用
  - 实现热度分数计算逻辑（viewCount * 1 + likeCount * 5 + favoriteCount * 10）
  - 按热度排序并返回HotItem[]
  - _Requirements: 1.3, 7.4_


- [x] 1.6 更新getMockCollectionMovies方法

  - 修改方法为合集中的所有影片设置isVip为true
  - 确保影片数据继承合集的VIP状态
  - 添加注释说明VIP状态继承逻辑
  - _Requirements: 4.6_

- [x] 2. 移除ContentTransformationService及相关转换逻辑


  - 删除ContentTransformationService文件
  - 更新所有引用该服务的文件
  - 确保数据流不再经过转换层
  - _Requirements: 1.3, 9.1, 9.2_

- [x] 2.1 更新HomeRepository移除转换调用


  - 移除ContentTransformationService的import
  - 移除所有transform方法调用
  - 直接返回MockDataService生成的数据
  - 更新getHomeData、getCollections、getPhotos等方法
  - _Requirements: 1.3, 9.1_


- [x] 2.2 更新HomeApplicationService移除转换逻辑

  - 确认ApplicationService不再调用转换方法
  - 直接传递Repository返回的数据
  - 验证数据结构完整性
  - _Requirements: 1.3, 9.2_

- [x] 2.3 删除ContentTransformationService文件


  - 删除ContentTransformationService.ts文件
  - 更新index.ts移除相关导出
  - 确认没有其他文件引用该服务
  - _Requirements: 1.3_

- [x] 3. 增强类型系统确保数据完整性



  - 更新BaseContentItem接口，isVip改为必填
  - 更新CollectionItem和PhotoItem接口，isVip类型级别强制为true
  - 添加类型守卫函数验证数据完整性
  - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [x] 3.1 更新movie.types.ts中的接口定义


  - 修改BaseContentItem接口，isVip字段改为boolean（必填）
  - 修改CollectionItem接口，isVip类型设置为true（字面量类型）
  - 修改PhotoItem接口，isVip类型设置为true（字面量类型）
  - 确保MovieItem接口的isVip为boolean类型
  - _Requirements: 15.1, 15.2_

- [x] 3.2 添加类型守卫函数


  - 创建isValidCollectionItem函数，验证CollectionItem的完整性
  - 创建isValidPhotoItem函数，验证PhotoItem的完整性
  - 创建isValidMovieItem函数，验证MovieItem的完整性
  - 在类型守卫中检查isVip、isNew、quality等关键字段
  - _Requirements: 15.1, 15.2, 15.3_

- [x] 4. 更新Content Renderer实现标签显示业务规则


  - 更新CollectionContentRenderer强制显示VIP标签
  - 更新PhotoContentRenderer强制显示VIP标签
  - 更新MovieContentRenderer根据isVip字段决定VIP标签显示
  - 实现每种内容类型的标签显示规则
  - _Requirements: 8.1, 8.2, 8.3, 10.3, 10.4, 10.5_

- [x] 4.1 更新CollectionContentRenderer


  - 修改render方法，强制showVipBadge为true
  - 实现NEW标签根据isNew字段显示
  - 确保不显示质量标签和评分标签
  - 添加注释说明合集的标签显示规则
  - _Requirements: 8.2, 10.3_


- [x] 4.2 更新PhotoContentRenderer

  - 修改render方法，强制showVipBadge为true
  - 实现NEW标签根据isNew字段显示
  - 实现质量标签根据quality字段显示
  - 确保不显示评分标签
  - 添加注释说明写真的标签显示规则
  - _Requirements: 8.1, 10.4, 13.4_

- [x] 4.3 更新MovieContentRenderer


  - 修改render方法，根据item.isVip和config.showVipBadge决定VIP标签显示
  - 实现NEW标签根据isNew字段显示
  - 实现质量标签根据quality字段显示
  - 实现评分标签根据rating字段显示
  - 添加注释说明影片的标签显示规则
  - _Requirements: 8.3, 10.5, 13.1, 14.4_

- [x] 5. 重构MovieLayer组件移除硬编码


  - 移除所有硬编码的isVip、isNew、quality值
  - 完全依赖传入的props决定标签显示
  - 更新VipBadgeLayer、NewBadgeLayer、QualityBadgeLayer、RatingBadgeLayer的使用
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 5.1 更新MovieLayer的VipBadgeLayer使用


  - 移除硬编码的isVip={true}
  - 改为使用showVipBadge prop控制显示
  - 确保VipBadgeLayer只在showVipBadge为true时渲染
  - _Requirements: 2.4, 10.1_

- [x] 5.2 更新MovieLayer的NewBadgeLayer使用

  - 确保NewBadgeLayer根据showNewBadge和isNew决定显示
  - 使用newBadgeType prop控制NEW标签样式
  - 移除任何硬编码的isNew值
  - _Requirements: 2.1, 12.1, 12.2, 12.3_


- [x] 5.3 更新MovieLayer的QualityBadgeLayer使用

  - 确保QualityBadgeLayer根据showQualityBadge和qualityText决定显示
  - 移除任何硬编码的quality值
  - 只在qualityText有值时显示质量标签
  - _Requirements: 2.1, 13.1, 13.2_



- [x] 5.4 更新MovieLayer的RatingBadgeLayer使用


  - 确保RatingBadgeLayer根据showRatingBadge和rating决定显示
  - 移除任何硬编码的rating值
  - 只在rating有值且大于0时显示评分标签
  - _Requirements: 2.1, 14.1, 14.2_


- [x] 6. 实现合集影片列表的VIP继承逻辑

  - 在合集影片列表页面加载数据时，为所有影片设置isVip为true
  - 确保合集影片列表的所有卡片显示VIP标签
  - 确保从合集影片列表进入的详情页显示VIP专属样式
  - _Requirements: 4.3, 4.4, 4.5, 4.6_

- [x] 6.1 更新合集影片列表数据加载逻辑

  - 在getMockCollectionMovies方法中，为所有返回的影片设置isVip为true
  - 确保影片数据继承合集的VIP状态
  - 添加注释说明VIP状态继承逻辑
  - _Requirements: 4.6_

- [x] 6.2 验证合集影片列表的VIP标签显示

  - 确保列表页面的所有影片卡片显示VIP标签
  - 测试从合集进入影片列表的完整流程
  - 验证VIP标签在整个链路中的一致性
  - _Requirements: 4.3, 4.5_

- [x] 7. 实现详情页VIP样式系统





  - 创建DetailPageVipStyle组件
  - 更新影片详情页使用VIP样式
  - 更新写真详情页使用VIP样式
  - 更新合集详情页使用VIP样式
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_


- [x] 7.1 创建DetailPageVipStyle组件



  - 创建新组件接受isVip和children props
  - 实现VIP样式的条件渲染逻辑
  - 添加金色渐变VIP下载按钮组件
  - 添加资源信息标题后的金色渐变VIP标签组件
  - _Requirements: 11.3, 11.4_


- [x] 7.2 更新影片详情页

  - 使用DetailPageVipStyle包装详情页内容
  - 根据movie.isVip传递isVip prop
  - 确保VIP影片显示金色渐变下载按钮和VIP标签
  - 确保普通影片显示绿色下载按钮，无VIP标签
  - _Requirements: 11.1, 11.5, 6.2, 6.5_


- [x] 7.3 更新写真详情页

  - 使用DetailPageVipStyle包装详情页内容
  - 固定传递isVip={true}（所有写真都是VIP）
  - 确保显示金色渐变下载按钮和VIP标签
  - _Requirements: 11.2, 11.5, 5.3_

- [x] 7.4 更新合集详情页


  - 使用DetailPageVipStyle包装详情页内容
  - 固定传递isVip={true}（所有合集都是VIP）
  - 确保合集中的影片也显示VIP样式
  - _Requirements: 11.1, 11.5_

- [x] 8. 验证数据流完整性


  - 添加数据验证函数在关键节点
  - 实现数据完整性检查
  - 添加错误处理和回退逻辑
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_


- [x] 8.1 在Repository层添加数据验证

  - 创建validateContentItem函数
  - 在getHomeData方法中验证返回的数据
  - 添加console.warn记录缺失字段
  - 实现数据缺失时的回退逻辑
  - _Requirements: 9.1, 9.5_

- [x] 8.2 在Content Renderer中添加数据验证


  - 在每个渲染器的render方法中调用validateItem
  - 记录验证错误和警告
  - 实现数据不完整时的回退渲染
  - _Requirements: 9.4_

- [x] 9. 更新配置系统支持灵活的标签控制


  - 确保UnifiedCardConfig支持独立控制每个标签
  - 实现配置与数据源规则的优先级逻辑
  - 添加默认配置创建函数
  - _Requirements: 16.1, 16.2, 16.3, 16.4_

- [x] 9.1 更新UnifiedCardConfig接口


  - 确认接口包含showVipBadge、showNewBadge、showQualityBadge、showRatingBadge
  - 添加详细的注释说明每个配置项的作用
  - 确保所有配置项都是可选的boolean类型
  - _Requirements: 16.1_

- [x] 9.2 实现配置优先级逻辑


  - 在Content Renderer中实现配置与数据源规则的优先级
  - 对于合集和写真，VIP标签强制显示，忽略配置
  - 对于影片，VIP标签根据配置和数据源共同决定
  - 添加注释说明优先级规则
  - _Requirements: 16.2, 16.3_


- [x] 9.3 创建默认配置函数

  - 创建createDefaultCardConfig函数
  - 默认所有标签都启用（showXxxBadge: true）
  - 支持通过参数覆盖默认值
  - _Requirements: 16.4_

- [x] 10. 编写单元测试

  - 测试MockDataService的数据生成逻辑
  - 测试Content Renderer的标签显示规则
  - 测试类型守卫函数
  - _Requirements: 所有需求_

- [x] 10.1 测试MockDataService的VIP状态生成


  - 测试所有合集的isVip为true
  - 测试所有写真的isVip为true
  - 测试影片的isVip根据索引决定（每3个中有1个）
  - 测试合集影片列表的VIP继承逻辑
  - _Requirements: 1.2, 3.2, 4.1, 4.6, 5.1_



- [ ] 10.2 测试MockDataService的NEW标签生成
  - 测试只有24小时内的内容isNew为true
  - 测试isNew字段的计算逻辑
  - 测试newType字段的设置


  - _Requirements: 3.2, 12.4_

- [ ] 10.3 测试MockDataService的随机数据
  - 测试统计字段（viewCount、downloadCount等）是随机的


  - 测试业务字段（isVip、quality等）是固定的
  - 验证相同索引生成的数据业务字段一致
  - _Requirements: 3.1, 3.3_


- [ ] 10.4 测试Content Renderer的标签显示规则
  - 测试CollectionContentRenderer强制显示VIP标签
  - 测试PhotoContentRenderer强制显示VIP标签
  - 测试MovieContentRenderer根据数据源决定VIP标签
  - 测试每种类型的其他标签显示规则
  - _Requirements: 8.1, 8.2, 8.3, 10.3, 10.4, 10.5_



- [ ] 11. 编写集成测试
  - 测试从MockDataService到UI的完整数据流
  - 验证数据在各层之间传递时的完整性
  - 测试标签显示的端到端流程


  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 11.1 测试完整数据流
  - 从MockDataService生成数据
  - 通过Repository获取数据
  - 通过ApplicationService传递数据
  - 验证最终数据包含所有必需字段
  - _Requirements: 9.1, 9.2, 9.3_

- [-] 11.2 测试数据完整性

  - 验证isVip字段在整个流程中不丢失
  - 验证isNew、quality、rating等字段的完整性
  - 测试数据转换后的字段映射正确性
  - _Requirements: 9.4, 9.5_

- [x] 12. 执行E2E测试


  - 测试合集卡片显示VIP标签
  - 测试写真卡片显示VIP标签
  - 测试影片卡片VIP标签根据数据显示
  - 测试详情页VIP样式与列表页一致
  - _Requirements: 4.1, 5.1, 6.3, 11.1, 11.2_

- [x] 12.1 测试合集完整链路

  - 访问首页，验证合集卡片显示VIP标签
  - 点击合集卡片进入合集影片列表页，验证所有影片卡片显示VIP标签
  - 点击任意影片卡片进入详情页，验证金色渐变VIP样式
  - 验证详情页的金色渐变VIP下载按钮和资源信息VIP标签
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 11.1_


- [ ] 12.2 测试写真完整链路
  - 访问首页，验证写真卡片显示VIP标签
  - 点击写真卡片进入写真列表页，验证所有卡片显示VIP标签
  - 点击任意写真卡片进入详情页，验证金色渐变VIP样式
  - 验证详情页的金色渐变VIP专属样式
  - _Requirements: 5.1, 5.2, 5.3, 11.2_


- [ ] 12.3 测试普通影片链路
  - 访问首页，验证普通影片卡片不显示VIP标签
  - 点击普通影片卡片进入详情页，验证绿色下载按钮
  - 验证详情页资源信息标题后无VIP标签
  - 验证VIP影片和普通影片的样式差异

  - _Requirements: 6.1, 6.2, 6.5_

- [ ] 12.4 测试混合内容列表页面
  - 访问最新更新页面，验证合集和写真显示VIP标签
  - 访问热门页面，验证标签显示规则一致
  - 点击"更多"进入列表页，验证标签显示保持一致
  - 测试从混合列表进入合集影片列表的VIP继承
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 13. 统一属性命名规范


  - 搜索并替换所有不一致的VIP属性命名
  - 统一NEW、质量、评分等属性命名
  - 更新所有相关的类型定义
  - 确保整个应用使用一致的属性名
  - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7_

- [x] 13.1 统一VIP属性命名


  - 搜索所有`requiresVip`、`isVipRequired`、`vipRequired`
  - 将所有VIP相关属性统一替换为`isVip`
  - 更新DownloadLink接口，将`requiresVip`改为`isVip`
  - 更新Domain实体（Collection.ts、Movie.ts、Photo.ts），将`isVipRequired`改为`isVip`
  - 更新所有使用这些属性的代码和方法（如`isVipContent()`方法）
  - _Requirements: 17.1, 17.2, 17.5, 17.11_



- [x] 13.2 统一统计属性命名
  - 搜索ResourceStats接口中的`views`、`downloads`、`likes`、`dislikes`
  - 将它们统一替换为`viewCount`、`downloadCount`、`likeCount`、`dislikeCount`
  - 更新所有使用ResourceStats的代码
  - 确保整个应用统一使用`xxxCount`格式
  - _Requirements: 17.3, 17.4_

- [x] 13.3 统一NEW标签属性命名
  - 搜索所有`isNewContent`、`newContent`等变体
  - 统一使用`isNew`和`newType`
  - 更新所有相关的类型定义和代码
  - _Requirements: 17.7_

- [x] 13.4 统一质量属性命名
  - 搜索所有`videoQuality`、`imageQuality`等变体
  - 统一使用`quality`
  - 更新所有相关的类型定义和代码
  - _Requirements: 17.8_

- [x] 13.5 统一描述属性命名


  - 搜索所有`collectionDescription`
  - 统一使用`description`
  - 更新CollectionDetail接口和相关代码
  - _Requirements: 17.9_


- [x] 13.6 创建属性命名规范文档
  - 记录所有统一的属性命名规范
  - 创建命名检查清单（VIP、统计、NEW、质量、描述等）
  - 添加到开发文档中
  - 包含Domain实体层的命名规范
  - _Requirements: 17.6, 17.10_

- [x] 14. 代码审查和文档更新


  - 审查所有修改的代码
  - 更新相关的代码注释
  - 更新README或开发文档
  - 记录重要的设计决策
  - _Requirements: 所有需求_

- [x] 14.1 代码审查

  - 检查所有硬编码是否已移除
  - 检查数据转换逻辑是否已简化
  - 检查类型定义是否正确
  - 检查标签显示逻辑是否符合业务规则
  - 检查属性命名是否统一
  - 检查VIP链路的完整性（合集→影片列表→详情页）
  - **重要：检查UI布局和样式是否保持不变**
  - **重要：确认只修改了数据流和标签逻辑，没有改变视觉样式**
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 18.10_

- [x] 14.2 更新代码注释


  - 为MockDataService添加详细注释说明业务规则
  - 为Content Renderer添加注释说明标签显示规则
  - 为类型定义添加注释说明字段含义
  - 添加属性命名规范的注释
  - 添加VIP继承逻辑的注释
  - _Requirements: 所有需求_


- [x] 14.3 更新开发文档

  - 记录新的数据流架构
  - 记录VIP标签的业务规则
  - 记录统一的属性命名规范
  - 记录完整的VIP链路（合集、写真、普通影片）
  - 记录如何添加新的内容类型
  - 记录测试策略和测试用例
  - _Requirements: 所有需求_
