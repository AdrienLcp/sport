/** Epoch milliseconds, for a timer deadline or a wall-clock stopwatch. */
export const nowMs = (): number => Date.now()

/**
 * The current moment on the device's wall clock, in its time zone. Read
 * through `Date.now()`, which fake timers move, unlike `Temporal.Now`.
 */
export const zonedNow = (): Temporal.ZonedDateTime =>
  Temporal.Instant.fromEpochMilliseconds(nowMs()).toZonedDateTimeISO(
    Temporal.Now.timeZoneId()
  )

/** The device's calendar day. */
export const today = (): Temporal.PlainDate => zonedNow().toPlainDate()
