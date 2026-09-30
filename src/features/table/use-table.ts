import { readTable, writeTable } from '@/infrastructure/storage/table-storage'

import { EMPTY_TABLE, type Table } from './table-tally'

/** A table that cannot be read opens empty, as the app always has. */
export const readTableOrEmpty = (): Table => {
  const read = readTable()
  if (read.status === 'success') return read.data
  console.warn(`The table could not be read (${read.error}).`)
  return EMPTY_TABLE
}

/** A refused write loses the tally, never the plate on screen. */
export const saveTable = (table: Table): void => {
  const written = writeTable(table)
  if (written.status === 'failure') {
    console.warn(`The table could not be saved (${written.error}).`)
  }
}
