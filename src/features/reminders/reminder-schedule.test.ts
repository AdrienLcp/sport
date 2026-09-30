import { describe, expect, it } from 'vitest'

import {
  DEFAULT_SCHEDULE,
  isReminderOwed,
  nextReminder,
  parseSchedule,
  type ReminderSchedule,
  remindersAfter,
  toggleDay
} from './reminder-schedule'

const weekdays: ReminderSchedule = {
  days: [1, 3, 5],
  isEnabled: true,
  time: '19:30',
  withSound: false
}

/** 2026-09-29 is a Tuesday. */
const tuesdayAt = (hours: number, minutes = 0) =>
  new Date(2026, 8, 29, hours, minutes)

describe('reminder schedule', () => {
  it('[reminders] skips to the next chosen day when today is not one', () => {
    expect(nextReminder(weekdays, tuesdayAt(9))).toEqual(
      new Date(2026, 8, 30, 19, 30)
    )
  })

  it('[reminders] rings today when today is chosen and the time is still ahead', () => {
    const wednesdayMorning = new Date(2026, 8, 30, 8, 0)
    expect(nextReminder(weekdays, wednesdayMorning)).toEqual(
      new Date(2026, 8, 30, 19, 30)
    )
  })

  it('[reminders] waits a week when the only day chosen has just passed', () => {
    const onlyTuesday = { ...weekdays, days: [2] as const }
    expect(nextReminder(onlyTuesday, tuesdayAt(20))).toEqual(
      new Date(2026, 9, 6, 19, 30)
    )
  })

  it('[reminders] sets nothing while switched off or with no day', () => {
    expect(nextReminder({ ...weekdays, isEnabled: false }, tuesdayAt(9))).toBe(
      null
    )
    expect(nextReminder({ ...weekdays, days: [] }, tuesdayAt(9))).toBe(null)
  })

  it('[reminders] hands over every reminder of the coming fortnight, in order', () => {
    const moments = remindersAfter({
      days: 14,
      from: tuesdayAt(9),
      schedule: weekdays
    })
    expect(moments).toHaveLength(6)
    expect(moments.map((moment) => moment.getDay())).toEqual([3, 5, 1, 3, 5, 1])
  })

  it('[reminders] owes the reminder once the time has come on a chosen day', () => {
    const base = {
      lastSessionDay: null,
      lastShownDay: null,
      schedule: { ...weekdays, days: [2] as const },
      today: '2026-09-29'
    }
    expect(isReminderOwed({ ...base, now: tuesdayAt(19, 29) })).toBe(false)
    expect(isReminderOwed({ ...base, now: tuesdayAt(19, 30) })).toBe(true)
  })

  it('[reminders] stays quiet once shown, or once the session ran', () => {
    const base = {
      lastSessionDay: null,
      lastShownDay: null,
      now: tuesdayAt(21),
      schedule: { ...weekdays, days: [2] as const },
      today: '2026-09-29'
    }
    expect(isReminderOwed({ ...base, lastShownDay: '2026-09-29' })).toBe(false)
    expect(isReminderOwed({ ...base, lastSessionDay: '2026-09-29' })).toBe(
      false
    )
    expect(isReminderOwed({ ...base, lastShownDay: '2026-09-28' })).toBe(true)
  })

  it('[reminders] reads a damaged stored schedule as the default, keeping what is valid', () => {
    expect(parseSchedule('nonsense')).toEqual(DEFAULT_SCHEDULE)
    expect(
      parseSchedule({ days: [5, 9, 1, 1, 'x'], isEnabled: true, time: '25:00' })
    ).toEqual({
      days: [1, 5],
      isEnabled: true,
      time: DEFAULT_SCHEDULE.time,
      withSound: false
    })
  })

  it('[reminders] toggles a day in and out, keeping the week sorted', () => {
    expect(toggleDay(weekdays, 0).days).toEqual([0, 1, 3, 5])
    expect(toggleDay(weekdays, 3).days).toEqual([1, 5])
  })
})
