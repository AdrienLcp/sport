import { describe, expect, it } from 'vitest'

import { sessionAtWeek } from '@/features/program/progression'
import { SESSIONS } from '@/features/program/sessions'

import {
  canUndoSet,
  INITIAL_RUN,
  type RunState,
  roundsOf,
  runReducer
} from './run'

describe('the session run', () => {
  it('turns a warm-up plate only when the reader says so', () => {
    const session = SESSIONS.A
    const warming = runReducer(session, INITIAL_RUN, { type: 'begin' })
    expect(warming.stage).toBe('warmup')
    expect(runReducer(session, warming, { type: 'endDrill' }).step).toBe(1)
  })

  it('runs every session with its targets unless the reader asks to measure', () => {
    const session = SESSIONS.A
    expect(
      runReducer(session, INITIAL_RUN, { type: 'begin' }).isMeasuring
    ).toBe(undefined)
    expect(
      runReducer(session, INITIAL_RUN, { isMeasuring: true, type: 'begin' })
        .isMeasuring
    ).toBe(true)
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

  it('takes the last set back and shows its plate again', () => {
    const session = sessionAtWeek(SESSIONS.A, 1)
    const opening: RunState = { ...INITIAL_RUN, stage: 'set' }
    expect(canUndoSet(opening)).toBe(false)
    expect(runReducer(session, opening, { type: 'undoSet' })).toBe(opening)

    const first = runReducer(session, opening, {
      elapsed: 30,
      type: 'completeSet',
      value: 7
    })
    expect(canUndoSet(first)).toBe(true)
    const back = runReducer(session, first, { type: 'undoSet' })
    expect(back).toMatchObject({ results: [], side: 0, stage: 'set', step: 0 })
  })

  it('steps back from a rest to the set that closed the round', () => {
    const session = sessionAtWeek(SESSIONS.A, 1)
    let state: RunState = { ...INITIAL_RUN, stage: 'set' }
    while (state.stage !== 'rest') {
      state = runReducer(session, state, {
        elapsed: 30,
        type: 'completeSet',
        value: 10
      })
    }
    const done = state.results.length
    const back = runReducer(session, state, { type: 'undoSet' })
    expect(back).toMatchObject({
      restSeconds: 0,
      stage: 'set',
      step: state.step - 1
    })
    expect(back.results).toHaveLength(done - 1)
  })

  it('returns a second side to the first without touching the log', () => {
    const session = sessionAtWeek(SESSIONS.A, 1)
    const second: RunState = {
      ...INITIAL_RUN,
      firstSide: 30,
      side: 1,
      stage: 'set',
      step: 2
    }
    expect(runReducer(session, second, { type: 'undoSet' })).toMatchObject({
      firstSide: undefined,
      results: [],
      side: 0,
      step: 2
    })
  })
})
