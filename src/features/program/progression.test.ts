import { describe, expect, it } from 'vitest'

import { roundsFor, sessionAtWeek } from './progression'
import { SESSIONS } from './sessions'
import { EMPTY_LOG, type Log, withoutSessions } from './training-log'

describe('the rounds ramp', () => {
  it('runs two rounds in week one, three in week two, four after', () => {
    expect([1, 2, 3, 4, 5].map(roundsFor)).toEqual([2, 3, 4, 4, 4])
  })

  it('caps the session it runs, and leaves the rest of it alone', () => {
    const weekOne = sessionAtWeek(SESSIONS.A, 1)
    expect(weekOne.shape.rounds).toBe(2)
    expect(weekOne.circuit).toBe(SESSIONS.A.circuit)
    expect(sessionAtWeek(SESSIONS.E, 3).shape.rounds).toBe(4)
  })
})

describe('erasing the sessions', () => {
  it('drops the entries and the push-up test, keeps the measures', () => {
    const log: Log = {
      entries: [{ day: '2026-09-27', results: [], sessionId: 'A', week: 1 }],
      measures: [{ day: '2026-09-25', waist: 94 }],
      pushUpTest: 4,
      version: 1
    }
    expect(withoutSessions(log)).toEqual({
      entries: [],
      measures: [{ day: '2026-09-25', waist: 94 }],
      version: 1
    })
    expect(withoutSessions({ ...log, measures: undefined })).toEqual(EMPTY_LOG)
  })
})
