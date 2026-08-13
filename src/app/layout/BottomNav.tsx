import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getMobileNavItems, isNavItemActive, shouldShowMobileNav } from '@/app/config/navigation'
import { useAuth } from '@/app/providers/AuthProvider'
import { cn } from '@/shared/utils/cn'

/** Mobile primary navigation: 3 tabs only, shown once signed in and past the landing page.
 * Hidden from `lg` up, where the header nav takes over. */
export function BottomNav() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { user } = useAuth()

  if (!shouldShowMobileNav(pathname, Boolean(user))) return null

  return (
    <nav className="glass border-border safe-bottom fixed inset-x-0 bottom-0 z-30 border-t lg:hidden">
      <ul className="mx-auto flex max-w-[560px]">
        {getMobileNavItems(t).map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              className={cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                isNavItemActive(item, pathname) ? 'text-primary' : 'text-subtle',
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
