# 测试执行指南

## 概述

本指南提供了执行VIP数据流测试的详细步骤和说明。按照本指南，您可以验证所有测试是否通过，确保VIP数据流重构的质量。

## 前提条件

### 1. 安装依赖

```bash
cd MovieFront
pnpm install
```

### 2. 安装Playwright浏览器（仅E2E测试需要）

```bash
pnpm exec playwright install
```

## 测试执行步骤

### 步骤1: 运行单元测试

单元测试验证MockDataService和Content Renderer的核心逻辑。

```bash
# 运行所有单元测试
pnpm test

# 运行特定的单元测试文件
pnpm test MockDataService.test.ts
pnpm test ContentRenderer.test.tsx

# 运行单元测试并生成覆盖率报告
pnpm test:coverage
```

**预期结果**:
- ✅ 所有测试通过
- ✅ 覆盖率 >80%
- ✅ 无错误或警告

**验证点**:
1. MockDataService的VIP状态生成测试（20+个测试用例）
2. MockDataService的NEW标签生成测试（10+个测试用例）
3. MockDataService的随机数据测试（15+个测试用例）
4. Content Renderer的标签显示规则测试（15+个测试用例）

### 步骤2: 运行集成测试

集成测试验证数据在各层之间的流动和完整性。

```bash
# 运行所有集成测试
pnpm test DataFlow.integration.test.ts

# 使用UI模式运行（可视化）
pnpm test:ui
```

**预期结果**:
- ✅ 所有测试通过
- ✅ 数据流完整性验证通过
- ✅ 字段映射正确

**验证点**:
1. MockDataService → Repository 数据流（10+个测试用例）
2. Repository → ApplicationService 数据流（5+个测试用例）
3. 完整数据流测试（10+个测试用例）
4. 数据完整性测试（15+个测试用例）

### 步骤3: 运行E2E测试

E2E测试验证完整的用户流程和UI显示。

**重要**: E2E测试需要应用程序运行在 http://localhost:3000

#### 方式1: 自动启动开发服务器（推荐）

```bash
# Playwright会自动启动开发服务器并运行测试
pnpm test:e2e
```

#### 方式2: 手动启动开发服务器

```bash
# 终端1: 启动开发服务器
pnpm dev

# 终端2: 运行E2E测试
pnpm exec playwright test
```

**预期结果**:
- ✅ 所有测试通过
- ✅ VIP标签在整个链路中显示一致
- ✅ 详情页样式正确

**验证点**:
1. 合集完整链路测试（4个测试用例）
2. 写真完整链路测试（3个测试用例）
3. 普通影片链路测试（2个测试用例）
4. 混合内容列表测试（3个测试用例）

### 步骤4: 查看测试报告

#### 单元测试和集成测试覆盖率报告

```bash
# 生成覆盖率报告
pnpm test:coverage

# 覆盖率报告位置
# MovieFront/coverage/index.html
```

在浏览器中打开 `coverage/index.html` 查看详细的覆盖率报告。

#### E2E测试报告

```bash
# 查看E2E测试报告
pnpm exec playwright show-report
```

报告包含：
- 测试执行结果
- 失败测试的截图
- 测试执行trace

## 调试测试

### 调试单元测试

```bash
# 使用UI模式调试
pnpm test:ui

# 运行特定测试并查看详细输出
pnpm test MockDataService.test.ts --reporter=verbose
```

### 调试集成测试

```bash
# 使用UI模式调试
pnpm test:ui

# 运行特定测试
pnpm test DataFlow.integration.test.ts --reporter=verbose
```

### 调试E2E测试

```bash
# 使用调试模式运行
pnpm exec playwright test --debug

# 运行特定测试
pnpm exec playwright test -g "应该在首页显示合集卡片的VIP标签" --debug

# 查看trace
pnpm exec playwright show-trace trace.zip
```

## 常见问题

### Q1: 单元测试失败

**可能原因**:
- MockDataService的业务规则变化
- 类型定义不匹配
- 测试数据不符合预期

**解决方法**:
1. 检查错误信息
2. 验证MockDataService的实现
3. 更新测试断言

### Q2: 集成测试失败

**可能原因**:
- 数据流中某一层丢失了字段
- Repository或ApplicationService的实现变化
- 数据转换逻辑错误

**解决方法**:
1. 检查错误信息中的字段名
2. 验证数据在各层之间的传递
3. 使用调试器跟踪数据流

### Q3: E2E测试失败

**可能原因**:
- 应用程序未运行
- data-testid属性缺失
- UI组件未正确渲染
- 样式类名变化

**解决方法**:
1. 确认应用程序正在运行
2. 检查组件是否添加了data-testid属性
3. 查看测试截图
4. 使用调试模式运行测试

### Q4: 覆盖率不足

**解决方法**:
1. 运行覆盖率报告查看未覆盖的代码
2. 添加针对性的测试用例
3. 检查边界情况和错误处理

## 测试检查清单

在提交代码前，请确保：

- [ ] 所有单元测试通过
- [ ] 所有集成测试通过
- [ ] 所有E2E测试通过
- [ ] 代码覆盖率 >80%
- [ ] 无TypeScript错误
- [ ] 无ESLint警告
- [ ] 测试文档已更新

## 持续集成

测试会在以下情况自动运行：

1. **Push到主分支**: 运行所有测试
2. **Pull Request**: 运行所有测试
3. **定时任务**: 每天运行一次完整测试

## 性能基准

### 单元测试
- 执行时间: <10秒
- 测试用例: 60+个

### 集成测试
- 执行时间: <30秒
- 测试用例: 40+个

### E2E测试
- 执行时间: <5分钟
- 测试用例: 15+个
- 浏览器: Chromium, Firefox, WebKit

## 下一步

测试通过后，您可以：

1. 查看测试覆盖率报告
2. 提交代码到版本控制
3. 创建Pull Request
4. 部署到测试环境

## 参考资料

- [测试总结文档](./TESTING_SUMMARY.md)
- [E2E测试说明](../tests/e2e/README.md)
- [Vitest文档](https://vitest.dev/)
- [Playwright文档](https://playwright.dev/)

## 联系支持

如果遇到问题，请：

1. 查看本指南的常见问题部分
2. 查看测试文档
3. 联系开发团队

---

**最后更新**: 2025-01-26
**版本**: 1.0.0
