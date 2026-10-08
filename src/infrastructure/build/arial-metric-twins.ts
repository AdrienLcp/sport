/**
 * Fonts that share Arial's metrics, so fontaine's scaling holds on each:
 * Linux ships Liberation Sans or Arimo instead of Arial, Android only Roboto.
 * A fallback face that names Arial alone fails to load there, and the swap to
 * the web font moves every line.
 */
export const ARIAL_METRIC_TWINS = [
  'Arial',
  'Liberation Sans',
  'Arimo',
  'Roboto'
] as const

const ARIAL_ALONE = /^local\(\s*["']?Arial["']?\s*\)$/

const TWINS_SOURCE = ARIAL_METRIC_TWINS.map((name) => `local("${name}")`).join(
  ', '
)

/** The part of a PostCSS declaration the rewrite reads and writes. */
type Declaration = { value: string }

/** The part of a PostCSS `@font-face` rule the rewrite walks. */
type FontFaceRule = {
  walkDecls: (
    property: string,
    visit: (declaration: Declaration) => void
  ) => void
}

/** Rewrites a face source that names Arial alone to name its metric twins too. */
export const withArialTwins = (source: string): string =>
  ARIAL_ALONE.test(source.trim()) ? TWINS_SOURCE : source

/**
 * A PostCSS plugin, run after fontaine, that lists Arial's metric twins in the
 * `src` of every fallback face fontaine writes.
 */
export const arialMetricTwins = () => ({
  AtRule: {
    'font-face': (rule: FontFaceRule) => {
      rule.walkDecls('src', (declaration) => {
        declaration.value = withArialTwins(declaration.value)
      })
    }
  },
  postcssPlugin: 'arial-metric-twins'
})
