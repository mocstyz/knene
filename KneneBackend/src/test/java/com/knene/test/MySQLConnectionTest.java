/**
 * MySQLConnectionTest类
 * MySQLConnectionTest相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.test;

import com.alibaba.druid.pool.DruidDataSource;
import org.junit.jupiter.api.Test;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;

// /**
// MySQL连接测试类（不指定数据库）
public class MySQLConnectionTest {

// 测试MySQL服务连接是否成功（不指定数据库）
    @Test
    public void testMySQLServiceConnection() {
        // MySQL连接参数（不指定数据库）
        String url = "jdbc:mysql://localhost:3306?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8&useSSL=false&allowPublicKeyRetrieval=true";
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
            System.out.println("🔄 正在尝试连接MySQL服务...");
            System.out.println("📍 MySQL URL: " + url);
            System.out.println("👤 用户名: " + username);

            // 获取MySQL连接
            connection = dataSource.getConnection();

            if (connection != null && !connection.isClosed()) {
                System.out.println("✅ MySQL服务连接成功！");
                System.out.println("🔗 连接对象: " + connection.toString());
                System.out.println("📊 数据库信息: " + connection.getMetaData().getDatabaseProductName());
                System.out.println("🏷️  数据库名称: " + connection.getMetaData().getDatabaseProductName());
                System.out.println("🔢 数据库版本: " + connection.getMetaData().getDatabaseProductVersion());
                System.out.println("🔧 MySQL驱动版本: " + connection.getMetaData().getDriverVersion());

                // 查看所有数据库
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery("SHOW DATABASES");

                System.out.println("\n📋 查看所有数据库:");
                boolean foundKneneDb = false;
                while (resultSet.next()) {
                    String dbName = resultSet.getString(1);
                    System.out.println("  - " + dbName);
                    if ("knene_db".equals(dbName)) {
                        foundKneneDb = true;
                    }
                }

                if (!foundKneneDb) {
                    System.out.println("\n⚠️ 未找到 knene_db 数据库，需要先创建数据库");
                } else {
                    System.out.println("\n✅ 找到 knene_db 数据库");
                }

                resultSet.close();
                statement.close();

            } else {
                System.out.println("❌ MySQL服务连接失败：连接对象为null或已关闭");
            }

        } catch (SQLException e) {
            System.out.println("❌ MySQL服务连接失败！");
            System.out.println("🔍 错误代码: " + e.getErrorCode());
            System.out.println("📝 错误信息: " + e.getMessage());
            System.out.println("🔗 SQL状态: " + e.getSQLState());

            // 分析常见错误
            if (e.getErrorCode() == 1045) {
                System.out.println("💡 可能原因：用户名或密码错误");
                System.out.println("💡 请检查MySQL用户root的密码是否为592714407");
            } else if (e.getErrorCode() == 2003) {
                System.out.println("💡 可能原因：MySQL服务未启动");
                System.out.println("💡 请检查MySQL服务是否在localhost:3306运行");
            } else if (e.getErrorCode() == 1129) {
                System.out.println("💡 可能原因：MySQL连接数过多或被阻止");
                System.out.println("💡 请检查MySQL连接限制和防火墙设置");
            }

        } finally {
            // 关闭连接
            if (connection != null) {
                try {
                    connection.close();
                    System.out.println("🔒 MySQL连接已关闭");
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