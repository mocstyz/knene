/**
 * @fileoverview 标签样式测试页面
 * @description 用于验证评分标签、VIP标签和质量标签的样式修改
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 */

import { QualityBadgeLayer, RatingBadgeLayer, VipBadgeLayer } from '@components/layers'
import { getOverlayGradient } from '@tokens/design-system'
import React from 'react'

/**
 * 标签样式测试页面
 */
const BadgeTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          标签样式测试页面
        </h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* 评分标签测试 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              评分标签测试
            </h2>

            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700">
              <div className={`absolute inset-0 ${getOverlayGradient('medium')}`}></div>
              <RatingBadgeLayer rating={8.7} position="bottom-left" />
              <div className="absolute bottom-8 left-8 text-white">
                <p>高评分 (8.7)</p>
              </div>
            </div>

            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700">
              <div className={`absolute inset-0 ${getOverlayGradient('medium')}`}></div>
              <RatingBadgeLayer rating={6.5} position="bottom-left" />
              <div className="absolute bottom-8 left-8 text-white">
                <p>中等评分 (6.5)</p>
              </div>
            </div>

            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700">
              <div className={`absolute inset-0 ${getOverlayGradient('medium')}`}></div>
              <RatingBadgeLayer rating={9.2} position="bottom-left" />
              <div className="absolute bottom-8 left-8 text-white">
                <p>极高评分 (9.2)</p>
              </div>
            </div>
          </div>

          {/* VIP标签测试 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              VIP标签测试
            </h2>

            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700">
              <div className={`absolute inset-0 ${getOverlayGradient('medium')}`}></div>
              <VipBadgeLayer isVip={true} position="bottom-right" />
              <div className="absolute bottom-8 right-8 text-white">
                <p>VIP内容</p>
              </div>
            </div>

            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700">
              <div className={`absolute inset-0 ${getOverlayGradient('medium')}`}></div>
              <VipBadgeLayer isVip={true} position="top-right" text="VIP+" />
              <div className="absolute right-8 top-8 text-white">
                <p>VIP+内容</p>
              </div>
            </div>
          </div>

          {/* 质量标签测试 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              质量标签测试
            </h2>

            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700">
              <div className={`absolute inset-0 ${getOverlayGradient('medium')}`}></div>
              <QualityBadgeLayer quality="4K" position="top-left" />
              <div className="absolute left-8 top-8 text-white">
                <p>4K质量</p>
              </div>
            </div>

            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700">
              <div className={`absolute inset-0 ${getOverlayGradient('medium')}`}></div>
              <QualityBadgeLayer quality="HD" position="top-left" />
              <div className="absolute left-8 top-8 text-white">
                <p>HD质量</p>
              </div>
            </div>

            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700">
              <div className={`absolute inset-0 ${getOverlayGradient('medium')}`}></div>
              <QualityBadgeLayer quality="蓝光" position="top-left" />
              <div className="absolute left-8 top-8 text-white">
                <p>蓝光质量</p>
              </div>
            </div>
          </div>
        </div>

        {/* 样式对比说明 */}
        <div className="mt-12 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            样式修改说明
          </h3>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              ✅ <strong>字体粗细</strong>：从 font-medium 改为 font-bold
            </p>
            <p>
              ✅ <strong>评分颜色</strong>：红色系调整为
              text-red-500，紫色系调整为 text-purple-400
            </p>
            <p>
              ✅ <strong>其他颜色</strong>：调整为与hot模块一致的颜色值
            </p>
            <p>
              ✅ <strong>基础样式</strong>：保持 px-2 py-1 rounded-md
              bg-black/70 的基础样式
            </p>
            <p>
              ✅ <strong>响应式设计</strong>：保持移动端优先的响应式设计
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BadgeTestPage
