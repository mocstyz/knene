# Flyway 验证集成配置指南

## 概述

本文档描述了如何将数据库验证脚本集成到 Flyway 迁移流程中，实现迁移后自动验证功能。

## 集成架构

### 执行流程

```
Flyway迁移执行 → 迁移完成 → 触发验证脚本 → 执行验证 → 生成报告 → 告警通知
```

### 核心组件

1. **V1.1.5__Create_verification_tables.sql** - 验证系统表结构
2. **after_migration.sql** - 迁移后自动验证脚本
3. **Flyway配置** - 集成配置参数
4. **验证脚本** - 具体的验证逻辑

## Flyway 配置

### application.properties 配置

```properties
# Flyway 基础配置
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.baseline-version=1.0.0
spring.flyway.table=flyway_schema_history
spring.flyway.sql-migration-prefix=V
spring.flyway.sql-migration-separator=__
spring.flyway.sql-migration-suffixes=.sql
spring.flyway.validate-on-migrate=true
spring.flyway.out-of-order=false

# Flyway 验证集成配置
spring.flyway.placeholders.verificationEnabled=true
spring.flyway.placeholders.verificationAutoExecute=true
spring.flyway.placeholders.verificationTimeout=300
spring.flyway.placeholders.verificationRetryCount=3

# 自定义 Flyway 配置类路径
spring.flyway.locations=classpath:db/migration,classpath:db/verification
spring.flyway.callbacks=com.knene.config.FlywayVerificationCallback
```

### Flyway 回调类配置

```java
package com.knene.config;

import org.flywaydb.core.api.callback.Callback;
import org.flywaydb.core.api.callback.Context;
import org.flywaydb.core.api.callback.Event;
import org.springframework.stereotype.Component;

/**
 * Flyway 验证回调类
 * 在迁移完成后自动触发验证
 */
@Component
public class FlywayVerificationCallback implements Callback {

    @Override
    public boolean supports(Event event, Context context) {
        return event == Event.AFTER_MIGRATE;
    }

    @Override
    public void handle(Event event, Context context) {
        if (event == Event.AFTER_MIGRATE) {
            executeVerificationAfterMigration(context);
        }
    }

    private void executeVerificationAfterMigration(Context context) {
        // 获取配置
        boolean verificationEnabled = Boolean.parseBoolean(
            context.getConfiguration().getPlaceholders().getOrDefault("verificationEnabled", "true")
        );

        if (!verificationEnabled) {
            return;
        }

        // 执行验证脚本
        try {
            String verificationScript = loadVerificationScript();
            context.getConfiguration().getDataSource().getConnection()
                .createStatement()
                .execute(verificationScript);
        } catch (Exception e) {
            // 记录错误但不阻止应用启动
            logger.error("数据库验证执行失败", e);
        }
    }

    private String loadVerificationScript() {
        // 加载 after_migration.sql 脚本
        try {
            Resource resource = new ClassPathResource("db/migration/after_migration.sql");
            return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("无法加载验证脚本", e);
        }
    }
}
```

## 验证执行配置

### 环境变量配置

```bash
# 开发环境
VERIFICATION_ENABLED=true
VERIFICATION_AUTO_EXECUTE=true
VERIFICATION_ALERT_EMAIL_ENABLED=false

# 测试环境
VERIFICATION_ENABLED=true
VERIFICATION_AUTO_EXECUTE=true
VERIFICATION_ALERT_EMAIL_ENABLED=true
VERIFICATION_ALERT_EMAIL_RECIPIENTS=dev-team@example.com

# 生产环境
VERIFICATION_ENABLED=true
VERIFICATION_AUTO_EXECUTE=true
VERIFICATION_ALERT_EMAIL_ENABLED=true
VERIFICATION_ALERT_SMS_ENABLED=true
VERIFICATION_HEALTH_SCORE_THRESHOLD_CRITICAL=70.0
VERIFICATION_HEALTH_SCORE_THRESHOLD_WARNING=85.0
```

### 配置参数说明

| 参数名 | 默认值 | 说明 |
|--------|--------|------|
| `verification.enabled` | true | 是否启用验证功能 |
| `verification.auto.execute.on.migration` | true | 迁移后是否自动执行验证 |
| `verification.auto.execute.on.startup` | false | 应用启动时是否自动执行验证 |
| `verification.health.score.threshold.critical` | 60.0 | 健康评分严重阈值 |
| `verification.health.score.threshold.warning` | 80.0 | 健康评分警告阈值 |
| `verification.execution.timeout.seconds` | 300 | 验证执行超时时间 |
| `verification.max.retry.count` | 3 | 最大重试次数 |
| `verification.retention.days` | 90 | 验证结果保留天数 |

## 验证脚本执行机制

### 自动触发时机

1. **迁移后执行**（主要）
   - 每次 Flyway 迁移完成后自动触发
   - 执行所有标记为 `execution_frequency = 'MIGRATION'` 的验证脚本

2. **应用启动时执行**（可选）
   - 应用启动时检查是否有未执行的验证
   - 可通过配置开启/关闭

3. **手动触发**
   - 提供管理接口手动触发验证
   - 支持指定特定的验证脚本

### 执行顺序控制

验证脚本按照以下顺序执行：

1. **按执行字段排序** (`execution_order`)
2. **按创建时间排序** (`id`)
3. **按模块分组执行**

```sql
-- 执行顺序示例
SELECT script_name, execution_order, module_name
FROM verification_scripts
WHERE is_active = TRUE AND auto_execute = TRUE
ORDER BY execution_order, id;
```

### 执行结果处理

#### 成功执行
- 更新 `verification_executions` 表状态为 `COMPLETED`
- 记录执行时长和健康评分
- 生成验证报告

#### 执行失败
- 更新状态为 `FAILED`
- 记录错误信息
- 触发告警（如果配置了告警）
- 不阻塞应用启动（遵循"记录警告继续"原则）

#### 部分失败
- 记录成功和失败的脚本
- 计算综合健康评分
- 根据问题严重程度决定整体状态

## 错误处理和重试机制

### 重试策略

```sql
-- 重试配置
CREATE TABLE verification_retry_config (
    script_name VARCHAR(100) PRIMARY KEY,
    max_retry_count INT DEFAULT 3,
    retry_delay_seconds INT DEFAULT 60,
    backoff_multiplier DECIMAL(2,1) DEFAULT 1.5
);
```

### 重试逻辑

1. **指数退避重试**
   - 首次失败：等待60秒
   - 第二次失败：等待90秒
   - 第三次失败：等待135秒

2. **重试次数限制**
   - 默认最多重试3次
   - 可为特定脚本配置不同的重试策略

3. **重试终止条件**
   - 达到最大重试次数
   - 验证脚本被标记为禁用
   - 系统关闭验证功能

## 告警机制

### 告警触发条件

1. **严重问题**
   - 健康评分 < critical_threshold
   - 发现 CRITICAL 级别问题

2. **执行失败**
   - 验证脚本执行失败
   - 超时未完成

3. **趋势异常**
   - 健康评分持续下降
   - 问题数量异常增长

### 告警渠道

```yaml
# 告警配置示例
verification:
  alert:
    email:
      enabled: true
      recipients:
        - admin@example.com
        - dba@example.com
      template: verification-alert.html
    sms:
      enabled: false
      providers:
        - twilio
        - aliyun
    webhook:
      enabled: true
      urls:
        - https://hooks.slack.com/your-webhook-url
        - https://api.dingtalk.com/your-webhook-url
```

### 告警模板

```html
<!-- 邮件告警模板示例 -->
<!DOCTYPE html>
<html>
<head>
    <title>数据库验证告警</title>
</head>
<body>
    <h2>🚨 数据库验证告警</h2>
    <p><strong>执行时间:</strong> ${execution_time}</p>
    <p><strong>执行ID:</strong> ${execution_id}</p>
    <p><strong>健康评分:</strong> ${health_score}</p>
    <p><strong>问题数量:</strong> ${total_issues}</p>

    <h3>问题详情</h3>
    <table>
        <tr>
            <th>级别</th>
            <th>模块</th>
            <th>问题描述</th>
            <th>建议措施</th>
        </tr>
        <#list issues as issue>
        <tr>
            <td>${issue.level}</td>
            <td>${issue.module}</td>
            <td>${issue.message}</td>
            <td>${issue.suggestion}</td>
        </tr>
        </#list>
    </table>
</body>
</html>
```

## 监控和日志

### 执行日志

```properties
# 日志配置
logging.level.com.knene.verification=INFO
logging.level.org.flywaydb=DEBUG

# 日志文件配置
logging.file.name=logs/verification.log
logging.logback.rollingpolicy.max-file-size=100MB
logging.logback.rollingpolicy.max-history=30
```

### 执行指标

```java
// Micrometer 指标注册
@Component
public class VerificationMetrics {

    private final MeterRegistry meterRegistry;
    private final Counter verificationExecutionCounter;
    private final Timer verificationExecutionTimer;
    private final Gauge verificationHealthScoreGauge;

    public VerificationMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        this.verificationExecutionCounter = Counter.builder("verification.execution.total")
            .description("Total verification executions")
            .register(meterRegistry);

        this.verificationExecutionTimer = Timer.builder("verification.execution.duration")
            .description("Verification execution duration")
            .register(meterRegistry);
    }

    public void recordExecution(VerificationResult result) {
        verificationExecutionCounter.increment(
            Tags.of("status", result.getStatus(), "module", result.getModule())
        );

        verificationExecutionTimer.record(
            result.getDuration(), TimeUnit.SECONDS
        );
    }
}
```

## 测试和验证

### 集成测试

```java
@SpringBootTest
@TestPropertySource(properties = {
    "spring.flyway.enabled=true",
    "verification.enabled=true"
})
class FlywayVerificationIntegrationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void shouldExecuteVerificationAfterMigration() {
        // 执行测试迁移
        flyway.migrate();

        // 验证验证记录是否创建
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM verification_executions WHERE execution_type = 'MIGRATION'",
            Integer.class
        );

        assertThat(count).isGreaterThan(0);
    }

    @Test
    void shouldCreateAlertsForCriticalIssues() {
        // 模拟严重问题
        insertTestCriticalIssues();

        // 执行验证
        executeVerification();

        // 验证告警是否创建
        Integer alertCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM verification_alerts WHERE alert_type = 'CRITICAL_ISSUE'",
            Integer.class
        );

        assertThat(alertCount).isGreaterThan(0);
    }
}
```

### 性能测试

```sql
-- 性能测试脚本
-- 模拟大量数据验证
CREATE PROCEDURE PerformanceTestVerification()
BEGIN
    DECLARE start_time TIMESTAMP DEFAULT NOW();
    DECLARE test_iterations INT DEFAULT 100;

    -- 执行多次验证
    WHILE test_iterations > 0 DO
        CALL after_migration();
        SET test_iterations = test_iterations - 1;
    END WHILE;

    -- 输出性能统计
    SELECT
        '性能测试完成' as test_result,
        test_iterations as iterations,
        TIMESTAMPDIFF(SECOND, start_time, NOW()) as total_seconds,
        TIMESTAMPDIFF(SECOND, start_time, NOW()) / test_iterations as avg_seconds_per_execution;
END;
```

## 故障排除

### 常见问题

1. **验证脚本执行失败**
   - 检查脚本语法
   - 验证表结构是否存在
   - 检查权限设置

2. **性能问题**
   - 检查验证脚本执行时间
   - 优化查询语句
   - 考虑分批处理

3. **告警不发送**
   - 检查告警配置
   - 验证邮件服务器设置
   - 检查网络连接

### 调试工具

```sql
-- 调试视图
CREATE VIEW v_verification_debug AS
SELECT
    e.execution_id,
    e.execution_type,
    e.start_time,
    e.end_time,
    e.execution_status,
    e.health_score,
    COUNT(r.id) as result_count,
    COUNT(CASE WHEN r.warning_level = 'CRITICAL' THEN 1 END) as critical_count,
    GROUP_CONCAT(DISTINCT r.module_name) as modules
FROM verification_executions e
LEFT JOIN verification_results r ON e.execution_id = r.execution_id
GROUP BY e.execution_id;

-- 调试存储过程
CREATE PROCEDURE DebugVerification(IN execution_id_param VARCHAR(50))
BEGIN
    -- 输出执行详情
    SELECT * FROM verification_executions WHERE execution_id = execution_id_param;

    -- 输出问题详情
    SELECT * FROM verification_results WHERE execution_id = execution_id_param ORDER BY warning_level DESC;

    -- 输出告警信息
    SELECT * FROM verification_alerts WHERE execution_id = execution_id_param;
END;
```

---

**文档版本**：V1.0.0
**创建日期**：2025-10-30
**维护团队**：相笑与春风
**审核状态**：待审核