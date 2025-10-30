# 数据库验证系统测试指南

## 概述

本文档提供了数据库验证系统的完整测试指南，包括测试环境准备、测试策略、测试用例设计、测试执行和结果验证等方面的详细说明。

## 测试目标

### 主要测试目标

1. **功能完整性测试**：确保验证系统所有功能正常工作
2. **性能表现测试**：验证系统在不同负载下的性能表现
3. **异常处理测试**：测试各种异常情况下的处理机制
4. **集成测试**：验证与Flyway、Spring Boot等系统的集成
5. **安全性测试**：确保验证过程不会对数据安全造成威胁

### 测试成功标准

- 所有验证脚本能够正常执行
- 验证结果准确可靠
- 异常情况能够正确处理
- 性能指标满足要求
- 与其他系统集成正常

## 测试环境准备

### 环境要求

#### 硬件要求
- **CPU**：4核心以上
- **内存**：8GB以上
- **存储**：50GB以上可用空间
- **网络**：稳定的网络连接

#### 软件要求
- **操作系统**：Linux/Windows/macOS
- **数据库**：MySQL 8.0+
- **Java**：JDK 11+
- **构建工具**：Maven 3.6+
- **测试框架**：JUnit 5, TestContainers

### 测试数据库设置

#### 创建测试数据库

```sql
-- 创建测试数据库
CREATE DATABASE knene_verification_test
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 创建测试用户
CREATE USER 'verification_test'@'localhost' IDENTIFIED BY 'test_password_123';
GRANT ALL PRIVILEGES ON knene_verification_test.* TO 'verification_test'@'localhost';
FLUSH PRIVILEGES;
```

#### 测试数据准备

```sql
-- 创建基础测试数据的脚本
USE knene_verification_test;

-- 插入测试用户数据
INSERT INTO users (id, username, email, password_hash, created_at, updated_at) VALUES
(1, 'test_user_1', 'test1@example.com', 'hashed_password_1', NOW(), NOW()),
(2, 'test_user_2', 'test2@example.com', 'hashed_password_2', NOW(), NOW()),
(3, 'test_admin', 'admin@example.com', 'hashed_password_admin', NOW(), NOW());

-- 插入测试角色数据
INSERT INTO roles (id, role_name, role_code, description, created_at, updated_at) VALUES
(1, '普通用户', 'USER', '普通用户角色', NOW(), NOW()),
(2, 'VIP用户', 'VIP', 'VIP用户角色', NOW(), NOW()),
(3, '管理员', 'ADMIN', '管理员角色', NOW(), NOW());

-- 插入用户角色关联
INSERT INTO user_roles (user_id, role_id, created_at) VALUES
(1, 1, NOW()),
(2, 2, NOW()),
(3, 3, NOW());
```

### 测试配置文件

#### application-test.yml

```yaml
# 测试环境配置
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/knene_verification_test?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: verification_test
    password: test_password_123
    driver-class-name: com.mysql.cj.jdbc.Driver

  flyway:
    enabled: true
    locations: classpath:db/migration/test
    baseline-on-migrate: true

# 验证系统测试配置
verification:
  enabled: true
  test-mode: true
  auto-execute:
    on-migration: true
    on-startup: false
    scheduled: false

  execution:
    timeout-seconds: 60  # 测试环境缩短超时时间
    max-concurrent-scripts: 2  # 测试环境减少并发数

  test:
    create-test-data: true
    cleanup-after-test: true
    generate-test-reports: true

logging:
  level:
    com.knene.verification: DEBUG
    org.flywaydb: DEBUG
```

## 测试策略和分类

### 测试分类

#### 1. 单元测试 (Unit Tests)

**测试范围**：
- 验证脚本语法检查
- 数据验证逻辑函数
- 健康评分计算
- 问题分级逻辑

**测试工具**：
- JUnit 5
- Mockito
- H2内存数据库

#### 2. 集成测试 (Integration Tests)

**测试范围**：
- 验证系统与数据库集成
- 验证脚本执行流程
- Flyway集成验证
- Spring Boot集成验证

**测试工具**：
- JUnit 5
- TestContainers
- Spring Boot Test

#### 3. 端到端测试 (E2E Tests)

**测试范围**：
- 完整验证流程测试
- 多模块并行执行测试
- 异常场景处理测试
- 性能压力测试

**测试工具**：
- JUnit 5
- TestContainers
- 真实MySQL数据库

#### 4. 性能测试 (Performance Tests)

**测试范围**：
- 大数据量场景测试
- 并发执行性能测试
- 内存使用情况测试
- 执行时间基准测试

**测试工具**：
- JMeter
- Gatling
- 自定义性能测试

## 详细测试用例

### 1. 基础功能测试

#### 1.1 验证脚本发现测试

```java
@Test
@DisplayName("验证脚本发现功能测试")
class ScriptDiscoveryTest {

    @Autowired
    private ScriptDiscoveryService scriptDiscoveryService;

    @Test
    @DisplayName("应该能够发现所有验证脚本")
    void shouldDiscoverAllVerificationScripts() {
        // Given
        String scriptDirectory = "scripts/database/";

        // When
        List<VerificationScript> scripts = scriptDiscoveryService.discoverScripts(scriptDirectory);

        // Then
        assertThat(scripts).isNotEmpty();
        assertThat(scripts.stream()
            .map(VerificationScript::getScriptName)
            .collect(Collectors.toList()))
            .contains(
                "verify_core_tables.sql",
                "verify_auth_extension_tables.sql",
                "verify_user_center_tables.sql",
                "verify_vip_business_tables_optimized.sql"
            );
    }

    @Test
    @DisplayName("应该能够按模块分组脚本")
    void shouldGroupScriptsByModule() {
        // Given
        List<VerificationScript> scripts = scriptDiscoveryService.discoverScripts("scripts/database/");

        // When
        Map<String, List<VerificationScript>> groupedScripts =
            scriptDiscoveryService.groupScriptsByModule(scripts);

        // Then
        assertThat(groupedScripts).containsKeys("core", "auth", "user_center", "vip_business");
        assertThat(groupedScripts.get("core")).hasSize(1);
        assertThat(groupedScripts.get("auth")).hasSize(1);
    }

    @Test
    @DisplayName("应该验证脚本语法正确性")
    void shouldValidateScriptSyntax() {
        // Given
        String validScript = "SELECT 1 as test_result;";
        String invalidScript = "SELCT 1 as test_result;"; // 故意的语法错误

        // When & Then
        assertThat(scriptDiscoveryService.validateScriptSyntax(validScript)).isTrue();
        assertThat(scriptDiscoveryService.validateScriptSyntax(invalidScript)).isFalse();
    }
}
```

#### 1.2 验证执行测试

```java
@Test
@DisplayName("验证执行功能测试")
class VerificationExecutionTest {

    @Autowired
    private VerificationExecutor verificationExecutor;

    @Autowired
    private VerificationExecutionRepository executionRepository;

    @Test
    @DisplayName("应该能够成功执行单个验证脚本")
    void shouldExecuteSingleScriptSuccessfully() {
        // Given
        String scriptName = "verify_core_tables.sql";
        String executionId = "TEST_" + System.currentTimeMillis();

        // When
        VerificationResult result = verificationExecutor.executeScript(executionId, scriptName);

        // Then
        assertThat(result.getExecutionStatus()).isEqualTo("SUCCESS");
        assertThat(result.getScriptName()).isEqualTo(scriptName);
        assertThat(result.getExecutionId()).isEqualTo(executionId);
        assertThat(result.getDetailedResults()).isNotEmpty();
    }

    @Test
    @DisplayName("应该能够并行执行多个验证脚本")
    void shouldExecuteMultipleScriptsInParallel() throws InterruptedException {
        // Given
        String executionId = "PARALLEL_TEST_" + System.currentTimeMillis();
        List<String> scriptNames = Arrays.asList(
            "verify_core_tables.sql",
            "verify_auth_extension_tables.sql"
        );

        // When
        CompletableFuture<List<VerificationResult>> future =
            verificationExecutor.executeScriptsAsync(executionId, scriptNames);
        List<VerificationResult> results = future.get(30, TimeUnit.SECONDS);

        // Then
        assertThat(results).hasSize(2);
        assertThat(results.stream()
            .allMatch(r -> r.getExecutionStatus().equals("SUCCESS"))).isTrue();

        // 验证执行时间确实比串行执行短
        VerificationExecution execution = executionRepository.findByExecutionId(executionId);
        assertThat(execution.getExecutionDurationSeconds()).isLessThan(60); // 应该小于各脚本执行时间之和
    }

    @Test
    @DisplayName("应该处理脚本执行超时")
    void shouldHandleScriptExecutionTimeout() {
        // Given
        String executionId = "TIMEOUT_TEST_" + System.currentTimeMillis();
        // 模拟一个会超时的脚本
        String scriptName = "verify_timeout_test.sql";

        // When
        VerificationResult result = verificationExecutor.executeScript(executionId, scriptName);

        // Then
        assertThat(result.getExecutionStatus()).isEqualTo("TIMEOUT");
        assertThat(result.getErrorMessage()).contains("timeout");
    }
}
```

#### 1.3 结果处理测试

```java
@Test
@DisplayName("验证结果处理测试")
class VerificationResultTest {

    @Autowired
    private VerificationResultProcessor resultProcessor;

    @Test
    @DisplayName("应该正确计算健康评分")
    void shouldCalculateHealthScoreCorrectly() {
        // Given
        List<VerificationResult> results = createTestResults();
        String executionId = "HEALTH_SCORE_TEST";

        // When
        BigDecimal healthScore = resultProcessor.calculateHealthScore(executionId, results);

        // Then
        assertThat(healthScore).isBetween(BigDecimal.ZERO, new BigDecimal("100"));
        // 根据测试数据验证具体分数
        assertThat(healthScore).isGreaterThan(new BigDecimal("70")); // 假设测试数据对应70分以上
    }

    @Test
    @DisplayName("应该正确分级问题严重程度")
    void shouldClassifyIssuesCorrectly() {
        // Given
        List<VerificationIssue> issues = Arrays.asList(
            new VerificationIssue("TABLE_MISSING", "Critical table missing", 100),
            new VerificationIssue("DATA_INCONSISTENCY", "Data inconsistency found", 50),
            new VerificationIssue("PERFORMANCE_ISSUE", "Slow query detected", 20),
            new VerificationIssue("INFO_MESSAGE", "Informational message", 0)
        );

        // When
        Map<WarningLevel, List<VerificationIssue>> classifiedIssues =
            resultProcessor.classifyIssues(issues);

        // Then
        assertThat(classifiedIssues.get(WarningLevel.CRITICAL)).hasSize(1);
        assertThat(classifiedIssues.get(WarningLevel.ERROR)).hasSize(1);
        assertThat(classifiedIssues.get(WarningLevel.WARN)).hasSize(1);
        assertThat(classifiedIssues.get(WarningLevel.INFO)).hasSize(1);
    }

    @Test
    @DisplayName("应该生成详细的验证报告")
    void shouldGenerateDetailedReport() {
        // Given
        String executionId = "REPORT_TEST_" + System.currentTimeMillis();
        List<VerificationResult> results = createTestResults();

        // When
        VerificationReport report = resultProcessor.generateReport(executionId, results);

        // Then
        assertThat(report.getExecutionId()).isEqualTo(executionId);
        assertThat(report.getHealthScore()).isNotNull();
        assertThat(report.getSummary()).isNotNull();
        assertThat(report.getModuleDetails()).isNotEmpty();
        assertThat(report.getIssueStatistics()).isNotNull();
        assertThat(report.getRecommendations()).isNotEmpty();
    }
}
```

### 2. 集成测试

#### 2.1 Flyway集成测试

```java
@SpringBootTest
@Testcontainers
@DisplayName("Flyway集成验证测试")
class FlywayIntegrationTest {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("knene_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
    }

    @Autowired
    private Flyway flyway;

    @Autowired
    private VerificationExecutionRepository executionRepository;

    @Test
    @DisplayName("Flyway迁移后应该自动触发验证")
    void shouldTriggerVerificationAfterFlywayMigration() {
        // Given
        flyway.clean();
        flyway.migrate();

        // When
        // Flyway迁移完成后，after_migration.sql应该自动执行验证

        // Then
        // 验证是否有验证执行记录
        List<VerificationExecution> executions = executionRepository.findAll();
        assertThat(executions).isNotEmpty();

        VerificationExecution latestExecution = executions.get(executions.size() - 1);
        assertThat(latestExecution.getExecutionType()).isEqualTo("MIGRATION");
        assertThat(latestExecution.getExecutionStatus()).isIn("COMPLETED", "SUCCESS");
    }

    @Test
    @DisplayName("验证结果应该正确记录到数据库")
    void shouldRecordVerificationResultsCorrectly() {
        // Given
        flyway.clean();
        flyway.migrate();

        // When
        // 等待验证完成
        Thread.sleep(5000);

        // Then
        List<VerificationExecution> executions = executionRepository.findAll();
        VerificationExecution latestExecution = executions.get(executions.size() - 1);

        assertThat(latestExecution.getHealthScore()).isNotNull();
        assertThat(latestExecution.getTotalChecks()).isGreaterThan(0);
        assertThat(latestExecution.getStartTime()).isNotNull();
        assertThat(latestExecution.getEndTime()).isNotNull();
    }
}
```

#### 2.2 Spring Boot集成测试

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DisplayName("Spring Boot集成验证测试")
class SpringBootIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private VerificationService verificationService;

    @Test
    @DisplayName("应该能够通过REST API触发验证")
    void shouldTriggerVerificationViaRestApi() {
        // Given
        VerificationRequest request = new VerificationRequest();
        request.setExecutionType("MANUAL");
        request.setTriggerSource("Test API");
        request.setModules(Arrays.asList("core", "auth"));

        // When
        ResponseEntity<ApiResponse> response = restTemplate.postForEntity(
            "/api/verification/execute", request, ApiResponse.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().isSuccess()).isTrue();

        Map<String, Object> data = (Map<String, Object>) response.getBody().getData();
        assertThat(data).containsKey("executionId");
    }

    @Test
    @DisplayName("应该能够查询验证执行状态")
    void shouldQueryVerificationExecutionStatus() {
        // Given
        String executionId = verificationService.executeVerification("MANUAL", "Test Query");

        // When
        ResponseEntity<ApiResponse> response = restTemplate.getForEntity(
            "/api/verification/status/" + executionId, ApiResponse.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().isSuccess()).isTrue();

        Map<String, Object> data = (Map<String, Object>) response.getBody().getData();
        assertThat(data.get("executionId")).isEqualTo(executionId);
        assertThat(data).containsKey("executionStatus");
        assertThat(data).containsKey("healthScore");
    }

    @Test
    @DisplayName("应该能够获取验证历史记录")
    void shouldGetVerificationHistory() {
        // Given
        // 执行几次验证
        for (int i = 0; i < 3; i++) {
            verificationService.executeVerification("MANUAL", "History Test " + i);
        }

        // When
        ResponseEntity<ApiResponse> response = restTemplate.getForEntity(
            "/api/verification/history?limit=10", ApiResponse.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().isSuccess()).isTrue();

        List<Map<String, Object>> history = (List<Map<String, Object>>) response.getBody().getData();
        assertThat(history).hasSize(3);
    }
}
```

### 3. 性能测试

#### 3.1 执行性能测试

```java
@Test
@DisplayName("验证系统性能测试")
class VerificationPerformanceTest {

    @Autowired
    private VerificationExecutor verificationExecutor;

    @Test
    @DisplayName("单个验证脚本执行时间应该在合理范围内")
    void shouldExecuteSingleScriptWithinReasonableTime() {
        // Given
        String scriptName = "verify_core_tables.sql";
        long expectedMaxTime = 30000; // 30秒

        // When
        long startTime = System.currentTimeMillis();
        VerificationResult result = verificationExecutor.executeScript("PERF_TEST", scriptName);
        long endTime = System.currentTimeMillis();

        // Then
        long executionTime = endTime - startTime;
        assertThat(executionTime).isLessThan(expectedMaxTime);
        assertThat(result.getExecutionStatus()).isEqualTo("SUCCESS");
    }

    @Test
    @DisplayName("并发执行多个脚本应该提高效率")
    void shouldImproveEfficiencyWithConcurrentExecution() throws InterruptedException {
        // Given
        List<String> scriptNames = Arrays.asList(
            "verify_core_tables.sql",
            "verify_auth_extension_tables.sql",
            "verify_user_center_tables.sql"
        );

        // When - 串行执行
        long serialStartTime = System.currentTimeMillis();
        for (String scriptName : scriptNames) {
            verificationExecutor.executeScript("SERIAL_TEST", scriptName);
        }
        long serialEndTime = System.currentTimeMillis();
        long serialTime = serialEndTime - serialStartTime;

        // When - 并行执行
        long parallelStartTime = System.currentTimeMillis();
        CompletableFuture<List<VerificationResult>> future =
            verificationExecutor.executeScriptsAsync("PARALLEL_TEST", scriptNames);
        future.get(60, TimeUnit.SECONDS);
        long parallelEndTime = System.currentTimeMillis();
        long parallelTime = parallelEndTime - parallelStartTime;

        // Then
        assertThat(parallelTime).isLessThan(serialTime * 0.8); // 并行执行应该至少快20%
    }

    @Test
    @DisplayName("系统应该能够处理大量验证脚本")
    void shouldHandleLargeNumberOfScripts() {
        // Given
        List<String> scriptNames = createManyTestScripts(20); // 创建20个测试脚本
        long expectedMaxTime = 120000; // 2分钟

        // When
        long startTime = System.currentTimeMillis();
        try {
            CompletableFuture<List<VerificationResult>> future =
                verificationExecutor.executeScriptsAsync("BULK_TEST", scriptNames);
            List<VerificationResult> results = future.get(180, TimeUnit.SECONDS);
            long endTime = System.currentTimeMillis();

            // Then
            long executionTime = endTime - startTime;
            assertThat(executionTime).isLessThan(expectedMaxTime);
            assertThat(results).hasSize(20);
            assertThat(results.stream()
                .allMatch(r -> r.getExecutionStatus().equals("SUCCESS"))).isTrue();
        } catch (Exception e) {
            fail("Bulk execution should not fail", e);
        }
    }
}
```

#### 3.2 内存使用测试

```java
@Test
@DisplayName("内存使用性能测试")
class MemoryUsageTest {

    @Autowired
    private VerificationExecutor verificationExecutor;

    @Test
    @DisplayName("验证执行不应该导致内存泄漏")
    void shouldNotCauseMemoryLeaks() {
        // Given
        Runtime runtime = Runtime.getRuntime();
        long initialMemory = runtime.totalMemory() - runtime.freeMemory();

        // When - 执行多次验证
        for (int i = 0; i < 10; i++) {
            verificationExecutor.executeScript("MEMORY_TEST_" + i, "verify_core_tables.sql");

            // 强制垃圾回收
            System.gc();
            Thread.sleep(1000);
        }

        long finalMemory = runtime.totalMemory() - runtime.freeMemory();
        long memoryIncrease = finalMemory - initialMemory;

        // Then
        // 内存增长应该在合理范围内（小于100MB）
        assertThat(memoryIncrease).isLessThan(100 * 1024 * 1024);
    }

    @Test
    @DisplayName("大数据量验证应该正确处理内存")
    void shouldHandleLargeDataSetsCorrectly() {
        // Given
        // 创建大量测试数据
        createLargeTestData(10000); // 10万条记录

        // When
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory();

        VerificationResult result = verificationExecutor.executeScript(
            "LARGE_DATA_TEST", "verify_large_data.sql");

        // Then
        assertThat(result.getExecutionStatus()).isEqualTo("SUCCESS");

        // 验证内存使用没有超过限制
        long usedMemory = runtime.totalMemory() - runtime.freeMemory();
        assertThat(usedMemory).isLessThan(maxMemory * 0.8); // 使用内存不超过最大内存的80%
    }
}
```

### 4. 异常处理测试

#### 4.1 数据库连接异常测试

```java
@Test
@DisplayName("数据库连接异常处理测试")
class DatabaseConnectionExceptionTest {

    @Mock
    private DataSource dataSource;

    @Mock
    private Connection connection;

    @Mock
    private Statement statement;

    @Autowired
    private VerificationExecutor verificationExecutor;

    @Test
    @DisplayName("应该处理数据库连接超时")
    void shouldHandleDatabaseConnectionTimeout() {
        // Given
        when(dataSource.getConnection()).thenThrow(
            new SQLException("Connection timeout"));

        // When
        VerificationResult result = verificationExecutor.executeScript(
            "TIMEOUT_TEST", "verify_core_tables.sql");

        // Then
        assertThat(result.getExecutionStatus()).isEqualTo("FAILED");
        assertThat(result.getErrorMessage()).contains("timeout");
    }

    @Test
    @DisplayName("应该处理数据库连接中断")
    void shouldHandleDatabaseConnectionInterruption() {
        // Given
        when(statement.executeQuery("SELECT 1"))
            .thenThrow(new SQLException("Connection lost"));

        // When
        try {
            VerificationResult result = verificationExecutor.executeScript(
                "INTERRUPT_TEST", "verify_core_tables.sql");

            // Then
            assertThat(result.getExecutionStatus()).isEqualTo("FAILED");
            assertThat(result.getErrorMessage()).contains("Connection lost");
        } catch (Exception e) {
            // 验证异常被正确处理，不会导致系统崩溃
            assertThat(e).isInstanceOf(VerificationExecutionException.class);
        }
    }
}
```

#### 4.2 脚本语法错误测试

```java
@Test
@DisplayName("脚本语法错误处理测试")
class ScriptSyntaxErrorTest {

    @Autowired
    private ScriptValidationService scriptValidationService;

    @Test
    @DisplayName("应该检测脚本语法错误")
    void shouldDetectScriptSyntaxErrors() {
        // Given
        String invalidScript = "SELCT * FROM users WHERE id = 1;"; // 故意的拼写错误

        // When
        ValidationResult result = scriptValidationService.validateScript(invalidScript);

        // Then
        assertThat(result.isValid()).isFalse();
        assertThat(result.getErrorMessage()).contains("syntax");
    }

    @Test
    @DisplayName("应该处理脚本执行中的运行时错误")
    void shouldHandleScriptRuntimeErrors() {
        // Given
        String scriptWithRuntimeError =
            "SELECT * FROM non_existent_table;"; // 不存在的表

        // When
        VerificationResult result = verificationExecutor.executeScript(
            "RUNTIME_ERROR_TEST", scriptWithRuntimeError);

        // Then
        assertThat(result.getExecutionStatus()).isEqualTo("FAILED");
        assertThat(result.getErrorMessage()).contains("non_existent_table");
    }
}
```

### 5. 安全性测试

#### 5.1 SQL注入防护测试

```java
@Test
@DisplayName("SQL注入防护测试")
class SqlInjectionProtectionTest {

    @Autowired
    private ScriptExecutionService scriptExecutionService;

    @Test
    @DisplayName("应该防止SQL注入攻击")
    void shouldPreventSqlInjection() {
        // Given
        String maliciousInput = "'; DROP TABLE users; --";

        // When
        try {
            scriptExecutionService.executeScriptWithParameter(
                "verify_user.sql", "user_id", maliciousInput);

            fail("Should throw SecurityException for SQL injection attempt");
        } catch (SecurityException e) {
            // Then
            assertThat(e.getMessage()).contains("SQL injection");
        }

        // 验证users表仍然存在且数据完整
        assertDoesNotThrow(() -> {
            int userCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users", Integer.class);
            assertThat(userCount).isGreaterThan(0);
        });
    }

    @Test
    @DisplayName("应该验证脚本内容安全性")
    void shouldValidateScriptContentSecurity() {
        // Given
        String maliciousScript = "SELECT * FROM users; DROP TABLE verification_executions;";

        // When
        SecurityValidationResult result =
            scriptSecurityValidator.validateScriptContent(maliciousScript);

        // Then
        assertThat(result.isSecure()).isFalse();
        assertThat(result.getSecurityViolations()).contains("DANGEROUS_STATEMENT");
    }
}
```

## 测试执行和报告

### 测试执行命令

```bash
# 执行所有测试
./mvnw test

# 执行特定测试类
./mvnw test -Dtest=VerificationExecutionTest

# 执行性能测试
./mvnw test -Dtest=VerificationPerformanceTest -Dperformance.test.enabled=true

# 生成测试报告
./mvnw surefire-report:report

# 执行集成测试
./mvnw verify -P integration-test
```

### 测试报告生成

#### 覆盖率报告

```xml
<!-- pom.xml中配置JaCoCo插件 -->
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.7</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

#### 测试结果分析

```java
@Component
public class TestResultAnalyzer {

    public void analyzeTestResults() {
        // 分析测试覆盖率
        CoverageReport coverageReport = generateCoverageReport();

        // 分析性能测试结果
        PerformanceReport performanceReport = analyzePerformanceResults();

        // 生成测试总结报告
        TestSummaryReport summaryReport = generateSummaryReport(
            coverageReport, performanceReport);

        // 保存报告
        saveTestReport(summaryReport);
    }
}
```

## 测试数据管理

### 测试数据清理

```java
@AfterEach
void cleanupTestData() {
    if (testConfig.isCleanupAfterTest()) {
        // 清理测试数据
        testDatabaseCleaner.cleanupTestData();

        // 重置序列
        testDatabaseCleaner.resetSequences();

        // 清理临时文件
        testFileCleaner.cleanupTempFiles();
    }
}
```

### 测试数据隔离

```java
@TestMethodOrder(OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class IsolatedTestDataTest {

    private String testDataId;

    @BeforeAll
    void setupTestDataId() {
        testDataId = "TEST_" + System.currentTimeMillis() + "_" +
                    Thread.currentThread().getId();
    }

    @Test
    @Order(1)
    void createTestData() {
        // 使用testDataId创建隔离的测试数据
        testDataManager.createTestData(testDataId);
    }

    @Test
    @Order(2)
    void useTestData() {
        // 使用testDataId访问特定的测试数据
        assertThat(testDataManager.existsTestData(testDataId)).isTrue();
    }
}
```

## 持续集成配置

### GitHub Actions配置

```yaml
name: Verification System Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - name: Set up JDK 11
      uses: actions/setup-java@v2
      with:
        java-version: '11'
        distribution: 'temurin'

    - name: Cache Maven dependencies
      uses: actions/cache@v2
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}

    - name: Run unit tests
      run: ./mvnw test -Dtest="!*IntegrationTest,*Test"

    - name: Generate test report
      run: ./mvnw surefire-report:report

    - name: Upload test results
      uses: actions/upload-artifact@v2
      with:
        name: test-results
        path: target/surefire-reports/

  integration-tests:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: knene_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
    - uses: actions/checkout@v2

    - name: Set up JDK 11
      uses: actions/setup-java@v2
      with:
        java-version: '11'
        distribution: 'temurin'

    - name: Wait for MySQL
      run: |
        timeout 60 bash -c 'until mysql -h127.0.0.1 -uroot -proot -e "SELECT 1"; do sleep 1; done'

    - name: Run integration tests
      run: ./mvnw verify -P integration-test
      env:
        SPRING_DATASOURCE_URL: jdbc:mysql://localhost:3306/knene_test
        SPRING_DATASOURCE_USERNAME: root
        SPRING_DATASOURCE_PASSWORD: root

    - name: Upload integration test results
      uses: actions/upload-artifact@v2
      with:
        name: integration-test-results
        path: target/failsafe-reports/
```

## 测试最佳实践

### 1. 测试命名规范

```java
// 好的测试命名示例
@Test
@DisplayName("应该在大数据量场景下保持性能稳定")
void shouldMaintainPerformanceStabilityWithLargeDataSet() { }

@Test
@DisplayName("应该正确处理数据库连接中断异常")
void shouldHandleDatabaseConnectionInterruptionGracefully() { }

@Test
@DisplayName("应该在并发执行时避免资源竞争")
void shouldAvoidResourceContentionDuringConcurrentExecution() { }
```

### 2. 测试数据管理

```java
// 使用测试构建器创建测试数据
public class VerificationResultTestDataBuilder {
    private String executionId = "TEST_EXECUTION";
    private String scriptName = "test_script.sql";
    private String executionStatus = "SUCCESS";
    private List<VerificationIssue> issues = new ArrayList<>();

    public VerificationResultTestDataBuilder withExecutionId(String executionId) {
        this.executionId = executionId;
        return this;
    }

    public VerificationResultTestDataBuilder withIssue(VerificationIssue issue) {
        this.issues.add(issue);
        return this;
    }

    public VerificationResult build() {
        return new VerificationResult(executionId, scriptName, executionStatus, issues);
    }
}
```

### 3. 测试断言最佳实践

```java
// 使用描述性断言
assertThat(result.getHealthScore())
    .as("Health score should be within valid range")
    .isBetween(BigDecimal.ZERO, new BigDecimal("100"));

// 使用软断言进行多重验证
SoftAssertions softly = new SoftAssertions();
softly.assertThat(result.getExecutionStatus()).isEqualTo("SUCCESS");
softly.assertThat(result.getHealthScore()).isGreaterThan(new BigDecimal("70"));
softly.assertThat(result.getDetailedResults()).isNotEmpty();
softly.assertAll();
```

## 总结

数据库验证系统的测试是一个全面的过程，涵盖了从单元测试到端到端测试的各个层面。通过完整的测试策略和详细的测试用例，可以确保验证系统的可靠性和稳定性。

测试的关键要点：
1. **全面覆盖**：涵盖所有功能和异常场景
2. **自动化执行**：集成到CI/CD流程中
3. **性能监控**：确保系统性能满足要求
4. **安全验证**：防止安全漏洞和攻击
5. **持续改进**：基于测试结果不断优化

通过这些测试，我们可以确信验证系统能够在各种场景下可靠工作，为数据库质量提供强有力的保障。