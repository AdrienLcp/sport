/** The three plates of the table, addressed T-01 to T-03 like movements are. */
export const TABLE_PLATES = ['count', 'pot', 'market'] as const

export type TablePlate = (typeof TABLE_PLATES)[number]

export const parseTablePlate = (value: string): TablePlate | null =>
  TABLE_PLATES.find((plate) => plate === value) ?? null
