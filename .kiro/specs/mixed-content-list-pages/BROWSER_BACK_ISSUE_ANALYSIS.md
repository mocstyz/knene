# 浏览器回退问题深度分析

## 问题描述

从首页点击"更多"链接进入列表页（如 `/photo`、`/latest-updates`、`/hot-weekly`），再点击浏览器回退按钮，需要点击两次才能返回首页。

## 问题范围

这个问题影响所有从首页跳转到列表页的场景：
1. 首页写真模块 → `/photo`
2. 首页最新更新模块 → `/latest-updates`
3. 首页热门模块 → `/hot-weekly`
4. 首页合集模块 → `/special/collections`

## 可能的原因分析

### 1. TextLink使用普通`<a>`标签 ⚠️ 最可能的原因

**问题**:
BaseSection中的"更多"链接使用TextLink组件，而TextLink渲染为普通的`<a>`标签，不是React Router的Link。

**影响**:
- 点击"更多"链接会触发整页刷新
- 浏览器会创建两个历史记录：
  1. 点击链接时的记录
  2. 页面加载完成后的记录

**证据**:
```typescript
// BaseSection.tsx
<TextLink
  href={moreLinkUrl}  // 使用href，不是React Router的to
  variant="secondary"
  size="sm"
  onClick={onMoreLinkClick}
>
  {moreLinkText}
</TextLink>

// TextLink.tsx
return (
  <a className={classNames} {...linkProps}>  // 普通的<a>标签
    {children}
  </a>
)
```

### 2. 双重onClick事件 ✅ 已修复

**问题**:
movie-renderer中外层div和MovieLayer都有onClick事件。

**状态**: 已修复，移除了外层div的onClick。

### 3. 页面初始化时的历史记录操作

**可能性**: 某些组件在mount时可能操作了历史记录。

**需要检查**:
- NavigationHeader组件
- 各个列表页面的useEffect
- 数据获取Hook的初始化逻辑

## 解决方案

### 方案1: 将TextLink改为使用React Router的Link ✅ 推荐

**优点**:
- 避免整页刷新
- 使用React Router的导航机制
- 不会创建额外的历史记录

**实施步骤**:
1. 修改TextLink组件，支持React Router的Link
2. 或者创建一个新的RouterLink组件
3. 在BaseSection中使用RouterLink

**代码示例**:
```typescript
// 方案A: 修改TextLink支持React Router
import { Link } from 'react-router-dom'

export const TextLink: React.FC<TextLinkProps> = ({
  children,
  href,
  to,  // 新增to属性用于React Router
  variant = 'primary',
  size = 'md',
  external = false,
  className,
  onClick,
  ...props
}) => {
  const classNames = cn(
    textLinkVariants.base,
    textLinkVariants.variant[variant],
    textLinkVariants.size[size],
    className
  )

  // 如果提供了to属性，使用React Router的Link
  if (to) {
    return (
      <Link to={to} className={classNames} onClick={onClick}>
        {children}
      </Link>
    )
  }

  // 外部链接或普通链接
  if (external && href) {
    return (
      <a
        href={href}
        className={classNames}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    )
  }

  // 普通链接
  if (href) {
    return (
      <a href={href} className={classNames} onClick={onClick}>
        {children}
      </a>
    )
  }

  // 按钮样式
  return (
    <span className={classNames} onClick={onClick} role="button" tabIndex={0}>
      {children}
    </span>
  )
}

// BaseSection.tsx中的使用
<TextLink
  to={moreLinkUrl}  // 使用to而不是href
  variant="secondary"
  size="sm"
  onClick={onMoreLinkClick}
>
  {moreLinkText}
</TextLink>
```

### 方案2: 使用onClick + navigate ✅ 备选方案

**优点**:
- 不需要修改TextLink组件
- 完全控制导航行为

**实施步骤**:
1. 在BaseSection中使用useNavigate
2. 在onClick中调用navigate

**代码示例**:
```typescript
// BaseSection.tsx
import { useNavigate } from 'react-router-dom'

const BaseSection: React.FC<BaseSectionComponentProps> = ({
  title,
  children,
  showMoreLink = false,
  moreLinkUrl = '#',
  moreLinkText = UI_TEXT.ACTIONS.MORE,
  onMoreLinkClick,
  className,
  headerClassName,
  contentClassName,
}) => {
  const navigate = useNavigate()

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault()  // 阻止默认的链接行为
    if (onMoreLinkClick) {
      onMoreLinkClick()
    }
    if (moreLinkUrl && moreLinkUrl !== '#') {
      navigate(moreLinkUrl)  // 使用React Router导航
    }
  }

  return (
    <section className={containerClasses}>
      <div className={headerClasses}>
        <h2 className="text-2xl font-bold">{title}</h2>
        {showMoreLink && (
          <TextLink
            href={moreLinkUrl}
            variant="secondary"
            size="sm"
            onClick={handleMoreClick}  // 使用自定义的点击处理
          >
            {moreLinkText}
          </TextLink>
        )}
      </div>
      <div className={contentClasses}>{children}</div>
    </section>
  )
}
```

## 推荐实施方案

**推荐使用方案1**，因为：
1. 更符合React Router的最佳实践
2. 避免整页刷新，提升用户体验
3. 统一应用内的导航机制
4. 解决历史记录问题的根本原因

## 测试验证

修复后需要测试：
1. 从首页点击各个模块的"更多"链接
2. 验证页面是否平滑过渡（无整页刷新）
3. 点击浏览器回退按钮
4. 验证是否一次点击就能返回首页

## 其他需要检查的地方

如果修复后问题仍然存在，需要检查：
1. NavigationHeader组件是否有历史记录操作
2. 各个Hook的useEffect是否有副作用
3. React Router的配置是否正确
4. 是否有其他组件使用了普通的`<a>`标签进行内部导航
