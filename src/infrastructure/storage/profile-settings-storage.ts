import { Result } from '@adrienlcp/result'
import {
  readStoredJson,
  type StorageReadError,
  type StorageWriteError,
  writeStoredJson
} from '@adrienlcp/safe-storage'

import {
  EMPTY_PROFILE_SETTINGS,
  type ProfileSettings,
  parseProfileSettings
} from '@/features/profile-settings/profile-settings'
import { isRecord } from '@/helpers/records'

import { type StorageProfile, storageKeyOf } from './storage-profile'

export const readProfileSettings = (
  profile?: StorageProfile
): Result<ProfileSettings, StorageReadError> => {
  const read = readStoredJson({
    isValue: isRecord,
    key: storageKeyOf('settings', profile)
  })
  if (read.status === 'failure') return read
  return Result.success(
    read.data === null
      ? EMPTY_PROFILE_SETTINGS
      : parseProfileSettings(read.data)
  )
}

export const writeProfileSettings = (
  settings: ProfileSettings,
  profile?: StorageProfile
): Result<void, StorageWriteError> =>
  writeStoredJson({ key: storageKeyOf('settings', profile), value: settings })
