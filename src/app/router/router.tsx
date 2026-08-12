import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
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
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      // The view is part of the path and the day is a query param, so any
      // screen can be linked to: /calendar/day?date=2026-08-11
      {
        path: 'calendar/:view',
        element: (
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        ),
      },
      { path: 'calendar', element: <Navigate to="/calendar/month" replace /> },
      {
        path: 'convert',
        element: (
          <ProtectedRoute>
            <ConverterPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'holidays',
        element: (
          <ProtectedRoute>
            <HolidaysPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      { path: 'auth/login', element: <LoginPage /> },
      { path: 'auth/signup', element: <SignupPage /> },
      {
        path: 'diary',
        element: (
          <ProtectedRoute>
            <DiaryListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'diary/categories',
        element: (
          <ProtectedRoute>
            <DiaryCategoriesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'diary/new',
        element: (
          <ProtectedRoute>
            <DiaryEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'diary/:id',
        element: (
          <ProtectedRoute>
            <DiaryDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'diary/:id/edit',
        element: (
          <ProtectedRoute>
            <DiaryEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'diary/analytics',
        element: (
          <ProtectedRoute>
            <DiaryAnalyticsPage />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
