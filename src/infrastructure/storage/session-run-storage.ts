import type { Result } from '@adrienlcp/result'
import {
  removeStored,
  type StorageReadError,
  type StorageUnavailable,
  type StorageWriteError,
  writeStoredJson
} from '@adrienlcp/safe-storage'

import { type RunSnapshot, runSnapshotSchema } from '@/features/session/run'

import { readStoredShape } from './read-stored-shape'
import { storageKeyOf } from './storage-profile'

/** `null` when no session was interrupted. A closed tab resumes from here. */
export const readRunSnapshot = (): Result<
  RunSnapshot | null,
  StorageReadError
> => readStoredShape({ key: storageKeyOf('run'), schema: runSnapshotSchema })

export const writeRunSnapshot = (
  snapshot: RunSnapshot
): Result<void, StorageWriteError> =>
  writeStoredJson({ key: storageKeyOf('run'), value: snapshot })

export const clearRunSnapshot = (): Result<void, StorageUnavailable> =>
  removeStored(storageKeyOf('run'))
