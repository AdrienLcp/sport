import { Result } from '@adrienlcp/result'
import {
  readStoredJson,
  type StorageReadError,
  type StorageWriteError,
  writeStoredJson
} from '@adrienlcp/safe-storage'

import { EMPTY_LOG, type Log } from '@/features/program/training-log'
import { isRecord } from '@/helpers/records'

import { type StorageProfile, storageKeyOf } from './storage-profile'

export const isLog = (value: unknown): value is Log =>
  isRecord(value) && value.version === 1 && Array.isArray(value.entries)

/** A browser that never ran a session holds no log, which reads as the empty one. */
export const readTrainingLog = (
  profile?: StorageProfile
): Result<Log, StorageReadError> => {
  const read = readStoredJson({
    isValue: isLog,
    key: storageKeyOf('log', profile)
  })
  if (read.status === 'failure') return read
  return Result.success(read.data ?? EMPTY_LOG)
}

/** A private window or a full quota refuses the write; the session still runs. */
export const writeTrainingLog = (
  log: Log,
  profile?: StorageProfile
): Result<void, StorageWriteError> =>
  writeStoredJson({ key: storageKeyOf('log', profile), value: log })
