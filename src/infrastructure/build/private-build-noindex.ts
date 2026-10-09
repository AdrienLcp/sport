import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import type { Plugin } from 'vite'

import { readsPrivateProgramme } from './programme-source.ts'

/**
 * Netlify reads `_headers` by path and skips the public build's host rules, so
 * the private build carries a rule of its own for every path. Crawling stays
 * allowed: a crawler has to fetch a page to read its noindex.
 */
const PRIVATE_HEADERS = '/*\n  X-Robots-Tag: noindex\n'
const PRIVATE_ROBOTS = 'User-agent: *\nAllow: /\n'

/**
 * The build that reads the owner's programme is for the owner alone: it keeps
 * every page out of search results, where the public demo stays indexable.
 */
export const privateBuildNoindex = (): Plugin => {
  let isPrivateBuild = false
  let outDir = ''
  return {
    apply: 'build',
    closeBundle() {
      if (!isPrivateBuild) return
      writeFileSync(resolve(outDir, '_headers'), PRIVATE_HEADERS)
      writeFileSync(resolve(outDir, 'robots.txt'), PRIVATE_ROBOTS)
    },
    configResolved(config) {
      isPrivateBuild = readsPrivateProgramme(config.root)
      outDir = resolve(config.root, config.build.outDir)
    },
    name: 'private-build-noindex',
    transformIndexHtml() {
      return isPrivateBuild
        ? [
            {
              attrs: { content: 'noindex', name: 'robots' },
              injectTo: 'head',
              tag: 'meta'
            }
          ]
        : []
    }
  }
}
