import type { Tone } from './sound'

/**
 * The same three signals as the tones, felt instead of heard, for a phone
 * kept silent. Android browsers vibrate; Safari on iOS has no vibration API,
 * so there the call does nothing.
 */
const PATTERNS: Readonly<Record<Tone, readonly number[]>> = {
  end: [160, 90, 320],
  start: [180],
  tick: [50]
}

export const vibrate = (tone: Tone): void => {
  if (typeof navigator.vibrate !== 'function') return
  navigator.vibrate([...PATTERNS[tone]])
}
