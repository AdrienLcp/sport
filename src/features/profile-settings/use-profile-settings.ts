import { useState } from 'react'

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
  if (read.status === 'success') return read.data
  console.warn(`The profile settings could not be read (${read.error}).`)
  return EMPTY_PROFILE_SETTINGS
}

export const saveProfileSettings = (settings: ProfileSettings): void => {
  const written = writeProfileSettings(settings)
  if (written.status === 'failure') {
    console.warn(`The profile settings could not be saved (${written.error}).`)
  }
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
