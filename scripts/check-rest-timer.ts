import type { Browser, Locator, Page } from '@playwright/test'

import { today } from '../src/infrastructure/clock.ts'
import { launchMutedBrowser, openCheckPage } from './checks/muted-browser.ts'
import { startPreviewServer } from './checks/preview-server.ts'
import { openWithWebFonts } from './checks/web-fonts.ts'

/**
 * The rest countdown keeps its width as it ticks, in the web font and in its
 * fallback face: the digits are tabular in both, so a second going by moves
 * nothing on the plate. The gap between the two faces is printed for every
 * run, to read, not to judge.
 */

const TIMER = '.rest-plate .time'

const REST_SECONDS = 90

/** A tick every second under reduced motion, so two give room to read it change. */
const TICK_TIMEOUT_MS = 2500

/** A width read through a range lands on sub-pixel fractions of a layout unit. */
const SAME_WIDTH_TOLERANCE_PX = 0.05

const RUN_ON_REST = {
  'seance.run.v1': JSON.stringify({
    day: today().toString(),
    restSeconds: REST_SECONDS,
    results: [],
    sessionId: 'A',
    side: 0,
    stage: 'rest',
    step: 1
  })
}

type Reading = {
  text: string
  width: number
}

const readTimer = (timer: Locator): Promise<Reading> =>
  timer.evaluate((node) => {
    const range = document.createRange()
    range.selectNodeContents(node)

    return {
      text: node.textContent ?? '',
      width: range.getBoundingClientRect().width
    }
  })

const readAcrossATick = async (page: Page): Promise<[Reading, Reading]> => {
  const timer = page.locator(TIMER)
  const before = await readTimer(timer)

  await page.waitForFunction(
    ({ selector, text }) =>
      document.querySelector(selector)?.textContent !== text,
    { selector: TIMER, text: before.text },
    { timeout: TICK_TIMEOUT_MS }
  )

  return [before, await readTimer(timer)]
}

const measureFace = async (
  browser: Browser,
  url: string,
  face: 'fallback' | 'web font'
): Promise<[Reading, Reading]> => {
  const page = await openCheckPage(browser, {
    blockWebFonts: face === 'fallback',
    storage: RUN_ON_REST
  })

  try {
    if (face === 'fallback') {
      await page.goto(url)
      await page.evaluate(() => document.fonts.ready)
    } else {
      await openWithWebFonts(page, url, TIMER)
    }

    return await readAcrossATick(page)
  } finally {
    await page.context().close()
  }
}

const preview = await startPreviewServer()
const browser = await launchMutedBrowser()
const failures: string[] = []

try {
  const widths: Record<string, number> = {}

  for (const face of ['web font', 'fallback'] as const) {
    const [before, after] = await measureFace(
      browser,
      `${preview.origin}/`,
      face
    )
    widths[face] = before.width

    console.info(
      `${face}: ${before.text} ${before.width.toFixed(2)}px, ${after.text} ${after.width.toFixed(2)}px`
    )

    if (Math.abs(after.width - before.width) > SAME_WIDTH_TOLERANCE_PX) {
      failures.push(
        `In the ${face}, the timer went from ${before.width}px at ${before.text} to ${after.width}px at ${after.text}.`
      )
    }
  }

  const gap = (widths.fallback ?? 0) - (widths['web font'] ?? 0)
  console.info(`fallback over web font: ${gap.toFixed(2)}px`)
} finally {
  await browser.close()
  await preview.close()
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exit(1)
}
