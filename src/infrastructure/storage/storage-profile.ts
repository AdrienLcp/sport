import type { Result } from '@adrienlcp/result'
import {
  readStoredText,
  type StorageWriteError,
  writeStoredText
} from '@adrienlcp/safe-storage'

/**
 * Whose numbers the app is reading. `own` is the reader's; `specimen` is the
 * synthetic profile a visitor opens to see the charts full — kept under keys of
 * its own, so opening it never touches a single number of the reader's.
 */
export type StorageProfile = 'own' | 'specimen'

const ACTIVE_PROFILE_KEY = 'seance.profile.v1'

/** Unreadable storage reads as the reader's own profile, the only one it can hold. */
export const readActiveProfile = (): StorageProfile => {
  const read = readStoredText(ACTIVE_PROFILE_KEY)
  return read.status === 'success' && read.data === 'specimen'
    ? 'specimen'
    : 'own'
}

export const writeActiveProfile = (
  profile: StorageProfile
): Result<void, StorageWriteError> =>
  writeStoredText({ key: ACTIVE_PROFILE_KEY, text: profile })

/** What a profile keeps, each under its own key. */
export type StoredShelf = 'log' | 'run' | 'settings' | 'table'

/**
 * The reader's own keys predate profiles and are what a phone already holds:
 * they keep their exact names, and only the specimen's are namespaced.
 */
export const storageKeyOf = (
  shelf: StoredShelf,
  profile: StorageProfile = readActiveProfile()
): string =>
  profile === 'own' ? `seance.${shelf}.v1` : `seance.specimen.${shelf}.v1`
