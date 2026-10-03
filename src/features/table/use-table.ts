import { warnOnFailure } from '@/infrastructure/diagnostics'
import { readTable, writeTable } from '@/infrastructure/storage/table-storage'

import { EMPTY_TABLE, type Table } from './table-tally'

/** A table that cannot be read opens empty, as the app always has. */
export const readTableOrEmpty = (): Table => {
  const read = readTable()
  warnOnFailure(read, 'The table could not be read')
  return read.status === 'success' ? read.data : EMPTY_TABLE
}

/** A refused write loses the tally, never the plate on screen. */
export const saveTable = (table: Table): void => {
  const written = writeTable(table)
  warnOnFailure(written, 'The table could not be saved')
}
