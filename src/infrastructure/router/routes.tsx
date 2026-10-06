import type { RouteObject } from 'react-router'

import { RouteFallback } from '@/presentation/route-fallback'

import { paths } from './navigation'
import { RootRoute } from './root-route'
import { ErrorScreen, NotFoundPage } from './route-error'

type RoutedPath = (typeof paths)[keyof typeof paths]

/**
 * Keyed by path, so a path with no page, or a page given twice, fails to
 * compile. Every page is lazy: the session download carries neither the table
 * nor the drawing tools.
 */
const pageFor = {
  [paths.devFigure]: async () => ({
    Component: (await import('@/features/figures/solo-figure-page'))
      .SoloFigurePage
  }),
  [paths.devSheet]: async () => ({
    Component: (await import('@/features/figures/contact-sheet-page'))
      .ContactSheetPage
  }),
  [paths.devStrip]: async () => ({
    Component: (await import('@/features/figures/decomposition-page'))
      .DecompositionPage
  }),
  [paths.home]: async () => ({
    Component: (await import('@/features/session/session-page')).SessionPage
  }),
  [paths.journal]: async () => ({
    Component: (await import('@/features/journal/journal-page')).JournalPage
  }),
  [paths.journalBackup]: async () => ({
    Component: (await import('@/features/journal/backup-page')).BackupPage
  }),
  [paths.journalMeasure]: async () => ({
    Component: (await import('@/features/journal/measure-page')).MeasurePage
  }),
  [paths.journalReport]: async () => ({
    Component: (await import('@/features/report/report-page')).FullReportPage
  }),
  [paths.progress]: async () => ({
    Component: (await import('@/features/progress/progress-page')).ProgressPage
  }),
  [paths.settings]: async () => {
    const [page, loader] = await Promise.all([
      import('@/features/settings/settings-page'),
      import('@/features/settings/settings-loader')
    ])

    return {
      Component: page.SettingsPage,
      loader: ({ request }) => loader.settingsLoader({ signal: request.signal })
    }
  },
  [paths.specimen]: async () => ({
    Component: (await import('@/features/specimen/specimen-page')).SpecimenPage
  }),
  [paths.sessionReport]: async () => ({
    Component: (await import('@/features/report/report-page')).EveningReportPage
  }),
  [paths.table]: async () => ({
    Component: (await import('@/features/table/table-page')).TablePage
  })
} satisfies Record<RoutedPath, RouteObject['lazy']>

const routeFor = (path: RoutedPath): RouteObject => ({
  lazy: pageFor[path],
  path
})

/** The tree rather than a router: `main.tsx` builds the browser router over it. */
export const routes: RouteObject[] = [
  {
    Component: RootRoute,
    children: [
      {
        children: [routeFor(paths.sessionReport)],
        lazy: pageFor[paths.home],
        path: paths.home
      },
      routeFor(paths.journal),
      routeFor(paths.journalMeasure),
      routeFor(paths.journalReport),
      routeFor(paths.journalBackup),
      routeFor(paths.progress),
      routeFor(paths.table),
      routeFor(paths.settings),
      routeFor(paths.specimen),
      routeFor(paths.devSheet),
      routeFor(paths.devStrip),
      routeFor(paths.devFigure),
      { Component: NotFoundPage, path: '*' }
    ],
    ErrorBoundary: ErrorScreen,
    HydrateFallback: RouteFallback
  }
]
