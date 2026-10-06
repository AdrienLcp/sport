import { z } from 'zod/mini'

import {
  DEFAULT_PROTEIN_TARGET,
  PROTEIN_TARGET_RANGE
} from '@/features/table/table-catalogue'

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

const proteinTargetSchema = z
  .int()
  .check(z.gte(PROTEIN_TARGET_RANGE.min), z.lte(PROTEIN_TARGET_RANGE.max))

export const isProteinTarget = (value: number): boolean =>
  proteinTargetSchema.safeParse(value).success

/** Tolerant: an unknown field is dropped, a bad target falls back to none. */
export const profileSettingsSchema = z.catch(
  z.pipe(
    z.object({
      proteinTarget: z.catch(z.optional(proteinTargetSchema), undefined)
    }),
    z.transform(
      ({ proteinTarget }): ProfileSettings =>
        proteinTarget === undefined
          ? EMPTY_PROFILE_SETTINGS
          : { proteinTarget, version: 1 }
    )
  ),
  EMPTY_PROFILE_SETTINGS
)
