// Renders the home-screen icons from their SVG sources into public/icons/.
//
//   PLAYWRIGHT_FROM=C:/git/portfolio/package.json node scripts/icons/render.mjs
//
// Playwright is not a dependency of this repository: PLAYWRIGHT_FROM points at
// any package.json whose node_modules holds it.

import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
const require = createRequire(process.env.PLAYWRIGHT_FROM ?? import.meta.url)
const { chromium } = require('playwright')

const ICONS = [
  { output: 'apple-touch-icon.png', size: 180, source: 'public/favicon.svg' },
  { output: 'icon-192.png', size: 192, source: 'public/favicon.svg' },
  { output: 'icon-512.png', size: 512, source: 'public/favicon.svg' },
  {
    output: 'icon-maskable-512.png',
    size: 512,
    source: 'scripts/icons/maskable.svg'
  }
]

const browser = await chromium.launch({ args: ['--mute-audio'] })
try {
  for (const { output, size, source } of ICONS) {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { height: size, width: size }
    })
    const svg = readFileSync(`${root}${source}`, 'utf8').replace(
      '<svg ',
      `<svg width="${size}" height="${size}" `
    )
    await page.setContent(
      `<style>html,body{margin:0}svg{display:block}</style>${svg}`
    )
    await page.screenshot({
      omitBackground: false,
      path: `${root}public/icons/${output}`
    })
    await page.close()
    process.stdout.write(`icons: ${output} (${size}px) from ${source}
`)
  }
} finally {
  await browser.close()
}
