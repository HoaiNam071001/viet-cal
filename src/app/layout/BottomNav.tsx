import { NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '@/app/config/navigation'
import { cn } from '@/shared/utils/cn'

/** Mobile primary navigation. Hidden from `lg` up, where the header nav takes over. */
export function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="glass border-border safe-bottom fixed inset-x-0 bottom-0 z-30 border-t lg:hidden">
      <ul className="mx-auto flex max-w-[520px]">
        {NAV_ITEMS.map((item) => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              className={cn(
                'flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                pathname.startsWith(item.match) ? 'text-primary' : 'text-subtle',
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
