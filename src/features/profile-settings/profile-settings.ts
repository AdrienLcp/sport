import {
  DEFAULT_PROTEIN_TARGET,
  PROTEIN_TARGET_RANGE
} from '@/features/table/table-catalogue'
import { isRecord } from '@/helpers/records'

/**
 * What a profile decides about itself. Stored beside its log and carried by a
 * backup file; device matters — the language, the theme, the reminders — are
 * not here, since a second device may want them otherwise.
 */
export type ProfileSettings = {
  readonly version: 1
  /** Grams a day. Absent until the reader sets their own. */
  readonly proteinTarget?: number
}

export const EMPTY_PROFILE_SETTINGS: ProfileSettings = { version: 1 }

export const proteinTargetOf = (settings: ProfileSettings): number =>
  settings.proteinTarget ?? DEFAULT_PROTEIN_TARGET

export const isProteinTarget = (value: number): boolean =>
  Number.isInteger(value) &&
  value >= PROTEIN_TARGET_RANGE.min &&
  value <= PROTEIN_TARGET_RANGE.max

/** Tolerant: an unknown field is dropped, a bad target falls back to none. */
export const parseProfileSettings = (value: unknown): ProfileSettings => {
  if (!isRecord(value)) return EMPTY_PROFILE_SETTINGS
  const target = value.proteinTarget
  return typeof target === 'number' && isProteinTarget(target)
    ? { proteinTarget: target, version: 1 }
    : EMPTY_PROFILE_SETTINGS
}
