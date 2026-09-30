import { describe, expect, it } from 'vitest'

import type { Log, SessionEntry } from '@/features/program/training-log'

import {
  regularityOf,
  trainingDays,
  type WeekTally,
  weeklyTallies
} from './progress'

const session = (
  day: string,
  sessionId: SessionEntry['sessionId'],
  results: SessionEntry['results'],
  stopped?: true
): SessionEntry =>
  stopped === true
    ? { day, results, sessionId, stopped, week: 1 }
    : { day, results, sessionId, week: 1 }

const week = (sessions: number, stopped = 0): WeekTally => ({
  heldSeconds: 0,
  monday: '2026-01-05',
  reps: 0,
  stopped,
  whole: sessions - stopped
})

describe('progress', () => {
  it('[progress] adds reps and held seconds apart, by the effort of each station', () => {
    const log: Log = {
      entries: [
        session('2026-09-28', 'A', [
          { address: 'A-01', round: 1, value: 14 },
          { address: 'A-05', round: 1, value: 40 }
        ]),
        session(
          '2026-09-30',
          'A',
          [{ address: 'A-01', round: 1, value: 15 }],
          true
        )
      ],
      version: 1
    }
    const [current] = weeklyTallies({ log, today: '2026-10-01', weeks: 1 })
    expect(current).toEqual({
      heldSeconds: 40,
      monday: '2026-09-28',
      reps: 29,
      stopped: 1,
      whole: 1
    })
  })

  it('[progress] lays out the weeks oldest first, the current one last', () => {
    const weeks = weeklyTallies({
      log: { entries: [], version: 1 },
      today: '2026-10-01',
      weeks: 3
    })
    expect(weeks.map((tally) => tally.monday)).toEqual([
      '2026-09-14',
      '2026-09-21',
      '2026-09-28'
    ])
  })

  it('[progress] does not break a run on a current week that still has days left', () => {
    expect(regularityOf([week(3), week(4), week(1)])).toEqual({
      currentRun: 2,
      longestRun: 2,
      steadyWeeks: 2
    })
  })

  it('[progress] ends a run on a past week under three sessions, stopped ones counted', () => {
    expect(
      regularityOf([week(3), week(3), week(2), week(3, 1), week(3)])
    ).toEqual({ currentRun: 2, longestRun: 2, steadyWeeks: 4 })
  })

  it('[progress] marks a day by its best session, and the days ahead as future', () => {
    const log: Log = {
      entries: [
        session('2026-09-28', 'A', [], true),
        session('2026-09-28', 'B', []),
        session('2026-09-29', 'C', [], true)
      ],
      version: 1
    }
    const days = trainingDays({ log, today: '2026-09-30', weeks: 1 })
    expect(days.map((day) => day.state)).toEqual([
      'whole',
      'stopped',
      'none',
      'future',
      'future',
      'future',
      'future'
    ])
  })
})
