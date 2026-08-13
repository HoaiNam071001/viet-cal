import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
import { ROUTE_PATTERNS, ROUTES } from '@/app/config/routes'
import { CalendarPage } from '@/pages/CalendarPage'
import { HomePage } from '@/pages/HomePage'
import { ConverterPage } from '@/pages/ConverterPage'
import { HolidaysPage } from '@/pages/HolidaysPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { LoginPage } from '@/pages/Auth/LoginPage'
import { SignupPage } from '@/pages/Auth/SignupPage'
import { DiaryListPage } from '@/pages/Diary/DiaryListPage'
import { DiaryEditorPage } from '@/pages/Diary/DiaryEditorPage'
import { DiaryDetailPage } from '@/pages/Diary/DiaryDetailPage'
import { DiaryAnalyticsPage } from '@/pages/Diary/DiaryAnalyticsPage'
import { DiaryCategoriesPage } from '@/pages/Diary/DiaryCategoriesPage'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      // The view is part of the path and the day is a query param, so any
      // screen can be linked to: /calendar/day?date=2026-08-11
      {
        path: ROUTE_PATTERNS.calendarView,
        element: (
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        ),
      },
      { path: ROUTE_PATTERNS.calendarRedirect, element: <Navigate to={ROUTES.calendarMonth} replace /> },
      {
        path: ROUTE_PATTERNS.convert,
        element: (
          <ProtectedRoute>
            <ConverterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTE_PATTERNS.holidays,
        element: (
          <ProtectedRoute>
            <HolidaysPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTE_PATTERNS.settings,
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      { path: ROUTE_PATTERNS.authLogin, element: <LoginPage /> },
      { path: ROUTE_PATTERNS.authSignup, element: <SignupPage /> },
      {
        path: ROUTE_PATTERNS.diary,
        element: (
          <ProtectedRoute>
            <DiaryListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTE_PATTERNS.diaryCategories,
        element: (
          <ProtectedRoute>
            <DiaryCategoriesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTE_PATTERNS.diaryNew,
        element: (
          <ProtectedRoute>
            <DiaryEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTE_PATTERNS.diaryEntry,
        element: (
          <ProtectedRoute>
            <DiaryDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTE_PATTERNS.diaryEdit,
        element: (
          <ProtectedRoute>
            <DiaryEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTE_PATTERNS.diaryAnalytics,
        element: (
          <ProtectedRoute>
            <DiaryAnalyticsPage />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <Navigate to={ROUTES.home} replace /> },
    ],
  },
])
