/** The device's calendar day. */
export const today = (): Temporal.PlainDate => Temporal.Now.plainDateISO()

/** The current moment on the device's wall clock, in its time zone. */
export const zonedNow = (): Temporal.ZonedDateTime =>
  Temporal.Now.zonedDateTimeISO()

/** Epoch milliseconds, for a timer deadline or a wall-clock stopwatch. */
export const nowMs = (): number => Date.now()
