# 技术栈使用指南

## 🛠️ 技术栈指南

本文档详细介绍影视资源下载网站项目中使用的技术栈，包括选型理由、使用方法和最佳实践。

---

## 📋 技术栈概览

### 核心技术栈
```
Spring Boot 3.3.x          # 应用框架
Java 21                   # 开发语言
Spring Security 6.x       # 安全框架
MyBatis-Plus 3.5.x        # ORM框架
```

### 数据存储
```
MySQL 8.0                # 主数据库
Redis 7.x                # 缓存系统
Elasticsearch 8.x         # 全文搜索
```

### 开发与测试
```
Maven                    # 项目构建
JUnit 5.10+             # 单元测试
Mockito 5.x             # Mock测试
Testcontainers          # 集成测试
Instancio               # 测试数据生成
Hutool 5.8.38           # 工具库
```

### 监控与运维
```
Spring Boot Admin        # 应用监控
Prometheus + Grafana     # 指标监控
PLG Stack (Loki)        # 日志管理
Docker                  # 容器化
```

---

## 🚀 Spring Boot 3.3.x

### 选型理由
- **现代化特性**：支持Java 21，享受现代Java特性和预览功能
- **生产就绪**：提供健康检查、指标监控等生产特性
- **微服务友好**：内置嵌套服务器，便于容器化部署
- **生态丰富**：Spring生态系统完善，集成方便

### 核心配置

#### 1. 应用配置文件
```yaml
# application.yml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: knene-backend
  profiles:
    active: dev

  # 数据源配置
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:knene_db}?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
    type: com.alibaba.druid.pool.DruidDataSource
    druid:
      initial-size: 5
      min-idle: 5
      max-active: 20
      max-wait: 60000
      time-between-eviction-runs-millis: 60000
      min-evictable-idle-time-millis: 300000
      validation-query: SELECT 1
      test-while-idle: true
      test-on-borrow: false
      test-on-return: false

  # Redis配置
  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      database: 0
      timeout: 6000ms
      lettuce:
        pool:
          max-active: 20
          max-idle: 10
          min-idle: 5
          max-wait: 2000ms

  # Jackson配置
  jackson:
    time-zone: Asia/Shanghai
    date-format: yyyy-MM-dd HH:mm:ss
    serialization:
      write-dates-as-timestamps: false

  # 文件上传配置
  servlet:
    multipart:
      max-file-size: 100MB
      max-request-size: 100MB
```

#### 2. 启动类配置
```java
/**
 * 影视资源下载网站应用启动类
 * 负责Spring Boot应用的启动和基础配置
 *
 * @author 相笑与春风
 * @version 1.0
 */
@SpringBootApplication
@EnableCaching
@EnableScheduling
@EnableTransactionManagement
@EnableConfigurationProperties
public class KneneApplication {

    public static void main(String[] args) {
        SpringApplication.run(KneneApplication.class, args);
    }

    // 配置Spring Jackson时间格式化
    @Bean
    @Primary
    public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer() {
        return builder -> {
            builder.timeZone(TimeZone.getTimeZone("Asia/Shanghai"));
            builder.simpleDateFormat(DateUtil.NORM_DATETIME_PATTERN);
        };
    }
}
```

### 最佳实践

#### 1. 配置管理
```java
@ConfigurationProperties(prefix = "app")
@Data
@Component
public class AppProperties {

    // JWT配置
    private Jwt jwt = new Jwt();

    // 文件存储配置
    private Storage storage = new Storage();

    // 缓存配置
    private Cache cache = new Cache();

    @Data
    public static class Jwt {
        private String secret;
        private Long expiration = 86400L; // 24小时
        private Long refreshExpiration = 604800L; // 7天
    }

    @Data
    public static class Storage {
        private String uploadPath;
        private Long maxFileSize = 100 * 1024 * 1024L; // 100MB
    }

    @Data
    public static class Cache {
        private Long defaultTtl = 3600L; // 1小时
        private String keyPrefix = "knene:";
    }
}
```

#### 2. 全局异常处理
```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // 参数验证异常
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ApiResponse<Void> response = ApiResponse.error(ErrorCode.VALIDATION_ERROR,
                "参数验证失败", errors);
        return ResponseEntity.badRequest().body(response);
    }

    // 业务异常
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        ApiResponse<Void> response = ApiResponse.error(ex.getErrorCode(), ex.getMessage());
        return ResponseEntity.status(ex.getHttpStatus()).body(response);
    }

    // 系统异常
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleSystemException(Exception ex) {
        log.error("系统异常", ex);
        ApiResponse<Void> response = ApiResponse.error(ErrorCode.SYSTEM_ERROR, "系统内部错误");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
```

---

## 🗄️ MyBatis-Plus 3.5.x

### 选型理由
- **简化开发**：提供通用Mapper，减少样板代码
- **强大查询**：支持Lambda表达式查询，类型安全
- **分页插件**：内置分页插件，使用简单
- **代码生成**：支持代码生成器，提高开发效率

### 核心配置

#### 1. MyBatis-Plus配置
```java
@Configuration
@MapperScan("com.knene.infrastructure.persistence.mapper")
public class MyBatisPlusConfig {

    // 分页插件
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }

    // 乐观锁插件
    @Bean
    public OptimisticLockerInnerInterceptor optimisticLockerInnerInterceptor() {
        return new OptimisticLockerInnerInterceptor();
    }

    // SQL性能分析插件（开发环境）
    @Bean
    @Profile("dev")
    public PerformanceInterceptor performanceInterceptor() {
        PerformanceInterceptor interceptor = new PerformanceInterceptor();
        interceptor.setMaxTime(1000); // SQL执行最大时长，超过自动停止运行
        interceptor.setFormat(true);    // 是否格式化SQL
        return interceptor;
    }
}
```

#### 2. 基础实体类
```java
@Data
@MappedSuperclass
public class BaseEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableField(fill = FieldFill.INSERT)
    private Long createdBy;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updatedBy;

    // 软删除
    @TableLogic
    @TableField(fill = FieldFill.INSERT)
    private Boolean deleted;
}

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("users")
public class User extends BaseEntity {

    @TableField("username")
    private String username;

    @TableField("email")
    private String email;

    @TableField("password_hash")
    private String passwordHash;

    @TableField("status")
    private UserStatus status;

    @TableField("last_login_at")
    private LocalDateTime lastLoginAt;

    public enum UserStatus {
        ACTIVE, INACTIVE, BANNED
    }
}
```

#### 3. 通用Mapper接口
```java
/**
 * 通用Mapper接口
 * 提供基础的CRUD操作
 *
 * @param <T> 实体类型
 * @param <ID> 主键类型
 */
public interface BaseMapper<T, ID> extends com.baomidou.mybatisplus.core.mapper.BaseMapper<T> {

    // 根据条件查询一个
    default T selectOneByQuery(Wrapper<T> queryWrapper) {
        return selectOne(queryWrapper);
    }

    // 根据条件查询列表
    default List<T> selectListByQuery(Wrapper<T> queryWrapper) {
        return selectList(queryWrapper);
    }

    // 根据条件分页查询
    default IPage<T> selectPageByQuery(IPage<T> page, Wrapper<T> queryWrapper) {
        return selectPage(page, queryWrapper);
    }

    // 根据条件查询数量
    default Long selectCountByQuery(Wrapper<T> queryWrapper) {
        return selectCount(queryWrapper);
    }

    // 批量插入
    default int insertBatch(List<T> entityList) {
        if (CollUtil.isEmpty(entityList)) {
            return 0;
        }
        return insertBatchSomeColumn(entityList);
    }
}
```

### 查询构建器使用

#### 1. Lambda查询
```java
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    // 条件查询
    public List<User> findActiveUsers() {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getStatus, UserStatus.ACTIVE)
               .orderByDesc(User::getCreatedAt);
        return userMapper.selectList(wrapper);
    }

    // 复杂查询
    public IPage<User> searchUsers(UserSearchRequest request) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();

        // 用户名模糊查询
        if (StrUtil.isNotBlank(request.getUsername())) {
            wrapper.like(User::getUsername, request.getUsername());
        }

        // 邮箱模糊查询
        if (StrUtil.isNotBlank(request.getEmail())) {
            wrapper.like(User::getEmail, request.getEmail());
        }

        // 状态过滤
        if (request.getStatus() != null) {
            wrapper.eq(User::getStatus, request.getStatus());
        }

        // 创建时间范围
        if (request.getStartDate() != null && request.getEndDate() != null) {
            wrapper.between(User::getCreatedAt, request.getStartDate(), request.getEndDate());
        }

        // 分页查询
        Page<User> page = new Page<>(request.getPageNum(), request.getPageSize());
        wrapper.orderByDesc(User::getCreatedAt);

        return userMapper.selectPage(page, wrapper);
    }
}
```

#### 2. 自定义SQL
```java
@Mapper
public interface UserMapper extends BaseMapper<User, Long> {

    // 自定义查询方法
    @Select("SELECT u.*, up.nickname, up.avatar_url " +
            "FROM users u " +
            "LEFT JOIN user_profiles up ON u.id = up.user_id " +
            "WHERE u.status = #{status} " +
            "ORDER BY u.created_at DESC " +
            "LIMIT #{limit}")
    List<UserWithProfile> findUsersWithProfile(@Param("status") UserStatus status,
                                              @Param("limit") Integer limit);

    // 批量更新状态
    @Update("UPDATE users SET status = #{status}, updated_at = NOW() " +
            "WHERE id IN " +
            "<foreach collection='userIds' item='id' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>")
    int batchUpdateStatus(@Param("userIds") List<Long> userIds,
                         @Param("status") UserStatus status);
}
```

---

## 🔐 Spring Security 6.x

### 选型理由
- **标准安全框架**：Spring生态标准安全解决方案
- **功能完整**：提供认证、授权、密码加密等完整功能
- **可扩展性**：支持自定义认证和授权逻辑
- **社区活跃**：文档完善，社区支持良好

### JWT认证配置

#### 1. JWT工具类
```java
@Component
@Slf4j
public class JwtTokenProvider {

    private final AppProperties.Jwt jwtProperties;

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    public JwtTokenProvider(AppProperties appProperties) {
        this.jwtProperties = appProperties.getJwt();
    }

    // 生成Token
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", ((CustomUserDetails) userDetails).getUserId());
        claims.put("username", userDetails.getUsername());
        claims.put("authorities", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpiration() * 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    // 生成刷新Token
    public String generateRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getRefreshExpiration() * 1000))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    // 验证Token
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    // 获取用户名
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // 获取用户ID
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
        return claims.get("userId", Long.class);
    }
}
```

#### 2. 安全配置
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
                         JwtRequestFilter jwtRequestFilter) {
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 禁用CSRF（使用JWT时通常禁用）
            .csrf(csrf -> csrf.disable())

            // 配置会话管理为无状态
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 配置异常处理
            .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))

            // 配置请求授权
            .authorizeHttpRequests(auth -> auth
                // 公开访问的端点
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()

                // 管理员端点
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")

                // 其他端点需要认证
                .anyRequest().authenticated()
            )

            // 添加JWT过滤器
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

#### 3. 认证过滤器
```java
@Component
@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;
    private final JwtTokenProvider jwtTokenProvider;

    public JwtRequestFilter(UserDetailsService userDetailsService,
                           JwtTokenProvider jwtTokenProvider) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain chain) throws ServletException, IOException {

        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        // JWT Token格式为 "Bearer token"
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtTokenProvider.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                log.error("Unable to get JWT Token");
            } catch (ExpiredJwtException e) {
                log.error("JWT Token has expired");
            }
        } else {
            logger.warn("JWT Token does not begin with Bearer String");
        }

        // 验证Token
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 如果Token有效，配置Spring Security手动设置认证
            if (jwtTokenProvider.validateToken(jwtToken)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 设置认证信息到SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        chain.doFilter(request, response);
    }
}
```

---

## 🧪 测试框架集成

### JUnit 5 + Mockito + Testcontainers

#### 1. 测试基础配置
```java
@SpringBootTest
@Testcontainers
@Transactional
@Rollback
public abstract class BaseIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("test_db")
            .withUsername("test_user")
            .withPassword("test_password")
            .withReuse(true);

    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7-alpine")
            .withExposedPorts(6379)
            .withReuse(true);

    @DynamicPropertySource
    static void registerPgProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.datasource.driver-class-name", postgres::getDriverClassName);
        registry.add("spring.redis.host", redis::getHost);
        registry.add("spring.redis.port", () -> redis.getMappedPort(6379).toString());
    }
}
```

#### 2. Instancio测试数据生成
```java
@Component
public class TestDataGenerator {

    // 生成用户测试数据
    public User generateUser() {
        return Instancio.of(User.class)
                .ignore(field(User::getId))
                .ignore(field(User::getCreatedAt))
                .ignore(field(User::getUpdatedAt))
                .set(field(User::getUsername), gen -> gen.string().pattern("user[0-9]{5}"))
                .set(field(User::getEmail), gen -> gen.text().pattern("user[0-9]{5}@example.com"))
                .set(field(User::getStatus), UserStatus.ACTIVE)
                .create();
    }

    // 生成用户列表测试数据
    public List<User> generateUserList(int size) {
        return Instancio.ofList(User.class)
                .size(size)
                .ignore(field(User::getId))
                .ignore(field(User::getCreatedAt))
                .ignore(field(User::getUpdatedAt))
                .set(field(User::getStatus), UserStatus.ACTIVE)
                .create();
    }

    // 生成带关联的用户测试数据
    public User generateUserWithProfile() {
        User user = generateUser();
        UserProfile profile = Instancio.of(UserProfile.class)
                .ignore(field(UserProfile::getId))
                .ignore(field(UserProfile::getCreatedAt))
                .ignore(field(UserProfile::getUpdatedAt))
                .set(field(UserProfile::getUserId), user.getId())
                .create();

        user.setProfile(profile);
        return user;
    }
}
```

#### 3. 服务层测试示例
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @InjectMocks
    private TestDataGenerator testDataGenerator;

    @Test
    @DisplayName("应该成功创建用户")
    void shouldCreateUserSuccessfully() {
        // Given
        UserCreateRequest request = new UserCreateRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        User savedUser = testDataGenerator.generateUser();
        savedUser.setId(1L);
        savedUser.setUsername(request.getUsername());
        savedUser.setEmail(request.getEmail());

        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(userMapper.insert(any(User.class))).thenReturn(1);

        // When
        UserDTO result = userService.createUser(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo(request.getUsername());
        assertThat(result.getEmail()).isEqualTo(request.getEmail());

        verify(passwordEncoder).encode("password123");
        verify(userMapper).insert(any(User.class));
    }

    @Test
    @DisplayName("当用户名已存在时应该抛出异常")
    void shouldThrowExceptionWhenUsernameExists() {
        // Given
        UserCreateRequest request = new UserCreateRequest();
        request.setUsername("existinguser");
        request.setEmail("new@example.com");
        request.setPassword("password123");

        when(userMapper.existsByUsername("existinguser")).thenReturn(true);

        // When & Then
        assertThrows(BusinessException.class, () -> userService.createUser(request));
        verify(userMapper, never()).insert(any(User.class));
    }
}
```

---

## 📊 Redis缓存集成

### 1. Redis配置
```java
@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);

        // 使用Jackson2JsonRedisSerializer序列化值
        Jackson2JsonRedisSerializer<Object> serializer = new Jackson2JsonRedisSerializer<>(Object.class);
        ObjectMapper mapper = new ObjectMapper();
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        mapper.activateDefaultTyping(LazyLoadingAwareJavaTimeModule.INSTANCE, ObjectMapper.DefaultTyping.NON_FINAL);
        serializer.setObjectMapper(mapper);

        template.setValueSerializer(serializer);
        template.setHashValueSerializer(serializer);
        template.setKeySerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());

        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofHours(1)) // 默认1小时过期
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new Jackson2JsonRedisSerializer<>(Object.class)))
                .disableCachingNullValues(); // 不缓存null值

        return RedisCacheManager.builder(factory)
                .cacheDefaults(config)
                .build();
    }
}
```

### 2. 缓存使用示例
```java
@Service
@Slf4j
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CacheManager cacheManager;

    // 查询用户并缓存
    @Override
    @Cacheable(value = "user", key = "#userId", unless = "#result == null")
    public UserDTO getUserById(Long userId) {
        log.info("从数据库查询用户: {}", userId);
        User user = userMapper.selectById(userId);
        if (user == null) {
            return null;
        }
        return UserConverter.toDTO(user);
    }

    // 更新用户并清除缓存
    @Override
    @CacheEvict(value = "user", key = "#userId")
    public UserDTO updateUser(Long userId, UserUpdateRequest request) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        // 更新用户信息
        BeanUtil.copyProperties(request, user, "id", "createdAt");
        userMapper.updateById(user);

        return UserConverter.toDTO(user);
    }

    // 删除用户并清除缓存
    @Override
    @CacheEvict(value = "user", key = "#userId")
    public void deleteUser(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        userMapper.deleteById(userId);
    }

    // 手动缓存操作
    public void refreshUserCache(Long userId) {
        Cache userCache = cacheManager.getCache("user");
        if (userCache != null) {
            userCache.evict(userId);
            log.info("清除用户缓存: {}", userId);
        }
    }
}
```

---

**文档维护**：技术栈指南随技术版本更新持续维护
**最后更新**：2024-10-29
**维护人员**：相笑与春风