# Spring Boot 启动验证集成配置指南

## 概述

本文档描述了如何在 Spring Boot 应用中集成数据库验证功能，实现应用启动时自动验证和定期验证功能。

## 集成架构

### 组件结构

```
Spring Boot Application
├── VerificationAutoConfiguration    # 自动配置类
├── VerificationService             # 验证服务
├── VerificationRunner              # 启动时验证执行器
├── VerificationScheduler           # 定时验证调度器
├── VerificationAlertService        # 告警服务
└── VerificationMetrics             # 指标收集
```

## 自动配置类

### VerificationAutoConfiguration

```java
package com.knene.config.verification;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 数据库验证自动配置类
 */
@Configuration
@EnableConfigurationProperties(VerificationProperties.class)
@ConditionalOnProperty(prefix = "database.verification", name = "enabled", havingValue = "true")
public class VerificationAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public VerificationService verificationService(
            DataSource dataSource,
            VerificationProperties properties) {
        return new VerificationServiceImpl(dataSource, properties);
    }

    @Bean
    @ConditionalOnProperty(prefix = "database.verification", name = "auto-execute-on-startup", havingValue = "true")
    public VerificationRunner verificationRunner(
            VerificationService verificationService,
            ApplicationArguments applicationArguments) {
        return new VerificationRunner(verificationService, applicationArguments);
    }

    @Bean
    @ConditionalOnProperty(prefix = "database.verification.scheduler", name = "enabled", havingValue = "true")
    public VerificationScheduler verificationScheduler(
            VerificationService verificationService,
            VerificationProperties properties) {
        return new VerificationScheduler(verificationService, properties);
    }

    @Bean
    @ConditionalOnMissingBean
    public VerificationAlertService verificationAlertService(
            VerificationProperties properties) {
        return new VerificationAlertServiceImpl(properties);
    }

    @Bean
    public VerificationMetrics verificationMetrics(MeterRegistry meterRegistry) {
        return new VerificationMetrics(meterRegistry);
    }
}
```

### 配置属性类

```java
package com.knene.config.verification;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;

/**
 * 数据库验证配置属性
 */
@Component
@ConfigurationProperties(prefix = "database.verification")
public class VerificationProperties {

    /**
     * 是否启用验证功能
     */
    private boolean enabled = false;

    /**
     * 应用启动时是否自动执行验证
     */
    private boolean autoExecuteOnStartup = false;

    /**
     * 验证执行超时时间
     */
    private Duration timeout = Duration.ofMinutes(5);

    /**
     * 最大重试次数
     */
    private int maxRetryCount = 3;

    /**
     * 重试延迟时间
     */
    private Duration retryDelay = Duration.ofSeconds(30);

    /**
     * 健康评分阈值配置
     */
    private HealthScoreThreshold healthScore = new HealthScoreThreshold();

    /**
     * 告警配置
     */
    private Alert alert = new Alert();

    /**
     * 调度器配置
     */
    private Scheduler scheduler = new Scheduler();

    /**
     * 保留配置
     */
    private Retention retention = new Retention();

    // Getters and Setters

    public static class HealthScoreThreshold {
        private double critical = 60.0;
        private double warning = 80.0;

        // Getters and Setters
    }

    public static class Alert {
        private boolean emailEnabled = false;
        private boolean smsEnabled = false;
        private boolean webhookEnabled = false;
        private List<String> emailRecipients = List.of();
        private List<String> smsRecipients = List.of();
        private List<String> webhookUrls = List.of();

        // Getters and Setters
    }

    public static class Scheduler {
        private boolean enabled = false;
        private String cronExpression = "0 0 2 * * *"; // 每天凌晨2点
        private List<String> scriptNames = List.of(); // 指定要执行的脚本，为空则执行所有
        private boolean enabledOnStartup = false;

        // Getters and Setters
    }

    public static class Retention {
        private int days = 90;
        private boolean compressionEnabled = false;
        private boolean autoCleanup = true;

        // Getters and Setters
    }
}
```

## 核心服务实现

### VerificationService

```java
package com.knene.service.verification;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 数据库验证服务实现
 */
@Service
@Transactional
public class VerificationServiceImpl implements VerificationService {

    private final JdbcTemplate jdbcTemplate;
    private final VerificationProperties properties;

    public VerificationServiceImpl(DataSource dataSource, VerificationProperties properties) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        this.properties = properties;
    }

    @Override
    public VerificationResult executeVerification(VerificationRequest request) {
        String executionId = generateExecutionId(request.getExecutionType());
        LocalDateTime startTime = LocalDateTime.now();

        try {
            // 创建执行记录
            createExecutionRecord(executionId, request, startTime);

            // 获取要执行的验证脚本
            List<VerificationScript> scripts = getVerificationScripts(request);

            // 执行验证脚本
            List<ScriptExecutionResult> scriptResults = executeScripts(executionId, scripts);

            // 汇总结果
            VerificationResult result = summarizeResults(executionId, scriptResults, startTime);

            // 更新执行记录
            updateExecutionRecord(executionId, result);

            // 检查是否需要告警
            checkAndCreateAlerts(executionId, result);

            return result;

        } catch (Exception e) {
            // 记录执行失败
            markExecutionAsFailed(executionId, e.getMessage(), startTime);
            throw new VerificationException("验证执行失败: " + e.getMessage(), e);
        }
    }

    @Override
    public VerificationResult executeScript(String scriptName) {
        VerificationRequest request = VerificationRequest.builder()
                .executionType(ExecutionType.MANUAL)
                .scriptNames(List.of(scriptName))
                .build();

        return executeVerification(request);
    }

    @Override
    public List<VerificationExecution> getExecutionHistory(int limit) {
        String sql = """
            SELECT execution_id, execution_type, trigger_source, start_time, end_time,
                   execution_duration_seconds, total_checks, critical_issues, error_issues,
                   warning_issues, info_issues, health_score, execution_status
            FROM verification_executions
            ORDER BY start_time DESC
            LIMIT ?
            """;

        return jdbcTemplate.query(sql, this::mapRowToExecution, limit);
    }

    @Override
    public List<VerificationResultDetail> getExecutionDetails(String executionId) {
        String sql = """
            SELECT module_name, table_name, check_item, warning_level, check_category,
                   error_message, suggested_action, check_count, affected_record_count,
                   fix_status, created_at
            FROM verification_results
            WHERE execution_id = ?
            ORDER BY warning_level DESC, module_name, check_item
            """;

        return jdbcTemplate.query(sql, this::mapRowToResultDetail, executionId);
    }

    private String generateExecutionId(ExecutionType executionType) {
        return String.format("VERIF_%s_%s", executionType.getCode(),
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")));
    }

    private void createExecutionRecord(String executionId, VerificationRequest request, LocalDateTime startTime) {
        String sql = """
            INSERT INTO verification_executions (
                execution_id, execution_type, trigger_source, start_time,
                total_checks, execution_status
            ) VALUES (?, ?, ?, ?, 0, 'RUNNING')
            """;

        jdbcTemplate.update(sql, executionId, request.getExecutionType().name(),
                request.getTriggerSource(), startTime);
    }

    private List<VerificationScript> getVerificationScripts(VerificationRequest request) {
        String sql = """
            SELECT id, script_name, script_path, module_name, verification_level,
                   execution_order, is_active, auto_execute
            FROM verification_scripts
            WHERE is_active = TRUE
            """;

        if (!request.getScriptNames().isEmpty()) {
            sql += " AND script_name IN (" + String.join(",",
                    request.getScriptNames().stream().map(s -> "'" + s + "'").toList()) + ")";
        } else {
            sql += " AND auto_execute = TRUE";
        }

        sql += " ORDER BY execution_order, id";

        return jdbcTemplate.query(sql, this::mapRowToScript);
    }

    private List<ScriptExecutionResult> executeScripts(String executionId, List<VerificationScript> scripts) {
        return scripts.parallelStream()
                .map(script -> executeScript(executionId, script))
                .toList();
    }

    private ScriptExecutionResult executeScript(String executionId, VerificationScript script) {
        LocalDateTime startTime = LocalDateTime.now();

        try {
            // 检查脚本文件是否存在
            if (!scriptFileExists(script.getScriptPath())) {
                return createFailedResult(script, startTime, "脚本文件不存在: " + script.getScriptPath());
            }

            // 执行脚本
            String scriptContent = loadScriptContent(script.getScriptPath());
            jdbcTemplate.execute(scriptContent);

            // 获取脚本执行结果（从临时表或直接查询）
            ScriptExecutionResult result = parseScriptResult(script, startTime);

            // 保存结果到数据库
            saveScriptResults(executionId, script, result);

            return result;

        } catch (Exception e) {
            ScriptExecutionResult result = createFailedResult(script, startTime, e.getMessage());
            saveScriptResults(executionId, script, result);
            return result;
        }
    }

    private VerificationResult summarizeResults(String executionId,
                                              List<ScriptExecutionResult> scriptResults,
                                              LocalDateTime startTime) {
        LocalDateTime endTime = LocalDateTime.now();
        long durationSeconds = Duration.between(startTime, endTime).getSeconds();

        int totalChecks = scriptResults.stream()
                .mapToInt(ScriptExecutionResult::getTotalChecks)
                .sum();

        int criticalIssues = scriptResults.stream()
                .mapToInt(ScriptExecutionResult::getCriticalIssues)
                .sum();

        int errorIssues = scriptResults.stream()
                .mapToInt(ScriptExecutionResult::getErrorIssues)
                .sum();

        int warningIssues = scriptResults.stream()
                .mapToInt(ScriptExecutionResult::getWarningIssues)
                .sum();

        int infoIssues = scriptResults.stream()
                .mapToInt(ScriptExecutionResult::getInfoIssues)
                .sum();

        double healthScore = calculateHealthScore(totalChecks, criticalIssues, errorIssues, warningIssues);

        ExecutionStatus status = determineExecutionStatus(criticalIssues, errorIssues);

        return VerificationResult.builder()
                .executionId(executionId)
                .startTime(startTime)
                .endTime(endTime)
                .durationSeconds(durationSeconds)
                .totalChecks(totalChecks)
                .criticalIssues(criticalIssues)
                .errorIssues(errorIssues)
                .warningIssues(warningIssues)
                .infoIssues(infoIssues)
                .healthScore(healthScore)
                .status(status)
                .scriptResults(scriptResults)
                .build();
    }

    private double calculateHealthScore(int totalChecks, int criticalIssues,
                                       int errorIssues, int warningIssues) {
        if (totalChecks == 0) return 100.0;

        double deduction = (criticalIssues * 10.0 + errorIssues * 5.0 + warningIssues * 1.0) / totalChecks;
        return Math.max(0.0, (1.0 - deduction) * 100.0);
    }

    private ExecutionStatus determineExecutionStatus(int criticalIssues, int errorIssues) {
        if (criticalIssues > 0) return ExecutionStatus.FAILED;
        if (errorIssues > 0) return ExecutionStatus.COMPLETED_WITH_ERRORS;
        return ExecutionStatus.COMPLETED_SUCCESSFULLY;
    }

    // 其他辅助方法...
}
```

### VerificationRunner

```java
package com.knene.service.verification;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 应用启动时验证执行器
 */
@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // 确保在其他组件初始化之前执行
@RequiredArgsConstructor
public class VerificationRunner implements ApplicationRunner {

    private final VerificationService verificationService;
    private final VerificationProperties properties;
    private final ApplicationArguments applicationArguments;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (!properties.isAutoExecuteOnStartup()) {
            log.info("数据库验证启动时自动执行已禁用");
            return;
        }

        log.info("开始执行数据库验证（启动时）");

        try {
            VerificationRequest request = VerificationRequest.builder()
                    .executionType(ExecutionType.STARTUP)
                    .triggerSource("Application Startup")
                    .timeout(properties.getTimeout())
                    .maxRetryCount(properties.getMaxRetryCount())
                    .build();

            VerificationResult result = verificationService.executeVerification(request);

            log.info("数据库验证完成 - 状态: {}, 健康评分: {}, 耗时: {}秒",
                    result.getStatus(), result.getHealthScore(), result.getDurationSeconds());

            // 如果健康评分过低，记录警告但不阻止应用启动
            if (result.getHealthScore() < properties.getHealthScore().getCritical()) {
                log.warn("数据库健康评分过低: {}，建议检查数据库状态", result.getHealthScore());
            }

        } catch (Exception e) {
            log.error("数据库验证执行失败，但不阻止应用启动", e);
            // 不抛出异常，遵循"记录警告继续"原则
        }
    }
}
```

### VerificationScheduler

```java
package com.knene.service.verification;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 定时验证调度器
 */
@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class VerificationScheduler {

    private final VerificationService verificationService;
    private final VerificationProperties properties;

    @Scheduled(cron = "#{@verificationProperties.scheduler.cronExpression}")
    public void executeScheduledVerification() {
        if (!properties.getScheduler().isEnabled()) {
            log.debug("定时验证已禁用");
            return;
        }

        log.info("开始执行定时数据库验证");

        try {
            VerificationRequest request = VerificationRequest.builder()
                    .executionType(ExecutionType.SCHEDULED)
                    .triggerSource("Scheduled Task")
                    .scriptNames(properties.getScheduler().getScriptNames())
                    .timeout(properties.getTimeout())
                    .build();

            VerificationResult result = verificationService.executeVerification(request);

            log.info("定时验证完成 - 状态: {}, 健康评分: {}",
                    result.getStatus(), result.getHealthScore());

        } catch (Exception e) {
            log.error("定时验证执行失败", e);
        }
    }

    @Scheduled(cron = "0 0 3 * * *") // 每天凌晨3点清理过期数据
    public void cleanupExpiredData() {
        if (!properties.getRetention().isAutoCleanup()) {
            log.debug("自动清理已禁用");
            return;
        }

        try {
            // 调用存储过程清理过期数据
            verificationService.cleanupExpiredData();
            log.info("过期验证数据清理完成");

        } catch (Exception e) {
            log.error("过期数据清理失败", e);
        }
    }
}
```

## 数据模型

### VerificationRequest

```java
package com.knene.model.verification;

import lombok.Builder;
import lombok.Data;

import java.time.Duration;
import java.util.List;

@Data
@Builder
public class VerificationRequest {

    private ExecutionType executionType;
    private String triggerSource;
    private List<String> scriptNames;
    private Duration timeout;
    private int maxRetryCount;
    private Map<String, Object> parameters;
}
```

### VerificationResult

```java
package com.knene.model.verification;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class VerificationResult {

    private String executionId;
    private ExecutionType executionType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private long durationSeconds;
    private int totalChecks;
    private int criticalIssues;
    private int errorIssues;
    private int warningIssues;
    private int infoIssues;
    private double healthScore;
    private ExecutionStatus status;
    private List<ScriptExecutionResult> scriptResults;
}
```

### 枚举定义

```java
package com.knene.model.verification;

public enum ExecutionType {
    MIGRATION("migration"),
    STARTUP("startup"),
    SCHEDULED("scheduled"),
    MANUAL("manual");

    private final String code;

    ExecutionType(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}

public enum ExecutionStatus {
    RUNNING,
    COMPLETED_SUCCESSFULLY,
    COMPLETED_WITH_ERRORS,
    FAILED,
    CANCELLED
}
```

## 配置文件

### application.yml

```yaml
database:
  verification:
    enabled: true
    auto-execute-on-startup: false  # 生产环境建议设为false
    timeout: 5m
    max-retry-count: 3
    retry-delay: 30s

    health-score:
      critical: 60.0
      warning: 80.0

    alert:
      email-enabled: true
      sms-enabled: false
      webhook-enabled: false
      email-recipients:
        - admin@example.com
        - dba@example.com

    scheduler:
      enabled: true
      cron-expression: "0 0 2 * * *"  # 每天凌晨2点
      script-names: []  # 空列表表示执行所有启用的脚本
      enabled-on-startup: false

    retention:
      days: 90
      compression-enabled: false
      auto-cleanup: true
```

### application-dev.yml

```yaml
database:
  verification:
    auto-execute-on-startup: true
    health-score:
      critical: 50.0  # 开发环境阈值较低
      warning: 70.0
    scheduler:
      enabled: false  # 开发环境不需要定时执行
    alert:
      email-enabled: false
```

### application-prod.yml

```yaml
database:
  verification:
    auto-execute-on-startup: false  # 生产环境不自动执行
    timeout: 10m  # 生产环境超时时间更长
    health-score:
      critical: 70.0  # 生产环境阈值较高
      warning: 85.0
    alert:
      email-enabled: true
      sms-enabled: true
      webhook-enabled: true
      email-recipients:
        - ops-team@example.com
        - dba-team@example.com
      sms-recipients:
        - "+1234567890"
      webhook-urls:
        - "https://hooks.slack.com/your-webhook-url"
    scheduler:
      enabled: true
      cron-expression: "0 0 3 * * *"  # 凌晨3点执行
```

## Actuator 健康检查

```java
package com.knene.actuator;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class DatabaseVerificationHealthIndicator implements HealthIndicator {

    private final VerificationService verificationService;

    public DatabaseVerificationHealthIndicator(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @Override
    public Health health() {
        try {
            // 获取最近的验证结果
            List<VerificationExecution> recentExecutions = verificationService.getExecutionHistory(1);

            if (recentExecutions.isEmpty()) {
                return Health.unknown()
                        .withDetail("message", "没有找到验证执行记录")
                        .build();
            }

            VerificationExecution lastExecution = recentExecutions.get(0);

            Health.Builder builder = new Health.Builder();

            if (lastExecution.getHealthScore() >= 90) {
                builder.up();
            } else if (lastExecution.getHealthScore() >= 70) {
                builder.unknown();
            } else {
                builder.down();
            }

            return builder
                    .withDetail("lastExecutionId", lastExecution.getExecutionId())
                    .withDetail("executionTime", lastExecution.getStartTime())
                    .withDetail("healthScore", lastExecution.getHealthScore())
                    .withDetail("totalIssues", lastExecution.getTotalIssues())
                    .withDetail("criticalIssues", lastExecution.getCriticalIssues())
                    .withDetail("errorIssues", lastExecution.getErrorIssues())
                    .withDetail("warningIssues", lastExecution.getWarningIssues())
                    .build();

        } catch (Exception e) {
            return Health.down()
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}
```

## 管理接口

```java
package com.knene.controller;

import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

/**
 * 数据库验证管理接口
 */
@RestController
@RequestMapping("/api/v1/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping("/execute")
    public ResponseEntity<ApiResponse<VerificationResult>> executeVerification(
            @RequestBody VerificationRequest request) {
        try {
            VerificationResult result = verificationService.executeVerification(request);
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/execute/{scriptName}")
    public ResponseEntity<ApiResponse<VerificationResult>> executeScript(
            @PathVariable String scriptName) {
        try {
            VerificationResult result = verificationService.executeScript(scriptName);
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<VerificationExecution>>> getHistory(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            List<VerificationExecution> history = verificationService.getExecutionHistory(limit);
            return ResponseEntity.ok(ApiResponse.success(history));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/details/{executionId}")
    public ResponseEntity<ApiResponse<List<VerificationResultDetail>>> getDetails(
            @PathVariable String executionId) {
        try {
            List<VerificationResultDetail> details = verificationService.getExecutionDetails(executionId);
            return ResponseEntity.ok(ApiResponse.success(details));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        try {
            // 获取最新健康状态
            List<VerificationExecution> history = verificationService.getExecutionHistory(1);

            Map<String, Object> healthStatus = Map.of(
                    "lastExecution", history.isEmpty() ? null : history.get(0),
                    "overallStatus", determineOverallStatus(history)
            );

            return ResponseEntity.ok(ApiResponse.success(healthStatus));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.error(e.getMessage()));
        }
    }

    private String determineOverallStatus(List<VerificationExecution> history) {
        if (history.isEmpty()) return "UNKNOWN";

        VerificationExecution last = history.get(0);
        if (last.getHealthScore() >= 90) return "HEALTHY";
        if (last.getHealthScore() >= 70) return "WARNING";
        return "CRITICAL";
    }
}
```

---

**文档版本**：V1.0.0
**创建日期**：2025-10-30
**维护团队**：数据库团队
**审核状态**：待审核