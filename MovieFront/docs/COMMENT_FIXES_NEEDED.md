# 注释规范修正清单

根据 CLAUDE.md 第13章规范，以下文件需要修正注释格式：

## 修正原则
1. 文件头使用标准 JSDoc 格式（`/** */`）
2. 业务代码（接口、函数、组件）使用单行注释（`//`）
3. 参数、字段、属性不添加注释
4. 单行注释最多连续3行

## 需要修正的文件

### 1. PhotoApplicationService.ts ✅ 已修正
- [x] 文件头注释格式正确
- [x] 接口注释改为单行
- [x] 移除字段注释
- [x] 函数注释改为单行

### 2. usePhotoList.ts
- [ ] 文件头注释格式正确
- [ ] 接口注释改为单行
- [ ] 移除字段注释
- [ ] 函数注释改为单行

### 3. PhotoListPage.tsx
- [ ] 文件头注释格式正确
- [ ] 组件注释改为单行

### 4. photo.types.ts
- [ ] 文件头注释格式正确
- [ ] 接口注释改为单行
- [ ] 移除字段注释

### 5. photoDetailApi.ts
- [ ] 文件头注释格式正确
- [ ] 类注释改为单行
- [ ] 函数注释改为单行

### 6. usePhotoDetail.ts
- [ ] 文件头注释格式正确
- [ ] 接口注释改为单行
- [ ] Hook注释改为单行

### 7. PhotoHeroSection.tsx
- [ ] 文件头注释格式正确
- [ ] 接口注释改为单行
- [ ] 组件注释改为单行

### 8. PhotoDetailPage.tsx
- [ ] 文件头注释格式正确
- [ ] 组件注释改为单行

## 注释规范要点

### 文件头格式
```typescript
/**
 * @fileoverview 文件功能简述
 * @description 详细描述文件作用与设计思路
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */
```

### 接口/类型格式
```typescript
// 接口用途说明
export interface MyInterface {
  field1: string
  field2: number
}
```

### 函数格式
```typescript
// 函数功能说明
export function myFunction(param1: string, param2: number): void {
  // 实现
}
```

### 组件格式
```typescript
// 组件用途说明
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  // 实现
}
```

## 修正状态
- 已修正：1/8
- 待修正：7/8
