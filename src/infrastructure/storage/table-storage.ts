import { Result } from '@adrienlcp/result'
import {
  readStoredJson,
  type StorageReadError,
  type StorageWriteError,
  writeStoredJson
} from '@adrienlcp/safe-storage'

import { EMPTY_TABLE, type Table } from '@/features/table/table-tally'
import { isRecord } from '@/helpers/records'

import { type StorageProfile, storageKeyOf } from './storage-profile'

/** What an older build may have written: `market` came after `days`. */
type StoredTable = {
  version: 1
  days: Table['days'] | null
  market?: Table['market']
}

const isStoredTable = (value: unknown): value is StoredTable =>
  isRecord(value) && value.version === 1 && typeof value.days === 'object'

export const readTable = (
  profile?: StorageProfile
): Result<Table, StorageReadError> => {
  const read = readStoredJson({
    isValue: isStoredTable,
    key: storageKeyOf('table', profile)
  })
  if (read.status === 'failure') return read
  if (read.data === null) return Result.success(EMPTY_TABLE)

  return Result.success({
    days: read.data.days ?? {},
    market: read.data.market ?? EMPTY_TABLE.market,
    version: 1
  })
}

export const writeTable = (
  table: Table,
  profile?: StorageProfile
): Result<void, StorageWriteError> =>
  writeStoredJson({ key: storageKeyOf('table', profile), value: table })
