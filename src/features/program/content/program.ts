import { A_WARMUP, B_WARMUP, D_WARMUP } from '@programme/warmups'

import type { Session } from '@/features/program/program-types'

const CAT_COW_CUE = {
  en: 'On all fours: hollow the back as the head lifts, then round it as the head tucks.',
  fr: 'À quatre pattes : on creuse le dos en levant la tête, puis on l’arrondit en la rentrant.'
} as const

const HAMSTRING_STRETCH = {
  cue: {
    en: 'Hinge from the hips, back long. The knee may stay a little bent; a rounded back stretches nothing.',
    fr: 'On se penche depuis les hanches, dos long. Le genou peut rester un peu fléchi ; le dos rond n’étire rien.'
  },
  detail: { en: '30 s per leg', fr: '30 s par jambe' },
  figure: 'hamstring-stretch',
  name: { en: 'Hamstrings', fr: 'Ischio-jambiers' },
  perSide: true,
  seconds: 30
} as const

/**
 * Block 1, four weeks, five sessions of about thirty minutes on a mat, with no
 * equipment. The single source of truth for what happens on the mat.
 */
export const BLOCK_1: readonly Session[] = [
  {
    circuit: [
      {
        address: 'A-01',
        effort: { from: 12, kind: 'reps', to: 20 },
        movement: 'squat'
      },
      {
        address: 'A-02',
        effort: { from: 8, kind: 'repsPerSide', to: 12 },
        movement: 'lunge-back'
      },
      {
        address: 'A-03',
        effort: { from: 15, kind: 'reps', to: 20 },
        movement: 'hip-thrust'
      },
      {
        address: 'A-04',
        effort: { from: 15, kind: 'reps', to: 25 },
        movement: 'calf-raise'
      },
      {
        address: 'A-05',
        effort: { from: 30, kind: 'hold', to: 60 },
        movement: 'plank'
      }
    ],
    cooldown: [
      {
        cue: {
          en: 'Knee toward the floor, hips pushed slightly forward: they do the stretching, not the pull on the ankle.',
          fr: 'Genou vers le sol, bassin poussé légèrement en avant : c’est lui qui étire, pas la traction sur la cheville.'
        },
        detail: { en: '30 s per leg', fr: '30 s par jambe' },
        figure: 'quad-stretch',
        name: { en: 'Quadriceps', fr: 'Quadriceps' },
        perSide: true,
        seconds: 30
      },
      HAMSTRING_STRETCH,
      {
        cue: {
          en: 'Ankle crossed over the opposite thigh, knee open to the side, then draw that thigh toward the chest.',
          fr: 'Cheville croisée sur la cuisse opposée, genou ouvert vers l’extérieur, puis on ramène cette cuisse vers la poitrine.'
        },
        detail: { en: '30 s per side', fr: '30 s par côté' },
        figure: 'glute-stretch',
        name: { en: 'Glutes', fr: 'Fessiers' },
        perSide: true,
        seconds: 30
      }
    ],
    id: 'A',
    kit: { en: 'A mat and a bare wall', fr: 'Un tapis et un mur libre' },
    name: { en: 'Lower body', fr: 'Bas du corps' },
    shape: { kind: 'circuit', restSeconds: 60, rounds: 4 },
    warmup: A_WARMUP
  },
  {
    circuit: [
      {
        address: 'B-01',
        calibrated: true,
        effort: { from: 6, kind: 'reps', to: 15 },
        movement: 'push-up'
      },
      {
        address: 'B-02',
        effort: { from: 6, kind: 'reps', to: 12 },
        movement: 'push-up-narrow'
      },
      {
        address: 'B-03',
        effort: { from: 10, kind: 'reps', to: 15 },
        movement: 'push-up-incline'
      },
      {
        address: 'B-04',
        effort: { from: 20, kind: 'hold', to: 40 },
        movement: 'hollow'
      },
      {
        address: 'B-05',
        effort: { from: 20, kind: 'holdPerSide', to: 40 },
        movement: 'side-plank'
      }
    ],
    cooldown: [
      {
        cue: {
          en: 'Forearm flat against the doorframe, elbow at shoulder height, then bring the chest forward without arching.',
          fr: 'Avant-bras à plat contre le montant, coude à hauteur d’épaule, puis on avance le buste sans cambrer.'
        },
        detail: { en: '30 s per side', fr: '30 s par côté' },
        figure: 'pec-door',
        guard: {
          en: 'Stop at the first feeling of stretch: the front of the shoulder gains nothing at the end of its range.',
          fr: 'On s’arrête à la première sensation d’étirement : l’avant de l’épaule ne gagne rien au bout de l’amplitude.'
        },
        name: { en: 'Doorframe chest stretch', fr: 'Pectoraux au chambranle' },
        perSide: true,
        seconds: 30
      },
      {
        cue: {
          en: 'Elbow to the ceiling, the hand slides down the spine. The other hand guides the elbow, it does not crush it.',
          fr: 'Coude vers le plafond, la main descend le long de la colonne. L’autre main guide le coude, elle ne l’écrase pas.'
        },
        detail: { en: '30 s per arm', fr: '30 s par bras' },
        figure: 'triceps-stretch',
        name: { en: 'Triceps', fr: 'Triceps' },
        perSide: true,
        seconds: 30
      },
      {
        cue: {
          en: 'Arm straight, elbow locked, draw the hand back with the fingers up. One wrist, then the other.',
          fr: 'Bras tendu, coude verrouillé, on ramène la main vers soi doigts vers le haut. Un poignet, puis l’autre.'
        },
        detail: { en: '30 s', fr: '30 s' },
        figure: 'wrist-stretch',
        name: { en: 'Wrists', fr: 'Poignets' },
        seconds: 30
      }
    ],
    id: 'B',
    name: { en: 'Push', fr: 'Poussée' },
    note: {
      en: 'The push-ups get easier as the circuit goes on: the volume holds even when the arms give out.',
      fr: 'La poussée descend en difficulté au fil du circuit : le volume tient même quand les bras lâchent.'
    },
    shape: { kind: 'circuit', restSeconds: 60, rounds: 4 },
    warmup: B_WARMUP
  },
  {
    circuit: [
      {
        address: 'C-01',
        effort: { from: 180, kind: 'hold', to: 180 },
        movement: 'shadow-box'
      },
      {
        address: 'C-02',
        effort: { from: 60, kind: 'hold', to: 60 },
        movement: 'knee-march'
      },
      {
        address: 'C-03',
        effort: { from: 60, kind: 'hold', to: 60 },
        movement: 'squat-slow'
      }
    ],
    cooldown: [
      {
        cue: {
          en: 'Front shin on the floor, back leg long behind, then lower the chest. The hips stay square.',
          fr: 'Tibia avant posé au sol, jambe arrière longue derrière, puis on descend le buste. Les hanches restent de face.'
        },
        detail: { en: '60 s per hip', fr: '60 s par hanche' },
        figure: 'pigeon',
        name: { en: 'Pigeon', fr: 'Pigeon' },
        perSide: true,
        seconds: 60
      },
      {
        cue: {
          en: 'Hand flat on the wall, arm straight at shoulder height, then turn the chest away from it.',
          fr: 'Main à plat au mur, bras tendu à hauteur d’épaule, puis on tourne le buste du côté opposé.'
        },
        detail: { en: '45 s per side', fr: '45 s par côté' },
        figure: 'thoracic-wall',
        name: {
          en: 'Chest opener, hand on the wall',
          fr: 'Ouverture thoracique, bras au mur'
        },
        perSide: true,
        seconds: 45
      },
      {
        cue: {
          en: 'Back knee down, tuck the pelvis under before shifting forward. Without it, the lower back does the work.',
          fr: 'Genou arrière au sol, on rentre le bassin sous soi avant d’avancer. Sans ça, c’est le bas du dos qui travaille.'
        },
        detail: { en: '45 s per leg', fr: '45 s par jambe' },
        figure: 'hip-flexor-lunge',
        name: {
          en: 'Kneeling hip-flexor stretch',
          fr: 'Fléchisseurs de hanche en fente'
        },
        perSide: true,
        seconds: 45
      },
      {
        cue: CAT_COW_CUE,
        detail: { en: '10 each way', fr: '10 allers-retours' },
        figure: 'cat-cow',
        name: { en: 'Cat-cow', fr: 'Chat-vache' }
      }
    ],
    id: 'C',
    name: { en: 'Easy cardio and mobility', fr: 'Cardio doux et mobilité' },
    note: {
      en: 'The recovery session. It must stay easy — that is the point, not a flaw. No impact: everything happens on the mat.',
      fr: 'La séance de récupération. Elle doit rester facile — c’est son intérêt, pas un défaut. Sans impact : tout se fait sur le tapis.'
    },
    shape: { kind: 'circuit', restSeconds: 60, rounds: 4 },
    warmup: []
  },
  {
    circuit: [
      {
        address: 'D-01',
        effort: { from: 10, kind: 'repsPerSide', to: 15 },
        movement: 'row-dumbbell'
      },
      {
        address: 'D-02',
        effort: { from: 10, kind: 'repsPerSide', to: 12 },
        movement: 'rdl-single'
      },
      {
        address: 'D-03',
        effort: { from: 10, kind: 'reps', to: 15 },
        movement: 'ytw'
      },
      {
        address: 'D-04',
        effort: { from: 10, kind: 'repsPerSide', to: 15 },
        movement: 'hip-thrust-single'
      },
      {
        address: 'D-05',
        effort: { from: 20, kind: 'holdPerSide', to: 40 },
        movement: 'side-plank'
      }
    ],
    cooldown: [
      {
        cue: {
          en: 'Kneeling, hips over the knees, chest toward the floor, arms long in front. Walk the hands to one side: that flank opens.',
          fr: 'À genoux, hanches au-dessus des genoux, poitrine vers le sol, bras allongés devant. On promène les mains d’un côté : c’est ce flanc-là qui s’ouvre.'
        },
        detail: { en: '30 s per side', fr: '30 s par côté' },
        figure: 'lat-stretch',
        name: { en: 'Lats', fr: 'Dorsaux' },
        perSide: true,
        seconds: 30
      },
      {
        cue: {
          en: 'Chin toward the chest, hands resting on the head without pulling. Their weight is enough.',
          fr: 'Menton vers la poitrine, mains posées sur le crâne sans tirer. Leur poids suffit.'
        },
        detail: { en: '30 s', fr: '30 s' },
        figure: 'neck-stretch',
        name: { en: 'Neck', fr: 'Nuque' },
        seconds: 30
      },
      HAMSTRING_STRETCH
    ],
    id: 'D',
    kit: {
      en: 'A mat, a bare wall, one light dumbbell',
      fr: 'Un tapis, un mur libre, un haltère léger'
    },
    name: { en: 'Pull', fr: 'Tirage' },
    note: {
      en: 'The posture session: shoulders open, back straight. It is the one not to skip.',
      fr: 'La séance de l’allure : épaules ouvertes, dos droit. C’est celle qu’il ne faut pas sauter.'
    },
    shape: { kind: 'circuit', restSeconds: 60, rounds: 4 },
    warmup: D_WARMUP
  },
  {
    circuit: [
      {
        address: 'E-01',
        effort: { from: 15, kind: 'reps', to: 18 },
        movement: 'squat'
      },
      {
        address: 'E-02',
        calibrated: true,
        effort: { from: 8, kind: 'reps', to: 12 },
        movement: 'push-up'
      },
      {
        address: 'E-03',
        effort: { from: 40, kind: 'hold', to: 50 },
        movement: 'mountain-climber'
      },
      {
        address: 'E-04',
        effort: { from: 8, kind: 'repsPerSide', to: 10 },
        movement: 'lunge-back'
      },
      {
        address: 'E-05',
        effort: { from: 40, kind: 'hold', to: 50 },
        movement: 'plank'
      }
    ],
    cooldown: [
      {
        detail: { en: '5 min', fr: '5 min' },
        free: true,
        name: { en: 'Free mobility', fr: 'Mobilité libre' },
        seconds: 300
      }
    ],
    id: 'E',
    name: { en: 'Full body', fr: 'Full body' },
    note: {
      en: 'One minute, one movement. The rest is whatever is left of the minute: the faster you go, the longer you breathe.',
      fr: 'Une minute, un mouvement. Le repos, c’est ce qui reste de la minute : plus tu vas vite, plus tu souffles.'
    },
    shape: { kind: 'emom', rounds: 4, stationSeconds: 60 },
    warmup: []
  }
]
