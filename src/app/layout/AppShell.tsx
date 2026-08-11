import { Outlet } from 'react-router-dom'
import { InstallPrompt } from '@/features/pwa/components/InstallPrompt'
import { AppHeader } from './AppHeader'
import { BottomNav } from './BottomNav'

/** Header + page + mobile bottom navigation. Pages own their own sidebars. */
export function AppShell() {
  return (
    <div className="min-h-svh">
      <AppHeader />
      <main className="mx-auto w-full max-w-[1240px] px-3 pt-4 pb-24 sm:px-6 lg:pb-10">
        <Outlet />
      </main>
      <BottomNav />
      <InstallPrompt />
    </div>
  )
}
