import type { FigureId } from '@/features/program/program-types'

import type { Pose } from './poses'

/**
 * The far end of each gesture: the plate in POSES is one extreme, this is the
 * other, and the movement is the road between them.
 *
 * These are read in full: the direction a joint points AND its distance. A
 * side view foreshortens whatever leaves the sagittal plane, and that
 * shortening is information — a shin tucked under the body belongs on the page
 * at half its length, and the movement interpolates the length alongside the
 * angle so the limb foreshortens on its way instead of snapping.
 *
 * The price is that two drawings which disagree on a femur for no reason make
 * it grow while the movement runs. So disagree only where the body really
 * turns out of the plane, and keep the contact point — the planted foot, the
 * hand on the floor — exact: it is what the body pushes against, and the
 * interpolation pins the whole figure back onto it.
 *
 * Props are inherited from the printed plate: a chair does not move because a
 * body does.
 *
 * Plank, side plank and hollow are missing on purpose. They are holds, the
 * movement does not move, and a figure that breathes to look alive would be
 * teaching a rep that does not exist. The stretches are holds too, but getting
 * into one is a gesture a beginner has to be shown: their counterpose is where
 * the body starts, and the plate rests on the stretch once it has shown the way.
 */
export const COUNTERPOSES: Partial<Record<FigureId, Pose>> = {
  /* Half a revolution on: the arm out behind. With the two crossings it makes a
     full circle rather than a swing back and forth. */
  'arm-circle': {
    ankle: [100, 132],
    elbow: [124, 49],
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
    wrist: [146, 50]
  },

  /* Heels back on the floor. The ball of the foot is the contact and never
     moves; everything above it rides down with the heel. */
  'calf-raise': {
    ankle: [116, 124],
    heel: [104, 131],
    hip: [122, 58],
    knee: [119, 92],
    toe: [132, 133]
  },

  /* The hollowed half: the belly drops, the mid-back sags below the line of
     hip and shoulder, and the head lifts to look ahead. Hands and knees hold. */
  'cat-cow': {
    ankle: [148, 133],
    elbow: [64, 111],
    far: {
      ankle: [152, 134],
      elbow: [69, 112],
      knee: [128, 132],
      wrist: [64, 133]
    },
    head: [50, 76],
    hip: [124, 90],
    knee: [124, 130],
    shoulder: [70, 90],
    spine: [97, 104],
    toe: [158, 134],
    wrist: [58, 132]
  },

  /* The start: forearms in front of the belly, hands a little inward. From the
     front they point half at the reader and print short; opening, each hand
     slides straight out past its elbow, which is what a rotation looks like
     face on. */
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
      wrist: [105, 73]
    },
    head: [100, 35],
    hip: [100, 88],
    knee: [93, 111],
    pelvis: [94, 89],
    shoulder: [100, 50],
    toe: [86, 134],
    wrist: [95, 73]
  },

  /* The start in profile: the forearm straight out front, longest here because
     it points along the page. */
  'external-rotation-side': {
    ankle: [102, 132],
    elbow: [96, 67],
    far: {
      ankle: [104, 132],
      elbow: [97, 67],
      knee: [105, 110],
      toe: [116, 133],
      wrist: [116, 68]
    },
    head: [103, 34],
    hip: [102, 86],
    knee: [103, 110],
    shoulder: [102, 48],
    toe: [114, 133],
    wrist: [115, 68]
  },

  /* On the back, both feet flat, the near ankle already crossed over the far
     knee, arms along the body. The far foot then leaves the floor and both
     hands bring that thigh in. */
  'glute-stretch': {
    ankle: [104, 108],
    elbow: [74, 131],
    far: {
      ankle: [124, 132],
      elbow: [74, 132],
      knee: [106, 112],
      wrist: [94, 133]
    },
    head: [34, 124],
    hip: [88, 131],
    knee: [113, 119],
    shoulder: [50, 129],
    toe: [93, 104],
    wrist: [94, 132]
  },

  /* Sitting tall over the long leg, hands resting on the thigh. The fold
     starts at the hips and the hands slide toward the foot. */
  'hamstring-stretch': {
    ankle: [120, 126],
    elbow: [78, 111],
    far: {
      ankle: [86, 131],
      elbow: [80, 112],
      knee: [88, 116],
      wrist: [96, 121]
    },
    head: [76, 78],
    hip: [70, 128],
    knee: [96, 130],
    shoulder: [74, 92],
    toe: [130, 116],
    wrist: [94, 120]
  },

  /* The knee carried out to the side, the thigh pointing at the reader and so
     drawn at half its length. The far leg stands throughout. */
  'hip-circle': {
    ankle: [84, 116],
    elbow: [92, 68],
    far: {
      ankle: [104, 132],
      elbow: [110, 68],
      knee: [106, 110],
      wrist: [104, 84]
    },
    head: [100, 34],
    hip: [104, 86],
    knee: [92, 94],
    shoulder: [102, 48],
    toe: [72, 118],
    wrist: [98, 84]
  },

  /* Half-kneeling with the hips still back over the back knee, trunk
     upright, hands on the front thigh. The whole stretch is the hips moving
     forward from here; the trunk only rides along. */
  'hip-flexor-lunge': {
    ankle: [128, 128],
    elbow: [104, 83],
    far: {
      ankle: [66, 130],
      elbow: [100, 85],
      knee: [92, 126],
      toe: [54, 133],
      wrist: [108, 103]
    },
    head: [90, 50],
    hip: [94, 100],
    knee: [118, 106],
    shoulder: [92, 64],
    toe: [142, 132],
    wrist: [112, 101]
  },

  /* Hips down on the floor. Shoulders and heels are the two contacts and never
     move; the knee barely does either, which is why the lift reads as the hips
     alone rising between them. */
  'hip-thrust': {
    ankle: [128, 133],
    elbow: [78, 132],
    far: { ankle: [124, 134], knee: [107, 109] },
    head: [42, 125],
    hip: [96, 130],
    knee: [111, 107],
    shoulder: [58, 128],
    toe: [142, 134],
    wrist: [98, 133]
  },

  /* Hips down, the free leg still locked out — it follows the pelvis down
     rather than folding, which is the whole difficulty of the single-leg. */
  'hip-thrust-single': {
    ankle: [135, 102],
    elbow: [76, 132],
    far: { ankle: [126, 133], knee: [109, 107] },
    head: [40, 125],
    hip: [93, 130],
    knee: [115, 116],
    shoulder: [56, 128],
    toe: [143, 97],
    wrist: [90, 133]
  },

  /* The other step: the far knee up, the arms swapped. */
  'knee-march': {
    ankle: [104, 132],
    elbow: [112, 64],
    far: {
      ankle: [124, 108],
      elbow: [94, 66],
      knee: [126, 84],
      toe: [134, 110],
      wrist: [90, 84]
    },
    head: [100, 34],
    hip: [104, 86],
    knee: [104, 110],
    shoulder: [102, 48],
    toe: [116, 134],
    wrist: [124, 56]
  },

  /* Kneeling upright, arms hanging. The trunk then folds forward from the
     hips and the arms reach long along the floor; the hips stay over the knees. */
  'lat-stretch': {
    ankle: [84, 133],
    elbow: [113, 89],
    far: {
      elbow: [114, 89],
      wrist: [115, 108]
    },
    head: [113, 55],
    hip: [110, 106],
    knee: [110, 131],
    shoulder: [112, 69],
    toe: [72, 134],
    wrist: [114, 108]
  },

  /* Standing, feet together: the back leg has swung home under the hip. */
  'lunge-back': {
    ankle: [120, 132],
    elbow: [121, 64],
    far: {
      ankle: [106, 132],
      elbow: [113, 64],
      knee: [110, 108],
      wrist: [109, 84]
    },
    head: [115, 30],
    hip: [116, 82],
    knee: [118, 106],
    shoulder: [117, 44],
    toe: [134, 133],
    wrist: [125, 84]
  },

  /* The legs swapped. Same trunk, same hands: the whole movement is the two
     knees trading places under the hips. */
  'mountain-climber': {
    ankle: [176, 128],
    elbow: [62, 112],
    far: {
      ankle: [98, 134],
      elbow: [70, 114],
      knee: [90, 122],
      wrist: [66, 133]
    },
    head: [52, 88],
    hip: [118, 108],
    knee: [148, 118],
    shoulder: [66, 92],
    toe: [186, 132],
    wrist: [58, 132]
  },

  /* Standing tall, head level, arms hanging. The hands come up to rest on the
     back of the head and the chin drops toward the chest. */
  'neck-stretch': {
    ankle: [92, 132],
    elbow: [99, 67],
    far: {
      ankle: [98, 132],
      elbow: [100, 67],
      knee: [100, 110],
      toe: [112, 133],
      wrist: [102, 86]
    },
    head: [100, 33],
    hip: [96, 86],
    knee: [94, 110],
    shoulder: [98, 48],
    toe: [106, 133],
    wrist: [100, 86]
  },

  /* The forearm already on the jamb, the chest still level with the
     doorway. Only the chest travels: it moves forward, away from the frame. */
  'pec-door': {
    ankle: [88, 132],
    elbow: [121, 57],
    far: {
      ankle: [108, 132],
      elbow: [102, 66],
      knee: [104, 108],
      toe: [94, 133],
      wrist: [104, 85]
    },
    head: [103, 33],
    hip: [98, 84],
    knee: [92, 108],
    shoulder: [104, 48],
    toe: [74, 133],
    wrist: [130, 41]
  },

  /* Legs already placed, trunk upright over the front hip, hands resting on the
     front leg. The chest then lowers over that leg. */
  pigeon: {
    ankle: [102, 130],
    elbow: [110, 101],
    far: {
      ankle: [48, 131],
      elbow: [112, 101],
      knee: [74, 126],
      toe: [36, 134],
      wrist: [120, 121]
    },
    head: [108, 67],
    hip: [100, 116],
    knee: [124, 124],
    shoulder: [104, 81],
    toe: [90, 134],
    wrist: [115, 120]
  },

  /* The bottom: chest near the floor, elbow driven back toward the feet and
     never flared out — the 45 degrees the push-up guard asks for, said in the
     only way a side view can say it. */
  'push-up': {
    ankle: [176, 126],
    elbow: [80, 127],
    far: {
      ankle: [178, 129],
      elbow: [84, 128],
      knee: [150, 125],
      wrist: [66, 134]
    },
    head: [54, 106],
    hip: [122, 120],
    knee: [149, 122],
    shoulder: [70, 110],
    toe: [186, 133],
    wrist: [60, 132]
  },

  'push-up-feet-raised': {
    ankle: [164, 78],
    elbow: [64, 128],
    far: {
      ankle: [166, 81],
      elbow: [68, 129],
      knee: [140, 87],
      wrist: [54, 134]
    },
    head: [38, 108],
    hip: [110, 90],
    knee: [138, 84],
    shoulder: [54, 112],
    toe: [174, 75],
    wrist: [48, 132]
  },

  /* The bottom, chest to the worktop. The amplitude is genuinely small — a body
     pinned between its hands and its toes can only fold at the elbow — so what
     has to read is the elbow closing from straight to sharp, not the trunk
     travelling. */
  'push-up-incline': {
    ankle: [28, 131],
    elbow: [121, 83],
    far: {
      ankle: [33, 129],
      elbow: [126, 81],
      knee: [51, 118],
      wrist: [135, 64]
    },
    head: [102, 70],
    hip: [68, 108],
    knee: [46, 120],
    shoulder: [104, 88],
    toe: [19, 134],
    wrist: [131, 66]
  },

  /* The bottom. Knees are a contact as much as the hands: they stay, the hips
     drop, and the line from knee to shoulder holds. */
  'push-up-knees': {
    ankle: [164, 114],
    elbow: [78, 127],
    far: {
      ankle: [166, 117],
      elbow: [82, 128],
      knee: [144, 131],
      wrist: [64, 134]
    },
    head: [52, 106],
    hip: [118, 120],
    knee: [142, 128],
    shoulder: [68, 110],
    toe: [172, 108],
    wrist: [58, 132]
  },

  /* This plate prints the bottom, so its counterpose is the top: one plank from
     heels to head, arms locked straight down from the shoulders, hands right
     under them. */
  'push-up-narrow': {
    ankle: [176, 124],
    elbow: [68, 112],
    far: {
      ankle: [178, 127],
      elbow: [70, 113],
      knee: [150, 119],
      wrist: [71, 133]
    },
    head: [54, 88],
    hip: [122, 108],
    knee: [149, 116],
    shoulder: [68, 92],
    toe: [186, 132],
    wrist: [67, 132]
  },

  /* Standing on both feet, arms hanging. The near heel then rises behind
     to the buttock and the hand meets the ankle there. */
  'quad-stretch': {
    ankle: [106, 132],
    elbow: [103, 66],
    far: {
      ankle: [110, 133],
      elbow: [110, 66],
      knee: [108, 109],
      toe: [124, 134],
      wrist: [112, 86]
    },
    head: [102, 32],
    hip: [104, 84],
    knee: [104, 109],
    shoulder: [104, 47],
    toe: [118, 134],
    wrist: [104, 85]
  },

  /* Standing tall on the one leg. The free leg comes down from behind and the
     torso rises with it — hinge, not squat, so the knee stays nearly straight
     throughout. */
  'rdl-single': {
    ankle: [98, 132],
    elbow: [95, 78],
    far: {
      ankle: [106, 132],
      elbow: [101, 78],
      knee: [104, 112],
      wrist: [103, 98]
    },
    head: [96, 44],
    hip: [98, 96],
    knee: [99, 114],
    shoulder: [97, 58],
    toe: [84, 133],
    wrist: [93, 98]
  },

  /* The arm hanging straight under the shoulder, the dumbbell low. Nothing
     else moves: the back stays flat and the free hand stays on the thigh. */
  'row-dumbbell': {
    ankle: [100, 132],
    elbow: [134, 81],
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
    wrist: [135, 99]
  },

  /* The bottom: the chest sinks between the shoulder blades while the elbows
     stay locked. The whole travel is that sink — nothing else on the body has
     any business moving. */
  'scapular-push-up': {
    ankle: [178, 125],
    elbow: [61, 113],
    far: {
      ankle: [180, 128],
      elbow: [67, 115],
      knee: [152, 119],
      wrist: [64, 133]
    },
    head: [49, 90],
    hip: [122, 108],
    knee: [151, 116],
    shoulder: [65, 94],
    toe: [188, 132],
    wrist: [58, 132]
  },

  /* The guard, both hands up by the face. The plate prints the punch; this is
     what it returns to, and the return is the half everyone skips. */
  'shadow-box': {
    ankle: [86, 132],
    elbow: [88, 68],
    far: {
      ankle: [128, 133],
      elbow: [116, 66],
      knee: [122, 110],
      wrist: [108, 46]
    },
    head: [100, 36],
    hip: [104, 86],
    knee: [90, 108],
    shoulder: [102, 50],
    toe: [74, 133],
    wrist: [88, 46]
  },

  'shoulder-roll': {
    ankle: [100, 132],
    elbow: [118, 37],
    far: {
      ankle: [106, 132],
      elbow: [112, 31],
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
  /* Standing. The arms stay out front the whole way — a bodyweight squat uses
     them as a counterweight, so only the body travels. */
  squat: {
    ankle: [100, 132],
    elbow: [124, 43],
    far: {
      ankle: [93, 132],
      elbow: [120, 47],
      knee: [97, 101],
      wrist: [140, 45]
    },
    head: [104, 20],
    hip: [100, 74],
    knee: [102, 102],
    shoulder: [102, 37],
    toe: [114, 134],
    wrist: [144, 39]
  },

  /* The hand already flat on the wall behind, the chest still square. The
     stretch is the chest and the free arm turning away; the hand on the wall
     never moves. */
  'thoracic-wall': {
    ankle: [88, 132],
    elbow: [115, 50],
    far: {
      ankle: [108, 132],
      elbow: [98, 66],
      knee: [104, 108],
      toe: [94, 133],
      wrist: [100, 85]
    },
    head: [94, 32],
    hip: [98, 84],
    knee: [92, 108],
    shoulder: [96, 47],
    toe: [74, 133],
    wrist: [133, 52]
  },

  /* Standing face on, both arms hanging. Each upper arm then rises straight up
     past the reader: face on it shortens to nothing and grows again above the
     shoulder, never swinging out to the side. */
  'triceps-stretch': {
    ankle: [92, 132],
    collar: [88, 51],
    elbow: [88, 74],
    far: {
      ankle: [108, 132],
      collar: [112, 51],
      elbow: [112, 74],
      knee: [107, 111],
      pelvis: [106, 89],
      toe: [114, 134],
      wrist: [112, 95]
    },
    head: [100, 35],
    hip: [100, 88],
    knee: [93, 111],
    pelvis: [94, 89],
    shoulder: [100, 50],
    toe: [86, 134],
    wrist: [88, 95]
  },

  /* The opposite stride. Legs and arms both swap sides, which is the only way
     a walk reads as a walk and not as a limp. */
  walk: {
    ankle: [64, 131],
    elbow: [116, 66],
    far: {
      ankle: [140, 130],
      elbow: [88, 66],
      knee: [124, 108],
      wrist: [76, 80]
    },
    head: [104, 36],
    hip: [100, 86],
    knee: [78, 110],
    shoulder: [102, 50],
    /* Toe ahead of the ankle, as a foot is. Drawn behind it, the rear foot read
       as put on backwards and the interpolation swung it a hundred and fifty
       degrees round the ankle, straight through the floor on the way. */
    toe: [76, 134],
    wrist: [128, 58]
  },

  /* Standing, arms hanging, hands relaxed. The near arm rises straight out
     front as the fingers turn up, and the other hand comes over them. */
  'wrist-stretch': {
    ankle: [94, 132],
    elbow: [97, 67],
    far: {
      ankle: [100, 132],
      elbow: [98, 67],
      hand: [101, 98],
      knee: [102, 110],
      toe: [114, 133],
      wrist: [99, 86]
    },
    hand: [101, 98],
    head: [99, 33],
    hip: [98, 86],
    knee: [96, 110],
    shoulder: [96, 48],
    toe: [108, 133],
    wrist: [98, 86]
  },

  /* Arms back down on the floor. Only the arms and the chest travel; the legs
     are ballast. */
  ytw: {
    ankle: [182, 134],
    elbow: [76, 131],
    far: { elbow: [80, 133], wrist: [62, 132] },
    head: [84, 126],
    hip: [130, 133],
    knee: [158, 134],
    shoulder: [96, 130],
    toe: [190, 135],
    wrist: [58, 130]
  }
}

/** Both feet down, arms at the sides: the instant between two marched steps. */
const MARCH_STANCE: Pose = {
  ankle: [104, 132],
  elbow: [103, 67],
  far: {
    ankle: [106, 132],
    elbow: [104, 67],
    knee: [106, 110],
    toe: [118, 134],
    wrist: [106, 86]
  },
  head: [100, 34],
  hip: [104, 86],
  knee: [104, 110],
  shoulder: [102, 48],
  toe: [116, 134],
  wrist: [104, 86]
}

/**
 * The bend in the road, for the two gestures where the legs trade places.
 *
 * A straight limb swinging from front to back turns through vertical, and
 * vertical is the lowest point of its arc: both of these put both feet a whole
 * shin below the floor halfway across, while standing on it at either end. The
 * cure is the one walking itself uses — the swinging knee lifts, the hip rides
 * up over the planted leg, and the thigh foreshortens as it passes under the
 * body. None of that can be computed from the two ends; it is exactly the
 * information they do not carry.
 *
 * Two per figure, in cycle order: the crossing after the printed plate, then
 * the crossing after the counterpose, where the other leg is the one planted.
 */
export const PASSINGS: Partial<Record<FigureId, readonly [Pose, Pose]>> = {
  /* Arm hanging, then arm overhead. Without these two the arm only swings
     between front and back, which is a pendulum and not a circle. */
  'arm-circle': [
    {
      ankle: [100, 132],
      elbow: [95, 69],
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
      wrist: [88, 90]
    },
    {
      ankle: [100, 132],
      elbow: [96, 27],
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
      wrist: [92, 6]
    }
  ],

  /* Both feet down between two steps, arms at the sides: without it the two
     knees would trade places in the air and the figure would float. */
  'knee-march': [MARCH_STANCE, MARCH_STANCE],

  /* The knees crossing under the hips. The trunk is pinned between the hands
     and does not move, so the whole pose is the two thighs — both pointing at
     the viewer at this instant, both drawn at a third of their length because
     of it. Drawn any longer and the knee alone reaches the floor: the hip here
     rides twenty-six units above it and the thigh is thirty-one. */
  'mountain-climber': [
    {
      ankle: [136, 131],
      elbow: [62, 112],
      far: {
        ankle: [134, 124],
        elbow: [70, 114],
        knee: [120, 116],
        wrist: [66, 133]
      },
      head: [52, 88],
      hip: [118, 108],
      knee: [117, 118],
      shoulder: [66, 92],
      toe: [146, 133],
      wrist: [58, 132]
    },
    {
      ankle: [134, 124],
      elbow: [62, 112],
      far: {
        ankle: [136, 131],
        elbow: [70, 114],
        knee: [117, 118],
        wrist: [66, 133]
      },
      head: [52, 88],
      hip: [118, 108],
      knee: [120, 116],
      shoulder: [66, 92],
      toe: [144, 126],
      wrist: [58, 132]
    }
  ],

  /* The elbow crossing low behind, then high in front. The hand never leaves
     the shoulder; the far elbow trails a quarter of the way round, so the two
     arms read as two arms. */
  'shoulder-roll': [
    {
      ankle: [100, 132],
      elbow: [111, 64],
      far: {
        ankle: [106, 132],
        elbow: [118, 60],
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
    {
      ankle: [100, 132],
      elbow: [91, 30],
      far: {
        ankle: [106, 132],
        elbow: [100, 28],
        knee: [107, 110],
        wrist: [106, 48]
      },
      head: [100, 34],
      hip: [104, 86],
      knee: [102, 110],
      shoulder: [102, 48],
      toe: [88, 133],
      wrist: [100, 46]
    }
  ],
  /* Midstance, drawn at the instant the thigh crosses the vertical rather than
     at either end of its swing — that crossing is the whole reason this pose
     exists, and a drawing taken anywhere else leaves the arc to dive through it
     unsupervised. The hip rides highest here, the planted leg is straight, and
     the swinging one is folded up small: knee forward and high, shin pointing
     at the viewer and so drawn at half its length, foot tucked under the knee.
     A foot left hanging at stride height puts its toe through the floor as it
     rolls from pointing back to pointing forward. */
  walk: [
    {
      ankle: [100, 134],
      elbow: [98, 64],
      far: {
        ankle: [100, 110],
        elbow: [106, 64],
        knee: [106, 94],
        wrist: [109, 80]
      },
      head: [104, 28],
      hip: [100, 78],
      knee: [100, 109],
      shoulder: [102, 42],
      toe: [112, 134],
      wrist: [95, 80]
    },
    {
      ankle: [100, 110],
      elbow: [98, 64],
      far: {
        ankle: [100, 134],
        elbow: [106, 64],
        knee: [100, 109],
        wrist: [109, 80]
      },
      head: [104, 28],
      hip: [100, 78],
      knee: [106, 94],
      shoulder: [102, 42],
      toe: [112, 114],
      wrist: [95, 80]
    }
  ]
}
