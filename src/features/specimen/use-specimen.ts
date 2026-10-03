import type { IsoDay } from '@/helpers/days'
import { loadPage } from '@/infrastructure/browser'
import { today } from '@/infrastructure/clock'
import { writeProfileSettings } from '@/infrastructure/storage/profile-settings-storage'
import { clearRunSnapshot } from '@/infrastructure/storage/session-run-storage'
import {
  readActiveProfile,
  type StorageProfile,
  writeActiveProfile
} from '@/infrastructure/storage/storage-profile'
import { writeTable } from '@/infrastructure/storage/table-storage'
import { writeTrainingLog } from '@/infrastructure/storage/training-log-storage'

import { makeSpecimen } from './specimen-data'

const warnOnFailure = (
  outcome: { status: 'failure'; error: string } | { status: 'success' },
  what: string
): void => {
  if (outcome.status === 'failure') console.warn(`${what} (${outcome.error}).`)
}

/** Prints a fresh specimen under its own keys; the reader's are never read or written. */
export const printSpecimen = (today: IsoDay): void => {
  const specimen = makeSpecimen(today)
  warnOnFailure(
    writeTrainingLog(specimen.log, 'specimen'),
    'The specimen log could not be written'
  )
  warnOnFailure(
    writeTable(specimen.table, 'specimen'),
    'The specimen table could not be written'
  )
  warnOnFailure(
    writeProfileSettings(specimen.settings, 'specimen'),
    'The specimen settings could not be written'
  )
}

/**
 * Switches whose numbers the app reads. The page is loaded again at `path`:
 * every plate reads its numbers when it opens, and a clean load is the one
 * way to be sure none of them kept the other profile's.
 */
export const switchProfile = ({
  path,
  profile
}: {
  path: string
  profile: StorageProfile
}): void => {
  if (profile === 'specimen') {
    printSpecimen(today().toString())
  }
  warnOnFailure(
    writeActiveProfile(profile),
    'The active profile could not be saved'
  )
  if (profile === 'specimen') {
    warnOnFailure(clearRunSnapshot(), 'The specimen run could not be cleared')
  }
  loadPage(path)
}

export const isReadingSpecimen = (): boolean =>
  readActiveProfile() === 'specimen'
