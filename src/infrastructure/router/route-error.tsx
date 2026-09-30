import type React from 'react'

import { reloadPage } from '@/infrastructure/browser'
import { AppShell } from '@/presentation/app-shell'
import { ErratumPlate } from '@/presentation/erratum-plate'

import { homePathFor, useCurrentPath, useRouteFailure } from './navigation'

/**
 * The root route's error boundary. It replaces the whole root route, so it
 * draws its own shell; without the router's link provider, the way back is a
 * full page load, which is also what clears a half-broken state.
 */
export const ErrorScreen: React.FC = () => {
  const path = useCurrentPath()
  const reason = useRouteFailure()

  return (
    <AppShell>
      <ErratumPlate
        failure={{ kind: 'crash', onReload: reloadPage, reason }}
        homeHref={homePathFor()}
        path={path}
      />
    </AppShell>
  )
}

/** An address no route owns: said plainly, rather than silently rerouted. */
export const NotFoundPage: React.FC = () => (
  <ErratumPlate
    failure={{ kind: 'missing' }}
    homeHref={homePathFor()}
    path={useCurrentPath()}
  />
)
