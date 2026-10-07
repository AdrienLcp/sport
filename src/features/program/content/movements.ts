import {
  CALF_RAISE_SETUP,
  HIP_THRUST_SETUP,
  HIP_THRUST_SINGLE_SETUP,
  HOLLOW_SETUP,
  KNEE_MARCH_SETUP,
  LUNGE_SETUP,
  MOUNTAIN_CLIMBER_SETUP,
  PLANK_SETUP,
  PUSH_UP_FEET_RAISED_SETUP,
  PUSH_UP_INCLINE_HIGH_SETUP,
  PUSH_UP_INCLINE_SETUP,
  PUSH_UP_KNEES_SETUP,
  PUSH_UP_NARROW_SETUP,
  PUSH_UP_SETUP,
  PUSH_UP_SLOW_SETUP,
  RDL_SINGLE_SETUP,
  ROW_DUMBBELL_SETUP,
  SHADOW_BOX_SETUP,
  SIDE_PLANK_SETUP,
  SQUAT_SETUP,
  SQUAT_SLOW_SETUP,
  YTW_SETUP
} from '@programme/setups'

import type { Movement, MovementId } from '@/features/program/program-types'
import type { LocalizedText } from '@/helpers/localized-text'

/** Flared elbows are the push-up's most common fault, and the one that wears
    shoulders out. */
const ELBOWS_IN = {
  en: 'Elbows at 45° from the body, never flared out to 90°.',
  fr: 'Coudes à 45° du corps, jamais écartés à 90°.'
} as const

const BREATH_OUT_UP: LocalizedText = {
  en: 'Out on the way up, in on the way down.',
  fr: 'On souffle en montant, on inspire en descendant.'
}

const BREATH_OUT_PUSH: LocalizedText = {
  en: 'Out as you push away, in as you lower.',
  fr: 'On souffle en poussant, on inspire en descendant.'
}

const BREATH_HOLD: LocalizedText = {
  en: 'Short, steady breaths. Never hold it.',
  fr: 'Souffle court et régulier, jamais d’apnée.'
}

const BREATH_EASY: LocalizedText = {
  en: 'Enough breath left to talk.',
  fr: 'Assez de souffle pour parler.'
}

const PUSH_UP_STILL: LocalizedText = {
  en: 'Body in one block, ankles to head.',
  fr: 'Corps d’un bloc, des chevilles à la tête.'
}

const PUSH_UP_MOVES: LocalizedText = {
  en: 'The elbows bend, the chest comes down.',
  fr: 'Les coudes plient, la poitrine descend.'
}

const PUSH_UP_SQUEEZE: LocalizedText = {
  en: 'Abs and glutes, the whole set.',
  fr: 'Abdos et fessiers, toute la série.'
}

const HIP_THRUST_STILL: LocalizedText = {
  en: 'Shoulders and feet on the floor, chin tucked.',
  fr: 'Épaules et pieds au sol, menton rentré.'
}

const HIP_THRUST_SQUEEZE: LocalizedText = {
  en: 'Glutes, one second at the top. Ribs down.',
  fr: 'Fessiers, 1 s en haut. Côtes basses.'
}

const PUSH_UP_CUES = {
  breath: BREATH_OUT_PUSH,
  moves: PUSH_UP_MOVES,
  squeeze: PUSH_UP_SQUEEZE,
  still: PUSH_UP_STILL
} as const

/**
 * The catalogue the plates draw from. One entry, one figure, and the lines the
 * figure cannot say. Ids are never written to the log — a set is stored under
 * its station's address — so a movement can be replaced without stranding a
 * single reading.
 */
export const MOVEMENTS: Record<MovementId, Movement> = {
  'calf-raise': {
    cues: {
      breath: BREATH_OUT_UP,
      moves: {
        en: 'Heels only: up onto the toes, as high as they go.',
        fr: 'Les talons seuls : sur la pointe, le plus haut possible.'
      },
      squeeze: {
        en: 'Calves, one second at the top.',
        fr: 'Mollets, 1 s en haut.'
      },
      still: {
        en: 'Feet flat on the floor, knees straight.',
        fr: 'Pieds à plat au sol, genoux tendus.'
      }
    },
    figure: 'calf-raise',
    name: { en: 'Calf raises', fr: 'Mollets au sol' },
    setup: CALF_RAISE_SETUP,
    support: 'wall',
    tempo: { bottom: 0, down: 2, top: 1, up: 1 }
  },
  'hip-thrust': {
    cues: {
      breath: BREATH_OUT_UP,
      moves: {
        en: 'The hips rise until shoulders, hips and knees line up.',
        fr: 'Le bassin monte jusqu’à la ligne épaules-hanches-genoux.'
      },
      squeeze: HIP_THRUST_SQUEEZE,
      still: HIP_THRUST_STILL
    },
    figure: 'hip-thrust',
    name: { en: 'Floor hip thrust', fr: 'Hip thrust au sol' },
    setup: HIP_THRUST_SETUP,
    tempo: { bottom: 0, down: 2, top: 1, up: 1 }
  },
  'hip-thrust-single': {
    cues: {
      breath: BREATH_OUT_UP,
      moves: {
        en: 'The hips rise on one leg; the other stays straight.',
        fr: 'Le bassin monte sur une jambe, l’autre reste tendue.'
      },
      squeeze: HIP_THRUST_SQUEEZE,
      still: {
        en: 'The pelvis stays level, never tilting.',
        fr: 'Le bassin reste à l’horizontale, sans basculer.'
      }
    },
    figure: 'hip-thrust-single',
    name: { en: 'Single-leg hip thrust', fr: 'Hip thrust une jambe' },
    setup: HIP_THRUST_SINGLE_SETUP,
    tempo: { bottom: 0, down: 2, top: 1, up: 1 }
  },
  hollow: {
    cues: {
      breath: BREATH_HOLD,
      squeeze: {
        en: 'Abs: lower back glued to the floor.',
        fr: 'Abdos : bas du dos collé au sol.'
      },
      still: {
        en: 'Everything. If the back lifts, bend the knees in.',
        fr: 'Tout. Si le dos se creuse, on replie les genoux.'
      }
    },
    figure: 'hollow',
    name: { en: 'Hollow hold', fr: 'Hollow hold' },
    setup: HOLLOW_SETUP
  },
  'knee-march': {
    cues: {
      breath: BREATH_EASY,
      moves: {
        en: 'One knee up to hip height, then the other, the arms swinging.',
        fr: 'Un genou à hauteur de hanche, puis l’autre, bras en balancier.'
      },
      still: {
        en: 'Chest upright; the foot is placed, never stamped.',
        fr: 'Buste droit ; le pied se pose, il ne frappe pas.'
      }
    },
    figure: 'knee-march',
    name: { en: 'Marching knee raises', fr: 'Montées de genoux marchées' },
    setup: KNEE_MARCH_SETUP
  },
  'lunge-back': {
    cues: {
      breath: BREATH_OUT_UP,
      moves: {
        en: 'One step back, the back knee lowers toward the floor.',
        fr: 'Un pas en arrière, le genou arrière descend vers le sol.'
      },
      squeeze: {
        en: 'Push through the front heel to come back.',
        fr: 'On remonte en poussant par le talon avant.'
      },
      still: {
        en: 'Chest upright, front knee over the ankle.',
        fr: 'Buste droit, genou avant au-dessus de la cheville.'
      }
    },
    figure: 'lunge-back',
    name: { en: 'Reverse lunge', fr: 'Fente arrière' },
    setup: LUNGE_SETUP,
    support: 'wall',
    tempo: { bottom: 1, down: 2, top: 0, up: 1 }
  },
  'mountain-climber': {
    cues: {
      breath: {
        en: 'Keep breathing; slow down rather than hold it.',
        fr: 'On respire ; ralentir plutôt que bloquer.'
      },
      moves: {
        en: 'The knees in turn, under the chest.',
        fr: 'Les genoux, tour à tour, sous la poitrine.'
      },
      still: {
        en: 'Hands under the shoulders, hips low. Feet placed, not slapped.',
        fr: 'Mains sous les épaules, bassin bas. Pieds posés, pas claqués.'
      }
    },
    figure: 'mountain-climber',
    name: { en: 'Mountain climbers', fr: 'Mountain climbers' },
    setup: MOUNTAIN_CLIMBER_SETUP
  },
  plank: {
    cues: {
      breath: BREATH_HOLD,
      squeeze: {
        en: 'Abs and glutes. When the hips drop, stop.',
        fr: 'Abdos et fessiers. Hanches qui tombent : on arrête.'
      },
      still: {
        en: 'Everything: one line, ankles to shoulders.',
        fr: 'Tout : une ligne des chevilles aux épaules.'
      }
    },
    figure: 'plank',
    name: { en: 'Plank', fr: 'Planche' },
    setup: PLANK_SETUP
  },
  'push-up': {
    cues: PUSH_UP_CUES,
    figure: 'push-up',
    guard: ELBOWS_IN,
    name: { en: 'Push-ups', fr: 'Pompes' },
    setup: PUSH_UP_SETUP
  },
  'push-up-feet-raised': {
    cues: {
      ...PUSH_UP_CUES,
      still: {
        en: 'Feet on the bench, hips that do not climb.',
        fr: 'Pieds sur le banc, bassin qui ne monte pas.'
      }
    },
    figure: 'push-up-feet-raised',
    guard: ELBOWS_IN,
    name: { en: 'Feet-raised push-ups', fr: 'Pompes pieds surélevés' },
    setup: PUSH_UP_FEET_RAISED_SETUP
  },
  'push-up-incline': {
    cues: {
      ...PUSH_UP_CUES,
      still: {
        en: 'Hands on a sturdy low table, body in one block.',
        fr: 'Mains sur une table basse stable, corps d’un bloc.'
      }
    },
    figure: 'push-up-incline',
    guard: ELBOWS_IN,
    name: { en: 'Incline push-ups', fr: 'Pompes inclinées' },
    setup: PUSH_UP_INCLINE_SETUP
  },
  'push-up-incline-high': {
    cues: {
      ...PUSH_UP_CUES,
      still: {
        en: 'Hands on the counter, body in one block.',
        fr: 'Mains sur le plan de travail, corps d’un bloc.'
      }
    },
    figure: 'push-up-incline',
    guard: ELBOWS_IN,
    name: { en: 'High incline push-ups', fr: 'Pompes inclinées hautes' },
    setup: PUSH_UP_INCLINE_HIGH_SETUP
  },
  'push-up-knees': {
    cues: {
      ...PUSH_UP_CUES,
      still: {
        en: 'Knees down, one line from knees to head.',
        fr: 'Genoux au sol, une ligne des genoux à la tête.'
      }
    },
    figure: 'push-up-knees',
    guard: ELBOWS_IN,
    name: { en: 'Knee push-ups', fr: 'Pompes sur genoux' },
    setup: PUSH_UP_KNEES_SETUP
  },
  'push-up-narrow': {
    cues: {
      ...PUSH_UP_CUES,
      moves: {
        en: 'The elbows bend back, brushing the ribs, until the chest is a fist from the floor.',
        fr: 'Les coudes plient vers l’arrière en frôlant les côtes, jusqu’à la poitrine à un poing du sol.'
      },
      still: {
        en: 'Hands under the shoulders, shoulder-width apart, fingers forward. Body in one block.',
        fr: 'Mains sous les épaules, écartées de la largeur des épaules, doigts vers l’avant. Corps d’un bloc.'
      }
    },
    figure: 'push-up-narrow',
    guard: ELBOWS_IN,
    name: { en: 'Close-grip push-ups', fr: 'Pompes mains serrées' },
    setup: PUSH_UP_NARROW_SETUP
  },
  'push-up-slow': {
    cues: PUSH_UP_CUES,
    figure: 'push-up',
    guard: ELBOWS_IN,
    name: { en: 'Slow push-ups', fr: 'Pompes lentes' },
    setup: PUSH_UP_SLOW_SETUP,
    tempo: { bottom: 1, down: 3, top: 0, up: 1 }
  },
  'rdl-single': {
    cues: {
      breath: BREATH_OUT_UP,
      moves: {
        en: 'The chest leans forward, the free leg swings back.',
        fr: 'Le buste bascule, la jambe libre part en arrière.'
      },
      squeeze: {
        en: 'Glute of the standing leg, to come up.',
        fr: 'Fessier de la jambe d’appui, pour remonter.'
      },
      still: {
        en: 'Back straight; standing knee soft, not bending more.',
        fr: 'Dos droit ; genou d’appui souple, qui ne plie pas plus.'
      }
    },
    figure: 'rdl-single',
    name: {
      en: 'Single-leg Romanian deadlift',
      fr: 'Soulevé roumain une jambe'
    },
    setup: RDL_SINGLE_SETUP,
    support: 'wall'
  },
  'row-dumbbell': {
    cues: {
      breath: {
        en: 'Out as you pull, in as you lower.',
        fr: 'On souffle en tirant, on inspire en descendant.'
      },
      moves: {
        en: 'The dumbbell: elbow drawn to the hip.',
        fr: 'L’haltère : le coude tire vers la hanche.'
      },
      squeeze: {
        en: 'Shoulder blade toward the spine, at the top.',
        fr: 'Omoplate vers la colonne, en haut.'
      },
      still: {
        en: 'Back flat, chest leaning, free hand on the thigh.',
        fr: 'Dos plat, buste penché, main libre sur la cuisse.'
      }
    },
    figure: 'row-dumbbell',
    guard: {
      en: 'Elbow close to the body, never flared out.',
      fr: 'Coude près du corps, jamais écarté.'
    },
    name: { en: 'One-arm dumbbell row', fr: 'Row haltère un bras' },
    setup: ROW_DUMBBELL_SETUP
  },
  'shadow-box': {
    cues: {
      breath: {
        en: 'A short breath out with each punch.',
        fr: 'Un souffle court à chaque coup.'
      },
      moves: {
        en: 'The arms, punching out and back to the face.',
        fr: 'Les bras : on frappe, on revient au visage.'
      },
      still: {
        en: 'Shoulders loose, knees soft. It must stay easy.',
        fr: 'Épaules relâchées, genoux souples. Ça reste facile.'
      }
    },
    figure: 'shadow-box',
    name: { en: 'Shadow boxing', fr: 'Shadow boxing' },
    setup: SHADOW_BOX_SETUP
  },
  'side-plank': {
    cues: {
      breath: BREATH_HOLD,
      squeeze: {
        en: 'The flank near the floor: hips lifted.',
        fr: 'Le flanc côté sol : hanches hautes.'
      },
      still: {
        en: 'Elbow under the shoulder, hips stacked.',
        fr: 'Coude sous l’épaule, hanches empilées.'
      }
    },
    figure: 'side-plank',
    name: { en: 'Side plank', fr: 'Gainage latéral' },
    setup: SIDE_PLANK_SETUP
  },
  squat: {
    cues: {
      breath: BREATH_OUT_UP,
      moves: {
        en: 'Hips back and down, knees tracking the toes.',
        fr: 'Hanches en arrière et en bas, genoux dans l’axe des pieds.'
      },
      squeeze: {
        en: 'Glutes, to stand back up.',
        fr: 'Fessiers, pour remonter.'
      },
      still: {
        en: 'Heels down, chest high.',
        fr: 'Talons au sol, poitrine haute.'
      }
    },
    figure: 'squat',
    name: { en: 'Squat', fr: 'Squat' },
    setup: SQUAT_SETUP,
    support: 'none'
  },
  'squat-slow': {
    cues: {
      breath: BREATH_OUT_UP,
      moves: {
        en: 'Hips back and down, knees tracking the toes.',
        fr: 'Hanches en arrière et en bas, genoux dans l’axe des pieds.'
      },
      still: {
        en: 'Heels down, chest high.',
        fr: 'Talons au sol, poitrine haute.'
      }
    },
    figure: 'squat',
    name: { en: 'Slow squat', fr: 'Squat lent' },
    setup: SQUAT_SLOW_SETUP,
    support: 'none',
    tempo: { bottom: 0, down: 3, top: 0, up: 1 }
  },
  ytw: {
    cues: {
      breath: BREATH_OUT_UP,
      moves: {
        en: 'One rep is three shapes in a row: arms in a Y above the head, a T out to the sides, a W with the elbows to the ribs.',
        fr: 'Une répétition, trois formes à la suite : bras en Y au-dessus de la tête, en T sur les côtés, en W coudes aux côtes.'
      },
      squeeze: {
        en: 'Shoulder blades down and together.',
        fr: 'Omoplates basses et serrées.'
      },
      still: {
        en: 'Face down, forehead near the floor, legs relaxed.',
        fr: 'À plat ventre, front près du sol, jambes relâchées.'
      }
    },
    figure: 'ytw',
    guard: {
      en: 'Thumbs to the ceiling, never palms to the floor.',
      fr: 'Pouces vers le plafond, jamais paume vers le sol.'
    },
    name: { en: 'Floor Y-T-W', fr: 'Y-T-W au sol' },
    setup: YTW_SETUP,
    tempo: { bottom: 0, down: 2, top: 1, up: 1 }
  }
}
