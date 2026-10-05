/**
 * Short tones drawn by the Web Audio API: nothing to download, nothing to cache,
 * so they work offline like the rest of the session. A reader face down in a
 * plank cannot see the screen; these tell them the clock started, is about to
 * end, and ended.
 */
export type Tone = 'start' | 'tick' | 'end'

type Note = {
  readonly hertz: number
  readonly at: number
  readonly length: number
}

const NOTES: Readonly<Record<Tone, readonly Note[]>> = {
  end: [
    { at: 0, hertz: 880, length: 0.16 },
    { at: 0.2, hertz: 1175, length: 0.32 }
  ],
  start: [{ at: 0, hertz: 660, length: 0.18 }],
  tick: [{ at: 0, hertz: 520, length: 0.07 }]
}

const PEAK_GAIN = 0.35

let context: AudioContext | undefined

/**
 * One context for the whole visit, created on the first tone: browsers only
 * let it sound once the page has had a tap, and every tone follows one.
 */
const audio = (): AudioContext | undefined => {
  if (context !== undefined) return context
  if (typeof AudioContext === 'undefined') return undefined
  context = new AudioContext()
  return context
}

export const playTone = (tone: Tone): void => {
  const output = audio()
  if (output === undefined) return
  if (output.state === 'suspended') void output.resume()

  for (const note of NOTES[tone]) {
    const start = output.currentTime + note.at
    const oscillator = output.createOscillator()
    const gain = output.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(note.hertz, start)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(PEAK_GAIN, start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + note.length)
    oscillator.connect(gain)
    gain.connect(output.destination)
    oscillator.start(start)
    oscillator.stop(start + note.length + 0.02)
  }
}

/**
 * Unlocks audio inside the tap that starts a clock: the first tone of a hold
 * may come thirty seconds later, outside any gesture, and iOS refuses a
 * context first resumed there.
 */
export const wakeAudio = (): void => {
  const output = audio()
  if (output?.state === 'suspended') void output.resume()
}
