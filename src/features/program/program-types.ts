import type { LocalizedText } from '@/helpers/localized-text'

/**
 * The full instructions behind each plate's short cues, step by step: where to
 * stand, how far, what to hold on to, where the rep stops and whether it
 * pauses there. The cues answer « what do I keep in mind »; these answer « how
 * do I start », which a beginner asks once and forgets by the next session.
 */
export type Setup = readonly LocalizedText[]

/** Every figure the plates draw, in the order they were drawn: the contact sheet and the strip print them so. */
export const FIGURE_IDS = [
  'squat',
  'lunge-back',
  'hip-thrust',
  'hip-thrust-single',
  'calf-raise',
  'plank',
  'side-plank',
  'hollow',
  'push-up',
  'push-up-incline',
  'push-up-knees',
  'push-up-feet-raised',
  'push-up-narrow',
  'row-dumbbell',
  'rdl-single',
  'ytw',
  'mountain-climber',
  'knee-march',
  'shadow-box',
  'walk',
  'cat-cow',
  'arm-circle',
  'shoulder-roll',
  'external-rotation',
  'external-rotation-side',
  'scapular-push-up',
  'hip-circle',
  'quad-stretch',
  'hamstring-stretch',
  'glute-stretch',
  'pec-door',
  'triceps-stretch',
  'wrist-stretch',
  'pigeon',
  'thoracic-wall',
  'hip-flexor-lunge',
  'lat-stretch',
  'neck-stretch'
] as const

export type FigureId = (typeof FIGURE_IDS)[number]

/** In programme order: the first movement drawn by a figure names it on the dev pages. */
export const MOVEMENT_IDS = [
  'squat',
  'squat-slow',
  'lunge-back',
  'hip-thrust',
  'hip-thrust-single',
  'calf-raise',
  'plank',
  'side-plank',
  'hollow',
  'push-up',
  'push-up-slow',
  'push-up-incline',
  'push-up-incline-high',
  'push-up-knees',
  'push-up-feet-raised',
  'push-up-narrow',
  'row-dumbbell',
  'rdl-single',
  'ytw',
  'mountain-climber',
  'knee-march',
  'shadow-box'
] as const

export type MovementId = (typeof MOVEMENT_IDS)[number]

/**
 * Seconds per phase of one rep, as the programme sets them: the figure plays
 * this cycle and the plate states it, so the drawing and the sentence can
 * never disagree. « Down » is the way back under control — lowering the body,
 * the hips, the heels or the weight; « up » is the effort.
 */
export type Tempo = {
  readonly down: number
  /** Held at the bottom. Zero means no pause, and never a bounce. */
  readonly bottom: number
  readonly up: number
  /** Held at the top: the squeeze. */
  readonly top: number
}

/**
 * What a stick figure cannot say, one short line per question a beginner asks
 * in the middle of a set. Every line is optional except the breath: the one
 * mistake every movement shares is holding it.
 */
export type Cues = {
  /** What travels. */
  readonly moves?: LocalizedText
  /** What does not move at all. */
  readonly still?: LocalizedText
  /** What is squeezed, and when. */
  readonly squeeze?: LocalizedText
  /** Out on the effort, in on the easy half. */
  readonly breath: LocalizedText
}

/**
 * Whether the hands may touch anything, said wherever a beginner would reach
 * for it. `wall` is the single-leg rule: fingertips on a wall for balance,
 * never to carry weight. `none` answers the temptation to hold on where the
 * balance is the work. Absent means the question does not come up.
 */
export type Support = 'none' | 'wall'

export type Movement = {
  /** Shown on the plate, in 800. */
  readonly name: LocalizedText
  readonly figure: FigureId
  readonly cues: Cues
  /** The full how-to, step by step, behind the short cues. */
  readonly setup: Setup
  /** The rep's rhythm when it is not the programme's default. */
  readonly tempo?: Tempo
  readonly support?: Support
  /** A hard constraint, never an option. Stays on screen for the whole set. */
  readonly guard?: LocalizedText
}

/** Reps or seconds, with the range the block progresses through. */
export type Effort =
  | { readonly kind: 'reps'; readonly from: number; readonly to: number }
  | { readonly kind: 'repsPerSide'; readonly from: number; readonly to: number }
  | { readonly kind: 'hold'; readonly from: number; readonly to: number }
  | { readonly kind: 'holdPerSide'; readonly from: number; readonly to: number }

/** A numbered address on the plate: B-03 resumes exactly where it stopped. */
export type Station = {
  readonly address: string
  readonly movement: MovementId
  readonly effort: Effort
  /** The push-up slot: the calibration test picks the variant, not the reader. */
  readonly calibrated?: boolean
}

export type Drill = {
  readonly name: LocalizedText
  readonly detail: LocalizedText
}

/**
 * How much of a warm-up drill: counted, or held for a clock. `per` qualifies
 * the count — per side, each way — and replaces the plain « reps » unit.
 */
export type Dose =
  | {
      readonly kind: 'reps'
      readonly count: number
      readonly per?: LocalizedText
    }
  | { readonly kind: 'hold'; readonly seconds: number }

/**
 * A warm-up drill gets its own plate, so it needs what a plate needs: a drawing,
 * a number and the lines the drawing cannot say. The cuff and scapular work of
 * B and D keeps the shoulders sound under the push-ups, and a name alone gets it
 * invented or skipped. The plate never turns by itself: a beginner finishes the
 * count at his own pace, then says so.
 */
export type WarmupDrill = {
  readonly name: LocalizedText
  /** Seen from the front when `profile` is given; the plate then prints both. */
  readonly figure: FigureId
  /**
   * The same gesture seen from the side, printed beside `figure` and in step
   * with it, for a rotation that no single view can show: the front view
   * carries the hand travelling, the profile the bent elbow behind it.
   */
  readonly profile?: FigureId
  readonly dose: Dose
  readonly cues: Cues
  readonly setup: Setup
  readonly tempo?: Tempo
  readonly support?: Support
  readonly guard?: LocalizedText
}

/**
 * A stretch gets its own plate for the same reason a warm-up drill does: a name
 * alone gets the gesture invented. It needs one thing the warm-up does not — its
 * own duration. The warm-up partitions three minutes because the programme only
 * states three minutes; every stretch states its own hold, and an app that
 * divided them evenly would give the pigeon forty-five seconds where the
 * programme wrote sixty.
 */
export type CooldownDrill = Drill & {
  readonly figure: FigureId
  /** The stretch in one line: the summary under the count. */
  readonly cue: LocalizedText
  /**
   * How to get into it, step by step, always on the plate: where to stand or
   * sit, which arm, what the other hand does, where it should pull and how
   * hard. A one-line cue left a beginner with « I understood nothing » in front
   * of the triceps and the wrists (session B, October 2026).
   */
  readonly setup: Setup
  /**
   * The hold for one side, in seconds. Absent when the drill is counted rather
   * than held: the plate then carries no chrono and waits for the hand.
   */
  readonly seconds?: number
  /** Two plates, one per side — the app has no signal to mark a switch mid-hold. */
  readonly perSide?: true
  readonly guard?: LocalizedText
}

/**
 * Five minutes of whatever the body asks for. The one cool-down entry that must
 * not be drawn: a figure here would prescribe the movement, and the programme
 * deliberately does not.
 */
export type FreeDrill = Drill & {
  readonly free: true
  readonly seconds: number
}

export type CooldownEntry = CooldownDrill | FreeDrill

export const isFree = (entry: CooldownEntry): entry is FreeDrill =>
  'free' in entry

export const SESSION_IDS = ['A', 'B', 'C', 'D', 'E'] as const

export type SessionId = (typeof SESSION_IDS)[number]

export type SessionShape =
  /**
   * Rounds through the circuit, one rest between rounds. `rounds` is the full
   * count; the first weeks run fewer (`roundsFor`).
   */
  | {
      readonly kind: 'circuit'
      readonly rounds: number
      readonly restSeconds: number
    }
  /** One movement per minute; the rest is whatever is left of the minute. */
  | {
      readonly kind: 'emom'
      readonly rounds: number
      readonly stationSeconds: number
    }

export type Session = {
  readonly id: SessionId
  readonly name: LocalizedText
  readonly shape: SessionShape
  readonly warmup: readonly WarmupDrill[]
  readonly circuit: readonly Station[]
  readonly cooldown: readonly CooldownEntry[]
  /** One line on the title plate, when the session needs framing. */
  readonly note?: LocalizedText
  /** What to have at hand beyond the mat, named on the title plate. */
  readonly kit?: LocalizedText
}
