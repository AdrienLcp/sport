import { Result } from '@adrienlcp/result'

import {
  EMPTY_PROFILE_SETTINGS,
  type ProfileSettings,
  parseProfileSettings
} from '@/features/profile-settings/profile-settings'
import { EMPTY_LOG, type Log } from '@/features/program/training-log'
import {
  EMPTY_TABLE,
  inCatalogue,
  type Table
} from '@/features/table/table-tally'
import { isoDay } from '@/helpers/days'
import { isRecord } from '@/helpers/records'

/**
 * One file that carries everything the app knows. localStorage lives in one
 * browser on one device; a file the reader can move settles both the backup
 * and the phone-to-desk transfer, with no server, no account and no sync
 * protocol. Files already written by older builds must keep restoring: the
 * shape is fixed.
 */
export type Backup = {
  readonly app: 'seance'
  readonly version: 1
  /** ISO day the file was written, so a folder of them sorts by itself. */
  readonly savedAt: string
  readonly log: Log
  readonly table: Table
  /** Absent from files written before profile settings existed. */
  readonly settings?: ProfileSettings
}

export type BackupCount = {
  readonly sessions: number
  readonly measures: number
  readonly days: number
  readonly market: number
}

export const gatherBackup = ({
  log,
  settings,
  table,
  today
}: {
  log: Log
  settings: ProfileSettings
  table: Table
  today: Date
}): Backup => ({
  app: 'seance',
  log,
  savedAt: isoDay(today),
  settings,
  table,
  version: 1
})

/** What the file holds, printed before anything is replaced. */
export const countBackup = (backup: Backup): BackupCount => ({
  days: Object.keys(backup.table.days ?? {}).length,
  market: inCatalogue(backup.table.market?.ticked ?? []).length,
  measures: (backup.log.measures ?? []).length,
  sessions: backup.log.entries.length
})

const isLogLike = (value: unknown): value is Log =>
  isRecord(value) && Array.isArray(value.entries)

const isTableLike = (value: unknown): value is Table =>
  isRecord(value) && typeof value.days === 'object'

/**
 * A file picked by hand is never assumed to be ours. Anything missing falls
 * back to empty rather than to `undefined`, so a half-written file restores
 * what it does carry instead of breaking every plate that reads it.
 */
export const parseBackup = (text: string): Result<Backup, 'not_a_backup'> => {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return Result.failure('not_a_backup')
  }

  if (!isRecord(raw) || raw.app !== 'seance' || raw.version !== 1) {
    return Result.failure('not_a_backup')
  }
  if (!isLogLike(raw.log)) return Result.failure('not_a_backup')

  return Result.success({
    app: 'seance',
    log: { ...EMPTY_LOG, ...raw.log, version: 1 },
    savedAt: typeof raw.savedAt === 'string' ? raw.savedAt : '',
    settings:
      raw.settings === undefined
        ? EMPTY_PROFILE_SETTINGS
        : parseProfileSettings(raw.settings),
    table: isTableLike(raw.table)
      ? { ...EMPTY_TABLE, ...raw.table, version: 1 }
      : EMPTY_TABLE,
    version: 1
  })
}

export const backupFileName = (backup: Backup): string =>
  `seance-${backup.savedAt}.json`

export const serializeBackup = (backup: Backup): string =>
  JSON.stringify(backup, null, 2)
