import type React from 'react'
import { createElement, Fragment } from 'react'

type RichTextProps = {
  /** What `translate.rich` returned: plain strings and the marked spans. */
  parts: readonly React.ReactNode[]
}

/**
 * Renders the pieces of a rich message as siblings. They are handed over as
 * arguments rather than as an array: a sentence has a fixed order, and an
 * array would make React ask each span for a key it has no honest value for.
 */
export const RichText: React.FC<RichTextProps> = ({ parts }) =>
  createElement(Fragment, null, ...parts)

/** The one span the dictionary marks: `<b>…</b>`. */
export const bold = (children: string): React.ReactNode => <b>{children}</b>
