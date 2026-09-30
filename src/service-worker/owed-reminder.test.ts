import { describe, expect, it } from 'vitest'

import { DEFAULT_SCHEDULE } from '../features/reminders/reminder-schedule'
import { owedReminder } from './owed-reminder'

const tuesdayEvening = new Date(2026, 8, 29, 20, 0)
const schedule = { ...DEFAULT_SCHEDULE, isEnabled: true }

describe('owed reminder', () => {
  it('[worker] shows the words the page left, silent unless sound was asked for', () => {
    expect(
      owedReminder({
        copy: { body: 'Time for the session.', title: 'Séance' },
        lastSessionDay: undefined,
        lastShownDay: undefined,
        now: tuesdayEvening,
        schedule,
        today: '2026-09-29'
      })
    ).toEqual({
      body: 'Time for the session.',
      isSilent: true,
      title: 'Séance'
    })
  })

  it('[worker] shows nothing when the page never left its words', () => {
    expect(
      owedReminder({
        copy: undefined,
        lastSessionDay: undefined,
        lastShownDay: undefined,
        now: tuesdayEvening,
        schedule,
        today: '2026-09-29'
      })
    ).toBe(null)
  })

  it('[worker] shows nothing on a day the session already ran', () => {
    expect(
      owedReminder({
        copy: { body: 'b', title: 't' },
        lastSessionDay: '2026-09-29',
        lastShownDay: undefined,
        now: tuesdayEvening,
        schedule,
        today: '2026-09-29'
      })
    ).toBe(null)
  })
})
