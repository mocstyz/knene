# 影视资源网站前端开发规范文档 (DDD架构)

## 1. 项目概述与架构设计

### 1.1 项目信息
- 项目名称：影视资源下载网站前端
- 架构模式：领域驱动设计 (Domain-Driven Design)
- 技术栈：React 18+ + TypeScript 5+
- 构建工具：Vite
- 包管理器：pnpm
- 样式方案：Tailwind CSS + @apply指令 + CSS-in-JS (Emotion)
- 状态管理：Zustand + TanStack Query
- 路由：React Router v6
- UI组件库：Headless UI + Radix UI + 自定义设计系统
- 下载组件：React Download Manager + 进度条组件
- 开发工具：Storybook + React DevTools + Zustand DevTools
- 代码规范：ESLint + Prettier + Husky + lint-staged
- 测试框架：Vitest + React Testing Library + Playwright

### 1.2 DDD架构概述

#### 1.2.1 领域驱动设计原则
- **业务优先**: 代码结构反映业务逻辑
- **领域分离**: 通过有界上下文划分业务边界
- **聚合设计**: 保证数据一致性和业务规则
- **事件驱动**: 通过领域事件实现松耦合

#### 1.2.2 分层架构
```
┌─────────────────────────────────────┐
│        表现层 (Presentation)         │ ← React组件、页面、UI交互
├─────────────────────────────────────┤
│        应用层 (Application)          │ ← 用例服务、应用逻辑协调
├─────────────────────────────────────┤
│        领域层 (Domain)               │ ← 业务实体、值对象、领域服务
├─────────────────────────────────────┤
│        基础设施层 (Infrastructure)   │ ← API调用、数据持久化、外部服务
└─────────────────────────────────────┘
```

### 1.3 业务领域划分

基于设计稿分析，识别出以下核心业务领域：

#### 1.3.1 用户管理领域 (User Management)
- **聚合根**: User
- **实体**: UserProfile, UserPreferences
- **值对象**: Email, Password, Avatar
- **领域服务**: AuthenticationService, UserValidationService
- **业务规则**: 用户注册验证、权限管理、账户状态

#### 1.3.2 影片管理领域 (Movie Management)
- **聚合根**: Movie
- **实体**: MovieDetail, MovieCategory, MovieRating
- **值对象**: Title, Genre, Duration, ReleaseDate
- **领域服务**: MovieCatalogService, RatingService
- **业务规则**: 影片分类、评分计算、内容审核

#### 1.3.3 下载管理领域 (Download Management)
- **聚合根**: Download
- **实体**: DownloadTask, DownloadHistory
- **值对象**: DownloadStatus, FileSize, DownloadSpeed
- **领域服务**: DownloadScheduler, DownloadValidator
- **业务规则**: 下载权限、并发限制、存储管理

#### 1.3.4 消息通知领域 (Notification Management)
- **聚合根**: Message
- **实体**: Notification, MessageThread
- **值对象**: MessageContent, MessageType, ReadStatus
- **领域服务**: NotificationService, MessageDeliveryService
- **业务规则**: 消息推送、已读状态、消息归档

#### 1.3.5 管理后台领域 (Admin Management)
- **聚合根**: AdminUser
- **实体**: SystemConfig, UserManagement, ContentModeration
- **值对象**: Permission, Role, AuditLog
- **领域服务**: AdminAuthService, SystemMonitorService
- **业务规则**: 权限控制、系统监控、内容审核

## 2. 代码风格规范

### 2.1 命名规范

#### 2.1.1 文件命名
- 组件文件：PascalCase（如 `MovieCard.tsx`）
- 工具函数文件：camelCase（如 `apiHelper.ts`）
- 常量文件：UPPER_SNAKE_CASE（如 `API_ENDPOINTS.ts`）
- 类型定义文件：camelCase + .types（如 `user.types.ts`）
- Hook文件：camelCase + use（如 `useAuth.ts`）

#### 2.1.2 变量和函数命名
- 变量：camelCase（如 `userName`）
- 常量：UPPER_SNAKE_CASE（如 `MAX_FILE_SIZE`）
- 函数：camelCase（如 `handleLogin`）
- 类名：PascalCase（如 `MovieService`）
- 接口：PascalCase（如 `IUser`）
- 类型别名：PascalCase（如 `MovieType`）

### 2.2 代码格式化

#### 2.2.1 基础规范
- 使用2个空格缩进
- 字符串使用单引号
- 行尾不加分号
- 对象和数组最后一个元素后加逗号
- 使用箭头函数而非function关键字
- 解构赋值优先使用

#### 2.2.2 函数规范
- 组件函数使用函数式组件和Hooks
- 优先使用箭头函数
- 函数参数不超过3个，超过则使用对象参数
- 使用TypeScript严格类型检查

## 3. DDD组件开发规范 (强制执行)

### 3.1 组件最大化复用原则 (强制执行)

**⚠️ 强制要求：所有组件开发必须遵循最大化复用原则，违反者代码不予通过审查。**

#### 3.1.1 复用优先级原则
1. **复用现有组件 > 扩展现有组件 > 创建新组件**
2. **抽象通用逻辑 > 重复实现**
3. **组合模式 > 继承模式**
4. **配置驱动 > 硬编码**

#### 3.1.2 强制复用检查规则

**开发前强制检查**
- [ ] 是否在现有组件库中搜索了相似组件？
- [ ] 是否分析了UI设计稿中的重复元素？
- [ ] 是否制定了组件复用计划？

**开发中强制检查**
- [ ] 新组件是否可以通过配置现有组件实现？
- [ ] 是否提取了可复用的样式和逻辑？
- [ ] 是否使用了@别名导入？

**代码审查强制检查**
- [ ] 是否存在重复的UI实现？
- [ ] 组件API是否具有良好的扩展性？
- [ ] 是否遵循了DDD分层架构？

### 3.2 组件分层架构

#### 3.2.1 原子设计模式结合DDD
基于设计稿分析，采用原子设计模式结合DDD概念：

**原子组件 (Atoms)**
- **定义**: 最基础的UI元素，对应DDD中的值对象概念
- **特点**: 不可再分割，纯展示功能，无业务逻辑
- **示例**: Button, Input, Label, Icon, Avatar

```typescript
// 示例：Button原子组件
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  variant, 
  size, 
  disabled, 
  children, 
  onClick 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

**分子组件 (Molecules)**
- **定义**: 由多个原子组件组合，对应DDD中的实体概念
- **特点**: 具有特定功能，可复用，包含简单交互逻辑
- **示例**: SearchBox, MovieCard, UserAvatar, DownloadProgress

```typescript
// 示例：SearchBox分子组件
interface SearchBoxProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "搜索影片...",
  value,
  onChange,
  onSearch
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" variant="primary">
        <SearchIcon className="w-4 h-4" />
      </Button>
    </form>
  );
};
```

**有机体组件 (Organisms)**
- **定义**: 复杂的UI区块，对应DDD中的聚合概念
- **特点**: 包含完整的业务功能，管理内部状态
- **示例**: MovieList, UserProfile, DownloadManager, MessageCenter

```typescript
// 示例：MovieList有机体组件
interface MovieListProps {
  movies: Movie[];
  loading: boolean;
  onMovieSelect: (movie: Movie) => void;
  onLoadMore: () => void;
}

const MovieList: React.FC<MovieListProps> = ({
  movies,
  loading,
  onMovieSelect,
  onLoadMore
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => onMovieSelect(movie)}
          />
        ))}
      </div>
      
      {loading && <LoadingSpinner />}
      
      <div className="flex justify-center">
        <Button onClick={onLoadMore} variant="secondary">
          加载更多
        </Button>
      </div>
    </div>
  );
};
```

**模板组件 (Templates)**
- **定义**: 页面级布局结构，对应DDD中的应用服务概念
- **特点**: 定义页面结构，不包含具体内容
- **示例**: AuthTemplate, UserTemplate, AdminTemplate

```typescript
// 示例：UserTemplate模板组件
interface UserTemplateProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  main: React.ReactNode;
  footer?: React.ReactNode;
}

const UserTemplate: React.FC<UserTemplateProps> = ({
  header,
  sidebar,
  main,
  footer
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        {header}
      </header>
      
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm">
          {sidebar}
        </aside>
        
        <main className="flex-1 p-6">
          {main}
        </main>
      </div>
      
      {footer && (
        <footer className="bg-white border-t">
          {footer}
        </footer>
      )}
    </div>
  );
};
```

### 3.3 DDD领域组件规范

#### 3.3.1 实体组件 (Entity Components)
- **定义**: 代表业务实体的组件，具有唯一标识
- **特点**: 包含实体的完整信息和行为
- **命名**: 以实体名称命名，如 `UserProfile`, `MovieDetail`

```typescript
// 示例：MovieDetail实体组件
interface MovieDetailProps {
  movie: Movie;
  onPlay: (movieId: string) => void;
  onDownload: (movieId: string) => void;
  onAddToFavorites: (movieId: string) => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({
  movie,
  onPlay,
  onDownload,
  onAddToFavorites
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="aspect-video relative">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Button 
            onClick={() => onPlay(movie.id)}
            variant="primary"
            size="lg"
          >
            <PlayIcon className="w-6 h-6 mr-2" />
            播放
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
        <p className="text-gray-600 mb-4">{movie.description}</p>
        
        <div className="flex gap-4">
          <Button 
            onClick={() => onDownload(movie.id)}
            variant="secondary"
          >
            下载
          </Button>
          <Button 
            onClick={() => onAddToFavorites(movie.id)}
            variant="secondary"
          >
            收藏
          </Button>
        </div>
      </div>
    </div>
  );
};
```

#### 3.3.2 聚合组件 (Aggregate Components)
- **定义**: 管理相关实体和值对象的组件
- **特点**: 确保业务规则和数据一致性
- **命名**: 以聚合根命名，如 `UserAggregate`, `MovieAggregate`

```typescript
// 示例：DownloadAggregate聚合组件
interface DownloadAggregateProps {
  userId: string;
}

const DownloadAggregate: React.FC<DownloadAggregateProps> = ({ userId }) => {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [activeDownloads, setActiveDownloads] = useState<Download[]>([]);
  
  // 聚合内的业务规则
  const canStartDownload = (movieId: string): boolean => {
    const activeCount = activeDownloads.length;
    const maxConcurrent = 3; // 业务规则：最多3个并发下载
    return activeCount < maxConcurrent;
  };

  const startDownload = async (movieId: string) => {
    if (!canStartDownload(movieId)) {
      throw new Error('超过最大并发下载数量');
    }
    
    // 执行下载逻辑
    const download = await downloadService.start(movieId, userId);
    setActiveDownloads(prev => [...prev, download]);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">下载管理</h2>
      
      <DownloadQueue 
        downloads={activeDownloads}
        onPause={(id) => downloadService.pause(id)}
        onResume={(id) => downloadService.resume(id)}
        onCancel={(id) => downloadService.cancel(id)}
      />
      
      <DownloadHistory 
        downloads={downloads}
        onRetry={startDownload}
      />
    </div>
  );
};
```

### 3.4 组件通信规范

#### 3.4.1 领域事件通信
- 使用领域事件实现组件间松耦合通信
- 事件命名采用过去式，如 `MovieSelected`, `DownloadCompleted`

```typescript
// 领域事件定义
interface DomainEvent {
  type: string;
  payload: any;
  timestamp: Date;
}

// 事件总线
class EventBus {
  private listeners: Map<string, Function[]> = new Map();

  emit(event: DomainEvent) {
    const handlers = this.listeners.get(event.type) || [];
    handlers.forEach(handler => handler(event));
  }

  subscribe(eventType: string, handler: Function) {
    const handlers = this.listeners.get(eventType) || [];
    this.listeners.set(eventType, [...handlers, handler]);
  }
}

// 在组件中使用
const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const eventBus = useEventBus();

  const handleClick = () => {
    eventBus.emit({
      type: 'MovieSelected',
      payload: { movieId: movie.id },
      timestamp: new Date()
    });
  };

  return (
    <div onClick={handleClick}>
      {/* 组件内容 */}
    </div>
  );
};
```

### 3.5 DDD架构实现细节

#### 3.5.1 领域事件持久化

##### 事件存储策略
```typescript
// 领域事件持久化管理器
class DomainEventPersistenceManager {
  private eventStore: EventStore;
  private snapshotStore: SnapshotStore;

  constructor(
    private eventStore: EventStore,
    private snapshotStore: SnapshotStore
  ) {}

  // 持久化领域事件
  async persistEvent<T extends DomainEvent>(
    aggregateId: string,
    event: T,
    expectedVersion?: number
  ): Promise<void> {
    // 验证版本一致性
    if (expectedVersion !== undefined) {
      const currentVersion = await this.eventStore.getCurrentVersion(aggregateId);
      if (currentVersion !== expectedVersion) {
        throw new ConcurrencyError('Version conflict detected');
      }
    }

    // 持久化事件
    await this.eventStore.save({
      aggregateId,
      eventType: event.constructor.name,
      eventData: event,
      timestamp: new Date(),
      version: expectedVersion ? expectedVersion + 1 : 1
    });

    // 检查是否需要创建快照
    await this.checkAndCreateSnapshot(aggregateId);
  }

  // 重建聚合状态
  async rebuildAggregate<T extends AggregateRoot>(
    aggregateType: new () => T,
    aggregateId: string
  ): Promise<T> {
    // 尝试从最新快照开始
    const latestSnapshot = await this.snapshotStore.getLatest(aggregateId);

    let aggregate: T;
    let fromVersion: number;

    if (latestSnapshot) {
      aggregate = Object.assign(new aggregateType(), latestSnapshot.state);
      fromVersion = latestSnapshot.version + 1;
    } else {
      aggregate = new aggregateType();
      fromVersion = 1;
    }

    // 应用后续事件
    const events = await this.eventStore.getEvents(aggregateId, fromVersion);
    events.forEach(event => {
      aggregate.apply(event.eventData);
    });

    return aggregate;
  }

  private async checkAndCreateSnapshot(aggregateId: string): Promise<void> {
    const eventCount = await this.eventStore.getEventCount(aggregateId);
    const snapshotInterval = 100; // 每100个事件创建一次快照

    if (eventCount % snapshotInterval === 0) {
      const aggregate = await this.rebuildAggregateFromEvents(aggregateId);
      await this.snapshotStore.save({
        aggregateId,
        state: aggregate.getState(),
        version: eventCount,
        timestamp: new Date()
      });
    }
  }
}

// 事件存储接口
interface EventStore {
  save(event: StoredEvent): Promise<void>;
  getEvents(aggregateId: string, fromVersion?: number): Promise<StoredEvent[]>;
  getCurrentVersion(aggregateId: string): Promise<number>;
  getEventCount(aggregateId: string): Promise<number>;
}

// 快照存储接口
interface SnapshotStore {
  save(snapshot: AggregateSnapshot): Promise<void>;
  getLatest(aggregateId: string): Promise<AggregateSnapshot | null>;
}
```

##### 跨页面事件同步
```typescript
// 跨页面事件同步管理器
class CrossPageEventSync {
  private broadcastChannel: BroadcastChannel;
  private eventQueue: DomainEvent[] = [];

  constructor() {
    this.broadcastChannel = new BroadcastChannel('domain-events');
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // 监听来自其他页面的领域事件
    this.broadcastChannel.addEventListener('message', (event) => {
      const domainEvent = event.data as DomainEvent;
      this.handleIncomingEvent(domainEvent);
    });

    // 页面可见性变化时同步事件
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.syncEventsFromStorage();
      }
    });
  }

  // 发送领域事件到其他页面
  publishEvent(event: DomainEvent): void {
    this.broadcastChannel.postMessage(event);

    // 同时存储到localStorage作为备用
    this.storeEventInLocalStorage(event);
  }

  // 处理来自其他页面的事件
  private handleIncomingEvent(event: DomainEvent): void {
    // 更新本地状态
    this.updateLocalState(event);

    // 触发相关组件重新渲染
    this.notifyComponents(event);
  }

  private storeEventInLocalStorage(event: DomainEvent): void {
    const storedEvents = JSON.parse(
      localStorage.getItem('cross-page-events') || '[]'
    );
    storedEvents.push({
      ...event,
      timestamp: new Date().toISOString()
    });

    // 只保留最近100个事件
    const recentEvents = storedEvents.slice(-100);
    localStorage.setItem('cross-page-events', JSON.stringify(recentEvents));
  }

  private async syncEventsFromStorage(): Promise<void> {
    const storedEvents = JSON.parse(
      localStorage.getItem('cross-page-events') || '[]'
    );

    for (const eventData of storedEvents) {
      const event = {
        ...eventData,
        timestamp: new Date(eventData.timestamp)
      } as DomainEvent;

      this.handleIncomingEvent(event);
    }

    // 清空已处理的事件
    localStorage.removeItem('cross-page-events');
  }

  private updateLocalState(event: DomainEvent): void {
    // 根据事件类型更新相应的Zustand store
    switch (event.type) {
      case 'DownloadStarted':
        useDownloadStore.getState().addDownload(event.payload);
        break;
      case 'DownloadCompleted':
        useDownloadStore.getState().updateDownloadStatus(
          event.payload.downloadId,
          'completed'
        );
        break;
      case 'UserLoggedOut':
        useUserStore.getState().logout();
        break;
      // 其他事件类型...
    }
  }

  private notifyComponents(event: DomainEvent): void {
    // 通过自定义事件通知React组件
    window.dispatchEvent(new CustomEvent('domainEvent', {
      detail: event
    }));
  }
}
```

#### 3.5.2 聚合边界管理

##### 聚合边界定义
```typescript
// 聚合根抽象基类
abstract class AggregateRoot {
  protected id: string;
  protected version: number = 0;
  private domainEvents: DomainEvent[] = [];

  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  getVersion(): number {
    return this.version;
  }

  // 添加领域事件
  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  // 获取未发布的领域事件
  getUncommittedEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  // 标记事件为已发布
  markEventsAsCommitted(): void {
    this.domainEvents = [];
  }

  // 应用领域事件
  protected apply(event: DomainEvent): void {
    // 调用具体的when方法
    this.when(event);
    this.addDomainEvent(event);
    this.version++;
  }

  // 子类需要实现具体的when方法
  protected abstract when(event: DomainEvent): void;

  // 获取聚合状态（用于快照）
  abstract getState(): any;

  // 从状态恢复聚合（用于快照恢复）
  abstract loadFromState(state: any): void;
}

// 下载聚合示例
class DownloadAggregate extends AggregateRoot {
  private downloads: Map<string, Download> = new Map();
  private maxConcurrentDownloads: number = 3;
  private userId: string;

  constructor(id: string, userId: string) {
    super(id);
    this.userId = userId;
  }

  // 开始下载
  startDownload(movieId: string, quality: DownloadQuality): void {
    if (this.canStartDownload()) {
      const download = new Download(
        this.generateDownloadId(),
        movieId,
        quality,
        this.userId
      );

      this.downloads.set(download.getId(), download);

      this.apply(new DownloadStartedEvent({
        downloadId: download.getId(),
        movieId,
        quality,
        userId: this.userId
      }));
    } else {
      throw new Error('已达到最大并发下载数量');
    }
  }

  // 暂停下载
  pauseDownload(downloadId: string): void {
    const download = this.downloads.get(downloadId);
    if (download && download.canPause()) {
      download.pause();

      this.apply(new DownloadPausedEvent({
        downloadId,
        userId: this.userId
      }));
    }
  }

  // 完成下载
  completeDownload(downloadId: string): void {
    const download = this.downloads.get(downloadId);
    if (download) {
      download.complete();

      this.apply(new DownloadCompletedEvent({
        downloadId,
        movieId: download.getMovieId(),
        userId: this.userId,
        fileSize: download.getFileSize(),
        completedAt: new Date()
      }));
    }
  }

  // 业务规则：检查是否可以开始新下载
  private canStartDownload(): boolean {
    const activeDownloads = Array.from(this.downloads.values())
      .filter(d => d.isActive());

    return activeDownloads.length < this.maxConcurrentDownloads;
  }

  private generateDownloadId(): string {
    return `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 实现抽象方法
  protected when(event: DomainEvent): void {
    if (event instanceof DownloadStartedEvent) {
      // 处理下载开始事件
    } else if (event instanceof DownloadPausedEvent) {
      // 处理下载暂停事件
    } else if (event instanceof DownloadCompletedEvent) {
      // 处理下载完成事件
    }
  }

  getState(): any {
    return {
      id: this.id,
      userId: this.userId,
      version: this.version,
      downloads: Array.from(this.downloads.values()).map(d => d.getState()),
      maxConcurrentDownloads: this.maxConcurrentDownloads
    };
  }

  loadFromState(state: any): void {
    this.id = state.id;
    this.userId = state.userId;
    this.version = state.version;
    this.maxConcurrentDownloads = state.maxConcurrentDownloads;

    this.downloads.clear();
    state.downloads.forEach((downloadState: any) => {
      const download = new Download();
      download.loadFromState(downloadState);
      this.downloads.set(download.getId(), download);
    });
  }
}
```

#### 3.5.3 仓储模式实现

##### 仓储接口定义
```typescript
// 仓储接口
interface IRepository<T extends AggregateRoot> {
  save(aggregate: T): Promise<void>;
  findById(id: string): Promise<T | null>;
  findAll(specification?: ISpecification<T>): Promise<T[]>;
  delete(aggregate: T): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(specification?: ISpecification<T>): Promise<number>;
}

// 规约模式接口
interface ISpecification<T> {
  isSatisfiedBy(candidate: T): boolean;
  and(other: ISpecification<T>): ISpecification<T>;
  or(other: ISpecification<T>): ISpecification<T>;
  not(): ISpecification<T>;
}

// 下载仓储接口
interface IDownloadRepository extends IRepository<DownloadAggregate> {
  findByUserId(userId: string): Promise<DownloadAggregate[]>;
  findActiveDownloads(userId: string): Promise<DownloadAggregate[]>;
  findByMovieId(movieId: string): Promise<DownloadAggregate[]>;
  findByStatus(status: DownloadStatus): Promise<DownloadAggregate[]>;
}
```

##### 仓储实现
```typescript
// 下载仓储实现
class DownloadRepository implements IDownloadRepository {
  constructor(
    private eventPersistenceManager: DomainEventPersistenceManager,
    private apiClient: ApiClient
  ) {}

  async save(aggregate: DownloadAggregate): Promise<void> {
    // 持久化未发布的领域事件
    const uncommittedEvents = aggregate.getUncommittedEvents();

    for (const event of uncommittedEvents) {
      await this.eventPersistenceManager.persistEvent(
        aggregate.getId(),
        event,
        aggregate.getVersion()
      );
    }

    // 标记事件为已发布
    aggregate.markEventsAsCommitted();

    // 同步到后端API
    try {
      await this.apiClient.post('/api/downloads/sync', {
        aggregateId: aggregate.getId(),
        events: uncommittedEvents,
        version: aggregate.getVersion()
      });
    } catch (error) {
      // API同步失败，事件已经本地持久化，可以在后续重试
      console.warn('Failed to sync download aggregate to backend:', error);
    }
  }

  async findById(id: string): Promise<DownloadAggregate | null> {
    try {
      // 首先尝试从本地事件存储重建
      const aggregate = await this.eventPersistenceManager.rebuildAggregate(
        DownloadAggregate,
        id
      );

      if (aggregate.getVersion() > 0) {
        return aggregate;
      }

      // 如果本地没有数据，从API获取
      return await this.fetchFromAPI(id);
    } catch (error) {
      console.error('Failed to load download aggregate:', error);
      return null;
    }
  }

  async findAll(specification?: ISpecification<DownloadAggregate>): Promise<DownloadAggregate[]> {
    // 从API获取符合条件的数据
    const response = await this.apiClient.get('/api/downloads', {
      params: specification ? this.buildQueryFromSpecification(specification) : {}
    });

    return response.data.map((data: any) => {
      const aggregate = new DownloadAggregate(data.id, data.userId);
      aggregate.loadFromState(data);
      return aggregate;
    });
  }

  async findByUserId(userId: string): Promise<DownloadAggregate[]> {
    return this.findAll(new UserDownloadsSpecification(userId));
  }

  async findActiveDownloads(userId: string): Promise<DownloadAggregate[]> {
    return this.findAll(
      new UserDownloadsSpecification(userId)
        .and(new ActiveDownloadsSpecification())
    );
  }

  async findByMovieId(movieId: string): Promise<DownloadAggregate[]> {
    return this.findAll(new MovieDownloadsSpecification(movieId));
  }

  async findByStatus(status: DownloadStatus): Promise<DownloadAggregate[]> {
    return this.findAll(new DownloadStatusSpecification(status));
  }

  async delete(aggregate: DownloadAggregate): Promise<void> {
    // 发布删除事件
    aggregate.apply(new DownloadDeletedEvent({
      downloadId: aggregate.getId(),
      userId: aggregate.getState().userId
    }));

    // 保存删除事件
    await this.save(aggregate);

    // 通知后端删除
    await this.apiClient.delete(`/api/downloads/${aggregate.getId()}`);
  }

  async exists(id: string): Promise<boolean> {
    const aggregate = await this.findById(id);
    return aggregate !== null;
  }

  async count(specification?: ISpecification<DownloadAggregate>): Promise<number> {
    const response = await this.apiClient.get('/api/downloads/count', {
      params: specification ? this.buildQueryFromSpecification(specification) : {}
    });

    return response.data.count;
  }

  private async fetchFromAPI(id: string): Promise<DownloadAggregate> {
    const response = await this.apiClient.get(`/api/downloads/${id}`);
    const data = response.data;

    const aggregate = new DownloadAggregate(data.id, data.userId);
    aggregate.loadFromState(data);

    return aggregate;
  }

  private buildQueryFromSpecification(specification: ISpecification<DownloadAggregate>): any {
    // 将规约转换为API查询参数
    // 这里需要根据具体的规约实现来转换
    return {};
  }
}

// 具体规约实现示例
class UserDownloadsSpecification implements ISpecification<DownloadAggregate> {
  constructor(private userId: string) {}

  isSatisfiedBy(candidate: DownloadAggregate): boolean {
    return candidate.getState().userId === this.userId;
  }

  and(other: ISpecification<DownloadAggregate>): ISpecification<DownloadAggregate> {
    return new AndSpecification(this, other);
  }

  or(other: ISpecification<DownloadAggregate>): ISpecification<DownloadAggregate> {
    return new OrSpecification(this, other);
  }

  not(): ISpecification<DownloadAggregate> {
    return new NotSpecification(this);
  }
}

class ActiveDownloadsSpecification implements ISpecification<DownloadAggregate> {
  isSatisfiedBy(candidate: DownloadAggregate): boolean {
    const downloads = candidate.getState().downloads;
    return downloads.some((download: any) =>
      download.status === 'downloading' || download.status === 'paused'
    );
  }

  and(other: ISpecification<DownloadAggregate>): ISpecification<DownloadAggregate> {
    return new AndSpecification(this, other);
  }

  or(other: ISpecification<DownloadAggregate>): ISpecification<DownloadAggregate> {
    return new OrSpecification(this, other);
  }

  not(): ISpecification<DownloadAggregate> {
    return new NotSpecification(this);
  }
}

// 组合规约实现
class AndSpecification<T> implements ISpecification<T> {
  constructor(
    private left: ISpecification<T>,
    private right: ISpecification<T>
  ) {}

  isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate);
  }

  and(other: ISpecification<T>): ISpecification<T> {
    return new AndSpecification(this, other);
  }

  or(other: ISpecification<T>): ISpecification<T> {
    return new OrSpecification(this, other);
  }

  not(): ISpecification<T> {
    return new NotSpecification(this);
  }
}
```

### 3.6 组件测试规范

#### 3.6.1 单元测试
- 每个组件都应有对应的测试文件
- 测试文件命名：`ComponentName.test.tsx`
- 测试覆盖：渲染、交互、边界情况

```typescript
// MovieCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MovieCard } from './MovieCard';

describe('MovieCard', () => {
  const mockMovie = {
    id: '1',
    title: '测试电影',
    poster: 'test-poster.jpg',
    rating: 8.5
  };

  it('应该正确渲染电影信息', () => {
    render(<MovieCard movie={mockMovie} onSelect={jest.fn()} />);
    
    expect(screen.getByText('测试电影')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
  });

  it('点击时应该调用onSelect回调', () => {
    const mockOnSelect = jest.fn();
    render(<MovieCard movie={mockMovie} onSelect={mockOnSelect} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockMovie);
  });
});
```

## 4. HTML设计稿迁移策略 (强制执行)

### 4.1 迁移策略概述

**⚠️ 强制要求：所有HTML设计稿必须严格按照以下策略进行迁移，确保UI完全一致，不允许任何视觉差异。**

#### 4.1.1 核心原则
- **视觉保真度100%**: 最终React组件必须与原HTML设计稿在浏览器中呈现完全一致的效果
- **组件最大化复用**: 能够提取为公共组件的必须提取，避免重复代码
- **渐进式迁移**: 先确保视觉效果，再逐步优化架构
- **@别名强制使用**: 所有导入导出必须使用@别名，无例外

#### 4.1.2 迁移方案：组件化 + 渐进式迁移

**第一阶段：完整页面组件创建**
1. 将整个HTML页面作为单一React组件实现
2. 保持所有原始样式、类名、结构不变
3. 确保在浏览器中渲染效果100%一致
4. 所有导入使用@别名：`import { Component } from '@/components/Component'`

**第二阶段：组件提取与复用**
1. 识别可复用的UI模块（导航栏、卡片、按钮等）
2. 提取为独立的原子/分子组件
3. 保持原始样式和交互行为
4. 更新页面组件使用提取的子组件

**第三阶段：DDD架构集成**
1. 将组件按DDD分层放置到对应目录
2. 添加TypeScript类型定义
3. 集成状态管理和业务逻辑
4. 优化性能和可维护性

### 4.2 组件最大化复用规范 (强制执行)

**⚠️ 强制要求：以下复用规范必须严格执行，违反者代码不予通过审查。**

#### 4.2.1 复用识别原则
- **视觉相似度≥80%**: 外观相似的元素必须提取为公共组件
- **功能相似度≥70%**: 功能相似的模块必须提取为公共组件
- **出现频次≥2次**: 在2个或以上页面出现的元素必须提取为公共组件

#### 4.2.2 强制提取的组件类型

**原子组件 (Atoms) - 必须提取**
```typescript
// 示例：所有按钮必须使用统一的Button组件
import { Button } from '@/presentation/components/atoms/Button'

// 禁止：直接写button标签
// <button className="bg-blue-500 text-white px-4 py-2">点击</button>

// 正确：使用公共Button组件
<Button variant="primary" size="md">点击</Button>
```

**分子组件 (Molecules) - 必须提取**
```typescript
// 示例：所有搜索框必须使用统一的SearchBox组件
import { SearchBox } from '@/presentation/components/molecules/SearchBox'

// 禁止：重复实现搜索框
// <div className="flex">
//   <input type="text" />
//   <button>搜索</button>
// </div>

// 正确：使用公共SearchBox组件
<SearchBox 
  placeholder="搜索影片..." 
  onSearch={handleSearch} 
/>
```

**有机体组件 (Organisms) - 必须提取**
```typescript
// 示例：所有导航栏必须使用统一的Navigation组件
import { Navigation } from '@/presentation/components/organisms/Navigation'

// 正确：使用公共Navigation组件
<Navigation 
  logo="CineSearch"
  menuItems={menuItems}
  user={currentUser}
/>
```

#### 4.2.3 复用验证检查清单

**开发阶段检查 (强制执行)**
- [ ] 是否存在重复的UI元素未提取？
- [ ] 是否存在相似的交互逻辑未抽象？
- [ ] 是否所有导入都使用了@别名？
- [ ] 是否遵循了DDD分层架构？

**代码审查检查 (强制执行)**
- [ ] 新增组件是否检查了现有组件库？
- [ ] 是否优先复用现有组件而非创建新组件？
- [ ] 组件API设计是否考虑了扩展性？
- [ ] 是否添加了适当的TypeScript类型？

### 4.3 @别名导入导出规范 (强制执行)

**⚠️ 强制要求：所有文件的导入导出必须使用@别名，绝对禁止相对路径导入。**

#### 4.3.1 @别名配置

**Vite配置 (vite.config.ts)**
```typescript
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/presentation/components'),
      '@/pages': path.resolve(__dirname, './src/presentation/pages'),
      '@/hooks': path.resolve(__dirname, './src/presentation/hooks'),
      '@/stores': path.resolve(__dirname, './src/application/stores'),
      '@/services': path.resolve(__dirname, './src/application/services'),
      '@/domain': path.resolve(__dirname, './src/domain'),
      '@/infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/assets': path.resolve(__dirname, './src/assets')
    }
  }
})
```

**TypeScript配置 (tsconfig.json)**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/presentation/components/*"],
      "@/pages/*": ["./src/presentation/pages/*"],
      "@/hooks/*": ["./src/presentation/hooks/*"],
      "@/stores/*": ["./src/application/stores/*"],
      "@/services/*": ["./src/application/services/*"],
      "@/domain/*": ["./src/domain/*"],
      "@/infrastructure/*": ["./src/infrastructure/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/assets/*": ["./src/assets/*"]
    }
  }
}
```

#### 4.3.2 强制使用规范

**✅ 正确的导入方式**
```typescript
// 组件导入
import { Button } from '@/components/atoms/Button'
import { MovieCard } from '@/components/molecules/MovieCard'
import { Navigation } from '@/components/organisms/Navigation'
import { HomePage } from '@/pages/HomePage'

// 业务逻辑导入
import { useAuth } from '@/hooks/useAuth'
import { movieService } from '@/services/movieService'
import { Movie } from '@/domain/entities/Movie'

// 工具和类型导入
import { formatDate } from '@/utils/dateUtils'
import { ApiResponse } from '@/types/api.types'
import { ENDPOINTS } from '@/infrastructure/api/endpoints'
```

**❌ 禁止的导入方式**
```typescript
// 禁止：相对路径导入
import { Button } from '../../../components/atoms/Button'
import { MovieCard } from '../../molecules/MovieCard'
import { useAuth } from '../hooks/useAuth'

// 禁止：混合导入方式
import { Button } from '@/components/atoms/Button'
import { MovieCard } from '../molecules/MovieCard'  // 不一致
```

#### 4.3.3 导出规范

**命名导出 (推荐)**
```typescript
// 组件导出
export const Button: React.FC<ButtonProps> = ({ ... }) => { ... }
export const MovieCard: React.FC<MovieCardProps> = ({ ... }) => { ... }

// 服务导出
export const movieService = new MovieService()
export const authService = new AuthService()

// 类型导出
export interface User { ... }
export type MovieStatus = 'active' | 'inactive'
```

**默认导出 (仅页面组件)**
```typescript
// 页面组件可使用默认导出
const HomePage: React.FC = () => { ... }
export default HomePage

// 导入时
import HomePage from '@/pages/HomePage'
```

#### 4.3.4 违规检查与处罚

**ESLint规则配置**
```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["../*", "./*"],
            "message": "禁止使用相对路径导入，必须使用@别名"
          }
        ]
      }
    ]
  }
}
```

**强制执行措施**
- 代码提交前自动检查，违规代码无法提交
- 代码审查阶段严格检查，违规代码直接拒绝
- 定期代码扫描，发现违规立即整改

### 4.4 实施检查清单 (强制执行)

**开发前检查**
- [ ] 是否分析了设计稿中的可复用元素？
- [ ] 是否制定了组件提取计划？
- [ ] 是否配置了@别名路径？

**开发中检查**
- [ ] 是否严格按照HTML结构实现？
- [ ] 是否保持了原始样式和类名？
- [ ] 是否使用了@别名导入？
- [ ] 是否优先复用现有组件？

**开发后检查**
- [ ] 浏览器渲染效果是否100%一致？
- [ ] 是否提取了所有可复用组件？
- [ ] 是否所有导入都使用@别名？
- [ ] 是否通过了ESLint检查？

**代码审查检查**
- [ ] 视觉效果是否完全一致？
- [ ] 组件复用是否最大化？
- [ ] @别名使用是否规范？
- [ ] DDD架构是否正确？

## 5. TypeScript使用规范

### 4.1 类型定义

#### 4.1.1 基础类型
```typescript
// 使用interface定义对象类型
interface User {
  id: number;
  name: string;
  email: string;
}

// 使用type定义联合类型、交叉类型等
type Status = 'loading' | 'success' | 'error';
type UserWithStatus = User & { status: Status };
```

#### 4.1.2 组件类型
```typescript
// 组件Props类型
interface MovieCardProps {
  movie: Movie;
  onPlay: (id: number) => void;
  className?: string;
}

// 组件类型
const MovieCard: React.FC<MovieCardProps> = ({ movie, onPlay, className }) => {
  // 组件实现
};
```

### 4.2 类型规范
- 优先使用interface，需要联合类型时使用type
- 避免使用any，使用unknown代替
- 使用泛型提高代码复用性
- 为API响应定义明确的类型

## 6. DDD状态管理规范

### 5.1 Zustand + TanStack Query架构

#### 5.1.1 领域状态管理
基于DDD原则，将状态按领域划分：

```typescript
// 用户领域状态
interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  permissions: Permission[];
  preferences: UserPreferences;
}

interface UserActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (preferences: UserPreferences) => void;
}

const useUserStore = create<UserState & UserActions>((set, get) => ({
  // 状态
  currentUser: null,
  isAuthenticated: false,
  permissions: [],
  preferences: defaultPreferences,

  // 动作
  login: async (credentials) => {
    const user = await authService.login(credentials);
    set({ 
      currentUser: user, 
      isAuthenticated: true,
      permissions: user.permissions 
    });
  },

  logout: () => {
    authService.logout();
    set({ 
      currentUser: null, 
      isAuthenticated: false,
      permissions: [] 
    });
  },

  updateProfile: async (profile) => {
    const updatedUser = await userService.updateProfile(profile);
    set({ currentUser: updatedUser });
  },

  updatePreferences: (preferences) => {
    set({ preferences });
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }
}));
```

#### 5.1.2 影片领域状态
```typescript
// 影片领域状态
interface MovieState {
  selectedMovie: Movie | null;
  favoriteMovies: Movie[];
  recentlyViewed: Movie[];
  searchHistory: string[];
}

interface MovieActions {
  selectMovie: (movie: Movie) => void;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: string) => void;
  addToRecentlyViewed: (movie: Movie) => void;
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

const useMovieStore = create<MovieState & MovieActions>((set, get) => ({
  // 状态
  selectedMovie: null,
  favoriteMovies: [],
  recentlyViewed: [],
  searchHistory: [],

  // 动作
  selectMovie: (movie) => {
    set({ selectedMovie: movie });
    get().addToRecentlyViewed(movie);
  },

  addToFavorites: (movie) => {
    const { favoriteMovies } = get();
    if (!favoriteMovies.find(m => m.id === movie.id)) {
      set({ favoriteMovies: [...favoriteMovies, movie] });
    }
  },

  removeFromFavorites: (movieId) => {
    const { favoriteMovies } = get();
    set({ 
      favoriteMovies: favoriteMovies.filter(m => m.id !== movieId) 
    });
  },

  addToRecentlyViewed: (movie) => {
    const { recentlyViewed } = get();
    const filtered = recentlyViewed.filter(m => m.id !== movie.id);
    set({ 
      recentlyViewed: [movie, ...filtered].slice(0, 10) // 最多保留10个
    });
  },

  addToSearchHistory: (query) => {
    const { searchHistory } = get();
    const filtered = searchHistory.filter(q => q !== query);
    set({ 
      searchHistory: [query, ...filtered].slice(0, 5) // 最多保留5个
    });
  },

  clearSearchHistory: () => {
    set({ searchHistory: [] });
  }
}));
```

### 5.2 TanStack Query数据获取

#### 5.2.1 API查询规范
```typescript
// 影片相关查询
export const movieQueries = {
  // 查询键工厂
  all: ['movies'] as const,
  lists: () => [...movieQueries.all, 'list'] as const,
  list: (filters: MovieFilters) => [...movieQueries.lists(), filters] as const,
  details: () => [...movieQueries.all, 'detail'] as const,
  detail: (id: string) => [...movieQueries.details(), id] as const,
  search: (query: string) => [...movieQueries.all, 'search', query] as const,

  // 查询函数
  useMovieList: (filters: MovieFilters) => {
    return useQuery({
      queryKey: movieQueries.list(filters),
      queryFn: () => movieService.getMovieList(filters),
      staleTime: 5 * 60 * 1000, // 5分钟
      cacheTime: 10 * 60 * 1000, // 10分钟
    });
  },

  useMovieDetail: (id: string) => {
    return useQuery({
      queryKey: movieQueries.detail(id),
      queryFn: () => movieService.getMovieDetail(id),
      enabled: !!id,
      staleTime: 10 * 60 * 1000, // 10分钟
    });
  },

  useMovieSearch: (query: string) => {
    return useQuery({
      queryKey: movieQueries.search(query),
      queryFn: () => movieService.searchMovies(query),
      enabled: query.length > 2,
      staleTime: 2 * 60 * 1000, // 2分钟
    });
  }
};
```

#### 5.2.2 变更操作规范
```typescript
// 影片相关变更
export const movieMutations = {
  useAddToFavorites: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (movieId: string) => movieService.addToFavorites(movieId),
      onSuccess: (data, movieId) => {
        // 更新相关查询缓存
        queryClient.invalidateQueries({ queryKey: movieQueries.all });
        
        // 乐观更新
        queryClient.setQueryData(
          movieQueries.detail(movieId),
          (old: Movie | undefined) => 
            old ? { ...old, isFavorite: true } : old
        );
      },
      onError: (error) => {
        // 错误处理
        toast.error('添加收藏失败');
      }
    });
  },

  useRateMovie: () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: ({ movieId, rating }: { movieId: string; rating: number }) =>
        movieService.rateMovie(movieId, rating),
      onSuccess: (data, { movieId, rating }) => {
        // 更新电影详情缓存
        queryClient.setQueryData(
          movieQueries.detail(movieId),
          (old: Movie | undefined) => 
            old ? { ...old, userRating: rating } : old
        );
      }
    });
  }
};
```

### 5.3 领域事件状态同步

#### 5.3.1 事件驱动状态更新
```typescript
// 领域事件处理器
class DomainEventHandler {
  constructor(
    private userStore: UserStore,
    private movieStore: MovieStore,
    private downloadStore: DownloadStore
  ) {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // 用户相关事件
    eventBus.subscribe('UserLoggedIn', (event) => {
      this.userStore.setCurrentUser(event.payload.user);
    });

    eventBus.subscribe('UserLoggedOut', () => {
      this.userStore.clearUser();
      this.movieStore.clearUserData();
      this.downloadStore.clearUserData();
    });

    // 影片相关事件
    eventBus.subscribe('MovieSelected', (event) => {
      this.movieStore.selectMovie(event.payload.movie);
    });

    eventBus.subscribe('MovieAddedToFavorites', (event) => {
      this.movieStore.addToFavorites(event.payload.movie);
    });

    // 下载相关事件
    eventBus.subscribe('DownloadStarted', (event) => {
      this.downloadStore.addDownload(event.payload.download);
    });

    eventBus.subscribe('DownloadCompleted', (event) => {
      this.downloadStore.updateDownloadStatus(
        event.payload.downloadId, 
        'completed'
      );
    });
  }
}
```

### 5.4 状态持久化

#### 5.4.1 本地存储策略
```typescript
// 状态持久化中间件
const createPersistentStore = <T>(
  name: string,
  store: StateCreator<T>,
  options: {
    partialize?: (state: T) => Partial<T>;
    version?: number;
    migrate?: (persistedState: any, version: number) => T;
  } = {}
) => {
  return create<T>()(
    persist(store, {
      name,
      storage: createJSONStorage(() => localStorage),
      partialize: options.partialize,
      version: options.version || 1,
      migrate: options.migrate,
    })
  );
};

// 用户偏好持久化
const useUserPreferencesStore = createPersistentStore(
  'user-preferences',
  (set, get) => ({
    theme: 'light' as 'light' | 'dark',
    language: 'zh-CN',
    autoPlay: true,
    downloadQuality: 'HD',
    
    setTheme: (theme: 'light' | 'dark') => set({ theme }),
    setLanguage: (language: string) => set({ language }),
    setAutoPlay: (autoPlay: boolean) => set({ autoPlay }),
    setDownloadQuality: (quality: string) => set({ downloadQuality: quality }),
  }),
  {
    partialize: (state) => ({
      theme: state.theme,
      language: state.language,
      autoPlay: state.autoPlay,
      downloadQuality: state.downloadQuality,
    }),
  }
);
```

## 7. API调用规范

### 6.1 接口定义
```typescript
// API基础配置
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

// 接口类型定义
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface MovieListResponse {
  movies: Movie[];
  total: number;
  page: number;
}
```

### 6.2 错误处理
- 统一错误处理机制
- 用户友好的错误提示
- 错误日志记录
- 网络异常处理

## 8. 样式规范

### 7.1 CSS命名规范
- 使用BEM命名法
- 组件作用域样式
- 避免全局样式污染

### 7.2 响应式设计
- 移动端优先
- 使用相对单位
- 合理的断点设置

### 7.3 样式方案
```css
/* BEM命名示例 */
.movie-card {
  /* 块样式 */
}

.movie-card__title {
  /* 元素样式 */
}

.movie-card__title--highlighted {
  /* 修饰符样式 */
}
```

## 9. 路由规范

### 8.1 路由结构
```typescript
// 路由配置
const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/movies',
    element: <MovieListPage />,
  },
  {
    path: '/movies/:id',
    element: <MovieDetailPage />,
  },
];
```

### 8.2 路由守卫
- 登录状态检查
- 权限验证
- 页面访问控制

## 10. 性能优化规范

### 9.1 代码分割
- 路由级别代码分割
- 组件级别懒加载
- 第三方库按需引入

### 9.2 媒体资源优化

#### 9.2.1 图片优化策略
```typescript
// 图片懒加载组件
interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  webpSrc?: string;
  avifSrc?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  webpSrc,
  avifSrc,
  className,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // 使用 Intersection Observer 实现懒加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // 提前50px开始加载
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 生成响应式图片源
  const generateSrcSet = (baseSrc: string): string => {
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths
      .map(width => `${baseSrc}?w=${width} ${width}w`)
      .join(', ');
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <span className="text-gray-500">图片加载失败</span>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {/* 占位符 */}
      {!isLoaded && placeholder && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          aria-hidden="true"
        />
      )}

      {/* 主图片 */}
      {isInView && (
        <picture>
          {avifSrc && <source srcSet={generateSrcSet(avifSrc)} type="image/avif" />}
          {webpSrc && <source srcSet={generateSrcSet(webpSrc)} type="image/webp" />}
          <img
            src={src}
            srcSet={generateSrcSet(src)}
            alt={alt}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            decoding="async"
          />
        </picture>
      )}
    </div>
  );
};

// 图片预加载策略
class ImagePreloader {
  private cache: Map<string, HTMLImageElement> = new Map();
  private loadingPromises: Map<string, Promise<void>> = new Map();

  // 预加载单张图片
  preloadImage(src: string): Promise<void> {
    if (this.cache.has(src)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(src, img);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  // 预加载多张图片
  preloadImages(srcs: string[]): Promise<void[]> {
    return Promise.all(srcs.map(src => this.preloadImage(src)));
  }

  // 预加载下一页图片
  preloadNextPage(movies: Movie[], currentPage: number): void {
    const nextPageStart = currentPage * 20; // 假设每页20个
    const nextPageMovies = movies.slice(nextPageStart, nextPageStart + 10);

    const posterUrls = nextPageMovies
      .map(movie => movie.poster)
      .filter(Boolean);

    this.preloadImages(posterUrls);
  }
}
```

#### 9.2.2 CDN策略和缓存优化
```typescript
// CDN资源管理
class CDNResourceManager {
  private static readonly CDN_BASE_URLS = [
    'https://cdn1.moviesite.com',
    'https://cdn2.moviesite.com',
    'https://cdn3.moviesite.com'
  ];

  private static readonly CDN_REGION_MAPPING = {
    'asia': ['https://cdn-asia.moviesite.com'],
    'europe': ['https://cdn-eu.moviesite.com'],
    'america': ['https://cdn-us.moviesite.com']
  };

  // 根据用户地区选择最优CDN
  static getOptimalCDN(resourcePath: string): string {
    const userRegion = this.detectUserRegion();
    const regionalCDNs = this.CDN_REGION_MAPPING[userRegion as keyof typeof this.CDN_REGION_MAPPING];

    if (regionalCDNs && regionalCDNs.length > 0) {
      const randomCDN = regionalCDNs[Math.floor(Math.random() * regionalCDNs.length)];
      return `${randomCDN}${resourcePath}`;
    }

    // 随机选择一个CDN进行负载均衡
    const randomCDN = this.CDN_BASE_URLS[
      Math.floor(Math.random() * this.CDN_BASE_URLS.length)
    ];
    return `${randomCDN}${resourcePath}`;
  }

  // 简单的地区检测
  private static detectUserRegion(): string {
    // 这里可以通过IP库或者浏览器API来检测
    // 暂时返回默认值
    return 'asia';
  }

  // 生成带版本号的资源URL
  static getVersionedUrl(resourcePath: string, version: string): string {
    const separator = resourcePath.includes('?') ? '&' : '?';
    return `${resourcePath}${separator}v=${version}`;
  }

  // 生成响应式图片URL
  static getResponsiveImageUrl(basePath: string, width: number, quality: number = 80): string {
    return `${basePath}?w=${width}&q=${quality}&f=webp`;
  }
}

// Service Worker缓存策略
class CacheManager {
  private static readonly CACHE_NAME = 'movie-app-v1';
  private static readonly STATIC_CACHE_NAME = 'movie-static-v1';

  // 安装Service Worker时的缓存策略
  static async cacheStaticAssets(): Promise<void> {
    const staticAssets = [
      '/',
      '/manifest.json',
      '/offline.html',
      // 关键CSS和JS文件
      '/assets/css/main.css',
      '/assets/js/main.js',
      // 常用图标和字体
      '/assets/icons/icon-192x192.png',
      '/assets/fonts/main.woff2'
    ];

    const cache = await caches.open(this.STATIC_CACHE_NAME);
    await cache.addAll(staticAssets);
  }

  // 动态缓存策略
  static async cacheDynamicResources(request: Request, response: Response): Promise<void> {
    // 只缓存成功的响应
    if (!response.ok) return;

    // 缓存海报图片
    if (request.url.includes('/posters/')) {
      const cache = await caches.open(this.CACHE_NAME);
      cache.put(request, response.clone());
      return;
    }

    // 缓存API响应
    if (request.url.includes('/api/movies')) {
      const cache = await caches.open(this.CACHE_NAME);
      cache.put(request, response.clone());
    }
  }

  // 缓存优先策略
  static async cacheFirst(request: Request): Promise<Response | null> {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const networkResponse = await fetch(request);
      await this.cacheDynamicResources(request, networkResponse);
      return networkResponse;
    } catch (error) {
      return null;
    }
  }

  // 网络优先策略
  static async networkFirst(request: Request): Promise<Response> {
    try {
      const networkResponse = await fetch(request);
      await this.cacheDynamicResources(request, networkResponse);
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  }
}
```

### 9.3 大数据量处理优化

#### 9.3.1 虚拟滚动实现
```typescript
// 虚拟滚动Hook
interface UseVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // 预渲染的项目数量
  scrollToIndex?: number;
}

interface UseVirtualScrollReturn {
  visibleItems: {
    index: number;
    style: React.CSSProperties;
  }[];
  totalHeight: number;
  scrollToIndex: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const useVirtualScroll = <T>(
  items: T[],
  options: UseVirtualScrollOptions
): UseVirtualScrollReturn => {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        style: {
          position: 'absolute' as const,
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight,
        }
      });
    }
    return items;
  }, [startIndex, endIndex, itemHeight]);

  const totalHeight = items.length * itemHeight;

  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current) {
      const scrollTop = index * itemHeight;
      containerRef.current.scrollTop = scrollTop;
      setScrollTop(scrollTop);
    }
  }, [itemHeight]);

  // 监听滚动事件
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = throttle(() => {
      setScrollTop(container.scrollTop);
    }, 16); // 约60fps

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    visibleItems,
    totalHeight,
    scrollToIndex,
    containerRef
  };
};

// 虚拟滚动列表组件
interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan,
  className
}: VirtualListProps<T>) {
  const { visibleItems, totalHeight, containerRef } = useVirtualScroll(items, {
    itemHeight,
    containerHeight,
    overscan
  });

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: containerHeight, overflow: 'auto' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, style }) => (
          <div key={index} style={style}>
            {renderItem(items[index], index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// 影片列表虚拟滚动应用
const MovieVirtualList: React.FC<{ movies: Movie[] }> = ({ movies }) => {
  const containerHeight = window.innerHeight - 200; // 留出头部和底部空间
  const itemHeight = 280; // 影片卡片高度 + 间距

  return (
    <VirtualList
      items={movies}
      itemHeight={itemHeight}
      containerHeight={containerHeight}
      renderItem={(movie, index) => (
        <div className="px-4">
          <MovieCard movie={movie} />
        </div>
      )}
      overscan={3}
    />
  );
};
```

#### 9.3.2 分页和无限滚动
```typescript
// 无限滚动Hook
interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number; // 触发加载的距离阈值
  onLoadMore: () => void;
}

const useInfiniteScroll = (options: UseInfiniteScrollOptions) => {
  const { hasMore, isLoading, threshold = 100, onLoadMore } = options;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0.1
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, threshold, onLoadMore]);

  return loadMoreRef;
};

// 智能分页策略
class PaginationStrategy {
  // 根据网络条件调整页面大小
  static getOptimalPageSize(): number {
    const connection = (navigator as any).connection;
    if (!connection) return 20; // 默认值

    const { effectiveType, downlink } = connection;

    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 10;
      case '3g':
        return downlink < 1.5 ? 15 : 20;
      case '4g':
        return downlink < 4 ? 25 : 30;
      default:
        return 20;
    }
  }

  // 根据设备性能调整预加载策略
  static getPreloadStrategy(): {
    preloadNextPage: boolean;
    preloadDistance: number;
  } {
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency;

    if (memory && memory < 4 || cores < 4) {
      return {
        preloadNextPage: false,
        preloadDistance: 0
      };
    }

    return {
      preloadNextPage: true,
      preloadDistance: 2 // 提前2页开始预加载
    };
  }
}

// 分页管理Hook
const usePagination = <T>(
  fetchFunction: (page: number, pageSize: number) => Promise<{ data: T[]; total: number }>
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const pageSize = PaginationStrategy.getOptimalPageSize();
  const { preloadNextPage } = PaginationStrategy.getPreloadStrategy();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const result = await fetchFunction(page, pageSize);

      setData(prev => [...prev, ...result.data]);
      setTotal(result.total);
      setPage(prev => prev + 1);
      setHasMore(data.length + result.data.length < result.total);

      // 预加载下一页
      if (preloadNextPage && hasMore) {
        setTimeout(() => {
          fetchFunction(page + 1, pageSize).catch(() => {
            // 静默处理预加载失败
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to load more data:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchFunction, pageSize, preloadNextPage]);

  const loadMoreRef = useInfiniteScroll({
    hasMore,
    isLoading: loading,
    onLoadMore: loadMore
  });

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
    setTotal(0);
  }, []);

  return {
    data,
    loading,
    hasMore,
    total,
    loadMoreRef,
    reset,
    refresh: () => {
      reset();
      loadMore();
    }
  };
};
```

### 9.4 下载管理优化

#### 9.4.1 下载队列管理
```typescript
// 下载队列优化策略
class DownloadQueueOptimizer {
  private maxConcurrentDownloads: number;
  private downloadQueue: DownloadTask[] = [];
  private activeDownloads: Map<string, DownloadTask> = new Map();
  private pausedDownloads: Set<string> = new Set();

  constructor() {
    // 根据网络状况动态调整并发数量
    this.maxConcurrentDownloads = this.calculateOptimalConcurrentDownloads();
    this.setupNetworkMonitoring();
  }

  // 计算最优并发下载数量
  private calculateOptimalConcurrentDownloads(): number {
    const connection = (navigator as any).connection;
    if (!connection) return 3;

    const { effectiveType, downlink } = connection;

    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 1;
      case '3g':
        return downlink < 1.5 ? 2 : 3;
      case '4g':
        return downlink < 4 ? 3 : 5;
      default:
        return 3;
    }
  }

  // 监听网络状况变化
  private setupNetworkMonitoring(): void {
    const connection = (navigator as any).connection;
    if (!connection) return;

    connection.addEventListener('change', () => {
      const newMaxConcurrent = this.calculateOptimalConcurrentDownloads();
      if (newMaxConcurrent !== this.maxConcurrentDownloads) {
        this.maxConcurrentDownloads = newMaxConcurrent;
        this.optimizeQueue();
      }
    });
  }

  // 添加下载任务
  addDownloadTask(task: DownloadTask): void {
    // 优先级排序
    const insertIndex = this.findInsertPosition(task.priority);
    this.downloadQueue.splice(insertIndex, 0, task);
    this.processQueue();
  }

  // 处理下载队列
  private async processQueue(): Promise<void> {
    while (
      this.activeDownloads.size < this.maxConcurrentDownloads &&
      this.downloadQueue.length > 0
    ) {
      const task = this.downloadQueue.shift()!;

      if (!this.pausedDownloads.has(task.id)) {
        this.activeDownloads.set(task.id, task);
        this.executeDownload(task).finally(() => {
          this.activeDownloads.delete(task.id);
          this.processQueue();
        });
      }
    }
  }

  // 执行下载任务
  private async executeDownload(task: DownloadTask): Promise<void> {
    try {
      task.status = 'downloading';
      task.startTime = Date.now();

      // 实现分片下载
      if (task.supportsResumable && task.fileSize > 10 * 1024 * 1024) { // 10MB以上
        await this.downloadWithChunks(task);
      } else {
        await this.downloadSimple(task);
      }

      task.status = 'completed';
      task.endTime = Date.now();
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';

      // 自动重试逻辑
      if (task.retryCount < 3) {
        task.retryCount++;
        setTimeout(() => {
          this.addDownloadTask(task);
        }, Math.pow(2, task.retryCount) * 1000); // 指数退避
      }
    }
  }

  // 分片下载实现
  private async downloadWithChunks(task: DownloadTask): Promise<void> {
    const chunkSize = 1024 * 1024; // 1MB per chunk
    const totalChunks = Math.ceil(task.fileSize / chunkSize);
    let downloadedChunks = 0;

    for (let i = 0; i < totalChunks; i++) {
      if (task.status === 'paused') {
        throw new Error('Download paused');
      }

      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, task.fileSize);

      const response = await fetch(task.url, {
        headers: {
          'Range': `bytes=${start}-${end}`
        }
      });

      if (!response.ok) {
        throw new Error(`Download chunk failed: ${response.statusText}`);
      }

      const chunk = await response.arrayBuffer();

      // 处理下载的数据块
      await this.processChunk(task, chunk, i);

      downloadedChunks++;
      task.progress = (downloadedChunks / totalChunks) * 100;

      // 更新下载速度
      this.updateDownloadSpeed(task);
    }
  }

  // 简单下载实现
  private async downloadSimple(task: DownloadTask): Promise<void> {
    const response = await fetch(task.url);

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      // 处理下载的数据
      await this.processChunk(task, value, loaded);

      loaded += value.length;

      if (total > 0) {
        task.progress = (loaded / total) * 100;
      }

      this.updateDownloadSpeed(task);
    }
  }

  // 处理下载的数据块
  private async processChunk(task: DownloadTask, chunk: ArrayBuffer, chunkIndex: number): Promise<void> {
    // 这里可以将数据写入IndexedDB或文件系统
    // 具体实现取决于浏览器支持
  }

  // 更新下载速度
  private updateDownloadSpeed(task: DownloadTask): void {
    const now = Date.now();
    const timeDiff = now - (task.lastUpdateTime || task.startTime);

    if (timeDiff > 1000) { // 每秒更新一次
      const bytesDiff = (task.downloadedBytes || 0) - (task.lastDownloadedBytes || 0);
      task.downloadSpeed = (bytesDiff / timeDiff) * 1000; // bytes per second

      task.lastUpdateTime = now;
      task.lastDownloadedBytes = task.downloadedBytes;
    }
  }

  // 暂停下载
  pauseDownload(taskId: string): void {
    this.pausedDownloads.add(taskId);
    const task = this.activeDownloads.get(taskId);
    if (task) {
      task.status = 'paused';
    }
  }

  // 恢复下载
  resumeDownload(taskId: string): void {
    this.pausedDownloads.delete(taskId);
    const task = this.activeDownloads.get(taskId);
    if (task) {
      task.status = 'downloading';
    }
  }

  // 取消下载
  cancelDownload(taskId: string): void {
    this.pausedDownloads.add(taskId);
    const task = this.activeDownloads.get(taskId);
    if (task) {
      task.status = 'cancelled';
      this.activeDownloads.delete(taskId);
    }

    // 从队列中移除
    this.downloadQueue = this.downloadQueue.filter(t => t.id !== taskId);
  }

  // 优化队列
  private optimizeQueue(): void {
    // 如果当前活跃下载数量超过新的限制，暂停一些低优先级的下载
    if (this.activeDownloads.size > this.maxConcurrentDownloads) {
      const activeTasks = Array.from(this.activeDownloads.values())
        .sort((a, b) => a.priority - b.priority);

      const tasksToPause = activeTasks.slice(this.maxConcurrentDownloads);
      tasksToPause.forEach(task => {
        this.pauseDownload(task.id);
        this.downloadQueue.unshift(task); // 重新放回队列头部
      });
    }

    this.processQueue();
  }

  private findInsertPosition(priority: number): number {
    for (let i = 0; i < this.downloadQueue.length; i++) {
      if (this.downloadQueue[i].priority > priority) {
        return i;
      }
    }
    return this.downloadQueue.length;
  }
}
```

### 9.5 渲染优化
- 虚拟滚动
- 防抖节流
- 合理使用memo

## 11. 业务场景规范

### 10.1 搜索体验优化

#### 10.1.1 智能搜索实现
```typescript
// 智能搜索管理器
class SmartSearchManager {
  private searchHistory: string[] = [];
  private searchSuggestions: Map<string, string[]> = new Map();
  private searchAnalytics: SearchAnalytics;

  constructor() {
    this.searchAnalytics = new SearchAnalytics();
    this.loadSearchHistory();
  }

  // 实时搜索建议
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];

    // 从缓存获取建议
    const cached = this.searchSuggestions.get(query.toLowerCase());
    if (cached) return cached;

    try {
      const suggestions = await this.fetchSuggestions(query);

      // 缓存建议结果
      this.searchSuggestions.set(query.toLowerCase(), suggestions);

      return suggestions;
    } catch (error) {
      console.error('Failed to fetch search suggestions:', error);
      return [];
    }
  }

  // 模糊搜索实现
  fuzzySearch(query: string, movies: Movie[]): Movie[] {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) return movies;

    return movies
      .map(movie => ({
        movie,
        score: this.calculateRelevanceScore(normalizedQuery, movie)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.movie);
  }

  // 计算相关性得分
  private calculateRelevanceScore(query: string, movie: Movie): number {
    let score = 0;
    const title = movie.title.toLowerCase();
    const originalTitle = movie.originalTitle?.toLowerCase() || '';
    const genres = movie.genres.join(' ').toLowerCase();
    const director = movie.director?.toLowerCase() || '';
    const cast = movie.cast.join(' ').toLowerCase();

    // 标题完全匹配
    if (title === query) score += 100;
    else if (title.includes(query)) score += 80;
    else if (query.includes(title)) score += 60;

    // 原标题匹配
    if (originalTitle === query) score += 90;
    else if (originalTitle.includes(query)) score += 70;

    // 模糊匹配
    score += this.fuzzyMatch(query, title) * 50;
    score += this.fuzzyMatch(query, originalTitle) * 40;

    // 类型匹配
    if (genres.includes(query)) score += 30;

    // 导演匹配
    if (director.includes(query)) score += 25;

    // 演员匹配
    if (cast.includes(query)) score += 20;

    // 年份匹配
    if (movie.year.toString() === query) score += 15;

    return score;
  }

  // 模糊匹配算法
  private fuzzyMatch(query: string, text: string): number {
    if (!text) return 0;

    let queryIndex = 0;
    let textIndex = 0;
    let matchCount = 0;

    while (queryIndex < query.length && textIndex < text.length) {
      if (query[queryIndex] === text[textIndex]) {
        matchCount++;
        queryIndex++;
      }
      textIndex++;
    }

    return matchCount / query.length;
  }

  // 搜索历史管理
  addToSearchHistory(query: string): void {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // 移除重复项
    this.searchHistory = this.searchHistory.filter(item => item !== trimmedQuery);

    // 添加到开头
    this.searchHistory.unshift(trimmedQuery);

    // 限制历史记录数量
    if (this.searchHistory.length > 20) {
      this.searchHistory = this.searchHistory.slice(0, 20);
    }

    this.saveSearchHistory();
  }

  getSearchHistory(): string[] {
    return [...this.searchHistory];
  }

  clearSearchHistory(): void {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  private loadSearchHistory(): void {
    try {
      const history = localStorage.getItem('search-history');
      if (history) {
        this.searchHistory = JSON.parse(history);
      }
    } catch {
      this.searchHistory = [];
    }
  }

  private saveSearchHistory(): void {
    try {
      localStorage.setItem('search-history', JSON.stringify(this.searchHistory));
    } catch {
      // 忽略存储错误
    }
  }

  private async fetchSuggestions(query: string): Promise<string[]> {
    const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];

    const data = await response.json();
    return data.suggestions || [];
  }
}

// 搜索组件Hook
export const useSmartSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchManager = useMemo(() => new SmartSearchManager(), []);
  const { movies } = useMovieStore();
  const debouncedQuery = useDebounce(query, 300);

  // 获取搜索建议
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchManager.getSearchSuggestions(debouncedQuery)
        .then(setSuggestions)
        .catch(console.error);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, searchManager]);

  // 执行搜索
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // 先使用本地数据进行模糊搜索
      const localResults = searchManager.fuzzySearch(searchQuery, movies);
      setResults(localResults);

      // 然后获取服务器搜索结果
      const serverResults = await movieService.searchMovies(searchQuery);

      // 合并结果，去重
      const combinedResults = this.mergeSearchResults(localResults, serverResults);
      setResults(combinedResults);

      // 记录搜索历史
      searchManager.addToSearchHistory(searchQuery);

      // 记录搜索分析
      searchManager.searchAnalytics.recordSearch(searchQuery, combinedResults.length);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
      setShowSuggestions(false);
    }
  }, [searchManager, movies]);

  // 选择建议
  const selectSuggestion = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    performSearch(suggestion);
  }, [performSearch]);

  // 清除搜索
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    results,
    loading,
    showSuggestions,
    setShowSuggestions,
    performSearch,
    selectSuggestion,
    clearSearch,
    searchHistory: searchManager.getSearchHistory()
  };
};
```

#### 10.1.2 搜索性能优化
```typescript
// 搜索索引构建器
class SearchIndexBuilder {
  private index: Map<string, Set<string>> = new Map();
  private movies: Map<string, Movie> = new Map();

  // 构建搜索索引
  buildIndex(movies: Movie[]): void {
    this.index.clear();
    this.movies.clear();

    movies.forEach(movie => {
      this.movies.set(movie.id, movie);

      // 为电影的各个字段建立索引
      this.indexText(movie.id, movie.title);
      this.indexText(movie.id, movie.originalTitle);
      this.indexText(movie.id, movie.director);
      this.indexText(movie.id, movie.genres.join(' '));
      this.indexText(movie.id, movie.cast.join(' '));
      this.indexText(movie.id, movie.description);
      this.indexText(movie.id, movie.year.toString());
    });
  }

  // 索引文本
  private indexText(movieId: string, text?: string): void {
    if (!text) return;

    // 分词处理
    const words = this.tokenize(text);

    words.forEach(word => {
      if (word.length < 2) return; // 忽略太短的词

      if (!this.index.has(word)) {
        this.index.set(word, new Set());
      }

      this.index.get(word)!.add(movieId);
    });
  }

  // 分词处理
  private tokenize(text: string): string[] {
    // 转换为小写并分割
    const words = text.toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ') // 保留中文字符
      .split(/\s+/)
      .filter(word => word.length > 0);

    // 生成n-gram
    const ngrams: string[] = [];
    words.forEach(word => {
      ngrams.push(word);

      // 生成2-gram
      for (let i = 0; i <= word.length - 2; i++) {
        ngrams.push(word.substring(i, i + 2));
      }

      // 生成3-gram
      for (let i = 0; i <= word.length - 3; i++) {
        ngrams.push(word.substring(i, i + 3));
      }
    });

    return [...new Set(ngrams)]; // 去重
  }

  // 搜索索引
  search(query: string): Movie[] {
    const words = this.tokenize(query);
    if (words.length === 0) return [];

    // 计算每个词的匹配度
    const movieScores = new Map<string, number>();

    words.forEach(word => {
      const movieIds = this.index.get(word);
      if (movieIds) {
        movieIds.forEach(movieId => {
          const currentScore = movieScores.get(movieId) || 0;
          movieScores.set(movieId, currentScore + 1);
        });
      }
    });

    // 按得分排序
    const sortedMovies = Array.from(movieScores.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([movieId]) => this.movies.get(movieId))
      .filter(Boolean) as Movie[];

    return sortedMovies;
  }
}
```

### 10.2 用户行为追踪

#### 10.2.1 行为数据收集
```typescript
// 用户行为追踪器
class UserBehaviorTracker {
  private static instance: UserBehaviorTracker;
  private events: BehaviorEvent[] = [];
  private sessionStartTime: number = Date.now();
  private userId?: string;

  static getInstance(): UserBehaviorTracker {
    if (!UserBehaviorTracker.instance) {
      UserBehaviorTracker.instance = new UserBehaviorTracker();
    }
    return UserBehaviorTracker.instance;
  }

  // 设置用户ID
  setUserId(userId: string): void {
    this.userId = userId;
  }

  // 追踪页面访问
  trackPageView(page: string, title?: string): void {
    this.addEvent({
      type: 'page_view',
      timestamp: Date.now(),
      data: {
        page,
        title,
        url: window.location.href,
        referrer: document.referrer
      }
    });
  }

  // 追踪影片浏览
  trackMovieView(movieId: string, source: string): void {
    this.addEvent({
      type: 'movie_view',
      timestamp: Date.now(),
      data: {
        movieId,
        source, // 'search', 'recommendation', 'category', etc.
        sessionId: this.getSessionId()
      }
    });
  }

  // 追踪搜索行为
  trackSearch(query: string, resultCount: number, filters?: any): void {
    this.addEvent({
      type: 'search',
      timestamp: Date.now(),
      data: {
        query,
        resultCount,
        filters,
        sessionId: this.getSessionId()
      }
    });
  }

  // 追踪下载行为
  trackDownload(movieId: string, quality: string, source: string): void {
    this.addEvent({
      type: 'download',
      timestamp: Date.now(),
      data: {
        movieId,
        quality,
        source,
        sessionId: this.getSessionId()
      }
    });
  }

  // 追踪用户交互
  trackInteraction(element: string, action: string, context?: any): void {
    this.addEvent({
      type: 'interaction',
      timestamp: Date.now(),
      data: {
        element,
        action,
        context,
        sessionId: this.getSessionId()
      }
    });
  }

  // 追踪性能指标
  trackPerformance(metric: string, value: number, context?: any): void {
    this.addEvent({
      type: 'performance',
      timestamp: Date.now(),
      data: {
        metric,
        value,
        context,
        sessionId: this.getSessionId()
      }
    });
  }

  // 追踪错误
  trackError(error: Error, context?: any): void {
    this.addEvent({
      type: 'error',
      timestamp: Date.now(),
      data: {
        message: error.message,
        stack: error.stack,
        context,
        sessionId: this.getSessionId()
      }
    });
  }

  // 添加事件
  private addEvent(event: BehaviorEvent): void {
    // 添加用户ID和会话信息
    event.userId = this.userId;
    event.sessionId = this.getSessionId();

    this.events.push(event);

    // 批量发送事件
    if (this.events.length >= 10) {
      this.flushEvents();
    }
  }

  // 获取会话ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session-id', sessionId);
    }
    return sessionId;
  }

  // 发送事件到服务器
  private async flushEvents(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: eventsToSend,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // 失败时重新加入队列
      this.events.unshift(...eventsToSend);
    }
  }

  // 页面卸载时发送剩余事件
  setupBeforeUnloadHandler(): void {
    window.addEventListener('beforeunload', () => {
      this.flushEvents();
    });

    // 定期发送事件
    setInterval(() => {
      this.flushEvents();
    }, 30000); // 每30秒发送一次
  }
}

// 行为事件接口
interface BehaviorEvent {
  type: string;
  timestamp: number;
  data: any;
  userId?: string;
  sessionId?: string;
}

// React Hook for behavior tracking
export const useBehaviorTracking = () => {
  const tracker = UserBehaviorTracker.getInstance();
  const location = useLocation();

  // 追踪页面访问
  useEffect(() => {
    const title = document.title;
    tracker.trackPageView(location.pathname, title);
  }, [location]);

  return {
    trackMovieView: (movieId: string, source: string) =>
      tracker.trackMovieView(movieId, source),
    trackSearch: (query: string, resultCount: number, filters?: any) =>
      tracker.trackSearch(query, resultCount, filters),
    trackDownload: (movieId: string, quality: string, source: string) =>
      tracker.trackDownload(movieId, quality, source),
    trackInteraction: (element: string, action: string, context?: any) =>
      tracker.trackInteraction(element, action, context),
    trackPerformance: (metric: string, value: number, context?: any) =>
      tracker.trackPerformance(metric, value, context),
    trackError: (error: Error, context?: any) =>
      tracker.trackError(error, context),
    setUserId: (userId: string) => tracker.setUserId(userId)
  };
};
```

#### 10.2.2 用户偏好分析
```typescript
// 用户偏好分析器
class UserPreferenceAnalyzer {
  private static instance: UserPreferenceAnalyzer;
  private userPreferences: UserPreferences = {
    genres: {},
    actors: {},
    directors: {},
    qualities: {},
    languages: {},
    releaseYears: {}
  };

  static getInstance(): UserPreferenceAnalyzer {
    if (!UserPreferenceAnalyzer.instance) {
      UserPreferenceAnalyzer.instance = new UserPreferenceAnalyzer();
    }
    return UserPreferenceAnalyzer.instance;
  }

  // 分析用户行为数据
  analyzeBehavior(events: BehaviorEvent[]): UserPreferences {
    const preferences = { ...this.userPreferences };

    events.forEach(event => {
      switch (event.type) {
        case 'movie_view':
          this.analyzeMovieView(event.data, preferences);
          break;
        case 'download':
          this.analyzeDownload(event.data, preferences);
          break;
        case 'search':
          this.analyzeSearch(event.data, preferences);
          break;
      }
    });

    this.userPreferences = preferences;
    return preferences;
  }

  // 分析影片浏览行为
  private analyzeMovieView(data: any, preferences: UserPreferences): void {
    // 这里需要从影片数据中提取相关信息
    // 实际实现中需要获取影片详细信息
  }

  // 分析下载行为
  private analyzeDownload(data: any, preferences: UserPreferences): void {
    if (data.quality) {
      preferences.qualities[data.quality] = (preferences.qualities[data.quality] || 0) + 1;
    }
  }

  // 分析搜索行为
  private analyzeSearch(data: any, preferences: UserPreferences): void {
    // 分析搜索词中的偏好信息
  }

  // 获取推荐内容
  getRecommendations(preferences: UserPreferences, allMovies: Movie[]): Movie[] {
    // 基于用户偏好计算推荐分数
    const scoredMovies = allMovies.map(movie => ({
      movie,
      score: this.calculateRecommendationScore(movie, preferences)
    }));

    // 按分数排序并返回前N个
    return scoredMovies
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(item => item.movie);
  }

  // 计算推荐分数
  private calculateRecommendationScore(movie: Movie, preferences: UserPreferences): number {
    let score = 0;

    // 类型偏好分数
    movie.genres.forEach(genre => {
      score += (preferences.genres[genre] || 0) * 0.3;
    });

    // 演员偏好分数
    movie.cast.forEach(actor => {
      score += (preferences.actors[actor] || 0) * 0.2;
    });

    // 导演偏好分数
    if (movie.director) {
      score += (preferences.directors[movie.director] || 0) * 0.25;
    }

    // 年份偏好分数
    const decade = Math.floor(movie.year / 10) * 10;
    score += (preferences.releaseYears[decade] || 0) * 0.1;

    // 质量偏好分数
    const qualityScore = Object.values(preferences.qualities).reduce((sum, count) => sum + count, 0);
    if (qualityScore > 0) {
      score += qualityScore * 0.15;
    }

    return score;
  }
}

interface UserPreferences {
  genres: Record<string, number>;
  actors: Record<string, number>;
  directors: Record<string, number>;
  qualities: Record<string, number>;
  languages: Record<string, number>;
  releaseYears: Record<number, number>;
}
```

## 12. 测试规范

### 11.1 测试框架
- Jest + React Testing Library
- 组件单元测试
- 集成测试

### 11.2 测试覆盖率
- 单元测试覆盖率>80%
- 关键业务逻辑100%覆盖

## 13. 构建部署规范

### 12.1 环境配置
- 开发环境配置
- 测试环境配置
- 生产环境配置

### 12.2 构建优化
- 代码压缩
- 资源优化
- 缓存策略

## 14. 错误处理和监控策略

### 13.1 错误边界实现

#### 13.1.1 通用错误边界组件
```typescript
// 通用错误边界组件
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  onErrorReport?: (error: Error, context: any) => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    });

    // 调用错误回调
    this.props.onError?.(error, errorInfo);

    // 上报错误信息
    this.reportError(error, errorInfo);

    // 记录用户行为追踪
    const tracker = UserBehaviorTracker.getInstance();
    tracker.trackError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      retryCount: this.state.retryCount
    });
  }

  // 上报错误
  private reportError = (error: Error, errorInfo: React.ErrorInfo): void => {
    const errorContext = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      },
      user: {
        userId: this.getUserId(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      },
      app: {
        version: process.env.REACT_APP_VERSION,
        buildTime: process.env.REACT_APP_BUILD_TIME
      }
    };

    this.props.onErrorReport?.(error, errorContext);

    // 发送到错误监控服务
    this.sendErrorReport(errorContext);
  };

  // 发送错误报告
  private async sendErrorReport(errorContext: any): Promise<void> {
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorContext)
      });
    } catch (reportError) {
      console.error('Failed to send error report:', reportError);
    }
  }

  // 获取用户ID
  private getUserId(): string | null {
    // 从存储或状态中获取用户ID
    return localStorage.getItem('userId') || null;
  }

  // 重试
  private handleRetry = (): void => {
    const { maxRetries = 3 } = this.props;

    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    } else {
      console.error('Max retries reached for error boundary');
    }
  };

  // 延迟重试
  private handleDelayedRetry = (): void => {
    const delay = Math.pow(2, this.state.retryCount) * 1000; // 指数退避

    this.retryTimeoutId = setTimeout(() => {
      this.handleRetry();
    }, delay);
  };

  componentWillUnmount(): void {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render(): React.ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback: Fallback } = this.props;

    if (hasError && error) {
      if (Fallback) {
        return <Fallback error={error} retry={this.handleRetry} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 m-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              应用程序遇到错误
            </h2>

            <p className="text-gray-600 text-center mb-6">
              很抱歉，应用程序遇到了一个意外错误。请尝试刷新页面或稍后再试。
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  错误详情（开发模式）
                </summary>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-800 overflow-auto">
                  <div className="mb-2">
                    <strong>错误:</strong> {error.name}: {error.message}
                  </div>
                  {error.stack && (
                    <div>
                      <strong>堆栈跟踪:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                重试
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                刷新页面
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              错误ID: {this.generateErrorId()}
            </p>
          </div>
        </div>
      );
    }

    return children;
  }

  // 生成错误ID
  private generateErrorId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// 异步错误边界Hook
export const useAsyncErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // 捕获异步错误
  const captureAsyncError = useCallback((error: Error) => {
    setError(error);
  }, []);

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return {
    captureAsyncError,
    resetError
  };
};
```

### 13.2 全局错误处理

#### 13.2.1 未捕获错误处理
```typescript
// 全局错误处理器
class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorReporters: ErrorReporter[] = [];

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  // 初始化全局错误处理
  init(): void {
    // 处理未捕获的JavaScript错误
    window.addEventListener('error', this.handleWindowError.bind(this));

    // 处理未捕获的Promise rejection
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));

    // 处理资源加载错误
    window.addEventListener('error', this.handleResourceError.bind(this), true);
  }

  // 添加错误报告器
  addErrorReporter(reporter: ErrorReporter): void {
    this.errorReporters.push(reporter);
  }

  // 处理窗口错误
  private handleWindowError(event: ErrorEvent): void {
    const error = new Error(event.message);
    error.stack = event.error?.stack;

    this.handleError(error, {
      type: 'window_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: Date.now()
    });
  }

  // 处理未捕获的Promise rejection
  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));

    this.handleError(error, {
      type: 'unhandled_promise_rejection',
      reason: event.reason,
      timestamp: Date.now()
    });
  }

  // 统一错误处理
  private handleError(error: Error, context: any): void {
    // 过滤掉一些不需要上报的错误
    if (this.shouldIgnoreError(error, context)) {
      return;
    }

    // 增强错误信息
    const enhancedError = this.enhanceError(error, context);

    // 发送到所有错误报告器
    this.errorReporters.forEach(reporter => {
      try {
        reporter.report(enhancedError);
      } catch (reporterError) {
        console.error('Error in error reporter:', reporterError);
      }
    });

    // 开发环境下输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error caught:', enhancedError);
    }
  }

  // 判断是否应该忽略错误
  private shouldIgnoreError(error: Error, context: any): boolean {
    const ignoredErrors = [
      'Script error', // 跨域脚本错误
      'Network request failed', // 网络请求失败
      'Non-Error promise rejection captured' // 非Error的Promise rejection
    ];

    return ignoredErrors.some(ignored => error.message.includes(ignored));
  }

  // 增强错误信息
  private enhanceError(error: Error, context: any): any {
    return {
      ...error,
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now(),
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      appVersion: process.env.REACT_APP_VERSION
    };
  }

  private getUserId(): string | null {
    return localStorage.getItem('userId') || null;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session-id', sessionId);
    }
    return sessionId;
  }
}

// 错误报告器接口
interface ErrorReporter {
  report(error: any): void;
}

// 初始化全局错误处理
const globalErrorHandler = GlobalErrorHandler.getInstance();
globalErrorHandler.init();
```

### 13.3 用户反馈机制

#### 13.3.1 用户反馈收集组件
```typescript
// 用户反馈组件
interface UserFeedbackProps {
  error?: Error;
  context?: string;
  onSubmit?: (feedback: any) => void;
}

const UserFeedback: React.FC<UserFeedbackProps> = ({ error, context, onSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'bug' as 'bug' | 'feature' | 'general',
    description: '',
    email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitFeedback({
        ...formData,
        context: context || error?.message,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      });

      onSubmit?.(formData);
      setIsOpen(false);
      setFormData({ type: 'bug', description: '', email: '' });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        反馈
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">用户反馈</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">
                  <strong>遇到的问题:</strong> {error.message}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  反馈类型
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="bug">Bug报告</option>
                  <option value="feature">功能建议</option>
                  <option value="general">一般反馈</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  详细描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={4}
                  placeholder="请详细描述您遇到的问题或建议..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.description}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isSubmitting ? '提交中...' : '提交反馈'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

async function submitFeedback(feedback: any): Promise<void> {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback)
  });

  if (!response.ok) {
    throw new Error('Failed to submit feedback');
  }
}
```

## 15. 安全规范

### 14.1 跨站脚本攻击(XSS)防护

#### 14.1.1 输入验证和清理
```typescript
// 输入验证工具
import DOMPurify from 'dompurify';

// 清理用户输入的HTML内容
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title'],
    ALLOW_DATA_ATTR: false
  });
};

// 验证和清理用户输入
const validateUserInput = (input: string): string => {
  // 移除潜在的脚本标签
  const cleaned = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // 转义HTML特殊字符
  return cleaned
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// 在组件中使用
const UserComment: React.FC<{ comment: string }> = ({ comment }) => {
  const safeComment = useMemo(() => sanitizeHtml(comment), [comment]);
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: safeComment }}
      className="user-com

#### 14.1.2 内容安全策略(CSP)
```html
<!-- 在index.html中设置CSP头 -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://trusted-cdn.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               img-src 'self' data: https:; 
               font-src 'self' https://fonts.gstatic.com; 
               connect-src 'self' https://api.moviesite.com; 
               frame-src 'none'; 
               object-src 'none';">
```

```typescript
// CSP配置管理
export const cspConfig = {
  development: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"],
    'connect-src': ["'self'", "ws:", "wss:"]
  },
  production: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "https://trusted-cdn.com"],
    'style-src': ["'self'", "https://fonts.googleapis.com"],
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'connect-src': ["'self'", "https://api.moviesite.com"],
    'frame-src': ["'none'"],
    'object-src': ["'none'"]
  }
};
```

#### 12.1.3 React安全最佳实践
```typescript
// 避免使用dangerouslySetInnerHTML，使用安全的替代方案
const SafeHtmlRenderer: React.FC<{ content: string }> = ({ content }) => {
  // 使用React的默认转义机制
  return <div>{content}</div>;
};

// 如果必须使用dangerouslySetInnerHTML，确保内容已被清理
const SafeDangerousHtml: React.FC<{ html: string }> = ({ html }) => {
  const sanitizedHtml = useMemo(() => DOMPurify.sanitize(html), [html]);
  
  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
  );
};

// 安全的链接处理
const SafeLink: React.FC<{ href: string; children: React.ReactNode }> = ({ 
  href, 
  children 
}) => {
  const isExternalLink = href.startsWith('http') && !href.includes(window.location.hostname);
  
  return (
    <a 
      href={href}
      {...(isExternalLink && {
        target: '_blank',
        rel: 'noopener noreferrer'
      })}
    >
      {children}
    </a>
  );
};
```

### 12.2 跨站请求伪造(CSRF)防护

#### 12.2.1 CSRF Token处理
```typescript
// CSRF Token管理
class CSRFTokenManager {
  private static instance: CSRFTokenManager;
  private token: string | null = null;

  static getInstance(): CSRFTokenManager {
    if (!CSRFTokenManager.instance) {
      CSRFTokenManager.instance = new CSRFTokenManager();
    }
    return CSRFTokenManager.instance;
  }

  async getToken(): Promise<string> {
    if (!this.token) {
      const response = await fetch('/api/csrf-token', {
        credentials: 'include'
      });
      const data = await response.json();
      this.token = data.token;
    }
    return this.token;
  }

  clearToken(): void {
    this.token = null;
  }
}

// API请求拦截器添加CSRF Token
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});

apiClient.interceptors.request.use(async (config) => {
  if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
    const csrfToken = await CSRFTokenManager.getInstance().getToken();
    config.headers['X-CSRF-Token'] = csrfToken;
  }
  return config;
});
```

#### 12.2.2 SameSite Cookie配置
```typescript
// Cookie安全配置
export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000 // 24小时
};

// 安全的Cookie操作工具
export const secureCookies = {
  set: (name: string, value: string, options = {}) => {
    const cookieOptions = {
      ...cookieConfig,
      ...options
    };
    
    document.cookie = `${name}=${value}; ${Object.entries(cookieOptions)
      .map(([key, val]) => `${key}=${val}`)
      .join('; ')}`;
  },

  get: (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  },

  remove: (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};
```

### 12.3 身份认证和授权安全

#### 12.3.1 JWT Token安全处理
```typescript
// JWT Token安全管理
class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  // 存储Token到HttpOnly Cookie（推荐）或安全的localStorage
  static setTokens(accessToken: string, refreshToken: string): void {
    // 优先使用HttpOnly Cookie
    if (this.supportsHttpOnlyCookies()) {
      // 通过API设置HttpOnly Cookie
      fetch('/api/auth/set-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken }),
        credentials: 'include'
      });
    } else {
      // 降级到安全的localStorage
      const encryptedAccessToken = this.encrypt(accessToken);
      const encryptedRefreshToken = this.encrypt(refreshToken);
      
      localStorage.setItem(this.ACCESS_TOKEN_KEY, encryptedAccessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, encryptedRefreshToken);
    }
  }

  static getAccessToken(): string | null {
    if (this.supportsHttpOnlyCookies()) {
      // 从HttpOnly Cookie获取（通过API）
      return null; // 由后端处理
    } else {
      const encrypted = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      return encrypted ? this.decrypt(encrypted) : null;
    }
  }

  static clearTokens(): void {
    if (this.supportsHttpOnlyCookies()) {
      fetch('/api/auth/clear-tokens', {
        method: 'POST',
        credentials: 'include'
      });
    } else {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  private static encrypt(text: string): string {
    // 使用Web Crypto API进行加密
    // 这里简化处理，实际应用中应使用更强的加密
    return btoa(text);
  }

  private static decrypt(encryptedText: string): string {
    return atob(encryptedText);
  }

  private static supportsHttpOnlyCookies(): boolean {
    // 检查是否支持HttpOnly Cookie
    return typeof document !== 'undefined' && 'cookie' in document;
  }
}

// Token自动刷新机制
class TokenRefreshManager {
  private refreshTimer: NodeJS.Timeout | null = null;

  startAutoRefresh(tokenExpiryTime: number): void {
    const refreshTime = tokenExpiryTime - Date.now() - 5 * 60 * 1000; // 提前5分钟刷新
    
    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(async () => {
        try {
          await this.refreshToken();
        } catch (error) {
          console.error('Token refresh failed:', error);
          // 重定向到登录页
          window.location.href = '/login';
        }
      }, refreshTime);
    }
  }

  stopAutoRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private async refreshToken(): Promise<void> {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });

    if (response.ok) {
      const { accessToken, refreshToken, expiryTime } = await response.json();
      TokenManager.setTokens(accessToken, refreshToken);
      this.startAutoRefresh(expiryTime);
    } else {
      throw new Error('Token refresh failed');
    }
  }
}
```

#### 12.3.2 权限验证组件
```typescript
// 权限验证HOC
interface WithAuthProps {
  requiredPermissions?: string[];
  requiredRoles?: string[];
  fallback?: React.ComponentType;
}

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthProps = {}
) => {
  return (props: P) => {
    const { user, permissions, roles } = useAuth();
    const { requiredPermissions = [], requiredRoles = [], fallback: Fallback } = options;

    // 检查用户是否已登录
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    // 检查权限
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      permissions.includes(permission)
    );

    // 检查角色
    const hasRequiredRoles = requiredRoles.every(role =>
      roles.includes(role)
    );

    if (!hasRequiredPermissions || !hasRequiredRoles) {
      return Fallback ? <Fallback /> : <div>访问被拒绝</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

// 使用示例
const AdminPanel = withAuth(AdminPanelComponent, {
  requiredRoles: ['admin'],
  requiredPermissions: ['admin.read', 'admin.write'],
  fallback: UnauthorizedComponent
});
```

### 12.4 数据传输安全

#### 12.4.1 HTTPS强制和安全头
```typescript
// 安全头配置
export const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// HTTPS重定向检查
const enforceHTTPS = (): void => {
  if (process.env.NODE_ENV === 'production' && location.protocol !== 'https:') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
};

// 在应用启动时调用
enforceHTTPS();
```

#### 12.4.2 敏感数据加密
```typescript
// 前端数据加密工具
class DataEncryption {
  private static async generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(data: string, key: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      dataBuffer
    );

    const encryptedArray = new Uint8Array(encrypted);
    const result = new Uint8Array(iv.length + encryptedArray.length);
    result.set(iv);
    result.set(encryptedArray, iv.length);

    return btoa(String.fromCharCode(...result));
  }

  static async decrypt(encryptedData: string, key: CryptoKey): Promise<string> {
    const data = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(char => char.charCodeAt(0))
    );

    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }
}

// 敏感表单数据处理
const SecureForm: React.FC = () => {
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);

  useEffect(() => {
    DataEncryption.generateKey().then(setEncryptionKey);
  }, []);

  const handleSensitiveSubmit = async (formData: FormData) => {
    if (!encryptionKey) return;

    const sensitiveFields = ['password', 'creditCard', 'ssn'];
    const encryptedData: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (sensitiveFields.includes(key)) {
        encryptedData[key] = await DataEncryption.encrypt(value.toString(), encryptionKey);
      } else {
        encryptedData[key] = value.toString();
      }
    }

    // 发送加密数据
    await apiClient.post('/api/secure-endpoint', encryptedData);
  };

  return (
    <form onSubmit={handleSensitiveSubmit}>
      {/* 表单字段 */}
    </form>
  );
};
```

### 12.5 第三方依赖安全

#### 12.5.1 依赖安全扫描
```json
// package.json中的安全脚本
{
  "scripts": {
    "security:audit": "npm audit",
    "security:fix": "npm audit fix",
    "security:check": "npm audit --audit-level moderate",
    "security:snyk": "snyk test",
    "security:deps": "depcheck"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run security:check"
    }
  }
}
```

#### 12.5.2 子资源完整性(SRI)
```html
<!-- 对外部资源使用SRI -->
<script 
  src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"
  integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We"
  crossorigin="anonymous">
</script>

<link 
  rel="stylesheet" 
  href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.0/dist/tailwind.min.css"
  integrity="sha384-9ndCyUa/9EM4+1+XeY+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2+2"
  crossorigin="anonymous">
```

### 12.6 错误处理和日志安全

#### 12.6.1 安全的错误处理
```typescript
// 安全的错误处理器
class SecureErrorHandler {
  static handleError(error: Error, context?: string): void {
    // 过滤敏感信息
    const sanitizedError = this.sanitizeError(error);
    
    // 记录到安全日志
    this.logSecurely(sanitizedError, context);
    
    // 向用户显示安全的错误信息
    this.showUserFriendlyError(sanitizedError);
  }

  private static sanitizeError(error: Error): Error {
    const sensitivePatterns = [
      /password/gi,
      /token/gi,
      /key/gi,
      /secret/gi,
      /api[_-]?key/gi,
      /auth/gi
    ];

    let message = error.message;
    let stack = error.stack || '';

    sensitivePatterns.forEach(pattern => {
      message = message.replace(pattern, '[REDACTED]');
      stack = stack.replace(pattern, '[REDACTED]');
    });

    const sanitizedError = new Error(message);
    sanitizedError.stack = stack;
    return sanitizedError;
  }

  private static logSecurely(error: Error, context?: string): void {
    const logData = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId() // 不记录敏感用户信息
    };

    // 发送到安全日志服务
    fetch('/api/logs/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
      credentials: 'include'
    }).catch(() => {
      // 静默处理日志发送失败
    });
  }

  private static showUserFriendlyError(error: Error): void {
    const userMessage = this.getUserFriendlyMessage(error);
    // 显示用户友好的错误信息
    toast.error(userMessage);
  }

  private static getUserFriendlyMessage(error: Error): string {
    // 将技术错误转换为用户友好的消息
    const errorMappings: Record<string, string> = {
      'Network Error': '网络连接失败，请检查网络设置',
      'Unauthorized': '登录已过期，请重新登录',
      'Forbidden': '您没有权限执行此操作',
      'Not Found': '请求的资源不存在',
      'Internal Server Error': '服务器内部错误，请稍后重试'
    };

    return errorMappings[error.message] || '操作失败，请稍后重试';
  }

  private static getCurrentUserId(): string | null {
    // 返回非敏感的用户标识
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || null;
  }
}

// 全局错误边界
class SecurityErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    SecureErrorHandler.handleError(error, 'React Error Boundary');
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>出现了一些问题</h2>
          <p>我们已经记录了这个错误，请刷新页面重试。</p>
          <button onClick={() => window.location.reload()}>
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 12.7 安全配置检查清单

#### 12.7.1 开发环境安全检查
```typescript
// 安全配置验证
const securityChecklist = {
  // 环境变量检查
  checkEnvironmentVariables: (): boolean => {
    const requiredEnvVars = [
      'REACT_APP_API_URL',
      'REACT_APP_ENVIRONMENT'
    ];

    const missingVars = requiredEnvVars.filter(
      varName => !process.env[varName]
    );

    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars);
      return false;
    }

    return true;
  },

  // 生产环境检查
  checkProductionSecurity: (): boolean => {
    if (process.env.NODE_ENV === 'production') {
      // 检查是否启用了开发工具
      if (process.env.REACT_APP_ENABLE_DEVTOOLS === 'true') {
        console.warn('Development tools should be disabled in production');
        return false;
      }

      // 检查是否使用HTTPS
      if (location.protocol !== 'https:') {
        console.error('HTTPS is required in production');
        return false;
      }

      // 检查CSP头是否存在
      const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
      if (metaTags.length === 0) {
        console.warn('CSP header is missing');
        return false;
      }
    }

    return true;
  },

  // 依赖安全检查
  checkDependencySecurity: async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/security/dependencies');
      const securityReport = await response.json();
      
      if (securityReport.vulnerabilities > 0) {
        console.warn(`Found ${securityReport.vulnerabilities} security vulnerabilities`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to check dependency security:', error);
      return false;
    }
  }
};

// 应用启动时运行安全检查
const runSecurityChecks = async (): Promise<void> => {
  const checks = [
    securityChecklist.checkEnvironmentVariables(),
    securityChecklist.checkProductionSecurity(),
    await securityChecklist.checkDependencySecurity()
  ];

  const allPassed = checks.every(check => check);
  
  if (!allPassed) {
    console.error('Security checks failed. Please review the issues above.');
  } else {
    console.log('All security checks passed.');
  }
};

// 在应用初始化时调用
runSecurityChecks();
```

### 12.8 安全监控和报告

#### 12.8.1 安全事件监控
```typescript
// 安全事件监控
class SecurityMonitor {
  private static instance: SecurityMonitor;
  private eventQueue: SecurityEvent[] = [];

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  // 记录安全事件
  logSecurityEvent(event: SecurityEvent): void {
    this.eventQueue.push({
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent
    });

    // 立即发送高危事件
    if (event.severity === 'high') {
      this.sendEventImmediately(event);
    }

    // 批量发送其他事件
    this.scheduleBatchSend();
  }

  // 监控可疑活动
  monitorSuspiciousActivity(): void {
    // 监控多次失败的登录尝试
    let failedLoginAttempts = 0;
    const maxAttempts = 5;

    document.addEventListener('loginFailed', () => {
      failedLoginAttempts++;
      
      if (failedLoginAttempts >= maxAttempts) {
        this.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'high',
          description: 'Multiple failed login attempts detected',
          metadata: { attempts: failedLoginAttempts }
        });
      }
    });

    // 监控异常的API调用
    this.monitorAPIAnomalies();

    // 监控DOM操作异常
    this.monitorDOMManipulation();
  }

  private monitorAPIAnomalies(): void {
    const apiCallCounts = new Map<string, number>();
    const timeWindow = 60000; // 1分钟
    const maxCallsPerMinute = 100;

    // 拦截fetch请求
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0].toString();
      const count = apiCallCounts.get(url) || 0;
      apiCallCounts.set(url, count + 1);

      if (count > maxCallsPerMinute) {
        this.logSecurityEvent({
          type: 'api_abuse',
          severity: 'medium',
          description: 'Excessive API calls detected',
          metadata: { url, count }
        });
      }

      return originalFetch.apply(this, args);
    };

    // 定期清理计数
    setInterval(() => {
      apiCallCounts.clear();
    }, timeWindow);
  }

  private monitorDOMManipulation(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // 检测可疑的脚本注入
              if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-approved')) {
                this.logSecurityEvent({
                  type: 'script_injection',
                  severity: 'high',
                  description: 'Unapproved script element detected',
                  metadata: { 
                    src: element.getAttribute('src'),
                    content: element.textContent?.substring(0, 100)
                  }
                });
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private async sendEventImmediately(event: SecurityEvent): Promise<void> {
    try {
      await fetch('/api/security/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        credentials: 'include'
      });
    } catch (error) {
      console.error('Failed to send security event:', error);
    }
  }

  private scheduleBatchSend(): void {
    // 实现批量发送逻辑
    setTimeout(() => {
      if (this.eventQueue.length > 0) {
        this.sendEventsBatch();
      }
    }, 5000); // 5秒后发送
  }

  private async sendEventsBatch(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await fetch('/api/security/events/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(events),
        credentials: 'include'
      });
    } catch (error) {
      console.error('Failed to send security events batch:', error);
      // 重新加入队列
      this.eventQueue.unshift(...events);
    }
  }

  private getSessionId(): string {
    return sessionStorage.getItem('sessionId') || 'unknown';
  }
}

interface SecurityEvent {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  metadata?: Record<string, any>;
  timestamp?: string;
  sessionId?: string;
  userAgent?: string;
}

// 初始化安全监控
const securityMonitor = SecurityMonitor.getInstance();
securityMonitor.monitorSuspiciousActivity();
```

### 12.9 下载网站特定安全规范

#### 12.9.1 内容安全防护

##### 防盗链保护
```typescript
// 防盗链验证器
class AntiLeechValidator {
  private static readonly ALLOWED_DOMAINS = [
    'moviesite.com',
    'www.moviesite.com',
    'cdn.moviesite.com'
  ];

  private static readonly ALLOWED_REFERRERS = [
    'https://moviesite.com',
    'https://www.moviesite.com'
  ];

  // 验证请求来源
  static validateRequest(request: Request): boolean {
    const referer = request.headers.get('referer');
    const origin = request.headers.get('origin');

    // 检查来源域名
    if (referer && !this.isValidReferer(referer)) {
      return false;
    }

    if (origin && !this.isValidOrigin(origin)) {
      return false;
    }

    return true;
  }

  private static isValidReferer(referer: string): boolean {
    try {
      const url = new URL(referer);
      return this.ALLOWED_DOMAINS.includes(url.hostname);
    } catch {
      return false;
    }
  }

  private static isValidOrigin(origin: string): boolean {
    try {
      const url = new URL(origin);
      return this.ALLOWED_DOMAINS.includes(url.hostname);
    } catch {
      return false;
    }
  }

  // 生成防盗链令牌
  static generateLeechToken(resourcePath: string, userId?: string): string {
    const timestamp = Date.now();
    const secret = process.env.REACT_APP_ANTI_LEECH_SECRET;

    const data = {
      path: resourcePath,
      timestamp,
      userId: userId || 'anonymous'
    };

    const tokenData = JSON.stringify(data);
    const signature = btoa(tokenData) + '.' + this.hashSignature(tokenData, secret);

    return btoa(signature);
  }

  // 验证防盗链令牌
  static validateLeechToken(token: string, resourcePath: string): boolean {
    try {
      const decoded = atob(token);
      const [data, signature] = decoded.split('.');
      const secret = process.env.REACT_APP_ANTI_LEECH_SECRET;

      const expectedSignature = this.hashSignature(data, secret);

      if (signature !== expectedSignature) {
        return false;
      }

      const tokenData = JSON.parse(atob(data));
      const now = Date.now();
      const tokenAge = now - tokenData.timestamp;
      const maxAge = 5 * 60 * 1000; // 5分钟有效期

      return tokenAge < maxAge && tokenData.path === resourcePath;
    } catch {
      return false;
    }
  }

  private static hashSignature(data: string, secret: string): string {
    // 简化的哈希实现，实际应用中应使用更强的加密算法
    return btoa(data + secret).slice(0, 16);
  }
}

// 安全的下载链接生成器
class SecureDownloadLinkGenerator {
  // 生成临时下载链接
  static generateSecureDownloadUrl(
    movieId: string,
    quality: string,
    userId: string,
    expiresIn: number = 3600 // 1小时有效期
  ): string {
    const timestamp = Date.now();
    const expiry = timestamp + expiresIn * 1000;

    const tokenData = {
      movieId,
      quality,
      userId,
      timestamp,
      expiry
    };

    const signature = this.signToken(tokenData);
    const encodedData = btoa(JSON.stringify(tokenData));

    return `/api/download/${encodedData}.${signature}`;
  }

  // 验证下载链接
  static validateDownloadUrl(token: string): {
    valid: boolean;
    movieId?: string;
    quality?: string;
    userId?: string;
    error?: string;
  } {
    try {
      const [encodedData, signature] = token.split('.');
      const tokenData = JSON.parse(atob(encodedData));

      // 验证签名
      if (signature !== this.signToken(tokenData)) {
        return { valid: false, error: 'Invalid signature' };
      }

      // 验证过期时间
      if (Date.now() > tokenData.expiry) {
        return { valid: false, error: 'Link expired' };
      }

      return {
        valid: true,
        movieId: tokenData.movieId,
        quality: tokenData.quality,
        userId: tokenData.userId
      };
    } catch (error) {
      return { valid: false, error: 'Invalid token format' };
    }
  }

  private static signToken(data: any): string {
    const secret = process.env.REACT_APP_DOWNLOAD_SECRET;
    const dataString = JSON.stringify(data);
    return btoa(dataString + secret).slice(0, 32);
  }
}
```

#### 12.9.2 用户隐私保护

##### 下载历史隐私管理
```typescript
// 隐私保护管理器
class PrivacyProtectionManager {
  private static readonly PRIVACY_SETTINGS_KEY = 'user-privacy-settings';
  private static readonly DOWNLOAD_HISTORY_KEY = 'download-history';

  // 隐私设置接口
  interface PrivacySettings {
    saveDownloadHistory: boolean;
    shareDownloadStats: boolean;
    enableAnalytics: boolean;
    retentionDays: number;
    autoCleanup: boolean;
  }

  // 获取用户隐私设置
  static getPrivacySettings(): PrivacySettings {
    const defaultSettings: PrivacySettings = {
      saveDownloadHistory: true,
      shareDownloadStats: false,
      enableAnalytics: false,
      retentionDays: 30,
      autoCleanup: true
    };

    try {
      const stored = localStorage.getItem(this.PRIVACY_SETTINGS_KEY);
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  // 安全地记录下载历史
  static recordDownloadHistory(download: DownloadRecord): void {
    const settings = this.getPrivacySettings();

    if (!settings.saveDownloadHistory) {
      return;
    }

    // 加密敏感信息
    const encryptedRecord = this.encryptDownloadRecord(download);

    try {
      const history = this.getDownloadHistory();
      history.push(encryptedRecord);

      // 应用保留期限
      const filteredHistory = this.applyRetentionPolicy(history, settings.retentionDays);

      localStorage.setItem(this.DOWNLOAD_HISTORY_KEY, JSON.stringify(filteredHistory));
    } catch (error) {
      console.error('Failed to record download history:', error);
    }
  }

  // 清理过期数据
  static cleanupExpiredData(): void {
    const settings = this.getPrivacySettings();
    const history = this.getDownloadHistory();

    const filteredHistory = this.applyRetentionPolicy(history, settings.retentionDays);

    if (filteredHistory.length !== history.length) {
      localStorage.setItem(this.DOWNLOAD_HISTORY_KEY, JSON.stringify(filteredHistory));
    }
  }

  private static encryptDownloadRecord(record: DownloadRecord): any {
    // 简化的加密实现，实际应用中应使用更强的加密
    return {
      ...record,
      title: btoa(record.title),
      userId: record.userId ? btoa(record.userId) : null,
      timestamp: record.timestamp
    };
  }

  private static applyRetentionPolicy(history: DownloadRecord[], retentionDays: number): DownloadRecord[] {
    const cutoffDate = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
    return history.filter(record => record.timestamp > cutoffDate);
  }
}

// 下载权限管理
class DownloadPermissionManager {
  // 检查下载权限
  static async checkDownloadPermission(
    userId: string,
    movieId: string,
    quality: string
  ): Promise<{
    allowed: boolean;
    reason?: string;
    remainingQuota?: number;
  }> {
    try {
      const response = await fetch('/api/downloads/check-permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, movieId, quality })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Permission check failed:', error);
    }

    return { allowed: false, reason: 'Permission check failed' };
  }
}

interface DownloadRecord {
  id: string;
  title: string;
  quality: string;
  size: number;
  timestamp: number;
  userId?: string;
  completed: boolean;
}
```

## 16. Git提交规范

### 13.1 提交信息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 13.2 提交类型
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建工具或辅助工具的变动

## 17. 代码审查规范

### 14.1 审查要点
- 代码规范性
- 性能问题
- 安全问题
- 可维护性

### 14.2 审查流程
- 提交Pull Request
- 代码审查
- 测试验证
- 合并代码

## 18. 开发体验优化

### 15.1 Storybook集成

#### 15.1.1 Storybook配置
```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
    '@storybook/addon-docs'
  ],
  framework: '@storybook/react-vite',
  docs: {
    autodocs: 'tag'
  },
  features: {
    emotionAlias: false,
    buildStoriesJson: true,
    storyStoreV7: true
  }
};

export default config;
```

#### 15.1.2 组件故事编写规范
```typescript
// MovieCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MovieCard } from './MovieCard';

const meta = {
  title: 'Components/Molecules/MovieCard',
  component: MovieCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '影片卡片组件，用于展示影片信息和基本操作'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    movie: {
      description: '影片数据对象',
      control: 'object'
    },
    onSelect: {
      description: '选择影片时的回调函数',
      action: 'selected'
    },
    onDownload: {
      description: '下载影片时的回调函数',
      action: 'downloaded'
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: '卡片显示变体'
    }
  }
} satisfies Meta<typeof MovieCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// 默认故事
export const Default: Story = {
  args: {
    movie: {
      id: '1',
      title: '阿凡达：水之道',
      poster: 'https://example.com/poster1.jpg',
      rating: 8.5,
      year: 2022,
      genre: ['科幻', '动作'],
      duration: '192分钟',
      description: '杰克·萨利一家在潘多拉星球上的新冒险。'
    },
    variant: 'default'
  }
};

// 紧凑型变体
export const Compact: Story = {
  args: {
    ...Default.args,
    variant: 'compact'
  }
};

// 详细型变体
export const Detailed: Story = {
  args: {
    ...Default.args,
    variant: 'detailed'
  }
};

// 加载状态
export const Loading: Story = {
  args: {
    movie: null,
    variant: 'default'
  }
};

// 错误状态
export const Error: Story = {
  args: {
    movie: null,
    variant: 'default',
    error: '加载失败'
  }
};

// 长标题测试
export const LongTitle: Story = {
  args: {
    ...Default.args,
    movie: {
      ...Default.args!.movie,
      title: '这是一个非常非常长的影片标题，用来测试组件在不同长度标题下的显示效果和布局适应性'
    }
  }
};

// 无海报图片
export const NoPoster: Story = {
  args: {
    ...Default.args,
    movie: {
      ...Default.args!.movie,
      poster: ''
    }
  }
};
```

#### 15.1.3 设计令牌集成
```typescript
// .storybook/preview.ts
import type { Preview } from '@storybook/react';
import { theme } from '../src/styles/theme';

const preview: Preview = {
  parameters: {
    docs: {
      toc: true
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: theme.colors.background.primary,
        },
        {
          name: 'dark',
          value: theme.colors.background.dark,
        },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
```

### 15.2 开发工具配置

#### 15.2.1 Zustand DevTools集成
```typescript
// src/store/store-devtools.ts
import { devtools } from 'zustand/middleware';

// 开发环境下启用DevTools
export const withDevTools = <T>(storeName: string) => {
  if (process.env.NODE_ENV === 'development') {
    return devtools(storeName, {
      name: `MovieApp-${storeName}`,
      serialize: true,
      trace: true
    });
  }
  return (f: any) => f;
};

// 使用示例
export const useMovieStore = create<MovieState>()(
  withDevTools('movie-store')(
    devtools(
      (set, get) => ({
        // store implementation
      }),
      {
        name: 'movie-store',
        trace: true
      }
    )
  )
);
```

#### 15.2.2 性能监控集成
```typescript
// src/utils/performance-monitor.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // 测量组件渲染时间
  measureRender<T>(
    componentName: string,
    renderFn: () => T
  ): T {
    const startMark = `${componentName}-render-start`;
    const endMark = `${componentName}-render-end`;
    const measureName = `${componentName}-render`;

    performance.mark(startMark);

    const result = renderFn();

    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);

    // 记录指标
    const measure = performance.getEntriesByName(measureName, 'measure')[0];
    this.recordMetric(componentName, measure.duration);

    // 清理标记
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(measureName);

    return result;
  }

  // 测量API调用时间
  async measureApiCall<T>(
    apiName: string,
    apiCall: () => Promise<T>
  ): Promise<T> {
    const startMark = `${apiName}-api-start`;
    const endMark = `${apiName}-api-end`;
    const measureName = `${apiName}-api`;

    performance.mark(startMark);

    try {
      const result = await apiCall();

      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);

      const measure = performance.getEntriesByName(measureName, 'measure')[0];
      this.recordMetric(`api-${apiName}`, measure.duration);

      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(measureName);

      return result;
    } catch (error) {
      performance.clearMarks(startMark);
      throw error;
    }
  }

  // 记录自定义指标
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const values = this.metrics.get(name)!;
    values.push(value);

    // 只保留最近100个测量值
    if (values.length > 100) {
      values.shift();
    }

    // 在开发环境下输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`);
    }
  }

  // 获取性能统计
  getMetricStats(name: string): {
    avg: number;
    min: number;
    max: number;
    count: number;
  } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) {
      return null;
    }

    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      avg: Math.round(avg * 100) / 100,
      min,
      max,
      count: values.length
    };
  }

  // 获取所有性能报告
  getPerformanceReport(): Record<string, any> {
    const report: Record<string, any> = {};

    for (const [name] of this.metrics) {
      report[name] = this.getMetricStats(name);
    }

    return report;
  }
}

// React Hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const monitor = PerformanceMonitor.getInstance();

  return {
    measureRender: <T>(renderFn: () => T) =>
      monitor.measureRender(componentName, renderFn),
    measureApiCall: <T>(apiName: string, apiCall: () => Promise<T>) =>
      monitor.measureApiCall(apiName, apiCall),
    recordMetric: (name: string, value: number) =>
      monitor.recordMetric(`${componentName}-${name}`, value)
  };
};
```

#### 15.2.3 热模块替换优化
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // 启用Fast Refresh
      fastRefresh: true,
      // 开发时保留组件名称
      jsxImportSource: '@emotion/react'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/presentation/components'),
      '@pages': resolve(__dirname, 'src/presentation/pages'),
      '@hooks': resolve(__dirname, 'src/application/hooks'),
      '@store': resolve(__dirname, 'src/application/store'),
      '@utils': resolve(__dirname, 'src/shared/utils'),
      '@types': resolve(__dirname, 'src/shared/types')
    }
  },
  server: {
    port: 3000,
    open: true,
    // 启用HMR overlay
    hmr: {
      overlay: true
    },
    // 代理API请求
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    // 开发环境下启用source map
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        // 代码分割优化
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
          utils: ['date-fns', 'clsx']
        }
      }
    }
  },
  optimizeDeps: {
    // 预构建依赖
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      '@tanstack/react-query',
      '@headlessui/react',
      'date-fns'
    ]
  }
});
```

### 15.3 调试工具集成

#### 15.3.1 React DevTools Profiler集成
```typescript
// src/utils/profiler.tsx
import { Profiler, ProfilerOnRenderCallback } from 'react';

interface PerformanceData {
  id: string;
  phase: 'mount' | 'update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
}

// 性能数据收集器
class PerformanceDataCollector {
  private static instance: PerformanceDataCollector;
  private data: PerformanceData[] = [];

  static getInstance(): PerformanceDataCollector {
    if (!PerformanceDataCollector.instance) {
      PerformanceDataCollector.instance = new PerformanceDataCollector();
    }
    return PerformanceDataCollector.instance;
  }

  addData(data: PerformanceData): void {
    this.data.push(data);

    // 只保留最近100条记录
    if (this.data.length > 100) {
      this.data.shift();
    }

    // 在开发环境下输出性能警告
    if (process.env.NODE_ENV === 'development' && data.actualDuration > 16) {
      console.warn(
        `Slow render detected in ${data.id}: ${data.actualDuration.toFixed(2)}ms`
      );
    }
  }

  getData(): PerformanceData[] {
    return [...this.data];
  }

  clear(): void {
    this.data = [];
  }

  getAverageRenderTime(id: string): number | null {
    const renderData = this.data.filter(d => d.id === id);
    if (renderData.length === 0) return null;

    const totalTime = renderData.reduce((sum, d) => sum + d.actualDuration, 0);
    return totalTime / renderData.length;
  }
}

// 高性能组件包装器
export const PerformanceProfiler: React.FC<{
  id: string;
  children: React.ReactNode;
}> = ({ id, children }) => {
  const collector = PerformanceDataCollector.getInstance();

  const onRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    collector.addData({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime
    });
  };

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  );
};

// 使用Hook简化性能监控
export const useProfiler = (componentName: string) => {
  return {
    wrap: (children: React.ReactNode) => (
      <PerformanceProfiler id={componentName}>
        {children}
      </PerformanceProfiler>
    ),
    getAverageRenderTime: () => {
      return PerformanceDataCollector.getInstance().getAverageRenderTime(componentName);
    }
  };
};
```

#### 15.3.2 状态调试工具
```typescript
// src/utils/store-debug.ts
export class StoreDebugger {
  private static instance: StoreDebugger;
  private subscribers: Map<string, Set<Function>> = new Map();

  static getInstance(): StoreDebugger {
    if (!StoreDebugger.instance) {
      StoreDebugger.instance = new StoreDebugger();
    }
    return StoreDebugger.instance;
  }

  // 订阅状态变化
  subscribe(storeName: string, callback: Function): () => void {
    if (!this.subscribers.has(storeName)) {
      this.subscribers.set(storeName, new Set());
    }

    const callbacks = this.subscribers.get(storeName)!;
    callbacks.add(callback);

    // 返回取消订阅函数
    return () => {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.subscribers.delete(storeName);
      }
    };
  }

  // 通知状态变化
  notify(storeName: string, newState: any, prevState: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔄 ${storeName} State Update`);
      console.log('Previous:', prevState);
      console.log('Current:', newState);
      console.groupEnd();
    }

    const callbacks = this.subscribers.get(storeName);
    if (callbacks) {
      callbacks.forEach(callback => callback(newState, prevState));
    }
  }

  // 创建Zustand中间件
  createDebugMiddleware(storeName: string) {
    return (set: Function, get: Function) => {
      return (...args: any[]) => {
        const prevState = get();
        set(...args);
        const newState = get();
        this.notify(storeName, newState, prevState);
      };
    };
  }

  // 导出状态快照
  exportSnapshot(): string {
    const snapshot: Record<string, any> = {};

    for (const [storeName] of this.subscribers) {
      // 这里需要根据实际情况获取store状态
      // snapshot[storeName] = getStoreState(storeName);
    }

    return JSON.stringify(snapshot, null, 2);
  }

  // 导入状态快照
  importSnapshot(snapshot: string): void {
    try {
      const data = JSON.parse(snapshot);

      for (const [storeName, state] of Object.entries(data)) {
        // 这里需要根据实际情况设置store状态
        // setStoreState(storeName, state);
      }
    } catch (error) {
      console.error('Failed to import snapshot:', error);
    }
  }
}

// 全局状态调试Hook
export const useStoreDebugger = (storeName: string) => {
  const debugger = StoreDebugger.getInstance();

  return {
    subscribe: (callback: Function) => debugger.subscribe(storeName, callback),
    exportSnapshot: () => debugger.exportSnapshot(),
    importSnapshot: (snapshot: string) => debugger.importSnapshot(snapshot)
  };
};
```

### 15.4 自动化文档生成

#### 15.4.1 组件文档自动生成
```typescript
// scripts/generate-component-docs.ts
import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import * as path from 'path';
import * as ts from 'typescript';

interface ComponentDoc {
  name: string;
  description: string;
  props: PropDoc[];
  examples: string[];
}

interface PropDoc {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

class ComponentDocGenerator {
  async generateDocs(): Promise<void> {
    const componentFiles = await glob('src/**/components/**/*.tsx');
    const docs: ComponentDoc[] = [];

    for (const file of componentFiles) {
      const doc = await this.parseComponentFile(file);
      if (doc) {
        docs.push(doc);
      }
    }

    await this.writeDocumentation(docs);
  }

  private async parseComponentFile(filePath: string): Promise<ComponentDoc | null> {
    const content = await readFile(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest
    );

    // 解析组件信息
    const component = this.extractComponentInfo(sourceFile);
    if (!component) return null;

    return component;
  }

  private extractComponentInfo(sourceFile: ts.SourceFile): ComponentDoc | null {
    // 这里需要实现具体的AST解析逻辑
    // 提取组件名称、props、JSDoc注释等
    return null;
  }

  private async writeDocumentation(docs: ComponentDoc[]): Promise<void> {
    const markdown = this.generateMarkdown(docs);
    await writeFile('docs/components.md', markdown);
  }

  private generateMarkdown(docs: ComponentDoc[]): string {
    let markdown = '# 组件文档\n\n';

    for (const doc of docs) {
      markdown += `## ${doc.name}\n\n`;
      markdown += `${doc.description}\n\n`;

      if (doc.props.length > 0) {
        markdown += '### Props\n\n';
        markdown += '| 属性 | 类型 | 必填 | 默认值 | 描述 |\n';
        markdown += '|------|------|------|--------|------|\n';

        for (const prop of doc.props) {
          markdown += `| ${prop.name} | \`${prop.type}\` | ${prop.required ? '✓' : '✗'} | ${prop.defaultValue || '-'} | ${prop.description} |\n`;
        }
        markdown += '\n';
      }

      if (doc.examples.length > 0) {
        markdown += '### 示例\n\n';
        for (const example of doc.examples) {
          markdown += '```tsx\n';
          markdown += example;
          markdown += '\n```\n\n';
        }
      }

      markdown += '---\n\n';
    }

    return markdown;
  }
}

// 运行文档生成
const generator = new ComponentDocGenerator();
generator.generateDocs().catch(console.error);
```

## 19. DDD项目结构规范

### 16.1 整体架构结构
```
MovieFront/
├── public/                          # 静态资源
├── src/
│   ├── presentation/                # 表现层 (UI层)
│   │   ├── components/              # UI组件
│   │   │   ├── atoms/              # 原子组件 (按钮、输入框等)
│   │   │   ├── molecules/          # 分子组件 (搜索框、卡片等)
│   │   │   ├── organisms/          # 有机体组件 (导航栏、列表等)
│   │   │   └── templates/          # 模板组件 (页面布局)
│   │   ├── pages/                  # 页面组件
│   │   │   ├── auth/              # 认证相关页面
│   │   │   ├── movies/            # 影片相关页面
│   │   │   ├── downloads/         # 下载相关页面
│   │   │   ├── messages/          # 消息相关页面
│   │   │   └── admin/             # 管理后台页面
│   │   └── layouts/               # 布局组件
│   │       ├── AuthLayout.tsx     # 认证布局
│   │       ├── UserLayout.tsx     # 用户布局
│   │       └── AdminLayout.tsx    # 管理员布局
│   ├── application/                # 应用层 (用例服务)
│   │   ├── services/              # 应用服务
│   │   │   ├── AuthService.ts     # 认证应用服务
│   │   │   ├── MovieService.ts    # 影片应用服务
│   │   │   ├── DownloadService.ts # 下载应用服务
│   │   │   ├── MessageService.ts  # 消息应用服务
│   │   │   └── AdminService.ts    # 管理应用服务
│   │   ├── hooks/                 # 应用层Hooks
│   │   │   ├── useAuth.ts         # 认证相关Hook
│   │   │   ├── useMovies.ts       # 影片相关Hook
│   │   │   ├── useDownloads.ts    # 下载相关Hook
│   │   │   ├── useMessages.ts     # 消息相关Hook
│   │   │   └── useAdmin.ts        # 管理相关Hook
│   │   └── store/                 # 状态管理
│   │       ├── auth/              # 认证状态
│   │       ├── movies/            # 影片状态
│   │       ├── downloads/         # 下载状态
│   │       ├── messages/          # 消息状态
│   │       └── admin/             # 管理状态
│   ├── domain/                     # 领域层 (业务逻辑)
│   │   ├── entities/              # 实体
│   │   │   ├── User.ts            # 用户实体
│   │   │   ├── Movie.ts           # 影片实体
│   │   │   ├── Download.ts        # 下载实体
│   │   │   ├── Message.ts         # 消息实体
│   │   │   └── Admin.ts           # 管理员实体
│   │   ├── value-objects/         # 值对象
│   │   │   ├── Email.ts           # 邮箱值对象
│   │   │   ├── Password.ts        # 密码值对象
│   │   │   ├── MovieTitle.ts      # 影片标题值对象
│   │   │   └── DownloadStatus.ts  # 下载状态值对象
│   │   ├── aggregates/            # 聚合根
│   │   │   ├── UserAggregate.ts   # 用户聚合
│   │   │   ├── MovieAggregate.ts  # 影片聚合
│   │   │   ├── DownloadAggregate.ts # 下载聚合
│   │   │   ├── MessageAggregate.ts # 消息聚合
│   │   │   └── AdminAggregate.ts  # 管理聚合
│   │   ├── services/              # 领域服务
│   │   │   ├── AuthDomainService.ts # 认证领域服务
│   │   │   ├── MovieCatalogService.ts # 影片目录服务
│   │   │   ├── DownloadScheduler.ts # 下载调度服务
│   │   │   └── NotificationService.ts # 通知服务
│   │   ├── events/                # 领域事件
│   │   │   ├── UserRegistered.ts  # 用户注册事件
│   │   │   ├── MovieAdded.ts      # 影片添加事件
│   │   │   ├── DownloadStarted.ts # 下载开始事件
│   │   │   └── MessageSent.ts     # 消息发送事件
│   │   └── repositories/          # 仓储接口
│   │       ├── IUserRepository.ts # 用户仓储接口
│   │       ├── IMovieRepository.ts # 影片仓储接口
│   │       ├── IDownloadRepository.ts # 下载仓储接口
│   │       ├── IMessageRepository.ts # 消息仓储接口
│   │       └── IAdminRepository.ts # 管理仓储接口
│   ├── infrastructure/             # 基础设施层
│   │   ├── api/                   # API客户端
│   │   │   ├── auth/              # 认证API
│   │   │   ├── movies/            # 影片API
│   │   │   ├── downloads/         # 下载API
│   │   │   ├── messages/          # 消息API
│   │   │   └── admin/             # 管理API
│   │   ├── repositories/          # 仓储实现
│   │   │   ├── UserRepository.ts  # 用户仓储实现
│   │   │   ├── MovieRepository.ts # 影片仓储实现
│   │   │   ├── DownloadRepository.ts # 下载仓储实现
│   │   │   ├── MessageRepository.ts # 消息仓储实现
│   │   │   └── AdminRepository.ts # 管理仓储实现
│   │   ├── external/              # 外部服务
│   │   │   ├── FileUploadService.ts # 文件上传服务
│   │   │   ├── EmailService.ts    # 邮件服务
│   │   │   └── PaymentService.ts  # 支付服务
│   │   └── persistence/           # 数据持久化
│   │       ├── localStorage.ts    # 本地存储
│   │       ├── sessionStorage.ts  # 会话存储
│   │       └── indexedDB.ts       # 本地数据库
│   ├── shared/                    # 共享层
│   │   ├── types/                 # 通用类型定义
│   │   │   ├── common.types.ts    # 通用类型
│   │   │   ├── api.types.ts       # API类型
│   │   │   └── domain.types.ts    # 领域类型
│   │   ├── utils/                 # 工具函数
│   │   │   ├── validation.ts      # 验证工具
│   │   │   ├── formatting.ts     # 格式化工具
│   │   │   └── helpers.ts         # 辅助函数
│   │   ├── constants/             # 常量定义
│   │   │   ├── api.constants.ts   # API常量
│   │   │   ├── ui.constants.ts    # UI常量
│   │   │   └── business.constants.ts # 业务常量
│   │   └── config/                # 配置文件
│   │       ├── app.config.ts      # 应用配置
│   │       ├── api.config.ts      # API配置
│   │       └── theme.config.ts    # 主题配置
│   ├── assets/                    # 静态资源
│   │   ├── images/                # 图片资源
│   │   ├── icons/                 # 图标资源
│   │   └── fonts/                 # 字体资源
│   └── styles/                    # 全局样式
│       ├── globals.css            # 全局样式
│       ├── variables.css          # CSS变量
│       └── components.css         # 组件样式
├── tests/                         # 测试文件
│   ├── unit/                      # 单元测试
│   ├── integration/               # 集成测试
│   └── e2e/                       # 端到端测试
├── docs/                          # 文档
├── .env.example                   # 环境变量示例
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

### 16.2 DDD分层说明

#### 16.2.1 表现层 (Presentation Layer)
- **职责**: 处理用户界面和用户交互
- **组件**: React组件、页面、布局
- **原则**: 只负责UI展示，不包含业务逻辑

#### 16.2.2 应用层 (Application Layer)
- **职责**: 协调领域对象执行用例
- **组件**: 应用服务、Hooks、状态管理
- **原则**: 编排业务流程，不包含业务规则

#### 16.2.3 领域层 (Domain Layer)
- **职责**: 包含业务逻辑和业务规则
- **组件**: 实体、值对象、聚合、领域服务、领域事件
- **原则**: 独立于技术实现，纯业务逻辑

#### 16.2.4 基础设施层 (Infrastructure Layer)
- **职责**: 提供技术实现和外部服务
- **组件**: API客户端、仓储实现、外部服务集成
- **原则**: 实现领域层定义的接口

## 20. 开发工具配置

### 17.1 ESLint配置
- Airbnb配置
- TypeScript支持
- React规则

### 17.2 Prettier配置
- 代码格式化
- 统一代码风格

### 17.3 VSCode配置
- 推荐插件
- 工作区设置
- 代码片段

---

本规范文档将随着项目发展持续更新和完善，所有开发人员应严格遵守，确保代码质量和团队协作效率。HTML设计稿迁移策略