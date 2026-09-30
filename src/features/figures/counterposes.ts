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
 * teaching a rep that does not exist.
 */
export const COUNTERPOSES: Partial<Record<FigureId, Pose>> = {
  /* Half a revolution on: the arm out behind. With the two crossings it makes a
     full circle rather than a swing back and forth. */
  'arm-circle': {
    ankle: [100, 132],
    elbow: [124, 49],
    far: {
      ankle: [106, 132],
      elbow: [122, 53],
      knee: [107, 110],
      wrist: [143, 56]
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

  /* Forearms opened out, thumbs leading. They run at full length here and
     foreshortened at the start: that shortening is the rotation. */
  'external-rotation': {
    ankle: [90, 132],
    elbow: [88, 72],
    far: {
      ankle: [110, 132],
      elbow: [112, 72],
      knee: [108, 110],
      toe: [116, 134],
      wrist: [134, 70]
    },
    head: [100, 32],
    hip: [100, 88],
    knee: [92, 110],
    shoulder: [100, 50],
    toe: [84, 134],
    wrist: [66, 70]
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

  /* This plate prints the bottom, so its counterpose is the top: arms locked,
     elbows tucked in along the ribs on the way up. */
  'push-up-narrow': {
    ankle: [182, 126],
    elbow: [66, 113],
    far: {
      ankle: [180, 129],
      elbow: [70, 115],
      knee: [155, 121],
      wrist: [64, 133]
    },
    head: [66, 90],
    hip: [130, 110],
    knee: [157, 118],
    shoulder: [82, 96],
    toe: [190, 133],
    wrist: [58, 132]
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
    toe: [112, 133],
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
        elbow: [99, 68],
        knee: [107, 110],
        wrist: [97, 89]
      },
      head: [100, 34],
      hip: [104, 86],
      knee: [102, 110],
      shoulder: [102, 48],
      toe: [88, 133],
      wrist: [92, 91]
    },
    {
      ankle: [100, 132],
      elbow: [96, 27],
      far: {
        ankle: [106, 132],
        elbow: [101, 29],
        knee: [107, 110],
        wrist: [97, 8]
      },
      head: [100, 34],
      hip: [104, 86],
      knee: [102, 110],
      shoulder: [102, 48],
      toe: [88, 133],
      wrist: [92, 6]
    }
  ],

  /* Halfway round, both forearms pointing straight at the reader and so drawn
     as stubs. Without them the hand takes the short way between the two
     drawings, which is a swing down past the hip — a movement the elbow is
     pinned precisely to prevent. */
  'external-rotation': [
    {
      ankle: [90, 132],
      elbow: [88, 72],
      far: {
        ankle: [110, 132],
        elbow: [112, 72],
        knee: [108, 110],
        toe: [116, 134],
        wrist: [112, 77]
      },
      head: [100, 32],
      hip: [100, 88],
      knee: [92, 110],
      shoulder: [100, 50],
      toe: [84, 134],
      wrist: [88, 77]
    },
    {
      ankle: [90, 132],
      elbow: [88, 72],
      far: {
        ankle: [110, 132],
        elbow: [112, 72],
        knee: [108, 110],
        toe: [116, 134],
        wrist: [112, 78]
      },
      head: [100, 32],
      hip: [100, 88],
      knee: [92, 110],
      shoulder: [100, 50],
      toe: [84, 134],
      wrist: [88, 78]
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
