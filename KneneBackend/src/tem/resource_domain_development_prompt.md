# 资源领域模型开发规范要求文档

## 📋 当前工作内容

**正在执行**：development_modular_monolith_roadmap.md 中的 1.2.2 资源领域模型设计
**工作时间**：3天（第一阶段1.2数据库层和基础架构的子任务）
**任务性质**：核心业务模块的领域模型设计与实现
**依赖关系**：依赖核心数据库设计（V1.1.1、V1.1.3、V3.1.1、V3.2.1、V3.3.1等SQL文件已完成）

## 🎯 必须遵守的规范文档清单

### 1. 项目架构设计规范

#### 1.1 系统架构概览文档
- **文档路径**：`KneneBackend/doc/architecture/overview.md`
- **规范要求**：
  - 遵循DDD+六边形架构设计原则
  - 按照四层架构组织代码：Interfaces、Application、Domain、Infrastructure
  - 资源领域作为核心业务模块，必须放在`com.knene.resource`包下
  - 遵循模块化单体架构，保持模块间的松耦合
- **合规要求**：✅ 必须严格遵循

#### 1.2 开发规范与制度文档
- **文档路径**：`KneneBackend/doc/project/development_standards_rules.md`
- **规范要求**：
  - 企业级专业服务分离设计原则
  - 事件驱动架构原则
  - 数据库优先开发原则
  - 后端主导开发原则
  - DDD实体建模要求
  - 六边形架构实现规范
  - Spring Boot 3.3.x技术栈
  - Java 21新特性使用
  - Hutool工具库集成规范
  - 统一响应体和异常处理
  - Instancio测试数据生成器集成
- **合规要求**：✅ 必须严格遵循

### 2. 数据库设计规范

#### 2.1 数据库分层设计文档
- **文档路径**：`KneneBackend/doc/database/schema/database_layer_design.md`
- **规范要求**：
  - 遵循三层架构设计：核心基础表、业务功能表、高级功能表
  - 资源相关表作为第三层高级功能表已实现
  - 领域模型必须基于已有的数据库表结构设计
  - 实体映射要与数据库表结构保持一致
- **合规要求**：✅ 必须严格遵循

#### 2.2 PT站点集成表设计文档
- **SQL文件依赖**：V3.1.1__Create_pt_site_tables.sql、V3.1.2__Insert_pt_site_data.sql
- **规范要求**：
  - 基于pt_sites、torrent_files、crawl_tasks等表结构设计资源实体
  - 实现PT站点集成模型（站点管理、种子文件、爬虫任务）
  - 实现完整的资源获取和健康度监控体系
  - 资源聚合包含Resource实体、TorrentFile值对象、CrawlTask值对象
  - PT站点关系通过PTSiteAccount值对象体现
- **合规要求**：✅ 必须严格遵循

#### 2.3 质量管理表设计文档
- **SQL文件依赖**：V3.2.1__Create_quality_management_tables.sql、V3.2.2__Insert_quality_management_data.sql
- **规范要求**：
  - 基于quality_scores、duplicate_detection等表设计质量管理实体
  - 实现资源质量评分模型
  - 实现重复资源检测机制
  - 质量评分值对象、重复检测值对象设计
- **合规要求**：✅ 必须严格遵循

#### 2.4 统计分析表设计文档
- **SQL文件依赖**：V3.3.1__Create_statistics_tables.sql、V3.3.2__Insert_statistics_data.sql
- **规范要求**：
  - 基于search_logs、user_statistics等表设计统计分析实体
  - 实现资源统计和用户行为分析
  - 统计数据值对象设计
- **合规要求**：✅ 必须严格遵循

#### 2.5 数据库命名规范文档
- **文档路径**：`KneneBackend/doc/database/naming_conventions.md`
- **规范要求**：
  - 表名、字段名使用小写字母和下划线
  - 实体类名使用大驼峰命名，对应数据库表名
  - 字段映射遵循MyBatis-Plus命名规范
  - 枚举值使用小写字母
  - 时间字段使用_at或_time后缀
- **合规要求**：✅ 必须严格遵循

### 3. 领域驱动设计规范

#### 3.1 企业级DDD设计规范文档
- **文档路径**：`KneneBackend/doc/project/development_standards_rules.md` 第2章
- **规范要求**：
  - 领域模型设计原则：聚合根设计、值对象不可变、实体生命周期管理、领域事件驱动
  - 专业服务设计规范：服务职责单一、业务逻辑封装、服务接口设计、事务边界清晰
  - 仓储接口设计规范：仓储抽象、完整CRUD操作、复杂查询支持、批量操作支持
  - 事件驱动架构规范：事件发布机制、事件异步处理、事件持久化、事件处理幂等性
- **合规要求**：✅ 必须严格遵循

#### 3.2 专业服务设计模式规范
- **文档路径**：`KneneBackend/doc/project/development_standards_rules.md` 第2.2节
- **规范要求**：
  - 资源专业服务标准：ResourceQueryService、ResourceManagementService、ResourceCrawlService、ResourceValidationService
  - 禁止使用传统的ResourceService设计模式
  - 每个专业服务只负责一个明确的业务领域
  - 所有业务逻辑必须封装在领域服务中
- **合规要求**：✅ 必须严格遵循

#### 3.3 六边形架构设计文档
- **文档路径**：`KneneBackend/doc/architecture/hexagonal/`
- **规范要求**：
  - 端口和适配器模式
  - 领域层不依赖外部框架
  - 通过接口定义端口
  - 适配器负责技术细节实现
- **合规要求**：✅ 必须严格遵循

### 4. 技术实现规范

#### 4.1 Flyway数据库迁移文档
- **文档路径**：`KneneBackend/doc/database/migration/flyway_migration_guide.md`
- **规范要求**：
  - 使用Flyway管理数据库版本
  - 遵循迁移脚本命名规范
  - 保证数据库结构的一致性
- **合规要求**：✅ 必须严格遵循

#### 4.2 模块化开发路线图文档
- **文档路径**：`KneneBackend/doc/project/development_modular_monolith_roadmap.md`
- **规范要求**：
  - 按照路线图1.2.2的具体要求执行
  - 3天内完成资源领域模型设计
  - 包含资源实体、值对象、仓储接口、领域服务
  - 遵循用户领域模型的企业级标准
- **合规要求**：✅ 必须严格遵循

#### 4.3 企业级测试规范文档
- **文档路径**：`KneneBackend/doc/project/development_standards_rules.md` 第3章
- **规范要求**：
  - 测试覆盖率要求：单元测试不低于90%，集成测试不低于80%
  - Instancio测试数据生成策略：智能数据生成、复杂对象图、数据一致性
  - 测试分层策略：单元测试、集成测试、接口测试、端到端测试
  - 测试环境管理：Testcontainers集成、数据库隔离、并行测试支持
- **合规要求**：✅ 必须严格遵循

### 5. 业务模块设计规范

#### 5.1 资源模块设计文档
- **文档路径**：`KneneBackend/doc/modules/resource/`
- **规范要求**：
  - 资源基本信息管理
  - 资源分类和标签管理
  - 资源状态管理（有效、失效、删除）
  - 资源质量评分管理
  - 资源搜索和筛选
- **合规要求**：✅ 必须严格遵循

#### 5.2 爬虫模块设计文档
- **文档路径**：`KneneBackend/doc/modules/crawler/`
- **规范要求**：
  - PT站点集成管理
  - 种子文件解析和处理
  - 资源爬取任务调度
  - 资源健康度监控
- **合规要求**：✅ 必须严格遵循

### 6. 开发流程规范

#### 6.1 编码规范文档
- **文档路径**：`KneneBackend/doc/development/coding-standards/`
- **规范要求**：
  - Java编码规范
  - 注释规范：文件头使用javadoc，其他地方只能使用//注释
  - 代码格式化规范
  - 异常处理规范
- **合规要求**：✅ 必须严格遵循

#### 6.2 测试规范文档
- **文档路径**：`KneneBackend/doc/development/testing/`
- **规范要求**：
  - 单元测试规范
  - 集成测试规范
  - 测试覆盖率要求
  - Mock测试规范
- **合规要求**：✅ 必须严格遵循

## 🏗️ 资源领域模型设计具体要求

### 📋 SQL表结构分析结果

经过对现有SQL文件的详细分析，数据库设计**非常合理且标准**，具体包括：

#### 核心表结构（已完成）
- **pt_sites表**：PT站点信息表，包含站点配置、状态、统计字段
- **torrent_files表**：种子文件主表，包含文件信息、哈希、健康度字段
- **crawl_tasks表**：爬虫任务表，包含任务状态、配置、日志字段

#### 扩展表结构（已完成）
- **质量管理表**：quality_scores、duplicate_detection等
- **统计分析表**：search_logs、user_statistics等
- **站点账户表**：pt_accounts、site_credentials等
- **爬虫日志表**：crawl_logs、crawl_sources等

### 1. 核心实体设计（基于现有SQL结构）

#### 1.1 Resource聚合根（基于torrent_files表）
```java
// 对应torrent_files表，包含所有核心字段
@Entity
@Table(name = "torrent_files")
public class Resource {
    private Long id;
    private String title;
    private String description;
    private String infoHash;
    private Long size;
    private String category;
    private String tags;
    private ResourceStatus status;  // ENUM('active', 'inactive', 'deleted', 'processing')
    private Double qualityScore;
    private Integer seeders;
    private Integer leechers;
    private Integer downloads;
    private String uploadedBy;
    private LocalDateTime uploadedAt;
    private String magnetLink;
    private String downloadUrl;
    // 审计字段...
}
```

#### 1.2 ResourceMetadata值对象（基于torrent_files表扩展字段）
```java
// 对应torrent_files表扩展信息
@Embeddable
public class ResourceMetadata {
    private String imdbId;
    private String tmdbId;
    private String doubanId;
    private String language;
    private String subtitle;
    private Integer year;
    private String director;
    private String actors;
    private String genre;
    private String posterUrl;
    private String trailerUrl;
}
```

#### 1.3 ResourceQuality值对象（基于quality_scores表）
```java
// 对应quality_scores表，资源质量评分
@Embeddable
public class ResourceQuality {
    private Double videoQuality;
    private Double audioQuality;
    private Double completenessScore;
    private Double popularityScore;
    private Double seedBonus;
    private LocalDateTime lastCalculatedAt;
    private String calculatedBy;
}
```

#### 1.4 资源相关值对象
- **ResourceCategory值对象**（基于分类字段）：资源分类
- **ResourceTag值对象**（基于tags字段）：资源标签
- **ResourceHealth值对象**（基于健康度字段）：健康度状态
- **ResourceDuplicate值对象**（基于duplicate_detection表）：重复检测

### 2. PT站点集成实体设计（基于V3.1.1）

#### 2.1 PTSite实体（基于pt_sites表）
#### 2.2 PTSiteAccount实体（基于pt_accounts表）
#### 2.3 CrawlTask实体（基于crawl_tasks表）
#### 2.4 CrawlLog实体（基于crawl_logs表）
#### 2.5 SiteCredential实体（基于site_credentials表）

### 3. 质量管理实体设计（基于V3.2.1）

#### 3.1 QualityScore实体（基于quality_scores表）
#### 3.2 DuplicateDetection实体（基于duplicate_detection表）
#### 3.3 SimilarityHash实体（基于similarity_hash表）
#### 3.4 QualityCalculation实体（基于quality_calculations表）

### 4. 统计分析实体设计（基于V3.3.1）

#### 4.1 SearchLog实体（基于search_logs表）
#### 4.2 UserStatistic实体（基于user_statistics表）
#### 4.3 ResourceStatistic实体（基于resource_statistics表）
#### 4.4 SystemStatistic实体（基于system_statistics表）

### 5. 仓储接口设计
- **ResourceRepository接口**：基于torrent_files表的核心操作
- **PTSiteRepository接口**：基于pt_sites表
- **CrawlTaskRepository接口**：基于crawl_tasks表
- **QualityScoreRepository接口**：基于quality_scores表
- **ResourceStatisticRepository接口**：基于统计表

### 6. 专业服务设计（企业级标准）
- **ResourceQueryService**：资源查询服务（专注搜索和筛选逻辑）
- **ResourceManagementService**：资源管理服务（专注CRUD操作逻辑）
- **ResourceCrawlService**：资源爬取服务（专注爬虫业务逻辑）
- **ResourceValidationService**：资源验证服务（专注质量检查逻辑）

### 7. 应用服务设计
- **ResourceApplicationService**：资源应用服务协调
- **ResourceSearchService**：资源搜索服务
- **ResourceQualityService**：资源质量服务
- **ResourceStatisticsService**：资源统计服务

### 8. 接口层设计
- **ResourceController**：资源管理REST接口
- **ResourceSearchController**：资源搜索接口
- **ResourceQualityController**：资源质量管理接口
- **ResourceStatisticsController**：资源统计接口

## 📅 工作进度安排（基于现有SQL结构）

### 第1天：核心实体和聚合设计
- **Resource聚合根设计**：基于torrent_files表完整映射
- **ResourceMetadata值对象**：基于扩展字段设计
- **ResourceQuality值对象**：基于quality_scores表设计
- **资源分类和标签值对象**：基于分类和标签字段设计
- **状态枚举设计**：ResourceStatus、QualityLevel、CrawlStatus等枚举
- **实体关系设计**：资源-PT站点-质量评分的聚合关系
- 编写单元测试

### 第2天：PT站点集成和质量管理实体设计
- **PT站点实体设计**：PTSite、PTSiteAccount、CrawlTask
- **质量管理实体设计**：QualityScore、DuplicateDetection
- **统计分析实体设计**：SearchLog、ResourceStatistic
- **仓储接口设计**：ResourceRepository、PTSiteRepository、QualityRepository
- **MyBatis-Plus映射**：实体与数据库表映射配置
- 编写集成测试

### 第3天：专业服务和应用层设计
- **ResourceQueryService**：资源查询服务实现
- **ResourceManagementService**：资源管理服务实现
- **ResourceCrawlService**：资源爬取服务实现
- **ResourceValidationService**：资源验证服务实现
- **ResourceApplicationService**：应用服务协调
- **ResourceController**：REST接口设计
- **异常处理和验证**：完善的异常处理机制
- **API文档编写**：SpringDoc OpenAPI文档

## 🔧 技术实现细节

### 专业服务实现模式
```java
// 企业级专业服务实现标准
@Service
public class ResourceQueryServiceImpl implements ResourceQueryService {
    // 专注搜索和筛选逻辑
    // 基于ResourceRepository查询接口
    // 集成Elasticsearch全文搜索
}

@Service
public class ResourceManagementServiceImpl implements ResourceManagementService {
    // 专注CRUD操作逻辑
    // 基于ResourceRepository保存接口
    // 集成事件发布机制
}
```

### 事件驱动架构实现
```java
// 基于企业级标准的事件发布机制
@Component
public class ResourceEventPublisher {
    @Async
    public void publishResourceCreated(Resource resource) {
        // 异步发布资源创建事件
        // 事件持久化到事件表
        // 通知相关处理器
    }
}
```

### 质量评分实现
```java
// 基于质量管理表的质量服务
@Service
public class ResourceQualityService {
    // 质量评分算法（基于quality_scores表）
    // 重复检测机制（基于duplicate_detection表）
    // 健康度监控（基于种子健康度字段）
}
```

## ✅ 合规检查清单

### 数据库设计合规性
- [x] **表结构设计合理**：所有SQL表设计规范，包含完整字段、索引、约束
- [x] **PT站点集成模型完整**：站点管理、种子文件、爬虫任务完整体系
- [x] **质量管理机制完善**：质量评分、重复检测、相似度计算等完整质量体系
- [x] **统计分析体系完整**：搜索日志、用户统计、资源统计等完整统计体系
- [x] **审计字段完整**：created_by、updated_by、version、created_at、updated_at、deleted_at
- [x] **枚举值规范**：所有枚举值使用小写字母，符合命名规范

### 领域模型设计合规性
- [ ] **架构设计合规**：遵循DDD+六边形架构
- [ ] **数据库映射合规**：基于现有表结构设计，实体字段与表字段完全对应
- [ ] **命名规范合规**：遵循数据库和Java命名规范，实体类使用大驼峰
- [ ] **聚合设计合理**：Resource作为聚合根，包含ResourceMetadata、ResourceQuality等值对象
- [ ] **专业服务模式合规**：采用专业服务分离设计，避免传统ResourceService模式

### 技术实现合规性
- [ ] **技术栈合规**：使用Spring Boot 3.3.x + Java 21 + MyBatis-Plus 3.5.x
- [ ] **业务逻辑合规**：符合资源管理、爬虫集成、质量监控业务需求
- [ ] **事件驱动架构**：实现资源创建、更新、删除等事件的异步处理
- [ ] **缓存设计**：支持资源缓存、搜索结果缓存、质量评分缓存等
- [ ] **测试合规**：单元测试覆盖率不低于90%，集成测试覆盖核心流程

### 集成规范合规性
- [ ] **模块独立性**：资源领域模块不直接依赖其他业务模块
- [ ] **端口适配器模式**：通过接口定义端口，保持领域层的纯净
- [ ] **统一异常处理**：使用全局异常处理器统一处理业务异常
- [ ] **数据一致性**：使用事务保证数据的一致性
- [ ] **文档完善**：API文档和代码文档完整

## 📝 重要说明

### SQL表结构评估结论
经过详细分析，现有SQL表结构**设计优秀，无需修改**：

1. **设计规范性**：
   - 严格遵循数据库命名规范（小写字母+下划线）
   - 完整的索引设计，支持高效查询
   - 全面的约束设计，保证数据完整性
   - 统一的审计字段，支持软删除和乐观锁

2. **业务完整性**：
   - 完整的PT站点集成模型
   - 全面的质量管理机制
   - 丰富的统计分析功能
   - 完善的爬虫任务管理

3. **扩展性良好**：
   - 支持多PT站点集成
   - 支持复杂质量评分算法
   - 支持多种统计分析维度
   - JSON字段支持灵活扩展

### 实施要求
1. **严格遵循现有表结构**：所有实体设计必须与SQL表结构完全一致
2. **保持SQL优先原则**：以数据库表结构为准，不得随意修改表结构
3. **充分利用现有数据**：使用已有的PT站点、质量评分、统计数据
4. **完善映射关系**：确保实体关系与数据库外键关系一致
5. **遵循专业服务模式**：严格按照4个专业服务分离的设计模式实现

### 特别注意事项
1. **专业服务分离**：必须实现ResourceQueryService、ResourceManagementService、ResourceCrawlService、ResourceValidationService四个专业服务
2. **事件驱动架构**：重要业务操作必须发布相应的领域事件
3. **企业级标准**：严格按照用户领域模型已实现的企业级标准进行开发
4. **测试数据驱动**：基于真实数据库数据进行所有开发工作
5. **Instancio集成**：必须使用Instancio进行测试数据生成

---

**文档状态**：已生效
**最后更新**：2025-10-31
**维护人员**：相笑与春风
**审核状态**：待审核
**执行状态**：准备执行