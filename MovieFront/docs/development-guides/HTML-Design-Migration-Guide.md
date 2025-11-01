# 🎯 HTML设计稿迁移完整规范

## 📋 **核心原则**

- ✅ **100%视觉保真度** - 不允许任何UI变化
- ✅ **组件最大化复用** - 强制检查现有组件库
- ✅ **@别名强制使用** - 统一导入导出规范
- ✅ **渐进式迁移** - 降低风险，快速见效

---

## 🚀 **迁移流程规范**

### **阶段1：HTML分析 + 组件识别**

1. **HTML结构分析**
   - 识别主要UI组件（Header、HeroSection、MovieGrid等）
   - 提取所有样式类名和自定义CSS
   - 分析交互效果和动画

2. **现有组件库检查**

   ```bash
   # 强制执行的检查命令
   find src/presentation/components -name "*.tsx" | grep -E "(atoms|molecules|organisms)" | sort
   ```

3. **复用决策矩阵**
   ```typescript
   interface ComponentReuseDecision {
     component: string;
     canReuse: boolean;
     needsModification: boolean;
     modificationType?: "props" | "extension" | "composition";
     reason: string;
   }
   ```

### **阶段2：组件创建/复用**

1. **复用优先级**
   - **Level 1**: 100%匹配的现有组件
   - **Level 2**: 通过props配置可适配的组件
   - **Level 3**: 扩展现有组件
   - **Level 4**: 创建新组件（必须有理由文档）

2. **组件复用检查清单**
   - [ ] 检查atoms目录是否有匹配的基础组件
   - [ ] 检查molecules目录是否有匹配的复合组件
   - [ ] 检查organisms目录是否有匹配的复杂组件
   - [ ] 记录复用决策和理由

### **阶段3：页面组合 + 架构整合**

1. **页面组合**
   - 创建页面组件文件：`[PageName]Page.tsx`
   - 组合各个子组件
   - 集成路由系统

2. **架构整合**
   - 确保组件位于正确的DDD层级
   - 保持目录结构规范
   - 完善类型定义

---

## 🎨 **组件最大化复用原则（强制执行）**

### **复用检查流程**

```typescript
// 1. 现有组件扫描
const existingComponents = {
  atoms: ["Button", "Input", "Icon", "Avatar", "Badge", "Select", "Switch"],
  molecules: ["MovieCard", "SearchBox", "DropdownMenu"],
  organisms: ["Header", "HeroSection", "MovieGrid", "Footer"],
};

// 2. 复用决策示例
const reuseDecision = {
  Button: {
    canReuse: true,
    needsModification: true,
    modificationType: "props",
    reason: "需要添加outline variant",
  },
};
```

### **强制检查机制**

1. **开发前检查**
   - 必须扫描现有组件库
   - 创建复用决策文档
   - 代码审查时验证复用合理性

2. **开发中约束**
   - 禁止创建功能重复的组件
   - 优先通过props配置实现变体
   - 使用组合模式而非继承

3. **代码审查清单**
   - [ ] 是否检查了现有组件库？
   - [ ] 是否有充分的理由创建新组件？
   - [ ] 是否最大化利用了现有组件？

---

## 🔗 **强制@别名导入导出规范**

### **配置要求**

1. **Vite配置** (必须完整)

```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/presentation/components"),
      "@/pages": path.resolve(__dirname, "./src/presentation/pages"),
      "@/domain": path.resolve(__dirname, "./src/domain"),
      "@/application": path.resolve(__dirname, "./src/application"),
      "@/infrastructure": path.resolve(__dirname, "./src/infrastructure"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
    },
  },
});
```

2. **TypeScript配置**

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/presentation/components/*"],
      "@/pages/*": ["./src/presentation/pages/*"],
      "@/domain/*": ["./src/domain/*"],
      "@/application/*": ["./src/application/*"],
      "@/infrastructure/*": ["./src/infrastructure/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/assets/*": ["./src/assets/*"]
    }
  }
}
```

### **强制导入规范**

```typescript
// ✅ 正确示例
import { Button } from "@/components/atoms/Button";
import { Header } from "@/components/organisms/Header";
import { HomePage } from "@/pages/home/HomePage";

// ❌ 禁止示例
import { Button } from "../../../components/atoms/Button";
import { Header } from "../organisms/Header";
```

### **ESLint规则配置**

```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["../", "./"],
            "message": "必须使用@别名导入，禁止相对路径"
          }
        ]
      }
    ]
  }
}
```

---

## 📁 **文件结构规范**

### **目录结构**

```
src/
├── presentation/
│   ├── components/
│   │   ├── atoms/          # 基础组件
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Icon/
│   │   │   └── index.ts
│   │   ├── molecules/      # 分子组件
│   │   │   ├── MovieCard/
│   │   │   ├── SearchBox/
│   │   │   └── index.ts
│   │   ├── organisms/      # 有机体组件
│   │   │   ├── Header/
│   │   │   ├── HeroSection/
│   │   │   ├── MovieGrid/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── pages/              # 页面组件
│   │   ├── home/
│   │   │   └── HomePage.tsx
│   │   ├── movie/
│   │   ├── user/
│   │   └── admin/
│   └── router/
├── domain/                 # 领域层
│   ├── entities/
│   ├── services/
│   ├── types/
│   └── value-objects/
├── application/            # 应用层
│   ├── hooks/
│   ├── providers/
│   ├── services/
│   └── stores/
├── infrastructure/         # 基础设施层
├── utils/                  # 工具函数
└── data/                   # 页面数据
    ├── home/
    ├── movie/
    └── user/
```

### **命名规范**

- **页面组件**: `[PageName]Page.tsx`
- **组件文件**: `[ComponentName].tsx`
- **数据文件**: `[PageName]Data.ts`
- **类型文件**: `[ComponentName].types.ts`
- **索引文件**: `index.ts`

---

## 🔍 **质量保证检查清单**

### **迁移完成检查**

- [ ] 页面与HTML设计100%视觉一致
- [ ] 所有图片正确显示
- [ ] 所有交互功能正常
- [ ] 响应式布局正确
- [ ] 路由可以正常访问

### **组件复用检查**

- [ ] 完成了现有组件库扫描
- [ ] 创建了复用决策文档
- [ ] 最大化利用了现有组件
- [ ] 新组件创建有充分理由
- [ ] 组件命名规范正确

### **代码规范检查**

- [ ] 所有导入使用@别名
- [ ] 目录结构符合DDD规范
- [ ] 类型定义完整
- [ ] 代码通过ESLint检查
- [ ] 通过代码审查

---

## 📋 **迁移文档模板**

### **页面迁移文档**

```markdown
# [PageName] 迁移文档

## 原始设计

- HTML文件: `[FileName].html`
- 设计元素: 列出主要设计元素
- 特殊样式: 列出需要特别注意的样式

## 组件复用分析

### 复用的组件

- [ComponentName]: [复用理由]

### 扩展的组件

- [ComponentName]: [扩展内容]

### 新创建的组件

- [ComponentName]: [创建理由]

## 数据结构

- 数据文件: `data/[PageName]Data.ts`
- 数据来源: HTML原始数据

## 路由配置

- 路径: `[route-path]`
- 权限: [required-permissions]

## 验证清单

- [ ] 视觉100%一致
- [ ] 所有图片显示正常
- [ ] 交互功能正常
- [ ] 响应式正确
- [ ] 组件最大化复用
- [ ] @别名导入规范
```

---

## ⚡ **自动化工具**

### **组件复用检查脚本**

```bash
#!/bin/bash
# check-components.sh
echo "🔍 检查现有组件库..."
find src/presentation/components -name "*.tsx" | sort

echo "📋 生成复用建议..."
# 自动生成组件复用建议
```

### **导入规范检查脚本**

```bash
#!/bin/bash
# check-imports.sh
echo "🔍 检查相对路径导入..."
grep -r "from ['\"]\.\." src/ --include="*.ts" --include="*.tsx"

echo "📋 生成修复建议..."
# 自动生成修复建议
```

---

## 🎯 **执行原则**

1. **零容忍原则** - 100%视觉保真度，任何变化都需要讨论
2. **强制复用原则** - 不允许无故创建重复组件
3. **规范强制原则** - 所有代码必须遵循导入规范
4. **文档完整性原则** - 每个迁移都有完整的文档记录

---

## 🚨 **常见错误和解决方案**

### **错误1：直接复制HTML而不检查现有组件**

- **问题**: 创建重复的Button组件
- **解决**: 使用`check-components.sh`扫描现有组件库

### **错误2：使用相对路径导入**

- **问题**: `import Button from '../../../components/Button'`
- **解决**: 使用`@/components/atoms/Button`

### **错误3：忽略组件复用检查清单**

- **问题**: 代码审查时才发现重复组件
- **解决**: 开发前必须完成检查清单

### **错误4：不完整的迁移文档**

- **问题**: 后续维护困难
- **解决**: 使用模板文档强制记录

---

## 📊 **效果评估**

### **成功指标**

- ✅ 100%视觉保真度
- ✅ 组件复用率 > 80%
- ✅ 代码规范遵循率 100%
- ✅ 迁移时间 < 2小时/页面

### **质量指标**

- 代码重复率 < 5%
- 组件一致性评分 > 90%
- 维护成本降低 > 50%

---

## 🔄 **持续改进**

### **定期审查**

- 每月审查迁移规范执行情况
- 根据实际遇到的问题更新规范
- 优化自动化工具和脚本

### **团队培训**

- 新成员必须学习迁移规范
- 定期分享最佳实践和经验教训
- 建立组件库知识库

---

_最后更新: 2025-10-03_
_版本: 1.0_
