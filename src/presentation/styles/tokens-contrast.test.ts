import { readFileSync } from 'node:fs'

import { findContrastFailures, WCAG_AA } from '@adrienlcp/styles/contrast'
import { describe, expect, it } from 'vitest'

const TOKENS = readFileSync(new URL('_tokens.sass', import.meta.url), 'utf8')

const PRINTINGS = ['day-printing', 'night-printing'] as const

const TEXT_INKS = [
  '--ink',
  '--ink-soft',
  '--ink-dim',
  '--ink-spent',
  '--ink-bright',
  '--signal-ink'
] as const

const MARKS = ['--signal', '--fig-far', '--fig-prop', '--fig-ghost'] as const

const BUTTON_FILLS = ['--ink', '--ink-bright', '--ink-soft'] as const

const PAIRS = [
  ...TEXT_INKS.map((foreground) => ({
    background: '--ground',
    foreground,
    minimum: WCAG_AA.text
  })),
  ...MARKS.map((foreground) => ({
    background: '--ground',
    foreground,
    minimum: WCAG_AA.nonText
  })),
  ...BUTTON_FILLS.map((background) => ({
    background,
    foreground: '--ground',
    minimum: WCAG_AA.text
  }))
]

/** Each printing declares every colour once, inside its own mixin. */
const readPrinting = (printing: (typeof PRINTINGS)[number]) =>
  TOKENS.split(/^@/m).find((block) => block.startsWith(`mixin ${printing}`))

describe('colour tokens', () => {
  it.each(PRINTINGS)(
    '[contrast] every ink and mark reads on the ground, in the %s',
    (printing) => {
      const stylesheet = readPrinting(printing)
      expect(stylesheet).toBeDefined()
      expect(findContrastFailures(stylesheet ?? '', PAIRS)).toEqual([])
    }
  )
})
