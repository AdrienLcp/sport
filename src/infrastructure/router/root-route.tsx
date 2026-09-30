import { AriaRouterProvider } from '@adrienlcp/react-router'
import type React from 'react'
import { Outlet } from 'react-router'

import { useReminderClock } from '@/features/reminders/use-reminder-clock'
import { AppShell } from '@/presentation/app-shell'

export const RootRoute: React.FC = () => {
  useReminderClock()

  return (
    <AriaRouterProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </AriaRouterProvider>
  )
}
