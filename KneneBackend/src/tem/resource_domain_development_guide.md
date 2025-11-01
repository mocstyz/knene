# 1.2.2 资源领域模型开发指南 ✅ **企业级标准**

## 🎯 开发目标
基于已实现的企业级架构标准，开发1.2.2资源领域模型，采用专业服务分离模式和事件驱动架构。

## 📋 必须遵循的核心规范文档

### 1. 企业级开发规范 🏆 **核心标准**
- **文档**: `doc/project/development_standards_rules.md`
- **必须遵守章节**:
  - 1.1 专业服务分离设计原则 ⭐⭐⭐
  - 1.2 事件驱动架构原则 ⭐⭐⭐
  - 1.4 后端主导开发原则（增强标准）
  - 2.2 专业服务设计规范 ⭐⭐⭐
  - 2.3 仓储接口设计规范 ⭐⭐⭐
  - 2.4 事件驱动架构规范 ⭐⭐⭐

### 2. 企业级DDD设计规范 🏗️ **架构标准**
- **文档**: `doc/project/development_standards_rules.md`
- **必须遵守章节**:
  - 2.1 领域模型设计原则
  - 2.2 专业服务设计规范（重点）
  - 2.4 事件驱动架构规范（重点）

### 3. 企业级测试规范 🧪 **现代化标准**
- **文档**: `doc/project/development_standards_rules.md`
- **必须遵守章节**:
  - 3.1 测试覆盖率要求（Instancio集成标准）
  - 3.2 测试数据生成策略
  - 3.3 测试分层策略
  - 3.4 测试环境管理

## 📋 必须遵循的路线图标准

### 4. 企业级架构模式标准 🏆 **已实现**
- **文档**: `doc/project/development_modular_monolith_roadmap.md`
- **必须遵循章节**:
  - 1.2.2 资源领域模型（优先级：最高）- 3天 ⭐⭐⭐
  - 特别注意：必须采用用户领域模型的企业级标准

### 5. 资源领域模型具体标准 🎯 **参考用户领域模型**
- **文档**: `doc/project/development_modular_monolith_roadmap.md`
- **必须遵循设计模式**:
  - 资源专业服务接口设计模式
  - 资源仓储接口设计标准
  - 资源事件机制设计

### 6. 后续实施参考标准 🔧 **已实现模式**
- **文档**: `doc/project/development_modular_monolith_roadmap.md`
- **参考已更新章节**:
  - 2.6.4 后端：资源管理专业服务实现 ⭐⭐⭐
  - 2.6.5 前端：资源展示系统适配

## 🏗️ 必须遵守的架构设计文档

### 7. 企业级架构总览 🏆 **已实现标准**
- **文档**: `doc/architecture/overview.md`
- **必须遵循章节**:
  - 1. 专业服务分离架构原则
  - 2. 企业级DDD领域驱动设计
  - 3. 企业级事件驱动架构

## 📋 必须遵守的数据库设计标准

### 8. 数据库架构规范 🗄️ **核心标准**
- **文档**: `doc/database/schema/schema_design_standards.md`
- **必须遵守**: 所有表结构设计、命名规范、索引设计

### 9. 数据库命名规范 🏷️ **必须遵循**
- **文档**: `doc/database/naming_conventions.md`
- **必须遵循**: 表名、字段名、索引名命名规范

## 🎯 企业级资源领域模型具体实施标准

### 📝 必须实现的资源专业服务
- **ResourceQueryService**: 资源查询和搜索业务逻辑
- **ResourceManagementService**: 资源CRUD操作业务逻辑
- **ResourceCrawlService**: 资源爬取业务逻辑
- **ResourceValidationService**: 资源验证业务逻辑

### 📝 必须实现的资源仓储接口
- **ResourceRepository**: 50+个方法的完整接口
- **CategoryRepository**: 分类管理接口
- **TagRepository**: 标签管理接口

### 📝 必须实现的资源事件机制
- **ResourceEventPublisher**: 资源事件发布器
- **关键领域事件**: ResourceCreated、ResourceUpdated、ResourceDeleted等

### 📝 必须实现的资源实体
- **Resource** 资源聚合根
- **ResourceType、ResourceStatus** 值对象
- **ResourceMetadata** 资源元数据模型

## ⚠️ 特别注意事项

### 禁止使用的传统设计模式
- ❌ **禁止**: ResourceService（违反专业服务分离原则）
- ❌ **禁止**: 单体仓储设计（不符合企业级标准）

### 必须使用的企业级设计模式
- ✅ **必须**: 专业服务分离设计
- ✅ **必须**: 事件驱动架构
- ✅ **必须**: Instancio测试数据生成器
- ✅ **必须**: Testcontainers集成测试

## 📚 参考的已实现企业级标准
- **用户领域模型**: `src/tem/complete.txt` - 作为企业级标准参考
- **开发规范**: `src/tem/domain_user_rules.txt` - 用户领域实际实现标准

**开发时间**：3天（按照路线图1.2.2章节安排）
**架构标准**：必须与已实现的企业级用户领域模型保持一致