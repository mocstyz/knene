# 数据库验证脚本规范文档

## 概述

本文档定义了影视资源下载网站项目的数据库验证脚本标准规范，确保数据完整性、业务逻辑正确性和系统健康度。

## 规范目标

- **数据完整性保证**：确保所有表的数据完整、一致、准确
- **业务逻辑验证**：深入验证业务规则的正确性
- **自动化集成**：支持迁移后自动执行和定期检查
- **详细报告**：提供全面的验证结果和改进建议
- **持续监控**：支持历史趋势分析和健康度评估

## 验证框架设计

### 三层验证深度

#### Level 1: 基础数据验证（所有模块必需）
- **数据完整性检查**：必填字段、外键约束、数据格式
- **结构完整性验证**：表结构、索引、约束条件
- **基础业务规则**：状态枚举值、数值范围、唯一性约束

#### Level 2: 业务规则验证（核心业务模块）
- **业务逻辑一致性**：跨表数据关联、状态流转规则
- **时间序列验证**：创建时间、更新时间、时间戳一致性
- **数量关系验证**：统计数据的准确性、汇总数据一致性

#### Level 3: 高级分析验证（成熟业务模块）
- **历史数据趋势分析**：数据增长模式、异常波动检测
- **用户行为模式验证**：用户操作模式、行为特征分析
- **性能相关验证**：查询性能指标、索引使用效率

### 四级警告体系

#### CRITICAL（严重）- 🔴 必须立即处理
**定义标准**：
- 影响系统基本功能的数据问题
- 存在数据丢失或安全风险
- 导致系统无法正常运行

**处理策略**：记录错误、阻止后续流程、立即告警

**示例场景**：
- 用户表数据损坏或丢失
- 权限表外键约束失效
- 核心配置表数据异常
- 支付记录数据不一致

#### ERROR（错误）- 🟡 影响功能但可继续运行
**定义标准**：
- 业务逻辑错误但不影响系统基本功能
- 数据不一致但不影响核心业务
- 功能异常但系统仍可运行

**处理策略**：记录错误、允许继续运行、通知开发团队

**示例场景**：
- 订单金额与支付记录不符
- 用户状态与权限冲突
- VIP会员状态异常
- 统计数据计算错误

#### WARN（警告）- 🟠 潜在风险需要关注
**定义标准**：
- 数据质量问题但不影响功能
- 性能相关问题但可以接受
- 配置问题但不影响正常运行

**处理策略**：记录警告、记录日志、建议优化

**示例场景**：
- 数据量异常增长
- 索引使用率过低
- 用户活跃度异常变化
- 存储空间使用率过高

#### INFO（信息）- 🔵 提示和建议
**定义标准**：
- 优化建议和改进提示
- 统计信息和趋势提醒
- 系统健康度指标

**处理策略**：记录信息、生成报告、供参考分析

**示例场景**：
- 用户注册趋势变化
- 功能使用频率统计
- 系统性能指标报告
- 业务数据分析结果

## 验证脚本标准结构

### 标准模板格式

```sql
-- ====================================================================
-- [模块名称] 数据库验证脚本
-- ====================================================================
-- 版本：V[版本号]
-- 描述：验证[模块名称]相关表的完整性和业务逻辑
-- 作者：数据库团队
-- 日期：[创建日期]
-- 验证级别：[Level 1/2/3]
-- ====================================================================

-- 设置SQL模式
SET NAMES utf8mb4;

-- 验证开始标记
SELECT '=== [模块名称]验证开始 ===' as verification_status;

-- ====================================================================
-- 1. 基础信息检查
-- ====================================================================
-- 表存在性、数据量统计、基本信息

-- ====================================================================
-- 2. Level 1: 基础数据验证
-- ====================================================================
-- 数据完整性、格式正确性、外键约束

-- ====================================================================
-- 3. Level 2: 业务规则验证（如果适用）
-- ====================================================================
-- 业务逻辑一致性、状态流转、数量关系

-- ====================================================================
-- 4. Level 3: 高级分析验证（如果适用）
-- ====================================================================
-- 历史趋势、用户行为、性能分析

-- ====================================================================
-- 5. 跨模块关联验证
-- ====================================================================
-- 与其他模块的数据一致性检查

-- ====================================================================
-- 6. 性能和质量检查
-- ====================================================================
-- 索引使用、数据分布、性能指标

-- ====================================================================
-- 7. 问题汇总和报告
-- ====================================================================
-- 错误统计、警告汇总、改进建议

-- 验证完成标记
SELECT '=== [模块名称]验证完成 ===' as verification_status;
```

### 详细报告格式

#### 第一层：执行概览
```sql
-- 验证概览统计
SELECT
    '执行概览' as report_section,
    '验证开始时间' as metric_name,
    NOW() as metric_value,
    NULL as warning_level

UNION ALL

SELECT
    '执行概览' as report_section,
    '验证持续时间（秒）' as metric_name,
    TIMESTAMPDIFF(SECOND, @start_time, NOW()) as metric_value,
    CASE WHEN TIMESTAMPDIFF(SECOND, @start_time, NOW()) > 60 THEN 'WARN' ELSE 'INFO' END as warning_level

UNION ALL

SELECT
    '执行概览' as report_section,
    '总体健康评分' as metric_name,
    ROUND((1 - (total_errors + total_warnings * 0.1) / total_checks) * 100, 2) as metric_value,
    CASE WHEN (1 - (total_errors + total_warnings * 0.1) / total_checks) * 100 >= 95 THEN 'INFO'
         WHEN (1 - (total_errors + total_warnings * 0.1) / total_checks) * 100 >= 80 THEN 'WARN'
         ELSE 'ERROR' END as warning_level;
```

#### 第二层：详细检查结果
```sql
-- 按表分类的验证结果
SELECT
    t.table_name,
    t.table_comment,
    COUNT(*) as total_checks,
    COUNT(CASE WHEN r.warning_level = 'CRITICAL' THEN 1 END) as critical_errors,
    COUNT(CASE WHEN r.warning_level = 'ERROR' THEN 1 END) as errors,
    COUNT(CASE WHEN r.warning_level = 'WARN' THEN 1 END) as warnings,
    COUNT(CASE WHEN r.warning_level = 'INFO' THEN 1 END) as info,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM verification_results), 2) as completion_rate
FROM verification_results r
JOIN information_schema.TABLES t ON r.table_name = t.TABLE_NAME
WHERE r.verification_id = CURRENT_VERIFICATION_ID
GROUP BY t.table_name, t.table_comment
ORDER BY (critical_errors * 10 + errors * 5 + warnings) DESC;
```

#### 第三层：统计分析
```sql
-- 数据分布统计
SELECT
    '数据分布分析' as analysis_type,
    table_name,
    column_name,
    data_type,
    COUNT(DISTINCT column_value) as distinct_count,
    COUNT(*) as total_count,
    ROUND(COUNT(DISTINCT column_value) * 100.0 / COUNT(*), 2) as diversity_rate,
    MIN(column_value) as min_value,
    MAX(column_value) as max_value,
    AVG(CASE WHEN column_name REGEXP '^[0-9]+$' THEN CAST(column_value AS DECIMAL) END) as avg_numeric_value
FROM table_statistics
WHERE verification_id = CURRENT_VERIFICATION_ID
GROUP BY table_name, column_name
ORDER BY diversity_rate DESC;
```

#### 第四层：改进建议
```sql
-- 改进建议生成
SELECT
    CASE
        WHEN warning_level = 'CRITICAL' THEN '立即修复建议'
        WHEN warning_level = 'ERROR' THEN '短期修复建议'
        WHEN warning_level = 'WARN' THEN '中期优化建议'
        ELSE '长期改进建议'
    END as suggestion_category,
    table_name,
    issue_description,
    COUNT(*) as occurrence_count,
    GROUP_CONCAT(
        CASE
            WHEN warning_level = 'CRITICAL' THEN '立即联系技术支持，停止相关操作'
            WHEN warning_level = 'ERROR' THEN '建议在下次维护窗口修复'
            WHEN warning_level = 'WARN' THEN '建议在下周内优化'
            ELSE '可在下次版本迭代中处理'
        END
        SEPARATOR '; '
    ) as recommendation
FROM verification_results
WHERE warning_level IN ('CRITICAL', 'ERROR', 'WARN')
GROUP BY warning_level, table_name, issue_description
ORDER BY
    CASE warning_level
        WHEN 'CRITICAL' THEN 1
        WHEN 'ERROR' THEN 2
        WHEN 'WARN' THEN 3
        ELSE 4
    END,
    occurrence_count DESC;
```

## 自动执行机制

### 执行触发条件

#### 1. 迁移后自动执行
```bash
# Flyway集成配置
# 在flyway.conf中添加
flyway.placeholders.verificationScript=verify_all_modules.sql
flyway.beforeMigrate=sql/verification/before_migration.sql
flyway.afterMigrate=sql/verification/after_migration.sql
```

#### 2. Spring Boot启动时执行
```java
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DatabaseVerificationRunner implements ApplicationRunner {

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (verificationEnabled) {
            verificationService.executeAllVerifications();
        }
    }
}
```

#### 3. 定时执行配置
```properties
# 每日执行核心表验证
verification.schedule.core=cron 0 2 * * *

# 每周执行业务表验证
verification.schedule.business=cron 0 3 * * 0

# 每月执行分析验证
verification.schedule.analysis=cron 0 4 1 * *
```

### 错误处理策略

#### 持久化记录
```sql
-- 验证结果记录表
CREATE TABLE verification_results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    verification_id VARCHAR(50) NOT NULL,
    verification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    module_name VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    check_item VARCHAR(200),
    warning_level ENUM('CRITICAL', 'ERROR', 'WARN', 'INFO'),
    error_message TEXT,
    suggested_action TEXT,
    fix_status ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED', 'IGNORED') DEFAULT 'PENDING',
    INDEX idx_verification_date (verification_date),
    INDEX idx_module_warning (module_name, warning_level),
    INDEX idx_fix_status (fix_status)
);
```

#### 告警机制
```java
@Service
public class VerificationAlertService {

    public void handleCriticalIssues(List<VerificationResult> criticalIssues) {
        // 发送紧急邮件告警
        emailService.sendUrgentAlert(criticalIssues);

        // 发送短信告警
        smsService.sendAlertToTeam(criticalIssues);

        // 创建工单
        ticketService.createEmergencyTicket(criticalIssues);
    }

    public void handleErrors(List<VerificationResult> errors) {
        // 发送邮件通知
        emailService.sendErrorNotification(errors);

        // 记录到日志
        logger.error("Database verification errors: {}", errors);
    }
}
```

## 模块化实施计划

### 阶段1：基础框架建立（当前阶段）
- [x] 制定验证脚本规范
- [ ] 创建验证脚本模板
- [ ] 建立自动执行机制
- [ ] 设计报告格式标准

### 阶段2：核心模块验证（优先级最高）
- [ ] 核心基础表验证脚本（Level 1+2）
  - users, user_profiles, roles, permissions
  - user_roles, role_permissions
  - system_configs, dictionaries, file_storages
  - operation_logs, audit_logs

- [ ] 认证扩展表验证脚本（Level 1+2）
  - refresh_tokens, login_history, email_verifications
  - password_resets, failed_login_attempts, user_lockouts

- [ ] 用户中心表验证脚本（Level 1+2）
  - favorites, download_history, browse_history
  - user_comments, comment_interactions

### 阶段3：业务模块验证（中优先级）
- [ ] VIP业务表验证脚本优化（Level 1+2+3）
- [ ] 资源管理表验证脚本（Level 1+2）
- [ ] 内容管理表验证脚本（Level 1+2）

### 阶段4：高级分析功能（低优先级）
- [ ] 历史趋势分析验证（Level 3）
- [ ] 用户行为模式验证（Level 3）
- [ ] 性能相关验证（Level 3）

## 质量保证

### 验证脚本质量标准
- **覆盖率**：每个表至少包含Level 1验证
- **准确性**：验证逻辑必须正确反映业务规则
- **性能**：验证脚本执行时间不超过5分钟
- **可维护性**：代码清晰，注释完整，易于理解

### 验证结果质量标准
- **完整性**：所有问题都被正确分类和记录
- **准确性**：错误定位准确，建议具体可行
- **及时性**：问题发现后及时通知相关人员
- **可追溯性**：保留历史验证结果，支持趋势分析

## 文档维护

### 更新频率
- **规范文档**：根据项目进展按需更新
- **验证脚本**：随数据库结构变更同步更新
- **实施计划**：每月review和调整

### 版本管理
- 规范文档使用语义化版本控制
- 验证脚本与数据库迁移版本保持一致
- 重要变更需要变更记录和审批

---

**文档版本**：V1.0.0
**创建日期**：2025-10-30
**最后更新**：2025-10-30
**维护团队**：数据库团队
**审核状态**：待审核