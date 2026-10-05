import { useEffect, useState } from 'react'

import { createLatestOnly, type LatestOnly } from '@/helpers/latest-only'

/** A `LatestOnly` that lives as long as the component, and aborts its run on unmount. */
export const useLatestOnly = (): LatestOnly => {
  const [latest] = useState(createLatestOnly)
  useEffect(() => latest.abort, [latest])
  return latest
}
