import { MOVEMENTS } from '@programme/movements'
import { BLOCK_1 } from '@programme/program'

import {
  type FigureId,
  isFree,
  MOVEMENT_IDS
} from '@/features/program/program-types'
import type { LocalizedText } from '@/helpers/localized-text'

/** The walk is drawn but no session prescribes it today, so no movement names it. */
const WALK_NAME: LocalizedText = { en: 'Brisk walk', fr: 'Marche rapide' }

/** The name each figure goes by, for the dev pages that caption every drawing. */
const movementFigureNames = (): ReadonlyMap<FigureId, LocalizedText> => {
  const names = new Map<FigureId, LocalizedText>([['walk', WALK_NAME]])
  for (const movement of MOVEMENT_IDS.map((id) => MOVEMENTS[id])) {
    if (!names.has(movement.figure)) names.set(movement.figure, movement.name)
  }
  return names
}

/**
 * The warm-up drills and the stretches are figures too, and a sheet that
 * captions a third of itself with slugs cannot be read against itself.
 */
export const allFigureNames = (): ReadonlyMap<FigureId, LocalizedText> => {
  const names = new Map(movementFigureNames())
  for (const session of BLOCK_1) {
    for (const drill of session.warmup) {
      if (!names.has(drill.figure)) names.set(drill.figure, drill.name)
    }
    for (const held of session.cooldown) {
      if (!isFree(held) && !names.has(held.figure)) {
        names.set(held.figure, held.name)
      }
    }
  }
  return names
}
