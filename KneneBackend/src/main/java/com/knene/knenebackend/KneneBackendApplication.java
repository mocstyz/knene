/**
 * KneneBackendApplication类
 * KneneBackendApplication相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.knenebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;

// Spring Boot应用程序主类 - 启动后端服务
@SpringBootApplication(exclude = {
    RedisAutoConfiguration.class  // 只排除Redis配置，启用数据库和Flyway
})
public class KneneBackendApplication {

    // 应用程序主入口方法 - 启动Spring Boot应用
    public static void main(String[] args) {
        SpringApplication.run(KneneBackendApplication.class, args);
    }

}
