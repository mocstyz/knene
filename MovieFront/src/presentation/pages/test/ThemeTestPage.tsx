/**
 * @fileoverview 主题测试页面
 * @description 专门用于测试主题功能的页面，包含各种主题切换组件
 * 和状态显示，用于验证新的主题系统是否正常工作。
 *
 * @author mosctz
 * @since 1.0.0
 * @version 1.3.0
 */

import { useTheme, useThemeState } from '@application/hooks'
import {
  ThemeToggle,
  SimpleThemeToggle,
} from '@components/molecules/ThemeToggle'
import {
  Card,
  Flex,
  Heading,
  Text,
  Button,
  Box,
  Separator,
  Grid,
  Container,
} from '@radix-ui/themes'
import React from 'react'

// 主题测试页面组件
export const ThemeTestPage: React.FC = () => {
  const {
    theme,
    setTheme,
    isDark,
    isLoaded,
    systemTheme,
    resolvedTheme,
    availableThemes,
    getThemeLabel,
    isCurrentTheme,
  } = useTheme()

  const { getTextClass, getBackgroundClass } = useThemeState()

  // 主题未加载时显示加载状态
  if (!isLoaded) {
    return (
      <Container size="4" p="6">
        <Flex direction="column" align="center" gap="4">
          <Heading size="6">加载主题中...</Heading>
          <Text color="gray">正在初始化主题系统</Text>
        </Flex>
      </Container>
    )
  }

  return (
    <Container size="4" p="6">
      <Flex direction="column" gap="6">
        {/* 页面标题 */}
        <Box>
          <Heading size="8" mb="2">
            主题系统测试页面
          </Heading>
          <Text size="4" color="gray">
            测试新的 next-themes + Radix UI Themes 主题系统
          </Text>
        </Box>

        {/* 主题状态信息 */}
        <Card>
          <Heading size="4" mb="4">
            当前主题状态
          </Heading>
          <Grid columns="2" gap="4">
            <Box>
              <Text size="2" weight="bold">
                当前主题:
              </Text>
              <Text size="2">{getThemeLabel(theme || 'dark')}</Text>
            </Box>
            <Box>
              <Text size="2" weight="bold">
                系统主题:
              </Text>
              <Text size="2">{systemTheme === 'dark' ? '深色' : '浅色'}</Text>
            </Box>
            <Box>
              <Text size="2" weight="bold">
                实际主题:
              </Text>
              <Text size="2">{resolvedTheme === 'dark' ? '深色' : '浅色'}</Text>
            </Box>
            <Box>
              <Text size="2" weight="bold">
                是否深色:
              </Text>
              <Text size="2">{isDark ? '是' : '否'}</Text>
            </Box>
          </Grid>
        </Card>

        {/* 主题切换组件演示 */}
        <Card>
          <Heading size="4" mb="4">
            主题切换组件
          </Heading>

          <Flex direction="column" gap="4">
            {/* 下拉菜单式主题切换 */}
            <Box>
              <Text size="2" weight="bold" mb="2">
                下拉菜单式切换:
              </Text>
              <ThemeToggle />
            </Box>

            <Separator size="4" />

            {/* 简单切换按钮 */}
            <Box>
              <Text size="2" weight="bold" mb="2">
                简单切换按钮:
              </Text>
              <SimpleThemeToggle />
            </Box>

            <Separator size="4" />

            {/* 不同尺寸的主题切换按钮 */}
            <Box>
              <Text size="2" weight="bold" mb="2">
                不同尺寸:
              </Text>
              <Flex gap="2" align="center">
                <ThemeToggle size="1" />
                <ThemeToggle size="2" />
                <ThemeToggle size="3" />
                <ThemeToggle size="4" />
              </Flex>
            </Box>

            <Separator size="4" />

            {/* 不同变体的主题切换按钮 */}
            <Box>
              <Text size="2" weight="bold" mb="2">
                不同变体:
              </Text>
              <Flex gap="2" align="center">
                <ThemeToggle variant="classic" />
                <ThemeToggle variant="solid" />
                <ThemeToggle variant="soft" />
                <ThemeToggle variant="surface" />
                <ThemeToggle variant="outline" />
                <ThemeToggle variant="ghost" />
              </Flex>
            </Box>
          </Flex>
        </Card>

        {/* 手动主题选择按钮 */}
        <Card>
          <Heading size="4" mb="4">
            手动主题选择
          </Heading>
          <Flex gap="2" wrap="wrap">
            {availableThemes.map(themeOption => (
              <Button
                key={themeOption}
                variant={isCurrentTheme(themeOption) ? 'solid' : 'outline'}
                onClick={() => setTheme(themeOption)}
              >
                {getThemeLabel(themeOption)}
              </Button>
            ))}
          </Flex>
        </Card>

        {/* 主题样式展示 */}
        <Card>
          <Heading size="4" mb="4">
            主题样式展示
          </Heading>
          <Grid columns="2" gap="4">
            <Card className={getBackgroundClass('bg-gray-100', 'bg-gray-800')}>
              <Heading
                size="3"
                className={getTextClass('text-gray-900', 'text-gray-100')}
              >
                卡片标题
              </Heading>
              <Text className={getTextClass('text-gray-600', 'text-gray-400')}>
                这是一段测试文本，用于展示主题切换时的文字颜色变化。
              </Text>
            </Card>

            <Card className={getBackgroundClass('bg-blue-50', 'bg-blue-900')}>
              <Heading
                size="3"
                className={getTextClass('text-blue-900', 'text-blue-100')}
              >
                蓝色主题卡片
              </Heading>
              <Text className={getTextClass('text-blue-700', 'text-blue-300')}>
                蓝色主题的文本内容展示。
              </Text>
            </Card>
          </Grid>
        </Card>

        {/* Radix UI 组件展示 */}
        <Card>
          <Heading size="4" mb="4">
            Radix UI 组件主题展示
          </Heading>
          <Flex direction="column" gap="4">
            <Flex gap="2">
              <Button>默认按钮</Button>
              <Button variant="solid">实心按钮</Button>
              <Button variant="soft">柔和按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
            </Flex>

            <Flex gap="2">
              <Button color="red">红色</Button>
              <Button color="green">绿色</Button>
              <Button color="blue">蓝色</Button>
              <Button color="yellow">黄色</Button>
              <Button color="purple">紫色</Button>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </Container>
  )
}

export default ThemeTestPage
