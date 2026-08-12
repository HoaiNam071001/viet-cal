import { Moon, Search, Sun } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { APP_NAME } from '@/app/config/app.config'
import { getDesktopNavItems, isNavItemActive } from '@/app/config/navigation'
import { useAuth } from '@/app/providers/AuthProvider'
import { useTheme } from '@/app/providers/ThemeProvider'
import { UserMenu } from '@/features/auth/components/UserMenu'
import { SearchDialog } from '@/features/search/components/SearchDialog'
import { Button } from '@/shared/components/ui/Button'
import type { CivilDate } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { toKey } from '@/shared/utils/date'
import { useEffect, useState } from 'react'

export function AppHeader() {
  const { resolved, toggle } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const navItems = getDesktopNavItems(Boolean(user))

  const goToDate = (date: CivilDate) => navigate(`/calendar/day?date=${toKey(date)}`)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <header className="glass border-border sticky top-0 z-30 border-b">
        <div className="mx-auto flex h-15 max-w-[1240px] items-center gap-3 px-4 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="" width={36} height={36} className="size-9 rounded-[10px]" />
            <span className="text-text hidden text-[15px] font-semibold sm:block">{APP_NAME}</span>
          </NavLink>

          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'rounded-2xl px-3.5 py-2 text-sm font-medium transition-colors',
                  isNavItemActive(item, pathname) ? 'bg-surface-2 text-text' : 'text-muted hover:text-text',
                )}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              className="text-muted gap-2 pr-3 pl-3"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-4" />
              <span className="hidden sm:inline">Tìm kiếm</span>
              <kbd className="text-subtle border-border ml-1 hidden rounded-md border px-1.5 py-0.5 text-[10px] lg:inline">
                ⌘K
              </kbd>
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={toggle} aria-label="Đổi giao diện sáng/tối">
              {resolved === 'dark' ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
            </Button>
            <UserMenu />
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} onSelect={goToDate} />
    </>
  )
}
