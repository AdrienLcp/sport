import { createThemePreferenceStore } from '@adrienlcp/theme-preference'

/** Where the printing the reader picked is remembered, named on the legal page. */
export const THEME_STORAGE_KEY = 'seance.theme'

/** Shared by the settings plate and by the Vite plugin that inlines the pre-paint script. */
export const themeStore = createThemePreferenceStore({
  storageKey: THEME_STORAGE_KEY
})
