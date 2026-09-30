import { describe, expect, it } from 'vitest'

import { sessionAtWeek } from '@/features/program/progression'
import { SESSIONS } from '@/features/program/sessions'

import { INITIAL_RUN, type RunState, roundsOf, runReducer } from './run'

describe('the session run', () => {
  it('turns a warm-up plate only when the reader says so', () => {
    const session = SESSIONS.A
    const warming = runReducer(session, INITIAL_RUN, { type: 'begin' })
    expect(warming.stage).toBe('warmup')
    expect(runReducer(session, warming, { type: 'endDrill' }).step).toBe(1)
  })

  it('runs two rounds in week one', () => {
    const session = sessionAtWeek(SESSIONS.A, 1)
    expect(roundsOf(session)).toBe(2)
    let state: RunState = { ...INITIAL_RUN, stage: 'set' }
    for (let set = 0; set < 2 * session.circuit.length; set += 1) {
      state = runReducer(session, state, {
        elapsed: 30,
        type: 'completeSet',
        value: 10
      })
      if (state.stage === 'rest') {
        state = runReducer(session, state, { type: 'endRest' })
      }
    }
    expect(state.stage).toBe('cooldown')
  })

  it('leads an early exit to the stretches, marked as cut short', () => {
    const session = SESSIONS.A
    const state = runReducer(
      session,
      { ...INITIAL_RUN, stage: 'set', step: 3 },
      { type: 'endCircuitEarly' }
    )
    expect(state.stage).toBe('cooldown')
    expect(state.step).toBe(0)
    expect(state.isCutShort).toBe(true)
  })
})
