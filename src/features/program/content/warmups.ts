import { MOVEMENTS } from '@programme/movements'
import {
  ARM_CIRCLE_SETUP,
  CAT_COW_SETUP,
  DYNAMIC_LUNGE_SETUP,
  EXTERNAL_ROTATION_SETUP,
  HIP_CIRCLE_SETUP,
  PLANK_SETUP,
  SCAPULAR_PUSH_UP_SETUP,
  SHOULDER_CIRCLE_SETUP,
  SLOW_AIR_SQUAT_SETUP,
  YTW_SETUP
} from '@programme/setups'

import type { Cues, WarmupDrill } from '@/features/program/program-types'
import type { LocalizedText } from '@/helpers/localized-text'

const FREE_BREATH: LocalizedText = {
  en: 'Free and easy, never held.',
  fr: 'Libre et tranquille, jamais bloquée.'
}

const PER_SIDE: LocalizedText = { en: 'per side', fr: 'par côté' }
const EACH_WAY: LocalizedText = { en: 'each way', fr: 'dans chaque sens' }
const OF_EACH: LocalizedText = {
  en: 'of each letter',
  fr: 'de chaque lettre'
}

const CAT_COW_CUES: Cues = {
  breath: {
    en: 'In as the back hollows, out as it rounds.',
    fr: 'On inspire en creusant, on souffle en arrondissant.'
  },
  moves: {
    en: 'The whole back: hollow with the head up, then round with the head tucked.',
    fr: 'Tout le dos : creusé tête haute, puis rond tête rentrée.'
  },
  still: {
    en: 'Hands under the shoulders, knees under the hips.',
    fr: 'Mains sous les épaules, genoux sous les hanches.'
  }
}

const CAT_COW: WarmupDrill = {
  cues: CAT_COW_CUES,
  dose: {
    count: 8,
    kind: 'reps',
    per: { en: 'each way', fr: 'allers-retours' }
  },
  figure: 'cat-cow',
  name: { en: 'Cat-cow', fr: 'Chat-vache' },
  setup: CAT_COW_SETUP
}

const YTW_GUARD = MOVEMENTS.ytw.guard

/** Session A: hips, spine and legs, before the lower body works. */
export const A_WARMUP: readonly WarmupDrill[] = [
  {
    cues: {
      breath: FREE_BREATH,
      moves: {
        en: 'The raised knee draws a wide circle.',
        fr: 'Le genou levé dessine un grand cercle.'
      },
      still: {
        en: 'Trunk and standing leg: they do not follow.',
        fr: 'Buste et jambe d’appui : ils ne suivent pas.'
      }
    },
    dose: { count: 10, kind: 'reps', per: PER_SIDE },
    figure: 'hip-circle',
    name: { en: 'Hip circles', fr: 'Rotations de hanches' },
    setup: HIP_CIRCLE_SETUP,
    support: 'wall'
  },
  CAT_COW,
  {
    cues: {
      breath: MOVEMENTS.squat.cues.breath,
      moves: {
        en: 'Hips back and down, without chasing depth.',
        fr: 'Hanches en arrière et en bas, sans chercher la profondeur.'
      },
      still: MOVEMENTS.squat.cues.still
    },
    dose: { count: 10, kind: 'reps' },
    figure: 'squat',
    name: { en: 'Slow air squats', fr: 'Squats à vide lents' },
    setup: SLOW_AIR_SQUAT_SETUP,
    support: 'none',
    tempo: { bottom: 0, down: 3, top: 0, up: 1 }
  },
  {
    cues: {
      breath: MOVEMENTS['lunge-back'].cues.breath,
      moves: {
        en: 'A step back, lower without touching the knee down, come back. Alternate.',
        fr: 'Un pas en arrière, on descend sans poser le genou, on revient. On alterne.'
      },
      still: MOVEMENTS['lunge-back'].cues.still
    },
    dose: { count: 10, kind: 'reps' },
    figure: 'lunge-back',
    name: { en: 'Reverse lunges', fr: 'Fentes dynamiques' },
    setup: DYNAMIC_LUNGE_SETUP,
    support: 'wall'
  }
]

/** Session B: the rotator cuff and the shoulder blades, before any push-up. */
export const B_WARMUP: readonly WarmupDrill[] = [
  {
    cues: {
      breath: FREE_BREATH,
      moves: {
        en: 'Arm straight, a full circle. Small first, then larger.',
        fr: 'Bras tendu, un cercle entier. Petit d’abord, puis plus grand.'
      },
      still: {
        en: 'Shoulder low, trunk still.',
        fr: 'Épaule basse, buste immobile.'
      }
    },
    dose: { count: 15, kind: 'reps', per: EACH_WAY },
    figure: 'arm-circle',
    guard: {
      en: 'In the plane of the body, never with the arms spread in a cross.',
      fr: 'Dans le plan du corps, jamais bras écartés en croix.'
    },
    name: { en: 'Arm circles', fr: 'Cercles de bras' },
    setup: ARM_CIRCLE_SETUP
  },
  {
    cues: {
      breath: {
        en: 'Out as the forearm opens.',
        fr: 'On souffle en ouvrant.'
      },
      moves: {
        en: 'Only the forearm, opening outward.',
        fr: 'Seul l’avant-bras, qui s’ouvre vers l’extérieur.'
      },
      still: {
        en: 'Elbow pinned to the ribs, bent at a right angle.',
        fr: 'Coude collé aux côtes, plié à angle droit.'
      }
    },
    dose: {
      count: 12,
      kind: 'reps',
      per: { en: 'per arm', fr: 'par bras' }
    },
    figure: 'external-rotation',
    guard: {
      en: 'This is the rotator-cuff work. It is not optional.',
      fr: 'C’est le renfort de coiffe. Il n’est pas optionnel.'
    },
    name: {
      en: 'External rotations, elbow in',
      fr: 'Rotations externes, coude au corps'
    },
    setup: EXTERNAL_ROTATION_SETUP
  },
  {
    cues: {
      breath: {
        en: 'Out as the chest pushes back up.',
        fr: 'On souffle en repoussant.'
      },
      moves: {
        en: 'The chest sinks between the shoulder blades, then pushes them apart.',
        fr: 'La poitrine descend entre les omoplates, puis les repousse.'
      },
      still: {
        en: 'Arms straight, elbows locked, body in one block.',
        fr: 'Bras tendus, coudes verrouillés, corps d’un bloc.'
      }
    },
    dose: { count: 10, kind: 'reps' },
    figure: 'scapular-push-up',
    guard: {
      en: 'The elbows never bend — otherwise it is a push-up, not shoulder-blade work.',
      fr: 'Les coudes ne plient jamais — sinon c’est une pompe, pas le renfort d’omoplate.'
    },
    name: { en: 'Scapular push-ups', fr: 'Scapular push-ups' },
    setup: SCAPULAR_PUSH_UP_SETUP
  },
  {
    cues: MOVEMENTS.ytw.cues,
    dose: { count: 8, kind: 'reps', per: OF_EACH },
    figure: 'ytw',
    guard: YTW_GUARD,
    name: { en: 'Floor Y-T-W', fr: 'Y-T-W au sol' },
    setup: YTW_SETUP,
    tempo: MOVEMENTS.ytw.tempo
  },
  {
    cues: MOVEMENTS.plank.cues,
    dose: { kind: 'hold', seconds: 20 },
    figure: 'plank',
    name: { en: 'Plank', fr: 'Gainage' },
    setup: PLANK_SETUP
  }
]

/** Session D: spine and shoulder blades, before the pull. */
export const D_WARMUP: readonly WarmupDrill[] = [
  CAT_COW,
  {
    cues: {
      breath: FREE_BREATH,
      moves: {
        en: 'The elbow draws the largest circle it can.',
        fr: 'Le coude dessine le plus grand cercle possible.'
      },
      still: {
        en: 'Fingertips resting on the shoulders.',
        fr: 'Doigts posés sur les épaules.'
      }
    },
    dose: { count: 10, kind: 'reps', per: EACH_WAY },
    figure: 'shoulder-roll',
    guard: {
      en: 'This is the shoulder-blade work. It is not optional.',
      fr: 'C’est le renfort de fixateurs d’omoplate. Il n’est pas optionnel.'
    },
    name: { en: 'Shoulder circles', fr: 'Rotations d’épaules' },
    setup: SHOULDER_CIRCLE_SETUP
  },
  {
    cues: MOVEMENTS.ytw.cues,
    dose: { count: 8, kind: 'reps', per: OF_EACH },
    figure: 'ytw',
    guard: YTW_GUARD,
    name: { en: 'Slow floor Y-T-W', fr: 'Y-T-W au sol, lents' },
    setup: YTW_SETUP,
    tempo: { bottom: 0, down: 3, top: 1, up: 2 }
  }
]
