import type { ManifestOptions } from 'vite-plugin-pwa'

/**
 * What the browser installs. The colours are the night printing's ground: the
 * splash screen and the title bar a phone paints before the first frame. No
 * `@/` import, so `vite.config.ts` can load it.
 */
export const webAppManifest: Partial<ManifestOptions> = {
  background_color: '#14120f',
  categories: ['health', 'fitness', 'lifestyle'],
  description:
    'A bodyweight training manual, one plate per movement: guided sessions, a journal and progress curves. Works offline; every number stays on the device.',
  display: 'standalone',
  icons: [
    {
      purpose: 'any',
      sizes: '192x192',
      src: '/icons/icon-192.png',
      type: 'image/png'
    },
    {
      purpose: 'any',
      sizes: '512x512',
      src: '/icons/icon-512.png',
      type: 'image/png'
    },
    {
      purpose: 'maskable',
      sizes: '512x512',
      src: '/icons/icon-maskable-512.png',
      type: 'image/png'
    }
  ],
  id: '/',
  lang: 'en',
  name: 'Séance',
  orientation: 'any',
  scope: '/',
  screenshots: [
    {
      form_factor: 'narrow',
      label: 'A set: the movement drawn, the count, the ledger of the circuit',
      sizes: '780x1688',
      src: '/screenshots/session-narrow.png',
      type: 'image/png'
    },
    {
      form_factor: 'wide',
      label: 'The curves: regularity, sessions per week, the body',
      sizes: '1440x900',
      src: '/screenshots/progress-wide.png',
      type: 'image/png'
    }
  ],
  short_name: 'Séance',
  shortcuts: [
    { name: 'The journal', url: '/journal' },
    { name: 'The curves', url: '/progress' }
  ],
  start_url: '/',
  theme_color: '#14120f'
}
