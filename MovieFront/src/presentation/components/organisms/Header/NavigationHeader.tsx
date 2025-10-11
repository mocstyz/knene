import { Button, Icon, HamburgerButton } from '@components/atoms'
import { SimpleThemeToggle } from '@components/molecules'
import { MobileNavigationDrawer } from '@components/molecules/MobileNavigationDrawer'
import { NavigationMenu } from '@components/molecules/NavigationMenu'
import { pageConfigs } from '@components/molecules/NavigationMenu/designTokens'
import { useMobileNavigation } from '@hooks/useMobileNavigation'
import { forwardRef } from 'react'

// NavigationHeader组件属性
export interface NavigationHeaderProps {
  currentPage?: keyof typeof pageConfigs
  showSearch?: boolean
  showAuth?: boolean
  logoText?: string
  logoIcon?: string
  searchPlaceholder?: string
  loginText?: string
  registerText?: string
  className?: string
}

/**
 * NavigationHeader有机体组件
 *
 * DDD架构中的有机体组件，管理：
 * - 网站标识区域
 * - 主导航菜单
 * - 搜索功能
 * - 用户认证区域
 *
 * 特点：
 * - 完整的业务功能
 * - 高度可配置
 * - 响应式设计
 * - 组件复用最大化
 */
export const NavigationHeader = forwardRef<HTMLElement, NavigationHeaderProps>(
  (
    {
      currentPage = 'home',
      showSearch = true,
      showAuth = true,
      logoText = 'Knene',
      logoIcon = 'movie',
      searchPlaceholder = 'Search...',
      loginText = 'Log In',
      registerText = 'Register',
      className = '',
    },
    ref
  ) => {
    const config = pageConfigs[currentPage]
    const mobileNav = useMobileNavigation()

    return (
      <>
        <header
          ref={ref}
          id="site-header"
          className={`fixed left-0 right-0 top-0 z-40 bg-transparent transition-colors duration-300 ${className}`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* 左侧：Logo + 桌面端导航菜单 */}
              <div className="flex items-center space-x-8">
                {/* Logo区域 */}
                <div className="flex items-center space-x-2">
                  <Icon name={logoIcon} className="text-[#6EE7B7]" />
                  <span className="text-xl font-bold">{logoText}</span>
                </div>

                {/* 桌面端主导航菜单 - 1024px及以上显示 */}
                <div className="hidden lg:flex">
                  <NavigationMenu
                    currentPage={currentPage}
                    theme={config.theme}
                    size={config.size}
                  />
                </div>
              </div>

              {/* 右侧：搜索 + 认证 + 移动端菜单按钮 */}
              <div className="flex items-center space-x-4">
                {/* 桌面端搜索框 - 640px及以上显示 */}
                {showSearch && (
                  <div className="relative hidden sm:block lg:block">
                    <Icon
                      name="search"
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300"
                    />
                    <input
                      className="focus:border-accent-11 focus:ring-accent-7 h-9 w-48 rounded-lg border-none bg-gray-200 px-10 text-sm dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-300"
                      placeholder={searchPlaceholder}
                      type="text"
                    />
                  </div>
                )}

                {/* 桌面端认证区域 - 640px及以上显示 */}
                {showAuth && (
                  <div className="hidden items-center space-x-4 sm:flex lg:flex">
                    <a
                      className="inline-flex h-9 items-center justify-center rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                      href="#login"
                    >
                      {loginText}
                    </a>
                    <Button variant="primary" size="sm" className="h-9">
                      {registerText}
                    </Button>
                    {/* 主题切换按钮 */}
                    <SimpleThemeToggle
                      showText={false}
                      size="1"
                      variant="ghost"
                      className="ml-2 h-9 w-9 rounded-full bg-white/20 p-0 backdrop-blur-sm hover:bg-white/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 [&_svg]:stroke-gray-700 dark:[&_svg]:stroke-green-400"
                    />
                  </div>
                )}

                {/* 移动端汉堡菜单按钮 - 1024px以下显示 */}
                <div className="lg:hidden">
                  <HamburgerButton
                    isOpen={mobileNav.isOpen}
                    onClick={mobileNav.toggleMenu}
                    size="md"
                    ariaLabel={
                      mobileNav.isOpen ? '关闭导航菜单' : '打开导航菜单'
                    }
                    className="rounded-full bg-white/20 p-0 backdrop-blur-sm hover:bg-white/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/30 [&_svg]:stroke-gray-700 dark:[&_svg]:stroke-green-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 移动端导航抽屉 - 通过props传递状态 */}
        <MobileNavigationDrawer
          isOpen={mobileNav.isOpen}
          onClose={mobileNav.closeMenu}
          showSearch={showSearch}
          showAuth={showAuth}
          searchPlaceholder={searchPlaceholder}
          loginText={loginText}
          registerText={registerText}
          currentPage={currentPage}
        />
      </>
    )
  }
)

NavigationHeader.displayName = 'NavigationHeader'

export default NavigationHeader
