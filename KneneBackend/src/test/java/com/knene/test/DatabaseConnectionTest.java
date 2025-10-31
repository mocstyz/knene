/**
 * DatabaseConnectionTest类
 * DatabaseConnectionTest相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.test;

import com.alibaba.druid.pool.DruidDataSource;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.SQLException;

// /**
// 数据库连接测试类
public class DatabaseConnectionTest {

// 测试数据库连接是否成功
    @Test
    public void testDatabaseConnection() {
        // 数据库连接参数
        String url = "jdbc:mysql://localhost:3306/knene_db?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8&useSSL=false&allowPublicKeyRetrieval=true";
        String username = "root";
        String password = "592714407";
        String driverClassName = "com.mysql.cj.jdbc.Driver";

        // 创建Druid数据源
        DruidDataSource dataSource = new DruidDataSource();
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        dataSource.setDriverClassName(driverClassName);

        // 配置Druid连接池
        dataSource.setInitialSize(5);
        dataSource.setMinIdle(5);
        dataSource.setMaxActive(20);
        dataSource.setMaxWait(60000);
        dataSource.setTimeBetweenEvictionRunsMillis(60000);
        dataSource.setMinEvictableIdleTimeMillis(300000);
        dataSource.setValidationQuery("SELECT 1");
        dataSource.setTestWhileIdle(true);
        dataSource.setTestOnBorrow(false);
        dataSource.setTestOnReturn(false);

        Connection connection = null;
        try {
            System.out.println("🔄 正在尝试连接数据库...");
            System.out.println("📍 数据库URL: " + url);
            System.out.println("👤 用户名: " + username);

            // 获取数据库连接
            connection = dataSource.getConnection();

            if (connection != null && !connection.isClosed()) {
                System.out.println("✅ 数据库连接成功！");
                System.out.println("🔗 连接对象: " + connection.toString());
                System.out.println("📊 数据库信息: " + connection.getMetaData().getDatabaseProductName());
                System.out.println("🏷️  数据库名称: " + connection.getMetaData().getDatabaseProductName());
                System.out.println("🔢 数据库版本: " + connection.getMetaData().getDatabaseProductVersion());

                // 测试简单查询
                var statement = connection.createStatement();
                var resultSet = statement.executeQuery("SELECT 1 as test_value");
                if (resultSet.next()) {
                    int testValue = resultSet.getInt("test_value");
                    System.out.println("🧪 测试查询结果: " + testValue);
                }
                resultSet.close();
                statement.close();

            } else {
                System.out.println("❌ 数据库连接失败：连接对象为null或已关闭");
            }

        } catch (SQLException e) {
            System.out.println("❌ 数据库连接失败！");
            System.out.println("🔍 错误代码: " + e.getErrorCode());
            System.out.println("📝 错误信息: " + e.getMessage());
            System.out.println("🔗 SQL状态: " + e.getSQLState());

            // 分析常见错误
            if (e.getErrorCode() == 1045) {
                System.out.println("💡 可能原因：用户名或密码错误");
            } else if (e.getErrorCode() == 1049) {
                System.out.println("💡 可能原因：数据库不存在");
            } else if (e.getErrorCode() == 2003) {
                System.out.println("💡 可能原因：MySQL服务未启动或端口错误");
            } else if (e.getErrorCode() == 1129) {
                System.out.println("💡 可能原因：MySQL连接数过多或被阻止");
            }

        } finally {
            // 关闭连接
            if (connection != null) {
                try {
                    connection.close();
                    System.out.println("🔒 数据库连接已关闭");
                } catch (SQLException e) {
                    System.out.println("⚠️ 关闭连接时出错: " + e.getMessage());
                }
            }

            // 关闭数据源
            if (dataSource != null) {
                try {
                    dataSource.close();
                    System.out.println("🔒 Druid数据源已关闭");
                } catch (Exception e) {
                    System.out.println("⚠️ 关闭数据源时出错: " + e.getMessage());
                }
            }
        }
    }
}