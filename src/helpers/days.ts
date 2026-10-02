/** The local calendar day, `YYYY-MM-DD`: how every entry is keyed. */
export const isoDay = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** Noon, so a stored day never slides a date across a timezone edge. */
export const dayTime = (day: string): number =>
  new Date(`${day}T12:00:00`).getTime()

export const dateOfDay = (day: string): Date => new Date(dayTime(day))

/** `count` days after `day` (before it when negative), as a day again. */
export const addDays = (day: string, count: number): string => {
  const date = dateOfDay(day)
  return isoDay(
    new Date(date.getFullYear(), date.getMonth(), date.getDate() + count)
  )
}

/** The Monday that opens the calendar week `day` falls in. */
export const mondayOf = (day: string): string =>
  addDays(day, -((dateOfDay(day).getDay() + 6) % 7))

/** The device's calendar day, now. */
export const todayIsoDay = (): string => Temporal.Now.plainDateISO().toString()
