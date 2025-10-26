/**
 * @fileoverview VIP数据流E2E测试
 * @description 测试从首页卡片到详情页的完整VIP链路，验证标签显示的一致性
 * @author mosctz
 * @since 1.0.0
 * @version 1.0.0
 * 
 * 注意：这些测试需要实际运行应用程序才能执行
 * 运行命令：pnpm test:e2e
 */

import { test, expect } from '@playwright/test'

test.describe('VIP数据流E2E测试 - 合集完整链路', () => {
  test.beforeEach(async ({ page }) => {
    // 访问首页
    await page.goto('/')
    // 等待页面加载完成
    await page.waitForLoadState('networkidle')
  })

  test('应该在首页显示合集卡片的VIP标签', async ({ page }) => {
    // 查找合集模块
    const collectionSection = page.locator('[data-testid="collections-section"]')
    await expect(collectionSection).toBeVisible()

    // 查找第一个合集卡片
    const firstCollection = collectionSection.locator('[data-testid="collection-card"]').first()
    await expect(firstCollection).toBeVisible()

    // 验证VIP标签存在
    const vipBadge = firstCollection.locator('[data-testid="vip-badge"]')
    await expect(vipBadge).toBeVisible()
  })

  test('应该在合集影片列表页显示所有影片的VIP标签', async ({ page }) => {
    // 点击第一个合集卡片
    const collectionSection = page.locator('[data-testid="collections-section"]')
    const firstCollection = collectionSection.locator('[data-testid="collection-card"]').first()
    await firstCollection.click()

    // 等待导航到合集影片列表页
    await page.waitForURL(/\/collections\/.*/)
    await page.waitForLoadState('networkidle')

    // 验证所有影片卡片都显示VIP标签
    const movieCards = page.locator('[data-testid="movie-card"]')
    const count = await movieCards.count()
    
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const movieCard = movieCards.nth(i)
      const vipBadge = movieCard.locator('[data-testid="vip-badge"]')
      await expect(vipBadge).toBeVisible()
    }
  })

  test('应该在影片详情页显示VIP专属样式', async ({ page }) => {
    // 点击第一个合集卡片
    const collectionSection = page.locator('[data-testid="collections-section"]')
    const firstCollection = collectionSection.locator('[data-testid="collection-card"]').first()
    await firstCollection.click()

    // 等待导航到合集影片列表页
    await page.waitForURL(/\/collections\/.*/)
    await page.waitForLoadState('networkidle')

    // 点击第一个影片卡片
    const firstMovie = page.locator('[data-testid="movie-card"]').first()
    await firstMovie.click()

    // 等待导航到影片详情页
    await page.waitForURL(/\/movies\/.*/)
    await page.waitForLoadState('networkidle')

    // 验证金色渐变VIP下载按钮
    const vipDownloadButton = page.locator('[data-testid="vip-download-button"]')
    await expect(vipDownloadButton).toBeVisible()
    
    // 验证按钮有金色渐变样式
    const buttonClass = await vipDownloadButton.getAttribute('class')
    expect(buttonClass).toContain('gradient') // 假设金色渐变按钮有gradient类

    // 验证资源信息标题后的金色渐变VIP标签
    const resourceVipBadge = page.locator('[data-testid="resource-vip-badge"]')
    await expect(resourceVipBadge).toBeVisible()
  })

  test('应该在整个链路中保持VIP标识的一致性', async ({ page }) => {
    // 1. 首页合集卡片
    const collectionSection = page.locator('[data-testid="collections-section"]')
    const firstCollection = collectionSection.locator('[data-testid="collection-card"]').first()
    
    // 验证首页合集有VIP标签
    const collectionVipBadge = firstCollection.locator('[data-testid="vip-badge"]')
    await expect(collectionVipBadge).toBeVisible()
    
    // 获取合集标题用于后续验证
    const collectionTitle = await firstCollection.locator('[data-testid="collection-title"]').textContent()
    
    await firstCollection.click()

    // 2. 合集影片列表页
    await page.waitForURL(/\/collections\/.*/)
    await page.waitForLoadState('networkidle')

    // 验证页面标题包含合集名称
    const pageTitle = await page.locator('h1').textContent()
    expect(pageTitle).toContain(collectionTitle || '')

    // 验证所有影片都有VIP标签
    const movieCards = page.locator('[data-testid="movie-card"]')
    const movieCount = await movieCards.count()
    expect(movieCount).toBeGreaterThan(0)

    const firstMovie = movieCards.first()
    const movieVipBadge = firstMovie.locator('[data-testid="vip-badge"]')
    await expect(movieVipBadge).toBeVisible()

    await firstMovie.click()

    // 3. 影片详情页
    await page.waitForURL(/\/movies\/.*/)
    await page.waitForLoadState('networkidle')

    // 验证VIP专属样式
    const vipDownloadButton = page.locator('[data-testid="vip-download-button"]')
    await expect(vipDownloadButton).toBeVisible()

    const resourceVipBadge = page.locator('[data-testid="resource-vip-badge"]')
    await expect(resourceVipBadge).toBeVisible()
  })
})

test.describe('VIP数据流E2E测试 - 写真完整链路', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('应该在首页显示写真卡片的VIP标签', async ({ page }) => {
    // 查找写真模块
    const photoSection = page.locator('[data-testid="photos-section"]')
    await expect(photoSection).toBeVisible()

    // 查找第一个写真卡片
    const firstPhoto = photoSection.locator('[data-testid="photo-card"]').first()
    await expect(firstPhoto).toBeVisible()

    // 验证VIP标签存在
    const vipBadge = firstPhoto.locator('[data-testid="vip-badge"]')
    await expect(vipBadge).toBeVisible()
  })

  test('应该在写真列表页显示所有写真的VIP标签', async ({ page }) => {
    // 点击"更多"按钮进入写真列表页
    const photoSection = page.locator('[data-testid="photos-section"]')
    const moreButton = photoSection.locator('[data-testid="more-button"]')
    await moreButton.click()

    // 等待导航到写真列表页
    await page.waitForURL(/\/photos/)
    await page.waitForLoadState('networkidle')

    // 验证所有写真卡片都显示VIP标签
    const photoCards = page.locator('[data-testid="photo-card"]')
    const count = await photoCards.count()
    
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < Math.min(count, 10); i++) { // 只检查前10个
      const photoCard = photoCards.nth(i)
      const vipBadge = photoCard.locator('[data-testid="vip-badge"]')
      await expect(vipBadge).toBeVisible()
    }
  })

  test('应该在写真详情页显示VIP专属样式', async ({ page }) => {
    // 点击第一个写真卡片
    const photoSection = page.locator('[data-testid="photos-section"]')
    const firstPhoto = photoSection.locator('[data-testid="photo-card"]').first()
    await firstPhoto.click()

    // 等待导航到写真详情页
    await page.waitForURL(/\/photos\/.*/)
    await page.waitForLoadState('networkidle')

    // 验证金色渐变VIP下载按钮
    const vipDownloadButton = page.locator('[data-testid="vip-download-button"]')
    await expect(vipDownloadButton).toBeVisible()

    // 验证资源信息标题后的金色渐变VIP标签
    const resourceVipBadge = page.locator('[data-testid="resource-vip-badge"]')
    await expect(resourceVipBadge).toBeVisible()
  })
})

test.describe('VIP数据流E2E测试 - 普通影片链路', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('应该在首页显示普通影片卡片（无VIP标签）', async ({ page }) => {
    // 查找最新更新模块
    const latestSection = page.locator('[data-testid="latest-updates-section"]')
    await expect(latestSection).toBeVisible()

    // 查找影片卡片（非VIP）
    const movieCards = latestSection.locator('[data-testid="movie-card"]')
    const count = await movieCards.count()
    
    expect(count).toBeGreaterThan(0)

    // 查找第一个没有VIP标签的影片
    let foundNonVipMovie = false
    for (let i = 0; i < count; i++) {
      const movieCard = movieCards.nth(i)
      const vipBadge = movieCard.locator('[data-testid="vip-badge"]')
      
      if (await vipBadge.count() === 0) {
        foundNonVipMovie = true
        break
      }
    }

    expect(foundNonVipMovie).toBe(true)
  })

  test('应该在普通影片详情页显示普通样式（绿色下载按钮）', async ({ page }) => {
    // 查找最新更新模块
    const latestSection = page.locator('[data-testid="latest-updates-section"]')
    const movieCards = latestSection.locator('[data-testid="movie-card"]')
    const count = await movieCards.count()

    // 查找并点击第一个没有VIP标签的影片
    for (let i = 0; i < count; i++) {
      const movieCard = movieCards.nth(i)
      const vipBadge = movieCard.locator('[data-testid="vip-badge"]')
      
      if (await vipBadge.count() === 0) {
        await movieCard.click()
        break
      }
    }

    // 等待导航到影片详情页
    await page.waitForURL(/\/movies\/.*/)
    await page.waitForLoadState('networkidle')

    // 验证绿色下载按钮（非VIP样式）
    const downloadButton = page.locator('[data-testid="download-button"]')
    await expect(downloadButton).toBeVisible()
    
    // 验证按钮有绿色样式
    const buttonClass = await downloadButton.getAttribute('class')
    expect(buttonClass).toContain('green') // 假设绿色按钮有green类

    // 验证资源信息标题后没有VIP标签
    const resourceVipBadge = page.locator('[data-testid="resource-vip-badge"]')
    await expect(resourceVipBadge).not.toBeVisible()
  })
})

test.describe('VIP数据流E2E测试 - 混合内容列表', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('应该在最新更新模块正确显示VIP标签', async ({ page }) => {
    // 查找最新更新模块
    const latestSection = page.locator('[data-testid="latest-updates-section"]')
    await expect(latestSection).toBeVisible()

    // 获取所有内容卡片
    const contentCards = latestSection.locator('[data-testid*="-card"]')
    const count = await contentCards.count()
    
    expect(count).toBeGreaterThan(0)

    // 验证合集和写真都有VIP标签
    for (let i = 0; i < Math.min(count, 10); i++) {
      const card = contentCards.nth(i)
      const cardType = await card.getAttribute('data-testid')
      
      if (cardType?.includes('collection') || cardType?.includes('photo')) {
        const vipBadge = card.locator('[data-testid="vip-badge"]')
        await expect(vipBadge).toBeVisible()
      }
    }
  })

  test('应该在热门模块正确显示VIP标签', async ({ page }) => {
    // 查找热门模块
    const hotSection = page.locator('[data-testid="hot-section"]')
    await expect(hotSection).toBeVisible()

    // 获取所有内容卡片
    const contentCards = hotSection.locator('[data-testid*="-card"]')
    const count = await contentCards.count()
    
    expect(count).toBeGreaterThan(0)

    // 验证合集和写真都有VIP标签
    for (let i = 0; i < Math.min(count, 10); i++) {
      const card = contentCards.nth(i)
      const cardType = await card.getAttribute('data-testid')
      
      if (cardType?.includes('collection') || cardType?.includes('photo')) {
        const vipBadge = card.locator('[data-testid="vip-badge"]')
        await expect(vipBadge).toBeVisible()
      }
    }
  })

  test('应该从混合列表进入合集影片列表时保持VIP继承', async ({ page }) => {
    // 查找最新更新模块
    const latestSection = page.locator('[data-testid="latest-updates-section"]')
    
    // 查找并点击第一个合集卡片
    const collectionCard = latestSection.locator('[data-testid="collection-card"]').first()
    await collectionCard.click()

    // 等待导航到合集影片列表页
    await page.waitForURL(/\/collections\/.*/)
    await page.waitForLoadState('networkidle')

    // 验证所有影片都有VIP标签
    const movieCards = page.locator('[data-testid="movie-card"]')
    const count = await movieCards.count()
    
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < Math.min(count, 10); i++) {
      const movieCard = movieCards.nth(i)
      const vipBadge = movieCard.locator('[data-testid="vip-badge"]')
      await expect(vipBadge).toBeVisible()
    }
  })
})
