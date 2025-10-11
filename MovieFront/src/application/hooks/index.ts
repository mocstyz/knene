/**
 * @fileoverview 应用层Hooks统一导出
 * @description 导出所有应用层Hooks，包括认证、影片、下载、主题等业务逻辑。
 * 遵循 DDD 架构原则，Hooks放在应用层负责协调不同领域的业务逻辑。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.3.0
 */

// 认证相关hooks
export * from './useAuth'

// 影片相关hooks
export * from './useMovies'

// 下载相关hooks
export * from './useDownloads'

// 主题相关hooks
export * from './useTheme'

// 重新导出查询客户端配置
export { queryClient, QUERY_KEYS } from '@application/services/queryClient'
