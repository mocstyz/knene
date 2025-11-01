package com.knene.test;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

/**
 * 这是一个文件头，是唯一允许使用 /** */ 的地方
 * 用户管理服务测试类
 * 测试用户管理相关的业务逻辑
 *
 * @author 相笑与春风
 * @version 1.0
 */
@SpringBootTest
public class CommentViolationTest {

    @Test
    public void testUserRegistration() {
        // 测试用户注册是否成功
        String username = "testuser";
        String password = "password123";
        // 验证注册参数
        if (username != null && password != null) {
            // 执行注册逻辑
            System.out.println("注册成功");
        }
    }

    // 违规案例2：在//注释中使用 /**
    // 数据库连接测试类
    @Test
    public void testDatabaseConnection() {
        // 测试数据库连接是否成功
        String url = "jdbc:mysql://localhost:3306/knene_db?serverTimezone=Asia/Shanghai&useUnicode=true&characterEncoding=utf8&useSSL=false&allowPublicKeyRetrieval=true";
        //数据库连接参数也与下方的内容不对齐的这种情况
        String username = "root";
        String password = "123456";

        // 验证连接参数
        if (url != null && username != null) {
            // 建立数据库连接
            System.out.println("连接成功");
        }
    }

    @Test
    public void testUserLogin() {
        // 测试用户登录
        String username = "admin";
        String password = "admin123";
        // 验证登录信息
        if (username.equals("admin") && password.equals("admin123")) {
            // 登录成功
            System.out.println("登录成功");
        }
    }

    public void calculateTotalPrice() {
        // 计算商品总价
        double price = 100.0;
        double discount = 0.1;

        double total = price * (1 - discount);

        // 返回总价
        return total;
    }

    // 违规案例6：装饰性分隔线注释
    // ====================================================================

    public void updateUserProfile() {
        // 更新用户档案信息
        String name = "张三";
        String email = "zhangsan@example.com";

        // 验证邮箱格式
        if (email.contains("@")) {
            // 邮箱格式正确
            System.out.println("邮箱格式正确");
        }
    }

    // 违规案例8：又一个装饰性分隔线违规案例
    // --------------------

    public void validatePassword() {
        // 验证密码强度
        String password = "password123";

        if (password.length() >= 8) {
            // 密码长度符合要求
            System.out.println("密码强度符合要求");
        }

    // 违规案例11：完全没有缩进的注释
    // 密码强度验证完成
    // 违规案例12：超过3行的长注释，这是违规的，因为注释内容太多，需要精简提炼，不能写这么长的注释，按照规范要求，//注释最多不超过3行，如果内容太多要超过3行，就要精简提炼，这里演示了一个超过3行限制的注释案例，应该被拆分或精简

        return;
    }

    // 违规案例13：各种不对齐的注释情况测试
    public void testMisalignedComments() {
        // 违规案例14：完全没有缩进的注释
        String variable1 = "test1";

        // 违规案例15：缩进2个空格的注释
        String variable2 = "test2";

        // 正确对齐的注释
        String variable3 = "test3";

        // 违规案例16：缩进过多的注释
        String variable4 = "test4";

    // 违规案例17：类成员变量没有缩进的注释
    private String memberVar1 = "value1";

        // 违规案例18：类成员变量缩进不足的注释
      private String memberVar2 = "value2";

        // 正确对齐的成员变量注释
        private String memberVar3 = "value3";

        // 违规案例19：类成员变量缩进过多的注释
        private String memberVar4 = "value4";

        // 违规案例20：方法内对齐测试
        public void methodWithMisalignedComment() {
            // 正常缩进的注释
            String localVar = "local";

            // 违规案例21：方法内完全没有缩进的注释
            String anotherVar = "another";
        }

        // 违规案例22：不同代码结构对齐测试
        public void testCodeAlignment() {
            // if语句不对齐的注释
            if (true) {
                // 正常缩进的if内注释
                System.out.println("test");
                // 违规案例23：if内完全没有缩进的注释
                System.out.println("test2");
            }

            // for循环不对齐的注释
            for (int i = 0; i < 10; i++) {
                // 违规案例24：for循环缩进不够的注释
                System.out.println(i);
            }

            // try-catch块不对齐的注释
            try {
                // 正常缩进的try注释
                String result = "test";
            } catch (Exception e) {
                // 违规案例25：catch块完全没有缩进的注释
                e.printStackTrace();
            }
        }

        // 违规案例26：变量声明对齐测试
        public void testVariableAlignment() {
            // 违规案例27：注释与变量声明不对齐 - 完全没有缩进
            String userName = "admin";

            // 违规案例28：注释与变量声明不对齐 - 缩进太少
            String userEmail = "admin@example.com";

            // 注释与变量声明对齐正确
            String userPassword = "password123";

            // 违规案例29：注释与变量声明不对齐 - 缩进过多
            String userAge = "25";

            // 违规案例30：复杂声明不对齐的注释
            Map<String, List<Integer>> complexMap = new HashMap<>();

            // 违规案例31：另一个复杂声明不对齐的注释
            List<Map<String, Object>> complexList = new ArrayList<>();
        }
    }

    public static class OrderService {

        public void createOrder() {
            // 创建订单逻辑 1. 验证用户信息 2. 检查商品库存 违规案例34：连续注释超过3行 创建订单逻辑步骤：
            // 创建订单逻辑 1. 验证用户信息 2. 检查商品库存
            System.out.println("订单创建成功");
        }

        // 违规案例35：又一个 // 违规案例
        public void updateOrderStatus() {
            // 更新订单状态
            System.out.println("订单状态已更新");
        }
    }
}