import type { Locale } from '@/helpers/localized-text'
import type { SiteHost } from '@/infrastructure/build/site-host'

/**
 * Who publishes Séance and how to reach him: a non-professional publisher
 * gives a name and a contact, never a postal address or a phone number.
 */
export const PUBLISHER = {
  contactHref: {
    en: 'https://adrienlcp.com/en/contact',
    fr: 'https://adrienlcp.com/fr/contact'
  } satisfies Record<Locale, string>,
  name: 'Adrien Lacourpaille'
} as const

type HostIdentity = {
  readonly addressLines: readonly string[]
  readonly name: string
  /** The name a sentence uses, without the company's legal form. */
  readonly shortName: string
}

const HOST_IDENTITIES = {
  cloudflare: {
    addressLines: ['101 Townsend St', 'San Francisco, CA 94107', 'USA'],
    name: 'Cloudflare, Inc.',
    shortName: 'Cloudflare'
  },
  netlify: {
    addressLines: ['101 2nd St, Suite 575', 'San Francisco, CA 94105', 'USA'],
    name: 'Netlify, Inc.',
    shortName: 'Netlify'
  }
} as const satisfies Record<SiteHost, HostIdentity>

/** The company serving this very build: Cloudflare for the public demo, Netlify for the owner's own. */
export const HOST: HostIdentity = HOST_IDENTITIES[SITE_HOST]

export const CNIL_COMPLAINT_HREF = 'https://www.cnil.fr/fr/plaintes'

/** Workbox's own name for the cache the service worker fills at install. */
export const OFFLINE_CACHE_NAME = 'workbox-precache-v2'
