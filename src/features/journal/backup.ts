import { Result } from '@adrienlcp/result'
import { z } from 'zod/mini'

import {
  type ProfileSettings,
  profileSettingsSchema
} from '@/features/profile-settings/profile-settings'
import { type Log, logSchema } from '@/features/program/training-log'
import {
  EMPTY_TABLE,
  inCatalogue,
  type Table,
  tableSchema
} from '@/features/table/table-tally'
import type { IsoDay } from '@/helpers/days'

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
  /** Empty when read from a file written before profile settings existed. */
  readonly settings: ProfileSettings
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
  today: IsoDay
}): Backup => ({
  app: 'seance',
  log,
  savedAt: today,
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

/** Why a picked file restores nothing: not ours at all, or ours but broken. */
export type BackupRejection = 'damaged' | 'not_a_backup'

const backupEnvelopeSchema = z.object({
  app: z.literal('seance'),
  version: z.literal(1)
})

/**
 * Files from older builds lack the table, the settings or the date: each
 * reads as empty. Settings stay tolerant — a bad protein target is dropped.
 */
const backupSchema = z.extend(backupEnvelopeSchema, {
  log: logSchema,
  savedAt: z.catch(z.string(), ''),
  settings: profileSettingsSchema,
  table: z._default(tableSchema, EMPTY_TABLE)
}) satisfies z.ZodMiniType<Backup>

const parseJson = (text: string): Result<unknown, 'not_json'> => {
  try {
    const value: unknown = JSON.parse(text)
    return Result.success(value)
  } catch {
    return Result.failure('not_json')
  }
}

/**
 * A file picked by hand is never assumed to be ours: every session, measure
 * and count in it is checked before anything is replaced, and an unknown field
 * is dropped rather than carried into the app's storage.
 */
export const parseBackup = (text: string): Result<Backup, BackupRejection> => {
  const json = parseJson(text)
  if (json.status === 'failure') return Result.failure('not_a_backup')
  if (!backupEnvelopeSchema.safeParse(json.data).success) {
    return Result.failure('not_a_backup')
  }
  const backup = backupSchema.safeParse(json.data)
  return backup.success
    ? Result.success(backup.data)
    : Result.failure('damaged')
}

export const backupFileName = (backup: Backup): string =>
  `seance-${backup.savedAt}.json`

export const serializeBackup = (backup: Backup): string =>
  JSON.stringify(backup, null, 2)
