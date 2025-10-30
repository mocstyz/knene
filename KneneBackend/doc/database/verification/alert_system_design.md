# 数据库验证告警系统设计

## 概述

本文档描述了数据库验证系统的告警和通知机制，确保在发现问题时能够及时通知相关人员。

## 告警系统架构

### 组件结构

```
验证告警系统
├── AlertService               # 告警服务主接口
├── AlertTriggerService        # 告警触发服务
├── NotificationChannelManager # 通知渠道管理器
├── EmailNotificationChannel  # 邮件通知渠道
├── SmsNotificationChannel     # 短信通知渠道
├── WebhookNotificationChannel # Webhook通知渠道
├── AlertTemplateEngine        # 告警模板引擎
└── AlertHistoryManager        # 告警历史管理器
```

## 告警触发规则

### 触发条件

#### 1. 严重问题告警
- **条件**：健康评分 < critical_threshold 或发现 CRITICAL 级别问题
- **级别**：HIGH
- **渠道**：邮件 + 短信 + Webhook
- **频率**：立即发送，后续每30分钟重发直到确认

#### 2. 执行失败告警
- **条件**：验证脚本执行失败或超时
- **级别**：HIGH
- **渠道**：邮件 + Webhook
- **频率**：立即发送，后续每小时重发

#### 3. 趋势异常告警
- **条件**：健康评分持续下降或问题数量异常增长
- **级别**：MEDIUM
- **渠道**：邮件
- **频率**：每日汇总报告

#### 4. 性能异常告警
- **条件**：验证执行时间超过阈值或执行频率异常
- **级别**：MEDIUM
- **渠道**：邮件
- **频率**：每周汇总报告

## 告警规则配置

### AlertRule 数据模型

```java
package com.knene.model.alert;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class AlertRule {

    private String ruleId;
    private String ruleName;
    private AlertType alertType;
    private AlertLevel alertLevel;
    private String condition;  // SQL表达式或条件描述
    private List<String> notificationChannels;
    private Map<String, Object> parameters;
    private boolean enabled;
    private int cooldownMinutes;  // 冷却时间（分钟）
    private String description;
}
```

### 预定义告警规则

```sql
-- 告警规则配置表
CREATE TABLE alert_rules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rule_name VARCHAR(100) NOT NULL UNIQUE,
    alert_type ENUM('CRITICAL_ISSUE', 'EXECUTION_FAILURE', 'PERFORMANCE_DEGRADATION', 'TREND_ANOMALY') NOT NULL,
    alert_level ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL,
    condition_expression TEXT NOT NULL,
    notification_channels JSON NOT NULL,
    parameters JSON,
    enabled BOOLEAN DEFAULT TRUE,
    cooldown_minutes INT DEFAULT 60,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入预定义告警规则
INSERT INTO alert_rules (rule_name, alert_type, alert_level, condition_expression,
                          notification_channels, parameters, description) VALUES
('健康评分严重告警', 'CRITICAL_ISSUE', 'HIGH',
 'health_score < ${critical_threshold}',
 '["email", "sms", "webhook"]',
 '{"critical_threshold": 60, "retry_interval": 30}',
 '当健康评分低于60分时触发严重告警'),

('健康评分警告告警', 'TREND_ANOMALY', 'MEDIUM',
 'health_score < ${warning_threshold} AND health_score >= ${critical_threshold}',
 '["email"]',
 '{"warning_threshold": 80, "critical_threshold": 60}',
 '当健康评分在60-80分之间时触发警告'),

('验证执行失败告警', 'EXECUTION_FAILURE', 'HIGH',
 'execution_status = "FAILED" OR execution_duration_seconds > ${timeout_threshold}',
 '["email", "webhook"]',
 '{"timeout_threshold": 300}',
 '当验证执行失败或超时时触发告警'),

('问题数量异常增长告警', 'TREND_ANOMALY', 'MEDIUM',
 'total_issues > ${issue_threshold} AND (previous_day_issues * 1.5 < total_issues)',
 '["email"]',
 '{"issue_threshold": 10, "growth_factor": 1.5}',
 '当问题数量异常增长时触发告警');
```

## 通知渠道实现

### 通知渠道接口

```java
package com.knene.service.alert.notification;

import com.knene.model.alert.AlertMessage;
import com.knene.model.alert.NotificationResult;

/**
 * 通知渠道接口
 */
public interface NotificationChannel {

    /**
     * 发送通知
     */
    NotificationResult send(AlertMessage message);

    /**
     * 获取渠道名称
     */
    String getChannelName();

    /**
     * 检查渠道是否可用
     */
    boolean isAvailable();

    /**
     * 获取渠道配置
     */
    NotificationChannelConfig getConfig();
}
```

### 邮件通知渠道

```java
package com.knene.service.alert.notification;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 邮件通知渠道实现
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class EmailNotificationChannel implements NotificationChannel {

    private final JavaMailSender mailSender;
    private final AlertTemplateEngine templateEngine;

    @Override
    public NotificationResult send(AlertMessage message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // 设置邮件基本信息
            helper.setFrom(getConfig().getFromAddress());
            helper.setTo(message.getRecipients().toArray(new String[0]));
            helper.setSubject(generateSubject(message));
            helper.setText(generateContent(message), true); // HTML格式

            // 添加附件（如果有）
            if (message.hasAttachments()) {
                for (AlertAttachment attachment : message.getAttachments()) {
                    helper.addAttachment(attachment.getFileName(), attachment.getContent());
                }
            }

            // 发送邮件
            mailSender.send(mimeMessage);

            log.info("邮件告警发送成功: {}", message.getAlertId());
            return NotificationResult.success(getChannelName(), "邮件发送成功");

        } catch (Exception e) {
            log.error("邮件告警发送失败: {}", message.getAlertId(), e);
            return NotificationResult.failure(getChannelName(), e.getMessage());
        }
    }

    @Override
    public String getChannelName() {
        return "email";
    }

    @Override
    public boolean isAvailable() {
        return getConfig().isEnabled() && mailSender != null;
    }

    @Override
    public NotificationChannelConfig getConfig() {
        // 从配置文件或数据库获取配置
        return NotificationChannelConfig.builder()
                .channelName("email")
                .enabled(true)
                .fromAddress("noreply@knene.com")
                .smtpHost("smtp.example.com")
                .smtpPort(587)
                .build();
    }

    private String generateSubject(AlertMessage message) {
        return String.format("[%s] %s - 数据库验证告警",
                message.getAlertLevel().name(),
                message.getTitle());
    }

    private String generateContent(AlertMessage message) {
        return templateEngine.renderTemplate("verification-alert", message);
    }
}
```

### 短信通知渠道

```java
package com.knene.service.alert.notification;

import com.knene.service.sms.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 短信通知渠道实现
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SmsNotificationChannel implements NotificationChannel {

    private final SmsService smsService;

    @Override
    public NotificationResult send(AlertMessage message) {
        try {
            String content = generateSmsContent(message);

            for (String phoneNumber : message.getRecipients()) {
                smsService.sendSms(phoneNumber, content);
            }

            log.info("短信告警发送成功: {}", message.getAlertId());
            return NotificationResult.success(getChannelName(), "短信发送成功");

        } catch (Exception e) {
            log.error("短信告警发送失败: {}", message.getAlertId(), e);
            return NotificationResult.failure(getChannelName(), e.getMessage());
        }
    }

    @Override
    public String getChannelName() {
        return "sms";
    }

    @Override
    public boolean isAvailable() {
        return getConfig().isEnabled() && smsService != null;
    }

    @Override
    public NotificationChannelConfig getConfig() {
        return NotificationChannelConfig.builder()
                .channelName("sms")
                .enabled(false)  // 默认关闭
                .build();
    }

    private String generateSmsContent(AlertMessage message) {
        return String.format("【Knene告警】%s，健康评分：%s，详情请查看邮件。",
                message.getTitle(),
                message.getHealthScore());
    }
}
```

### Webhook通知渠道

```java
package com.knene.service.alert.notification;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.RestTemplate;

/**
 * Webhook通知渠道实现
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WebhookNotificationChannel implements NotificationChannel {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public NotificationResult send(AlertMessage message) {
        try {
            String webhookUrl = getWebhookUrl(message.getAlertLevel());
            String payload = createWebhookPayload(message);

            restTemplate.postForObject(webhookUrl, payload, String.class);

            log.info("Webhook告警发送成功: {} -> {}", message.getAlertId(), webhookUrl);
            return NotificationResult.success(getChannelName(), "Webhook发送成功");

        } catch (Exception e) {
            log.error("Webhook告警发送失败: {}", message.getAlertId(), e);
            return NotificationResult.failure(getChannelName(), e.getMessage());
        }
    }

    @Override
    public String getChannelName() {
        return "webhook";
    }

    @Override
    public boolean isAvailable() {
        return getConfig().isEnabled();
    }

    @Override
    public NotificationChannelConfig getConfig() {
        return NotificationChannelConfig.builder()
                .channelName("webhook")
                .enabled(true)
                .build();
    }

    private String getWebhookUrl(AlertLevel level) {
        // 根据告警级别返回不同的Webhook URL
        return switch (level) {
            case HIGH -> "https://hooks.slack.com/services/critical-alerts";
            case MEDIUM -> "https://hooks.slack.com/services/warning-alerts";
            case LOW -> "https://hooks.slack.com/services/info-alerts";
        };
    }

    private String createWebhookPayload(AlertMessage message) {
        try {
            Map<String, Object> payload = Map.of(
                    "text", message.getTitle(),
                    "attachments", List.of(
                            Map.of(
                                    "color", getColorByLevel(message.getAlertLevel()),
                                    "fields", List.of(
                                            Map.of("title", "执行ID", "value", message.getExecutionId(), "short", true),
                                            Map.of("title", "健康评分", "value", String.valueOf(message.getHealthScore()), "short", true),
                                            Map.of("title", "问题数量", "value", String.valueOf(message.getTotalIssues()), "short", true)
                                    ),
                                    "actions", List.of(
                                            Map.of(
                                                    "type", "button",
                                                    "text", "查看详情",
                                                    "url", generateDetailUrl(message.getExecutionId())
                                            )
                                    )
                            )
                    )
            );

            return objectMapper.writeValueAsString(payload);

        } catch (Exception e) {
            log.error("创建Webhook载荷失败", e);
            return "{\"text\": \"告警通知: " + message.getTitle() + "\"}";
        }
    }

    private String getColorByLevel(AlertLevel level) {
        return switch (level) {
            case HIGH -> "danger";
            case MEDIUM -> "warning";
            case LOW -> "good";
        };
    }

    private String generateDetailUrl(String executionId) {
        return String.format("https://your-domain.com/verification/details/%s", executionId);
    }
}
```

## 告警模板引擎

### 模板引擎接口

```java
package com.knene.service.alert.template;

import com.knene.model.alert.AlertMessage;

/**
 * 告警模板引擎接口
 */
public interface AlertTemplateEngine {

    /**
     * 渲染模板
     */
    String renderTemplate(String templateName, AlertMessage message);

    /**
     * 获取可用模板列表
     */
    List<String> getAvailableTemplates();
}
```

### 模板引擎实现

```java
package com.knene.service.alert.template;

import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;

/**
 * 基于Thymeleaf的告警模板引擎实现
 */
@Component
public class ThymeleafAlertTemplateEngine implements AlertTemplateEngine {

    private final TemplateEngine templateEngine;

    public ThymeleafAlertTemplateEngine(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    @Override
    public String renderTemplate(String templateName, AlertMessage message) {
        Context context = new Context();
        context.setVariable("alert", message);
        context.setVariable("timestamp", java.time.LocalDateTime.now());

        return templateEngine.process("alerts/" + templateName, context);
    }

    @Override
    public List<String> getAvailableTemplates() {
        return List.of("verification-alert", "critical-issue", "trend-anomaly");
    }
}
```

### 邮件模板示例

#### verification-alert.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>数据库验证告警</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .alert-icon { font-size: 48px; margin-bottom: 10px; }
        .alert-critical { color: #d32f2f; }
        .alert-warning { color: #f57c00; }
        .alert-info { color: #1976d2; }
        .info-section { margin: 20px 0; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { font-size: 18px; margin-left: 10px; }
        .issues-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .issues-table th, .issues-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .issues-table th { background-color: #f2f2f2; }
        .level-critical { color: #d32f2f; font-weight: bold; }
        .level-error { color: #f57c00; font-weight: bold; }
        .level-warn { color: #1976d2; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; }
        .action-button { display: inline-block; padding: 10px 20px; background-color: #1976d2; color: white; text-decoration: none; border-radius: 4px; margin: 10px 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="alert-icon alert-${alert.alertLevel.name().toLowerCase()}">
                <span th:if="${alert.alertLevel.name() == 'HIGH'}">🚨</span>
                <span th:if="${alert.alertLevel.name() == 'MEDIUM'}">⚠️</span>
                <span th:if="${alert.alertLevel.name() == 'LOW'}">ℹ️</span>
            </div>
            <h1>数据库验证告警</h1>
            <p th:text="${alert.title}">告警标题</p>
        </div>

        <div class="info-section">
            <p><span class="info-label">执行ID:</span><span class="info-value" th:text="${alert.executionId}">执行ID</span></p>
            <p><span class="info-label">执行时间:</span><span class="info-value" th:text="${#temporals.format(alert.timestamp, 'yyyy-MM-dd HH:mm:ss')}">执行时间</span></p>
            <p><span class="info-label">健康评分:</span><span class="info-value" th:text="${alert.healthScore}">健康评分</span></p>
            <p><span class="info-label">总问题数:</span><span class="info-value" th:text="${alert.totalIssues}">问题数量</span></p>
        </div>

        <div th:if="${!alert.issues.empty}">
            <h3>问题详情</h3>
            <table class="issues-table">
                <thead>
                    <tr>
                        <th>级别</th>
                        <th>模块</th>
                        <th>问题描述</th>
                        <th>建议措施</th>
                    </tr>
                </thead>
                <tbody>
                    <tr th:each="issue : ${alert.issues}">
                        <td th:classappend="'level-' + ${issue.level.name().toLowerCase()}" th:text="${issue.level.name()}">级别</td>
                        <td th:text="${issue.moduleName}">模块</td>
                        <td th:text="${issue.description}">问题描述</td>
                        <td th:text="${issue.suggestion}">建议措施</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="footer">
            <p>请及时处理这些问题以确保数据库健康状态。</p>
            <div>
                <a th:href="${alert.detailUrl}" class="action-button">查看详情</a>
                <a th:href="${alert.manageUrl}" class="action-button">管理告警</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px;">
                此邮件由 Knene 数据库验证系统自动发送<br>
                如不需要接收此类邮件，请联系系统管理员
            </p>
        </div>
    </div>
</body>
</html>
```

## 告警服务主实现

```java
package com.knene.service.alert;

import com.knene.model.alert.AlertMessage;
import com.knene.model.alert.NotificationResult;
import com.knene.service.alert.notification.NotificationChannel;
import com.knene.service.alert.notification.NotificationChannelManager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 告警服务实现
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final NotificationChannelManager channelManager;
    private final AlertRuleEngine ruleEngine;
    private final AlertHistoryManager historyManager;

    // 告警冷却期管理
    private final Map<String, Long> alertCooldowns = new ConcurrentHashMap<>();

    @Override
    public void sendAlert(AlertMessage message) {
        try {
            // 检查冷却期
            if (isInCooldown(message)) {
                log.debug("告警在冷却期内，跳过发送: {}", message.getAlertId());
                return;
            }

            // 检查告警规则
            if (!shouldSendAlert(message)) {
                log.debug("告警规则检查未通过，跳过发送: {}", message.getAlertId());
                return;
            }

            // 获取通知渠道
            List<NotificationChannel> channels = getNotificationChannels(message);

            if (channels.isEmpty()) {
                log.warn("没有可用的通知渠道: {}", message.getAlertId());
                return;
            }

            // 并行发送通知
            List<CompletableFuture<NotificationResult>> futures = channels.stream()
                    .map(channel -> CompletableFuture.supplyAsync(() -> channel.send(message)))
                    .toList();

            // 等待所有通知发送完成
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

            // 收集发送结果
            List<NotificationResult> results = futures.stream()
                    .map(CompletableFuture::join)
                    .toList();

            // 记录发送历史
            historyManager.recordNotification(message, results);

            // 更新冷却期
            updateCooldown(message);

            log.info("告警发送完成: {}, 成功渠道: {}/{}",
                    message.getAlertId(),
                    results.stream().mapToInt(r -> r.isSuccess() ? 1 : 0).sum(),
                    results.size());

        } catch (Exception e) {
            log.error("告警发送失败: {}", message.getAlertId(), e);
        }
    }

    @Override
    public void sendCriticalAlert(String title, String message, String executionId) {
        AlertMessage alertMessage = AlertMessage.builder()
                .alertId(generateAlertId())
                .title(title)
                .message(message)
                .executionId(executionId)
                .alertLevel(AlertLevel.HIGH)
                .timestamp(java.time.LocalDateTime.now())
                .recipients(getCriticalAlertRecipients())
                .build();

        sendAlert(alertMessage);
    }

    @Override
    public List<NotificationResult> testChannels() {
        AlertMessage testMessage = AlertMessage.builder()
                .alertId("TEST_" + System.currentTimeMillis())
                .title("告警系统测试")
                .message("这是一个测试告警消息")
                .alertLevel(AlertLevel.LOW)
                .timestamp(java.time.LocalDateTime.now())
                .recipients(List.of("test@example.com"))
                .build();

        List<NotificationChannel> channels = channelManager.getAllAvailableChannels();

        return channels.stream()
                .map(channel -> {
                    try {
                        return channel.send(testMessage);
                    } catch (Exception e) {
                        return NotificationResult.failure(channel.getChannelName(), e.getMessage());
                    }
                })
                .toList();
    }

    private boolean isInCooldown(AlertMessage message) {
        String cooldownKey = generateCooldownKey(message);
        Long lastSentTime = alertCooldowns.get(cooldownKey);

        if (lastSentTime == null) {
            return false;
        }

        long cooldownPeriod = getCooldownPeriod(message);
        long currentTime = System.currentTimeMillis();

        return (currentTime - lastSentTime) < cooldownPeriod;
    }

    private boolean shouldSendAlert(AlertMessage message) {
        return ruleEngine.evaluateRules(message);
    }

    private List<NotificationChannel> getNotificationChannels(AlertMessage message) {
        return channelManager.getChannelsForLevel(message.getAlertLevel());
    }

    private void updateCooldown(AlertMessage message) {
        String cooldownKey = generateCooldownKey(message);
        long currentTime = System.currentTimeMillis();
        alertCooldowns.put(cooldownKey, currentTime);
    }

    private String generateAlertId() {
        return "ALERT_" + System.currentTimeMillis();
    }

    private String generateCooldownKey(AlertMessage message) {
        return String.format("%s_%s", message.getAlertLevel(), message.getTitle());
    }

    private long getCooldownPeriod(AlertMessage message) {
        // 根据告警级别返回不同的冷却期（毫秒）
        return switch (message.getAlertLevel()) {
            case HIGH -> 30 * 60 * 1000L;    // 30分钟
            case MEDIUM -> 60 * 60 * 1000L;   // 1小时
            case LOW -> 4 * 60 * 60 * 1000L;   // 4小时
        };
    }

    private List<String> getCriticalAlertRecipients() {
        // 从配置获取严重告警的接收人列表
        return List.of("admin@example.com", "dba@example.com");
    }
}
```

## 配置文件

### application.yml 告警配置

```yaml
database:
  verification:
    alert:
      # 通用配置
      enabled: true
      template-engine: thymeleaf
      max-retry-attempts: 3
      retry-delay: 30s

      # 邮件配置
      email:
        enabled: true
        from: noreply@knene.com
        smtp:
          host: smtp.example.com
          port: 587
          username: your-email@example.com
          password: your-password
          properties:
            mail.smtp.auth: true
            mail.smtp.starttls.enable: true

        # 默认接收人
        default-recipients:
          - admin@example.com
          - dba@example.com

        # 严重告警接收人
        critical-recipients:
          - admin@example.com
          - ops-team@example.com
          - dba-team@example.com

      # 短信配置
      sms:
        enabled: false
        provider: twilio  # 支持 twilio, aliyun, tencent
        twilio:
          account-sid: your-account-sid
          auth-token: your-auth-token
          from-number: your-phone-number
        aliyun:
          access-key: your-access-key
          access-secret: your-access-secret
          sign-name: Knene告警
          template-code: SMS_123456789

      # Webhook配置
      webhook:
        enabled: true
        timeout: 10s
        retry-attempts: 3

        # Slack配置
        slack:
          enabled: true
          webhook-url: https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
          channel: #alerts
          username: Knene验证系统

        # 钉钉配置
        dingtalk:
          enabled: false
          webhook-url: https://oapi.dingtalk.com/robot/send?access_token=YOUR_TOKEN

        # 自定义Webhook
        custom:
          - name: monitor-system
            url: https://your-monitoring-system.com/webhooks/alerts
            headers:
              Authorization: Bearer your-token
              Content-Type: application/json

      # 告警规则配置
      rules:
        health-score-critical:
          enabled: true
          threshold: 60.0
          cooldown: 30m
          channels: [email, sms, webhook]

        health-score-warning:
          enabled: true
          threshold: 80.0
          cooldown: 60m
          channels: [email]

        execution-failure:
          enabled: true
          cooldown: 60m
          channels: [email, webhook]

        trend-anomaly:
          enabled: true
          threshold-growth-factor: 1.5
          cooldown: 24h
          channels: [email]

      # 模板配置
      templates:
        email:
          verification-alert: alerts/verification-alert.html
          critical-issue: alerts/critical-issue.html
          trend-anomaly: alerts/trend-anomaly.html

        sms:
          critical-alert: alerts/critical-sms.txt
          warning-alert: alerts/warning-sms.txt

        webhook:
          slack: alerts/slack-payload.json
          dingtalk: alerts/dingtalk-payload.json
```

---

**文档版本**：V1.0.0
**创建日期**：2025-10-30
**维护团队**：相笑与春风
**审核状态**：待审核