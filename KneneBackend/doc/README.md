# 影视资源下载网站后端项目文档索引

## 📚 文档目录结构

本项目文档采用模块化组织结构，与代码目录结构保持一致，便于查找和维护。

### 🎯 项目级文档 (project/)
- **[开发规范文档](./project/development_standards_rules.md)** - 项目的编码规范、架构原则和开发流程
- **[模块化单体开发路线图](./project/development_modular_monolith_roadmap.md)** - 模块化单体架构的开发计划
- **[微服务开发路线图](./archived/development_micro_service_roadmap.md)** - 微服务架构的演进计划
- **[完整后端文档](./project/backend_complete_documentation.md)** - 后端系统的完整技术文档

### 🏗️ 业务模块文档 (modules/)
业务模块文档与 `src/main/java/com/knene/` 目录结构完全对应：

#### 核心业务模块
- **[auth/](./modules/auth/)** - 认证授权模块
- **[user/](./modules/user/)** - 用户管理模块
- **[resource/](./modules/resource/)** - 资源管理模块
- **[content/](./modules/content/)** - 内容管理模块
- **[vip/](./modules/vip/)** - VIP会员模块

#### 功能扩展模块
- **[search/](./modules/search/)** - 搜索推荐模块
- **[crawler/](./modules/crawler/)** - 爬虫采集模块
- **[payment/](./modules/payment/)** - 支付系统模块
- **[notification/](./modules/notification/)** - 通知推送模块
- **[download/](./modules/download/)** - 下载管理模块

#### 新增业务模块
- **[request/](./modules/request/)** - 求片功能模块
- **[signin/](./modules/signin/)** - 签到系统模块
- **[points/](./modules/points/)** - 积分系统模块
- **[exchange/](./modules/exchange/)** - 兑换系统模块
- **[compliance/](./modules/compliance/)** - 合规管理模块
- **[advertisement/](./modules/advertisement/)** - 广告系统模块

#### 运营分析模块
- **[analytics/](./modules/analytics/)** - 数据分析模块
- **[quality/](./modules/quality/)** - 质量管理模块
- **[monitoring/](./modules/monitoring/)** - 监控系统模块

### 🏛️ 架构设计文档 (architecture/)
- **[ddd/](./architecture/ddd/)** - 领域驱动设计文档
- **[hexagonal/](./architecture/hexagonal/)** - 六边形架构文档
- **[database/](./architecture/database/)** - 数据库架构设计
- **[cache/](./architecture/cache/)** - 缓存架构设计
- **[security/](./architecture/security/)** - 安全架构设计
- **[deployment/](./architecture/deployment/)** - 部署架构设计

### 🔧 基础设施文档 (infrastructure/)
- **[storage/](./infrastructure/storage/)** - 存储设施文档
- **[monitoring/](./infrastructure/monitoring/)** - 监控设施文档
- **[external/](./infrastructure/external/)** - 外部服务集成文档

### 🚀 部署相关文档 (deployment/)
- **[docker/](./deployment/docker/)** - Docker容器化部署
- **[kubernetes/](./deployment/kubernetes/)** - K8s集群部署
- **[nginx/](./deployment/nginx/)** - Nginx配置文档
- **[monitoring/](./deployment/monitoring/)** - 监控系统部署
- **[ci-cd/](./deployment/ci-cd/)** - CI/CD流水线配置

### 🗄️ 数据库设计文档 (database/)
- **[schema/](./database/schema/)** - 数据库表结构文档
  - **[database_layer_design.md](./database/schema/database_layer_design.md)** - 数据库分层设计原则（✅ 已完成三层架构）
  - **[README.md](./database/schema/README.md)** - 数据库设计文档索引
- **[migration/](./database/migration/)** - 数据库迁移文档
- **[index/](./database/index/)** - 索引设计文档
- **[optimization/](./database/optimization/)** - 数据库优化文档
- **[redis_design.md](./database/redis_design.md)** - Redis缓存设计

**数据库架构状态**：
- ✅ **第一层：核心基础表** - [用户权限](../src/main/resources/db/migration/V1.1.1__Create_user_permission_core_tables.sql)、[系统配置](../src/main/resources/db/migration/V1.1.3__Create_system_core_tables.sql)（已完成）
- ✅ **第二层：业务功能表** - [认证权限](../src/main/resources/db/migration/V2.1.1__Create_auth_extension_tables.sql)、[VIP业务](../src/main/resources/db/migration/V2.1.3__Create_vip_business_tables.sql)、[用户中心](../src/main/resources/db/migration/V2.1.5__Create_user_center_tables.sql)、资源管理（已完成）
- ✅ **第三层：高级功能表** - [PT站点集成](../src/main/resources/db/migration/V3.1.1__Create_pt_site_tables.sql)、[质量管理](../src/main/resources/db/migration/V3.2.1__Create_quality_management_tables.sql)、[监控分析](../src/main/resources/db/migration/V3.3.1__Create_statistics_tables.sql)（已完成）

### 👨‍💻 开发相关文档 (development/)
- **[coding-standards/](./development/coding-standards/)** - 编码规范详细说明
- **[testing/](./development/testing/)** - 测试规范文档
- **[git-workflow/](./development/git-workflow/)** - Git工作流规范
- **[code-review/](./development/code-review/)** - 代码评审标准

### 📖 用户指南文档 (user-guide/)
- **[getting-started/](./user-guide/getting-started/)** - 快速开始指南
- **[api-usage/](./user-guide/api-usage/)** - API使用指南
- **[troubleshooting/](./user-guide/troubleshooting/)** - 故障排除指南

## 📝 文档使用指南

### 开发流程
1. **功能开发前**：在对应模块目录下创建设计文档（如 `modules/request/design.md`）
2. **API设计阶段**：在模块目录下记录API文档（如 `modules/request/api.md`）
3. **测试阶段**：在模块目录下编写测试文档（如 `modules/request/testing.md`）

### 文档命名规范
- 设计文档：`design.md`
- API文档：`api.md`
- 测试文档：`testing.md`
- 其他文档：根据内容自定义命名，如 `database-optimization.md`

### 文档更新原则
- 代码变更时同步更新相关文档
- 重大功能更新后更新路线图文档
- 架构变更后更新架构设计文档

## 🔍 快速导航

### 新手入门
1. 阅读 [开发规范文档](./project/development_standards_rules.md) 了解项目规范
2. 查看 [模块化单体开发路线图](./project/development_modular_monolith_roadmap.md) 了解整体规划
3. 根据负责模块查看对应的业务模块文档

### 功能开发
1. 在 `modules/` 目录下找到对应业务模块
2. 查看现有的设计文档和API文档
3. 根据规范编写新功能的设计文档
4. 开发完成后更新API文档和测试文档

### 问题排查
1. 查看 [故障排除指南](./user-guide/troubleshooting/)
2. 查看相关模块的文档
3. 查看架构设计文档了解系统原理

---

**文档维护**：本文档随项目结构变化及时更新
**最后更新**：2025-10-30
**维护人员**：相笑与春风