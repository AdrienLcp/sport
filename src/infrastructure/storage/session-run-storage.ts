import type { Result } from '@adrienlcp/result'
import {
  readStoredJson,
  removeStored,
  type StorageReadError,
  type StorageUnavailable,
  type StorageWriteError,
  writeStoredJson
} from '@adrienlcp/safe-storage'

import type { RunSnapshot } from '@/features/session/run'
import { isRecord } from '@/helpers/records'

import { storageKeyOf } from './storage-profile'

const isRunSnapshot = (value: unknown): value is RunSnapshot =>
  isRecord(value) &&
  typeof value.day === 'string' &&
  typeof value.sessionId === 'string' &&
  typeof value.stage === 'string' &&
  typeof value.step === 'number' &&
  Array.isArray(value.results)

/** `null` when no session was interrupted. A closed tab resumes from here. */
export const readRunSnapshot = (): Result<
  RunSnapshot | null,
  StorageReadError
> => readStoredJson({ isValue: isRunSnapshot, key: storageKeyOf('run') })

export const writeRunSnapshot = (
  snapshot: RunSnapshot
): Result<void, StorageWriteError> =>
  writeStoredJson({ key: storageKeyOf('run'), value: snapshot })

export const clearRunSnapshot = (): Result<void, StorageUnavailable> =>
  removeStored(storageKeyOf('run'))
