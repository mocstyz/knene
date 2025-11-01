/**
 * UserManagementController类
 * UserManagementController相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.interfaces.user.controller;

import com.knene.application.user.service.UserApplicationService;
import com.knene.interfaces.user.dto.request.*;
import com.knene.interfaces.user.dto.response.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@Tag(name = "用户管理", description = "管理员用户管理相关接口")
@PreAuthorize("hasRole('ADMIN')")
public class UserManagementController {

    private final UserApplicationService userApplicationService;

    @Autowired
    public UserManagementController(UserApplicationService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }

    // 用户查询接口

    // 获取用户列表
    @GetMapping
    @Operation(summary = "获取用户列表", description = "分页获取用户列表，支持状态和时间范围筛选")
    public ResponseEntity<ApiResponse<UserListResponse>> getUserList(
            @Parameter(description = "用户状态筛选")
            @RequestParam(required = false) String status,
            @Parameter(description = "页码，从0开始")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "开始时间")
            @RequestParam(required = false) String startTime,
            @Parameter(description = "结束时间")
            @RequestParam(required = false) String endTime) {

        // 构建查询对象
        UserApplicationService.GetUserListQuery query = new UserApplicationService.GetUserListQuery();

        // 解析状态参数
        if (status != null) {
            try {
                query.setStatus(com.knene.domain.user.entity.User.UserStatus.valueOf(status.toUpperCase()));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("无效的用户状态: " + status));
            }
        }

        // 解析时间参数
        if (startTime != null) {
            try {
                query.setStartTime(java.time.LocalDateTime.parse(startTime));
            } catch (Exception e) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("开始时间格式错误"));
            }
        }

        if (endTime != null) {
            try {
                query.setEndTime(java.time.LocalDateTime.parse(endTime));
            } catch (Exception e) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("结束时间格式错误"));
            }
        }

        query.setOffset(page * size);
        query.setLimit(size);

        // 执行查询
        UserListResult result = userApplicationService.getUserList(query);

        if (result.isSuccess()) {
            UserListResponse response = new UserListResponse(
                    result.getUsers(),
                    result.getTotalCount(),
                    page,
                    size
            );
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
    }

    // 获取用户详情
    @GetMapping("/{userId}")
    @Operation(summary = "获取用户详情", description = "获取指定用户的详细信息")
    public ResponseEntity<ApiResponse<UserDetailResponse>> getUserDetail(
            @Parameter(description = "用户ID", required = true)
            @PathVariable Long userId) {

        // 构建查询对象
        UserApplicationService.GetUserProfileQuery query = new UserApplicationService.GetUserProfileQuery();
        query.setUserId(userId);
        query.setRequestUserId(null); // 管理员可以查看所有用户详情

        // 执行查询
        UserProfileDto profileDto = userApplicationService.getUserProfile(query);

        if (profileDto != null) {
            UserDetailResponse response = UserDetailResponse.fromDto(profileDto);
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 用户管理操作接口

    // 锁定用户
    @PostMapping("/{userId}/lock")
    @Operation(summary = "锁定用户", description = "锁定指定用户账户")
    public ResponseEntity<ApiResponse<BaseResponse>> lockUser(
            @Parameter(description = "用户ID", required = true)
            @PathVariable Long userId,
            @Valid @RequestBody LockUserRequest request,
            HttpServletRequest httpRequest,
            @AuthenticationPrincipal UserDetails currentUser) {

        // 获取当前管理员ID
        Long adminUserId = getCurrentUserId(currentUser);
        String ipAddress = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        // 构建锁定命令
        UserApplicationService.LockUserCommand command = new UserApplicationService.LockUserCommand();
        command.setUserId(userId);
        command.setLockReason(request.getLockReason());
        command.setLockDuration(request.getLockDuration());
        command.setLockedBy(adminUserId);
        command.setIpAddress(ipAddress);
        command.setUserAgent(userAgent);

        // 执行锁定
        UserLockResult result = userApplicationService.lockUser(command);

        if (result.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(new BaseResponse(result.getMessage())));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
    }

    // 解锁用户
    @PostMapping("/{userId}/unlock")
    @Operation(summary = "解锁用户", description = "解锁指定用户账户")
    public ResponseEntity<ApiResponse<BaseResponse>> unlockUser(
            @Parameter(description = "用户ID", required = true)
            @PathVariable Long userId,
            @Valid @RequestBody UnlockUserRequest request,
            @AuthenticationPrincipal UserDetails currentUser) {

        Long adminUserId = getCurrentUserId(currentUser);

        // 构建解锁命令
        UserApplicationService.UnlockUserCommand command = new UserApplicationService.UnlockUserCommand();
        command.setUserId(userId);
        command.setUnlockReason(request.getUnlockReason());
        command.setUnlockedBy(adminUserId);

        // 执行解锁
        UserUnlockResult result = userApplicationService.unlockUser(command);

        if (result.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(new BaseResponse(result.getMessage())));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
    }

    // 系统清理
    @PostMapping("/system/cleanup")
    @Operation(summary = "系统清理", description = "执行系统清理操作，清理过期数据")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<SystemCleanupResponse>> performSystemCleanup() {

        // 执行系统清理
        SystemCleanupResult result = userApplicationService.performSystemCleanup();

        if (result.isSuccess()) {
            SystemCleanupResponse response = new SystemCleanupResponse(
                    result.getExpiredRefreshTokens(),
                    result.getExpiredEmailVerifications(),
                    result.getExpiredPasswordResets(),
                    result.getUnlockedLockouts(),
                    result.getMessage()
            );
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error(result.getMessage()));
        }
    }

    
    // 获取当前用户ID
    private Long getCurrentUserId(UserDetails currentUser) {
        // 这里应该从UserDetails中提取用户ID
        // 简化实现，实际应该根据具体的UserDetails实现来获取
        return 1L; // 临时返回，实际应该查询数据库
    }

    // 获取客户端IP地址
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}