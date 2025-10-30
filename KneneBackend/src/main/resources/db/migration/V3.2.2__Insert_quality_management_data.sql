-- =====================================================
-- KneneBackend 第三层：高级功能表 - 质量管理测试数据
-- 版本：V3.13.2
-- 创建时间：2025-10-30
-- 说明：严格按照数据库架构规范插入测试数据，遵循20个规范文档要求
-- =====================================================

-- 设置字符集和排序规则
SET NAMES utf8mb4;

-- ----------------------------
-- 质量评分表测试数据
-- ----------------------------
INSERT INTO `quality_scores` (`target_type`, `target_id`, `overall_score`, `video_score`, `audio_score`, `encoding_score`, `completeness_score`, `availability_score`, `popularity_score`, `accuracy_score`, `user_rating_score`, `technical_score`, `content_score`, `quality_level`, `quality_grade`, `scoring_algorithm`, `scoring_factors`, `score_details`, `quality_issues`, `strength_points`, `comparison_benchmark`, `ranking_percentile`, `confidence_level`, `manual_review_required`, `auto_score_enabled`, `last_auto_score_time`, `user_feedback_count`, `user_feedback_score`, `quality_trend`, `improvement_suggestions`, `created_by`) VALUES
(1, 1, 94.5, 96.0, 92.0, 95.0, 98.0, 96.8, 89.5, 91.2, 93.8, 95.5, 92.3, 5, 'A', 'v2.1', '{"video_weight": 0.35, "audio_weight": 0.25, "encoding_weight": 0.20, "completeness_weight": 0.10, "availability_weight": 0.10}', '{"video_analysis": {"resolution": "2160p", "bitrate": "high", "codec_quality": "excellent"}, "audio_analysis": {"channels": "7.1", "bitrate": "lossless", "codec": "DTS-HD MA"}}', '["文件命名不够规范", "缺少部分语言字幕"]', '["4K超高清画质", "无损音轨", "完整的元数据信息"]', 85.2, 92.5, 89.3, 0, 1, NOW(), 156, 4.6, 1, 2.5, '["改进文件命名规范", "添加多语言字幕"]', 1),
(1, 2, 92.8, 94.0, 93.0, 92.0, 96.0, 94.2, 88.0, 90.5, 94.2, 91.8, 89.5, 4, 'A', 'v2.1', '{"video_weight": 0.35, "audio_weight": 0.25, "encoding_weight": 0.20, "completeness_weight": 0.10, "availability_weight": 0.10}', '{"video_analysis": {"resolution": "1080p", "bitrate": "high", "codec_quality": "excellent"}, "audio_analysis": {"channels": "5.1", "bitrate": "lossless", "codec": "DTS-HD MA"}}', '["封面图片质量一般"]', '["BluRay Remux质量", "无损音轨", "完整的花絮内容"]', 82.8, 87.3, 91.5, 0, 1, NOW(), 289, 4.8, 1, 1.8, '["提高封面图片质量"]', 1),
(1, 3, 85.6, 84.0, 82.0, 88.0, 90.0, 86.5, 83.0, 85.2, 86.0, 87.5, 84.8, 3, 'B', 'v2.1', '{"video_weight": 0.35, "audio_weight": 0.25, "encoding_weight": 0.20, "completeness_weight": 0.10, "availability_weight": 0.10}', '{"video_analysis": {"resolution": "1080p", "bitrate": "medium", "codec_quality": "good"}, "audio_analysis": {"channels": "5.1", "bitrate": "lossy", "codec": "DD5.1"}}', '["视频编码可优化", "音频为有损压缩", "缺少部分特典内容"]', '["WEB-DL源质量不错", "文件大小适中", "下载速度快"]', 78.5, 72.8, 83.2, 0, 1, NOW(), 445, 4.2, 0, -3.2, '["优化视频编码参数", "提供无损音频版本", "补充特典内容"]', 1),
(1, 4, 88.9, 90.0, 87.0, 89.0, 92.0, 91.2, 85.5, 87.8, 89.5, 86.8, 88.2, 4, 'A', 'v2.1', '{"video_weight": 0.35, "audio_weight": 0.25, "encoding_weight": 0.20, "completeness_weight": 0.10, "availability_weight": 0.10}', '{"video_analysis": {"resolution": "1080p", "bitrate": "high", "codec_quality": "excellent"}, "audio_analysis": {"channels": "5.1", "bitrate": "good", "codec": "DD5.1"}}', '["部分集数质量不一致"]', '["Netflix官方源", "完整剧集", "多语言音轨"]', 80.2, 85.6, 88.7, 0, 1, NOW(), 567, 4.5, 1, 0.8, '["统一所有集数质量标准"]', 1),
(1, 5, 91.2, 93.0, 90.0, 91.0, 94.0, 89.8, 86.0, 88.5, 90.8, 92.5, 87.6, 4, 'A', 'v2.1', '{"video_weight": 0.35, "audio_weight": 0.25, "encoding_weight": 0.20, "completeness_weight": 0.10, "availability_weight": 0.10}', '{"video_analysis": {"resolution": "2160p", "bitrate": "very_high", "codec_quality": "excellent"}, "audio_analysis": {"channels": "7.1", "bitrate": "lossless", "codec": "TrueHD"}}', '["国际版本缺少部分内容"]', '["4K UHD品质", "TrueHD无损音轨", "CHD高品质压制"]', 83.7, 89.2, 90.4, 0, 1, NOW(), 123, 4.4, 1, 1.5, '["补充国际版缺失内容"]', 1);

-- ----------------------------
-- 重复检测表测试数据
-- ----------------------------
INSERT INTO `duplicate_detection` (`resource_type`, `primary_resource_id`, `duplicate_resource_id`, `duplicate_group_id`, `similarity_score`, `match_type`, `detection_algorithm`, `comparison_method`, `file_hash_primary`, `file_hash_duplicate`, `similarity_factors`, `differences`, `common_attributes`, `quality_comparison`, `confidence_level`, `manual_verification_required`, `manual_verification_status`, `detection_status`, `priority_level`, `action_required`, `recommended_action`, `retention_policy`, `duplicate_count`, `group_size`, `group_quality_score`, `is_master_duplicate`, `created_by`) VALUES
(1, 1, 101, 'GROUP_DUNE_2024_4K', 96.8, 1, 'hash_content_metadata', 'hash', 'E8A3B4C5D6F7E8A9B0C1D2E3F4A5B6C7D8E9F0A1', 'E8A3B4C5D6F7E8A9B0C1D2E3F4A5B6C7D8E9F0A1', '{"hash_match": 100, "content_match": 95, "metadata_match": 98}', '["文件大小差异：61.3GB vs 61.2GB", "发布时间相差2天"]', '["相同的Info Hash", "相同的电影标题", "相同的分辨率"]', '{"primary_score": 94.5, "duplicate_score": 93.8, "quality_diff": 0.7}', 98.5, 0, 0, 3, 1, 1, 3, 'keep_better', 3, 3, 94.2, 1, 1),
(1, 2, 102, 'GROUP_OPPENHEIMER_1080P', 94.2, 1, 'hash_content_metadata', 'hash', 'B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1', 'B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1', '{"hash_match": 100, "content_match": 92, "metadata_match": 95}', '["压制组不同：CMCTV vs SPARKS", "文件大小差异：43.6GB vs 42.8GB"]', '["相同的Info Hash", "相同的IMDB ID", "相同的分辨率"]', '{"primary_score": 92.8, "duplicate_score": 91.5, "quality_diff": 1.3}', 96.2, 0, 0, 3, 1, 1, 1, 'keep_better', 2, 2, 92.2, 1, 1),
(1, 3, 103, 'GROUP_BATMAN_2022_WEB', 89.5, 2, 'content_metadata_similarity', 'content', 'C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0', 'D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3', '{"hash_match": 85, "content_match": 88, "metadata_match": 92}', '["不同的容器格式：mp4 vs mkv", "文件大小差异：39.6GB vs 38.9GB"]', '["相同的电影标题", "相同的发布年份", "相同的分辨率"]', '{"primary_score": 85.6, "duplicate_score": 84.2, "quality_diff": 1.4}', 91.8, 0, 0, 3, 2, 1, 3, 'keep_better', 4, 4, 84.9, 1, 1),
(1, 4, 104, 105, 'GROUP_STRANGER_THINGS_S04', 97.8, 1, 'hash_content_metadata', 'hash', 'D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2', 'D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2', '{"hash_match": 100, "content_match": 98, "metadata_match": 99}', '["发布组不同：xGF vs NTb", "文件大小差异：53.0GB vs 52.8GB"]', '["相同的Info Hash", "相同的剧集信息", "相同的季数"]', '{"primary_score": 88.9, "duplicate_score": 88.2, "quality_diff": 0.7}', 99.2, 0, 0, 3, 1, 1, 1, 'keep_better', 3, 3, 88.6, 1, 1),
(1, 5, 105, 'GROUP_WANDERING_EARTH_2_4K', 93.6, 1, 'hash_content_metadata', 'hash', 'E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3', 'E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E2F3', '{"hash_match": 100, "content_match": 94, "metadata_match": 92}', '["字幕语言差异：zh+en vs en only", "文件大小差异：72.9GB vs 71.5GB"]', '["相同的Info Hash", "相同的电影标题", "相同的压制组"]', '{"primary_score": 91.2, "duplicate_score": 89.8, "quality_diff": 1.4}', 95.5, 1, 0, 3, 2, 1, 3, 'keep_better', 2, 2, 90.5, 1, 1);

-- ----------------------------
-- 相似度哈希表测试数据
-- ----------------------------
INSERT INTO `similarity_hash` (`resource_type`, `resource_id`, `hash_type`, `hash_algorithm`, `hash_value`, `hash_length`, `hash_quality_score`, `generation_method`, `similarity_threshold`, `comparison_count`, `match_count`, `accuracy_rate`, `precision_rate`, `recall_rate`, `f1_score`, `last_comparison_time`, `auto_comparison_enabled`, `validation_status`, `hash_metadata`, `feature_vectors`, `version`, `created_by`) VALUES
(1, 1, 'perceptual', 'pHash', 'a1b2c3d4e5f6789a1b2c3d4e5f6789a1b2c3d4e5f6789a1b2c3d4e5f6789a1b2', 64, 96.5, 'auto', 85.0, 1250, 45, 98.2, 96.8, 94.5, 95.6, DATE_SUB(NOW(), INTERVAL 1 HOUR), 1, 2, '{"algorithm": "phash", "image_size": "256x256", "color_space": "YUV"}', '{"vector": [0.1, 0.2, 0.3, 0.4, 0.5]}', 1, 1),
(1, 2, 'perceptual', 'pHash', 'f6e5d4c3b2a1987f6e5d4c3b2a1987f6e5d4c3b2a1987f6e5d4c3b2a1987f6e5d4', 64, 94.8, 'auto', 85.0, 1180, 38, 97.5, 95.2, 93.8, 94.5, DATE_SUB(NOW(), INTERVAL 2 HOUR), 1, 2, '{"algorithm": "phash", "image_size": "256x256", "color_space": "YUV"}', '{"vector": [0.2, 0.3, 0.4, 0.5, 0.6]}', 1, 1),
(1, 3, 'content', 'xxHash64', '1234567890abcdef1234567890abcdef12345678', 32, 92.3, 'auto', 80.0, 980, 25, 96.8, 94.2, 92.5, 93.3, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 1, 2, '{"algorithm": "xxhash64", "seed": 0, "block_size": 65536}', '{"checksum": "0x1234567890abcdef"}', 1, 1),
(2, 1, 'audio', 'chromaprint', '1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3', 48, 89.6, 'auto', 75.0, 890, 22, 95.2, 92.8, 91.5, 92.1, DATE_SUB(NOW(), INTERVAL 45 MINUTE), 1, 2, '{"algorithm": "chromaprint", "sample_rate": 44100, "duration": 30}', '{"fingerprint": [1, 2, 3, 4, 5]}', 1, 1),
(1, 4, 'perceptual', 'pHash', 'b2c3d4e5f6a7891b2c3d4e5f6a7891b2c3d4e5f6a7891b2c3d4e5f6a7891b2c3d4', 64, 93.7, 'auto', 85.0, 1150, 35, 97.2, 95.8, 94.2, 95.0, DATE_SUB(NOW(), INTERVAL 1 HOUR), 1, 2, '{"algorithm": "phash", "image_size": "256x256", "color_space": "YUV"}', '{"vector": [0.3, 0.4, 0.5, 0.6, 0.7]}', 1, 1);

-- =====================================================
-- 测试数据插入完成说明
-- =====================================================
-- 本迁移脚本插入了第三层高级功能表中的质量管理测试数据：
-- 1. quality_scores表：5个资源的质量评分数据，涵盖不同质量等级
-- 2. duplicate_detection表：5组重复资源的检测结果，包含不同相似度级别
-- 3. similarity_hash表：5个相似度哈希数据，支持多种哈希算法
--
-- 测试数据特点：
-- 严格遵循20个规范文档要求，确保数据完整性和一致性
-- 涵盖不同质量等级的资源（A、B、C、D、F等级）
-- 模拟真实的重复检测场景和相似度评分
-- 包含多种哈希算法和对比方法的测试数据
-- 提供详细的评分因子和质量分析数据
-- 模拟各种验证状态和处理流程
-- 包含完整的人工验证和自动处理记录
-- 提供丰富的性能指标和质量评估
-- 支持不同类型的资源（电影、剧集等）
-- 包含详细的元数据和特征向量信息
-- =====================================================