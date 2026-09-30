import type React from 'react'
import { useId, useState } from 'react'

import type {
  Cues,
  Setup,
  Support,
  Tempo
} from '@/features/program/program-types'
import { ToggleButton } from '@/presentation/components/toggle-button'
import { useLocalize, useTranslate } from '@/presentation/i18n/i18n-provider'

import './cue-list.sass'

/**
 * Which stop rule the plate prints: the everyday one, or the calibration
 * evening's exception, the one night the count goes to the end.
 */
export type StopRule = 'calibration' | 'reserve'

type CueListProps = {
  cues: Cues
  /** The step-by-step how-to, one tap behind the cues. */
  setup: Setup
  /** Absent when the figure keeps no rep tempo: a hold, a march, a punch. */
  tempo?: Tempo
  support?: Support
  stop?: StopRule
}

type Line = { readonly term: string; readonly text: string }

/**
 * What the figure cannot say, as a short labelled list under the legend: one
 * question a line, the term in the head band's capitals, the answer in prose.
 * A reader mid-set finds « Souffle » without reading the rest.
 *
 * The full how-to — where to stand, how far, where the rep pauses — sits one
 * tap behind, in the same block: it takes the cues' place rather than pushing
 * the plate longer, so the register and the action never move, and the same
 * thumb that opened it closes it.
 */
export const CueList: React.FC<CueListProps> = ({
  cues,
  setup,
  stop,
  support,
  tempo
}) => {
  const translate = useTranslate()
  const localize = useLocalize()
  const [isDetailed, setIsDetailed] = useState(false)
  const panel = useId()

  const tempoText = (rhythm: Tempo): string => {
    const phases = [
      translate('session.cues.tempo.down', { seconds: String(rhythm.down) }),
      rhythm.bottom > 0
        ? translate('session.cues.tempo.bottom', {
            seconds: String(rhythm.bottom)
          })
        : undefined,
      translate('session.cues.tempo.up', { seconds: String(rhythm.up) }),
      rhythm.top > 0
        ? translate('session.cues.tempo.top', { seconds: String(rhythm.top) })
        : undefined,
      rhythm.bottom === 0 ? translate('session.cues.tempo.noBounce') : undefined
    ].filter((phase) => phase !== undefined)
    return translate('session.cues.tempo.lead', { phases: phases.join(', ') })
  }

  const lines: readonly (Line | undefined)[] = [
    cues.moves && {
      term: translate('session.cues.moves'),
      text: localize(cues.moves)
    },
    cues.still && {
      term: translate('session.cues.still'),
      text: localize(cues.still)
    },
    cues.squeeze && {
      term: translate('session.cues.squeeze'),
      text: localize(cues.squeeze)
    },
    tempo && {
      term: translate('session.cues.tempoTerm'),
      text: tempoText(tempo)
    },
    {
      term: translate('session.cues.breath'),
      text: localize(cues.breath)
    },
    support && {
      term: translate('session.cues.supportTerm'),
      text: translate(
        support === 'wall'
          ? 'session.cues.supportWall'
          : 'session.cues.supportNone'
      )
    },
    stop && {
      term: translate('session.cues.stopTerm'),
      text: translate(
        stop === 'calibration'
          ? 'session.cues.stopCalibration'
          : 'session.cues.stop'
      )
    }
  ]

  return (
    <div className='cue-block'>
      <ToggleButton
        aria-controls={panel}
        aria-expanded={isDetailed}
        className='cue-toggle'
        isSelected={isDetailed}
        onChange={setIsDetailed}
      >
        <span className='label'>
          {translate(
            isDetailed
              ? 'session.cues.detailsClose'
              : 'session.cues.detailsOpen'
          )}
        </span>
        {!isDetailed && (
          <span className='state'>
            {translate('session.cues.detailsSteps', {
              count: String(setup.length)
            })}
          </span>
        )}
      </ToggleButton>

      {isDetailed ? (
        <ol className='setup-steps' id={panel}>
          {setup.map((step) => (
            <li key={step.en}>{localize(step)}</li>
          ))}
        </ol>
      ) : (
        <dl className='cue-list' id={panel}>
          {lines
            .filter((line) => line !== undefined)
            .map((line) => (
              <div className='cue' key={line.term}>
                <dt>{line.term}</dt>
                <dd>{line.text}</dd>
              </div>
            ))}
        </dl>
      )}
    </div>
  )
}
