/**
 * UserAuthController类
 * UserAuthController相关实现
 *
 * @author 相笑与春风
 * @version 1.0
 */

package com.knene.interfaces.user.controller;

import com.knene.application.user.dto.*;
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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "用户认证", description = "用户注册、登录、认证相关接口")
public class UserAuthController {

    private final UserApplicationService userApplicationService;

      @Autowired
    public UserAuthController(UserApplicationService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }

    // 用户注册接口
    @PostMapping("/register")
    @Operation(summary = "用户注册", description = "创建新用户账户")
    public ResponseEntity<ApiResponse<UserRegistrationResponse>> registerUser(
            @Valid @RequestBody RegisterUserRequest request,
            HttpServletRequest httpRequest) {

        // 获取客户端信息
        String ipAddress = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        // 构建注册命令
        UserApplicationService.RegisterUserCommand command = new UserApplicationService.RegisterUserCommand();
        command.setUsername(request.getUsername());
        command.setEmail(request.getEmail());
        command.setPassword(request.getPassword());
        command.setNickname(request.getNickname());
        command.setIpAddress(ipAddress);
        command.setUserAgent(userAgent);

        // 执行注册
        UserApplicationService.UserRegistrationResult result = userApplicationService.registerUser(command);

        if (result.isSuccess()) {
            UserRegistrationResponse response = new UserRegistrationResponse(
                    result.getUserId(),
                    result.getMessage()
            );
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
    }

    // 验证邮箱
    @PostMapping("/verify-email")
    @Operation(summary = "验证邮箱", description = "验证用户邮箱地址")
    public ResponseEntity<ApiResponse<BaseResponse>> verifyEmail(
            @Valid @RequestBody VerifyEmailRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = getClientIpAddress(httpRequest);

        UserApplicationService.VerifyEmailCommand command = new UserApplicationService.VerifyEmailCommand();
        command.setToken(request.getToken());
        command.setIpAddress(ipAddress);

        EmailVerificationResult result = userApplicationService.verifyEmail(command);

        if (result.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(new BaseResponse(result.getMessage())));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
    }

    // 重新发送验证邮件
    @PostMapping("/resend-verification")
    @Operation(summary = "重新发送验证邮件", description = "重新发送邮箱验证邮件")
    public ResponseEntity<ApiResponse<BaseResponse>> resendVerificationEmail(
            @Valid @RequestBody ResendVerificationRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        ResendVerificationCommand command = new ResendVerificationCommand();
        command.setEmail(request.getEmail());
        command.setIpAddress(ipAddress);
        command.setUserAgent(userAgent);

        ResendVerificationResult result = userApplicationService.resendVerificationEmail(command);

        if (result.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(new BaseResponse(result.getMessage())));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
    }

    // 用户登录接口
    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "用户身份验证和登录")
    public ResponseEntity<ApiResponse<LoginResponse>> loginUser(
            @Valid @RequestBody LoginUserRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        String deviceFingerprint = httpRequest.getHeader("X-Device-Fingerprint");

        UserApplicationService.LoginUserCommand command = new UserApplicationService.LoginUserCommand();
        command.setIdentifier(request.getIdentifier());
        command.setPassword(request.getPassword());
        command.setIpAddress(ipAddress);
        command.setUserAgent(userAgent);
        command.setDeviceFingerprint(deviceFingerprint);

        LoginResult result = userApplicationService.loginUser(command);

        if (result.isSuccess()) {
            LoginResponse response = new LoginResponse(
                    result.getUserId(),
                    result.getUsername(),
                    result.getEmail(),
                    result.getAccessToken(),
                    result.getRefreshToken(),
                    result.getRoles()
            );
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
    }

    // 刷新令牌
    @PostMapping("/refresh")
    @Operation(summary = "刷新令牌", description = "使用刷新令牌获取新的访问令牌")
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        RefreshTokenCommand command = new RefreshTokenCommand();
        command.setRefreshToken(request.getRefreshToken());
        command.setIpAddress(ipAddress);
        command.setUserAgent(userAgent);

        RefreshTokenResult result = userApplicationService.refreshToken(command);

        if (result.isSuccess()) {
            RefreshTokenResponse response = new RefreshTokenResponse(
                    result.getAccessToken(),
                    result.getRefreshToken()
            );
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
    }

    // 用户登出
    @PostMapping("/logout")
    @Operation(summary = "用户登出", description = "用户登出并撤销令牌")
    public ResponseEntity<ApiResponse<BaseResponse>> logoutUser(
            @Valid @RequestBody LogoutUserRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = getClientIpAddress(httpRequest);

        UserApplicationService.LogoutUserCommand command = new UserApplicationService.LogoutUserCommand();
        command.setRefreshToken(request.getRefreshToken());
        command.setUserId(request.getUserId());
        command.setIpAddress(ipAddress);

        LogoutResult result = userApplicationService.logoutUser(command);

        return ResponseEntity.ok(ApiResponse.success(new BaseResponse(result.getMessage())));
    }

    // 密码重置接口
    @PostMapping("/request-password-reset")
    @Operation(summary = "请求密码重置", description = "请求重置用户密码")
    public ResponseEntity<ApiResponse<BaseResponse>> requestPasswordReset(
            @Valid @RequestBody RequestPasswordResetRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = getClientIpAddress(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        UserApplicationService.RequestPasswordResetCommand command = new UserApplicationService.RequestPasswordResetCommand();
        command.setEmail(request.getEmail());
        command.setIpAddress(ipAddress);
        command.setUserAgent(userAgent);

        PasswordResetRequestResult result = userApplicationService.requestPasswordReset(command);

        if (result.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(new BaseResponse(result.getMessage())));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
    }

    // 验证密码重置令牌
    @PostMapping("/validate-reset-token")
    @Operation(summary = "验证重置令牌", description = "验证密码重置令牌的有效性")
    public ResponseEntity<ApiResponse<BaseResponse>> validateResetToken(
            @Valid @RequestBody ValidateResetTokenRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = getClientIpAddress(httpRequest);

        UserApplicationService.ValidateResetTokenCommand command = new UserApplicationService.ValidateResetTokenCommand();
        command.setToken(request.getToken());
        command.setIpAddress(ipAddress);

        PasswordResetTokenValidationResult result = userApplicationService.validateResetToken(command);

        if (result.isValid()) {
            return ResponseEntity.ok(ApiResponse.success(new BaseResponse(result.getMessage())));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
    }

    // 执行密码重置
    @PostMapping("/execute-password-reset")
    @Operation(summary = "执行密码重置", description = "使用令牌重置用户密码")
    public ResponseEntity<ApiResponse<BaseResponse>> executePasswordReset(
            @Valid @RequestBody ExecutePasswordResetRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = getClientIpAddress(httpRequest);

        UserApplicationService.ExecutePasswordResetCommand command = new UserApplicationService.ExecutePasswordResetCommand();
        command.setToken(request.getToken());
        command.setNewPassword(request.getNewPassword());
        command.setIpAddress(ipAddress);

        PasswordResetExecutionResult result = userApplicationService.executePasswordReset(command);

        if (result.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(new BaseResponse(result.getMessage())));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
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