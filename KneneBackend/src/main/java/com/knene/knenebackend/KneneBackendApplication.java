package com.knene.knenebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;

@SpringBootApplication(exclude = {
    RedisAutoConfiguration.class  // 只排除Redis配置，启用数据库和Flyway
})
public class KneneBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(KneneBackendApplication.class, args);
    }

}
