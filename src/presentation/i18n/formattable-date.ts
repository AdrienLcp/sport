/**
 * `@adrienlcp/i18n` formats a `{x:date}` placeholder from a `Date` only. Every
 * call site hands its Temporal value through here, the one place that turns
 * it into the local `Date` showing the same wall-clock reading; delete it once
 * the library accepts Temporal values.
 */
export const toFormattableDate = (
  value: Temporal.PlainDate | Temporal.PlainDateTime
): Date => {
  const moment =
    value instanceof Temporal.PlainDate ? value.toPlainDateTime() : value
  return new Date(
    moment.year,
    moment.month - 1,
    moment.day,
    moment.hour,
    moment.minute
  )
}
