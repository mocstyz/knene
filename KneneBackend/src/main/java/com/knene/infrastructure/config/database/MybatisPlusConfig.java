/**
 * MybatisPlusConfig类
 * MybatisPlusConfig相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.infrastructure.config.database;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.BlockAttackInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.OptimisticLockerInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.apache.ibatis.reflection.MetaObject;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

// MyBatis Plus配置类 - 配置分页、乐观锁、防全表操作等插件
@Configuration
@MapperScan("com.knene.infrastructure.persistence.mapper")
public class MybatisPlusConfig {

    // MyBatis Plus拦截器配置 - 添加分页插件、乐观锁插件、防止全表更新删除插件
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();

        // 分页插件配置
        PaginationInnerInterceptor paginationInnerInterceptor = new PaginationInnerInterceptor(DbType.MYSQL);
        paginationInnerInterceptor.setMaxLimit(1000L); // 单页分页条数限制
        paginationInnerInterceptor.setOptimizeJoin(true); // 优化count查询
        interceptor.addInnerInterceptor(paginationInnerInterceptor);

        // 乐观锁插件配置
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());

        // 防止全表更新删除插件配置
        interceptor.addInnerInterceptor(new BlockAttackInnerInterceptor());

        return interceptor;
    }

    // 元数据处理器配置 - 自动填充创建时间、更新时间、创建人、更新人等字段
    @Component
    public static class MyMetaObjectHandler implements MetaObjectHandler {

        @Override
        public void insertFill(MetaObject metaObject) {
            // 插入时自动填充字段
            this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
            this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
            this.strictInsertFill(metaObject, "version", Integer.class, 1);
            this.strictInsertFill(metaObject, "deleted", Integer.class, 0);
        }

        @Override
        public void updateFill(MetaObject metaObject) {
            // 更新时自动填充字段
            this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
        }
    }
}