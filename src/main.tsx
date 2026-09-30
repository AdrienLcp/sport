import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import { startServiceWorker } from '@/infrastructure/pwa/app-update'
import { listenForInstallPrompt } from '@/infrastructure/pwa/install-prompt'
import { routes } from '@/infrastructure/router/routes'
import { I18nProvider } from '@/presentation/i18n/i18n-provider'
import { applyInitialLocale } from '@/presentation/i18n/initial-locale'

import '@/presentation/styles/globals.sass'

const container = document.getElementById('root')

if (container === null) {
  throw new Error('Missing #root in index.html')
}

listenForInstallPrompt()
startServiceWorker()
const initialLocale = applyInitialLocale()
const router = createBrowserRouter(routes)

createRoot(container).render(
  <StrictMode>
    <I18nProvider initialLocale={initialLocale}>
      <RouterProvider router={router} />
    </I18nProvider>
  </StrictMode>
)
