import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  prefersReducedMotion,
  subscribeToReducedMotion,
  usePrefersReducedMotion
} from './reduced-motion'

const stubMatchMedia = (matches: boolean) => {
  const query = {
    addEventListener: vi.fn(),
    matches,
    removeEventListener: vi.fn()
  }
  const matchMedia = vi.fn(() => query)
  vi.stubGlobal('matchMedia', matchMedia)

  return { matchMedia, query }
}

const MotionPreference = () => String(usePrefersReducedMotion())

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('reduced motion', () => {
  it('[motion] reads the reduced-motion media query', () => {
    const { matchMedia } = stubMatchMedia(true)

    expect(prefersReducedMotion()).toBe(true)
    expect(matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
  })

  it('[motion] is false where there is no matchMedia, as on a server', () => {
    vi.stubGlobal('matchMedia', undefined)

    expect(prefersReducedMotion()).toBe(false)
    expect(() => subscribeToReducedMotion(() => {})()).not.toThrow()
  })

  it('[motion] a subscription listens until it is dropped', () => {
    const { query } = stubMatchMedia(false)
    const listener = vi.fn()

    const unsubscribe = subscribeToReducedMotion(listener)
    unsubscribe()

    expect(query.addEventListener).toHaveBeenCalledWith('change', listener)
    expect(query.removeEventListener).toHaveBeenCalledWith('change', listener)
  })

  it('[motion] a server render draws the motion, whatever the reader prefers', () => {
    stubMatchMedia(true)

    expect(renderToString(createElement(MotionPreference))).toBe('false')
  })
})
