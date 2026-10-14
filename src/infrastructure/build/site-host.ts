import type { Plugin } from 'vite'

import { readsPrivateProgramme } from './programme-source.ts'

/** Who serves the build: the public demo is on Cloudflare Pages, the owner's private build on Netlify. */
export type SiteHost = 'cloudflare' | 'netlify'

/**
 * Writes `SITE_HOST` into the bundle, so the legal page names the company
 * that actually serves the build it is part of.
 */
export const siteHost = (): Plugin => ({
  config(config) {
    const host: SiteHost = readsPrivateProgramme(config.root ?? process.cwd())
      ? 'netlify'
      : 'cloudflare'
    return { define: { SITE_HOST: JSON.stringify(host) } }
  },
  name: 'site-host'
})
