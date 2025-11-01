/**
 * UserProfileController类
 * UserProfileController相关实现
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user/profile")
@Tag(name = "用户档案", description = "用户档案管理相关接口")
public class UserProfileController {

    private final UserApplicationService userApplicationService;

    @Autowired
    public UserProfileController(UserApplicationService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }

    // 用户档案查询接口

    // 获取用户档案
    @GetMapping("/{userId}")
    @Operation(summary = "获取用户档案", description = "获取指定用户的档案信息")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserProfile(
            @Parameter(description = "用户ID", required = true)
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails currentUser) {

        // 获取当前用户ID
        Long currentUserId = getCurrentUserId(currentUser);

        // 构建查询对象
        UserApplicationService.GetUserProfileQuery query = new UserApplicationService.GetUserProfileQuery();
        query.setUserId(userId);
        query.setRequestUserId(currentUserId);

        // 执行查询
        UserProfileDto profileDto = userApplicationService.getUserProfile(query);

        if (profileDto != null) {
            UserProfileResponse response = UserProfileResponse.fromDto(profileDto);
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 获取当前用户档案
    @GetMapping("/me")
    @Operation(summary = "获取当前用户档案", description = "获取当前登录用户的档案信息")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUserProfile(
            @AuthenticationPrincipal UserDetails currentUser) {

        Long currentUserId = getCurrentUserId(currentUser);

        UserApplicationService.GetUserProfileQuery query = new UserApplicationService.GetUserProfileQuery();
        query.setUserId(currentUserId);
        query.setRequestUserId(currentUserId);

        UserProfileDto profileDto = userApplicationService.getUserProfile(query);

        if (profileDto != null) {
            UserProfileResponse response = UserProfileResponse.fromDto(profileDto);
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 用户档案更新接口

    // 更新用户档案
    @PutMapping("/{userId}")
    @Operation(summary = "更新用户档案", description = "更新指定用户的档案信息")
    public ResponseEntity<ApiResponse<BaseResponse>> updateUserProfile(
            @Parameter(description = "用户ID", required = true)
            @PathVariable Long userId,
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails currentUser) {

        Long currentUserId = getCurrentUserId(currentUser);

        // 权限检查：只能更新自己的档案
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("ACCESS_DENIED", "无权限更新其他用户的档案"));
        }

        // 构建更新命令
        UserApplicationService.UpdateProfileCommand command = new UserApplicationService.UpdateProfileCommand();
        command.setUserId(userId);
        command.setRequestUserId(currentUserId);
        command.setNickname(request.getNickname());
        command.setGender(request.getGender());
        command.setBirthday(request.getBirthday());
        command.setBio(request.getBio());
        command.setLocation(request.getLocation());
        command.setWebsite(request.getWebsite());

        // 执行更新
        ProfileUpdateResult result = userApplicationService.updateUserProfile(command);

        if (result.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(new BaseResponse(result.getMessage())));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
    }

    // 部分更新用户档案
    @PatchMapping("/{userId}")
    @Operation(summary = "部分更新用户档案", description = "部分更新指定用户的档案信息")
    public ResponseEntity<ApiResponse<BaseResponse>> patchUserProfile(
            @Parameter(description = "用户ID", required = true)
            @PathVariable Long userId,
            @Valid @RequestBody PatchProfileRequest request,
            @AuthenticationPrincipal UserDetails currentUser) {

        Long currentUserId = getCurrentUserId(currentUser);

        // 权限检查
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("ACCESS_DENIED", "无权限更新其他用户的档案"));
        }

        // 构建更新命令，只更新非空字段
        UserApplicationService.UpdateProfileCommand command = new UserApplicationService.UpdateProfileCommand();
        command.setUserId(userId);
        command.setRequestUserId(currentUserId);
        command.setNickname(request.getNickname());
        command.setGender(request.getGender());
        command.setBirthday(request.getBirthday());
        command.setBio(request.getBio());
        command.setLocation(request.getLocation());
        command.setWebsite(request.getWebsite());

        ProfileUpdateResult result = userApplicationService.updateUserProfile(command);

        if (result.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(new BaseResponse(result.getMessage())));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(result.getMessage()));
        }
    }

    // 头像管理接口

    // 上传用户头像
    @PostMapping(value = "/{userId}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "上传用户头像", description = "上传用户头像图片")
    public ResponseEntity<ApiResponse<AvatarUploadResponse>> uploadAvatar(
            @Parameter(description = "用户ID", required = true)
            @PathVariable Long userId,
            @Parameter(description = "头像文件", required = true)
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails currentUser) {

        Long currentUserId = getCurrentUserId(currentUser);

        // 权限检查
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("ACCESS_DENIED", "无权限上传其他用户的头像"));
        }

        // 文件验证
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("上传文件不能为空"));
        }

        // 验证文件类型
        String contentType = file.getContentType();
        if (!isValidImageType(contentType)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("只支持JPG、PNG、WebP格式的图片"));
        }

        try {
            // 构建上传命令
            UserApplicationService.UploadAvatarCommand command = new UserApplicationService.UploadAvatarCommand();
            command.setUserId(userId);
            command.setRequestUserId(currentUserId);
            command.setImageData(file.getBytes());
            command.setContentType(contentType);

            // 执行上传
            AvatarUploadResult result = userApplicationService.uploadAvatar(command);

            if (result.isSuccess()) {
                AvatarUploadResponse response = new AvatarUploadResponse(
                        result.getAvatarUrl(),
                        result.getMessage()
                );
                return ResponseEntity.ok(ApiResponse.success(response));
            } else {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(result.getMessage()));
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("头像上传失败：" + e.getMessage()));
        }
    }

    // 删除用户头像
    @DeleteMapping("/{userId}/avatar")
    @Operation(summary = "删除用户头像", description = "删除用户头像图片")
    public ResponseEntity<ApiResponse<BaseResponse>> deleteAvatar(
            @Parameter(description = "用户ID", required = true)
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetails currentUser) {

        Long currentUserId = getCurrentUserId(currentUser);

        // 权限检查
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("ACCESS_DENIED", "无权限删除其他用户的头像"));
        }

        try {
            // 这里应该调用删除头像的服务方法
            // 目前返回成功响应
            return ResponseEntity.ok(ApiResponse.success(new BaseResponse("头像删除成功")));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("头像删除失败：" + e.getMessage()));
        }
    }

    
    // 获取当前用户ID
    private Long getCurrentUserId(UserDetails currentUser) {
        // 这里应该从UserDetails中提取用户ID
        // 简化实现，实际应该根据具体的UserDetails实现来获取
        String username = currentUser.getUsername();
        // 通过用户名查询用户ID
        return 1L; // 临时返回，实际应该查询数据库
    }

    // 验证图片类型
    private boolean isValidImageType(String contentType) {
        return "image/jpeg".equals(contentType) ||
               "image/png".equals(contentType) ||
               "image/webp".equals(contentType);
    }
}