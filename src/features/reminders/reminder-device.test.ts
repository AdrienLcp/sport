import 'fake-indexeddb/auto'

import { Result } from '@adrienlcp/result'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  scheduleAhead,
  startPeriodicWake,
  stopPeriodicWake
} from '@/infrastructure/notifications'
import { readDeviceValue } from '@/infrastructure/storage/device-store'

import { saveReminderSchedule } from './reminder-device'
import { DEFAULT_SCHEDULE } from './reminder-schedule'

vi.mock('@/infrastructure/notifications', () => ({
  scheduleAhead: vi.fn(() => Promise.resolve(Result.success())),
  showNotification: vi.fn(),
  startPeriodicWake: vi.fn(() => Promise.resolve(Result.success())),
  stopPeriodicWake: vi.fn(() => Promise.resolve()),
  wakeCapabilities: () => ({
    canScheduleAhead: true,
    canWakePeriodically: true
  })
}))

const copy = { body: 'Time for the session.', title: 'Séance' }
const now = Temporal.ZonedDateTime.from('2026-10-05T08:00[Europe/Paris]')
const schedule = { ...DEFAULT_SCHEDULE, isEnabled: true, time: '18:30' }

afterEach(() => {
  vi.clearAllMocks()
  vi.restoreAllMocks()
})

describe('reminder save', () => {
  it('[reminder-save] hands its signal down to scheduling and to the wake', async () => {
    const controller = new AbortController()

    await saveReminderSchedule({
      copy,
      now,
      schedule,
      signal: controller.signal
    })

    expect(vi.mocked(scheduleAhead)).toHaveBeenCalledWith(
      expect.objectContaining({ signal: controller.signal })
    )
    expect(vi.mocked(startPeriodicWake)).toHaveBeenCalledWith(controller.signal)
  })

  it('[reminder-save] a save aborted before it starts writes nothing and arms nothing', async () => {
    const controller = new AbortController()
    controller.abort()

    await saveReminderSchedule({
      copy,
      now,
      schedule: { ...schedule, time: '06:15' },
      signal: controller.signal
    })

    const stored = await readDeviceValue('reminder-schedule')
    expect(stored.status === 'success' && stored.data).not.toEqual(
      expect.objectContaining({ time: '06:15' })
    )
    expect(vi.mocked(scheduleAhead)).not.toHaveBeenCalled()
    expect(vi.mocked(startPeriodicWake)).not.toHaveBeenCalled()
    expect(vi.mocked(stopPeriodicWake)).not.toHaveBeenCalled()
  })

  it('[reminder-save] a save aborted while scheduling stops before the wake, silently', async () => {
    const controller = new AbortController()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.mocked(scheduleAhead).mockImplementationOnce(() => {
      controller.abort()
      return Promise.resolve(Result.failure('aborted'))
    })

    await saveReminderSchedule({
      copy,
      now,
      schedule,
      signal: controller.signal
    })

    expect(vi.mocked(startPeriodicWake)).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
  })
})
