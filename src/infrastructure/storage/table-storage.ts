import { Result } from '@adrienlcp/result'
import {
  type StorageReadError,
  type StorageWriteError,
  writeStoredJson
} from '@adrienlcp/safe-storage'

import {
  EMPTY_TABLE,
  type Table,
  tableSchema
} from '@/features/table/table-tally'

import { readStoredShape } from './read-stored-shape'
import { type StorageProfile, storageKeyOf } from './storage-profile'

export const readTable = (
  profile?: StorageProfile
): Result<Table, StorageReadError> => {
  const read = readStoredShape({
    key: storageKeyOf('table', profile),
    schema: tableSchema
  })
  if (read.status === 'failure') return read
  return Result.success(read.data ?? EMPTY_TABLE)
}

export const writeTable = (
  table: Table,
  profile?: StorageProfile
): Result<void, StorageWriteError> =>
  writeStoredJson({ key: storageKeyOf('table', profile), value: table })
