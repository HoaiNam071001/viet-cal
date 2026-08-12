import { Outlet, useLocation } from 'react-router-dom'
import { shouldShowMobileNav } from '@/app/config/navigation'
import { useAuth } from '@/app/providers/AuthProvider'
import { InstallPrompt } from '@/features/pwa/components/InstallPrompt'
import { cn } from '@/shared/utils/cn'
import { AppHeader } from './AppHeader'
import { BottomNav } from './BottomNav'

/** Header + page + mobile bottom navigation. Pages own their own sidebars. */
export function AppShell() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const showMobileNav = shouldShowMobileNav(pathname, Boolean(user))

  return (
    <div className="min-h-svh">
      <AppHeader />
      <main className={cn('mx-auto w-full max-w-[1240px] px-3 pt-4 sm:px-6 lg:pb-10', showMobileNav ? 'pb-24' : 'pb-6')}>
        <Outlet />
      </main>
      <BottomNav />
      <InstallPrompt />
    </div>
  )
}
