import { describe, expect, it } from 'vitest'

import { SESSIONS } from './sessions'
import { EMPTY_LOG, hasCalibrated, type Log } from './training-log'

const after = (sessionId: 'A' | 'C'): Log => ({
  ...EMPTY_LOG,
  entries: [{ day: '2026-10-06', results: [], sessionId, week: 1 }]
})

describe('training log', () => {
  it('[calibration] still awaits the starting numbers after a session of fixed efforts', () => {
    expect(hasCalibrated(after('C'), SESSIONS)).toBe(false)
  })

  it('[calibration] holds the starting numbers once a session with ranges is run', () => {
    expect(hasCalibrated(after('A'), SESSIONS)).toBe(true)
  })
})
