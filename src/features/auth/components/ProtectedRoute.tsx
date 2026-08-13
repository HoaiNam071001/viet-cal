import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { ROUTES } from '@/app/config/routes'

/** Redirects to /auth/login when signed out; renders nothing while the session check is in flight. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return null
  if (!user) return <Navigate to={ROUTES.authLogin} replace state={{ from: location.pathname }} />
  return children
}
