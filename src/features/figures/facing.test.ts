import { describe, expect, it } from 'vitest'

import type { FigureId } from '@/features/program/program-types'

import { handednessOf, nosePath } from './facing'
import { jointsOf, POSES } from './poses'

const noseTip = (id: FigureId): readonly [number, number] => {
  const pose = POSES[id]
  const joints = jointsOf(pose)
  const side = handednessOf(pose, joints)
  if (side === undefined) throw new Error(`${id} has no front`)
  const [, tipX, tipY] =
    /L(-?[\d.]+) (-?[\d.]+)/.exec(nosePath(joints, side)) ?? []
  return [Number(tipX), Number(tipY)]
}

describe('the front of a profile figure', () => {
  it('points the floor Y-T-W face down', () => {
    const head = POSES.ytw.head ?? [0, 0]
    expect(noseTip('ytw')[1]).toBeGreaterThan(head[1])
  })

  it('points the hollow hold face up', () => {
    const head = POSES.hollow.head ?? [0, 0]
    expect(noseTip('hollow')[1]).toBeLessThan(head[1])
  })

  it('reads a standing figure from the way its foot points', () => {
    const { ankle, head, toe } = POSES['arm-circle']
    const pointsLeft = (toe?.[0] ?? 0) < ankle[0]
    expect(noseTip('arm-circle')[0] < (head?.[0] ?? 0)).toBe(pointsLeft)
  })

  it('leaves a plate seen from the front without one', () => {
    const pose = POSES['external-rotation']
    expect(handednessOf(pose, jointsOf(pose))).toBeUndefined()
  })
})
