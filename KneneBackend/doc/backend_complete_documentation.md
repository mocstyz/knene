# 影视资源下载网站后端完整文档

## 项目概述

本项目是一个综合性的影视资源下载网站，提供电影、电视剧、电子书、图片等多类型资源。网站采用VIP会员制度进行商业变现，同时确保普通用户也能获得基本的资源访问权限。

## 1. 系统架构

### 1.1 架构概述

本项目采用微服务架构，基于Spring Cloud生态系统构建。系统被划分为多个独立的服务，每个服务负责特定的业务功能。这种架构使得系统具有高可扩展性、高可用性和良好的容错能力。

### 1.2 技术栈

**后端核心框架**：
- **核心框架**：Spring Boot 3.5.7
- **微服务框架**：Spring Cloud Alibaba
- **服务发现与配置中心**：Nacos（推荐，阿里巴巴开源）
- **网关**：Nginx
- **服务调用**：Spring Cloud OpenFeign
- **负载均衡**：Spring Cloud LoadBalancer
- **熔断降级**：Sentinel
- **消息队列**：RocketMQ（阿里巴巴开源）
- **数据库**：MySQL 8.0
- **缓存**：Redis
- **搜索引擎**：Elasticsearch
- **文档存储**：MinIO（对象存储）
- **ORM框架**：MyBatis-Plus

**前端技术栈**：
- Next.js + React：提供SSR支持与良好的SEO表现
- Redux Toolkit：状态管理
- Tailwind CSS：快速构建UI
- HeroUI组件库：提供美观的基础组件

**爬虫服务**：
-  Crawl4AI 配合 Playwright + GLM-4.5V 配置和开发


**部署与运维**：
- **监控**：Spring Boot Admin, Prometheus + Grafana
- **日志收集**：ELK Stack（Elasticsearch, Logstash, Kibana）
- **CI/CD**：Jenkins
- **容器化**：Docker, Kubernetes
- **反向代理**：Nginx

### 1.3 系统拓扑图

```
                                     +---------------------------+
                                     |   Nginx / Load Balancer   |
                                     +-------------+-------------+
                                                   |
                              +--------------------v--------------------+
                              |        Spring Cloud Gateway             |
                              +-------------+---------------+-----------+
                                            |               |
                                 +----------v--+       +----v----+
                                 |  Sentinel   |       |  Nacos  |
                                 | (限流/熔断) |       |(注册/配置)|
                                 +-------------+       +---------+

   +---------------------+----------------+----------------+----------------+----------------+
   |                     |                |                |                |                |
+--v--+              +---v---+        +---v---+        +---v---+        +---v---+        +---v---+
|Auth |              | User  |        |Resource|        |Download|        | Admin |        |Search |
|Svc  |              | Svc   |        |  Svc   |        |  Svc   |        |  Svc  |        |  Svc |
+--+--+              +---+---+        +---+---+        +---+---+        +---+---+        +---+---+
   |                      |                |                |                |                |
   |                  +---v---+        +---v---+        +---v---+        +---v---+        +---v---+
   |                  |USER_DB|        |RES_DB |        |DL_DB  |        |ADMIN_DB|       |Elastic|
   |                  +-------+        |(普通/VIP)       |(下载记录/统计)    +--------+       |Search |
   |                                    +-------+                                      +---+-------+
   |                      +----------------+----------------+----------------+---------|-----------+
   |                                       |                Shared Redis Cluster      |
   |                                       +------------------------------------------+

   +----------------------------------------------------------------------------------------------+
                                     RocketMQ 消息总线
   Topics: user.notification | resource.update | download.completed | crawler.task | system.log
                  ^                   ^                    ^                 ^               ^
                  |                   |                    |                 |               |
          Notification Svc     Resource Svc         Download Svc       Crawler Svc       Admin Svc
```


#### 拓扑图说明（要点）

- 流量入口：用户请求经过`Nginx / Load Balancer`进入`Spring Cloud Gateway`，网关统一鉴权、限流、路由。
- 治理组件：`Sentinel`在网关和服务侧执行限流/熔断；`Nacos`提供服务注册与集中配置。
- 同步调用：`Gateway`将请求按路由转发到`Auth`、`User`、`Resource`、`Download`、`Admin`、`Search`等服务；服务间通过`OpenFeign`调用并使用`LoadBalancer`。
- 数据存储：各服务使用独立`MySQL`库；`Resource DB`按`普通/VIP`分库；`Download DB`存储下载记录、统计信息和外部链接管理数据。
- 缓存与状态：跨服务共享`Redis`，用于会话、计数器、热点数据、令牌桶限流等。
- 搜索链路：`Search Service`维护`Elasticsearch`索引并提供搜索；`Resource Service`变更通过消息触发索引更新。
- 事件总线：`RocketMQ`承载业务事件（`user.notification`、`resource.update`、`download.completed`、`crawler.task`、`system.log`）；相关服务作为生产者/消费者，保证幂等与重试。
- 通知通道：`Notification Service`消费消息，向用户推送站内信、邮件和`WebSocket`实时消息。
- 爬虫闭环：`Crawler Service`消费`crawler.task`，采集/上传资源，触发`resource.update`，完成自动化闭环。
- 安全与观测：`JWT`在网关/服务侧统一校验；监控与日志（`Prometheus/Grafana`、`ELK`、`Spring Boot Admin`）横向覆盖（可选展示）。

## 2. 服务模块设计

### 2.1 网关服务 (Gateway Service)

网关服务是系统的入口点，负责请求路由、负载均衡、认证授权、限流等功能。

**核心功能**：
- 路由转发
- 请求过滤
- 限流控制
- API文档聚合
- 日志记录
- 请求响应转换

**技术实现**：
- Spring Cloud Gateway
- Redis (限流)
- JWT (令牌验证)

### 2.2 认证授权服务 (Auth Service)

负责用户认证和授权管理，包括用户登录、注册、权限控制等。

**核心功能**：
- 用户登录认证
- 令牌颁发与验证
- 用户权限管理
- 密码重置
- 第三方登录集成

**技术实现**：
- Spring Security
- JWT
- OAuth2
- Redis (令牌存储)

### 2.3 用户服务 (User Service)

管理用户信息、会员等级、用户偏好等用户相关功能。

**核心功能**：
- 用户信息管理
- 会员等级管理
- 用户收藏与历史
- 用户反馈与求片
- 用户设置管理

**技术实现**：
- Spring Boot
- MySQL
- Redis (缓存)
- RocketMQ (消息通知)

### 2.4 资源服务 (Resource Service)

管理影视资源的信息、分类、标签等元数据。

**核心功能**：
- 资源元数据管理
- 分类与标签管理
- 资源检索与筛选
- 资源评分与评论
- 资源推荐算法

**技术实现**：
- Spring Boot
- MySQL
- Elasticsearch (搜索)
- Redis (缓存)

### 2.5 下载服务 (Download Service)

负责资源下载链接管理、下载权限控制、下载统计等。系统不直接提供文件下载，而是管理外部下载链接。

**核心功能**：
- **外部链接管理**：
  - BT网站下载链接管理（TorrentGalaxy等外部BT站点）
  - 115网盘分享链接管理（PT站资源处理后）
  - 链接有效性检测与自动更新
  - 失效链接替换机制

- **下载权限控制**：
  - 普通用户：仅可下载普通资源（外部BT链接）
  - VIP用户：可下载全部资源，包括VIP专属资源（115网盘链接）
  - 每日下载次数限制（特别是VIP用户）
  - 用户等级权限验证

- **下载统计与跟踪**：
  - 用户下载历史记录存储
  - 资源下载次数统计
  - 用户下载数据量统计（GB/TB自动转换）
  - 下载行为分析与用户画像构建

- **资源健康监控**：
  - 定期检查外部链接有效性
  - 资源失效自动处理与重新获取
  - 用户举报失效资源处理
  - 资源可用性统计与评分

- **热门资源分析**：
  - 基于下载次数的热门资源排行
  - 分类资源下载趋势分析
  - 用户下载偏好统计
  - 下载时间分布分析

**业务模式说明**：
1. **普通资源**：用户点击下载按钮跳转到外部BT网站的原下载链接，用户使用qBittorrent等下载器自行下载
2. **VIP资源**：用户点击下载按钮跳转到115网盘分享链接，用户通过115网盘下载或在线观看

**技术实现**：
- Spring Boot
- MySQL
- Redis (下载统计、权限限制、缓存)
- 外部服务集成：
  - 115网盘API集成
  - PT站爬虫集成
  - 链接有效性检测服务

### 2.6 搜索服务 (Search Service)

提供全文搜索和高级检索功能。

**核心功能**：
- 全文检索
- 高级筛选
- 搜索建议
- 热门搜索
- 搜索结果缓存

**技术实现**：
- Elasticsearch
- Redis (缓存)
- Spring Data Elasticsearch

### 2.7 通知服务 (Notification Service)

管理系统通知、邮件发送、用户消息等。

**核心功能**：
- 系统公告
- 邮件通知
- 用户消息
- 站内信
- 推送服务集成

**技术实现**：
- Spring Boot
- RocketMQ
- Redis
- WebSocket (实时通知)

### 2.8 管理后台服务 (Admin Service)

提供管理员界面的后端支持，用于系统管理和运营。

**核心功能**：
- 用户管理
- 资源管理
- 系统配置
- 数据统计
- 操作日志

**技术实现**：
- Spring Boot
- MySQL
- Redis

### 2.9 爬虫服务 (Crawler Service)

自动采集和更新资源信息。

**核心功能**：
- 资源信息采集
- 资源链接更新
- 定时任务调度
- 代理IP池管理
- 爬虫规则配置

**技术实现**：
- Spring Boot
- WebMagic/Jsoup
- Redis (代理池、任务队列)
- MySQL (数据存储)

## 3. 业务需求详细设计

### 3.1 用户系统

#### 用户分层

**管理层**：
- **超级管理员**：拥有系统全部权限
- **普通管理员**：拥有部分管理权限
- **权限动态管理**：后台管理系统支持实时增减权限

**普通用户**：
- **VIP用户**：可下载全部资源，包括VIP专属资源，设有每日下载次数限制
- **普通用户**：仅可下载普通资源，对VIP资源只能查看不能下载

#### 管理员功能

**超级管理员**：
- 用户管理（增删改查）
- IP封禁管理
- 系统全部功能控制权
- 权限分配

**普通管理员**：
- 资源管理
- 有限的用户管理权限
- 权限由超级管理员分配

#### 用户个人中心

**个人资料管理**：
- 基本信息编辑
- 头像设置（仅支持图床链接，不支持服务器上传）

**下载管理**：
- 下载历史记录
- 资源下载总量统计（GB/TB自动转换）

**内容互动**：
- 收藏列表
- 评论列表（资源评论及用户评论回复）

#### 消息中心

- **系统通知**：平台公告、系统更新等信息
- **管理员消息**：管理员可向特定用户发送实时消息
- **用户反馈**：用户可向管理员发送消息，实现用户与管理员的双向通信
- **工单系统**：用户可提交问题工单，管理员处理后反馈结果
- **消息状态追踪**：仅管理员可查看消息已读/未读状态及历史消息，用户端不支持此功能
- **不支持**用户间私信功能

### 3.2 资源系统

#### 普通资源获取

- **资源来源**：[TorrentGalaxy](https://torrentgalaxy.to/torrents.php)（后续可能更换为其它网站）
- **筛选标准**：仅爬取带IMDB信息的影片和电子书资源
- **访问权限**：普通用户和VIP用户均可下载
- **处理策略**：
  - 只保存资源元数据和种子文件
  - 混合图片存储方案：
    - 封面图片(poster)上传至图床，确保资源列表页面稳定一致的展示效果
    - 其他图片(screenshots)直接引用原站URL，不上传图床
  - 图片风险管理：
    - 实现原站图片的本地缓存机制，当原链接失效时自动切换使用
    - 缓存策略基于访问频率和重要性动态调整
  - 轻量化存储，减少服务器负担
  - 定期检查原站图片链接有效性

#### VIP专属资源

- **资源来源**：[SpringSunday PT站](https://springsunday.net/torrents.php)
- **处理流程**：
  - 爬取资源信息和相关图片
  - 将资源图片上传到图床，确保长期稳定访问
  - 下载资源到服务器
  - 上传资源到115网盘并生成分享链接
  - 本地服务器制作qBittorrent种子文件
  - 种子上传到网站做种2天
  - 2天后删除本地资源文件，仅保留115网盘分享链接和图床图片
- **访问权限**：仅VIP用户可下载，每日下载次数有限
- **普通用户**：仅能浏览资源信息，无法下载

#### 求片系统

**用户求片流程**：
- 用户提交求片请求（电影/剧集名称、年份、IMDB/豆瓣ID等信息）
- 系统自动检索现有资源库，验证是否已存在相同资源
- 若已存在，直接向用户展示现有资源链接
- 若不存在，求片请求发布成功并进入处理队列

**重复验证机制**：
- 基于影片元数据（IMDB ID、豆瓣ID、名称+年份等）进行智能匹配
- 支持模糊匹配，处理不同版本、不同清晰度的同一资源
- 展示相似度较高的资源作为备选推荐

**自动处理系统**：
- 系统定期扫描求片队列，按优先级排序（VIP用户请求优先）
- 自动连接到PT站（SpringSunday）进行资源搜索
- 找到匹配资源后自动触发爬取、下载、上传、制种等完整流程
- 全流程无需人工干预，减轻管理员工作量

**状态追踪与通知**：
- 用户可查看求片请求的处理状态（等待处理、搜索中、已找到、处理中、已完成）
- 资源添加完成后自动通知请求用户
- 系统记录求片请求统计数据，优化后续处理策略

**管理员审核**：
- 特殊资源或自动处理失败的请求转入管理员手动处理队列
- 管理员可对求片请求进行优先级调整
- 管理员可手动添加找到的资源

#### 影片信息本地化

- 爬取豆瓣影片中文信息
- 与国外资源信息整合存储

#### 资源失效自动处理系统

**举报机制**：
- 用户可在资源页面点击"举报失效"按钮
- 系统记录举报信息及举报用户

**自动处理流程**：
- 系统检测到失效举报后自动触发处理
- 从原始PT站(SpringSunday)重新爬取该资源
- 下载资源到服务器
- 重新上传到115网盘并生成新的分享链接
- 本地服务器制作新的qBittorrent种子文件
- 在服务器自动做种2天
- 更新数据库中的资源链接信息

**用户通知**：
- 资源恢复后自动向举报用户发送通知
- 通知包含新的可用链接
- 用户可直接通过通知跳转至更新后的资源页面

**资源监控**：
- 对频繁失效的资源进行标记
- 定期自动检查热门资源有效性
- 建立资源健康度评分系统

### 3.3 内容管理系统

#### 新闻模块

**功能定位**：
- 发布行业动态、站点更新、影视资讯等内容
- 提高用户粘性与搜索引擎收录
- 作为平台重要的内容营销渠道

**内容管理**：
- 管理员发布、编辑、删除文章
- 文章分类与标签管理
- 文章排序与推荐设置
- 定时发布功能

**前端展示**：
- 新闻首页（最新文章、热门文章）
- 文章详情页
- 相关文章推荐
- 分类浏览页面

**用户互动**：
- 文章评论功能
- 文章分享功能
- 收藏与点赞功能

#### WIKI知识库

**功能定位**：
- 提供影视相关专业知识
- 建立资源获取与使用指南
- 构建社区共建的知识体系

**内容组织**：
- 分类目录结构
- 关键词索引
- 版本历史记录
- 内部链接系统

**编辑权限**：
- 管理员完全编辑权限
- 资深VIP用户可提交修改建议
- 内容审核机制

**知识点类型**：
- 影视术语解释
- 软件使用教程
- 资源获取指南
- 常见问题解答（FAQ）
- 编解码知识

**特殊功能**：
- 搜索功能
- 贡献者积分机制
- 内容纠错反馈
- 打印友好版本

### 3.4 图床服务

**差异化图片处理策略**：
- **VIP资源图片**：上传到图床存储，确保长期稳定访问
- **普通资源图片**：采用混合存储策略
  - 封面图片(poster)上传至图床
  - 截图等次要图片引用原站URL

**图床功能**：
- 为VIP资源提供稳定可靠的图片存储服务
- 为普通资源的封面图片提供存储服务
- 支持图片压缩和优化，提高加载速度
- 定期检测图片有效性，确保内容展示质量

**图片缓存与备份机制**：
- 对普通资源的原站图片实现智能缓存
- 首次访问时自动缓存到本地临时存储
- 设置基于流行度的缓存优先级和过期策略
- 原站链接失效时自动切换到缓存版本

**技术实现**：
- VIP资源图片：爬取后上传至图床，存储图床URL
- 普通资源封面图片：爬取后上传至图床，确保列表页展示质量
- 普通资源其他图片：仅记录原始URL，并实现本地缓存
- 前端实现图片懒加载，优化页面加载速度
- 图片加载失败时显示默认占位图

### 3.5 VIP系统

#### 充值系统

- 多种支付方式集成
- 定期促销与优惠活动
- 充值记录与消费明细

#### VIP特权设计

- 专属标识：VIP用户徽章、头像框
- 界面专属样式与特效
- 下载速度提升
- 专属客服服务
- 资源请求优先处理

### 3.6 广告系统

#### 广告位规划

**首页广告位**：
- 顶部横幅（轮播）
- 资源列表间插广告
- 侧边栏推广位

**资源详情页广告位**：
- 下载按钮周边广告
- 相关推荐区域广告位
- 底部横幅广告

**搜索结果页广告位**：
- 搜索结果顶部推广位
- 搜索结果间插广告
- 相关搜索推广

#### 广告系统设计

**广告投放策略**：
- 基于用户兴趣的精准投放
- 基于资源内容的上下文广告
- 不同用户等级显示不同广告（VIP用户可减少广告干扰）

**广告管理功能**：
- 广告位管理（开启/关闭）
- 广告素材管理
- 广告效果统计与分析
- A/B测试支持

**广告联盟对接**：
- 预留第三方广告联盟接口
- 支持多家广告联盟同时接入
- 广告收益智能优化系统

#### 广告用户体验

**非侵入式设计**：
- 避免弹窗和全屏广告
- 确保广告不影响核心功能使用
- 明确标识广告内容

**广告加载优化**：
- 异步加载确保不阻塞页面渲染
- 预留广告位尺寸减少布局偏移
- 广告失效时自动调整布局

## 4. 数据库设计

### 4.1 数据库架构

系统采用按服务垂直拆分的数据库架构，每个服务维护自己的数据库，同时使用Flyway进行数据库版本控制。

```
+-------------------+    +-------------------+    +-------------------+
|    USER_DB        |    |    RESOURCE_DB    |    |    DOWNLOAD_DB    |
+-------------------+    +-------------------+    +-------------------+
| - user            |    | - resource        |    | - download_record |
| - user_profile    |    | - category        |    | - download_stats  |
| - user_preference |    | - tag             |    | - resource_file   |
| - user_level      |    | - resource_tag    |    | - link_validation|
| - feedback        |    | - comment         |    +-------------------+
| - favorite        |    | - rating          |
| - history         |    | - resource_detail |
+-------------------+    +-------------------+
```

### 4.2 核心表结构设计

#### 用户相关表结构

**用户表(user)**：
- id (bigint, PK, AI)
- username (varchar, unique, not null)
- email (varchar, unique, not null)
- password_hash (varchar, not null)
- user_level (tinyint, default 0) - 0:普通用户, 1:VIP用户
- status (tinyint, default 1) - 0:禁用, 1:正常
- created_at (datetime)
- updated_at (datetime)

**用户资料表(user_profile)**：
- user_id (bigint, PK, FK)
- nickname (varchar)
- avatar_url (varchar)
- bio (text)
- timezone (varchar, default 'UTC')
- language (varchar, default 'zh_CN')

#### 资源相关表结构

**资源表(resource)**：
- id (bigint, PK, AI)
- title (varchar, not null)
- original_title (varchar)
- year (int)
- type (tinyint) - 1:电影, 2:电视剧, 3:纪录片
- category_id (bigint, FK)
- is_vip (boolean, default false)
- tmdb_id (varchar)
- imdb_id (varchar)
- douban_id (varchar)
- poster_url (varchar)
- overview (text)
- status (tinyint, default 1) - 0:下架, 1:正常
- download_count (int, default 0)
- rating (decimal, 3, 2)
- created_at (datetime)
- updated_at (datetime)

**资源文件表(resource_file)**：
- id (bigint, PK, AI)
- resource_id (bigint, FK)
- file_type (tinyint) - 1:外部BT链接, 2:115网盘分享链接
- file_url (varchar) - 外部下载链接地址
- source_site (varchar) - 来源网站（TorrentGalaxy、115网盘等）
- file_size (bigint) - 文件大小（字节）
- quality (varchar) - 清晰度（1080p, 720p, 4K等）
- is_active (boolean, default true) - 链接是否有效
- last_check_time (datetime) - 最后检查链接有效性的时间
- created_at (datetime) - 创建时间
- updated_at (datetime) - 更新时间

**下载记录表(download_record)**：
- id (bigint, PK, AI)
- user_id (bigint, FK) - 下载用户ID
- resource_id (bigint, FK) - 资源ID
- file_id (bigint, FK) - 下载的文件ID
- download_type (tinyint) - 1:普通下载(BT链接), 2:VIP下载(115网盘)
- ip_address (varchar) - 下载IP地址
- user_agent (varchar) - 用户浏览器信息
- download_time (datetime) - 下载时间
- is_vip_user (boolean) - 是否为VIP用户下载

**下载统计表(download_stats)**：
- id (bigint, PK, AI)
- resource_id (bigint, FK) - 资源ID
- download_count (int, default 0) - 总下载次数
- vip_download_count (int, default 0) - VIP用户下载次数
- normal_download_count (int, default 0) - 普通用户下载次数
- last_download_time (datetime) - 最后下载时间
- stats_date (date) - 统计日期（用于按日统计）

### 4.3 索引设计策略

#### 主要索引设计

**用户表索引**：
- idx_username: username
- idx_email: email
- idx_user_level: user_level
- idx_status_created: status, created_at

**资源表索引**：
- idx_title: title
- idx_year_type: year, type
- idx_category_vip: category_id, is_vip
- idx_tmdb_id: tmdb_id
- idx_status_created: status, created_at
- idx_download_count: download_count (降序)
- idx_rating: rating (降序)

**资源文件表索引**：
- idx_resource_id: resource_id
- idx_file_type: file_type
- idx_is_active: is_active

#### 复合索引设计

- idx_search: title, year, type, is_vip - 用于资源搜索
- idx_hot_resources: download_count DESC, rating DESC, created_at DESC - 用于热门资源排序
- idx_user_resources: user_id, resource_id, created_at - 用于用户历史记录查询

### 4.4 分库存储策略

- 考虑将普通资源和VIP资源分为两个独立数据库
- 普通资源库：轻量级存储，主要包含元数据和外部BT链接
- VIP资源库：完整存储，包含详细元数据和115网盘分享链接
- 下载服务独立数据库：存储下载记录、统计信息和链接有效性检查数据

**分库优势**：
- 提高查询效率：针对不同用户类型优化查询性能
- 差异化备份策略：VIP资源更高频率备份
- 灵活的扩容管理：根据不同资源库增长速度单独扩容
- 安全隔离：降低全库数据泄露风险

**实现方案**：
- 采用分片集群实现物理隔离
- 构建统一资源检索层，屏蔽底层分库细节
- 资源ID采用统一编码规则，保持全局唯一性

### 4.5 数据库优化策略

- **分库分表**：使用Sharding-JDBC实现读写分离和分库分表
- **索引优化**：合理设计索引，定期维护
- **查询优化**：使用SQL审计，优化慢查询
- **缓存策略**：多级缓存，减轻数据库压力
- **定期维护**：按计划进行数据库优化和维护

### 4.6 数据版本控制

使用Flyway进行数据库版本控制：

**版本命名规范**：V{序号}__{描述}.sql
**迁移脚本分类**：
- 结构变更：表结构修改
- 数据迁移：数据格式转换
- 初始化脚本：基础数据导入
- 回滚脚本：版本回退支持

**数据库环境隔离**：
- 开发环境：支持快速迭代和数据重置
- 测试环境：生产数据脱敏后的完整副本
- 生产环境：严格版本控制，需要审批流程

## 5. 缓存设计

### 5.1 缓存层次

1. **本地缓存（一级缓存）**
   - Caffeine缓存
   - 适用于高频访问且变化不频繁的数据
   - 例如：系统配置、字典数据等

2. **分布式缓存（二级缓存）**
   - Redis缓存
   - 适用于共享数据和需要跨服务访问的数据
   - 例如：用户会话、热门资源、计数器等

3. **搜索引擎（三级缓存）**
   - Elasticsearch
   - 适用于全文搜索和复杂查询
   - 例如：资源检索、智能推荐等

### 5.2 缓存键命名规范

**命名规范**：{服务}:{模块}:{类型}:{标识}:{版本}

**具体命名示例**：
- 用户信息：user:profile:info:{user_id}:v1
- 资源详情：resource:detail:{resource_id}:v2
- 用户会话：auth:session:{token}:v1
- 热门资源：resource:hot:list:daily:v1
- 下载统计：download:stats:user:{user_id}:daily:v1
- 分类缓存：category:tree:all:v1

**版本管理**：
- 缓存键包含版本号，便于缓存更新
- 重大结构变更时升级版本号
- 旧版本缓存自然过期，确保数据一致性

### 5.3 缓存同步策略

- **被动失效**：数据更新时主动使相关缓存失效
- **定时刷新**：对于热点数据定时刷新缓存
- **按需加载**：首次访问时加载缓存（Cache-Aside模式）
- **写入同步**：关键数据更新时同步更新缓存（Write-Through模式）

#### 缓存更新策略

**Cache-Aside模式**：
- 读取时先查缓存，缓存miss则查数据库并写入缓存
- 更新时先更新数据库，再删除缓存
- 适用于读多写少的场景

**Write-Through模式**：
- 写入时同时更新缓存和数据库
- 保证缓存和数据库强一致性
- 适用于写入频繁的关键数据

**Write-Behind模式**：
- 写入时只更新缓存，异步更新数据库
- 提高写入性能，但存在数据丢失风险
- 适用于容忍数据不一致的场景

### 5.4 缓存预热策略

**系统启动预热**：
- 应用启动时加载基础配置数据
- 预加载热门资源列表
- 预加载分类树结构

**定时预热**：
- 每日凌晨预热当日热门资源
- 每小时预热最新更新的资源
- 根据用户访问模式动态调整预热内容

**触发式预热**：
- 大量用户访问某个资源时，预加载相关资源
- 新资源上线时，预热相关分类数据
- 系统维护后，预热核心数据

### 5.5 缓存监控与告警

**缓存性能指标**：
- 命中率：目标>90%
- 响应时间：目标<5ms
- 内存使用率：预警>80%
- 网络带宽：监控缓存数据传输量

**监控Dashboard**：
- 实时命中率曲线图
- 缓存内存使用情况
- 热点Key访问统计
- 缓存操作耗时分布

**告警规则**：
- 命中率低于85%时告警
- 内存使用率超过85%时告警
- 大量Key同时过期时告警
- 缓存服务不可用时立即告警

### 5.6 缓存容灾设计

**缓存不可用处理**：
- 降级策略：缓存不可用时直接查询数据库
- 熔断机制：连续失败后暂停缓存访问
- 恢复策略：缓存恢复后自动预热关键数据

**多级缓存降级**：
- L1缓存故障，降级到L2缓存
- L2缓存故障，降级到数据库查询
- 数据库压力大时，启用限流保护

**数据一致性保障**：
- 关键操作使用分布式锁
- 缓存失效后设置合理的重试机制
- 重要数据变更时发送事件通知其他节点

### 5.3 TMDb API缓存策略

本项目将使用TMDb (The Movie Database) API作为影视元数据的主要来源。考虑到TMDb API的使用限制(每日约3000-4000次请求)，我们需要实施有效的缓存策略。

#### 缓存层设计

```
# TMDb电影详情缓存
Key: movie:tmdb:movie:{tmdb_id}
Type: Hash
Fields: 电影各字段(title, overview, release_date等)
TTL: 7天

# TMDb电视剧详情缓存
Key: movie:tmdb:tv:{tmdb_id}
Type: Hash
Fields: 电视剧各字段
TTL: 7天

# TMDb演员信息缓存
Key: movie:tmdb:person:{person_id}
Type: Hash
Fields: 演员信息字段
TTL: 30天

# TMDb搜索结果缓存
Key: movie:tmdb:search:{query_hash}
Type: String (序列化的JSON)
Value: 搜索结果
TTL: 24小时

# TMDb热门/流行内容缓存
Key: movie:tmdb:trending:{media_type}:{time_window}
Type: String (序列化的JSON)
Value: 热门内容列表
TTL: 6小时

# TMDb图片URL缓存
Key: movie:tmdb:images:{reference_type}:{reference_id}
Type: List
Members: 图片URL列表
TTL: 15天
```

#### 缓存优化策略

1. **分层缓存**:
   - 热门影视数据使用更长的缓存时间
   - 搜索结果较短缓存时间
   - 基础元数据较长缓存时间
   - 图片URL极长缓存时间

2. **预加载机制**:
   - 定时任务预加载热门影视数据
   - 新资源上线时预加载相关元数据
   - 首页内容预缓存

3. **缓存防击穿措施**:
   - 使用分布式锁防止缓存击穿
   - 热门数据缓存永不过期+后台异步更新策略
   - 请求合并处理

4. **缓存一致性**:
   - 电影信息更新时主动使相关缓存失效
   - 使用版本号管理缓存数据

## 6. 消息队列设计

系统使用RocketMQ作为消息队列中间件，实现服务间的异步通信和事件驱动架构。RocketMQ是阿里巴巴开源的高性能消息队列，在大规模、高并发场景下具有出色的性能表现。

### 6.1 主要消息队列

| 队列名称 | 用途 | 消息格式 |
|---------|------|---------|
| user.notification | 用户通知 | {userId, type, content, timestamp} |
| resource.update | 资源更新 | {resourceId, updateType, data, timestamp} |
| download.completed | 下载完成 | {userId, resourceId, size, timestamp} |
| crawler.task | 爬虫任务 | {targetUrl, priority, params, timestamp} |
| system.log | 系统日志 | {service, level, message, timestamp} |
| payment.event | 支付事件 | {orderId, userId, amount, status, timestamp} |
| recommendation.update | 推荐更新 | {userId, resourceIds, algorithm, timestamp} |

### 6.2 消息处理策略

- **消息持久化**：确保消息不丢失
- **消息幂等性**：处理重复消息
- **死信队列**：处理失败消息
- **延迟队列**：处理需要延迟执行的任务
- **消息优先级**：处理紧急消息
- **事务消息**：确保分布式事务一致性
- **消息轨迹**：追踪消息流转路径
- **消费重试**：智能重试策略

## 6.3 分布式事务设计

### 6.3.1 事务模式选择

**Saga模式**：
- **适用场景**：长流程业务、补偿操作明确
- **实现方式**：基于状态机的事件驱动
- **优势**：高可用、高性能、易扩展
- **劣势**：业务逻辑复杂、需要补偿设计

**TCC模式**：
- **适用场景**：一致性要求高、实时性要求强
- **实现方式**：Try-Confirm-Cancel三阶段提交
- **优势**：强一致性、资源锁定时间短
- **劣势**：代码侵入性强、开发复杂度高

**本地消息表**：
- **适用场景**：最终一致性、异步处理
- **实现方式**：数据库+消息队列组合
- **优势**：实现简单、可靠性高
- **劣势**：需要额外存储、性能损耗

### 6.3.2 事务场景应用

**用户充值流程**：
```
1. 支付服务创建支付订单
2. 用户完成支付
3. 支付服务发送支付完成消息
4. 用户服务消费消息，更新用户余额
5. 通知服务发送充值成功通知
```

**资源下载流程**：
```
1. 用户请求下载
2. 下载服务检查权限和余额
3. 扣除用户下载次数/余额
4. 生成下载链接
5. 记录下载日志
6. 更新资源统计
```

**VIP升级流程**：
```
1. 用户发起VIP升级
2. 支付服务处理支付
3. 用户服务更新会员状态
4. 权限服务同步用户权限
5. 通知服务发送升级成功消息
```

## 7. 安全设计

### 7.1 认证与授权

- **JWT认证**：基于令牌的认证机制
- **OAuth2集成**：支持第三方登录
- **RBAC权限模型**：基于角色的访问控制
- **接口权限控制**：API级别的权限管理
- **数据权限控制**：行级别的数据访问控制

#### JWT Token设计

**Token结构**：
- Header：算法和令牌类型
- Payload：用户信息和权限数据
- Signature：签名验证

**Token字段设计**：
```json
{
  "sub": "user_id",
  "username": "john_doe",
  "user_level": 1,
  "permissions": ["resource:read", "download:create"],
  "iat": 1640995200,
  "exp": 1641081600,
  "iss": "movie-platform",
  "jti": "unique_token_id"
}
```

**Token过期策略**：
- Access Token：2小时过期
- Refresh Token：7天过期
- 自动刷新：Token过期前30分钟自动刷新
- 强制登出：管理员可强制用户token失效

#### OAuth2集成设计

**支持的第三方登录**：
- Google OAuth2
- GitHub OAuth2
- 微信登录
- QQ登录

**集成流程**：
- 前端重定向到第三方授权页面
- 获取授权码后回调到系统
- 系统用授权码换取访问令牌
- 获取用户信息并创建/绑定本地账号

### 7.2 数据安全

- **数据加密**：敏感数据存储和传输加密
- **参数验证**：防止注入攻击
- **XSS防护**：过滤用户输入
- **CSRF防护**：跨站请求伪造防护
- **数据脱敏**：敏感信息展示脱敏

#### 数据加密策略

**传输层加密**：
- HTTPS：全站TLS 1.3加密
- API接口：强制HTTPS访问
- 内部服务：服务间mTLS加密

**存储层加密**：
- 密码加密：BCrypt哈希算法，salt rounds=12
- 敏感字段：AES-256-GCM加密存储
- 文件加密：MinIO服务端加密

**密钥管理**：
- 密钥轮换：每90天轮换一次加密密钥
- 密钥存储：使用专用密钥管理服务
- 访问控制：严格的密钥访问权限控制

#### 输入验证与防护

**参数验证规则**：
- SQL注入防护：使用预编译语句
- XSS防护：输出编码和输入过滤
- CSRF防护：双重Cookie验证
- 文件上传：类型检查和病毒扫描

**敏感数据脱敏**：
- 用户手机号：138****1234
- 邮箱地址：u***@example.com
- IP地址：192.168.*.*
- 身份证号：110***********1234

### 7.3 网络安全

- **HTTPS**：全站HTTPS加密
- **WAF防护**：Web应用防火墙
- **限流控制**：防止DDoS攻击
- **IP黑名单**：封禁恶意IP
- **漏洞扫描**：定期安全扫描

#### 网络防护策略

**DDoS防护**：
- 接入层：Cloudflare DDoS防护
- 应用层：限流和熔断机制
- 网络层：流量清洗服务

**WAF规则配置**：
- SQL注入检测和拦截
- XSS攻击特征识别
- 恶意文件上传防护
- 异常访问模式检测

**IP安全策略**：
- 动态IP黑名单：基于行为分析
- 地理位置限制：特定地区访问控制
- 速率限制：IP级别的请求频率控制

### 7.4 安全监控与审计

**安全事件监控**：
- 异常登录检测：异地登录、频繁失败登录
- 权限变更审计：管理员操作记录
- 数据访问审计：敏感数据访问追踪
- 系统入侵检测：异常行为模式识别

**安全告警机制**：
- 实时告警：高危安全事件立即通知
- 每日报告：安全事件汇总报告
- 威胁情报：集成外部威胁情报源
- 自动响应：简单威胁自动处理

### 7.5 合规性管理

**数据保护合规**：
- GDPR：欧盟数据保护条例
- 个人信息保护法：中国数据保护法规
- 数据本地化：敏感数据境内存储

**安全认证标准**：
- ISO 27001：信息安全管理体系
- 等保2.0：网络安全等级保护
- SOC 2：安全运营控制

## 8. 高可用设计

### 8.1 服务高可用

- **服务集群**：关键服务多实例部署
- **自动扩缩容**：根据负载自动调整实例数
- **健康检查**：服务健康状态监控
- **熔断降级**：服务故障时自动降级
- **限流保护**：过载时保护系统

### 8.2 数据高可用

- **数据库主从复制**：实现数据备份和读写分离
- **数据库集群**：高可用数据库集群
- **缓存集群**：Redis集群部署
- **定期备份**：数据定期备份
- **灾难恢复**：灾难恢复预案

### 8.3 基础设施高可用

- **多可用区部署**：跨可用区部署
- **容器编排**：Kubernetes自动调度
- **负载均衡**：流量均衡分发
- **CDN加速**：静态资源CDN分发
- **多云部署**：关键系统多云部署

## 9. 性能优化

### 9.1 应用层优化

- **异步处理**：非关键路径异步化
- **并行处理**：批量任务并行处理
- **线程池优化**：合理配置线程池
- **JVM调优**：JVM参数优化
- **代码优化**：关键代码性能优化

### 9.2 数据层优化

- **索引优化**：合理设计和使用索引
- **查询优化**：优化SQL查询
- **连接池优化**：数据库连接池优化
- **读写分离**：实现读写分离
- **分库分表**：高并发表分片

### 9.3 网络层优化

- **接口压缩**：HTTP响应压缩
- **资源合并**：减少HTTP请求
- **CDN加速**：静态资源CDN分发
- **HTTP/2**：使用HTTP/2协议
- **API网关优化**：网关性能优化

## 10. 项目结构与开发规范

### 10.1 目录结构

```
KneneBackend
├── .gitattributes
├── .gitignore
├── .mvn/
│   └── wrapper/
│       └── maven-wrapper.properties
├── docs/
│   ├── config_guide.md
│   ├── redis_design.md
│   └── backend_complete_documentation.md
├── logs/
│   └── application-dev.log
├── lombok.config
├── mvnw
├── mvnw.cmd
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── knene/
│   │   │           └── movie/
│   │   │               ├── MovieBackendApplication.java
│   │   │               ├── application/
│   │   │               │   ├── auth/
│   │   │               │   │   ├── AuthService.java
│   │   │               │   │   ├── dto/
│   │   │               │   │   └── service/
│   │   │               │   ├── event/
│   │   │               │   └── user/
│   │   │               │       ├── UserApplicationService.java
│   │   │               │       ├── command/
│   │   │               │       └── dto/
│   │   │               ├── domain/
│   │   │               │   ├── common/
│   │   │               │   ├── model/
│   │   │               │   │   └── base/
│   │   │               │   ├── user/
│   │   │               │   │   ├── common/
│   │   │               │   │   ├── entity/
│   │   │               │   │   ├── enums/
│   │   │               │   │   ├── event/
│   │   │               │   │   ├── repository/
│   │   │               │   │   └── service/
│   │   │               │   │       └── impl/
│   │   │               │   └── verification/
│   │   │               │       ├── entity/
│   │   │               │       ├── repository/
│   │   │               │       └── service/
│   │   │               │           └── impl/
│   │   │               ├── infrastructure/
│   │   │               │   ├── captcha/
│   │   │               │   │   ├── TurnstileService.java
│   │   │               │   │   └── impl/
│   │   │               │   ├── common/
│   │   │               │   │   ├── aop/
│   │   │               │   │   ├── exception/
│   │   │               │   │   └── utils/
│   │   │               │   ├── config/
│   │   │               │   │   ├── properties/
│   │   │               │   ├── email/
│   │   │               │   │   ├── EmailService.java
│   │   │               │   │   └── impl/
│   │   │               │   ├── persistence/
│   │   │               │   │   ├── base/
│   │   │               │   │   ├── repository/
│   │   │               │   │   │   └── impl/
│   │   │               │   │   ├── user/
│   │   │               │   │   │   ├── entity/
│   │   │               │   │   │   ├── mapper/
│   │   │               │   │   │   └── repository/
│   │   │               │   │   │       └── impl/
│   │   │               │   │   └── verification/
│   │   │               │   │       ├── entity/
│   │   │               │   │       ├── mapper/
│   │   │               │   │       └── repository/
│   │   │               │   │           └── impl/
│   │   │               │   ├── security/
│   │   │               │   │   ├── annotation/
│   │   │               │   │   ├── aspect/
│   │   │               │   │   ├── filter/
│   │   │               │   │   └── service/
│   │   │               │   └── task/
│   │   │               └── interfaces/
│   │   │                   ├── api/
│   │   │                   │   ├── auth/
│   │   │                   │   └── user/
│   │   │                   ├── assembler/
│   │   │                   ├── dto/
│   │   │                   │   ├── request/
│   │   │                   │   └── response/
│   │   │                   └── response/
│   │   └── resources/
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       ├── application.yml
│   │       ├── db/
│   │       │   └── migration/
│   │       ├── docs/
│   │       └── mapper/
│   │           └── user/
│   └── test/
│       └── java/
│           └── com/
│               └── knene/
```

### 10.2 代码与架构核心原则

- **领域驱动设计（DDD）**：以业务领域为核心组织代码，强调领域模型的表达。
- **六边形架构（Ports & Adapters）**：业务核心与外部依赖解耦，便于扩展和测试。
- **SOLID 原则**：
  - 单一职责（SRP）：每个类/模块只负责一项功能。
  - 开闭原则（OCP）：对扩展开放，对修改关闭。
  - 依赖倒置（DIP）：依赖于抽象而非具体实现。
  - 接口隔离（ISP）：接口精细、职责单一。
  - 里氏替换（LSP）：子类可替换父类。
- **DRY 原则**：避免重复代码，通用逻辑抽取到基类或工具类。
- **模板方法模式**：通用流程在基类实现，特殊逻辑由子类扩展。
- **依赖注入**：优先构造器注入，提升可测试性和灵活性。
- **高内聚低耦合**：模块内部紧密协作，模块间松耦合。
- **javadoc 注释**：所有类需有标准 javadoc 注释，便于维护和协作。

### 10.3 开发与管理规范

#### 代码修改规范
1. **变更说明**：所有新增、修改、删除操作前，需说明原因。若为 BUG 修复，需明确指出问题性质、原因及位置。
2. **模块化组织**：新增文件/目录应按功能模块化，保持高内聚低耦合。
3. **同步一致性**：涉及 src 组件/逻辑变更需保持同步。
4. **废弃清理**：替换新方案后，必须删除废弃代码。
5. **错误检查**：每次修改后，立即处理编译器和开发工具报错。
6. **零错误提交**：禁止提交包含编译错误的代码。

#### 项目管理规范
1. **核心原则**：始终遵循 SOLID 原则，保持高内聚低耦合。
2. **项目认知**：项目开始前，务必阅读并理解 README.md，明确目标、架构、技术栈和开发计划。
3. **文档维护**：如无 README.md，需主动创建。每次目录/文件变更后，及时更新文档，保持一致。
4. **迭代记录**：每次代码变更后，需在 iterativeoptimal.md 记录修改内容，按 Markdown 顺序标记进度，已完成项注明"已完成"。

#### 代码规范
- **命名规范**：驼峰命名法
- **注释规范**：JavaDoc注释
- **异常处理**：统一异常处理
- **日志规范**：结构化日志
- **单元测试**：测试覆盖率要求

#### 接口规范
- **RESTful API**：遵循REST规范
- **版本控制**：API版本控制
- **参数校验**：统一参数校验
- **响应格式**：统一响应格式
- **API文档**：Swagger/OpenAPI文档

## 10.1 API接口设计规范

### 10.1.1 RESTful API设计原则

**URL设计规范**：
- 使用名词而非动词：/api/v1/resources 而非 /api/v1/getResources
- 使用复数形式：/api/v1/users, /api/v1/resources
- 层级关系清晰：/api/v1/users/{userId}/favorites
- 避免深层嵌套：最多3层嵌套

**HTTP方法使用规范**：
- GET：获取资源
- POST：创建资源
- PUT：完整更新资源
- PATCH：部分更新资源
- DELETE：删除资源

### 10.1.2 统一响应格式

**成功响应格式**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    // 具体数据
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "requestId": "uuid"
}
```

**分页响应格式**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "content": [],
    "page": 1,
    "size": 20,
    "total": 100,
    "totalPages": 5
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "requestId": "uuid"
}
```

**错误响应格式**：
```json
{
  "code": 400,
  "message": "参数错误",
  "error": {
    "type": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      }
    ]
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "requestId": "uuid"
}
```

### 10.1.3 错误码定义

**系统级错误码**：
- 200：成功
- 400：请求参数错误
- 401：未认证
- 403：权限不足
- 404：资源不存在
- 429：请求过于频繁
- 500：服务器内部错误

**业务级错误码**：
- 10001：用户不存在
- 10002：密码错误
- 10003：账号已禁用
- 20001：资源不存在
- 20002：资源已下架
- 20003：VIP资源权限不足
- 30001：下载次数超限
- 30002：下载链接失效

### 10.1.4 API版本控制

**版本策略**：
- URL路径版本：/api/v1/, /api/v2/
- 向后兼容原则：新版本保持旧版本兼容
- 版本生命周期：一个版本至少维护6个月
- 废弃通知：提前3个月通知版本废弃

**版本升级策略**：
- 渐进式升级：新功能先在新版本实现
- 灰度发布：按用户比例切换到新版本
- 兼容性测试：确保新版本不影响现有功能

### 10.1.5 接口权限矩阵

**普通用户权限**：
- GET /api/v1/resources：查看普通资源
- GET /api/v1/resources/{id}：查看资源详情
- POST /api/v1/auth/login：用户登录
- GET /api/v1/user/profile：查看个人资料
- PUT /api/v1/user/profile：更新个人资料

**VIP用户权限**：
- 包含普通用户所有权限
- GET /api/v1/vip/resources：查看VIP资源
- POST /api/v1/download：下载VIP资源
- POST /api/v1/request：提交求片请求

**管理员权限**：
- 包含VIP用户所有权限
- POST /api/v1/admin/resources：创建资源
- PUT /api/v1/admin/resources/{id}：更新资源
- DELETE /api/v1/admin/resources/{id}：删除资源
- GET /api/v1/admin/users：用户管理
- POST /api/v1/admin/notifications：发送系统通知

### 10.1.6 接口限流策略

**限流维度**：
- 用户维度：每个用户每分钟最多100次请求
- IP维度：每个IP每分钟最多200次请求
- 接口维度：不同接口设置不同限流阈值
- 全局限流：系统整体每秒最多1000次请求

**限流规则**：
- 普通用户：每分钟60次请求
- VIP用户：每分钟200次请求
- 管理员：每分钟500次请求
- 下载接口：每分钟最多10次请求

#### 数据库规范
- **命名规范**：表名、字段名规范
- **索引规范**：索引命名和使用规范
- **SQL规范**：SQL编写规范
- **事务规范**：事务使用规范
- **版本控制**：Flyway版本控制

## 11. API文档管理与监控

### 11.1 API文档管理

**文档聚合与管理**：
- **SpringDoc OpenAPI 3**：统一API文档生成和管理
- **Swagger UI**：交互式API文档界面
- **API版本控制**：支持多版本API并存
- **文档自动部署**：CI/CD自动更新API文档站点

**API网关文档集成**：
- **Spring Cloud Gateway** + **SpringDoc**：网关层聚合所有服务API
- **统一认证**：API文档访问权限控制
- **在线测试**：支持在文档页面直接测试API

**文档监控与告警**：
- **API变更追踪**：记录API版本变更历史
- **文档一致性检查**：确保文档与实际API一致
- **使用情况统计**：API调用频次和热门接口分析

### 11.2 接口监控与治理

**API性能监控**：
- **响应时间监控**：API响应时间分布统计
- **吞吐量监控**：QPS/TPS实时监控
- **错误率监控**：HTTP状态码和业务异常统计
- **并发监控**：接口并发请求数监控

**API治理功能**：
- **接口限流**：基于用户/IP/接口的精细化限流
- **熔断降级**：异常接口自动熔断和降级处理
- **流量染色**：测试流量和生产流量隔离
- **接口鉴权**：细粒度权限控制和访问审计

**监控告警系统**：
- **实时告警**：基于阈值和趋势的智能告警
- **告警收敛**：避免告警风暴的聚合机制
- **多渠道通知**：邮件、短信、企业微信、钉钉等
- **告警升级**：分级告警和自动升级机制

## 12. 监控与运维

### 12.1 监控体系

- **应用监控**：Spring Boot Admin, Actuator, Micrometer
- **服务监控**：Prometheus, Grafana, Thanos
- **日志监控**：ELK Stack (Elasticsearch, Logstash, Kibana)
- **系统监控**：Node Exporter, Cadvisor
- **告警机制**：AlertManager, 邮件, SMS, 企业微信/钉钉

### 11.2 日志体系

- **日志收集**：Logstash/Filebeat
- **日志存储**：Elasticsearch
- **日志展示**：Kibana
- **日志分析**：定期日志分析报告
- **审计日志**：关键操作审计

### 12.4 运维部署细节

#### 配置管理策略

**环境配置分离**：
- 开发环境：application-dev.yml
- 测试环境：application-test.yml
- 预生产环境：application-staging.yml
- 生产环境：application-prod.yml

**配置中心管理**：
- Nacos配置中心：统一管理所有配置
- 配置版本控制：支持配置回滚
- 动态配置更新：无需重启服务
- 配置加密：敏感配置加密存储

**配置优先级**：
1. 命令行参数
2. 环境变量
3. 外部配置文件
4. 内部配置文件

#### 日志管理规范

**日志级别定义**：
- ERROR：系统错误，需要立即处理
- WARN：警告信息，需要关注
- INFO：重要业务信息
- DEBUG：调试信息，仅开发环境使用

**日志格式标准**：
```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "level": "INFO",
  "logger": "com.knene.movie.service.ResourceService",
  "message": "Resource created successfully",
  "traceId": "abc123",
  "userId": "10001",
  "resourceId": "20001",
  "duration": 150,
  "status": "SUCCESS"
}
```

**日志分类存储**：
- 业务日志：用户操作、业务流程
- 系统日志：应用状态、性能指标
- 错误日志：异常信息、错误堆栈
- 审计日志：敏感操作、权限变更

#### 健康检查设计

**应用健康检查**：
- Spring Boot Actuator：/actuator/health
- 数据库连接检查：验证数据库连接状态
- 外部服务检查：验证依赖服务可用性
- 自定义健康指标：业务特定健康状态

**检查维度**：
- 应用状态：应用是否正常运行
- 数据库状态：数据库连接和查询是否正常
- 缓存状态：Redis连接和基本操作
- 磁盘空间：确保有足够的存储空间
- 内存使用：监控内存使用率

#### 备份与恢复策略

**数据备份策略**：
- 全量备份：每周日凌晨进行全量备份
- 增量备份：每日凌晨进行增量备份
- 实时备份：关键数据实时同步到备份库
- 异地备份：备份数据异地存储

**备份内容**：
- 数据库数据：MySQL、Redis数据
- 配置文件：应用配置、系统配置
- 用户文件：上传文件、图片资源
- 日志文件：重要日志文件备份

**恢复流程**：
1. 评估故障影响范围
2. 选择合适的备份版本
3. 执行数据恢复操作
4. 验证数据完整性
5. 恢复服务运行
6. 监控系统状态

#### 容器化与DevOps流水线

**Docker容器化**：
```dockerfile
# 多阶段构建优化镜像大小
FROM maven:3.9-openjdk-21 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:21-jre-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Kubernetes部署清单**：
```yaml
# 应用部署
apiVersion: apps/v1
kind: Deployment
metadata:
  name: movie-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: movie-backend
  template:
    metadata:
      labels:
        app: movie-backend
    spec:
      containers:
      - name: backend
        image: movie-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 5
---
# 服务暴露
apiVersion: v1
kind: Service
metadata:
  name: movie-backend-service
spec:
  selector:
    app: movie-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

**CI/CD流水线设计**：
```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Set up JDK 21
      uses: actions/setup-java@v3
      with:
        java-version: '21'
        distribution: 'temurin'
    - name: Run tests
      run: mvn clean test
    - name: Generate test report
      uses: dorny/test-reporter@v1
      if: success() || failure()
      with:
        name: Maven Tests
        path: target/surefire-reports/*.xml
        reporter: java-junit

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v3
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    - name: Login to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    - name: Build and push Docker image
      uses: docker/build-push-action@v4
      with:
        context: .
        push: true
        tags: ghcr.io/${{ github.repository }}:latest
    - name: Deploy to Kubernetes
      run: |
        echo "${{ secrets.KUBECONFIG }}" | base64 -d > kubeconfig
        export KUBECONFIG=kubeconfig
        kubectl set image deployment/movie-backend backend=ghcr.io/${{ github.repository }}:latest
        kubectl rollout status deployment/movie-backend
```

#### 部署策略

- **CI/CD流水线**：GitHub Actions/GitLab CI
- **蓝绿部署**：零停机部署，快速回滚
- **金丝雀发布**：灰度放量，A/B测试
- **滚动更新**：渐进式更新，保持服务可用性
- **自动化测试**：单元测试、集成测试、E2E测试

## 12.5 性能指标定义

### 12.5.1 系统性能目标

**响应时间指标**：
- API平均响应时间：< 200ms
- API95%响应时间：< 500ms
- 页面加载时间：< 2s
- 数据库查询时间：< 100ms

**并发能力指标**：
- QPS（每秒查询数）：> 1000
- TPS（每秒事务数）：> 500
- 并发用户数：> 1000
- 峰值处理能力：> 5000 QPS

**系统资源指标**：
- CPU使用率：< 70%
- 内存使用率：< 80%
- 磁盘使用率：< 85%
- 网络带宽：< 80%

### 12.5.2 业务性能指标

**用户相关指标**：
- 用户注册成功率：> 99%
- 用户登录响应时间：< 300ms
- 用户资料加载时间：< 500ms

**资源相关指标**：
- 资源搜索响应时间：< 500ms
- 资源详情加载时间：< 800ms
- 热门资源列表加载：< 300ms

**下载相关指标**：
- 下载链接生成时间：< 1s
- 下载统计更新时间：< 200ms
- VIP资源访问延迟：< 1s

### 12.5.3 性能测试策略

**压力测试**：
- 正常负载：预期流量的2倍
- 峰值负载：预期流量的5倍
- 极限负载：系统崩溃点测试

**基准测试**：
- 定期性能基准测试
- 新功能性能回归测试
- 数据库性能基准测试

**性能监控**：
- 实时性能指标监控
- 性能趋势分析
- 异常性能告警

## 12.6 业务流程细化

### 12.6.1 VIP充值流程

**充值流程设计**：
1. 用户选择VIP套餐
2. 系统生成支付订单
3. 用户选择支付方式
4. 跳转到支付网关
5. 支付网关处理支付
6. 支付结果回调通知
7. 系统更新用户VIP状态
8. 发送充值成功通知

**状态机设计**：
- 待支付：订单创建，等待用户支付
- 支付中：用户已发起支付，等待结果
- 支付成功：支付完成，VIP权限生效
- 支付失败：支付失败，订单关闭
- 已退款：用户申请退款，处理中
- 退款完成：退款成功，VIP权限撤销

**异常处理**：
- 支付超时：15分钟自动取消订单
- 网络异常：重试机制和人工介入
- 重复支付：自动检测并退款

### 12.6.2 资源审核流程

**审核流程设计**：
1. 爬虫获取资源信息
2. 系统自动审核基础信息
3. 内容合规性检查
4. 人工审核（如需要）
5. 审核通过，资源上架
6. 审核拒绝，资源退回

**审核规则**：
- 自动审核：检查资源基本信息完整性
- 合规检查：内容安全、版权合规
- 人工审核：复杂情况人工介入

**审核状态**：
- 待审核：资源进入审核队列
- 审核中：正在审核处理
- 审核通过：资源可以正常访问
- 审核拒绝：资源不合规，需要修改
- 已下架：资源从平台移除

### 12.6.3 用户行为分析

**数据采集维度**：
- 浏览行为：页面访问、停留时间
- 搜索行为：搜索关键词、搜索结果
- 下载行为：下载频率、下载偏好
- 互动行为：评论、收藏、评分

**分析指标**：
- 用户活跃度：日活、周活、月活
- 用户留存：1日留存、7日留存、30日留存
- 用户转化：注册转化、VIP转化
- 用户价值：LTV、ARPU值

**分析应用**：
- 个性化推荐：基于用户行为推荐
- 营销策略：精准营销活动设计
- 产品优化：基于数据优化产品功能

## 12.7 扩展性实现

### 12.7.1 插件系统设计

**插件架构**：
- 插件接口：定义标准插件接口
- 插件管理：插件加载、卸载、更新
- 插件配置：插件参数配置管理
- 插件隔离：插件间相互隔离

**插件类型**：
- 数据源插件：扩展资源数据源
- 处理插件：自定义数据处理逻辑
- 通知插件：扩展通知渠道
- 认证插件：扩展认证方式

**插件生命周期**：
- 插件加载：系统启动时加载插件
- 插件初始化：插件初始化配置
- 插件运行：插件正常运行
- 插件卸载：系统停止时卸载插件

### 12.7.2 多租户实现

**租户隔离策略**：
- 数据隔离：独立的数据库或Schema
- 应用隔离：租户级别的应用隔离
- 配置隔离：租户独立的配置管理

**租户管理**：
- 租户注册：新租户注册流程
- 租户配置：租户个性化配置
- 租户计费：基于使用量的计费
- 租户监控：租户级别的监控

**技术实现**：
- 租户拦截器：请求级别的租户识别
- 数据源路由：基于租户的数据源路由
- 配置管理：租户配置的动态管理

### 12.7.3 国际化实现

**多语言支持**：
- 消息国际化：错误消息、提示信息
- 内容国际化：资源描述、分类名称
- 界面国际化：前端界面多语言

**时区处理**：
- 用户时区：用户个性化时区设置
- 时区转换：时间的时区转换显示
- 时区存储：统一使用UTC存储

**本地化策略**：
- 地区特定：不同地区的特定需求
- 文化适应：符合当地文化习惯
- 法规合规：符合当地法律法规

## 12.8 监控体系完善

### 12.8.1 业务监控指标

**核心业务指标**：
- 用户注册数：新增用户趋势
- 活跃用户数：DAU、MAU统计
- VIP转化率：普通用户转VIP比例
- 资源下载量：下载次数和下载数据量

**业务健康指标**：
- 资源更新频率：新资源上线速度
- 用户满意度：用户评分和反馈
- 系统可用性：服务可用时间比例
- 响应时间：业务操作的响应时间

**业务异常监控**：
- 异常注册：虚假账号注册
- 异常下载：异常下载行为
- 支付异常：支付失败和退款
- 内容异常：违规内容检测

### 12.8.2 告警处理流程

**告警级别定义**：
- P0：严重告警，立即处理（系统不可用）
- P1：重要告警，1小时内处理（功能异常）
- P2：一般告警，4小时内处理（性能下降）
- P3：低级告警，24小时内处理（预警信息）

**告警处理流程**：
1. 告警触发：监控系统检测到异常
2. 告警通知：发送告警通知到相关负责人
3. 问题确认：确认告警的真实性和影响范围
4. 问题处理：采取措施解决问题
5. 恢复验证：验证问题是否已解决
6. 告警关闭：关闭告警并记录处理过程

**告警通知渠道**：
- 短信通知：P0、P1级别告警
- 邮件通知：所有级别告警
- 即时通讯：企业微信、钉钉群
- 电话通知：P0级别紧急告警

### 12.8.3 监控Dashboard设计

**系统监控Dashboard**：
- 服务器状态：CPU、内存、磁盘、网络
- 应用性能：响应时间、QPS、错误率
- 数据库性能：连接数、查询时间、锁等待
- 缓存性能：命中率、内存使用、连接数

**业务监控Dashboard**：
- 用户指标：注册数、活跃数、留存率
- 资源指标：资源数量、下载量、更新频率
- 收入指标：VIP收入、付费用户数
- 运营指标：用户反馈、问题处理量

**告警Dashboard**：
- 活跃告警：当前未处理的告警
- 告警趋势：告警数量趋势图
- 告警统计：告警级别、类型分布
- 处理效率：告警处理时间统计

## 12.9 测试体系

### 12.9.1 测试策略

**测试金字塔**：
- 单元测试：70%，快速反馈，业务逻辑验证
- 集成测试：20%，服务间集成测试
- 端到端测试：10%，用户场景测试

**测试类型**：
- 功能测试：业务功能正确性验证
- 性能测试：系统性能和负载能力
- 安全测试：安全漏洞和风险评估
- 兼容性测试：不同环境兼容性验证

**测试环境**：
- 开发环境：开发人员本地测试
- 测试环境：功能测试和集成测试
- 预生产环境：生产环境完整测试
- 生产环境：生产验证和监控

### 12.9.2 测试数据管理

**测试数据策略**：
- 数据生成：自动化生成测试数据
- 数据隔离：不同测试用例数据隔离
- 数据清理：测试完成后数据清理
- 数据脱敏：生产数据脱敏处理

**数据类型**：
- 基础数据：用户、资源等基础数据
- 边界数据：边界值和异常数据
- 性能数据：大量数据用于性能测试
- 安全数据：安全测试用例数据

### 12.9.3 自动化测试流程

**CI集成测试**：
- 代码提交触发自动测试
- 单元测试覆盖率检查
- 代码质量检查（SonarQube）
- 安全漏洞扫描

**部署流程测试**：
- 部署前自动化测试
- 部署后健康检查
- 回滚测试验证
- 性能回归测试

**监控测试**：
- 生产环境监控
- 性能指标监控
- 错误率监控
- 用户体验监控

## 12. 扩展性设计

### 12.1 技术扩展性

- **模块化设计**：功能模块化
- **插件化架构**：支持插件扩展
- **配置中心**：动态配置调整
- **服务注册发现**：动态服务注册
- **API版本控制**：支持多版本API

### 12.2 业务扩展性

- **业务事件驱动**：基于事件的扩展点
- **多租户支持**：支持业务隔离
- **国际化支持**：多语言支持
- **主题定制**：UI主题定制
- **业务配置化**：业务规则配置化

#### 多租户架构设计

**租户隔离策略**：

**数据库隔离**：
- **独立数据库**：每个大租户使用独立数据库
- **共享数据库独立Schema**：中等租户共享数据库但使用独立Schema
- **共享数据库共享Schema**：小租户完全共享数据库，通过tenant_id区分

**应用层隔离**：
```java
@Component
public class TenantInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String tenantId = extractTenantId(request);
        TenantContext.setCurrentTenant(tenantId);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        TenantContext.clear();
    }
}

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface TenantFilter {
    TenantIsolationType value() default TenantIsolationType.SHARED_DB;
}
```

**租户配置管理**：
```yaml
# 租户配置示例
tenants:
  - id: "tenant_001"
    name: "影视公司A"
    type: "ENTERPRISE"
    database:
      isolation: "DEDICATED"
      url: "jdbc:mysql://tenant001-db:3306/movie"
    features:
      - "custom_branding"
      - "advanced_analytics"
      - "api_access"
    limits:
      max_users: 1000
      storage_gb: 500
      api_calls_per_day: 100000

  - id: "tenant_002"
    name: "个人用户B"
    type: "PERSONAL"
    database:
      isolation: "SHARED_SCHEMA"
      schema: "tenant_002"
    features:
      - "basic_analytics"
    limits:
      max_users: 10
      storage_gb: 50
```

#### 国际化设计

**多语言支持架构**：

**消息资源管理**：
```properties
# messages_en.properties
user.welcome=Welcome to Movie Platform
resource.not.found=Resource not found
error.permission.denied=Permission denied

# messages_zh_CN.properties
user.welcome=欢迎使用影视平台
resource.not.found=资源未找到
error.permission.denied=权限不足

# messages_ja.properties
user.welcome=映画プラットフォームへようこそ
resource.not.found=リソースが見つかりません
error.permission.denied=アクセス拒否
```

**国际化拦截器**：
```java
@Component
public class I18nInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String language = request.getHeader("Accept-Language");
        if (StringUtils.isEmpty(language)) {
            language = request.getParameter("lang");
        }
        if (StringUtils.isEmpty(language)) {
            language = LocaleContextHolder.getLocale().getLanguage();
        }

        LocaleContextHolder.setLocale(Locale.forLanguageTag(language));
        return true;
    }
}
```

**内容本地化**：
```java
@Entity
public class LocalizedContent {
    @Id
    private Long id;

    private String contentKey;

    @ElementCollection
    @CollectionTable(name = "content_translations")
    @MapKeyColumn(name = "locale")
    @Column(name = "translation")
    private Map<String, String> translations = new HashMap<>();

    public String getTranslation(String locale) {
        return translations.getOrDefault(locale, translations.get("en"));
    }
}
```

**时区处理**：
```java
@Configuration
public class TimeZoneConfig {

    @Bean
    public TimeZoneAwareFormatter timeZoneAwareFormatter() {
        return new TimeZoneAwareFormatter();
    }

    @Bean
    public TimeZoneInterceptor timeZoneInterceptor() {
        return new TimeZoneInterceptor();
    }
}

@Component
public class TimeZoneService {

    public ZonedDateTime convertToUserTimeZone(ZonedDateTime utcTime, String userTimeZone) {
        return utcTime.withZoneSameInstant(ZoneId.of(userTimeZone));
    }

    public ZonedDateTime convertToUtc(LocalDateTime localTime, String userTimeZone) {
        return localTime.atZone(ZoneId.of(userTimeZone)).withZoneSameInstant(ZoneOffset.UTC);
    }
}
```

## 13. 开发规划

### 13.1 第一阶段：核心功能

- 用户系统基础实现
- 资源展示与管理
- 基础搜索功能
- VIP系统基础框架

### 13.2 第二阶段：爬虫与资源

- TorrentGalaxy爬虫
- SpringSunday爬虫
- 115网盘集成
- 资源处理流程自动化
- 资源失效自动处理系统

### 13.3 第三阶段：增强功能

- 消息中心
- 求片系统
- 智能求片处理系统
- 用户互动（评论、收藏）
- 高级搜索功能

### 13.4 第四阶段：优化与安全

- 性能优化
- 安全加固
- 用户体验改进
- 监控与日志系统

## 14. 商业模式与运营

### 14.1 盈利模式

- VIP会员订阅：月度/季度/年度计划
- 特定资源单次付费下载
- 定向广告投放（非侵入式）

### 14.2 用户增长

- SEO优化提高搜索引擎排名
- 内容质量保证与持续更新
- 用户推荐奖励计划
- 社交媒体引流

### 14.3 风险控制

- 版权风险规避策略
- 用户行为监控预警
- 资源合规性审核机制
- 应急响应预案

## 15. 数据统计与分析

### 15.1 用户行为统计

**统计数据收集**：
- 用户访问统计：PV、UV、访问时长、跳出率
- 下载行为统计：下载次数、下载数据量、热门资源
- 搜索行为统计：搜索关键词、搜索结果点击率
- 用户活跃度统计：日活、周活、月活用户数

**数据展示**：
- 管理后台数据仪表盘
- 实时数据监控大屏
- 定期数据报表生成

### 15.2 资源统计分析

**资源热度分析**：
- 资源下载量排行
- 资源评分统计
- 分类资源占比分析
- 资源更新频率统计

**用户偏好分析**：
- 用户分类偏好统计
- 下载时间分布分析
- 地域用户行为分析

## 16. 后续扩展方向

1. 移动客户端开发
2. 社区功能增强
3. 多语言支持
4. 内容创作者合作计划
5. 区块链版权保护
6. VR/AR观影体验

## 16. 项目成功指标

1. 活跃用户数量增长率
2. VIP转化率
3. 用户留存率
4. 资源覆盖广度与深度
5. 系统稳定性指标

## 17. 其他补充建议

- **安全与合规**：注意数据安全、访问控制和合规性，敏感操作需有日志和异常处理。
- **测试优先**：鼓励 TDD/单元测试，保证核心业务逻辑的可验证性。
- **持续集成**：建议集成 CI 工具，自动化构建、测试和部署。
- **代码评审**：推行代码评审制度，提升代码质量和团队协作。

---

> 本文档为影视资源下载网站后端完整文档，整合了架构设计、业务需求、技术规范等所有重要内容，适用于项目的整个生命周期。