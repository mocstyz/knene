# Requirements Document

## Introduction

本规范旨在全面重构前端项目的数据流和VIP标签显示系统，解决当前存在的数据硬编码、随机数据生成、标签显示不一致等问题。通过建立统一的数据源驱动架构，确保从Mock数据到UI展示的整个链路中，所有标签（NEW、质量、评分、VIP）的显示都由数据源决定，实现数据驱动的UI渲染。

核心目标是建立一个清晰、可维护的数据流系统，使得：
1. 所有数据都来自统一的Mock数据源
2. VIP状态、标签显示完全由数据源控制
3. 不同内容类型（影片/合集/写真）有明确的标签规则
4. 从卡片到详情页的VIP样式保持一致性

## Requirements

### Requirement 1: 统一数据源架构和消除不必要的数据转换

**User Story:** 作为开发者，我希望所有的UI数据都来自统一的Mock数据源，并且Mock数据直接生成UI需要的格式，避免不必要的数据转换，这样可以确保数据的一致性、可维护性和性能。

#### Acceptance Criteria

1. WHEN 系统初始化时 THEN 所有模块（首页、列表页、详情页）SHALL 从统一的Mock数据服务获取数据
2. WHEN MockDataService生成数据时 THEN 应该直接生成 SHALL CollectionItem、PhotoItem、MovieItem等最终格式，而不是Domain Entity
3. WHEN 数据从MockDataService流向UI时 THEN 不应该经过 SHALL ContentTransformationService的多次转换
4. IF 数据源中定义了isVip字段 THEN 该字段 SHALL 在整个数据流中保持不变
5. WHEN 数据从Repository层传递到Presentation层时 THEN 数据结构 SHALL 保持完整性，不丢失任何标签相关字段
6. WHEN Mock数据被修改时 THEN 所有相关的UI组件 SHALL 自动反映数据变化
7. IF 真实后端API可用时 THEN 后端 SHALL 返回与Mock数据相同格式的数据，前端不需要做额外转换

### Requirement 2: 消除数据硬编码

**User Story:** 作为开发者，我希望移除所有组件中的硬编码数据，这样可以提高代码的可维护性和灵活性。

#### Acceptance Criteria

1. WHEN 检查所有Layer组件时 THEN 不应该存在 SHALL 硬编码的isVip、isNew、quality等值
2. WHEN 检查所有卡片组件时 THEN 标签显示逻辑 SHALL 完全基于传入的数据props
3. IF 组件需要默认值 THEN 应该通过 SHALL 配置文件或类型系统的默认值提供
4. WHEN 渲染VIP标签时 THEN 组件 SHALL 检查数据项的isVip字段而不是硬编码true

### Requirement 3: 移除不必要的随机数据

**User Story:** 作为开发者，我希望只保留必要的随机数据（点赞、收藏、观看次数），移除其他随机生成的数据，这样可以使数据更加可预测和可测试。

#### Acceptance Criteria

1. WHEN 生成Mock数据时 THEN 只有viewCount、downloadCount、favoriteCount、likeCount SHALL 使用随机数生成
2. WHEN 生成Mock数据时 THEN isVip、isNew、quality、rating等字段 SHALL 使用预定义的固定值
3. IF 需要测试不同的数据场景 THEN 应该通过 SHALL 不同的Mock数据集而不是随机生成
4. WHEN 创建新的Mock数据时 THEN 开发者 SHALL 明确指定所有业务相关字段的值

### Requirement 4: 合集VIP专属样式和完整链路

**User Story:** 作为用户，当我浏览合集相关内容时，我希望从首页卡片到合集影片列表再到影片详情页，整个链路都能看到一致的VIP专属标识，这样我可以清楚地知道哪些内容需要VIP权限。

#### Acceptance Criteria

1. WHEN 在首页显示合集卡片时 THEN 卡片 SHALL 显示VIP标签
2. WHEN 用户进入合集列表页面时 THEN 所有合集卡片 SHALL 显示VIP标签
3. WHEN 用户点击合集卡片进入合集影片列表页面时 THEN 该页面的所有影片卡片 SHALL 显示VIP标签
4. WHEN 用户从合集影片列表页面点击任意影片卡片进入详情页时 THEN 详情页 SHALL 显示VIP专属样式（包括金色渐变下载按钮和资源信息标题后的金色渐变VIP标签）
5. IF 合集数据源中isVip为true THEN 整个链路（合集卡片→合集影片列表→影片详情页）的所有VIP相关UI元素 SHALL 显示VIP样式
6. WHEN 合集影片列表页面加载数据时 THEN 应该为所有影片数据 SHALL 设置isVip为true（继承合集的VIP状态）

### Requirement 5: 写真VIP专属样式和完整链路

**User Story:** 作为用户，当我浏览写真相关内容时，我希望从首页卡片到写真列表再到写真详情页，整个链路都能看到一致的VIP专属标识，这样我可以清楚地知道哪些内容需要VIP权限。

#### Acceptance Criteria

1. WHEN 在首页显示写真卡片时 THEN 卡片 SHALL 显示VIP标签
2. WHEN 用户进入写真列表页面时 THEN 所有写真卡片 SHALL 显示VIP标签
3. WHEN 用户从写真列表点击任意写真卡片进入详情页时 THEN 详情页 SHALL 显示VIP专属样式（包括金色渐变下载按钮和资源信息标题后的金色渐变VIP标签）
4. IF 写真数据源中isVip为true THEN 整个链路（写真卡片→写真列表→写真详情页）的所有VIP相关UI元素 SHALL 显示VIP样式

### Requirement 6: 普通影片的非VIP链路

**User Story:** 作为用户，当我浏览普通（非VIP）影片时，我希望从首页卡片到影片详情页，整个链路都不显示VIP标识，并且详情页使用普通样式，这样我可以清楚地知道哪些内容是免费的。

#### Acceptance Criteria

1. WHEN 在首页显示普通影片卡片时 THEN 卡片 SHALL 不显示VIP标签
2. WHEN 用户点击普通影片卡片进入详情页时 THEN 详情页 SHALL 显示普通样式（包括绿色下载按钮，资源信息标题后无VIP标签）
3. IF 影片数据源中isVip为false THEN 整个链路（影片卡片→影片详情页）SHALL 不显示任何VIP相关UI元素
4. WHEN 影片列表页面显示普通影片时 THEN 卡片 SHALL 不显示VIP标签
5. WHEN 详情页加载普通影片数据时 THEN 下载按钮 SHALL 使用绿色样式，资源信息标题后 SHALL 不显示VIP标签

### Requirement 7: 混合内容列表的VIP处理

**User Story:** 作为用户，当我浏览最新更新或热门模块时，我希望能够清楚地区分哪些内容是VIP专属的，无论内容类型是什么。

#### Acceptance Criteria

1. WHEN 最新更新模块包含合集时 THEN 合集卡片 SHALL 显示VIP标签
2. WHEN 最新更新模块包含写真时 THEN 写真卡片 SHALL 显示VIP标签
3. WHEN 最新更新模块包含影片时 THEN 影片卡片 SHALL 根据数据源的isVip字段决定是否显示VIP标签
4. WHEN 7天最热门模块显示内容时 THEN 应该遵循 SHALL 与最新更新相同的VIP标签规则
5. WHEN 用户点击"更多"进入列表页面时 THEN 列表页面的卡片 SHALL 保持与首页模块相同的VIP标签显示规则
6. WHEN 用户从混合列表点击合集进入合集影片列表时 THEN 该列表的所有影片 SHALL 显示VIP标签
7. WHEN 用户从混合列表点击写真进入写真详情时 THEN 详情页 SHALL 显示VIP专属样式

### Requirement 8: 内容类型特定的标签规则

**User Story:** 作为开发者，我希望不同内容类型有明确的标签显示规则，这样可以确保UI的一致性和用户体验。

#### Acceptance Criteria

1. WHEN 渲染写真卡片时 THEN 只应该显示 SHALL NEW标签（根据isNew字段）、质量标签（根据quality字段）和VIP标签（固定显示）
2. WHEN 渲染合集卡片时 THEN 只应该显示 SHALL NEW标签（根据isNew字段）和VIP标签（固定显示）
3. WHEN 渲染影片卡片时 THEN 应该显示 SHALL NEW标签（根据isNew字段）、质量标签（根据quality字段）、评分标签（根据rating字段）和VIP标签（根据isVip字段）
4. IF 数据源中某个标签字段为undefined或null THEN 对应的标签 SHALL 不显示

### Requirement 9: 数据流链路完整性

**User Story:** 作为开发者，我希望数据在整个应用中流动时保持完整性，这样可以确保UI渲染的准确性。

#### Acceptance Criteria

1. WHEN 数据从Mock源流向Repository层时 THEN 所有标签相关字段 SHALL 被正确传递
2. WHEN 数据从Repository层流向Application Service层时 THEN 数据结构 SHALL 保持不变
3. WHEN 数据从Application Service层流向Presentation层时 THEN 所有UI所需的字段 SHALL 完整可用
4. WHEN 数据在Content Renderer中处理时 THEN isVip、isNew、quality等字段 SHALL 被正确识别和使用
5. IF 数据经过转换函数处理 THEN 转换后的数据 SHALL 保留所有原始的标签字段

### Requirement 10: MovieLayer和Content Renderer的标签逻辑

**User Story:** 作为开发者，我希望MovieLayer和Content Renderer组件能够正确处理标签显示逻辑，这样可以确保不同内容类型的正确渲染。

#### Acceptance Criteria

1. WHEN MovieLayer接收到数据时 THEN 应该根据 SHALL showVipBadge配置和数据的isVip字段决定是否显示VIP标签
2. WHEN Content Renderer渲染内容时 THEN 应该根据 SHALL contentType选择正确的渲染器
3. IF contentType为'collection' THEN Content Renderer SHALL 使用CollectionContentRenderer并强制显示VIP标签
4. IF contentType为'photo' THEN Content Renderer SHALL 使用PhotoContentRenderer并强制显示VIP标签
5. IF contentType为'movie' THEN Content Renderer SHALL 使用MovieContentRenderer并根据isVip字段决定VIP标签显示
6. WHEN 渲染器配置中showVipBadge为false时 THEN VIP标签 SHALL 不显示，除非内容类型强制要求（合集和写真）

### Requirement 11: 详情页VIP样式一致性

**User Story:** 作为用户，当我从列表页进入详情页时，我希望VIP样式保持一致，这样可以获得连贯的用户体验。

#### Acceptance Criteria

1. WHEN 用户从合集列表进入影片详情页时 THEN 详情页 SHALL 显示VIP专属样式
2. WHEN 用户从写真列表进入写真详情页时 THEN 详情页 SHALL 显示VIP专属样式
3. WHEN 详情页显示VIP样式时 THEN 下载按钮 SHALL 显示VIP标识
4. WHEN 详情页显示VIP样式时 THEN 资源信息标题后 SHALL 显示VIP标签
5. IF 数据源中isVip为true THEN 详情页的所有VIP相关UI元素 SHALL 被激活

### Requirement 12: NEW标签的条件显示

**User Story:** 作为用户，我希望只在内容真正是新发布时才看到NEW标签，这样可以帮助我发现最新的内容。

#### Acceptance Criteria

1. WHEN 内容的isNew字段为true时 THEN NEW标签 SHALL 显示
2. WHEN 内容的isNew字段为false或undefined时 THEN NEW标签 SHALL 不显示
3. IF 内容有newType字段 THEN NEW标签的样式 SHALL 根据newType（'hot'或'latest'）显示不同的视觉效果
4. WHEN 计算isNew状态时 THEN 应该基于 SHALL 内容的发布时间与当前时间的差值（如24小时内）

### Requirement 13: 质量标签的数据驱动显示

**User Story:** 作为用户，我希望看到准确的视频质量信息，这样可以帮助我选择合适的内容。

#### Acceptance Criteria

1. WHEN 数据源中包含quality字段时 THEN 质量标签 SHALL 显示该字段的值
2. WHEN 数据源中quality字段为undefined或空字符串时 THEN 质量标签 SHALL 不显示
3. IF 组件配置中showQualityBadge为false THEN 质量标签 SHALL 不显示
4. WHEN 渲染写真内容时 THEN 质量标签 SHALL 显示（如果数据源提供）
5. WHEN 渲染合集内容时 THEN 质量标签 SHALL 不显示（合集不需要质量标签）

### Requirement 14: 评分标签的条件显示

**User Story:** 作为用户，我希望看到内容的评分信息，这样可以帮助我判断内容的质量。

#### Acceptance Criteria

1. WHEN 数据源中包含rating字段且值大于0时 THEN 评分标签 SHALL 显示
2. WHEN 数据源中rating字段为undefined、null或0时 THEN 评分标签 SHALL 不显示
3. IF 组件配置中showRatingBadge为false THEN 评分标签 SHALL 不显示
4. WHEN 渲染影片内容时 THEN 评分标签 SHALL 显示（如果数据源提供）
5. WHEN 渲染写真或合集内容时 THEN 评分标签 SHALL 不显示（这些类型不需要评分）

### Requirement 15: 类型系统的完整性

**User Story:** 作为开发者，我希望TypeScript类型系统能够准确反映数据结构，这样可以在编译时捕获错误。

#### Acceptance Criteria

1. WHEN 定义内容类型接口时 THEN isVip字段 SHALL 被明确定义为可选的boolean类型
2. WHEN 定义内容类型接口时 THEN isNew字段 SHALL 被明确定义为可选的boolean类型
3. WHEN 定义内容类型接口时 THEN quality字段 SHALL 被明确定义为可选的string类型
4. WHEN 定义内容类型接口时 THEN rating字段 SHALL 被明确定义为可选的number或string类型
5. IF 某个内容类型不应该有某个字段 THEN 类型定义 SHALL 明确排除该字段或标记为never

### Requirement 16: 配置系统的灵活性

**User Story:** 作为开发者，我希望能够通过配置灵活控制标签的显示，这样可以适应不同的业务场景。

#### Acceptance Criteria

1. WHEN 使用UnifiedCardConfig时 THEN 应该能够 SHALL 独立控制每个标签的显示（showVipBadge、showNewBadge、showQualityBadge、showRatingBadge）
2. WHEN 配置与数据源冲突时 THEN 对于强制性标签（合集和写真的VIP） SHALL 数据源规则优先
3. IF 配置中某个标签设置为false THEN 该标签 SHALL 不显示，除非是强制性标签
4. WHEN 创建默认配置时 THEN 所有标签 SHALL 默认启用（showXxxBadge: true）

### Requirement 17: 保持现有UI布局和样式不变

**User Story:** 作为开发者，我希望在重构数据流和标签逻辑时，保持现有的UI布局和样式不变，这样可以确保用户体验的连续性，避免不必要的视觉变化。

#### Acceptance Criteria

1. WHEN 重构合集卡片时 THEN 应该保持 SHALL 现有的正方形布局，卡片上显示标题与描述
2. WHEN 重构写真卡片时 THEN 应该保持 SHALL 现有的布局：卡片上显示NEW标签（根据数据源）、写真专属质量标签、VIP标签，卡片下方显示标题+分类
3. WHEN 重构影片卡片时 THEN 应该保持 SHALL 现有的布局：卡片上显示NEW标签（根据数据源）、VIP标签（根据数据源）、评分标签（根据数据源）、影片专属质量标签（如HD/SD），卡片下方显示标题+分类
4. WHEN 在混合模块（最新更新、7天热门）中显示卡片时 THEN 应该保持 SHALL 与首页模块相同的布局和样式
5. IF 需要修改标签显示逻辑 THEN 只应该修改 SHALL 标签的显示/隐藏逻辑和数据来源，不应该改变标签的位置、大小、颜色等视觉样式
6. WHEN 重构详情页VIP样式时 THEN 应该使用 SHALL 现有的金色渐变下载按钮和金色渐变VIP标签样式，不创建新的样式
7. WHEN 重构详情页普通样式时 THEN 应该使用 SHALL 现有的绿色下载按钮样式，不创建新的样式

### Requirement 18: 统一属性命名规范

**User Story:** 作为开发者，我希望整个应用中所有属性命名保持一致，这样可以避免混淆和错误，提高代码的可维护性。

#### Acceptance Criteria

1. WHEN 定义VIP相关属性时 THEN 在所有模块（列表页、详情页、下载链接、Domain实体等）中 SHALL 统一使用`isVip`命名
2. WHEN 检查类型定义时 THEN 不应该存在 SHALL `requiresVip`、`isVipRequired`、`vipRequired`等不同的命名
3. WHEN 定义统计相关属性时 THEN 应该统一使用 SHALL `viewCount`、`downloadCount`、`likeCount`、`favoriteCount`
4. WHEN 检查ResourceStats接口时 THEN 应该将 SHALL `views`改为`viewCount`，`downloads`改为`downloadCount`，`likes`改为`likeCount`，`dislikes`改为`dislikeCount`
5. IF 某个接口使用了不同的VIP属性命名 THEN 应该重构 SHALL 为统一的`isVip`
6. WHEN 添加新的接口或类型时 THEN 必须遵循 SHALL 统一的命名规范
7. WHEN 检查NEW标签相关属性时 THEN 应该统一使用 SHALL `isNew`和`newType`
8. WHEN 检查质量相关属性时 THEN 应该统一使用 SHALL `quality`
9. WHEN 检查合集描述属性时 THEN 应该统一使用 SHALL `description`而不是`collectionDescription`
10. IF 发现任何属性命名不一致 THEN 应该在重构中 SHALL 统一修正
11. WHEN 检查Domain实体时 THEN Collection、Movie、Photo实体的 SHALL `isVipRequired`属性应改为`isVip`
