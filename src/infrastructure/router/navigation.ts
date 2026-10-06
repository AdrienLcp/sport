import type React from 'react'
import {
  generatePath,
  isRouteErrorResponse,
  type PathParam,
  useLocation,
  useNavigate,
  useOutlet,
  useParams,
  useRouteError,
  useSearchParams
} from 'react-router'
import { z } from 'zod/mini'

import { parseFigureId } from '@/features/figures/poses'
import type { FigureId } from '@/features/program/program-types'
import { parseTablePlate, type TablePlate } from '@/features/table/table-plates'

/**
 * `sessionReport` is a child of `home`: the session page stays mounted under
 * the report, so Back lands on the plate it left — the finished session's
 * tally included — rather than on a fresh title plate.
 */
export const paths = {
  devFigure: '/dev/figure/:figureId',
  devSheet: '/dev/sheet',
  devStrip: '/dev/strip',
  home: '/',
  journal: '/journal',
  journalBackup: '/journal/backup',
  journalMeasure: '/journal/measure',
  journalReport: '/journal/report',
  progress: '/progress',
  sessionReport: '/report',
  settings: '/settings',
  specimen: '/specimen',
  table: '/table/:tablePlate?'
} as const

/**
 * `generatePath`'s own params type accepts any name in silence; a record over
 * the pattern's names makes a missing or misspelled one a compile error.
 */
const pathFor = <TPath extends string>(
  path: TPath,
  params: Record<PathParam<TPath>, string>
): string => generatePath<string>(path, params)

export const homePathFor = (): string => pathFor(paths.home, {})

export const sessionReportPathFor = (): string =>
  pathFor(paths.sessionReport, {})

export const journalPathFor = (): string => pathFor(paths.journal, {})

export const journalMeasurePathFor = (): string =>
  pathFor(paths.journalMeasure, {})

export const journalReportPathFor = (): string =>
  pathFor(paths.journalReport, {})

export const journalBackupPathFor = (): string =>
  pathFor(paths.journalBackup, {})

export const progressPathFor = (): string => pathFor(paths.progress, {})

export const settingsPathFor = (): string => pathFor(paths.settings, {})

/** Opens the specimen: a link a visitor can be sent straight to. */
export const specimenPathFor = (): string => pathFor(paths.specimen, {})

/** The count is the table's front page, so it owns the bare `/table`. */
export const tablePathFor = (plate: TablePlate): string =>
  plate === 'count'
    ? generatePath(paths.table, { tablePlate: null })
    : pathFor(paths.table, { tablePlate: plate })

export const devFigurePathFor = (figureId: FigureId): string =>
  pathFor(paths.devFigure, { figureId })

/** `null` for a segment that names no plate; no segment at all is the count. */
export const useTablePlateParam = (): TablePlate | null => {
  const { tablePlate } = useParams<PathParam<typeof paths.table>>()
  return tablePlate === undefined ? 'count' : parseTablePlate(tablePlate)
}

/** What the URL asked for, kept raw so the page can say which figure is missing. */
export const useFigureParam = (): {
  figureId: FigureId | null
  requested: string
} => {
  const { figureId } = useParams<PathParam<typeof paths.devFigure>>()
  const requested = figureId ?? ''
  return { figureId: parseFigureId(requested), requested }
}

/** `?media=<path>` puts a file in the drawing's place, for a comparison page. */
export const useMediaSearchParam = (): string | null => {
  const [searchParams] = useSearchParams()
  const media = searchParams.get('media')
  return media === '' ? null : media
}

/**
 * The router writes each entry's position into `history.state`, and a
 * `replace` keeps it: switching table plates on the first entry still reads as
 * nothing to go back to.
 */
const entryBehindSchema = z.object({ idx: z.number().check(z.positive()) })

const hasEntryBehind = (): boolean =>
  entryBehindSchema.safeParse(window.history.state).success

/**
 * The on-screen way back does what the phone's Back button does, so the two
 * never disagree. A page opened straight from a URL has nothing behind it, and
 * moves to `fallbackPath` in place instead of leaving the app.
 */
export const useGoBack = (fallbackPath: string): (() => void) => {
  const navigate = useNavigate()

  return () => {
    if (hasEntryBehind()) {
      void navigate(-1)
      return
    }
    void navigate(fallbackPath, { replace: true })
  }
}

/** The page matched below a layout page, or `null` when the layout is the page. */
export const useChildPage = (): React.ReactNode => useOutlet()

/** The address the reader asked for, as the router matched it. */
export const useCurrentPath = (): string => useLocation().pathname

/** What broke, in one line: shown to the reader so it can be reported. */
export const useRouteFailure = (): string => {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`.trim()
  }
  return error instanceof Error ? error.message : String(error)
}
