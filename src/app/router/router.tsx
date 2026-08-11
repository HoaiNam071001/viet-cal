import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
import { CalendarPage } from '@/pages/CalendarPage'
import { ConverterPage } from '@/pages/ConverterPage'
import { HolidaysPage } from '@/pages/HolidaysPage'
import { SettingsPage } from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/calendar/month" replace /> },
      // The view is part of the path and the day is a query param, so any
      // screen can be linked to: /calendar/day?date=2026-08-11
      { path: 'calendar/:view', element: <CalendarPage /> },
      { path: 'calendar', element: <Navigate to="/calendar/month" replace /> },
      { path: 'convert', element: <ConverterPage /> },
      { path: 'holidays', element: <HolidaysPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/calendar/month" replace /> },
    ],
  },
])
