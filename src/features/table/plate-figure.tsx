import type React from 'react'

import './plate-figure.sass'

/*
 * The plate, drawn: half greens, a palm of protein, a fist of starch, a thumb
 * of fat. Keyed by texture rather than colour or a label inside the drawing —
 * the viewBox would rescale any text and the tabular figures would go with it,
 * so the legend under the figure carries every word.
 */

const SECTORS = [
  // Left half, counter-clockwise from the top, so the arc runs through x<100.
  { d: 'M 100 28 A 72 72 0 0 0 100 172 Z', id: 'greens', texture: 'hatch' },
  {
    d: 'M 100 100 L 100 28 A 72 72 0 0 1 172 100 Z',
    id: 'protein',
    texture: 'plain'
  },
  {
    d: 'M 100 100 L 172 100 A 72 72 0 0 1 100 172 Z',
    id: 'starch',
    texture: 'stipple'
  }
] as const

type Texture = (typeof SECTORS)[number]['texture'] | 'drop'

// A drop of oil, tipped over the rim: a tablespoon is not a share of the plate.
const DROP =
  'M 0 -8 C 4.4 -2.4 6.6 0.8 6.6 3.4 A 6.6 6.6 0 0 1 -6.6 3.4 C -6.6 0.8 -4.4 -2.4 0 -8 Z'

type TexturesProps = {
  /** Pattern ids are document-wide: each drawing names its own. */
  prefix: string
}

const Textures: React.FC<TexturesProps> = ({ prefix }) => (
  <defs>
    <pattern
      height='7'
      id={`${prefix}-hatch`}
      patternTransform='rotate(-45)'
      patternUnits='userSpaceOnUse'
      width='7'
    >
      <line
        stroke='var(--rule)'
        strokeWidth='1.4'
        x1='0'
        x2='0'
        y1='0'
        y2='7'
      />
    </pattern>
    <pattern
      height='8'
      id={`${prefix}-stipple`}
      patternUnits='userSpaceOnUse'
      width='8'
    >
      <circle cx='2' cy='2' fill='var(--rule)' r='1.15' />
      <circle cx='6' cy='6' fill='var(--rule)' r='1.15' />
    </pattern>
  </defs>
)

const fillOf = (prefix: string, texture: Texture): string => {
  if (texture === 'hatch') return `url(#${prefix}-hatch)`
  if (texture === 'stipple') return `url(#${prefix}-stipple)`
  return 'none'
}

export const PlateFigure: React.FC = () => (
  <svg aria-hidden='true' className='plate-figure' viewBox='0 0 200 200'>
    <Textures prefix='plate-figure' />

    {SECTORS.map((sector) => (
      <path
        d={sector.d}
        fill={fillOf('plate-figure', sector.texture)}
        key={sector.id}
      />
    ))}

    {/* The rim is what makes this a plate and not a pie chart. */}
    <circle
      cx='100'
      cy='100'
      fill='none'
      r='86'
      stroke='var(--rule)'
      strokeWidth='2'
    />
    <circle
      cx='100'
      cy='100'
      fill='none'
      r='72'
      stroke='var(--rule-mid)'
      strokeWidth='1'
    />

    <g stroke='var(--rule)' strokeLinecap='round' strokeWidth='1.4'>
      <line x1='100' x2='100' y1='28' y2='172' />
      <line x1='100' x2='172' y1='100' y2='100' />
    </g>

    <path d={DROP} fill='var(--fig-prop)' transform='translate(170 32)' />
  </svg>
)

type SwatchProps = {
  /** The share of the plate it keys: `greens`, `protein`, `starch` or `fat`. */
  share: string
}

/** The same mark, at reading size, so the legend keys the drawing. */
export const Swatch: React.FC<SwatchProps> = ({ share }) => {
  const texture: Texture =
    share === 'greens'
      ? 'hatch'
      : share === 'starch'
        ? 'stipple'
        : share === 'fat'
          ? 'drop'
          : 'plain'
  const prefix = `swatch-${share}`

  return (
    <svg aria-hidden='true' className='swatch' viewBox='0 0 26 18'>
      <Textures prefix={prefix} />
      {texture === 'drop' ? (
        <path
          d={DROP}
          fill='var(--fig-prop)'
          transform='translate(13 11) scale(0.8)'
        />
      ) : (
        <rect
          fill={fillOf(prefix, texture)}
          height='16'
          stroke='var(--rule)'
          strokeWidth='1'
          width='24'
          x='1'
          y='1'
        />
      )}
    </svg>
  )
}
