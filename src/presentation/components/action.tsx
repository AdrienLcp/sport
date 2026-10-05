import type React from 'react'

import { Button } from './button'
import { Link } from './link'

/**
 * `'ghost'` draws the action as an outlined secondary exit; absent, it is the
 * plate's one full-ink action.
 */
type ActionTone = 'ghost'

const classNameOf = (tone: ActionTone | undefined): string =>
  tone === undefined ? 'action' : `action ${tone}`

type ActionButtonProps = {
  isDisabled?: boolean
  label: string
  /** Absent when a wrapper — a file picker — handles the press itself. */
  onPress?: () => void
  tone?: ActionTone
}

/** The plate's full-width action: one target, the widest the plate allows. */
export const ActionButton: React.FC<ActionButtonProps> = ({
  isDisabled,
  label,
  onPress,
  tone
}) => (
  <Button
    className={classNameOf(tone)}
    isDisabled={isDisabled}
    onPress={onPress}
  >
    <span className='action-label'>{label}</span>
  </Button>
)

type ActionLinkProps = {
  /** Built by one of the `…PathFor` helpers in `navigation.ts`. */
  href: string
  label: string
  tone?: ActionTone
}

/** The same action, drawn identically, when pressing it moves to another page. */
export const ActionLink: React.FC<ActionLinkProps> = ({
  href,
  label,
  tone
}) => (
  <Link className={classNameOf(tone)} href={href}>
    <span className='action-label'>{label}</span>
  </Link>
)
