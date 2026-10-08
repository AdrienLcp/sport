import { expect, it } from 'vitest'

import { withArialTwins } from './arial-metric-twins'

it('lists the metric twins after Arial', () => {
  expect(withArialTwins('local("Arial")')).toBe(
    'local("Arial"), local("Liberation Sans"), local("Arimo"), local("Roboto")'
  )
})

it('reads Arial unquoted', () => {
  expect(withArialTwins('local(Arial)')).toContain('local("Roboto")')
})

it('leaves any other source alone', () => {
  const webFont = 'url("/fonts/libre-franklin-latin.woff2") format("woff2")'
  expect(withArialTwins(webFont)).toBe(webFont)
})
