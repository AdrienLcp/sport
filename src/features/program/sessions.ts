import { BLOCK_1 } from '@programme/program'

import type { Session, SessionId } from './program-types'

const sessionFor = (id: SessionId): Session => {
  const session = BLOCK_1.find((candidate) => candidate.id === id)
  if (session === undefined) {
    throw new Error(`Session ${id} is missing from BLOCK_1`)
  }
  return session
}

/** The programme's sessions by id, whichever programme the build reads. */
export const SESSIONS: Record<SessionId, Session> = {
  A: sessionFor('A'),
  B: sessionFor('B'),
  C: sessionFor('C'),
  D: sessionFor('D'),
  E: sessionFor('E')
}
