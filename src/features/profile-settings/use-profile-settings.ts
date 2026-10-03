import { useState } from 'react'

import { warnOnFailure } from '@/infrastructure/diagnostics'
import {
  readProfileSettings,
  writeProfileSettings
} from '@/infrastructure/storage/profile-settings-storage'

import {
  EMPTY_PROFILE_SETTINGS,
  type ProfileSettings
} from './profile-settings'

export const readProfileSettingsOrEmpty = (): ProfileSettings => {
  const read = readProfileSettings()
  warnOnFailure(read, 'The profile settings could not be read')
  return read.status === 'success' ? read.data : EMPTY_PROFILE_SETTINGS
}

export const saveProfileSettings = (settings: ProfileSettings): void => {
  const written = writeProfileSettings(settings)
  warnOnFailure(written, 'The profile settings could not be saved')
}

export const useProfileSettings = (): readonly [
  ProfileSettings,
  (next: ProfileSettings) => void
] => {
  const [settings, setSettings] = useState(readProfileSettingsOrEmpty)

  const keep = (next: ProfileSettings) => {
    saveProfileSettings(next)
    setSettings(next)
  }

  return [settings, keep] as const
}
