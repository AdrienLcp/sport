import { Result } from '@adrienlcp/result'
import {
  type StorageReadError,
  type StorageWriteError,
  writeStoredJson
} from '@adrienlcp/safe-storage'

import {
  EMPTY_PROFILE_SETTINGS,
  type ProfileSettings,
  profileSettingsSchema
} from '@/features/profile-settings/profile-settings'

import { readStoredShape } from './read-stored-shape'
import { type StorageProfile, storageKeyOf } from './storage-profile'

export const readProfileSettings = (
  profile?: StorageProfile
): Result<ProfileSettings, StorageReadError> => {
  const read = readStoredShape({
    key: storageKeyOf('settings', profile),
    schema: profileSettingsSchema
  })
  if (read.status === 'failure') return read
  return Result.success(read.data ?? EMPTY_PROFILE_SETTINGS)
}

export const writeProfileSettings = (
  settings: ProfileSettings,
  profile?: StorageProfile
): Result<void, StorageWriteError> =>
  writeStoredJson({ key: storageKeyOf('settings', profile), value: settings })
