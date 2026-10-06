import { Result } from '@adrienlcp/result'
import {
  type StorageReadError,
  type StorageWriteError,
  writeStoredJson
} from '@adrienlcp/safe-storage'

import { EMPTY_LOG, type Log, logSchema } from '@/features/program/training-log'

import { readStoredShape } from './read-stored-shape'
import { type StorageProfile, storageKeyOf } from './storage-profile'

/** A browser that never ran a session holds no log, which reads as the empty one. */
export const readTrainingLog = (
  profile?: StorageProfile
): Result<Log, StorageReadError> => {
  const read = readStoredShape({
    key: storageKeyOf('log', profile),
    schema: logSchema
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
