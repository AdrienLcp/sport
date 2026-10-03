/**
 * A local calendar day as `YYYY-MM-DD`: the key every stored entry, count and
 * measure is filed under. A string because that is what storage and backups
 * hold; `Temporal.PlainDate` is how it is computed with.
 */
export type IsoDay = string

export const plainDayOf = (day: IsoDay): Temporal.PlainDate =>
  Temporal.PlainDate.from(day)

/** `count` days after `day` (before it when negative), as a day again. */
export const addDays = (day: IsoDay, count: number): IsoDay =>
  plainDayOf(day).add({ days: count }).toString()

/** The Monday that opens the calendar week `day` falls in. */
export const mondayOf = (day: IsoDay): IsoDay => {
  const date = plainDayOf(day)
  return date.subtract({ days: date.dayOfWeek - 1 }).toString()
}
