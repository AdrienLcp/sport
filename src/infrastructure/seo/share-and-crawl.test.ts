import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { SITE_ORIGIN } from '@/infrastructure/site-origin'

const ROOT_DIRECTORY = resolve(import.meta.dirname, '../../..')
const PUBLIC_DIRECTORY = resolve(ROOT_DIRECTORY, 'public')
const INDEX_HTML = readFileSync(resolve(ROOT_DIRECTORY, 'index.html'), 'utf8')
const SITEMAP = readFileSync(resolve(PUBLIC_DIRECTORY, 'sitemap.xml'), 'utf8')
const ROBOTS = readFileSync(resolve(PUBLIC_DIRECTORY, 'robots.txt'), 'utf8')

const ogProperty = (property: string): string | undefined =>
  new RegExp(`<meta content="([^"]*)" property="og:${property}"`).exec(
    INDEX_HTML
  )?.[1]

const canonicalUrl = (): string | undefined =>
  /<link href="([^"]*)" rel="canonical"/.exec(INDEX_HTML)?.[1]

/** A PNG's IHDR chunk holds its width then its height, big-endian, from byte 16. */
const pngSize = (bytes: Buffer): string =>
  `${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`

describe('share card', () => {
  it('[share-and-crawl] names the published site', () => {
    expect(canonicalUrl()).toBe(`${SITE_ORIGIN}/`)
    expect(ogProperty('url')).toBe(`${SITE_ORIGIN}/`)
    expect(ogProperty('image')).toMatch(new RegExp(`^${SITE_ORIGIN}/`))
  })

  it('[share-and-crawl] ships its image at the size it announces', () => {
    const image = ogProperty('image')?.replace(SITE_ORIGIN, '') ?? ''
    const bytes = readFileSync(resolve(PUBLIC_DIRECTORY, `.${image}`))

    expect(pngSize(bytes)).toBe(
      `${ogProperty('image:width')}x${ogProperty('image:height')}`
    )
  })
})

describe('sitemap', () => {
  it('[share-and-crawl] lists the canonical page and nothing else', () => {
    expect(SITEMAP.match(/<loc>[^<]*<\/loc>/g)).toEqual([
      `<loc>${canonicalUrl()}</loc>`
    ])
  })

  it('[share-and-crawl] is named in robots.txt', () => {
    expect(ROBOTS).toContain(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`)
  })
})
