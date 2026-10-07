import { FIGURE_IDS, type FigureId } from '@/features/program/program-types'

export type Point = readonly [number, number]
export type Segment = readonly [Point, Point]

/**
 * A figure is a set of joints, not a set of paths. One renderer draws them all,
 * so every plate in this manual shares its line weights, its head size and its
 * ground — and correcting a pose means moving a joint.
 *
 * Side view almost throughout. The near side carries full cream, the far side a
 * spent cream that sits behind it: remove the far limbs and the figure goes
 * flat. The few plates seen from the front give the body its width — `collar`
 * and `pelvis`, where an arm and a leg hang — which a profile never needs.
 *
 * Joints are optional because a detail plate is a real plate: when a movement
 * lives entirely in the ankle, the manual cuts the body off at the thigh rather
 * than printing a person too small to read.
 */
export type Pose = {
  readonly head?: Point
  readonly shoulder?: Point
  /**
   * The mid-back, when the trunk bends. Absent, it sits halfway between hip and
   * shoulder and the trunk is drawn straight.
   */
  readonly spine?: Point
  readonly hip: Point
  /**
   * The outer end of the collarbone, where the near arm hangs: drawn only on a
   * plate seen from the front. Absent, the arm hangs from the shoulder.
   */
  readonly collar?: Point
  /** Where the near leg hangs, on a plate seen from the front. Absent, the hip. */
  readonly pelvis?: Point
  readonly elbow?: Point
  readonly wrist?: Point
  /** The fingertips, when the hand's angle is the movement. */
  readonly hand?: Point
  readonly knee: Point
  readonly ankle: Point
  /** Ball of the foot, when the foot's angle is part of the movement. */
  readonly toe?: Point
  readonly heel?: Point
  readonly far?: {
    readonly collar?: Point
    readonly pelvis?: Point
    readonly elbow?: Point
    readonly wrist?: Point
    readonly hand?: Point
    readonly knee?: Point
    readonly ankle?: Point
    readonly toe?: Point
    readonly heel?: Point
  }
  /** Chair, table, step, wall: whatever the body pushes against. */
  readonly props?: readonly Segment[]
}

export const GROUND = 134

export const POSES: Record<FigureId, Pose> = {
  /* Standing, arm out in front, a quarter of the way round. Not the top of the
     circle: seen from the side an arm overhead runs straight through the head,
     and the plate at rest has to be an instant a reader can name. */
  'arm-circle': {
    ankle: [100, 132],
    elbow: [80, 47],
    far: {
      ankle: [106, 132],
      elbow: [103, 67],
      knee: [107, 110],
      wrist: [104, 86]
    },
    head: [100, 34],
    hip: [104, 86],
    knee: [102, 110],
    shoulder: [102, 48],
    toe: [88, 133],
    wrist: [58, 46]
  },

  /* A detail plate, one leg only: the movement lives in the ankle, so the manual
     cuts the body at the thigh and drops the far leg rather than printing a
     whole person too small to read the heel. Flat floor, no step: up on the
     ball of the foot, the heel high off the ground. */
  'calf-raise': {
    ankle: [126, 113],
    heel: [110, 121],
    hip: [134, 47],
    knee: [130, 81],
    toe: [132, 133]
  },

  /* Quadruped, the rounded half: the mid-back pushed up to the ceiling, the
     head tucked under. Hands and knees never move; the curve of the trunk is
     the whole gesture, and it needs the spine joint to be drawn at all. */
  'cat-cow': {
    ankle: [148, 133],
    elbow: [62, 110],
    far: {
      ankle: [152, 134],
      elbow: [67, 111],
      knee: [128, 132],
      wrist: [64, 133]
    },
    head: [54, 106],
    hip: [122, 90],
    knee: [124, 130],
    shoulder: [66, 88],
    spine: [95, 70],
    toe: [158, 134],
    wrist: [58, 132]
  },

  /* Seen from the front: the rotation happens around the length of the upper
     arm, and only a front view shows the hand travelling. Without the shoulder
     and hip bars the arms hung from the neck in a V and the legs read as a
     stride: on a phone it was a man walking (session B, October 2026). The
     plate prints the end of the opening, forearms about fifty degrees out —
     foreshortened, because they still point half at the reader. */
  'external-rotation': {
    ankle: [92, 132],
    collar: [88, 51],
    elbow: [88, 72],
    far: {
      ankle: [108, 132],
      collar: [112, 51],
      elbow: [112, 72],
      knee: [107, 111],
      pelvis: [106, 89],
      toe: [114, 134],
      wrist: [127, 72]
    },
    head: [100, 35],
    hip: [100, 88],
    knee: [93, 111],
    pelvis: [94, 89],
    shoulder: [100, 50],
    toe: [86, 134],
    wrist: [73, 72]
  },

  /* The same rep in profile, printed beside the front view: the one thing a
     front view cannot say is that the elbow is bent square and the forearm
     points forward. Opening, the forearm turns toward the reader and shortens;
     nothing else on the body moves. */
  'external-rotation-side': {
    ankle: [102, 132],
    elbow: [96, 67],
    far: {
      ankle: [104, 132],
      elbow: [97, 67],
      knee: [105, 110],
      toe: [116, 133],
      wrist: [109, 68]
    },
    head: [103, 34],
    hip: [102, 86],
    knee: [103, 110],
    shoulder: [102, 48],
    toe: [114, 133],
    wrist: [108, 68]
  },

  /* On the back, the near ankle crossed over the far thigh, both hands clasped
     behind that thigh and pulling it in. The pulled leg is drawn upright on
     purpose: laid at a shallow angle it met the crossed shin and the two arms at
     the same pitch, and four limbs at one angle print a lattice, not a body. A
     vertical column with one bar across it is the figure four, and it is the
     only arrangement of these five strokes a reader can name at a glance. */
  'glute-stretch': {
    ankle: [91, 104],
    elbow: [68, 112],
    far: {
      ankle: [86, 80],
      elbow: [72, 114],
      knee: [92, 105],
      wrist: [90, 111]
    },
    head: [34, 124],
    hip: [88, 131],
    knee: [110, 114],
    shoulder: [50, 129],
    toe: [80, 100],
    wrist: [88, 112]
  },

  /* Seated, one leg out along the floor, the trunk folded over it. The far leg
     is tucked, and a tucked knee opens sideways — so the profile prints it
     foreshortened and low rather than pretending the thigh kept its length. */
  'hamstring-stretch': {
    ankle: [120, 126],
    elbow: [104, 112],
    far: {
      ankle: [86, 131],
      elbow: [106, 114],
      knee: [88, 116],
      wrist: [122, 122]
    },
    head: [104, 94],
    hip: [70, 128],
    knee: [96, 130],
    shoulder: [90, 98],
    toe: [130, 116],
    wrist: [120, 120]
  },

  /* Standing on the far leg, the near knee lifted in front. The knee then
     travels out to the side, which a profile can only say by foreshortening the
     thigh — so the leg never comes back down, and the circle is the half of it
     that a side view can carry. */
  'hip-circle': {
    ankle: [72, 110],
    elbow: [92, 68],
    far: {
      ankle: [104, 132],
      elbow: [110, 68],
      knee: [106, 110],
      wrist: [104, 84]
    },
    head: [100, 34],
    hip: [104, 86],
    knee: [76, 86],
    shoulder: [102, 48],
    toe: [60, 112],
    wrist: [98, 84]
  },

  /* Half-kneeling: back knee down, front foot planted, trunk stacked upright
     over the hips. The whole stretch is the back hip pushing forward, which only
     reads if the trunk stays vertical — leaned forward it says nothing. */
  'hip-flexor-lunge': {
    ankle: [128, 128],
    elbow: [112, 82],
    far: {
      ankle: [66, 130],
      elbow: [106, 84],
      knee: [92, 126],
      toe: [54, 133],
      wrist: [114, 102]
    },
    head: [96, 50],
    hip: [100, 100],
    knee: [124, 104],
    shoulder: [98, 64],
    toe: [142, 132],
    wrist: [120, 100]
  },

  /* The top: one straight line from shoulders through hips to knees, ribs
     down, knees at a right angle over the heels. Higher than this is the lower
     back arching, not the glutes working. */
  'hip-thrust': {
    ankle: [128, 133],
    elbow: [78, 132],
    far: { ankle: [124, 134], knee: [112, 106] },
    head: [42, 125],
    hip: [91, 115],
    knee: [116, 104],
    shoulder: [58, 128],
    toe: [142, 134],
    wrist: [98, 133]
  },

  /* The top on one leg: the far leg is planted, shoulders, hips and its knee in
     one line; the near leg is held straight, raised a little above that line. */
  'hip-thrust-single': {
    ankle: [131, 85],
    elbow: [76, 132],
    far: { ankle: [126, 133], knee: [114, 104] },
    head: [40, 125],
    hip: [89, 115],
    knee: [111, 99],
    shoulder: [56, 128],
    toe: [139, 80],
    wrist: [96, 133]
  },

  hollow: {
    ankle: [166, 106],
    elbow: [62, 104],
    far: {
      ankle: [164, 110],
      elbow: [64, 108],
      knee: [138, 120],
      wrist: [44, 102]
    },
    head: [72, 108],
    hip: [112, 124],
    knee: [140, 116],
    shoulder: [84, 114],
    toe: [176, 102],
    wrist: [42, 98]
  },

  /* Standing tall, the near knee lifted to hip height, the opposite arm
     forward: one step of a march on the spot. */
  'knee-march': {
    ankle: [124, 108],
    elbow: [94, 66],
    far: {
      ankle: [106, 132],
      elbow: [112, 64],
      knee: [106, 110],
      toe: [118, 134],
      wrist: [124, 56]
    },
    head: [100, 34],
    hip: [104, 86],
    knee: [126, 84],
    shoulder: [102, 48],
    toe: [134, 110],
    wrist: [90, 84]
  },

  /* Kneeling, hips left standing over the knees, chest sunk toward the floor,
     arms long on the floor ahead. Sitting the buttocks back onto the heels is
     the same stretch and was drawn first, but it puts hips and shoulders at one
     height and the whole body inside sixteen units of the floor: it printed as a
     figure lying flat. Keeping the hips up buys the diagonal that says kneeling.
     The standing side bend was drawn first and twice thrown away: this skeleton
     carries no shoulder width and no hip width, so nothing in it declares which
     way the body faces, and a side bend seen from the front prints the exact
     silhouette of a forward bend seen from the side. The external rotation gets
     away with « de face » only because its axis stays vertical and its limbs
     splay evenly — which is the one thing a side bend cannot do. So the stretch
     changed rather than the drawing: this one is unmistakable in profile, and
     the side it opens is carried by the plate's own label and by the cue. */
  'lat-stretch': {
    ankle: [84, 133],
    elbow: [158, 130],
    far: { elbow: [156, 133], wrist: [176, 134] },
    head: [154, 122],
    hip: [106, 106],
    knee: [110, 131],
    shoulder: [140, 122],
    toe: [72, 134],
    wrist: [178, 132]
  },

  'lunge-back': {
    ankle: [120, 132],
    elbow: [100, 80],
    far: {
      ankle: [60, 130],
      elbow: [92, 80],
      knee: [78, 122],
      wrist: [88, 100]
    },
    head: [94, 46],
    hip: [98, 98],
    knee: [120, 104],
    shoulder: [96, 60],
    toe: [134, 133],
    wrist: [104, 100]
  },

  'mountain-climber': {
    ankle: [98, 133],
    elbow: [62, 112],
    far: {
      ankle: [176, 128],
      elbow: [70, 114],
      knee: [148, 118],
      wrist: [66, 133]
    },
    head: [52, 88],
    hip: [118, 108],
    knee: [90, 120],
    shoulder: [66, 92],
    toe: [108, 134],
    wrist: [58, 132]
  },

  /* Chin drawn to the chest, hands resting on the back of the skull — resting,
     never pulling — elbows forward in front of the face. Spread wide, the elbows
     would put the arms out in a cross and turned out, the lax shoulder's armed
     position. A tucked chin genuinely shortens the neck on the page, so the
     head sits closer to the shoulder here than on any other plate. */
  'neck-stretch': {
    ankle: [92, 132],
    elbow: [116, 47],
    far: {
      ankle: [98, 132],
      elbow: [114, 50],
      knee: [100, 110],
      toe: [112, 133],
      wrist: [101, 37]
    },
    head: [106, 40],
    hip: [96, 86],
    knee: [94, 110],
    shoulder: [98, 48],
    toe: [106, 133],
    wrist: [100, 35]
  },

  /* Facing away from the doorframe, forearm flat up the jamb with the elbow a
     hand below the shoulder — never level with it, the lax shoulder's armed
     position — chest turned off it. The lintel is drawn because a bare vertical is a wall, and the wall is
     already another plate: two stretches a reader cannot tell apart are one
     stretch badly drawn. */
  'pec-door': {
    ankle: [88, 132],
    elbow: [116, 55],
    far: {
      ankle: [108, 132],
      elbow: [86, 64],
      knee: [104, 108],
      toe: [94, 133],
      wrist: [78, 82]
    },
    head: [90, 32],
    hip: [98, 84],
    knee: [92, 108],
    props: [
      [
        [132, 16],
        [132, 134]
      ],
      [
        [132, 16],
        [174, 16]
      ]
    ],
    shoulder: [96, 47],
    toe: [74, 133],
    wrist: [130, 41]
  },

  /* Front shin folded in, back leg long behind, trunk down over the front hip.
     The front shin lies across the body and would vanish drawn honestly, so it
     is printed folded under instead — the instant a reader can name. */
  pigeon: {
    ankle: [102, 130],
    elbow: [126, 106],
    far: {
      ankle: [48, 131],
      elbow: [136, 104],
      knee: [74, 126],
      toe: [36, 134],
      wrist: [144, 122]
    },
    head: [131, 80],
    hip: [100, 116],
    knee: [124, 124],
    shoulder: [118, 86],
    toe: [90, 134],
    wrist: [134, 124]
  },

  plank: {
    ankle: [170, 132],
    elbow: [64, 132],
    far: {
      ankle: [172, 135],
      elbow: [70, 133],
      knee: [142, 129],
      wrist: [52, 134]
    },
    head: [50, 106],
    hip: [110, 120],
    knee: [140, 126],
    shoulder: [64, 110],
    toe: [178, 134],
    wrist: [46, 133]
  },

  'push-up': {
    ankle: [176, 124],
    elbow: [64, 112],
    far: {
      ankle: [178, 127],
      elbow: [72, 114],
      knee: [150, 119],
      wrist: [68, 133]
    },
    head: [54, 88],
    hip: [122, 108],
    knee: [149, 116],
    shoulder: [68, 92],
    toe: [186, 132],
    wrist: [60, 132]
  },

  'push-up-feet-raised': {
    ankle: [164, 76],
    elbow: [50, 112],
    far: {
      ankle: [166, 79],
      elbow: [56, 113],
      knee: [138, 83],
      wrist: [52, 133]
    },
    head: [38, 90],
    hip: [108, 84],
    knee: [136, 80],
    props: [
      [
        [148, 76],
        [196, 76]
      ],
      [
        [150, 76],
        [150, 134]
      ]
    ],
    shoulder: [52, 92],
    toe: [174, 74],
    wrist: [48, 132]
  },

  /* The pose approved in the design comparison, joint for joint. */
  'push-up-incline': {
    ankle: [22, 129],
    elbow: [114, 77],
    far: {
      ankle: [27, 127],
      elbow: [119, 75],
      knee: [45, 116],
      wrist: [135, 64]
    },
    head: [95, 70],
    hip: [62, 106],
    knee: [40, 118],
    props: [
      [
        [120, 64],
        [194, 64]
      ],
      [
        [187, 64],
        [187, 134]
      ]
    ],
    shoulder: [98, 88],
    toe: [13, 132],
    wrist: [131, 66]
  },

  'push-up-knees': {
    ankle: [164, 112],
    elbow: [62, 112],
    far: {
      ankle: [166, 115],
      elbow: [70, 114],
      knee: [144, 131],
      wrist: [66, 133]
    },
    head: [52, 88],
    hip: [116, 108],
    knee: [142, 128],
    shoulder: [66, 92],
    toe: [172, 106],
    wrist: [58, 132]
  },

  /* The bottom of a narrow push-up, chest a fist from the floor. The hands sit
     under the shoulders and the elbows fold back along the ribs, toward the
     feet: that is the only thing a side view can say about hand width. The
     first cut put the hands a forearm ahead of the shoulders and the elbow above
     them, which is a body falling forward, not a push-up. The body is the top
     plank turned about the toes, so its line stays straight. */
  'push-up-narrow': {
    ankle: [175, 126],
    elbow: [82, 119],
    far: {
      ankle: [177, 129],
      elbow: [83, 118],
      knee: [148, 126],
      wrist: [71, 133]
    },
    head: [48, 113],
    hip: [119, 120],
    knee: [147, 123],
    shoulder: [63, 114],
    toe: [186, 132],
    wrist: [67, 132]
  },

  /* ---------------------------------------------------------------- *
   * The stretches. Each prints the stretch itself; its counterpose is where
   * the body starts, and the plate shows the way in a few times before
   * resting here. A hold alone did not teach the hold: « I understood
   * nothing, and the figure doesn't move » (session B, October 2026).
   * ---------------------------------------------------------------- */

  /* Standing on the far leg, the near heel drawn up to the buttock, the hand on
     that ankle. Two things were wrong on the first cut and both made it read as
     a running stride: the heel sat at knee height in front of the body, and the
     free arm reached forward. The heel now finishes above the hip and behind it,
     and the free arm hangs — a stride has no hand on its own ankle. */
  'quad-stretch': {
    ankle: [80, 90],
    elbow: [92, 66],
    far: {
      ankle: [110, 133],
      elbow: [110, 66],
      knee: [108, 109],
      toe: [124, 134],
      wrist: [112, 86]
    },
    head: [102, 32],
    hip: [104, 84],
    knee: [98, 109],
    shoulder: [104, 47],
    toe: [68, 84],
    wrist: [80, 84]
  },

  /* Facing left, so the standing foot points left too: turned back, it lay
     along the floor like a shin and the figure read as kneeling. */
  'rdl-single': {
    ankle: [98, 132],
    elbow: [54, 98],
    far: {
      ankle: [158, 74],
      elbow: [60, 98],
      knee: [126, 80],
      wrist: [58, 118]
    },
    head: [42, 76],
    hip: [94, 84],
    knee: [96, 108],
    shoulder: [56, 78],
    toe: [84, 133],
    wrist: [52, 118]
  },

  /* Bent over, back flat at about thirty degrees, knees soft. The near arm has
     pulled the dumbbell up, elbow drawn to the hip; the far hand rests on the
     thigh. No bench and no table: this is the floor version. */
  'row-dumbbell': {
    ankle: [100, 132],
    elbow: [117, 60],
    far: {
      ankle: [110, 132],
      elbow: [121, 78],
      knee: [112, 107],
      toe: [122, 134],
      wrist: [106, 94]
    },
    head: [148, 57],
    hip: [100, 82],
    knee: [107, 106],
    shoulder: [133, 63],
    toe: [112, 134],
    wrist: [117, 78]
  },

  /* High plank, elbows locked, the chest pushed away from the floor: the top of
     the scapular push-up, where the shoulder blades are spread wide. */
  'scapular-push-up': {
    ankle: [178, 124],
    elbow: [60, 110],
    far: {
      ankle: [180, 127],
      elbow: [66, 112],
      knee: [151, 117],
      wrist: [64, 133]
    },
    head: [46, 84],
    hip: [120, 104],
    knee: [150, 114],
    shoulder: [62, 88],
    toe: [188, 131],
    wrist: [58, 132]
  },

  'shadow-box': {
    ankle: [86, 132],
    elbow: [82, 54],
    far: {
      ankle: [128, 133],
      elbow: [114, 66],
      knee: [122, 110],
      wrist: [106, 48]
    },
    head: [100, 36],
    hip: [104, 86],
    knee: [90, 108],
    shoulder: [102, 50],
    toe: [74, 133],
    wrist: [62, 50]
  },

  /* Fingertips on the shoulders, the elbow drawing the circle. The shoulder
     itself rolls barely a hand's width, and a neck stretched to follow it reads
     as a nod; the elbow says the same movement at a size a reader can see. The
     plate prints it forward and low, clear of the head. */
  'shoulder-roll': {
    ankle: [100, 132],
    elbow: [84, 57],
    far: {
      ankle: [106, 132],
      elbow: [90, 64],
      knee: [107, 110],
      wrist: [106, 48]
    },
    head: [100, 34],
    hip: [104, 86],
    knee: [102, 110],
    shoulder: [102, 48],
    toe: [88, 133],
    wrist: [100, 46]
  },

  'side-plank': {
    ankle: [176, 132],
    elbow: [58, 82],
    far: {
      ankle: [174, 135],
      elbow: [62, 132],
      knee: [146, 128],
      wrist: [44, 133]
    },
    head: [48, 98],
    hip: [118, 118],
    knee: [148, 125],
    shoulder: [60, 104],
    toe: [184, 134],
    wrist: [56, 60]
  },
  squat: {
    ankle: [100, 132],
    elbow: [126, 74],
    far: {
      ankle: [92, 132],
      elbow: [122, 78],
      knee: [116, 106],
      wrist: [142, 76]
    },
    head: [110, 54],
    hip: [94, 104],
    knee: [122, 110],
    shoulder: [104, 68],
    toe: [114, 134],
    wrist: [146, 70]
  },

  /* Side-on to a bare wall, arm straight back at shoulder height, the chest
     turning off it. Straight arm and a plain wall, against the doorframe's bent
     elbow and lintel: the two plates read apart at a metre. */
  'thoracic-wall': {
    ankle: [88, 132],
    elbow: [113, 50],
    far: {
      ankle: [108, 132],
      elbow: [80, 62],
      knee: [104, 108],
      toe: [94, 133],
      wrist: [96, 70]
    },
    head: [84, 34],
    hip: [98, 84],
    knee: [92, 108],
    props: [
      [
        [135, 12],
        [135, 134]
      ]
    ],
    shoulder: [92, 47],
    toe: [74, 133],
    wrist: [133, 52]
  },

  /* Seen from the front, for the reason the arm circle states: an arm overhead
     runs straight through the head in profile. The stretched arm is the far
     one, in spent ink, because its forearm goes behind the head: drawn first,
     the head and the neck cover it as the body covers it. The near arm comes
     over the top of the head and its hand holds that elbow. */
  'triceps-stretch': {
    ankle: [92, 132],
    collar: [88, 51],
    elbow: [88, 28],
    far: {
      ankle: [108, 132],
      collar: [112, 51],
      elbow: [112, 28],
      knee: [107, 111],
      pelvis: [106, 89],
      toe: [114, 134],
      wrist: [101, 47]
    },
    head: [100, 35],
    hip: [100, 88],
    knee: [93, 111],
    pelvis: [94, 89],
    shoulder: [100, 50],
    toe: [86, 134],
    wrist: [109, 25]
  },

  walk: {
    ankle: [140, 130],
    elbow: [86, 66],
    far: {
      ankle: [64, 131],
      elbow: [118, 66],
      knee: [78, 108],
      wrist: [130, 58]
    },
    head: [104, 36],
    hip: [100, 86],
    knee: [124, 106],
    shoulder: [102, 50],
    toe: [152, 133],
    wrist: [74, 80]
  },

  /* The arm straight out front at shoulder height, fingers up, the other hand
     over the fingers drawing them back. Without a hand the plate showed two arms
     reaching forward and nothing about a wrist, so the skeleton grew one: the
     wrist bending back is the whole stretch. */
  'wrist-stretch': {
    ankle: [94, 132],
    elbow: [116, 49],
    far: {
      ankle: [100, 132],
      elbow: [115, 56],
      hand: [139, 37],
      knee: [102, 110],
      toe: [114, 133],
      wrist: [132, 46]
    },
    hand: [136, 38],
    head: [99, 33],
    hip: [98, 86],
    knee: [96, 110],
    shoulder: [96, 48],
    toe: [108, 133],
    wrist: [136, 50]
  },

  /* Prone, chest and arms off the floor. The arms have to climb steeply or they
     read as a continuation of the body rather than as lifted. */
  ytw: {
    ankle: [182, 134],
    elbow: [76, 102],
    far: { elbow: [80, 108], wrist: [64, 94] },
    head: [82, 112],
    hip: [130, 132],
    knee: [158, 133],
    shoulder: [94, 120],
    toe: [190, 135],
    wrist: [60, 88]
  }
}

/**
 * The skeleton's topology, named once. The renderer walks it to draw, the
 * interpolator walks it to move, and the frame walks it to measure — before
 * this table each of the three carried its own copy of "a shin runs from the
 * knee to the ankle", and they drifted.
 */
export const JOINT_IDS = [
  'head',
  'shoulder',
  'spine',
  'hip',
  'elbow',
  'wrist',
  'knee',
  'ankle',
  'toe',
  'heel',
  'far.elbow',
  'far.wrist',
  'far.knee',
  'far.ankle',
  'far.toe',
  'far.heel',
  'collar',
  'pelvis',
  'hand',
  'far.collar',
  'far.pelvis',
  'far.hand'
] as const

export type JointId = (typeof JOINT_IDS)[number]

export type Joints = Partial<Record<JointId, Point>>

export type Bone = {
  readonly from: JointId
  readonly to: JointId
  readonly far: boolean
}

/**
 * Far side first: the near limbs are drawn over it, which is the depth. The
 * girdle — collarbones and pelvis — is one bar in full ink on both sides: a
 * shoulder line half spent reads as broken, not as far.
 */
export const BONES: readonly Bone[] = [
  { far: true, from: 'far.pelvis', to: 'far.knee' },
  { far: true, from: 'far.knee', to: 'far.ankle' },
  { far: true, from: 'far.ankle', to: 'far.toe' },
  { far: true, from: 'far.ankle', to: 'far.heel' },
  { far: true, from: 'far.collar', to: 'far.elbow' },
  { far: true, from: 'far.elbow', to: 'far.wrist' },
  { far: true, from: 'far.wrist', to: 'far.hand' },
  { far: false, from: 'hip', to: 'pelvis' },
  { far: false, from: 'hip', to: 'far.pelvis' },
  { far: false, from: 'shoulder', to: 'collar' },
  { far: false, from: 'shoulder', to: 'far.collar' },
  { far: false, from: 'hip', to: 'spine' },
  { far: false, from: 'spine', to: 'shoulder' },
  { far: false, from: 'pelvis', to: 'knee' },
  { far: false, from: 'knee', to: 'ankle' },
  { far: false, from: 'ankle', to: 'toe' },
  { far: false, from: 'ankle', to: 'heel' },
  { far: false, from: 'collar', to: 'elbow' },
  { far: false, from: 'elbow', to: 'wrist' },
  { far: false, from: 'wrist', to: 'hand' },
  { far: false, from: 'shoulder', to: 'head' }
]

/** The hip is the root: every other joint hangs off it through the bones. */
export const ROOT: JointId = 'hip'

const halfway = (from: Point, to: Point): Point => [
  (from[0] + to[0]) / 2,
  (from[1] + to[1]) / 2
]

export const jointsOf = (pose: Pose): Joints => {
  const { far = {} } = pose
  const spine =
    pose.spine ??
    (pose.shoulder === undefined ? undefined : halfway(pose.hip, pose.shoulder))
  return {
    ankle: pose.ankle,
    collar: pose.collar ?? pose.shoulder,
    elbow: pose.elbow,
    'far.ankle': far.ankle,
    'far.collar': far.collar ?? pose.shoulder,
    'far.elbow': far.elbow,
    'far.hand': far.hand,
    'far.heel': far.heel,
    'far.knee': far.knee,
    'far.pelvis': far.pelvis ?? pose.hip,
    'far.toe': far.toe,
    'far.wrist': far.wrist,
    hand: pose.hand,
    head: pose.head,
    heel: pose.heel,
    hip: pose.hip,
    knee: pose.knee,
    pelvis: pose.pelvis ?? pose.hip,
    shoulder: pose.shoulder,
    spine,
    toe: pose.toe,
    wrist: pose.wrist
  }
}

const HEAD_RADIUS = 7
const PAD = 9

const pointsOf = (pose: Pose): Point[] => {
  const joints = Object.values(jointsOf(pose)).filter(
    (point): point is Point => point !== undefined
  )

  return [...joints, ...(pose.props ?? []).flat()]
}

/**
 * The frame hugs the pose. A supine figure is five times wider than it is tall
 * and a standing one is taller than wide; forcing both into one frame shape
 * shrank the flat poses to a fifth of the plate. The figure slot has fixed
 * dimensions instead, and the drawing scales to fill it — so the layout never
 * moves when the plate turns, and no pose is ever printed small.
 *
 * A moving figure passes every pose of its cycle: the frame is measured over
 * all of them at once, or the viewBox would be recomputed each frame and the
 * whole drawing would breathe in and out while the body moved.
 */
export const frameOf = (
  ...poses: readonly Pose[]
): { box: string; ground: Segment } => {
  const points = poses.flatMap(pointsOf)
  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  const reach = poses.every((pose) => pose.head === undefined)
    ? PAD
    : PAD + HEAD_RADIUS

  const left = Math.min(...xs) - reach
  const right = Math.max(...xs) + reach
  const bottom = Math.max(...ys, GROUND) + PAD
  const top = Math.min(...ys) - reach

  return {
    box: `${left} ${top} ${right - left} ${bottom - top}`,
    ground: [
      [left + 4, GROUND],
      [right - 4, GROUND]
    ]
  }
}

export const isFigureId = (value: string): value is FigureId =>
  FIGURE_IDS.some((id) => id === value)

export const parseFigureId = (value: string): FigureId | null =>
  FIGURE_IDS.find((id) => id === value) ?? null
