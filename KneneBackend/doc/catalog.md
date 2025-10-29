# 影视资源下载网站项目文档目录

## 📚 文档索引

本文档提供影视资源下载网站后端项目的完整技术文档索引，按照技术模块和开发阶段进行组织。

## 🎯 快速导航

### 新手入门
1. 📋 **开发路线图** → [development_modular_monolith_roadmap.md](project/development_modular_monolith_roadmap.md)
2. 🔧 **开发规范** → [development_standards_rules.md](project/development_standards_rules.md)
3. 📖 **完整文档** → [backend_complete_documentation.md](project/backend_complete_documentation.md)

### 1.1.1 数据库架构规范制定阶段
- 🗄️ **数据库架构规范** → [database/schema_design_standards.md](database/schema_design_standards.md)
- 🏷️ **命名规范** → [database/naming_conventions.md](database/naming_conventions.md)
- 📊 **索引设计指导** → [database/index_design_guidelines.md](database/index_design_guidelines.md)
- 🔒 **数据完整性规则** → [database/data_integrity_rules.md](database/data_integrity_rules.md)
- 📈 **Flyway版本管理** → [database/flyway_migration_guide.md](database/flyway_migration_guide.md)

### 架构设计
- 🏗️ **系统架构总览** → [architecture/overview.md](architecture/overview.md)
- 🗂️ **数据库分层设计** → [architecture/database_layer_design.md](architecture/database_layer_design.md)
- 🛠️ **技术栈指南** → [architecture/technology_stack_guide.md](architecture/technology_stack_guide.md)

### 基础设施
- ⚙️ **开发环境搭建** → [infrastructure/development_setup_guide.md](infrastructure/development_setup_guide.md)
- 🐳 **Docker配置** → [infrastructure/docker_configuration.md](infrastructure/docker_configuration.md)
- 🗄️ **Redis配置** → [infrastructure/redis_configuration.md](infrastructure/redis_configuration.md)

### 开发工具
- 🧰 **Hutool使用指南** → [development/hutool_usage_guide.md](development/hutool_usage_guide.md)
- 🧪 **Instancio测试指南** → [development/instancio_testing_guide.md](development/instancio_testing_guide.md)
- ✨ **编码最佳实践** → [development/coding_best_practices.md](development/coding_best_practices.md)
- 🔗 **Claude Code MCP配置** → [../../.claude/README.md](../../.claude/README.md)

## 📂 文档目录结构

```
KneneBackend/doc/
├── catalog.md                    # 📚 文档索引（当前文件）
├── CHANGELOG.md                  # 📝 项目变更记录
├── development_checklist.md       # ✅ 开发检查清单
├── architecture/                 # 🏗️ 架构设计文档
├── database/                     # 🗄️ 数据库设计文档
├── infrastructure/               # 🔧 基础设施文档
├── development/                  # 🛠️ 开发工具文档
└── project/                      # 📋 项目管理文档
```

## 🔍 文档使用指南

### 按开发阶段查找文档

#### 1. 数据库设计阶段
- 🗄️ 查看数据库设计规范和最佳实践
- 📊 学习索引设计原则和优化策略
- 📈 了解Flyway数据库版本管理

#### 2. 架构设计阶段
- 🏗️ 理解系统整体架构和技术选型
- 🗂️ 学习分层架构设计原则
- 🛠️ 熟悉技术栈使用方法

#### 3. 环境搭建阶段
- ⚙️ 按照开发环境搭建指南配置环境
- 🐳 使用Docker进行容器化部署
- 🗄️ 配置Redis缓存系统

#### 4. 编码开发阶段
- 🧰 使用Hutool工具类提高开发效率
- 🧪 运用Instancio进行测试数据生成
- ✨ 遵循编码最佳实践保证代码质量

### 按技术主题查找文档

#### 数据库相关
- 表结构设计规范
- 索引优化策略
- 数据完整性约束
- 版本管理实践

#### 技术架构相关
- 单体架构设计
- DDD领域建模
- 六边形架构实践
- 技术栈选型

#### 工具使用相关
- 开发工具配置
- 代码生成工具
- 测试工具使用
- 监控工具配置

## 📝 文档维护规范

### 更新原则
- 🔄 **同步更新**：代码变更时同步更新相关文档
- 📅 **定期检查**：每月检查文档的准确性和完整性
- 🏷️ **版本标记**：重要更新在文档中标记版本信息

### 贡献指南
- 📝 **清晰表达**：使用清晰、准确的语言描述技术内容
- 🔗 **交叉引用**：相关文档之间添加交叉引用链接
- 📋 **示例完整**：代码示例要完整、可运行
- 🎯 **目标明确**：每个文档都要有明确的目标读者群

---

**文档维护**：本文档随项目发展持续更新
**最后更新**：2024-10-29
**维护人员**：开发团队