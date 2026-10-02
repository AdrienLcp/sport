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

const inParis = (isoDateTime: string) =>
  Temporal.ZonedDateTime.from(`${isoDateTime}[Europe/Paris]`)

/** 2026-09-29 is a Tuesday. */
const tuesdayAt = (time: string) => inParis(`2026-09-29T${time}`)

describe('reminder schedule', () => {
  it('[reminders] skips to the next chosen day when today is not one', () => {
    expect(nextReminder(weekdays, tuesdayAt('09:00'))?.toString()).toBe(
      inParis('2026-09-30T19:30').toString()
    )
  })

  it('[reminders] rings today when today is chosen and the time is still ahead', () => {
    const wednesdayMorning = inParis('2026-09-30T08:00')
    expect(nextReminder(weekdays, wednesdayMorning)?.toString()).toBe(
      inParis('2026-09-30T19:30').toString()
    )
  })

  it('[reminders] waits a week when the only day chosen has just passed', () => {
    const onlyTuesday = { ...weekdays, days: [2] as const }
    expect(nextReminder(onlyTuesday, tuesdayAt('20:00'))?.toString()).toBe(
      inParis('2026-10-06T19:30').toString()
    )
  })

  it('[reminders] sets nothing while switched off or with no day', () => {
    expect(
      nextReminder({ ...weekdays, isEnabled: false }, tuesdayAt('09:00'))
    ).toBe(null)
    expect(nextReminder({ ...weekdays, days: [] }, tuesdayAt('09:00'))).toBe(
      null
    )
  })

  it('[reminders] hands over every reminder of the coming fortnight, in order', () => {
    const moments = remindersAfter({
      days: 14,
      from: tuesdayAt('09:00'),
      schedule: weekdays
    })
    expect(moments).toHaveLength(6)
    expect(moments.map((moment) => moment.dayOfWeek)).toEqual([
      3, 5, 1, 3, 5, 1
    ])
  })

  it('[reminders] keeps the wall-clock time across the autumn clock change', () => {
    const [beforeChange, afterChange] = remindersAfter({
      days: 3,
      from: inParis('2026-10-24T09:00'),
      schedule: { ...weekdays, days: [6, 1] }
    })
    expect(beforeChange?.toString()).toBe(
      '2026-10-24T19:30:00+02:00[Europe/Paris]'
    )
    expect(afterChange?.toString()).toBe(
      '2026-10-26T19:30:00+01:00[Europe/Paris]'
    )
  })

  it('[reminders] rings a time the spring clock change skips an hour later', () => {
    const [moment] = remindersAfter({
      days: 1,
      from: inParis('2026-03-29T00:00'),
      schedule: { ...weekdays, days: [7], time: '02:30' }
    })
    expect(moment?.toString()).toBe('2026-03-29T03:30:00+02:00[Europe/Paris]')
  })

  it('[reminders] owes the reminder once the time has come on a chosen day', () => {
    const base = {
      lastSessionDay: null,
      lastShownDay: null,
      schedule: { ...weekdays, days: [2] as const }
    }
    expect(isReminderOwed({ ...base, now: tuesdayAt('19:29') })).toBe(false)
    expect(isReminderOwed({ ...base, now: tuesdayAt('19:30') })).toBe(true)
  })

  it('[reminders] stays quiet once shown, or once the session ran', () => {
    const base = {
      lastSessionDay: null,
      lastShownDay: null,
      now: tuesdayAt('21:00'),
      schedule: { ...weekdays, days: [2] as const }
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

  it('[reminders] reads a Sunday an older version saved as 0 as the ISO Sunday', () => {
    expect(parseSchedule({ days: [0, 6, 1] }).days).toEqual([1, 6, 7])
    expect(parseSchedule({ days: [0, 7] }).days).toEqual([7])
  })

  it('[reminders] toggles a day in and out, keeping the week sorted', () => {
    expect(toggleDay(weekdays, 7).days).toEqual([1, 3, 5, 7])
    expect(toggleDay(weekdays, 3).days).toEqual([1, 5])
  })
})
