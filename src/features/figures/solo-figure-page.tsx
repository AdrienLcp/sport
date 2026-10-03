import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import {
  useFigureParam,
  useMediaSearchParam
} from '@/infrastructure/router/navigation'
import { FigureFrame } from '@/presentation/components/plate'
import { ScreenTitle } from '@/presentation/head/screen-title'
import { useTranslate } from '@/presentation/i18n/i18n-provider'

import { Figure } from './figure'

import './solo-figure-page.sass'

/**
 * In the app the figure settles between plates; here it starts over, because
 * the media it is compared against loop forever and a still frame would lose
 * the argument for the wrong reason.
 */
const RESTART_MS = 8000

const VIDEO = /\.(webm|mp4|ogv|mov)$/i

type SoloMediaProps = {
  /** A path the dev server serves: a video plays muted and looping, anything else is an image. */
  src: string
}

/**
 * A media file in the drawing's place, inside the exact box the figure
 * occupies on the plate. The sound never comes out — the app is used at night
 * in a quiet home.
 */
const SoloMedia: React.FC<SoloMediaProps> = ({ src }) => {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const node = video.current
    if (node === null) return
    node.volume = 0
    node.muted = true
    void node.play().catch(() => undefined)
  }, [])

  if (VIDEO.test(src)) {
    return (
      <video
        autoPlay
        className='media'
        loop
        muted
        playsInline
        ref={video}
        src={src}
      />
    )
  }
  return <img alt='' className='media' src={src} />
}

/**
 * One drawn figure, alone on the ground, so a comparison page can put the
 * drawing beside a GIF or a video and judge them at the same size.
 */
export const SoloFigurePage: React.FC = () => {
  const translate = useTranslate()
  const { figureId, requested } = useFigureParam()
  const media = useMediaSearchParam()
  const [round, setRound] = useState(0)

  useEffect(() => {
    const timer = setInterval(
      () => setRound((current) => current + 1),
      RESTART_MS
    )
    return () => clearInterval(timer)
  }, [])

  if (media !== null) {
    return (
      <FigureFrame className='solo-figure-page'>
        <ScreenTitle screen='figure' />
        <SoloMedia key={media} src={media} />
      </FigureFrame>
    )
  }

  if (figureId === null) {
    return (
      <p className='missing-figure'>
        <ScreenTitle screen='figure' />
        {translate('figure.missing', { id: requested })}
      </p>
    )
  }

  return (
    <FigureFrame className='solo-figure-page'>
      <ScreenTitle screen='figure' />
      <Figure id={figureId} key={round} />
    </FigureFrame>
  )
}
