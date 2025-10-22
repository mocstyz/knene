/**
 * @fileoverview 领域服务统一导出模块
 * @description 统一导出所有领域服务，包括认证服务、影片目录服务、下载调度服务、通知服务等。
 *              提供领域服务的集中管理和统一入口，便于其他模块导入和使用。
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

// 导出认证领域服务，处理用户认证相关的业务逻辑
export { AuthenticationService } from './AuthenticationService'

// 导出影片目录领域服务，处理影片分类、搜索、推荐等业务逻辑
export { MovieCatalogService } from './MovieCatalogService'

// 导出下载调度领域服务，处理下载任务的调度、优先级管理和资源分配
export { DownloadScheduler } from './DownloadScheduler'

// 导出消息通知领域服务，处理消息发送、通知管理和消息路由
export { NotificationService } from './NotificationService'
